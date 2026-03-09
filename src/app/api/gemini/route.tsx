/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

// Try primary → fallback
const FALLBACKS = ['gemini-3-flash-preview', 'gemini-1.5-flash'] as const;
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

function isOverloaded(e: any) {
  try {
    const code = e?.error?.code ?? e?.code;
    const status = e?.error?.status ?? e?.status;
    if (code === 503 || code === 429 || status === 'UNAVAILABLE' || status === 'RESOURCE_EXHAUSTED') return true;

    const msg = typeof e === 'string' ? e : e?.message || '';
    const errorMsg = e?.error?.message || '';
    const combined = (msg + ' ' + errorMsg).toUpperCase();

    return combined.includes('UNAVAILABLE') ||
      combined.includes('503') ||
      combined.includes('OVERLOADED') ||
      combined.includes('BUSY') ||
      combined.includes('LIMIT') ||
      combined.includes('429');
  } catch {
    return false;
  }
}

// ═══ Standard (non-streaming) POST ═══
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const stream = url.searchParams.get('stream') === 'true';

  if (stream) {
    return handleStream(req);
  }

  try {
    const body = await req.json();
    const prompt: string = body?.prompt;
    const preferredModel: string | undefined = body?.model;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Missing or invalid prompt.' }, { status: 400 });
    }

    const models = preferredModel
      ? [preferredModel, ...FALLBACKS.filter(m => m !== preferredModel)]
      : [...FALLBACKS];

    for (const model of models) {
      let attempt = 0;
      while (attempt <= 2) {
        try {
          const response = await ai.models.generateContent({ model, contents: prompt });
          const out: any = response;
          const text =
            out?.output?.[0]?.content?.parts?.[0]?.text ??
            out?.text ??
            'No response text.';
          return NextResponse.json({ text, modelUsed: model }, { status: 200 });
        } catch (err: any) {
          attempt++;
          if (!isOverloaded(err) || attempt > 2) break;
          const delay = Math.min(2000, 400 * 2 ** (attempt - 1));
          await sleep(delay);
        }
      }
    }

    return NextResponse.json(
      { error: 'All models overloaded. Please try again shortly.' },
      { status: 503 }
    );
  } catch (error: any) {
    const message =
      error?.message || 'Unknown server error while contacting Gemini.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ═══ Streaming handler ═══
async function handleStream(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt: string = body?.prompt;
    const preferredModel: string | undefined = body?.model;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Missing or invalid prompt.' }, { status: 400 });
    }

    const models = preferredModel
      ? [preferredModel, ...FALLBACKS.filter(m => m !== preferredModel)]
      : [...FALLBACKS];

    // Try each model until one streams successfully
    for (const model of models) {
      try {
        const streamResponse = await ai.models.generateContentStream({
          model,
          contents: prompt,
        });

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of streamResponse) {
                const text = (chunk as any)?.text ?? '';
                if (text) {
                  // Send as Server-Sent Events format
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text, modelUsed: model })}\n\n`));
                }
              }
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            } catch (err) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`));
              controller.close();
              console.error('Stream error:', err);
            }
          },
        });

        return new Response(readable, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch (err: any) {
        if (!isOverloaded(err)) {
          return NextResponse.json({ error: err?.message || 'Stream failed' }, { status: 500 });
        }
        // Try next model
      }
    }

    return NextResponse.json(
      { error: 'All models overloaded (503). Please try again shortly.' },
      { status: 503 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unknown server error.' },
      { status: 500 }
    );
  }
}
