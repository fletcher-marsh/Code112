import * as fs from 'fs';
import * as os from 'os';
import * as vscode from 'vscode';

// Return default path for executable
export function getDefaultPath(): string {
    return "python3";
}

// Checks if any of the input paths are valid executables, and if so append to output
export function getExecsByPaths(paths: string[]): string[] {
    var result: string[] = [];
    var path;

    for (var i = 0; i < paths.length; i++) {
        path = paths[i];
        if (fs.existsSync(path)) {
            result.push(path);
        }
    };

    return result;
}

// Retrieves all Python executables
export function findAllExecs(): string[] {
    const platform = os.platform();
    var placesToLook;

    if (platform === "darwin") {
        placesToLook = [
            '/Library/Frameworks/Python.framework/Versions/3.6/bin/python',
            '/usr/local/bin/python',
            '/usr/bin/python',
            '~/anaconda3/python'
        ];
    } else if (platform === "cygwin") {
        placesToLook = [
            'C:\ProgramData\Anaconda3\python.exe',
            'C:\Python36-32\python.exe',
            'C:\Python37-32\python.exe',
            'C:\Miniconda3\python.exe',
            'C:\Users\Fletch\Miniconda3\python.exe'
        ];
    } else {
        placesToLook = [''];
    }

    return getExecsByPaths(placesToLook);
}


// Alert user with that little thing that pops up on the bottom left
export function toast(msg: string) {
    vscode.window.showInformationMessage(msg);
}