import React from "react";
import { BuildStatus } from "../../services/mockGitHubService";
import styles from "./GitHubPanel.module.css";

export interface GitHubPanelProps {
  commitMessage: string;
  onChangeCommitMessage: (msg: string) => void;
  buildStatus: BuildStatus;
  onPull: () => void;
  onCommit: () => void;
  onPush: () => void;
  onBuildApk: () => void;
}

export const GitHubPanel: React.FC<GitHubPanelProps> = ({
  commitMessage,
  onChangeCommitMessage,
  buildStatus,
  onPull,
  onCommit,
  onPush,
  onBuildApk,
}) => {
  return (
    <section className={styles.githubPanel} aria-label="Contrôle de version GitHub">
      <div className={styles.headerCard}>
        <div className={styles.repoInfo}>
          <span className={styles.repoTitle}>Ph3yNyx / nyx-ide</span>
          <span className={styles.branchName}>origin/main · HTTPS</span>
        </div>

        <span className={styles.statusBadge}>
          <span className={styles.statusDot} />
          Status: {buildStatus}
        </span>
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="commit-message-input" className={styles.label}>
          Message de commit
        </label>
        <textarea
          id="commit-message-input"
          className={styles.commitInput}
          placeholder="feat(mvp): floating island & carbon theme..."
          value={commitMessage}
          onChange={(e) => onChangeCommitMessage(e.target.value)}
        />
      </div>

      <div className={styles.buttonStack}>
        <button type="button" className={styles.fullBtn} onClick={onPull}>
          Pull
        </button>

        <button type="button" className={styles.fullBtn} onClick={onCommit}>
          Commit
        </button>

        <button type="button" className={styles.fullBtn} onClick={onPush}>
          Push
        </button>

        <button
          type="button"
          className={`${styles.fullBtn} ${styles.buildBtn}`}
          onClick={onBuildApk}
        >
          Compiler APK
        </button>
      </div>
    </section>
  );
};
