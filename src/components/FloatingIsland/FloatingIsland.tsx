import React, { useEffect, useRef, useState } from "react";
import { PinButton } from "./PinButton";
import { ResizeIcon } from "../Icons";
import {
  IslandLayout,
  loadIslandLayout,
  saveIslandLayout,
  clampIslandLayout,
  computeBottomLeftResize,
} from "../../services/islandStorage";
import styles from "./FloatingIsland.module.css";

export type IslandPosition = IslandLayout;

export interface FloatingIslandProps {
  isPinned: boolean;
  onTogglePin: () => void;
  onSelectSmartBlock: () => void;
  onSelectAll: () => void;
  onCopy: () => void;
  onPaste: () => void;
  feedbackText?: string | null;
}

export const FloatingIsland: React.FC<FloatingIslandProps> = ({
  isPinned,
  onTogglePin,
  onSelectSmartBlock,
  onSelectAll,
  onCopy,
  onPaste,
  feedbackText,
}) => {
  const islandRef = useRef<HTMLElement | null>(null);
  const [savedLayout, setSavedLayout] = useState<IslandLayout | null>(() => loadIslandLayout());
  const [liveLayout, setLiveLayout] = useState<IslandLayout | null>(null);

  const dragSession = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    latest: IslandLayout;
  } | null>(null);

  const resizeSession = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
    latest: IslandLayout;
  } | null>(null);

  const currentLayout = liveLayout ?? savedLayout;

  const persistLayout = (next: IslandLayout) => {
    const el = islandRef.current;
    const w = el ? el.offsetWidth : Math.min(window.innerWidth - 32, 360);
    const h = el ? el.offsetHeight : 96;
    const clamped = clampIslandLayout(next, w, h);
    setSavedLayout(clamped);
    saveIslandLayout(clamped);
  };

  useEffect(() => {
    const stored = loadIslandLayout();
    if (stored) {
      const el = islandRef.current;
      const w = el ? el.offsetWidth : Math.min(window.innerWidth - 32, 360);
      const h = el ? el.offsetHeight : 96;
      setSavedLayout(clampIslandLayout(stored, w, h));
    }
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isPinned || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = islandRef.current?.getBoundingClientRect();
    const base: IslandLayout = {
      x: currentLayout?.x ?? (rect ? Math.round(rect.left) : 16),
      y: currentLayout?.y ?? (rect ? Math.round(rect.top) : 360),
      width: currentLayout?.width ?? (rect ? Math.round(rect.width) : undefined),
      height: currentLayout?.height ?? (rect ? Math.round(rect.height) : undefined),
    };
    dragSession.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      origX: base.x,
      origY: base.y,
      latest: base,
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isPinned || !dragSession.current || e.touches.length === 0) return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    const el = islandRef.current;
    const w = el ? el.offsetWidth : 340;
    const h = el ? el.offsetHeight : 96;
    const clamped = clampIslandLayout(
      {
        ...dragSession.current.latest,
        x: dragSession.current.origX + (touch.clientX - dragSession.current.startX),
        y: dragSession.current.origY + (touch.clientY - dragSession.current.startY),
      },
      w,
      h
    );
    dragSession.current.latest = clamped;
    setLiveLayout(clamped);
  };

  const handleTouchEnd = () => {
    if (!dragSession.current) return;
    const finalLayout = dragSession.current.latest;
    dragSession.current = null;
    setLiveLayout(null);
    persistLayout(finalLayout);
  };

  const handleResizeStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isPinned || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = islandRef.current?.getBoundingClientRect();
    const origX = currentLayout?.x ?? (rect ? Math.round(rect.left) : 16);
    const origY = currentLayout?.y ?? (rect ? Math.round(rect.top) : 360);
    const origW = currentLayout?.width ?? (rect ? Math.round(rect.width) : 320);
    const origH = currentLayout?.height ?? (rect ? Math.round(rect.height) : 96);
    resizeSession.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      origX,
      origY,
      origW,
      origH,
      latest: { x: origX, y: origY, width: origW, height: origH },
    };
  };

  const handleResizeMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isPinned || !resizeSession.current || e.touches.length === 0) return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    const s = resizeSession.current;
    const next = computeBottomLeftResize(
      s.origX,
      s.origY,
      s.origW,
      s.origH,
      touch.clientX - s.startX,
      touch.clientY - s.startY
    );
    s.latest = next;
    setLiveLayout(next);
  };

  const handleResizeEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!resizeSession.current) return;
    const finalLayout = resizeSession.current.latest;
    resizeSession.current = null;
    setLiveLayout(null);
    persistLayout(finalLayout);
  };

  const handlePinToggle = () => {
    const rect = islandRef.current?.getBoundingClientRect();
    const toSave: IslandLayout = {
      x: currentLayout?.x ?? (rect ? Math.round(rect.left) : 16),
      y: currentLayout?.y ?? (rect ? Math.round(rect.top) : 360),
      width: currentLayout?.width ?? (rect ? Math.round(rect.width) : undefined),
      height: currentLayout?.height ?? (rect ? Math.round(rect.height) : undefined),
    };
    setLiveLayout(null);
    dragSession.current = null;
    resizeSession.current = null;
    persistLayout(toSave);
    onTogglePin();
  };

  const inlineStyle: React.CSSProperties | undefined = currentLayout
    ? {
        left: `${currentLayout.x}px`,
        top: `${currentLayout.y}px`,
        ...(currentLayout.width !== undefined ? { width: `${currentLayout.width}px` } : {}),
        ...(currentLayout.height !== undefined ? { height: `${currentLayout.height}px` } : {}),
      }
    : undefined;

  return (
    <aside
      ref={islandRef}
      className={`${styles.island} ${
        currentLayout ? styles.customPositioned : ""
      } ${isPinned ? styles.anchoredState : styles.freeState} ${
        liveLayout ? styles.dragging : ""
      }`}
      style={inlineStyle}
      aria-label="Île flottante d'actions rapides"
    >
      <div className={`${styles.topRow} ${!isPinned ? styles.topRowDraggable : ""}`}>
        {isPinned ? (
          <span className={styles.statusLabel}>{feedbackText ?? "Capsule Ancrée"}</span>
        ) : (
          <div
            className={styles.dragHandle}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            title="Glisser pour déplacer l'île"
          >
            <svg className={styles.gripDots} viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="6" r="1.8" />
              <circle cx="15" cy="6" r="1.8" />
              <circle cx="9" cy="12" r="1.8" />
              <circle cx="15" cy="12" r="1.8" />
              <circle cx="9" cy="18" r="1.8" />
              <circle cx="15" cy="18" r="1.8" />
            </svg>
            <span>{feedbackText ?? "Mode Libre · Glisser"}</span>
          </div>
        )}

        <PinButton isPinned={isPinned} onTogglePin={handlePinToggle} />
      </div>

      <div className={styles.actionsRow}>
        <button type="button" className={`${styles.actionBtn} ${styles.mono}`} onClick={onSelectSmartBlock}>
          {"{ }"}
        </button>
        <button type="button" className={`${styles.actionBtn} ${styles.mono}`} onClick={onSelectAll}>
          {"[::]"}
        </button>
        <button type="button" className={styles.actionBtn} onClick={onCopy}>
          Copier
        </button>
        <button type="button" className={styles.actionBtn} onClick={onPaste}>
          Coller
        </button>
      </div>

      {!isPinned && (
        <div
          className={styles.resizeHandle}
          onTouchStart={handleResizeStart}
          onTouchMove={handleResizeMove}
          onTouchEnd={handleResizeEnd}
          onTouchCancel={handleResizeEnd}
          title="Redimensionner l'île (coin bas-gauche)"
          role="slider"
          aria-label="Poignée de redimensionnement"
        >
          <ResizeIcon size={15} />
        </div>
      )}
    </aside>
  );
};
