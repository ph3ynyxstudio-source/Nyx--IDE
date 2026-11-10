import React from "react";
import styles from "./SettingsView.module.css";

export interface SettingsViewProps {
  isIslandPinned: boolean;
  onToggleIslandPin: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isIslandPinned,
  onToggleIslandPin,
}) => {
  return (
    <section className={styles.settingsContainer} aria-label="Paramètres">
      <div className={styles.card}>
        <span className={styles.cardTitle}>Identité Visuelle</span>
        <div className={styles.row}>
          <span>Thème Actif</span>
          <span className={styles.badge}>Carbone Sombre</span>
        </div>
        <div className={styles.row}>
          <span>Profil Cible</span>
          <span className={styles.badge}>Nothing Phone (3a)</span>
        </div>
      </div>

      <div className={styles.card}>
        <span className={styles.cardTitle}>Ergonomie Tactile</span>
        <div className={styles.row}>
          <span>État Île Flottante</span>
          <button type="button" className={styles.badge} onClick={onToggleIslandPin}>
            {isIslandPinned ? "Ancrée (Vert)" : "Libre (Orange)"}
          </button>
        </div>
      </div>
    </section>
  );
};
