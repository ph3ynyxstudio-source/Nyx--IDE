export type BuildStatus =
  | "Ready"
  | "Pulling..."
  | "Committed"
  | "Pushing..."
  | "Building APK..."
  | "APK Ready";

export interface TerminalLog {
  id: string;
  timestamp: string;
  source: "GIT" | "CLOUD" | "FS" | "SYS";
  message: string;
}

function nowTime(): string {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

export const INITIAL_LOGS: TerminalLog[] = [
  {
    id: "log-1",
    timestamp: "10:00:01",
    source: "SYS",
    message: "Nyx IDE v0.1.0 initialized — Target: Nothing Phone (3a)",
  },
  {
    id: "log-2",
    timestamp: "10:00:02",
    source: "FS",
    message: "Workspace mounted in local memory sandbox (7 files loaded)",
  },
  {
    id: "log-3",
    timestamp: "10:00:03",
    source: "GIT",
    message: "Branch: main — Working tree clean",
  },
];

export function createLog(
  source: TerminalLog["source"],
  message: string
): TerminalLog {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: nowTime(),
    source,
    message,
  };
}
