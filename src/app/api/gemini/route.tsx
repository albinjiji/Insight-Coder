import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // New SDK wraps text under `response.output[0].content.parts[0].text` sometimes.
    type GeminiResponse = {
      output?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
          }>;
        };
      }>;
      text?: string;
    };

    const resp = response as unknown as GeminiResponse;
    const text =
      resp.output?.[0]?.content?.parts?.[0]?.text ??
      resp.text ??
      "No response text.";

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    const message =
      error instanceof Error ? error.message : typeof error === "string" ? error : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
