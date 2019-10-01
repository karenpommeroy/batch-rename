import * as fs from "fs";
import * as $_ from "lodash";
import * as path from "path";
import * as vscode from "vscode";

const replace = require("replace-in-file");

const findShortestWord = (arr: string[]): string => {
    let shortLength = Infinity;
    let shortest = "";

    if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] === "string" && arr[i].length < shortLength) {
                shortest = arr[i];
                shortLength = arr[i].length;
            }
        }
    }

    return shortest;
};

const renameHandler = (file: any, files: any[], onlyFiles = true, duplicate?: boolean) => {
    const names = $_.map(files, (item: any) => path.basename(item.fsPath));
    const specificName = findShortestWord(names);
    const fileName = specificName.split(".");
    const name = fileName[0];
    const options: vscode.InputBoxOptions = {
        prompt: "Name: ",
        placeHolder: "Input new file name",
        value: name,
    };

    vscode.window.showInputBox(options).then((value?: string) => {
        if (!value) {
            vscode.window.setStatusBarMessage("Batch Rename: Name cannot be empty!");
            return;
        }

        $_.forEach(files, (item: any) => {
            const newFileName = path.basename(item.fsPath).replace(name, value);
            const dirPath = path.dirname(item.fsPath);
            const newDirPath = duplicate ? $_.replace(dirPath, name, value) : dirPath;
            const newPath = `${newDirPath}\\${newFileName}`;

            if (duplicate) {
                if (!fs.existsSync(newDirPath)) {
                    fs.mkdirSync(newDirPath);
                }
            }

            const replaceOptions = {
                files: newPath,
                from: [
                    (value: string) => new RegExp(name, "g"),
                    (value: string) => new RegExp($_.toUpper(name), "g"),
                    (value: string) => new RegExp($_.kebabCase(name), "g"),
                    (value: string) => new RegExp($_.camelCase(name), "g"),
                ],
                to: [value, $_.toUpper(value), $_.kebabCase(value), $_.camelCase(value)],
            };

            if (duplicate) {
                fs.copyFileSync(item.fsPath, newPath);
            } else {
                fs.renameSync(item.fsPath, newPath);
            }

            if (!onlyFiles) {
                replace.sync(replaceOptions);
            }
        });
    });
};

const renameFilesAndContentHandler = (file: any, files: any) => {
    return renameHandler(file, files, false);
};

const renameFolderContentHandler = (file: any, files: any) => {
    const dir = file.fsPath;
    const stat = fs.lstatSync(dir);

    if (!stat.isDirectory()) {
        return renameHandler(file, files, false);
    } else {
        fs.readdir(file.fsPath, function(error: any, items: any) {
            const mapped = $_.map(items, (item) => {
                return { fsPath: `${dir}\\${item}` };
            });
            return renameHandler(file, mapped, false);
        });
    }
};

const duplicateHandler = (file: any, files: any) => {
    const dir = file.fsPath;
    const stat = fs.lstatSync(dir);

    if (!stat.isDirectory()) {
        return; // renameHandler(file, files, false);
    } else {
        fs.readdir(file.fsPath, function(error: any, items: any) {
            const mapped = $_.map(items, (item) => {
                return { fsPath: `${dir}\\${item}` };
            });
            return renameHandler(file, mapped, false, true);
        });
    }
};

export function activate(context: vscode.ExtensionContext) {
    const disposableRename = vscode.commands.registerCommand("batchRename.renameFiles", renameHandler);
    const disposableRenameFilesAndContent = vscode.commands.registerCommand(
        "batchRename.renameFilesAndContent",
        renameFilesAndContentHandler,
    );
    const disposableRenameFolderContent = vscode.commands.registerCommand(
        "batchRename.renameFolderContent",
        renameFolderContentHandler,
    );
    const disposableDuplicate = vscode.commands.registerCommand("batchRename.duplicate", duplicateHandler);

    context.subscriptions.push(disposableRename);
    context.subscriptions.push(disposableRenameFilesAndContent);
    context.subscriptions.push(disposableRenameFolderContent);
    context.subscriptions.push(disposableDuplicate);
}

export function deactivate() {}
