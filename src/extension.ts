'use strict';
import * as vscode from 'vscode';
import * as util from './utility';

var EXEC: string | undefined; // Stores executable chosen by user


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
function disposeInteractiveTerminal() {
    const curTerm = getInteractivePythonTerminal();

    if (curTerm) {
        curTerm.dispose();
    }
}

// Set up functionality of Code112
export function activate(context: vscode.ExtensionContext) {
    // Create an interactive environment with the current file
    let createREPL = vscode.commands.registerCommand('extension.createREPL', () => {
        // If a terminal exists, clean it up
        disposeInteractiveTerminal()

        // Setup a new terminal with an interactive environment
        const newTerm = vscode.window.createTerminal('Interactive');
        const filePath = vscode.window.activeTextEditor!.document.fileName;
        const path = EXEC ? EXEC : util.getDefaultPath();

        // Send interactive environment setup to terminal
        if (filePath) {
            //TODO: This is python specific, look into other execs
            newTerm.sendText(`${path} -i ${filePath}`);
            newTerm.show(true);
        } else {
            vscode.window.showInformationMessage('No files to run!');
        }
    });

    // Allow user to select which interpreter/compiler to run against
    let chooseExecutable = vscode.commands.registerCommand('extension.chooseExecutable', () => {
        const execs = util.findAllExecs();
        var res = vscode.window.showQuickPick(execs, { placeHolder: 'Select executable' });
        res.then(e => EXEC = e, fail => util.toast(fail));
    });

    context.subscriptions.push(createREPL);
    context.subscriptions.push(chooseExecutable);
}

export function deactivate() {
    // Clean up terminal
    disposeInteractiveTerminal();
}
