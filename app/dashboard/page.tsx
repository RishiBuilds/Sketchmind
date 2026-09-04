import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

import { listWhiteboards } from "@/lib/db/queries";
import { formatRelativeTime } from "@/lib/utils";

import { DashboardClient } from "./dashboard-client";
import { NewBoardButton } from "./new-board-button";

export const metadata: Metadata = {
  title: "Your boards — SketchMind",
};

export default async function DashboardPage() {
  const { userId } = await auth.protect();
  const boards = await listWhiteboards(userId);
  const now = new Date();

  const boardsWithLabels = boards.map((board) => ({
    ...board,
    updatedLabel: formatRelativeTime(board.updatedAt, now),
  }));

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
      <header className="flex flex-col gap-5 border-b border-[rgba(138,133,122,0.1)] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Your boards
          </h1>
          {boards.length > 0 ? (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-ink/10 px-2 text-xs font-semibold tabular-nums text-ink">
              {boards.length}
            </span>
          ) : null}
        </div>

        {boards.length > 0 ? <NewBoardButton /> : null}
      </header>

      {boards.length === 0 ? (
        <section className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-[rgba(138,133,122,0.15)] px-6 py-20 text-center">
          <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-2xl bg-ink/5">
            <svg
              viewBox="0 0 80 80"
              className="h-16 w-16 text-ink/40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="8" y="8" width="64" height="64" rx="8" strokeDasharray="4 3" opacity="0.5" />
              <rect x="18" y="18" width="16" height="12" rx="3" className="text-ink/50" />
              <circle cx="56" cy="24" r="7" className="text-coral/40" />
              <rect x="20" y="44" width="20" height="10" rx="3" className="text-teal-soft/40" />
              <path d="M34 24h12" strokeDasharray="3 2" className="text-smudge/40" />
              <path d="M40 34v10" strokeDasharray="3 2" className="text-smudge/40" />
              <path d="M56 48l1.2 2.8L60 52l-2.8 1.2L56 56l-1.2-2.8L52 52l2.8-1.2z" className="text-ink/60" strokeWidth="1.2" />
            </svg>
          </div>

          <p className="font-hand text-2xl text-ink/60">start here</p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">
            Create your first whiteboard
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-smudge">
            Open a blank canvas, describe a diagram in plain English, and edit whatever the model
            draws.
          </p>
          <div className="mt-8 flex justify-center">
            <NewBoardButton />
          </div>
        </section>
      ) : (
        <DashboardClient boards={boardsWithLabels} />
      )}
    </main>
  );
}