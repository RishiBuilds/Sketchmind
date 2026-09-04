"use client";

import type { SaveStatus } from "./use-autosave";

const LABELS: Record<Exclude<SaveStatus, "idle">, { text: string; className: string }> = {
  pending: { text: "Unsaved", className: "text-chalk-dim" },
  saving: { text: "Saving…", className: "text-chalk-dim" },
  saved: { text: "Saved", className: "text-marker" },
  error: { text: "Save failed", className: "text-[var(--annotate)]" },
};

export function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") {
    return null;
  }

  const { text, className } = LABELS[status];

  return (
    <span
      role="status"
      aria-live="polite"
      className={`ml-1 border-l border-line pl-2 text-xs ${className}`}
    >
      {text}
    </span>
  );
}