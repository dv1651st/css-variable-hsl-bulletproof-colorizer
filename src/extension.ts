import * as vscode from 'vscode';
import { getColors } from './utilities';
import { HSL_PATTERN } from './constants';
import { registerListeners } from './listeners';

let extensionIsActive = false;
let decorationTypes: vscode.TextEditorDecorationType[] = [];
export function activate(context: vscode.ExtensionContext) {
  // Create a status bar item with alignment and priority
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

  // Set text and tooltip
  statusBarItem.text = 'Run Extension';
  statusBarItem.tooltip = 'Click to run the extension';

  // Register a command to run when the item is clicked
  const commandId = 'extension.toggleExtension';
  const disposable = vscode.commands.registerCommand(commandId, () => {
    // Logic to toggle the extension's functionality on and off
    if (extensionIsActive) {
      // Deactivate the extension and update the status bar item
      deactivateExtension();
      statusBarItem.text = 'Run Extension';
      extensionIsActive = false;
    } else {
      // Activate the extension and update the status bar item
      activateExtension();
      statusBarItem.text = 'Stop Extension';
      extensionIsActive = true;
    }
  });
  context.subscriptions.push(disposable);
  
  // Set the command to be run when the item is clicked
  statusBarItem.command = commandId;
  
  // Show the status bar item
  statusBarItem.show();

  let activeEditor = vscode.window.activeTextEditor;

  function activateExtension() {
    extensionIsActive = true;
    if (activeEditor) {
      updateDecorations(); // Run when activated
    }
    registerListeners(context, updateDecorations); // You should have this function in your listeners.ts
  }

  function deactivateExtension() {
    extensionIsActive = false;
    // Clear all decorations
    for (const decorationType of decorationTypes) {
      decorationType.dispose();
    }
    decorationTypes = []; // Reset the array
  }

  function updateDecorations() {
    if (!activeEditor || !extensionIsActive) {
      return;
    }

        // Dispose of previous decoration types
    decorationTypes.forEach(decorationType => decorationType.dispose());
    decorationTypes = [];
    const text = activeEditor.document.getText();
    
    const matches = [...text.matchAll(HSL_PATTERN)];
    console.log(matches.length)
    for (const match of matches) {
     
      const startPos = activeEditor.document.positionAt(match.index!);
      const endPos = activeEditor.document.positionAt(match.index! + match[0].length);
      const { backgroundColor, color } = getColors(match[1]);
      
      const decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: backgroundColor,
        color: color,
      });
      decorationTypes.push(decorationType); // Keep track of the decoration type
      const range = { range: new vscode.Range(startPos, endPos) };
      activeEditor.setDecorations(decorationType, [range]);
    }
  }
}
