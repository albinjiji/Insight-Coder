/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

// Try primary → fallback
const FALLBACKS = ['gemini-2.5-flash', 'gemini-1.5-flash'] as const;
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

function isOverloaded(e: any) {
  try {
    const code = e?.error?.code ?? e?.code;
    const status = e?.error?.status ?? e?.status;
    if (code === 503 || status === 'UNAVAILABLE') return true;
    const msg = typeof e === 'string' ? e : e?.message;
    return typeof msg === 'string' && (msg.includes('UNAVAILABLE') || msg.includes('503'));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt: string = body?.prompt;
    const preferredModel: string | undefined = body?.model;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Missing or invalid prompt.' }, { status: 400 });
    }

    // preferred first, then fallbacks
    const models = preferredModel
      ? [preferredModel, ...FALLBACKS.filter(m => m !== preferredModel)]
      : [...FALLBACKS];

    for (const model of models) {
      let attempt = 0;
      while (attempt <= 2) {
        try {
          const response = await ai.models.generateContent({ model, contents: prompt });

          // Normalize SDK response shape
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
      // try next model
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
