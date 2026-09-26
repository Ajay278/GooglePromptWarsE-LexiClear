import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
];

// Server-side GoogleGenAI client singleton
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Robust JSON parser capable of extracting JSON from markdown code blocks or trailing prose
 */
export function safeParseJson<T = unknown>(text: string): T {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch (initialErr) {
    // Attempt to extract JSON between first '{' or '[' and last '}' or ']'
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const extracted = cleaned.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(extracted) as T;
      } catch {
        // Fall through
      }
    }

    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      const extracted = cleaned.substring(firstBracket, lastBracket + 1);
      try {
        return JSON.parse(extracted) as T;
      } catch {
        // Fall through
      }
    }

    throw initialErr;
  }
}

export interface ModelFallbackParams {
  contents: string;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
}

/**
 * Deterministic Gemini generation with fallback candidate models and retry resilience
 */
export async function generateWithModelFallback(params: ModelFallbackParams): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY environment variable is not configured. Please set GEMINI_API_KEY in your .env file or deployment secrets.'
    );
  }

  let lastError: unknown = null;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: {
            temperature: params.temperature ?? 0.1,
            systemInstruction: params.systemInstruction,
            responseMimeType: params.responseMimeType,
          },
        });

        if (response.text) {
          return response.text;
        }
      } catch (err: unknown) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[Gemini Fallback] Model ${model} attempt ${attempt} failed: ${msg}`);
        // Brief exponential backoff before retry
        await new Promise((r) => setTimeout(r, 200 * attempt));
      }
    }
  }

  const finalMsg = lastError instanceof Error ? lastError.message : 'Unknown error';
  throw new Error(`All candidate Gemini models failed. Last error: ${finalMsg}`);
}
