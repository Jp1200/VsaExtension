// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vsapilot" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('vsapilot.startvsa', () => {
		const panel = vscode.window.createWebviewPanel(
			'Vsapilot',
			'Visa UI Bot Chat',
			vscode.ViewColumn.One,
			{enableScripts: true}
		);
		panel.webview.html = getWindow();
	});

	context.subscriptions.push(disposable);
}
function getWindow(): string {
	return /*html*/`
	<!DOCTYPE html>
	<html lang="en">
	<head>
	  <meta charset="UTF-8" />
	  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	  <title>Chat Area</title>
	  <style>
		html, body {
		  height: 100%;
		  margin: 0;
		  font-family: system-ui, sans-serif;
		  background-color: #f0f0f0;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		}
	
		.textarea-container {
		  width: 100%;
		  max-width: 700px;
		  padding: 1rem;
		}
	
		textarea {
		  width: 100%;
		  min-height: 140px;
		  padding: 1rem;
		  font-size: 1rem;
		  color: #333;
		  background-color: #fff;
		  border: 1px solid #d1d5db;
		  border-radius: 0.75rem;
		  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		  resize: vertical;
		  outline: none;
		  transition: border 0.2s ease, box-shadow 0.2s ease;
		}
	
		textarea:focus {
		  border-color: #4f46e5; /* Indigo-600 */
		  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); /* Indigo focus ring */
		}
	  </style>
	</head>
	<body>
	
	  <div class="textarea-container">
		<textarea placeholder="Type something thoughtful here..."></textarea>
	  </div>
	
	</body>
	</html>
	
	`;
}
// This method is called when your extension is deactivated
export function deactivate() {}
