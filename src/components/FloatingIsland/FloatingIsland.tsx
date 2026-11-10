import React, { useState, useRef } from "react";
import { PinButton } from "./PinButton";
import styles from "./FloatingIsland.module.css";

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
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 16, y: 380 });
  const dragOffset = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPinned) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragOffset.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: coords.x,
      origY: coords.y,
    };
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragOffset.current || isPinned) return;
    const dx = e.clientX - dragOffset.current.startX;
    const dy = e.clientY - dragOffset.current.startY;
    const nextX = Math.max(8, Math.min(24, dragOffset.current.origX + dx));
    const nextY = Math.max(64, Math.min(520, dragOffset.current.origY + dy));
    setCoords({ x: nextX, y: nextY });
  };

  const handleDragEnd = () => {
    dragOffset.current = null;
  };

  const freeInlineStyle: React.CSSProperties | undefined = !isPinned
    ? { left: `${coords.x}px`, top: `${coords.y}px` }
    : undefined;

  return (
    <aside
      className={`${styles.island} ${isPinned ? styles.anchoredState : styles.freeState}`}
      style={freeInlineStyle}
      aria-label="Île flottante d'actions rapides"
    >
      <div className={styles.topRow}>
        {isPinned ? (
          <span className={styles.statusLabel}>
            {feedbackText ?? "Capsule Ancrée"}
          </span>
        ) : (
          <div
            className={styles.dragHandle}
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
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

        <PinButton isPinned={isPinned} onTogglePin={onTogglePin} />
      </div>

      <div className={styles.actionsRow}>
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.mono}`}
          onClick={onSelectSmartBlock}
          title="Sélection intelligente de bloc"
        >
          {"{ }"}
        </button>

        <button
          type="button"
          className={`${styles.actionBtn} ${styles.mono}`}
          onClick={onSelectAll}
          title="Tout sélectionner"
        >
          {"[::]"}
        </button>

        <button
          type="button"
          className={styles.actionBtn}
          onClick={onCopy}
          title="Copier la sélection"
        >
          Copier
        </button>

        <button
          type="button"
          className={styles.actionBtn}
          onClick={onPaste}
          title="Coller depuis le presse-papiers"
        >
          Coller
        </button>
      </div>
    </aside>
  );
};
