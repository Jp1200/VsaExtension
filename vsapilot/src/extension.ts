// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {getWindow} from './getChatWindow';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


	const disposable = vscode.commands.registerCommand('vsapilot.startvsa', () => {
		const panel = vscode.window.createWebviewPanel(
			'Vsapilot',
			'Visa UI Bot Chat',
			vscode.ViewColumn.One,
			{enableScripts: true}
		);
		console.log(getWindow());
		panel.webview.html = getWindow();
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
