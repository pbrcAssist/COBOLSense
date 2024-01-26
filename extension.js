const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Create an output channel
const outputChannel = vscode.window.createOutputChannel('CobolSense');

function activate(context) {
    let documentCommand = vscode.commands.registerCommand('cobol-sense.documentCommand', async() => {
        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Documenting code please wait...',
                cancellable: true
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

                if (apiResponse.includes('getaddrinfo ENOTFOUND cobolsenseapplication.azurewebsites.net')) {
                    vscode.window.showErrorMessage('Error: Unable to connect to the internet. Please check your network connection.');
                    return;
                }

                if (apiResponse.includes('Request failed with status code 500')) {
                    vscode.window.showErrorMessage('Error: Something went wrong, please try again.');
                    return;
                }

                outputChannel.appendLine('\n\nAPI Response for Code Documentation:');
                outputChannel.appendLine(apiResponse);
                //outputChannel.show();

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

                vscode.window.showInformationMessage('Code documentation generated successfully! Opening a new editor with the documentation.');
            });
        } catch (error) {
            if (error.message.includes('getaddrinfo ENOTFOUND cobolsenseapplication.azurewebsites.net')) {
                vscode.window.showErrorMessage('Error: Unable to connect to the internet. Please check your network connection.');
                return;
            }

            if (error.message.includes('Request failed with status code 500')) {
                vscode.window.showErrorMessage('Error: Something went wrong, please try again.');
                return;
            }

            outputChannel.appendLine('\n\nError calling backend API for Code Documentation:');
            outputChannel.appendLine(error.message);
            //outputChannel.show();

            vscode.window.showErrorMessage(`Error documenting code: ${error.message}`);
        }
    });

    let optimizeCommand = vscode.commands.registerCommand('cobol-sense.optimizeCommand', async() => {
        try {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                throw new Error('No active text editor');
            }

            // Capture the initial selection position
            const initialSelection = editor.selection;

            const selectedText = editor.document.getText(initialSelection);

            if (!selectedText) {
                throw new Error('No text selected');
            }

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Optimizing code please wait...',
                cancellable: true
            }, async(progress) => {
                const optimizedCode = await callBackendApiForCodeOptimization(selectedText);

                if (optimizedCode.includes('getaddrinfo ENOTFOUND cobolsenseapplication.azurewebsites.net')) {
                    vscode.window.showErrorMessage('Error: Unable to connect to the internet. Please check your network connection.');
                    return;
                }

                if (optimizedCode.includes('Request failed with status code 500')) {
                    vscode.window.showErrorMessage('Error: Something went wrong, please try again.');
                    return;
                }

                outputChannel.appendLine('\n\nOptimized Code:');
                outputChannel.appendLine(optimizedCode);
                // outputChannel.show();

                // Replace the initial selection with the optimized code
                editor.edit((editBuilder) => {
                    editBuilder.replace(initialSelection, optimizedCode);
                });

                vscode.window.showInformationMessage('Code optimization complete!');
            });
        } catch (error) {
            if (error.message.includes('getaddrinfo ENOTFOUND cobolsenseapplication.azurewebsites.net')) {
                vscode.window.showErrorMessage('Error: Unable to connect to the internet. Please check your network connection.');
                return;
            }

            if (error.message.includes('Request failed with status code 500')) {
                vscode.window.showErrorMessage('Error: Something went wrong, please try again.');
                return;
            }

            outputChannel.appendLine('\n\nError optimizing code:');
            outputChannel.appendLine(error.message);
            // outputChannel.show();

            vscode.window.showErrorMessage(`Error optimizing code: ${error.message}`);
        }
    });


    let generateCommand = vscode.commands.registerCommand('cobol-sense.generateCommand', async() => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage('No active text editor');
            return;
        }

        const originalCursorPosition = editor.selection.active;

        const userPrompt = await vscode.window.showInputBox({
            prompt: 'Enter your code generation prompt:',
            placeHolder: 'E.g., "Generate a function to calculate Fibonacci sequence"',
            value: ''
        });

        if (userPrompt === undefined || userPrompt.trim() === '') {
            // No prompt provided, return early
            return;
        }

        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Generating code please wait...',
                cancellable: true
            }, async(progress) => {
                const generatedCode = await callBackendApiForCodeGeneration(userPrompt);

                if (generatedCode.includes('getaddrinfo ENOTFOUND cobolsenseapplication.azurewebsites.net')) {
                    vscode.window.showErrorMessage('Error: Unable to connect to the internet. Please check your network connection.');
                    return;
                }

                if (generatedCode.includes('Request failed with status code 500')) {
                    vscode.window.showErrorMessage('Error: Something went wrong, please try again.');
                    return;
                }

                outputChannel.appendLine('\n\nGenerated Code:');
                outputChannel.appendLine(generatedCode);

                editor.edit((editBuilder) => {
                    editBuilder.insert(originalCursorPosition, generatedCode);
                });

                vscode.window.showInformationMessage('Generated code inserted at the cursor position.');
            });
        } catch (error) {
            if (error.message.includes('getaddrinfo ENOTFOUND cobolsenseapplication.azurewebsites.net')) {
                vscode.window.showErrorMessage('Error: Unable to connect to the internet. Please check your network connection.');
                return;
            }

            if (error.message.includes('Request failed with status code 500')) {
                vscode.window.showErrorMessage('Error: Something went wrong, please try again.');
                return;
            }

            outputChannel.appendLine('\n\nError generating code:');
            outputChannel.appendLine(error.message);

            vscode.window.showErrorMessage(`Error generating code: ${error.message}`);
        }
    });



    context.subscriptions.push(documentCommand, optimizeCommand, generateCommand);
}

async function callBackendApiForCodeGeneration(prompt) {
    outputChannel.appendLine('\n\nCode Generation Request:');
    outputChannel.appendLine(prompt);
    //outputChannel.show();

    const backendApiEndpoint = 'https://cobolsenseapplication.azurewebsites.net/api/CobolGeneration';

    return axios.post(backendApiEndpoint, { prompt })
        .then((response) => {
            const apiResponse = response.data;

            const contentMatches = apiResponse.match(/content=([\s\S]+?)(?=(, name=null, functionCall=null|$))/g);
            const generatedCode = contentMatches ? contentMatches.map(match => match.replace('content=', '').trim()).join('\n') : 'No optimized code found';

            return generatedCode;
        })
        .catch((error) => {
            outputChannel.appendLine('\n\nError calling backend API for code generation:');
            outputChannel.appendLine(error.message);
            //outputChannel.show();

            // throw new Error('Error generating code: ' + error.message);
            return error.message;
        });
}

async function callBackendApiForCodeOptimization(codeToOptimize) {
    outputChannel.appendLine('\n\nOptimized Code Request:');
    outputChannel.appendLine(codeToOptimize);
    //outputChannel.show();

    const backendApiEndpoint = 'https://cobolsenseapplication.azurewebsites.net/api/cobol-refactor';

    try {
        const response = await axios.post(backendApiEndpoint, { codeToOptimize });
        const apiResponse = response.data;

        outputChannel.appendLine('\n\nFull API Response:');
        outputChannel.appendLine(JSON.stringify(apiResponse, null, 2));
        //outputChannel.show();
        const contentMatches = apiResponse.match(/content=([\s\S]+?)(?=(, name=null, functionCall=null|$))/g);
        const optimizedCode = contentMatches ? contentMatches.map(match => match.replace('content=', '').trim()).join('\n') : 'No optimized code found';

        outputChannel.appendLine('\n\nOptimized Code:');
        outputChannel.appendLine(optimizedCode);
        //outputChannel.show();

        return optimizedCode;
    } catch (error) {
        outputChannel.appendLine('\n\nError calling backend API for optimizing code:');
        outputChannel.appendLine(error.message);
        //outputChannel.show();

        // throw new Error('Error optimizing code: ' + error.message);
        return error.message;
    }
}


async function callBackendApiForCodeDocumentation(selectedText) {
    outputChannel.appendLine('\n\nCode Documentation Request:');
    outputChannel.appendLine(selectedText);
    //outputChannel.show();

    const backendApiEndpoint = 'https://cobolsenseapplication.azurewebsites.net/api/cobol-documentation';

    try {
        const response = await axios.post(backendApiEndpoint, { selectedText });
        const apiResponse = response.data;

        outputChannel.appendLine('\n\nAPI Response for Code Documentation:');
        outputChannel.appendLine(apiResponse);
        //outputChannel.show();

        const contentMatches = apiResponse.match(/content=([\s\S]+?)(?=(, name=null, functionCall=null|$))/g);
        const finalContent = contentMatches ? contentMatches.map(match => match.replace('content=', '').trim()).join('\n') : 'No code found';

        // Return the content value
        return finalContent;
    } catch (error) {
        outputChannel.appendLine('\n\nError calling backend API for documentation:');
        outputChannel.appendLine(error.message);
        //outputChannel.show();

        // throw new Error('Error calling backend API: ' + error.message);
        return error.message;
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