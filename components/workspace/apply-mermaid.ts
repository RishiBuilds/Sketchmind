import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

import { placeBeside } from "@/lib/canvas/layout";

export async function applyMermaidToCanvas(
  api: ExcalidrawImperativeAPI,
  mermaid: string,
): Promise<number> {
  const [{ parseMermaidToExcalidraw }, { convertToExcalidrawElements }] = await Promise.all([
    import("@excalidraw/mermaid-to-excalidraw"),
    import("@excalidraw/excalidraw"),
  ]);

  let skeleton: Awaited<ReturnType<typeof parseMermaidToExcalidraw>>;

  try {
    skeleton = await parseMermaidToExcalidraw(mermaid);
  } catch {
    throw new Error("The model drew something Mermaid could not parse. Try rephrasing.");
  }

  const converted = convertToExcalidrawElements(skeleton.elements);

  if (converted.length === 0) {
    throw new Error("That produced an empty diagram. Try being more specific.");
  }

  const existing = api.getSceneElements();
  const placed = placeBeside(existing, converted);

  if (skeleton.files) {
    api.addFiles(Object.values(skeleton.files));
  }

  api.updateScene({ elements: [...existing, ...placed] as never });
  api.scrollToContent(placed as never, { fitToContent: true, animate: true });

  return placed.length;
}