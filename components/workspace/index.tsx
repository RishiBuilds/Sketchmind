"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

import type { WhiteboardScene } from "@/lib/db/schema";

import { applyMermaidToCanvas } from "./apply-mermaid";
import { PromptBar } from "./prompt-bar";
import { SaveIndicator } from "./save-indicator";
import { useAutosave } from "./use-autosave";
import { ZoomControls } from "./zoom-controls";

const ExcalidrawCanvas = dynamic(() => import("./excalidraw-canvas"), {
  ssr: false,
  loading: () => (
    <div className="dot-grid flex h-full items-center justify-center">
      <p className="font-hand text-2xl text-smudge/60">unrolling the canvas…</p>
    </div>
  ),
});

type WorkspaceProps = {
  boardId: string;
  title: string;
  initialScene: WhiteboardScene;
};

export function Workspace({ boardId, title, initialScene }: WorkspaceProps) {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const [ready, setReady] = useState(false);
  const { status, handleChange } = useAutosave(boardId);

  const handleApiReady = useCallback((api: ExcalidrawImperativeAPI) => {
    apiRef.current = api;
    setReady(true);
  }, []);

  const handleGenerate = useCallback(async (prompt: string) => {
    const api = apiRef.current;

    if (!api) {
      throw new Error("Canvas is still loading — try again in a moment.");
    }

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { mermaid?: string; error?: string }
      | null;

    if (!response.ok) {
      throw new Error(payload?.error ?? "Could not generate that diagram.");
    }

    if (!payload?.mermaid) {
      throw new Error("The model returned an empty diagram.");
    }

    await applyMermaidToCanvas(api, payload.mermaid);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <ExcalidrawCanvas
        initialScene={initialScene}
        onApiReady={handleApiReady}
        onSceneChange={handleChange}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-3">
        <div className="pointer-events-auto hidden items-center gap-2 rounded-xl border border-[rgba(138,133,122,0.15)] bg-[#1e1d1a]/95 px-3 py-2 shadow-lg backdrop-blur-md sm:flex">
          <Link
            href="/dashboard"
            aria-label="Back to your boards"
            data-tip="Dashboard"
            className="tooltip grid h-6 w-6 place-items-center rounded-md text-smudge transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="m11 18-6-6 6-6" />
            </svg>
          </Link>
          <div className="h-4 w-px bg-[rgba(138,133,122,0.15)]" aria-hidden />
          <span className="max-w-50 truncate font-display text-sm font-semibold text-chalk">
            {title}
          </span>
          <SaveIndicator status={status} />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-4 z-10">
        <ZoomControls api={apiRef.current} />
      </div>

      <PromptBar onSubmit={handleGenerate} disabled={!ready} />
    </div>
  );
}
