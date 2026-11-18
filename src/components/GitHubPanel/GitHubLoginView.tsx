import React, { useState } from "react";
import styles from "./GitHubPanel.module.css";

export interface GitHubLoginViewProps {
  onConnect: (token: string) => void;
}

export const GitHubLoginView: React.FC<GitHubLoginViewProps> = ({ onConnect }) => {
  const [tokenInput, setTokenInput] = useState("");
  const canSubmit = tokenInput.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) onConnect(tokenInput);
  };

  return (
    <section className={styles.githubPanel} aria-label="Connexion GitHub">
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <h2 className={styles.loginTitle}>Connecter votre compte GitHub</h2>
        <p className={styles.loginText}>
          Un Personal Access Token (PAT) est requis pour synchroniser vos dépôts et
          compiler via GitHub Actions.
        </p>

        <input
          type="password"
          className={styles.tokenInput}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Personal Access Token GitHub"
        />

        <button
          type="submit"
          className={`${styles.fullBtn} ${styles.buildBtn}`}
          disabled={!canSubmit}
        >
          Connecter mon GitHub
        </button>
      </form>
    </section>
  );
};
