import * as fs from 'fs';
import * as os from 'os';
const PLATFORM = os.platform();
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
    var placesToLook;

    if (PLATFORM === "darwin") {
        placesToLook = [
            '/Library/Frameworks/Python.framework/Versions/3.4/bin/python',
            '/Library/Frameworks/Python.framework/Versions/3.5/bin/python',
            '/Library/Frameworks/Python.framework/Versions/3.6/bin/python',
            '/Library/Frameworks/Python.framework/Versions/3.4/bin/python3',
            '/Library/Frameworks/Python.framework/Versions/3.5/bin/python3',
            '/Library/Frameworks/Python.framework/Versions/3.6/bin/python3',
            '/usr/local/bin/python',
            '/usr/bin/python',
            os.homedir()+'/anaconda3/python'
        ];
    } else if (PLATFORM === "win32") {
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
            os.homedir() + '\\Miniconda3\\python.exe',
            os.homedir() + '\\AppData\\Local\\Programs\\Python\\Python35\\python.exe',
            os.homedir() + '\\AppData\\Local\\Programs\\Python\\Python35-32\\python.exe',
            os.homedir() + '\\AppData\\Local\\Programs\\Python\\Python36\\python.exe',
            os.homedir() + '\\AppData\\Local\\Programs\\Python\\Python36-32\\python.exe',
            os.homedir() + '\\AppData\\Local\\Programs\\Python\\Python37\\python.exe',
            os.homedir() + '\\AppData\\Local\\Programs\\Python\\Python37-32\\python.exe',
        ];
    } else {
        // TODO: Linux support
        placesToLook = [''];
    }

    return getExecsByPaths(placesToLook);
}

// Replace all instances of a string (search) in a string (source) with a string (replacement) 
export function replaceAll(source: string, search: string, replacement: string) {
    return source.replace(new RegExp(search, 'g'), replacement);
}

// Perform manual sanitization of path (i.e. escape spaces)
export function sanitizePath(path: string) {
    var clean: string;
    
    // Handle spaces
    if (path.indexOf(" ") > -1) {
        if (PLATFORM === "darwin" || PLATFORM === "linux") {
            clean = replaceAll(path, " ", "\\ ");
        } else {
            clean = '"' + path + '"';
        }
    } else {
        clean = path;
    }
    
    return clean;
}


// Alert user with that little thing that pops up on the bottom left
export function toast(msg: string) {
    vscode.window.showInformationMessage(msg);
}