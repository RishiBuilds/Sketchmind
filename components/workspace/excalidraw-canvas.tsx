"use client";

import { Excalidraw, getSceneVersion } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

import "@excalidraw/excalidraw/index.css";

import type { WhiteboardScene } from "@/lib/db/schema";

type ExcalidrawCanvasProps = {
  initialScene: WhiteboardScene;
  onApiReady: (api: ExcalidrawImperativeAPI) => void;
  onSceneChange?: (scene: WhiteboardScene, version: number) => void;
};

const PERSISTED_APP_STATE = [
  "viewBackgroundColor",
  "gridSize",
  "gridModeEnabled",
  "scrollX",
  "scrollY",
  "zoom",
] as const;

export default function ExcalidrawCanvas({
  initialScene,
  onApiReady,
  onSceneChange,
}: ExcalidrawCanvasProps) {
  const hasSavedViewport =
    typeof initialScene.appState?.scrollX === "number" &&
    typeof initialScene.appState?.scrollY === "number";

  return (
    <Excalidraw
      excalidrawAPI={onApiReady}
      theme="dark"
      onChange={(elements, appState, files) => {
        if (!onSceneChange) {
          return;
        }

        onSceneChange(
          {
            elements: elements.filter((element) => !element.isDeleted),
            appState: Object.fromEntries(
              PERSISTED_APP_STATE.filter((key) => appState[key] !== undefined).map((key) => [
                key,
                appState[key],
              ]),
            ),
            files,
          },
          getSceneVersion(elements),
        );
      }}
      initialData={{
        elements: (initialScene.elements ?? []) as never,
        appState: initialScene.appState,
        files: (initialScene.files ?? {}) as never,
        scrollToContent: !hasSavedViewport,
      }}
      UIOptions={{
        canvasActions: {
          loadScene: false,
        },
      }}
    />
  );
}   