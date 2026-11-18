import { useEffect, useRef, useState } from "react";
import type React from "react";
import {
  IslandLayoutMode,
  IslandPosition,
  SafeAreaInsets,
  clampIslandPosition,
  getIslandDimensions,
  getSafeAreaInsets,
  loadIslandLayoutMode,
  loadIslandPosition,
  saveIslandLayoutMode,
  saveIslandPosition,
} from "./islandStorage";

interface DragSession {
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  latest: IslandPosition;
}

/**
 * Orchestration de l'île flottante : drag & drop tactile, ancrage mémorisé
 * (localStorage) et bascule de disposition wide <-> tall.
 */
export function useFloatingIsland(isPinned: boolean, onTogglePin: () => void) {
  const islandRef = useRef<HTMLElement | null>(null);
  const drag = useRef<DragSession | null>(null);

  const [layoutMode, setLayoutMode] = useState<IslandLayoutMode>(() => loadIslandLayoutMode());
  const [safe, setSafe] = useState<SafeAreaInsets>(() => getSafeAreaInsets());
  const [savedPos, setSavedPos] = useState<IslandPosition | null>(() => loadIslandPosition());
  const [livePos, setLivePos] = useState<IslandPosition | null>(null);

  const dims = getIslandDimensions(layoutMode, safe);
  const currentPos = livePos ?? savedPos;

  const persist = (pos: IslandPosition, mode: IslandLayoutMode, insets: SafeAreaInsets) => {
    const clamped = clampIslandPosition(pos, getIslandDimensions(mode, insets), insets);
    setSavedPos(clamped);
    saveIslandPosition(clamped);
  };

  // Re-borne la position mémorisée au montage, à chaque bascule de disposition
  // et à chaque changement de viewport (rotation, clavier...).
  useEffect(() => {
    const reclamp = () => {
      const insets = getSafeAreaInsets();
      setSafe(insets);
      const stored = loadIslandPosition();
      if (stored) persist(stored, layoutMode, insets);
    };
    reclamp();
    window.addEventListener("resize", reclamp);
    return () => window.removeEventListener("resize", reclamp);
  }, [layoutMode]);

  const readPosition = (): IslandPosition => {
    if (currentPos) return currentPos;
    const rect = islandRef.current?.getBoundingClientRect();
    return rect
      ? { x: Math.round(rect.left), y: Math.round(rect.top) }
      : { x: 16, y: window.innerHeight - dims.height - 24 };
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isPinned || e.touches.length === 0) return;
    const touch = e.touches[0];
    const base = readPosition();
    drag.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      origX: base.x,
      origY: base.y,
      latest: base,
    };
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isPinned || !drag.current || e.touches.length === 0) return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    const next = clampIslandPosition(
      {
        x: drag.current.origX + (touch.clientX - drag.current.startX),
        y: drag.current.origY + (touch.clientY - drag.current.startY),
      },
      dims,
      safe
    );
    drag.current.latest = next;
    setLivePos(next);
  };

  const onTouchEnd = () => {
    if (!drag.current) return;
    const finalPos = drag.current.latest;
    drag.current = null;
    setLivePos(null);
    persist(finalPos, layoutMode, safe);
  };

  const togglePin = () => {
    const pos = readPosition();
    drag.current = null;
    setLivePos(null);
    persist(pos, layoutMode, safe);
    onTogglePin();
  };

  const toggleLayout = () => {
    const next: IslandLayoutMode = layoutMode === "wide" ? "tall" : "wide";
    saveIslandLayoutMode(next);
    setLayoutMode(next);
  };

  return {
    islandRef,
    layoutMode,
    dims,
    currentPos,
    isDragging: livePos !== null,
    dragHandlers: { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel: onTouchEnd },
    togglePin,
    toggleLayout,
  };
}
