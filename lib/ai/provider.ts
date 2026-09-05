import "server-only";

import { SYSTEM_PROMPT, buildUserPrompt, sanitizeMermaid } from "./mermaid";

const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";

const DEFAULT_MODELS = [
  "minimax/minimax-m2.7:free",
  "z-ai/glm-5.2:free",
  "google/gemma-4-31b-it:free",
];

const REQUEST_TIMEOUT_MS = 25_000;

const FAILOVER_STATUSES = new Set([402, 408, 409, 429, 500, 502, 503, 504]);

export class LlmConfigError extends Error {}
export class LlmUpstreamError extends Error {}
export class LlmUnusableOutputError extends Error {}

type ChatCompletion = {
  choices?: { message?: { content?: string } }[];
};

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function readConfig() {
  const apiKey = readEnv("LLM_API_KEY");

  if (!apiKey) {
    throw new LlmConfigError(
      "LLM_API_KEY is not set. Add a provider key to .env to enable AI generation.",
    );
  }

  const baseUrl = (readEnv("LLM_BASE_URL") ?? DEFAULT_BASE_URL).replace(/\/$/, "");

  if (!/^https?:\/\//i.test(baseUrl)) {
    throw new LlmConfigError(
      `LLM_BASE_URL must be an absolute http(s) URL, got "${baseUrl}".`,
    );
  }

  const configured = readEnv("LLM_MODEL")
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return { apiKey, baseUrl, models: configured?.length ? configured : DEFAULT_MODELS };
}

function attributionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const siteUrl = readEnv("LLM_SITE_URL");
  const siteName = readEnv("LLM_SITE_NAME");

  if (siteUrl) {
    headers["HTTP-Referer"] = siteUrl;
  }

  if (siteName) {
    headers["X-OpenRouter-Title"] = siteName;
  }

  return headers;
}

export async function generateMermaid(prompt: string): Promise<string> {
  const { apiKey, baseUrl, models } = readConfig();

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(prompt) },
  ];

  let lastError: Error = new LlmUpstreamError("Could not reach the model provider.");

  for (const model of models) {
    let response: Response;

    try {
      response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          ...attributionHeaders(),
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_completion_tokens: 1200,
          messages,
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (cause) {
 
      console.error(`[ai] request to ${baseUrl} (${model}) failed:`, cause);

      const timedOut = cause instanceof Error && cause.name === "TimeoutError";
      lastError = new LlmUpstreamError(
        timedOut ? "The model took too long to respond." : "Could not reach the model provider.",
      );
      continue;
    }

    if (!response.ok) {

      console.error(`[ai] ${model} responded ${response.status} ${response.statusText}`);

      lastError = new LlmUpstreamError(
        response.status === 429
          ? "Every configured model is busy right now. Try again in a moment."
          : "The model provider returned an error.",
      );

      if (FAILOVER_STATUSES.has(response.status)) {
        continue;
      }

      throw lastError;
    }

    const payload = (await response.json()) as ChatCompletion;
    const mermaid = sanitizeMermaid(payload.choices?.[0]?.message?.content ?? "");

    if (mermaid) {
      return mermaid;
    }

    console.error(`[ai] ${model} returned no usable diagram`);
    lastError = new LlmUnusableOutputError(
      "The model did not return a usable diagram. Try rephrasing.",
    );
  }

  throw lastError;
}