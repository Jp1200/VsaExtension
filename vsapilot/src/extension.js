"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const getChatWindow_1 = require("./getChatWindow");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    //Command for setting API key for the very specific openai
    context.subscriptions.push(vscode.commands.registerCommand('vsapilot.setApiKey', async () => {
        const key = await vscode.window.showInputBox({
            prompt: 'Enter your OpenRouter API key',
            ignoreFocusOut: true,
            password: true,
        });
        if (key) {
            await context.secrets.store('openrouterApiKey', key);
            vscode.window.showInformationMessage('API key saved securely.');
        }
    }));
    const disposable = vscode.commands.registerCommand('vsapilot.startvsa', () => {
        const panel = vscode.window.createWebviewPanel('Vsapilot', 'Visa UI Bot Chat', vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')],
        });
        panel.webview.onDidReceiveMessage(async (msg) => {
            if (msg.type === 'userMessage') {
                const reply = await getAIResponse(msg.payload, context);
                panel.webview.postMessage({
                    type: 'botReply',
                    payload: reply
                });
            }
        });
        panel.webview.html = (0, getChatWindow_1.getWindow)(panel.webview, context.extensionUri);
    });
    context.subscriptions.push(disposable);
}
async function getAIResponse(userMessage, context) {
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
                { role: 'user', content: userMessage }
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
    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
    }
    else {
        throw new Error('No response');
    }
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map