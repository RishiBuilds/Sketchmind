import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "./index";
import { type Whiteboard, type WhiteboardScene, whiteboards } from "./schema";

const EMPTY_SCENE: WhiteboardScene = { elements: [], appState: {} };

export type WhiteboardSummary = Omit<Whiteboard, "elements"> & { elementCount: number };

export async function listWhiteboards(userId: string): Promise<WhiteboardSummary[]> {
  return db
    .select({
      id: whiteboards.id,
      userId: whiteboards.userId,
      title: whiteboards.title,
      createdAt: whiteboards.createdAt,
      updatedAt: whiteboards.updatedAt,
      elementCount: sql<number>`
        case when jsonb_typeof(${whiteboards.elements} -> 'elements') = 'array'
          then jsonb_array_length(${whiteboards.elements} -> 'elements')
          else 0
        end
      `.mapWith(Number),
    })
    .from(whiteboards)
    .where(eq(whiteboards.userId, userId))
    .orderBy(desc(whiteboards.updatedAt));
}

export async function getWhiteboard(id: string, userId: string): Promise<Whiteboard | null> {
  const [board] = await db
    .select()
    .from(whiteboards)
    .where(and(eq(whiteboards.id, id), eq(whiteboards.userId, userId)))
    .limit(1);

  return board ?? null;
}

export async function createWhiteboard(
  userId: string,
  { title = "Untitled board", elements = EMPTY_SCENE }: { title?: string; elements?: WhiteboardScene } = {},
): Promise<Whiteboard> {
  const [board] = await db.insert(whiteboards).values({ userId, title, elements }).returning();

  return board;
}

export async function updateWhiteboardScene(
  id: string,
  userId: string,
  elements: WhiteboardScene,
): Promise<Whiteboard | null> {
  const [board] = await db
    .update(whiteboards)
    .set({ elements })
    .where(and(eq(whiteboards.id, id), eq(whiteboards.userId, userId)))
    .returning();

  return board ?? null;
}

export async function renameWhiteboard(
  id: string,
  userId: string,
  title: string,
): Promise<Whiteboard | null> {
  const [board] = await db
    .update(whiteboards)
    .set({ title })
    .where(and(eq(whiteboards.id, id), eq(whiteboards.userId, userId)))
    .returning();

  return board ?? null;
}

export async function deleteWhiteboard(id: string, userId: string): Promise<boolean> {
  const deleted = await db
    .delete(whiteboards)
    .where(and(eq(whiteboards.id, id), eq(whiteboards.userId, userId)))
    .returning({ id: whiteboards.id });

  return deleted.length > 0;
}
