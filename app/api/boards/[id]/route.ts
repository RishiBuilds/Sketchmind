import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { updateWhiteboardScene } from "@/lib/db/queries";
import type { WhiteboardScene } from "@/lib/db/schema";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const scene = (body as { scene?: unknown } | null)?.scene;

  if (!isScene(scene)) {
    return NextResponse.json({ error: "Expected a scene with an elements array." }, { status: 400 });
  }

  const board = await updateWhiteboardScene(id, userId, scene);

  if (!board) {
    return NextResponse.json({ error: "Board not found." }, { status: 404 });
  }

  return NextResponse.json({ savedAt: board.updatedAt });
}

function isScene(value: unknown): value is WhiteboardScene {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { elements?: unknown }).elements)
  );
}
