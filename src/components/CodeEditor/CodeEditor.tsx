import React, { useMemo } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { FileLanguage } from "../../services/mockFileSystem";
import styles from "./CodeEditor.module.css";

export interface CodeEditorProps {
  filePath: string;
  language?: FileLanguage;
  code: string;
  onChange: (newCode: string) => void;
  editorRef: React.RefObject<ReactCodeMirrorRef | null>;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  filePath,
  language = "tsx",
  code,
  onChange,
  editorRef,
}) => {
  const extensions = useMemo(() => {
    switch (language) {
      case "tsx":
      case "ts":
        return [javascript({ jsx: true, typescript: true })];
      case "css":
        return [css()];
      case "md":
        return [markdown()];
      case "json":
        return [json()];
      default:
        return [javascript({ jsx: true, typescript: true })];
    }
  }, [language]);

  return (
    <section className={styles.editorContainer} aria-label="Éditeur de code">
      <div className={styles.fileBanner}>
        <span className={styles.filePath}>{filePath}</span>
        <span className={styles.langBadge}>{language}</span>
      </div>

      <div className={styles.cmWrapper}>
        <CodeMirror
          ref={editorRef}
          value={code}
          height="100%"
          theme={oneDark}
          extensions={extensions}
          onChange={onChange}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: true,
            bracketMatching: true,
            autocompletion: true,
          }}
        />
      </div>
    </section>
  );
};
