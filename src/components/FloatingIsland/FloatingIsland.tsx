import React from "react";
import { PinButton } from "./PinButton";
import { ToggleLayoutIcon, KeyboardIcon } from "../Icons";
import { useFloatingIsland } from "../../services/useFloatingIsland";
import styles from "./FloatingIsland.module.css";

export type { IslandPosition } from "../../services/islandStorage";

export interface FloatingIslandProps {
  isPinned: boolean;
  onTogglePin: () => void;
  onSelectSmartBlock: () => void;
  onSelectAll: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onToggleKeyboard?: () => void;
  isKeyboardOpen?: boolean;
  feedbackText?: string | null;
}

export const FloatingIsland: React.FC<FloatingIslandProps> = ({
  isPinned,
  onTogglePin,
  onSelectSmartBlock,
  onSelectAll,
  onCopy,
  onPaste,
  onToggleKeyboard,
  isKeyboardOpen = false,
  feedbackText,
}) => {
  const {
    islandRef,
    layoutMode,
    dims,
    currentPos,
    isDragging,
    dragHandlers,
    togglePin,
    toggleLayout,
  } = useFloatingIsland(isPinned, onTogglePin);

  const isTall = layoutMode === "tall";

  const inlineStyle: React.CSSProperties = {
    width: `${dims.width}px`,
    height: `${dims.height}px`,
    ...(currentPos ? { left: `${currentPos.x}px`, top: `${currentPos.y}px` } : {}),
  };

  const className = [
    styles.island,
    currentPos ? styles.customPositioned : "",
    isTall ? styles.tall : styles.wide,
    isPinned ? styles.anchoredState : styles.freeState,
    isDragging ? styles.dragging : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside
      ref={islandRef}
      className={className}
      style={inlineStyle}
      aria-label="Île flottante d'actions rapides"
    >
      <div className={`${styles.topRow} ${!isPinned ? styles.topRowDraggable : ""}`}>
        {isPinned ? (
          <span className={styles.statusLabel}>{feedbackText ?? "Capsule Ancrée"}</span>
        ) : (
          <div className={styles.dragHandle} {...dragHandlers} title="Glisser pour déplacer l'île">
            <svg className={styles.gripDots} viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="6" r="1.8" />
              <circle cx="15" cy="6" r="1.8" />
              <circle cx="9" cy="12" r="1.8" />
              <circle cx="15" cy="12" r="1.8" />
              <circle cx="9" cy="18" r="1.8" />
              <circle cx="15" cy="18" r="1.8" />
            </svg>
            <span className={styles.labelText}>{feedbackText ?? "Mode Libre · Glisser"}</span>
          </div>
        )}

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.layoutToggle}
            onClick={toggleLayout}
            title={isTall ? "Passer en disposition horizontale" : "Passer en disposition verticale"}
            aria-label="Basculer l'orientation de l'île"
          >
            <ToggleLayoutIcon size={15} />
          </button>
          <PinButton isPinned={isPinned} onTogglePin={togglePin} />
        </div>
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
        <button
          type="button"
          className={`${styles.actionBtn} ${isKeyboardOpen ? styles.keyboardActive : ""}`}
          onClick={onToggleKeyboard}
          title={isKeyboardOpen ? "Fermer le clavier" : "Ouvrir le clavier"}
          aria-label="Clavier"
        >
          <KeyboardIcon size={16} />
        </button>
      </div>
    </aside>
  );
};
