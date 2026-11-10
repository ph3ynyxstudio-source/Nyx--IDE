import React from "react";
import { TerminalLog } from "../../services/mockGitHubService";
import styles from "./TerminalView.module.css";

export interface TerminalViewProps {
  logs: TerminalLog[];
  onClearLogs: () => void;
}

export const TerminalView: React.FC<TerminalViewProps> = ({
  logs,
  onClearLogs,
}) => {
  return (
    <section className={styles.terminalContainer} aria-label="Terminal en lecture seule">
      <div className={styles.header}>
        <span className={styles.title}>Console & Logs Système</span>
        <button type="button" className={styles.clearBtn} onClick={onClearLogs}>
          Effacer
        </button>
      </div>

      <ul className={styles.logList}>
        {logs.map((entry) => (
          <li key={entry.id} className={styles.logLine}>
            <span className={styles.time}>[{entry.timestamp}]</span>
            <span className={styles.tag}>{entry.source}</span>
            <span className={styles.msg}>{entry.message}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
