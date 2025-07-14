/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(__webpack_require__(1));
const getChatWindow_1 = __webpack_require__(2);
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
        return 'There was an error from OpenRouter';
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


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getWindow = getWindow;
const vscode = __importStar(__webpack_require__(1));
function getWindow(webview, extensionUri) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'script.js'));
    return /*html*/ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Chat window</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      font-family: system-ui, sans-serif;
      background-color: #f7f7f8;
    }

    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      justify-content: flex-end;
    }

    .input-wrapper {
      display: flex;
      justify-content: center;
      padding: 1rem;
      background: #ffffff;
      border-top: 1px solid #ddd;
    }

    .input-box {
      width: 70%;
      background-color: #ffffff;
      border: 1px solid #ccc;
      border-radius: 0.75rem;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }

    .textarea-container {
      width: 100%;
      display: flex;
    }

    textarea {
      flex: 1;
      border: none;
      resize: none;
      font-size: 1rem;
      padding: 0;
      outline: none;
      background-color: transparent;
      min-height: 40px;
      max-height: 200px;
      overflow-y: auto;
      line-height: 1.4;
    }
    textarea:focus {
      outline: none;
      border: none;
    }

    .input-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 0.5rem;
    }

    button {
      padding: 6px 14px;
      font-size: 0.85rem;
      background-color: #222226ff;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    button:hover {
      background-color: #37373aff;
    }

    button:disabled {
      background-color: #d6d4d4ff;
      cursor: not-allowed;
    }
    pre {
      background-color: #f5f5f5;
      padding: 0.75rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      font-family: monospace;
      font-size: 0.9rem;
      line-height: 1.4;
  }
    .chat-output {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border-bottom: 1px solid #ddd;
    }

    .chat-bubble {
      max-width: 75%;
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      line-height: 1.4;
      white-space: pre-wrap;
    }

    .user {
      align-self: flex-end;
      background-color: #dbeafe;
      color: #1e40af;
    }

    .assistant {
      align-self: flex-start;
      background-color: #e5e7eb;
      color: #111827;
    }

    textarea::-webkit-scrollbar-thumb {
      background-color: rgba(120, 14, 14, 0.3) !important;
      border-radius: 5px !important;
      border: 2px solid #f0f0f0 !important;
    }
  </style>
</head>
<body>

  <div class="chat-container">
    <div id="chat-output" class="chat-output"></div>
    <div class="input-wrapper">
      <div class="input-box">
        <div class="textarea-container">
          <textarea
            id="chat-input"
            placeholder="Send a message..."
            rows="1"
          ></textarea>
        </div>
        <div class="input-actions">
          <button id="submit-btn">></button>
        </div>
      </div>
    </div>
  </div>
<script src="${scriptUri}"></script>

</body>
</html>
  `;
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map