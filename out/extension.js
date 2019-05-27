'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const util = require("./utility");
const p = require("path");
var EXEC; // Stores executable chosen by user
// Get current Python REPL (if exists)
function getInteractivePythonTerminal() {
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
function activate(context) {
    // Create an interactive environment with the current file
    let createREPL = vscode.commands.registerCommand('extension.createREPL', () => {
        // If a terminal exists, clean it up
        disposeInteractiveTerminal();
        // Setup a new terminal with an interactive environment
        const filePath = vscode.window.activeTextEditor.document.fileName;
        const dirPath = p.dirname(filePath);
        const newTerm = vscode.window.createTerminal('Interactive');
        newTerm.sendText(`cd ${dirPath}`);
        const path = EXEC ? EXEC : util.getDefaultPath();
        // Send interactive environment setup to terminal
        if (filePath) {
            // Save file before execution
            vscode.window.activeTextEditor.document.save().then(success => {
                // TODO: This is python specific, look into other execs
                newTerm.sendText(`${util.sanitizePath(path)} -i ${util.sanitizePath(filePath)}`);
                newTerm.show(true);
            }, fail => {
                util.toast('File save failed, execution aborted.');
            });
        }
        else {
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
exports.activate = activate;
function deactivate() {
    // Clean up terminal
    disposeInteractiveTerminal();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map