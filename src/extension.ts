import * as vscode from 'vscode';
import { colorHSL, removeHSLColoring } from './commands';
import { updateColoringContext } from './context';
import { documentColoringStates, uriDecorations, applyDecorations } from './decorations';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.colorHSL', colorHSL),
    vscode.commands.registerCommand('extension.removeHSLColoring', removeHSLColoring)
  );

  // Update coloring context when the active text editor changes
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      const documentUri = editor.document.uri.toString();
      const isColoringApplied = documentColoringStates.get(documentUri) || false;
      updateColoringContext(isColoringApplied);
    }
  });
  
  updateColoringContext(false);

  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      const documentUri = editor.document.uri.toString();
      if (uriDecorations.has(documentUri)) {
        // Reapply the decorations
        applyDecorations(editor);
      }

      const isColoringApplied = documentColoringStates.get(documentUri) || false;
      updateColoringContext(isColoringApplied);
    }
  });
}
