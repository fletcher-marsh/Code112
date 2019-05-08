'use strict';
import * as vscode from 'vscode';
import * as util from './utility';

var EXEC: string | undefined; // Stores executable chosen by user


// Get current Python REPL (if exists)
function getInteractivePythonTerminal(): vscode.Terminal | null {
    const allTerms = vscode.window.terminals;
    var resultTerm = null;

    allTerms.forEach(term => {
        if (term.name === 'Interactive') {
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
            // Save file before execution
            vscode.window.activeTextEditor!.document.save().then(success => {
                // TODO: This is python specific, look into other execs
                newTerm.sendText(`${util.sanitizePath(path)} -i ${util.sanitizePath(filePath)}`);
                newTerm.show(true);
            }, fail => {
                util.toast('File save failed, execution aborted.');
            });
        } else {
            util.toast('No files to run!');
        }
    });

    // Allow user to select which interpreter/compiler to run against
    let chooseExecutable = vscode.commands.registerCommand('extension.chooseExecutable', () => {
        const execs = util.findAllExecs();
        // Show dropdown with found executables
        vscode.window.showQuickPick(execs, { placeHolder: 'Select executable' }).then(choice => {
            EXEC = choice;
        }, fail => {
            util.toast(fail);
        });
    });

    context.subscriptions.push(createREPL);
    context.subscriptions.push(chooseExecutable);
}

export function deactivate() {
    // Clean up terminal
    disposeInteractiveTerminal();
}
