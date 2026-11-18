import React, { useMemo } from "react";
import CodeMirror, { ReactCodeMirrorRef, EditorView } from "@uiw/react-codemirror";
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
  isKeyboardOpen?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  filePath,
  language = "tsx",
  code,
  onChange,
  editorRef,
  isKeyboardOpen = false,
}) => {
  const extensions = useMemo(() => {
    const baseExtensions = [];

    // Quand le clavier n'est pas ouvert via le bouton de l'île :
    // inputmode: "none" empêche l'apparition du clavier virtuel Android au toucher,
    // mais conserve l'éditeur totalement interactif (sélection, déplacement du curseur, copier, coller par dispatch).
    // Si isKeyboardOpen est true, inputmode: "text" permet la saisie normale avec le clavier.
    baseExtensions.push(
      EditorView.contentAttributes.of({
        inputmode: isKeyboardOpen ? "text" : "none",
      })
    );

    switch (language) {
      case "tsx":
      case "ts":
        baseExtensions.push(javascript({ jsx: true, typescript: true }));
        break;
      case "css":
        baseExtensions.push(css());
        break;
      case "md":
        baseExtensions.push(markdown());
        break;
      case "json":
        baseExtensions.push(json());
        break;
      default:
        baseExtensions.push(javascript({ jsx: true, typescript: true }));
        break;
    }

    return baseExtensions;
  }, [language, isKeyboardOpen]);

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
