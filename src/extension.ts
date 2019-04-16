'use strict';
import * as vscode from 'vscode';

// Get current Python REPL (if exists)
function getInteractivePythonTerminal(): vscode.Terminal | null {
    const allTerms = vscode.window.terminals;

    allTerms.forEach(term => {
        if (term.name === `Python`) {
            return term;
        }
    });

    return null;
}

// Dispose existing Python REPL terminal (if exists)
function disposePythonTerminal() {
    const curTerm = getInteractivePythonTerminal();
    if (curTerm) {
        curTerm.dispose();
    }
}

// Finding proper Python path based on OS
function getPythonPath(): String {
    // TODO: Windows has a lot of wonky python stuff, deal with it
    return "python3";
}

export function activate(context: vscode.ExtensionContext) {
    // Create an interactive python environment with the current file
    let disposable = vscode.commands.registerCommand('extension.createREPL', () => {
        // If a terminal exists, clean it up
        disposePythonTerminal()

        // Setup a new terminal with an interactive python environment
        const newTerm = vscode.window.createTerminal('Python');
        const filePath = vscode.window.activeTextEditor!.document.fileName;
        const pythonPath = getPythonPath();

        if (filePath) {
            newTerm.sendText(`${pythonPath} -i ${filePath}`);
            newTerm.show(true);
        } else {
            vscode.window.showInformationMessage('No files to run!');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    // Clean up terminal
    disposePythonTerminal();
}
