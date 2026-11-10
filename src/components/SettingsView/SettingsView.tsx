import React from "react";
import { ThemeName } from "../../theme/ThemeProvider";
import styles from "./SettingsView.module.css";

export interface SettingsViewProps {
  activeTheme: ThemeName;
  onSelectTheme: (theme: ThemeName) => void;
  isIslandPinned: boolean;
  onToggleIslandPin: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  activeTheme,
  onSelectTheme,
  isIslandPinned,
  onToggleIslandPin,
}) => {
  return (
    <section className={styles.settingsContainer} aria-label="Paramètres">
      <div className={styles.card}>
        <span className={styles.cardTitle}>Thème de l&apos;Interface</span>
        <div className={styles.themeGrid}>
          <button
            type="button"
            className={`${styles.themeOptionBtn} ${
              activeTheme === "carbon" ? styles.themeActive : ""
            }`}
            onClick={() => onSelectTheme("carbon")}
          >
            <span>Carbone Neutre</span>
            <span className={styles.themeSub}>Opaque · OLED</span>
          </button>

          <button
            type="button"
            className={`${styles.themeOptionBtn} ${
              activeTheme === "stellar" ? styles.themeActive : ""
            }`}
            onClick={() => onSelectTheme("stellar")}
          >
            <span>Nuit Stellaire</span>
            <span className={styles.themeSub}>Étoiles & Halos</span>
          </button>
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
        <div className={styles.row}>
          <span>Profil Cible</span>
          <span className={styles.badge}>Nothing Phone (3a)</span>
        </div>
      </div>
    </section>
  );
};
