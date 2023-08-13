import * as vscode from 'vscode';

export function registerListeners(context: vscode.ExtensionContext, updateDecorationsCallback: () => void) {
  let activeEditor = vscode.window.activeTextEditor;

  vscode.window.onDidChangeActiveTextEditor(editor => {
    activeEditor = editor;
    if (editor) {
      updateDecorationsCallback();
    }
  }, null, context.subscriptions);

  vscode.workspace.onDidChangeTextDocument(event => {
    if (activeEditor && event.document === activeEditor.document) {
      updateDecorationsCallback();
    }
  }, null, context.subscriptions);
}


  // Commented out: Register listeners function
  /*
  function registerListeners() {
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor) {
        updateDecorations(editor);
      }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor && event.document === activeEditor.document) {
        updateDecorations(activeEditor);
      }
    }, null, context.subscriptions);
  }
  registerListeners();
  */