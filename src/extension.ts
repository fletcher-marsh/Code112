'use strict';
import * as vscode from 'vscode';

// Get current Python REPL (if exists)
function getInteractivePythonTerminal(): vscode.Terminal | null {
    const allTerms = vscode.window.terminals;
    var resultTerm = null;

    allTerms.forEach(term => {
        if (term.name === 'Python') {
            resultTerm = term;
        }
    });

    return resultTerm;
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
    // TODO: this will be replaced by chooseExecutable, but needs starter default val
    return "python3";
}

// Set up functionality of Code112
export function activate(context: vscode.ExtensionContext) {
    // Create an interactive python environment with the current file
    let createREPL = vscode.commands.registerCommand('extension.createREPL', () => {
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

    // Allow user to select which interpreter/compiler to run against
    let chooseExecutable = vscode.commands.registerCommand('extension.chooseExecutable', () => {
        // TODO: find all interpreters/etc. accessible
        console.log("Choose executable");

        // TODO: update stored value to be read from createREPL
    });

    context.subscriptions.push(createREPL);
    context.subscriptions.push(chooseExecutable);
}

export function deactivate() {
    // Clean up terminal
    disposePythonTerminal();
}
