"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

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
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const trimmed = search.trim().toLowerCase();
    if (!trimmed) return boards;
    return boards.filter((b) => b.title.toLowerCase().includes(trimmed));
  }, [boards, search]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
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
  }, [filtered, sort]);

  return (
    <>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-smudge">
            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="m10.5 10.5 3 3" />
            </svg>
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search boards…"
            className="w-full rounded-xl border border-[rgba(138,133,122,0.15)] bg-[#1e1d1a]/80 py-2 pl-9 pr-14 text-xs text-chalk placeholder:text-smudge/60 outline-none transition-all duration-150 focus:border-ink/50 focus:bg-[#1e1d1a] focus:ring-1 focus:ring-ink/20"
          />

          {search ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                searchInputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-smudge hover:text-chalk"
              aria-label="Clear search"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          ) : (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <kbd className="rounded border border-[rgba(138,133,122,0.15)] bg-slate-charcoal px-1.5 py-0.5 text-[10px] font-medium text-smudge/70">
                ⌘K
              </kbd>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2" role="toolbar" aria-label="Sort boards">
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
      </div>

      {sorted.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(138,133,122,0.15)] py-16 text-center">
          <p className="font-hand text-xl text-ink/60">nothing found</p>
          <p className="mt-2 text-sm text-smudge">
            No boards match &ldquo;{search}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[rgba(138,133,122,0.2)] px-3 py-1.5 text-xs font-medium text-chalk transition-colors hover:border-ink/40 hover:text-ink"
          >
            Clear search
          </button>
        </div>
      ) : (
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
      )}
    </>
  );
}
