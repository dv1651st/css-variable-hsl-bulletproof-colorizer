import * as vscode from 'vscode';

const coloringContextKey = 'isHslColoringApplied';

export function updateColoringContext(isColoringApplied: boolean) {
  vscode.commands.executeCommand('setContext', coloringContextKey, isColoringApplied);
}