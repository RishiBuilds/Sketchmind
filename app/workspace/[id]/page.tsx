import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { getWhiteboard } from "@/lib/db/queries";
import { Workspace } from "@/components/workspace";

type WorkspacePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: WorkspacePageProps): Promise<Metadata> {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    return { title: "Workspace — SketchMind" };
  }

  const board = await getWhiteboard(id, userId);

  return {
    title: board ? `${board.title} — SketchMind` : "Workspace — SketchMind",
  };
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const board = await getWhiteboard(id, userId);

  if (!board) {
    notFound();
  }

  return (
    <main className="fixed inset-0 z-50 h-screen w-screen overflow-hidden bg-canvas">
      <Workspace
        boardId={board.id}
        title={board.title}
        initialScene={board.elements}
      />
    </main>
  );
}
