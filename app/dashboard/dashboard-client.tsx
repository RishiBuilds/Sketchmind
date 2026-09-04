"use client";

import { useMemo, useState, type ReactNode } from "react";

import type { WhiteboardSummary } from "@/lib/db/queries";

import { BoardCard } from "./board-card";

type SortMode = "recent" | "alphabetical" | "oldest";

const SORT_OPTIONS: { value: SortMode; label: string; icon: ReactNode }[] = [
  {
    value: "recent",
    label: "Recently edited",
    icon: (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3l2 1.5" />
      </svg>
    ),
  },
  {
    value: "alphabetical",
    label: "Alphabetical",
    icon: (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h4M3 6h3M3 9h2M11 3v10M11 13l-2-2M11 13l2-2" />
      </svg>
    ),
  },
  {
    value: "oldest",
    label: "Oldest first",
    icon: (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 11V8l-2-1.5" />
      </svg>
    ),
  },
];

type DashboardClientProps = {
  boards: (WhiteboardSummary & { updatedLabel: string })[];
};

export function DashboardClient({ boards }: DashboardClientProps) {
  const [sort, setSort] = useState<SortMode>("recent");

  const sorted = useMemo(() => {
    const copy = [...boards];
    switch (sort) {
      case "recent":
        return copy.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      case "alphabetical":
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      case "oldest":
        return copy.sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
      default:
        return copy;
    }
  }, [boards, sort]);

  return (
    <>
      <div className="mt-6 flex items-center gap-2" role="toolbar" aria-label="Sort boards">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSort(option.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              sort === option.value
                ? "sort-pill-active border border-ink/30"
                : "border border-[rgba(138,133,122,0.12)] text-smudge hover:border-[rgba(138,133,122,0.25)] hover:text-chalk"
            }`}
            aria-pressed={sort === option.value}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>

      <section
        aria-label="Saved whiteboards"
        className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {sorted.map((board) => (
          <BoardCard
            key={board.id}
            id={board.id}
            title={board.title}
            elementCount={board.elementCount}
            updatedLabel={board.updatedLabel}
          />
        ))}
      </section>
    </>
  );
}
