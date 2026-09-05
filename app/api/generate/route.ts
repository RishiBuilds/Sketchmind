import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import {
  LlmConfigError,
  LlmUnusableOutputError,
  LlmUpstreamError,
  generateMermaid,
} from "@/lib/ai/provider";

const MAX_PROMPT_LENGTH = 1000;

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Sign in to generate diagrams." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const prompt = typeof body === "object" && body !== null ? (body as { prompt?: unknown }).prompt : undefined;

  if (typeof prompt !== "string" || prompt.trim() === "") {
    return NextResponse.json({ error: "Describe the diagram you want." }, { status: 400 });
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json(
      { error: `Keep the description under ${MAX_PROMPT_LENGTH} characters.` },
      { status: 400 },
    );
  }

  try {
    const mermaid = await generateMermaid(prompt.trim());

    return NextResponse.json({ mermaid });
  } catch (cause) {
    if (cause instanceof LlmConfigError) {
      console.error("[ai]", cause.message);
      return NextResponse.json({ error: "AI generation is not configured." }, { status: 503 });
    }

    if (cause instanceof LlmUnusableOutputError) {
      return NextResponse.json({ error: cause.message }, { status: 422 });
    }

    if (cause instanceof LlmUpstreamError) {
      return NextResponse.json({ error: cause.message }, { status: 502 });
    }

    console.error("[ai] unexpected failure", cause);
    return NextResponse.json({ error: "Something went wrong generating that." }, { status: 500 });
  }
}