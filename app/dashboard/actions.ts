"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { createWhiteboard, deleteWhiteboard, renameWhiteboard } from "@/lib/db/queries";

export type ActionResult = { ok: true } | { ok: false; error: string };

const MAX_TITLE_LENGTH = 120;

async function requireUserId(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return userId;
}

function normalizeTitle(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").slice(0, MAX_TITLE_LENGTH);
}

export async function createBoardAction(): Promise<never> {
  const userId = await requireUserId();
  const board = await createWhiteboard(userId);

  revalidatePath("/dashboard");
  redirect(`/workspace/${board.id}`);
}

export async function renameBoardAction(id: string, title: string): Promise<ActionResult> {
  const userId = await requireUserId();
  const nextTitle = normalizeTitle(title);

  if (!nextTitle) {
    return { ok: false, error: "Give the board a name." };
  }

  const board = await renameWhiteboard(id, userId, nextTitle);

  if (!board) {
    return { ok: false, error: "That board no longer exists." };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteBoardAction(id: string): Promise<ActionResult> {
  const userId = await requireUserId();
  const deleted = await deleteWhiteboard(id, userId);

  if (!deleted) {
    return { ok: false, error: "That board no longer exists." };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}