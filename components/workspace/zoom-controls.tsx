"use client";

import { useCallback, useEffect, useState } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

type ZoomControlsProps = {
  api: ExcalidrawImperativeAPI | null;
};

export function ZoomControls({ api }: ZoomControlsProps) {
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      const appState = api.getAppState();
      if (appState?.zoom?.value) {
        setZoom(Math.round(appState.zoom.value * 100));
      }
    }, 300);

    return () => clearInterval(interval);
  }, [api]);

  const updateZoom = useCallback(
    (newZoom: number) => {
      if (!api) return;
      const clamped = Math.max(10, Math.min(500, newZoom));
      api.updateScene({
        appState: { zoom: { value: clamped / 100 } },
      } as never);
      setZoom(clamped);
    },
    [api],
  );

  const fitToScreen = useCallback(() => {
    if (!api) return;
    const elements = api.getSceneElements();
    if (elements.length > 0) {
      api.scrollToContent(elements as never, { fitToContent: true, animate: true });
    }
  }, [api]);

  const resetZoom = useCallback(() => {
    updateZoom(100);
  }, [updateZoom]);

  if (!api) return null;

  return (
    <div className="pointer-events-auto flex items-center gap-0.5 rounded-xl border border-[rgba(138,133,122,0.15)] bg-[#1e1d1a]/95 px-1.5 py-1 shadow-lg backdrop-blur-md">
      <button
        type="button"
        onClick={() => updateZoom(zoom - 10)}
        data-tip="Zoom out"
        className="tooltip grid h-7 w-7 place-items-center rounded-lg text-smudge transition-colors hover:bg-[rgba(138,133,122,0.1)] hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
        aria-label="Zoom out"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 8h8" />
        </svg>
      </button>

      <button
        type="button"
        onClick={resetZoom}
        data-tip="Reset to 100%"
        className="tooltip min-w-[3.2rem] rounded-lg px-1.5 py-1 text-center font-mono text-[11px] font-medium text-chalk transition-colors hover:bg-[rgba(138,133,122,0.1)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
        aria-label={`Current zoom ${zoom}%, click to reset`}
      >
        {zoom}%
      </button>

      <button
        type="button"
        onClick={() => updateZoom(zoom + 10)}
        data-tip="Zoom in"
        className="tooltip grid h-7 w-7 place-items-center rounded-lg text-smudge transition-colors hover:bg-[rgba(138,133,122,0.1)] hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
        aria-label="Zoom in"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M8 4v8M4 8h8" />
        </svg>
      </button>

      <div className="mx-0.5 h-4 w-px bg-[rgba(138,133,122,0.15)]" aria-hidden />
      <button
        type="button"
        onClick={fitToScreen}
        data-tip="Fit to screen"
        className="tooltip grid h-7 w-7 place-items-center rounded-lg text-smudge transition-colors hover:bg-[rgba(138,133,122,0.1)] hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
        aria-label="Fit to screen"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />
        </svg>
      </button>
    </div>
  );
}
