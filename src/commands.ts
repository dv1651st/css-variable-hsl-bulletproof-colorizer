import { uriDecorations, documentColoringStates, applyDecorations, clearDecorations } from './decorations';
import { updateColoringContext } from './context';
import * as vscode from 'vscode';

export function removeHSLColoring() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const documentUri = editor.document.uri.toString();
    documentColoringStates.set(documentUri, false);
    updateColoringContext(false);
    clearDecorations(documentUri);
  }
}

export function colorHSL() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const documentUri = editor.document.uri.toString();
    documentColoringStates.set(documentUri, true);
    updateColoringContext(true);
    applyDecorations(editor);
  }
}