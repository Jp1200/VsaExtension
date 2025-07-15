import * as vscode from 'vscode';
export function getWindow(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'script.js'));
  return /*html*/ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet">

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
      font-size: 1rem;
      opacity: 0;
      transform: translateY(10px);
      animation: fadeInUp 0.3s ease forwards;
    }
    @keyframes fadeInUp{
       to{
        opacity:1;
        transform:translateY(0);
       }
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
      background-color: #f4f4f5;
      border-radius: 8px;
      overflow-x: auto;
      margin-top: 0.5rem;
    }

    .code-block pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: monospace;
      font-size: 0.85rem;
      color: white;
    }
    .code-block code{
      font-family: 'Fira Code', 'Source Code Pro', monospace;
      font-size: 0.85rem;
      line-height: 1.4;
      color: white;
      background-color: transparent;
      display: block;
      white-space: pre-wrap;
    }
    .copy-btn {
      position: absolute;
      top: 0px;
      right: 0px;
      background: #1e1e1e;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
      cursor: pointer;
      z-index: 1;
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
