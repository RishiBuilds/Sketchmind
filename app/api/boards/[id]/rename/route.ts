import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { renameWhiteboard } from "@/lib/db/queries";

const MAX_TITLE_LENGTH = 120;

export async function PATCH(
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

  const rawTitle = (body as { title?: unknown } | null)?.title;

  if (typeof rawTitle !== "string" || rawTitle.trim() === "") {
    return NextResponse.json({ error: "Give the board a name." }, { status: 400 });
  }

  const title = rawTitle.trim().replace(/\s+/g, " ").slice(0, MAX_TITLE_LENGTH);

  const board = await renameWhiteboard(id, userId, title);

  if (!board) {
    return NextResponse.json({ error: "Board not found." }, { status: 404 });
  }

  return NextResponse.json({ title: board.title });
}
