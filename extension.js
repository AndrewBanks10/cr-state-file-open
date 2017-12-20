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

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.CR-Load-File', function () {
        let line, file
        try {
            ({file, line} = JSON.parse(copyPaste.paste()))
        } catch (ex) {
            vscode.window.showInformationMessage(`Invalid clipboard object. ${ex}`)
            return
        }

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
    })

    context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() {
}
exports.deactivate = deactivate
