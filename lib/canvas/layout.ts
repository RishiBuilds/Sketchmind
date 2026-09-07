type Positioned = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  isDeleted?: boolean;
};

export type Bounds = { minX: number; minY: number; maxX: number; maxY: number };

export function getBounds(elements: readonly Positioned[]): Bounds | null {
  const live = elements.filter((element) => !element.isDeleted);

  if (live.length === 0) {
    return null;
  }

  return live.reduce<Bounds>(
    (bounds, element) => ({
      minX: Math.min(bounds.minX, element.x),
      minY: Math.min(bounds.minY, element.y),
      maxX: Math.max(bounds.maxX, element.x + (element.width ?? 0)),
      maxY: Math.max(bounds.maxY, element.y + (element.height ?? 0)),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );
}

export function placeBeside<T extends Positioned>(
  existing: readonly Positioned[],
  incoming: readonly T[],
  gap = 120,
): T[] {
  const target = getBounds(existing);
  const source = getBounds(incoming);

  if (!target || !source) {
    return [...incoming];
  }

  const dx = target.maxX + gap - source.minX;
  const dy = target.minY - source.minY;

  return incoming.map((element) => ({ ...element, x: element.x + dx, y: element.y + dy }));
}