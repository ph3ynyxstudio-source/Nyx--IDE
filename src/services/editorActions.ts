import { EditorView } from "@uiw/react-codemirror";
import { findSmartBlockRange } from "./mockFileSystem";

export function selectSmartBlockInEditor(
  view: EditorView | undefined,
  fallbackText: string
): string {
  if (!view) {
    return "Bloc { } sélectionné";
  }

  const text = view.state.doc.toString() || fallbackText;
  const { from, to, head } = view.state.selection.main;
  const range = findSmartBlockRange(text, head, { from, to });

  view.dispatch({
    selection: { anchor: range.from, head: range.to },
    scrollIntoView: true,
  });
  view.focus();
  return `Bloc { } (${range.to - range.from} car.)`;
}

export function selectAllInEditor(
  view: EditorView | undefined,
  fallbackText: string
): string {
  const len = view ? view.state.doc.length : fallbackText.length;
  if (view) {
    view.dispatch({ selection: { anchor: 0, head: len } });
    view.focus();
  }
  return "Tout sélectionné [::]";
}

export async function copyFromEditor(
  view: EditorView | undefined,
  fallbackText: string
): Promise<{ copied: string; label: string }> {
  const selected = view
    ? view.state.sliceDoc(
        view.state.selection.main.from,
        view.state.selection.main.to
      )
    : "";
  const textToCopy = selected || fallbackText;

  try {
    await navigator.clipboard.writeText(textToCopy);
  } catch {
    // Fallback presse-papiers local en mémoire
  }

  return {
    copied: textToCopy,
    label: selected ? "Sélection copiée !" : "Fichier copié !",
  };
}

export async function pasteIntoEditor(
  view: EditorView | undefined,
  localClipboard: string
): Promise<string> {
  let textToPaste = localClipboard;
  try {
    const sysClip = await navigator.clipboard.readText();
    if (sysClip) textToPaste = sysClip;
  } catch {
    // Utilisation du fallback en mémoire
  }

  if (!textToPaste) {
    return "Presse-papiers vide";
  }

  if (view) {
    const { from, to } = view.state.selection.main;
    view.dispatch({
      changes: { from, to, insert: textToPaste },
      selection: { anchor: from + textToPaste.length },
      scrollIntoView: true,
    });
    view.focus();
  }

  return "Collé !";
}
