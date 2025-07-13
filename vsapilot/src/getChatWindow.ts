
export function getWindow(): string {
	return /*html*/`
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
	textarea:focus{
		outline:none;
		border:none;
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
    <div id="chat-output" class="chat-output">
      
    </div>
    <div class="input-wrapper">
      <div class="input-box">
        <div class="textarea-container">
        
          <textarea 
            id="chat-input" 
            placeholder="Send a message..." 
            rows="1"
            oninput="autoResize(this)"
          ></textarea>
          
        </div>
        <div class="input-actions">
          <button id="submit-btn" onclick="handleSubmit()">></button>
        </div>
      </div>
    </div>
  </div>

  <script>
    function autoResize(textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
    function generateMockResponse(userMessage) {
      return {
        id: "msg_" + Math.floor(Math.random() * 10000),
        role: "assistant",
        content: "You said: \"" + userMessage + "\". Here's a thoughtful response from your AI assistant.",
        created: Math.floor(Date.now() / 1000)
      };
    }
     function appendMessage(content, role) {
      const container = document.getElementById("chat-output");
      const bubble = document.createElement("div");
      bubble.className = "chat-bubble " + role;
      bubble.textContent = content;
      container.appendChild(bubble);
      container.scrollTop = container.scrollHeight;
    }
    function handleSubmit() {
      const input = document.getElementById('chat-input');
      const message = input.value.trim();
      if(!message) return;
      appendMessage(message, "user");
      const response = generateMockResponse(message);
      setTimeout(() => {
        appendMessage(response.content, "assistant");
      }, 600);

      console.log('Submitted:', message);
      input.value = '';
      autoResize(input);
    
    }

  </script>

</body>
</html>

	`;
}