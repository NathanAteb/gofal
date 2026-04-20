/**
 * AI Client — AIOS Intelligence Layer
 *
 * Routes through OpenRouter for access to multiple models.
 * Use cheap models (Kimi, Gemini Flash) for bulk tasks,
 * Claude for reasoning-heavy work.
 */

import OpenAI from "openai";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }
  if (!client) {
    client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "https://gofal.wales",
        "X-Title": "gofal.wales AIOS",
      },
    });
  }
  return client;
}

// Model tiers — route by task complexity
export const MODELS = {
  // Reasoning: briefings, strategic analysis, complex Welsh content
  reasoning: "anthropic/claude-sonnet-4-6",
  // Standard: scoring, outreach emails, descriptions
  standard: "moonshotai/kimi-k2",
  // Bulk: batch descriptions, translations, simple classification
  bulk: "google/gemini-2.5-flash",
  // Cheap: validation, formatting, simple extraction
  cheap: "google/gemini-2.5-flash",
} as const;

export type ModelTier = keyof typeof MODELS;

interface AIRequestOptions {
  prompt: string;
  system?: string;
  model?: string;
  tier?: ModelTier;
  maxTokens?: number;
  temperature?: number;
}

interface AIResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
  costUsd: number;
}

// OpenRouter pricing per 1M tokens (approximate — OR returns actual cost)
const PRICING: Record<string, { input: number; output: number }> = {
  "anthropic/claude-sonnet-4-6": { input: 3.0, output: 15.0 },
  "moonshotai/kimi-k2": { input: 0.6, output: 2.4 },
  "google/gemini-2.5-flash": { input: 0.15, output: 0.6 },
};

function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = PRICING[model] || { input: 1.0, output: 3.0 };
  return (
    (inputTokens * pricing.input) / 1_000_000 +
    (outputTokens * pricing.output) / 1_000_000
  );
}

export async function ask(options: AIRequestOptions): Promise<AIResponse> {
  const {
    prompt,
    system,
    model,
    tier = "standard",
    maxTokens = 1024,
    temperature = 0.3,
  } = options;

  const resolvedModel = model || MODELS[tier];
  const ai = getClient();

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
  if (system) {
    messages.push({ role: "system", content: system });
  }
  messages.push({ role: "user", content: prompt });

  const response = await ai.chat.completions.create({
    model: resolvedModel,
    max_tokens: maxTokens,
    temperature,
    messages,
  });

  const text = response.choices[0]?.message?.content || "";
  const inputTokens = response.usage?.prompt_tokens || 0;
  const outputTokens = response.usage?.completion_tokens || 0;

  return {
    text,
    inputTokens,
    outputTokens,
    model: resolvedModel,
    costUsd: estimateCost(resolvedModel, inputTokens, outputTokens),
  };
}

export async function askJSON<T = Record<string, unknown>>(
  options: AIRequestOptions
): Promise<{ data: T } & Omit<AIResponse, "text">> {
  const response = await ask({
    ...options,
    prompt: options.prompt + "\n\nRespond with valid JSON only. No markdown fences.",
  });

  const jsonMatch = response.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI response did not contain valid JSON");
  }

  const data = JSON.parse(jsonMatch[0]) as T;
  return {
    data,
    inputTokens: response.inputTokens,
    outputTokens: response.outputTokens,
    model: response.model,
    costUsd: response.costUsd,
  };
}
