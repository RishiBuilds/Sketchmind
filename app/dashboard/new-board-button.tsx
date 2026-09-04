"use client";

import { useTransition } from "react";

import { createBoardAction } from "./actions";

export function NewBoardButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => createBoardAction())}
      className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-ink px-6 text-sm font-semibold text-white shadow-[0_0_0_0_rgba(74,108,247,0)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_20px_4px_rgba(74,108,247,0.2)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink disabled:opacity-60"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4.5 w-4.5 transition-transform duration-200 group-hover:rotate-90"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
      {pending ? "Creating…" : "New board"}
    </button>
  );
}