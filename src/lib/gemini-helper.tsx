/* eslint-disable @typescript-eslint/no-explicit-any */
export type ModelName = 'gemini-3-flash-preview' | 'gemini-1.5-flash';

const FALLBACKS: ModelName[] = ['gemini-3-flash-preview', 'gemini-1.5-flash'];
const NON_CODE_FALLBACK_MESSAGE =
  "This question doesn't seem related to coding or debugging. InsightCoder helps with programming, debugging, and code learning assistance.";

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

/** Call your Next.js API route (which itself handles retries + fallback). */
export async function postGemini(prompt: string, model: ModelName) {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: any = new Error('Gemini request failed');
    err.data = data;
    throw err;
  }
  return data as { text: string; modelUsed?: string };
}

/** Stream response from the API route via Server-Sent Events. */
export async function streamGemini(
  prompt: string,
  model: ModelName,
  onChunk: (accumulated: string) => void,
): Promise<string> {
  const res = await fetch('/api/gemini?stream=true', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || 'Stream request failed');
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No readable stream');

  const decoder = new TextDecoder();
  let accumulated = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // keep incomplete line in buffer

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') break;

      try {
        const parsed = JSON.parse(payload);
        if (parsed.error) {
          throw new Error(parsed.error);
        }
        if (parsed.text) {
          accumulated += parsed.text;
          onChunk(accumulated);
        }
      } catch (e: any) {
        // If it's an explicit error from the server, propagate it
        if (e.message && (e.message.includes('overloaded') || e.message.includes('503'))) {
          throw e;
        }
        // otherwise skip malformed chunks
      }
    }
  }

  return accumulated || 'No response received.';
}

function isOverloadError(err: unknown): boolean {
  const data: any = (err as any)?.data ?? (err as any);
  const raw = data?.error ?? data?.message ?? data;

  const check = (str: string) => {
    const s = str.toUpperCase();
    return s.includes('503') || s.includes('UNAVAILABLE') || s.includes('OVERLOADED') || s.includes('BUSY') || s.includes('LIMIT') || s.includes('429') || s.includes('RESOURCE_EXHAUSTED');
  };

  if (typeof raw === 'string') return check(raw);

  try {
    const parsed = typeof raw === 'object' ? raw : JSON.parse(raw);
    const code = parsed?.error?.code ?? parsed?.code;
    const status = parsed?.error?.status ?? parsed?.status;
    const msg = parsed?.error?.message ?? parsed?.message ?? '';

    if (code === 503 || code === 429 || status === 'UNAVAILABLE' || status === 'RESOURCE_EXHAUSTED') return true;
    return check(msg);
  } catch {
    return false;
  }
}

/** Retry + fallback client-side (extra safety; server already retries too). */
export async function requestWithRetries(
  prompt: string,
  models: ModelName[] = FALLBACKS,
  retriesPerModel = 1
): Promise<{ text: string; modelUsed: string }> {
  for (const model of models) {
    let attempt = 0;
    while (attempt <= retriesPerModel) {
      try {
        const { text } = await postGemini(prompt, model);
        return { text, modelUsed: model };
      } catch (err) {
        attempt++;
        if (!isOverloadError(err) || attempt > retriesPerModel) break;
        const delay = Math.min(2000, 400 * 2 ** (attempt - 1)) + Math.random() * 200;
        await sleep(delay);
      }
    }
  }
  throw new Error('All models overloaded. Please try again.');
}

/** Lightweight heuristic for “code-related” when classifier fails. */
export function looksCodey(p: string): boolean {
  return /```|`[^`]+`|#include|std::|\b(def|class)\b|\b(console\.log|const|let)\b|\bfunction\b|\bcompile|debug|vector|matrix|array\b/i.test(
    p
  );
}

/** Ask the small model to classify code-related vs not. */
export async function classifyCodeRelated(prompt: string): Promise<boolean> {
  const classificationPrompt = `
    You are a classifier. Answer ONLY "true" or "false".
    Is the following about programming, debugging, code explanation, software development, or learning to code?

    "${prompt}"
    `.trim();

  try {
    const cls = await postGemini(classificationPrompt, 'gemini-1.5-flash');
    const isTrue = cls.text?.toLowerCase().includes('true');
    return isTrue || looksCodey(prompt);
  } catch {
    return looksCodey(prompt);
  }
}

/** Correct typos in technical terms before answering. */
export async function correctPrompt(prompt: string): Promise<string> {
  const correctionPrompt = `
    You are a code-focused prompt corrector.
    - Fix typos of programming terms (APIs, functions, libraries).
    - Preserve intent.
    - Do NOT answer the question.
    - Return ONLY the corrected prompt text.

    Original:
    """${prompt}"""
    `.trim();

  try {
    const correction = await postGemini(correctionPrompt, 'gemini-1.5-flash');
    const fixed = (correction?.text || '').trim();
    return fixed || prompt;
  } catch {
    return prompt;
  }
}

/** Generate the final answer, with fallback if model is overloaded. */
export async function generateAnswerWithFallback(prompt: string): Promise<string> {
  const answerPrompt = `
    You are InsightCoder. Answer the coding question below.
    - If code is requested, provide a minimal, correct, runnable example with proper \`\`\`language fences.
    - Briefly explain the approach and edge cases.
    - **If the question is ambiguous or missing key details, DO NOT guess.**
      Instead, respond with a single line that starts with:
      "Clarify: " followed by ONE concise question asking the user for the missing detail.

    Question:
    """${prompt}"""
    `.trim();

  try {
    const { text } = await requestWithRetries(answerPrompt);
    return (text || '').trim();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // requestWithRetries already tried 2.5 then 1.5
    return 'The AI models are currently busy due to high demand. Please wait a few seconds and try again.';
  }
}

/** If the answer is empty/weak, return a single-line clarifying question. */
export async function clarifyIfNeeded(originalPrompt: string, answer: string): Promise<string> {
  const tooShort = !answer || answer.replace(/[`*\s]/g, '').length < 12;
  const genericFailure = /no response|could not produce|something went wrong|busy\. please try again/i.test(
    answer
  );
  const alreadyClarify = /^\s*Clarify:/i.test(answer);

  if (!tooShort && !genericFailure && !alreadyClarify) return answer;

  const askClarifyPrompt = `
    Analyze the user's question and produce ONE concise clarifying question needed to answer it well.
    Return ONLY the clarifying question, no preface.

    User's question:
    """${originalPrompt}"""
    `.trim();

  try {
    const q = await postGemini(askClarifyPrompt, 'gemini-1.5-flash');
    const follow = (q.text || '').trim();
    return follow ? `Clarify: ${follow}` : 'Clarify: Could you specify exactly what you want (e.g., language, data shape, or expected output)?';
  } catch {
    return 'Clarify: Could you specify exactly what you want (e.g., language, data shape, or expected output)?';
  }
}

/** High-level pipeline: classify → (correct → answer → clarify) | fallback text */
export async function answerCodingPromptOrFallback(userPrompt: string): Promise<string> {
  const codey = await classifyCodeRelated(userPrompt);
  if (!codey) return NON_CODE_FALLBACK_MESSAGE;

  const fixed = await correctPrompt(userPrompt);
  const rawAnswer = await generateAnswerWithFallback(fixed);
  const finalAnswer = await clarifyIfNeeded(fixed, rawAnswer);
  return finalAnswer;
}

// Tiny, generic clarify normalizer (keep near the component)
export const normalizeClarifyAnswerSimple = (question: string, userReply: string): string => {
  const a = userReply.trim().toLowerCase();

  if (/^(yes|y|yeah|yep|sure)$/i.test(a)) {
    return `Yes. Please proceed accordingly to: ${question.replace(/^\s*Clarify:\s*/i, '')}`;
  }
  if (/^(no|n|nope)$/i.test(a)) {
    return `No. Please avoid the option implied in: ${question.replace(/^\s*Clarify:\s*/i, '')}`;
  }
  if (/^(either|any|you decide|idk|i don'?t know|not sure)$/i.test(a)) {
    return `Either is fine. Please choose the most idiomatic/standard approach.`;
  }

  // default: echo verbatim so the model can proceed
  return `My answer to your clarification is: "${userReply.trim()}". Please proceed accordingly.`;
};

