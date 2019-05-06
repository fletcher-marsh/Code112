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
            '/Library/Frameworks/Python.framework/Versions/3.4/bin/python',
            '/Library/Frameworks/Python.framework/Versions/3.5/bin/python',
            '/Library/Frameworks/Python.framework/Versions/3.6/bin/python',
            '/Library/Frameworks/Python.framework/Versions/3.4/bin/python3',
            '/Library/Frameworks/Python.framework/Versions/3.5/bin/python3',
            '/Library/Frameworks/Python.framework/Versions/3.6/bin/python3',
            '/usr/local/bin/python',
            '/usr/bin/python',
            '~/anaconda3/python'
        ];
    } else if (platform === "win32") {
        placesToLook = [
            'C:\\ProgramData\\Anaconda3\\python.exe',
            'C:\\Python27\\python.exe',
            'C:\\Python27-32\\python.exe',
            'C:\\Python35\\python.exe',
            'C:\\Python35-32\\python.exe',
            'C:\\Python36\\python.exe',
            'C:\\Python36-32\\python.exe',
            'C:\\Python37\\python.exe',
            'C:\\Python37-32\\python.exe',
            'C:\\Miniconda3\\python.exe',
            '%HOMEPATH%\\Miniconda3\\python.exe',
            '%HOMEPATH%\\AppData\\Local\\Programs\\Python\\Python35\\python.exe',
            '%HOMEPATH%\\AppData\\Local\\Programs\\Python\\Python36\\python.exe',
            '%HOMEPATH%\\AppData\\Local\\Programs\\Python\\Python37\\python.exe',
        ];
        toast(placesToLook.toString());
    } else {
        placesToLook = [''];
    }

    return getExecsByPaths(placesToLook);
}


// Alert user with that little thing that pops up on the bottom left
export function toast(msg: string) {
    vscode.window.showInformationMessage(msg);
}