"use client";

import { useState } from "react";

export type HistoryEntry = {
  prompt: string;
  mermaid: string;
  timestamp: number;
};

type PromptHistoryProps = {
  entries: HistoryEntry[];
  onReapply: (mermaid: string) => void;
  open: boolean;
  onClose: () => void;
};

export function PromptHistory({ entries, onReapply, open, onClose }: PromptHistoryProps) {
  const [reapplying, setReapplying] = useState<number | null>(null);

  if (!open) {
    return null;
  }

  async function handleReapply(entry: HistoryEntry, index: number) {
    setReapplying(index);

    try {
      onReapply(entry.mermaid);
    } finally {
      setTimeout(() => setReapplying(null), 600);
    }
  }

  function formatTime(ts: number): string {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-[rgba(138,133,122,0.15)] bg-[#1e1d1a]/98 shadow-2xl backdrop-blur-md sm:max-w-[360px]">
        <header className="flex items-center justify-between border-b border-[rgba(138,133,122,0.1)] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <svg
              viewBox="0 0 24 24"
              className="h-4.5 w-4.5 text-ink"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <h2 className="font-display text-sm font-semibold text-chalk">Prompt History</h2>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink/10 px-1.5 text-[10px] font-semibold tabular-nums text-ink">
              {entries.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-lg text-smudge transition-colors hover:bg-[rgba(138,133,122,0.1)] hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
            aria-label="Close history"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-none">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-ink/5">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-ink/30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
                </svg>
              </div>
              <p className="font-hand text-lg text-smudge/60">no prompts yet</p>
              <p className="mt-2 max-w-[200px] text-xs leading-relaxed text-smudge/40">
                Generate a diagram and it&apos;ll show up here
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[rgba(138,133,122,0.08)]">
              {entries.map((entry, index) => (
                <li key={entry.timestamp} className="group px-5 py-4 transition-colors hover:bg-[rgba(138,133,122,0.04)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-relaxed text-chalk">{entry.prompt}</p>
                      <p className="mt-1.5 text-[11px] text-smudge">{formatTime(entry.timestamp)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleReapply(entry, index)}
                      disabled={reapplying !== null}
                      className="mt-0.5 shrink-0 rounded-lg bg-ink/10 px-2.5 py-1.5 text-[11px] font-semibold text-ink opacity-0 transition-all duration-150 hover:bg-ink/20 group-hover:opacity-100 disabled:opacity-40 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
                      aria-label={`Re-apply: ${entry.prompt}`}
                    >
                      {reapplying === index ? (
                        <span className="flex items-center gap-1">
                          <svg viewBox="0 0 16 16" className="h-3 w-3 animate-spin" fill="none">
                            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.8" opacity="0.25" />
                            <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                          Applying…
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 8a6 6 0 0 1 10.3-4.1" />
                            <path d="M14 2v4h-4" />
                            <path d="M14 8a6 6 0 0 1-10.3 4.1" />
                            <path d="M2 14v-4h4" />
                          </svg>
                          Re-apply
                        </span>
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
