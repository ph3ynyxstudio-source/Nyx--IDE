import { useEffect, useRef, useState } from "react";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { ThemeProvider, ThemeName } from "./theme/ThemeProvider";
import { TopBar, ActiveTab } from "./components/TopBar";
import { FileTree } from "./components/FileTree";
import { CodeEditor } from "./components/CodeEditor";
import { FloatingIsland } from "./components/FloatingIsland";
import { GitHubPanel } from "./components/GitHubPanel";
import { TerminalView } from "./components/TerminalView";
import { SettingsView } from "./components/SettingsView";
import {
  INITIAL_FILE_TREE,
  FileNode,
  findFileById,
  updateFileContent,
} from "./services/mockFileSystem";
import {
  selectSmartBlockInEditor,
  selectAllInEditor,
  copyFromEditor,
  pasteIntoEditor,
} from "./services/editorActions";
import {
  INITIAL_LOGS,
  BuildStatus,
  TerminalLog,
  createLog,
} from "./services/mockGitHubService";
import "./App.css";

export function App() {
  const [activeTheme, setActiveTheme] = useState<ThemeName>("carbon");
  const [activeTab, setActiveTab] = useState<ActiveTab>("editor");
  const [fileTree, setFileTree] = useState<FileNode[]>(INITIAL_FILE_TREE);
  const [activeFileId, setActiveFileId] = useState<string>("file-app-tsx");
  const [isIslandPinned, setIsIslandPinned] = useState<boolean>(true);
  const [islandFeedback, setIslandFeedback] = useState<string | null>(null);
  const [clipboardText, setClipboardText] = useState<string>("");
  const [commitMessage, setCommitMessage] = useState<string>("");
  const [buildStatus, setBuildStatus] = useState<BuildStatus>("Ready");
  const [logs, setLogs] = useState<TerminalLog[]>(INITIAL_LOGS);

  const editorRef = useRef<ReactCodeMirrorRef | null>(null);
  const activeFile = findFileById(fileTree, activeFileId) ?? INITIAL_FILE_TREE[1].children![2];

  useEffect(() => {
    window.history.replaceState({ tab: "editor" }, "");
    const onPopState = (e: PopStateEvent) => {
      const nextTab = (e.state?.tab as ActiveTab) || "editor";
      setActiveTab(nextTab);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigateTab = (tab: ActiveTab) => {
    if (tab !== activeTab) {
      window.history.pushState({ tab }, "");
      setActiveTab(tab);
    }
  };

  const notifyIsland = (msg: string) => {
    setIslandFeedback(msg);
    window.setTimeout(() => setIslandFeedback(null), 1400);
  };

  const pushLog = (source: TerminalLog["source"], message: string) => {
    setLogs((prev) => [...prev, createLog(source, message)]);
  };

  const handleSelectFile = (fileId: string) => {
    setActiveFileId(fileId);
    navigateTab("editor");
    const chosen = findFileById(fileTree, fileId);
    if (chosen) pushLog("FS", `Opened ${chosen.path}`);
  };

  return (
    <ThemeProvider theme={activeTheme} onChangeTheme={setActiveTheme}>
      <TopBar activeTab={activeTab} onSelectTab={navigateTab} />

      {activeTab === "explorer" && (
        <FileTree
          nodes={fileTree}
          activeFileId={activeFile.id}
          onSelectFile={handleSelectFile}
        />
      )}

      {activeTab === "editor" && (
        <>
          <CodeEditor
            filePath={activeFile.path}
            language={activeFile.language}
            code={activeFile.content ?? ""}
            onChange={(code) =>
              setFileTree((prev) => updateFileContent(prev, activeFile.id, code))
            }
            editorRef={editorRef}
          />
          <FloatingIsland
            isPinned={isIslandPinned}
            onTogglePin={() => setIsIslandPinned((p) => !p)}
            onSelectSmartBlock={() =>
              notifyIsland(
                selectSmartBlockInEditor(editorRef.current?.view, activeFile.content ?? "")
              )
            }
            onSelectAll={() =>
              notifyIsland(
                selectAllInEditor(editorRef.current?.view, activeFile.content ?? "")
              )
            }
            onCopy={async () => {
              const res = await copyFromEditor(
                editorRef.current?.view,
                activeFile.content ?? ""
              );
              setClipboardText(res.copied);
              notifyIsland(res.label);
            }}
            onPaste={async () => {
              const label = await pasteIntoEditor(editorRef.current?.view, clipboardText);
              notifyIsland(label);
            }}
            feedbackText={islandFeedback}
          />
        </>
      )}

      {activeTab === "github" && (
        <GitHubPanel
          commitMessage={commitMessage}
          onChangeCommitMessage={setCommitMessage}
          buildStatus={buildStatus}
          onPull={() => {
            setBuildStatus("Ready");
            pushLog("GIT", "git pull origin main — Already up to date.");
          }}
          onCommit={() => {
            const msg = commitMessage.trim() || "chore: quick mobile update";
            setBuildStatus("Committed");
            setCommitMessage("");
            pushLog("GIT", `git commit -m "${msg}"`);
          }}
          onPush={() => {
            setBuildStatus("Ready");
            pushLog("GIT", "git push origin main — Pushed to remote.");
          }}
          onBuildApk={() => {
            setBuildStatus("Building APK...");
            pushLog("CLOUD", "Triggered GitHub Actions workflow: android-apk.yml");
            window.setTimeout(() => {
              setBuildStatus("APK Ready");
              pushLog("CLOUD", "APK build succeeded: nyx-ide-arm64-debug.apk");
            }, 1200);
          }}
        />
      )}

      {activeTab === "terminal" && (
        <TerminalView logs={logs} onClearLogs={() => setLogs([])} />
      )}

      {activeTab === "settings" && (
        <SettingsView
          activeTheme={activeTheme}
          onSelectTheme={setActiveTheme}
          isIslandPinned={isIslandPinned}
          onToggleIslandPin={() => setIsIslandPinned((p) => !p)}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
