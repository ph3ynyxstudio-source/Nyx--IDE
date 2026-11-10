import React, { useState } from "react";
import { FileNode } from "../../services/mockFileSystem";
import styles from "./FileTree.module.css";

export interface FileTreeProps {
  nodes: FileNode[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
}

interface TreeBranchProps {
  node: FileNode;
  depth: number;
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
}

const TreeBranch: React.FC<TreeBranchProps> = ({
  node,
  depth,
  activeFileId,
  onSelectFile,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const indentStyle: React.CSSProperties = {
    paddingLeft: `${16 + depth * 20}px`,
  };

  if (node.type === "folder") {
    return (
      <li>
        <button
          type="button"
          className={styles.nodeRow}
          style={indentStyle}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <svg
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <svg className={styles.folderIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" />
          </svg>
          <span className={styles.nodeName}>{node.name}/</span>
        </button>

        {isOpen && node.children && (
          <ul className={styles.treeList}>
            {node.children.map((child) => (
              <TreeBranch
                key={child.id}
                node={child}
                depth={depth + 1}
                activeFileId={activeFileId}
                onSelectFile={onSelectFile}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  const isSelected = node.id === activeFileId;

  return (
    <li>
      <button
        type="button"
        className={`${styles.nodeRow} ${isSelected ? styles.activeFile : ""}`}
        style={indentStyle}
        onClick={() => onSelectFile(node.id)}
      >
        <svg
          className={styles.fileIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span className={styles.nodeName}>{node.name}</span>
        {node.language && <span className={styles.extTag}>{node.language}</span>}
      </button>
    </li>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({
  nodes,
  activeFileId,
  onSelectFile,
}) => {
  return (
    <section className={styles.explorerPanel} aria-label="Explorateur de fichiers">
      <div className={styles.header}>
        <span className={styles.title}>Explorateur Local</span>
        <span className={styles.workspaceBadge}>Nyx IDE</span>
      </div>

      <ul className={styles.treeList}>
        {nodes.map((node) => (
          <TreeBranch
            key={node.id}
            node={node}
            depth={0}
            activeFileId={activeFileId}
            onSelectFile={onSelectFile}
          />
        ))}
      </ul>
    </section>
  );
};
