import React, { useRef } from "react";
import styles from "./FloatingIsland.module.css";

export interface PinButtonProps {
  isPinned: boolean;
  onTogglePin: () => void;
}

export const PinButton: React.FC<PinButtonProps> = ({ isPinned, onTogglePin }) => {
  const timerRef = useRef<number | null>(null);
  const longPressTriggered = useRef(false);

  const handlePointerDown = () => {
    longPressTriggered.current = false;
    timerRef.current = window.setTimeout(() => {
      longPressTriggered.current = true;
      onTogglePin();
    }, 400);
  };

  const handlePointerUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = () => {
    if (!longPressTriggered.current) {
      onTogglePin();
    }
  };

  return (
    <button
      type="button"
      className={`${styles.pinButton} ${isPinned ? styles.pinned : styles.unpinned}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleClick}
      title={isPinned ? "Ancrée (Cliquer ou appui long pour libérer)" : "Libre (Cliquer pour ancrer)"}
      aria-label={isPinned ? "Île ancrée" : "Île libre"}
    >
      <span className={styles.pinDot} />
      <svg className={styles.pinIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="17" x2="12" y2="22" />
        <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
      </svg>
    </button>
  );
};
