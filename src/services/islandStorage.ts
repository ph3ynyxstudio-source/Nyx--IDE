export interface IslandPosition {
  x: number;
  y: number;
}

export type IslandLayoutMode = "wide" | "tall";

export interface IslandDimensions {
  width: number;
  height: number;
}

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const STORAGE_KEY = "nyx-island-position";
const LAYOUT_STORAGE_KEY = "nyx-island-layout";

/** Épaisseur actuelle de l'île en mode horizontal (hauteur "wide"). */
const ISLAND_THICKNESS = 100;
/** Marge latérale actuelle : largeur "wide" = calc(100vw - 32px). */
const SIDE_MARGIN = 16;
const TOPBAR_HEIGHT = 52;
const EDGE_GAP = 8;

/** Lit les valeurs réelles de env(safe-area-inset-*) via un élément sonde. */
export function getSafeAreaInsets(): SafeAreaInsets {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;visibility:hidden;pointer-events:none;" +
    "padding:env(safe-area-inset-top) env(safe-area-inset-right) " +
    "env(safe-area-inset-bottom) env(safe-area-inset-left);";
  document.body.appendChild(probe);
  const cs = getComputedStyle(probe);
  const insets = {
    top: parseFloat(cs.paddingTop) || 0,
    right: parseFloat(cs.paddingRight) || 0,
    bottom: parseFloat(cs.paddingBottom) || 0,
    left: parseFloat(cs.paddingLeft) || 0,
  };
  probe.remove();
  return insets;
}

function verticalBounds(safe: SafeAreaInsets) {
  const minY = Math.max(safe.top, 16) + TOPBAR_HEIGHT + EDGE_GAP;
  const maxBottom = window.innerHeight - Math.max(safe.bottom, 16);
  return { minY, maxBottom };
}

/**
 * Mode "wide" : dimensions actuelles (largeur = 100vw - 32px, hauteur = 100px).
 * Mode "tall" : inversion stricte (largeur <-> hauteur), bornée à la zone sûre.
 */
export function getIslandDimensions(
  mode: IslandLayoutMode,
  safe: SafeAreaInsets
): IslandDimensions {
  const longSide = Math.max(
    ISLAND_THICKNESS,
    window.innerWidth - safe.left - safe.right - SIDE_MARGIN * 2
  );

  if (mode === "wide") {
    return { width: longSide, height: ISLAND_THICKNESS };
  }

  const { minY, maxBottom } = verticalBounds(safe);
  return {
    width: ISLAND_THICKNESS,
    height: Math.max(ISLAND_THICKNESS, Math.min(longSide, maxBottom - minY)),
  };
}

export function clampIslandPosition(
  pos: IslandPosition,
  dims: IslandDimensions,
  safe: SafeAreaInsets
): IslandPosition {
  const minX = safe.left + EDGE_GAP;
  const maxX = Math.max(minX, window.innerWidth - safe.right - dims.width - EDGE_GAP);
  const { minY, maxBottom } = verticalBounds(safe);
  const maxY = Math.max(minY, maxBottom - dims.height);

  return {
    x: Math.round(Math.max(minX, Math.min(maxX, pos.x))),
    y: Math.round(Math.max(minY, Math.min(maxY, pos.y))),
  };
}

export function loadIslandPosition(): IslandPosition | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.x === "number" && typeof parsed?.y === "number") {
      return { x: parsed.x, y: parsed.y };
    }
  } catch {
    // JSON invalide : on ignore
  }
  return null;
}

export function saveIslandPosition(pos: IslandPosition): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
  } catch {
    // Quota / stockage indisponible : on ignore
  }
}

export function loadIslandLayoutMode(): IslandLayoutMode {
  try {
    return localStorage.getItem(LAYOUT_STORAGE_KEY) === "tall" ? "tall" : "wide";
  } catch {
    return "wide";
  }
}

export function saveIslandLayoutMode(mode: IslandLayoutMode): void {
  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, mode);
  } catch {
    // Stockage indisponible : on ignore
  }
}
