'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
// Get current Python REPL (if exists)
function getInteractivePythonTerminal() {
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
function getPythonPath() {
    // TODO: Windows has a lot of wonky python stuff, deal with it
    return "python3";
}
// Create an interactive python environment with the current file
function activate(context) {
    let pythonREPL = vscode.commands.registerCommand('extension.createREPL', () => {
        // If a terminal exists, clean it up
        disposePythonTerminal();
        // Setup a new terminal with an interactive python environment
        const newTerm = vscode.window.createTerminal('Python');
        const filePath = vscode.window.activeTextEditor.document.fileName;
        const pythonPath = getPythonPath();
        if (filePath) {
            newTerm.sendText(`${pythonPath} -i ${filePath}`);
            newTerm.show(true);
        }
        else {
            vscode.window.showInformationMessage('No files to run!');
        }
    });
    context.subscriptions.push(pythonREPL);
}
exports.activate = activate;
function deactivate() {
    // Clean up terminal
    disposePythonTerminal();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map