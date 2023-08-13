import { getColors } from './utilities';
import { HSL_PATTERN } from './constants';
import * as vscode from 'vscode';
import { updateColoringContext } from './context';

// Map to store decorations for each editor
export const uriDecorations = new Map<string, vscode.TextEditorDecorationType[]>();
export const documentColoringStates = new Map<string, boolean>();

export function applyDecorations(editor: vscode.TextEditor) {
    // Dispose of previous decoration types
    clearDecorations(editor.document.uri.toString());
  
    const text = editor.document.getText();
    const matches = [...text.matchAll(HSL_PATTERN)];
    const decorationTypes: vscode.TextEditorDecorationType[] = [];
  
    for (const match of matches) {
      const startPos = editor.document.positionAt(match.index!);
      const endPos = editor.document.positionAt(match.index! + match[0].length);
      const { backgroundColor, color } = getColors(match[1]);
      
      const decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: backgroundColor,
        color: color,
      });
      decorationTypes.push(decorationType); // Keep track of the decoration type
      const range = { range: new vscode.Range(startPos, endPos) };
      editor.setDecorations(decorationType, [range]);
      uriDecorations.set(editor.document.uri.toString(), decorationTypes);
    }
  
  
    // Set the state for the current document
    documentColoringStates.set(editor.document.uri.toString(), true);
  
    // Update the context
    updateColoringContext(true);
  
    // Store the decorations for this URI
    uriDecorations.set(editor.document.uri.toString(), decorationTypes);
  }
  
  export function clearDecorations(uri: string) {
    // Retrieve the decorations for this editor
    const decorationTypes = uriDecorations.get(uri);
    if (decorationTypes) {
      // Dispose of the decorations
      decorationTypes.forEach(decorationType => decorationType.dispose());
      // Remove the decorations from the map
      uriDecorations.delete(uri);
    }
    // Clear the state for the current document
    documentColoringStates.delete(uri);
  
    // Update the context
    updateColoringContext(false);
  }
