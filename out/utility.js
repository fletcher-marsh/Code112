"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const os = require("os");
const vscode = require("vscode");
// Return default path for executable
function getDefaultPath() {
    return "python3";
}
exports.getDefaultPath = getDefaultPath;
// Checks if any of the input paths are valid executables, and if so append to output
function getExecsByPaths(paths) {
    var result = [];
    var path;
    for (var i = 0; i < paths.length; i++) {
        path = paths[i];
        if (fs.existsSync(path)) {
            result.push(path);
        }
    }
    ;
    return result;
}
exports.getExecsByPaths = getExecsByPaths;
// Retrieves all Python executables
function findAllExecs() {
    const platform = os.platform();
    var placesToLook;
    if (platform === "darwin") {
        placesToLook = [
            '/Library/Frameworks/Python.framework/Versions/3.6/bin/python',
            '/usr/local/bin/python',
            '/usr/bin/python',
            '~/anaconda3/python'
        ];
    }
    else if (platform === "cygwin") {
        placesToLook = [
            'C:\ProgramData\Anaconda3\python.exe',
            'C:\Python36-32\python.exe',
            'C:\Python37-32\python.exe',
            'C:\Miniconda3\python.exe',
            'C:\Users\Fletch\Miniconda3\python.exe'
        ];
    }
    else {
        placesToLook = [''];
    }
    return getExecsByPaths(placesToLook);
}
exports.findAllExecs = findAllExecs;
// Alert user with that little thing that pops up on the bottom left
function toast(msg) {
    vscode.window.showInformationMessage(msg);
}
exports.toast = toast;
//# sourceMappingURL=utility.js.map