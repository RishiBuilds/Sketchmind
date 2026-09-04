"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { WhiteboardScene } from "@/lib/db/schema";

const DEBOUNCE_MS = 1500;

export type SaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

type Snapshot = { scene: WhiteboardScene; version: number };
type Flush = (options?: { keepalive?: boolean }) => Promise<void>;

export function useAutosave(boardId: string) {
  const [status, setStatus] = useState<SaveStatus>("idle");

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<Snapshot | null>(null);
  const inFlight = useRef(false);

  const savedVersion = useRef<number | null>(null);

  const flushRef = useRef<Flush>(async () => {});

  useEffect(() => {
    const flush: Flush = async ({ keepalive } = {}) => {
      const snapshot = pending.current;

      if (!snapshot || inFlight.current) {
        return;
      }

      pending.current = null;
      inFlight.current = true;
      setStatus("saving");

      try {
        const response = await fetch(`/api/boards/${boardId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scene: snapshot.scene }),
          keepalive,
        });

        if (!response.ok) {
          throw new Error(String(response.status));
        }

        savedVersion.current = snapshot.version;
        setStatus(pending.current ? "pending" : "saved");
      } catch (cause) {
        console.error("[autosave] save failed", cause);
        pending.current = snapshot;
        setStatus("error");
      } finally {
        inFlight.current = false;
        if (pending.current) {
          timer.current = setTimeout(() => void flushRef.current(), DEBOUNCE_MS);
        }
      }
    };

    flushRef.current = flush;
  }, [boardId]);

  const handleChange = useCallback((scene: WhiteboardScene, version: number) => {
    if (savedVersion.current === null) {
      savedVersion.current = version;
      return;
    }

    if (version === savedVersion.current) {
      return;
    }

    pending.current = { scene, version };
    setStatus("pending");

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => void flushRef.current(), DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    const saveNow = () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      void flushRef.current({ keepalive: true });
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        saveNow();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", saveNow);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", saveNow);
      saveNow();
    };
  }, []);
  return { status, handleChange };
}