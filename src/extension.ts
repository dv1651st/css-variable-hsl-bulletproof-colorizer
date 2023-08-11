import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    updateDecorations(); // Run on activation
  }

  vscode.window.onDidChangeActiveTextEditor(editor => {
    activeEditor = editor;
    if (editor) {
      updateDecorations();
    }
  }, null, context.subscriptions);

  vscode.workspace.onDidChangeTextDocument(event => {
    if (activeEditor && event.document === activeEditor.document) {
      updateDecorations();
    }
  }, null, context.subscriptions);

  function updateDecorations() {
    if (!activeEditor) {
      return;
    }

    const text = activeEditor.document.getText();
    const pattern = /--[a-zA-Z0-9-]+:\s*(\d{1,3}(?:\.\d{1,3})?(?:deg)?\s+\d{1,3}(?:\.\d{1,3})?%\s+\d{1,3}(?:\.\d{1,3})?%)(?=\s*;?)/g;
    let match;

    while ((match = pattern.exec(text))) {
      const startPos = activeEditor.document.positionAt(match.index);
      const endPos = activeEditor.document.positionAt(match.index + match[0].length);
      const hslMatch = match[1].split(' ');

      // Extracting HSL values
      const hue = parseFloat(hslMatch[0]);
      const saturation = parseFloat(hslMatch[1]);
      const lightness = parseFloat(hslMatch[2]);

      // Converting HSL to CSS format
      const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      // Determine text color based on lightness
      const textColor = lightness > 50 ? 'black' : 'white';

      const decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: hslColor,
        color: textColor,
      });
      const decoration = { range: new vscode.Range(startPos, endPos) };
      activeEditor.setDecorations(decorationType, [decoration]);
    }
  }
}