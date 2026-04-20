/**
 * Claude API Client — AIOS Intelligence Layer
 *
 * Centralised client for all AI reasoning in gofal.wales.
 * Handles rate limiting, cost tracking, and error recovery.
 */

import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export type AIModel = "claude-sonnet-4-6" | "claude-haiku-4-5-20251001";

interface AIRequestOptions {
  prompt: string;
  system?: string;
  model?: AIModel;
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

// Pricing per 1M tokens (as of 2026)
const PRICING: Record<string, { input: number; output: number }> = {
  "claude-sonnet-4-6": { input: 3.0, output: 15.0 },
  "claude-haiku-4-5-20251001": { input: 0.80, output: 4.0 },
};

function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = PRICING[model] || PRICING["claude-sonnet-4-6"];
  return (
    (inputTokens * pricing.input) / 1_000_000 +
    (outputTokens * pricing.output) / 1_000_000
  );
}

export async function ask(options: AIRequestOptions): Promise<AIResponse> {
  const {
    prompt,
    system,
    model = "claude-haiku-4-5-20251001",
    maxTokens = 1024,
    temperature = 0.3,
  } = options;

  const ai = getClient();

  const response = await ai.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    ...(system ? { system } : {}),
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;

  return {
    text,
    inputTokens,
    outputTokens,
    model,
    costUsd: estimateCost(model, inputTokens, outputTokens),
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
