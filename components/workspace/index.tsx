"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

import type { WhiteboardScene } from "@/lib/db/schema";

import { applyMermaidToCanvas } from "./apply-mermaid";
import { EditableTitle } from "./editable-title";
import { ExportMenu } from "./export-menu";
import { PromptBar } from "./prompt-bar";
import { PromptHistory, type HistoryEntry } from "./prompt-history";
import { SaveIndicator } from "./save-indicator";
import { useAutosave } from "./use-autosave";

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
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
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

    setHistory((prev) => [
      { prompt, mermaid: payload.mermaid!, timestamp: Date.now() },
      ...prev,
    ]);
  }, []);

  const handleReapply = useCallback(async (mermaid: string) => {
    const api = apiRef.current;
    if (!api) return;
    await applyMermaidToCanvas(api, mermaid);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <ExcalidrawCanvas
        initialScene={initialScene}
        onApiReady={handleApiReady}
        onSceneChange={handleChange}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start gap-3 p-3">
        <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-[rgba(138,133,122,0.15)] bg-[#1e1d1a]/95 px-3 py-2 shadow-lg backdrop-blur-md">
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
          <EditableTitle boardId={boardId} initialTitle={title} />
          <SaveIndicator status={status} />
          <div className="h-4 w-px bg-[rgba(138,133,122,0.15)]" aria-hidden />
          <ExportMenu api={apiRef.current} />
          <div className="h-4 w-px bg-[rgba(138,133,122,0.15)]" aria-hidden />
          <button
            type="button"
            onClick={() => setHistoryOpen(!historyOpen)}
            data-tip="Prompt history"
            className="tooltip relative inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium text-smudge transition-colors hover:bg-[rgba(138,133,122,0.1)] hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
            aria-label="Toggle prompt history"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            History
            {history.length > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-bold text-slate">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <PromptBar onSubmit={handleGenerate} disabled={!ready} />

      <PromptHistory
        entries={history}
        onReapply={handleReapply}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}
