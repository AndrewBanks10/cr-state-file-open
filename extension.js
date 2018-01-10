const vscode = require('vscode')
const path = require('path')
const copyPaste = require("copy-paste")
const fs = require('fs')

function getFullPath(relativeFileName) {
    if ( !vscode.workspace.workspaceFolders ) {
        return {message: 'There are no open workspace folders.'}
    }
    let filePath
    const b = vscode.workspace.workspaceFolders.some( e => {
        filePath = path.join(e.uri.fsPath, relativeFileName)
        if ( fs.existsSync(filePath)) {
            return true
        }
    })
    if ( !b ) {
        return {message: `Could not find ${relativeFileName} in the workspace folders.`}
    }
    return filePath
}

function openDocument(line, file) {
    const filePath = getFullPath(file)
    if ( typeof filePath !== 'string' ) {
        vscode.window.showInformationMessage(filePath.message)
        return
    }
    vscode.workspace.openTextDocument(vscode.Uri.file(filePath))
        .then(doc => vscode.window.showTextDocument(doc))
        .then(() => {
            const editor = vscode.window.activeTextEditor
            const range = editor.document.lineAt(line-1).range
            editor.selection =  new vscode.Selection(range.start, range.end)
            editor.revealRange(range)
        })
}

function activate(context) {
    let myOutputChannel = null
    let disposable = vscode.commands.registerCommand('extension.CR-Load-File', function () {
        let line, file, stack
        try {
            ({stack, file, line} = JSON.parse(copyPaste.paste()))
        } catch (ex) {
            vscode.window.showInformationMessage(`Invalid clipboard object. ${ex}`)
            return
        }

        // No choice, the call stack only has one entry.
        // Display that file.
        if (stack.length === 1) {
            openDocument(line, file)
            return
        }

        // Display the choices and let the user pick.
        let callStack = []
        for (let i = stack.length - 1; i >= 0; --i) {
            callStack.push(`${stack[i].caller} (${stack[i].moduleName}:${stack[i].line})`)
        }

        vscode.window.showQuickPick(callStack)
            .then(item => {
                const matches = item.match(/([^(]*)\(([^:]+):([0-9]+)/)
                if ( matches )
                    openDocument(matches[3], matches[2])
            })
    })

    context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() {
}
exports.deactivate = deactivate
