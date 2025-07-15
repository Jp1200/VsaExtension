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
			{
				enableScripts: true,
				localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')],
			}
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
		panel.webview.html = getWindow(panel.webview, context.extensionUri);
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
			'Authorization': `Bearer ${apiKey}`,
			'HTTP-Referer': 'http://localhost',
			'X-Title': 'VSCode Extension'
			},
		body: JSON.stringify({
			model: 'openai/gpt-3.5-turbo-0613',
			messages: [
				{role: 'user', content: userMessage}
			]
		}),	
	});
	if (!response.ok) {
		console.error('OpenRouter Error:', response.status);
		const errorText = await response.text();
		console.error(errorText);
		return `There was an error from OpenRouter \n ${errorText} \n ${response.status === 401 ?
			 'Missing OpenRouter API Key -> Open command palette (Ctrl/Cmd+Shift+P) and type: Visa UI: Set API Key' 
			 : response.status}`;
	}
	const data: any = await response.json();

	if (data.choices && data.choices.length > 0 ){
		return data.choices[0].message.content;
	} else{
		throw new Error('No response');
	}
}
// This method is called when your extension is deactivated
export function deactivate() {}
