const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Create an output channel
const outputChannel = vscode.window.createOutputChannel('CobolSense');

function activate(context) {
    let documentCommand = vscode.commands.registerCommand('cobol-sense.documentCommand', async() => {
        // const response = await vscode.window.showQuickPick(['Add tags on header and footer', 'Add tags per line', 'No'], { placeHolder: 'Do you want to add cobol tags?' });

        // if (response === 'Yes') {
        //     vscode.window.showInformationMessage('You selected Yes!');
        // } else if (response === 'No') {
        //     vscode.window.showInformationMessage('You selected No.');
        // } else {
        //     vscode.window.showInformationMessage('You did not make a selection.');
        // }

        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Processing...',
                cancellable: false
            }, async(progress) => {
                const editor = vscode.window.activeTextEditor;

                if (!editor) {
                    throw new Error('No active text editor');
                }

                const selectedText = editor.document.getText(editor.selection);

                if (!selectedText) {
                    throw new Error('No text selected');
                }

                const apiResponse = await callBackendApiForCodeDocumentation(selectedText);

                outputChannel.appendLine('\n\nAPI Response for Code Documentation:');
                outputChannel.appendLine(apiResponse);
                outputChannel.show();

                const currentDate = new Date();
                const fileName = `cobol-sense-documentation-${formatDate(currentDate)}.txt`;

                const uri = vscode.Uri.file(path.join(context.extensionPath, fileName));

                const newContent = `Cobol Sense Generated Documentation: \n\n`;

                await vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(newContent));

                const doc = await vscode.workspace.openTextDocument(uri);
                const newEditor = await vscode.window.showTextDocument(doc);

                newEditor.edit((editBuilder) => {});

                const currentPosition = new vscode.Position(newEditor.document.lineCount + 1, 0);
                newEditor.edit((editBuilder) => {
                    editBuilder.insert(currentPosition, `\n${apiResponse}`);
                });

                vscode.window.showInformationMessage('Editor opened, content inserted, and API response appended.');
            });
        } catch (error) {
            outputChannel.appendLine('\n\nError calling backend API for Code Documentation:');
            outputChannel.appendLine(error.message);
            outputChannel.show();

            vscode.window.showErrorMessage(`Error calling backend API for Code Documentation: ${error.message}`);
        }
    });

    let optimizeCommand = vscode.commands.registerCommand('cobol-sense.optimizeCommand', async() => {
        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Optimizing Code...',
                cancellable: false
            }, async(progress) => {
                const editor = vscode.window.activeTextEditor;

                if (!editor) {
                    throw new Error('No active text editor');
                }

                const selectedText = editor.document.getText(editor.selection);

                if (!selectedText) {
                    throw new Error('No text selected');
                }

                const optimizedCode = await callBackendApiForCodeOptimization(selectedText);

                outputChannel.appendLine('\n\nOptimized Code:');
                outputChannel.appendLine(optimizedCode);
                outputChannel.show();

                editor.edit((editBuilder) => {
                    editBuilder.replace(editor.selection, optimizedCode);
                });

                vscode.window.showInformationMessage('Code optimization complete!');
            });
        } catch (error) {
            outputChannel.appendLine('\n\nError optimizing code:');
            outputChannel.appendLine(error.message);
            outputChannel.show();

            vscode.window.showErrorMessage(`Error optimizing code: ${error.message}`);
        }
    });

    let generateCommand = vscode.commands.registerCommand('cobol-sense.generateCommand', async() => {
        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Generating Code...',
                cancellable: false
            }, async(progress) => {
                const editor = vscode.window.activeTextEditor;

                if (!editor) {
                    throw new Error('No active text editor');
                }

                const userPrompt = await vscode.window.showInputBox({
                    prompt: 'Enter your code generation prompt:',
                    placeHolder: 'E.g., "Generate a function to calculate Fibonacci sequence"',
                    value: ''
                });

                if (userPrompt === undefined) {
                    return;
                }

                const generatedCode = await callBackendApiForCodeGeneration(userPrompt);

                outputChannel.appendLine('\n\nGenerated Code:');
                outputChannel.appendLine(generatedCode);
                outputChannel.show();

                const currentPosition = editor.selection.active;
                editor.edit((editBuilder) => {
                    editBuilder.insert(currentPosition, generatedCode);
                });

                vscode.window.showInformationMessage('Generated code inserted at the cursor position.');
            });
        } catch (error) {
            outputChannel.appendLine('\n\nError generating code:');
            outputChannel.appendLine(error.message);
            outputChannel.show();

            vscode.window.showErrorMessage(`Error generating code: ${error.message}`);
        }
    });

    context.subscriptions.push(documentCommand, optimizeCommand, generateCommand);
}

async function callBackendApiForCodeGeneration(prompt) {
    outputChannel.appendLine('\n\nCode Generation Request:');
    outputChannel.appendLine(prompt);
    outputChannel.show();

    const backendApiEndpoint = 'https://cobolsenseapplication.azurewebsites.net/api/CobolGeneration';

    return axios.post(backendApiEndpoint, { prompt })
        .then((response) => {
            const generatedCode = response.data;
            return generatedCode;
        })
        .catch((error) => {
            outputChannel.appendLine('\n\nError calling backend API for code generation:');
            outputChannel.appendLine(error.message);
            outputChannel.show();

            // throw new Error('Error generating code: ' + error.message);
            return '============= Mock response generate code ============';
        });
}

async function callBackendApiForCodeOptimization(codeToOptimize) {
    outputChannel.appendLine('\n\nOptimized Code Request:');
    outputChannel.appendLine(codeToOptimize);
    outputChannel.show();

    const backendApiEndpoint = 'https://cobolsenseapplication.azurewebsites.net/api/cobol-refactor';

    try {
        const response = await axios.post(backendApiEndpoint, { codeToOptimize });
        const apiResponse = response.data;

        outputChannel.appendLine('\n\nFull API Response:');
        outputChannel.appendLine(JSON.stringify(apiResponse, null, 2));
        outputChannel.show();
        const contentMatches = apiResponse.match(/content=([\s\S]+?)(?=(, name=null, functionCall=null|$))/g);
        const optimizedCode = contentMatches ? contentMatches.map(match => match.replace('content=', '').trim()).join('\n') : 'No optimized code found';

        outputChannel.appendLine('\n\nOptimized Code:');
        outputChannel.appendLine(optimizedCode);
        outputChannel.show();

        return optimizedCode;
    } catch (error) {
        outputChannel.appendLine('\n\nError calling backend API for optimizing code:');
        outputChannel.appendLine(error.message);
        outputChannel.show();

        // throw new Error('Error optimizing code: ' + error.message);
        return '============= Mock response optimizing code ============';
    }
}


async function callBackendApiForCodeDocumentation(selectedText) {
    outputChannel.appendLine('\n\nCode Documentation Request:');
    outputChannel.appendLine(selectedText);
    outputChannel.show();

    const backendApiEndpoint = 'https://cobolsenseapplication.azurewebsites.net/api/cobol-documentation';

    try {
        const response = await axios.post(backendApiEndpoint, { selectedText });
        const apiResponse = response.data;

        outputChannel.appendLine('\n\nAPI Response for Code Documentation:');
        outputChannel.appendLine(apiResponse);
        outputChannel.show();

        const contentMatches = apiResponse.match(/content=([\s\S]+?)(?=(, name=null, functionCall=null|$))/g);
        const finalContent = contentMatches ? contentMatches.map(match => match.replace('content=', '').trim()).join('\n') : 'No code found';

        // Return the content value
        return finalContent;
    } catch (error) {
        outputChannel.appendLine('\n\nError calling backend API for documentation:');
        outputChannel.appendLine(error.message);
        outputChannel.show();

        // throw new Error('Error calling backend API: ' + error.message);
        return '============= Mock response documentation ============';
    }
}


function formatDate(date) {
    return date.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};