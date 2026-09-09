"use client";

import { useEffect, useRef, useState } from "react";

type EditableTitleProps = {
  boardId: string;
  initialTitle: string;
};

export function EditableTitle({ boardId, initialTitle }: EditableTitleProps) {
  const [title, setTitle] = useState(initialTitle);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.select();
    }
  }, [editing]);

  async function save(newTitle: string) {
    const trimmed = newTitle.trim().replace(/\s+/g, " ");

    if (!trimmed || trimmed === title) {
      setEditing(false);
      return;
    }

    setSaving(true);
    setTitle(trimmed);
    setEditing(false);

    try {
      const response = await fetch(`/api/boards/${boardId}/rename`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });

      if (!response.ok) {
        setTitle(title);
        console.error("[rename] failed", response.status);
      }
    } catch (error) {
      setTitle(title);
      console.error("[rename]", error);
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        defaultValue={title}
        maxLength={120}
        autoFocus
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            save(event.currentTarget.value);
          }
          if (event.key === "Escape") {
            setEditing(false);
          }
        }}
        onBlur={(event) => save(event.currentTarget.value)}
        className="max-w-50 rounded-md border border-ink/40 bg-transparent px-1.5 py-0.5 font-display text-sm font-semibold text-chalk outline-none focus:border-ink"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      data-tip="Click to rename"
      className="tooltip group/title max-w-50 truncate font-display text-sm font-semibold text-chalk transition-colors hover:text-ink"
      aria-label={`Board title: ${title}. Click to rename.`}
    >
      {saving ? (
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 12 12" className="h-3 w-3 animate-spin text-ink" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
            <path d="M10.5 6a4.5 4.5 0 0 0-4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {title}
        </span>
      ) : (
        title
      )}
    </button>
  );
}
