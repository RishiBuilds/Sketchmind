"use client";

import { useCallback, useState } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

type ExportFormat = "png" | "svg";

type ExportMenuProps = {
  api: ExcalidrawImperativeAPI | null;
};

export function ExportMenu({ api }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (!api) return;

      setExporting(format);

      try {
        const elements = api.getSceneElements();
        const appState = api.getAppState();
        const files = api.getFiles();

        if (elements.length === 0) return;

        const { exportToBlob, exportToSvg } = await import("@excalidraw/excalidraw");

        if (format === "png") {
          const blob = await exportToBlob({
            elements: elements as never,
            appState: {
              ...appState,
              exportWithDarkMode: true,
              exportBackground: true,
            } as never,
            files,
          });

          downloadBlob(blob, "sketchmind-export.png");
        } else {
          const svg = await exportToSvg({
            elements: elements as never,
            appState: {
              ...appState,
              exportWithDarkMode: true,
              exportBackground: true,
            } as never,
            files,
          });

          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(svg);
          const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
          downloadBlob(blob, "sketchmind-export.svg");
        }
      } catch (error) {
        console.error("[export]", error);
      } finally {
        setExporting(null);
        setOpen(false);
      }
    },
    [api],
  );

  if (!api) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        data-tip="Export"
        className="tooltip inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-smudge transition-colors hover:bg-[rgba(138,133,122,0.1)] hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <svg
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 2v8M5 7l3 3 3-3" />
          <path d="M2 11v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2" />
        </svg>
        Export
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 top-full z-50 mt-1.5 min-w-[160px] rounded-xl border border-[rgba(138,133,122,0.15)] bg-[#242320] p-1.5 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8)]"
            role="menu"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => handleExport("png")}
              disabled={exporting !== null}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-chalk transition-colors hover:bg-[rgba(138,133,122,0.1)] disabled:opacity-40"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-smudge" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="12" height="12" rx="2" />
                <circle cx="5.5" cy="5.5" r="1" />
                <path d="M14 10l-3-3-7 7" />
              </svg>
              {exporting === "png" ? "Exporting…" : "Export as PNG"}
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => handleExport("svg")}
              disabled={exporting !== null}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-chalk transition-colors hover:bg-[rgba(138,133,122,0.1)] disabled:opacity-40"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-smudge" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 4l4 4-4 4" />
                <path d="M8 14h6" />
              </svg>
              {exporting === "svg" ? "Exporting…" : "Export as SVG"}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
