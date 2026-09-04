"use client";

import { useRef, useState } from "react";

const MAX_CHARS = 500;

const MODELS = [
  { id: "gemini", label: "Gemini 2.5 Pro", badge: "Default" },
  { id: "gpt-4o", label: "GPT-4o", badge: null },
  { id: "groq", label: "Groq (Llama 3)", badge: "Fast" },
] as const;

type ModelId = (typeof MODELS)[number]["id"];

const EXAMPLES = [
  {
    text: "Microservices architecture",
    icon: (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="1" width="5" height="5" rx="1" />
        <rect x="10" y="1" width="5" height="5" rx="1" />
        <rect x="5.5" y="10" width="5" height="5" rx="1" />
        <path d="M3.5 6v2.5a1 1 0 0 0 1 1h3M12.5 6v2.5a1 1 0 0 1-1 1h-3" />
      </svg>
    ),
  },
  {
    text: "User signup flow with email verification",
    icon: (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="5" r="3" />
        <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" />
      </svg>
    ),
  },
  {
    text: "CI/CD pipeline",
    icon: (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 8h4l2-3 2 6 2-3h4" />
      </svg>
    ),
  },
  {
    text: "Database ER diagram",
    icon: (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="8" cy="4" rx="6" ry="2.5" />
        <path d="M2 4v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V4" />
        <path d="M2 8v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V8" />
      </svg>
    ),
  },
  {
    text: "React component tree",
    icon: (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="2.5" r="1.5" />
        <circle cx="4" cy="8" r="1.5" />
        <circle cx="12" cy="8" r="1.5" />
        <circle cx="4" cy="13.5" r="1.5" />
        <circle cx="12" cy="13.5" r="1.5" />
        <path d="M8 4v1.5L4 6.5M8 4v1.5l4 1M4 9.5v2.5M12 9.5v2.5" />
      </svg>
    ),
  },
];

export type PromptBarProps = {
  onSubmit: (prompt: string) => Promise<void>;
  disabled?: boolean;
};

export function PromptBar({ onSubmit, disabled = false }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "generating">("idle");
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<ModelId>("gemini");
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const busy = status === "generating" || disabled;

  async function submit() {
    const trimmed = prompt.trim();

    if (!trimmed || busy) {
      return;
    }

    setStatus("generating");
    setError(null);

    try {
      await onSubmit(trimmed);
      setPrompt("");
      setAttachedFiles([]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not generate that diagram.");
    } finally {
      setStatus("idle");
    }
  }

  const currentModel = MODELS.find((m) => m.id === model)!;
  const charCount = prompt.length;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-6">
      <div className="pointer-events-auto w-full max-w-2xl">
        {error ? (
          <p
            role="alert"
            className="mb-2 rounded-xl border border-coral/30 bg-[#1e1d1a]/95 px-4 py-2.5 text-sm text-coral shadow-lg backdrop-blur-md"
          >
            {error}
          </p>
        ) : null}

        {!prompt && !busy ? (
          <div className="scrollbar-none mb-3 flex gap-2 overflow-x-auto pb-1">
            {EXAMPLES.map((example) => (
              <button
                key={example.text}
                type="button"
                onClick={() => {
                  setPrompt(example.text);
                  inputRef.current?.focus();
                }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[rgba(138,133,122,0.12)] bg-[#1e1d1a]/90 px-3.5 py-2 text-xs text-smudge shadow-lg backdrop-blur transition-all duration-150 hover:border-ink/40 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {example.icon}
                {example.text}
              </button>
            ))}
          </div>
        ) : null}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          className="relative rounded-2xl border border-[rgba(138,133,122,0.2)] bg-[#1e1d1a]/95 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.95)] backdrop-blur-md transition-colors focus-within:border-ink/60"
        >
          <div className="flex items-end gap-2 px-3 pt-3 pb-2">
            <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center text-ink">
              <svg
                viewBox="0 0 24 24"
                className="h-4.5 w-4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
              </svg>
            </span>

            <label className="sr-only" htmlFor="ai-prompt">
              Describe a diagram
            </label>
            <textarea
              ref={inputRef}
              id="ai-prompt"
              rows={1}
              value={prompt}
              disabled={busy}
              maxLength={MAX_CHARS}
              placeholder="Describe a diagram…"
              onChange={(event) => {
                setPrompt(event.target.value);
                event.target.style.height = "auto";
                event.target.style.height = `${Math.min(event.target.scrollHeight, 140)}px`;
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void submit();
                }
              }}
              className="max-h-35 flex-1 resize-none bg-transparent py-2 text-sm leading-relaxed text-chalk placeholder:text-smudge/60 focus:outline-none disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={busy || !prompt.trim()}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-ink px-4 text-sm font-semibold text-white transition-all duration-150 hover:brightness-110 disabled:opacity-40"
            >
              {status === "generating" ? (
                <>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
                    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  Drawing…
                </>
              ) : (
                "Generate"
              )}
            </button>
          </div>

          {attachedFiles.length > 0 ? (
            <div className="mx-3 mb-2 flex flex-wrap gap-1.5">
              {attachedFiles.map((file) => (
                <span
                  key={file}
                  className="inline-flex items-center gap-1 rounded-lg bg-ink/10 px-2 py-1 text-[11px] text-ink"
                >
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="1" width="12" height="14" rx="1.5" />
                    <path d="M5 8h6M5 11h3" />
                  </svg>
                  {file}
                  <button
                    type="button"
                    onClick={() => setAttachedFiles((prev) => prev.filter((f) => f !== file))}
                    className="ml-0.5 text-smudge hover:text-chalk"
                    aria-label={`Remove ${file}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : null}

          <div className="flex items-center gap-2 border-t border-[rgba(138,133,122,0.1)] px-3 py-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium text-smudge transition-colors hover:bg-[rgba(138,133,122,0.08)] hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
                aria-haspopup="listbox"
                aria-expanded={showModelMenu}
              >
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6l4 4 4-4" />
                </svg>
                {currentModel.label}
              </button>

              {showModelMenu ? (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowModelMenu(false)} />
                  <div className="model-dropdown absolute bottom-full left-0 z-50 mb-2 min-w-[180px] p-1.5" role="listbox">
                    {MODELS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        role="option"
                        aria-selected={model === m.id}
                        onClick={() => {
                          setModel(m.id);
                          setShowModelMenu(false);
                        }}
                        className={`model-option flex w-full items-center justify-between text-left text-chalk ${model === m.id ? "model-option-active" : ""}`}
                      >
                        <span>{m.label}</span>
                        {m.badge ? (
                          <span className="rounded-md bg-ink/15 px-1.5 py-0.5 text-[10px] font-medium text-ink">
                            {m.badge}
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <div className="h-3.5 w-px bg-[rgba(138,133,122,0.12)]" aria-hidden />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              data-tip="Attach reference image"
              className="tooltip inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-smudge transition-colors hover:bg-[rgba(138,133,122,0.08)] hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
              aria-label="Attach reference image"
            >
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
                <path d="M10 2h4v4M14 2 8 8" />
              </svg>
              Attach
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setAttachedFiles((prev) => [...prev, file.name]);
                }
                event.target.value = "";
              }}
            />

            <div className="flex-1" />

            <span
              className={`text-[11px] font-mono tabular-nums transition-colors ${
                charCount > MAX_CHARS * 0.9
                  ? "text-coral"
                  : charCount > 0
                    ? "text-smudge"
                    : "text-smudge/40"
              }`}
              aria-label={`${charCount} of ${MAX_CHARS} characters`}
            >
              {charCount} / {MAX_CHARS}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}