import * as vscode from 'vscode';
export function getWindow(webview: vscode.Webview, extensionUri: vscode.Uri): string {
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
      margin-bottom: 1rem;
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

    .code-block {
      position: relative;
      margin-top: 0.5rem;
    }

    .copy-btn {
      float: right;
      margin-bottom: 4px;
      background: #e2e8f0;
      border: none;
      padding: 4px 8px;
      font-size: 0.7rem;
      cursor: pointer;
      border-radius: 4px;
    }

    .copy-btn:hover {
      background: #cbd5e1;
    }

    pre {
      background: #1e1e1e;
      color: #f8f8f2;
      padding: 0.75rem;
      border-radius: 8px;
      overflow-x: auto;
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
