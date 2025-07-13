// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {getWindow} from './getChatWindow';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	//Command for setting API key for the very specific openai
	context.subscriptions.push(
	vscode.commands.registerCommand('vsapilot.setApiKey', async () => {
		const key = await vscode.window.showInputBox({
		prompt: 'Enter your OpenRouter API key',
		ignoreFocusOut: true,
		password: true,
		});

		if (key) {
		await context.secrets.store('openrouterApiKey', key);
		vscode.window.showInformationMessage('API key saved securely.');
		}
	})
	);


	const disposable = vscode.commands.registerCommand('vsapilot.startvsa', () => {
		const panel = vscode.window.createWebviewPanel(
			'Vsapilot',
			'Visa UI Bot Chat',
			vscode.ViewColumn.One,
			{enableScripts: true}
		);
		panel.webview.onDidReceiveMessage(async (msg) => {
			if (msg.type === 'userMessage') {
				const reply = await getAIResponse(msg.payload, context);
				panel.webview.postMessage({
				type: 'botReply',
				payload: reply
				});
			}
		});
		panel.webview.html = getWindow();
	});

	context.subscriptions.push(disposable);
}
async function getAIResponse(userMessage: string, context: vscode.ExtensionContext): Promise<string> {
	const apiKey = await context.secrets.get('openrouterApiKey');
	if (!apiKey) {
    	vscode.window.showErrorMessage('API key not found. Please run "VSA: Set API Key".');
    	return 'API key missing.';
  	}
	const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization:': `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: 'openai/gpt-3.5-turbo',
			message: [
				{role: 'user', content: userMessage}
			]
		}),	
	});
	const data = await response.json();

	if (data.choices && data.choices.length > 0 ){
		return data.choices[0].message.content;
	} else{
		throw new Error('No response');
	}
}
// This method is called when your extension is deactivated
export function deactivate() {}
