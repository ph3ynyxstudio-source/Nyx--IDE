export type FileLanguage = "tsx" | "ts" | "css" | "md" | "json";

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: "folder" | "file";
  language?: FileLanguage;
  content?: string;
  children?: FileNode[];
}

export const INITIAL_FILE_TREE: FileNode[] = [
  {
    id: "folder-docs",
    name: "docs",
    path: "docs",
    type: "folder",
    children: [
      {
        id: "file-gouvernance",
        name: "gouvernance.md",
        path: "docs/gouvernance.md",
        type: "file",
        language: "md",
        content: `# GOUVERNANCE — Nyx IDE\n\n## Périmètre du MVP\n- Explorateur de fichiers local\n- Éditeur de code tactile (CodeMirror 6)\n- Île flottante interactive (Ancrage, Sélection, Copier/Coller)\n- Panneau GitHub (Pull, Commit, Push, Build APK)\n`,
      },
      {
        id: "file-architecture",
        name: "architecture.md",
        path: "docs/architecture.md",
        type: "file",
        language: "md",
        content: `# ARCHITECTURE — Nyx IDE\n\n1. UI (React) -> Composants muets\n2. Services (TS) -> Logique métier\n3. Système (Rust/Tauri) -> Stockage sandboxé\n`,
      },
    ],
  },
  {
    id: "folder-src",
    name: "src",
    path: "src",
    type: "folder",
    children: [
      {
        id: "folder-components",
        name: "components",
        path: "src/components",
        type: "folder",
        children: [
          {
            id: "file-floating-island",
            name: "FloatingIsland.tsx",
            path: "src/components/FloatingIsland/FloatingIsland.tsx",
            type: "file",
            language: "tsx",
            content: `import React from "react";\n\nexport interface IslandConfig {\n  isPinned: boolean;\n  position: { x: number; y: number };\n}\n\nexport function initIsland(defaultPinned = true): IslandConfig {\n  if (defaultPinned) {\n    return {\n      isPinned: true,\n      position: { x: 16, y: 0 },\n    };\n  }\n  return {\n    isPinned: false,\n    position: { x: 24, y: 120 },\n  };\n}\n`,
          },
          {
            id: "file-topbar",
            name: "TopBar.tsx",
            path: "src/components/TopBar/TopBar.tsx",
            type: "file",
            language: "tsx",
            content: `export type NavTab = "explorer" | "editor" | "github" | "terminal" | "settings";\n\nexport const NAV_TABS: NavTab[] = [\n  "explorer",\n  "editor",\n  "github",\n  "terminal",\n  "settings",\n];\n`,
          },
        ],
      },
      {
        id: "folder-theme",
        name: "theme",
        path: "src/theme",
        type: "folder",
        children: [
          {
            id: "file-variables-css",
            name: "variables.css",
            path: "src/theme/variables.css",
            type: "file",
            language: "css",
            content: `:root {\n  --bg-app: #030611;\n  --bg-carbon: #0a0d14;\n  --bg-card: rgba(8, 14, 28, 0.65);\n  --bg-panel: #07131f;\n  --bg-topbar: #050814;\n  --text-main: #d6dbe3;\n  --accent-pin: #38a169;\n  --accent-warn: #d69e2e;\n}\n`,
          },
        ],
      },
      {
        id: "file-app-tsx",
        name: "App.tsx",
        path: "src/App.tsx",
        type: "file",
        language: "tsx",
        content: `import React, { useState } from "react";\n\nexport function NyxCore() {\n  const [ready, setReady] = useState(true);\n\n  function toggleEngine() {\n    setReady((prev) => {\n      const nextState = !prev;\n      console.log("Nyx Engine:", nextState);\n      return nextState;\n    });\n  }\n\n  return {\n    device: "Nothing Phone (3a)",\n    theme: "Carbone Sombre",\n    ready,\n    toggleEngine,\n  };\n}\n`,
      },
    ],
  },
  {
    id: "file-package-json",
    name: "package.json",
    path: "package.json",
    type: "file",
    language: "json",
    content: `{\n  "name": "nyx-ide",\n  "version": "0.1.0",\n  "private": true,\n  "target": "android-arm64"\n}\n`,
  },
];

export function findFileById(nodes: FileNode[], id: string): FileNode | null {
  for (const node of nodes) {
    if (node.id === id && node.type === "file") {
      return node;
    }
    if (node.children) {
      const found = findFileById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function updateFileContent(
  nodes: FileNode[],
  id: string,
  newContent: string
): FileNode[] {
  return nodes.map((node) => {
    if (node.id === id && node.type === "file") {
      return { ...node, content: newContent };
    }
    if (node.children) {
      return {
        ...node,
        children: updateFileContent(node.children, id, newContent),
      };
    }
    return node;
  });
}

/**
 * Sélection intelligente de bloc `{ ... }` autour du curseur.
 * Si un bloc est déjà sélectionné, étend la sélection au bloc parent englobant.
 */
export function findSmartBlockRange(
  text: string,
  cursorOffset: number,
  currentSelection?: { from: number; to: number }
): { from: number; to: number } {
  const pairs: Array<{ from: number; to: number }> = [];
  const stack: number[] = [];

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "{") {
      stack.push(i);
    } else if (text[i] === "}" && stack.length > 0) {
      const openIndex = stack.pop()!;
      pairs.push({ from: openIndex, to: i + 1 });
    }
  }

  const enclosing = pairs
    .filter((p) => p.from <= cursorOffset && cursorOffset <= p.to)
    .sort((a, b) => a.to - a.from - (b.to - b.from));

  if (enclosing.length > 0) {
    if (
      currentSelection &&
      currentSelection.from !== currentSelection.to
    ) {
      const larger = enclosing.find(
        (p) => p.from < currentSelection.from || p.to > currentSelection.to
      );
      if (larger) return larger;
    }
    return enclosing[0];
  }

  if (pairs.length > 0) {
    return pairs.sort((a, b) => a.from - b.from)[0];
  }

  return { from: 0, to: text.length };
}
