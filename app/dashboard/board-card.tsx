"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { deleteBoardAction, renameBoardAction } from "./actions";

type BoardCardProps = {
  id: string;
  title: string;
  elementCount: number;
  updatedLabel: string;
};

type Mode = "idle" | "rename" | "confirm-delete";

export function BoardCard({ id, title, elementCount, updatedLabel }: BoardCardProps) {
  const [mode, setMode] = useState<Mode>("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (mode === "rename") {
      inputRef.current?.select();
    }
  }, [mode]);

  function close() {
    setMode("idle");
    setError(null);
  }

  function submitRename(nextTitle: string) {
    if (nextTitle.trim() === title) {
      close();
      return;
    }

    startTransition(async () => {
      const result = await renameBoardAction(id, nextTitle);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      close();
      router.refresh();
    });
  }

  function confirmDelete() {
    startTransition(async () => {
      const result = await deleteBoardAction(id);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl card-hairline bg-[#1e1d1a] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_-8px_rgba(0,0,0,0.5)] focus-within:ring-2 focus-within:ring-ink focus-within:ring-offset-2 focus-within:ring-offset-canvas"
      data-busy={pending || undefined}
    >
      <div className="relative h-40 overflow-hidden">
        <Link
          href={`/workspace/${id}`}
          aria-label={`Open ${title}`}
          className="dot-grid flex h-full w-full items-center justify-center bg-[#1a1917] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink"
        >
          {elementCount > 0 ? (
            <span className="font-hand text-2xl text-ink/70">
              {elementCount} {elementCount === 1 ? "shape" : "shapes"}
            </span>
          ) : (
            <span className="font-hand text-2xl text-smudge/50">empty canvas</span>
          )}
        </Link>

        <div className="overlay-gradient pointer-events-none absolute inset-0 flex flex-col justify-end p-3.5 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
          <p className="truncate font-display text-sm font-semibold text-chalk">{title}</p>
          <p className="mt-0.5 text-[11px] text-smudge">Edited {updatedLabel}</p>

          <div className="mt-2.5 flex items-center gap-1.5">
            <Link
              href={`/workspace/${id}`}
              data-tip="Open"
              className="tooltip grid h-7 w-7 place-items-center rounded-lg bg-ink/15 text-ink transition-colors hover:bg-ink/25 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
              aria-label="Open board"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3H3v10h10v-3" />
                <path d="M10 2h4v4M14 2 7 9" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={() => setMode("rename")}
              data-tip="Rename"
              className="tooltip grid h-7 w-7 place-items-center rounded-lg bg-[rgba(138,133,122,0.1)] text-smudge transition-colors hover:bg-[rgba(138,133,122,0.18)] hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
              aria-label="Rename board"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M11.5 2.5a1.91 1.91 0 0 1 2.7 2.7L5.8 13.6 2 14.5l.9-3.8z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setMode("confirm-delete")}
              data-tip="Delete"
              className="tooltip grid h-7 w-7 place-items-center rounded-lg bg-[rgba(138,133,122,0.1)] text-smudge transition-colors hover:bg-[rgba(232,115,74,0.15)] hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
              aria-label="Delete board"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 4.5h11M5.5 4.5V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.5M6.5 7v4M9.5 7v4M3.5 4.5l.7 8.4a1 1 0 0 0 1 .9h5.6a1 1 0 0 0 1-.9l.7-8.4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {mode === "rename" ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitRename(new FormData(event.currentTarget).get("title") as string);
            }}
          >
            <label className="sr-only" htmlFor={`rename-${id}`}>
              Board name
            </label>
            <input
              ref={inputRef}
              id={`rename-${id}`}
              name="title"
              defaultValue={title}
              maxLength={120}
              autoFocus
              disabled={pending}
              onKeyDown={(event) => {
                if (event.key === "Escape") close();
              }}
              className="w-full rounded-lg border border-[rgba(138,133,122,0.25)] bg-[#151412] px-3 py-2 font-display text-sm font-semibold text-chalk outline-none transition-colors focus:border-ink disabled:opacity-60"
            />
            <div className="mt-2 flex gap-2">
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white transition-opacity disabled:opacity-60"
              >
                {pending ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={close}
                disabled={pending}
                className="rounded-lg px-3 py-1.5 text-xs text-smudge transition-colors hover:text-chalk"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : mode === "confirm-delete" ? (
          <div>
            <p className="font-display text-sm font-semibold text-chalk">Delete this board?</p>
            <p className="mt-1 text-xs text-smudge">
              &ldquo;{title}&rdquo; and everything on it. This cannot be undone.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={confirmDelete}
                disabled={pending}
                className="rounded-lg bg-coral px-3 py-1.5 text-xs font-semibold text-white transition-opacity disabled:opacity-60"
              >
                {pending ? "Deleting…" : "Delete"}
              </button>
              <button
                type="button"
                onClick={close}
                disabled={pending}
                className="rounded-lg px-3 py-1.5 text-xs text-smudge transition-colors hover:text-chalk"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="min-w-0">
              <h3 className="truncate font-display text-[15px] font-semibold tracking-tight text-chalk">
                <Link
                  href={`/workspace/${id}`}
                  className="outline-none after:absolute after:inset-x-0 after:bottom-0 after:top-40 after:content-[''] focus-visible:underline"
                >
                  {title}
                </Link>
              </h3>
              <p className="mt-1 text-[11px] text-smudge">Edited {updatedLabel}</p>
            </div>
          </>
        )}

        {error ? (
          <p role="alert" className="relative z-10 text-xs text-coral">
            {error}
          </p>
        ) : null}
      </div>
    </article>
  );
}