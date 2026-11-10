export interface IslandLayout {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

const STORAGE_KEY = "nyx-island-position";

export const ISLAND_BOUNDS = {
  minWidth: 280,
  minHeight: 80,
  maxWidthVw: 0.95,
  maxHeightVh: 0.4,
};

export function loadIslandLayout(): IslandLayout | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.x === "number" && typeof parsed?.y === "number") {
      return {
        x: parsed.x,
        y: parsed.y,
        width: typeof parsed.width === "number" ? parsed.width : undefined,
        height: typeof parsed.height === "number" ? parsed.height : undefined,
      };
    }
  } catch {
    // Ignore invalid JSON
  }
  return null;
}

export function saveIslandLayout(layout: IslandLayout): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch {
    // Ignore storage errors
  }
}

export function clampIslandLayout(
  layout: IslandLayout,
  currentWidth: number,
  currentHeight: number
): IslandLayout {
  const maxW = Math.max(
    ISLAND_BOUNDS.minWidth,
    Math.round(window.innerWidth * ISLAND_BOUNDS.maxWidthVw)
  );
  const maxH = Math.max(
    ISLAND_BOUNDS.minHeight,
    Math.round(window.innerHeight * ISLAND_BOUNDS.maxHeightVh)
  );

  const width =
    layout.width !== undefined
      ? Math.round(Math.max(ISLAND_BOUNDS.minWidth, Math.min(maxW, layout.width)))
      : undefined;
  const height =
    layout.height !== undefined
      ? Math.round(Math.max(ISLAND_BOUNDS.minHeight, Math.min(maxH, layout.height)))
      : undefined;

  const effectiveW = width ?? currentWidth;
  const effectiveH = height ?? currentHeight;

  const minX = 4;
  const maxX = Math.max(minX, window.innerWidth - effectiveW - 4);
  const minY = 60;
  const maxY = Math.max(minY, window.innerHeight - effectiveH - 8);

  return {
    x: Math.round(Math.max(minX, Math.min(maxX, layout.x))),
    y: Math.round(Math.max(minY, Math.min(maxY, layout.y))),
    width,
    height,
  };
}

/**
 * Calcul du redimensionnement depuis le coin inférieur gauche :
 * Le bord droit (origX + origWidth) reste fixe pendant que X et width s'ajustent.
 */
export function computeBottomLeftResize(
  origX: number,
  origY: number,
  origWidth: number,
  origHeight: number,
  dx: number,
  dy: number
): IslandLayout {
  const rightEdge = origX + origWidth;
  const maxAllowedW = Math.min(
    Math.round(window.innerWidth * ISLAND_BOUNDS.maxWidthVw),
    rightEdge - 4
  );
  const maxW = Math.max(ISLAND_BOUNDS.minWidth, maxAllowedW);

  const maxAllowedH = Math.min(
    Math.round(window.innerHeight * ISLAND_BOUNDS.maxHeightVh),
    window.innerHeight - origY - 8
  );
  const maxH = Math.max(ISLAND_BOUNDS.minHeight, maxAllowedH);

  const rawWidth = origWidth - dx;
  const nextWidth = Math.round(
    Math.max(ISLAND_BOUNDS.minWidth, Math.min(maxW, rawWidth))
  );
  const nextX = Math.round(rightEdge - nextWidth);

  const rawHeight = origHeight + dy;
  const nextHeight = Math.round(
    Math.max(ISLAND_BOUNDS.minHeight, Math.min(maxH, rawHeight))
  );

  return {
    x: nextX,
    y: origY,
    width: nextWidth,
    height: nextHeight,
  };
}
