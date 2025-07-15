const vscode = acquireVsCodeApi();
function appendParsedMessage(content, role) {
  const wrapper = document.createElement('div');
  wrapper.className = 'chat-bubble ' + role;


  const segments = content.split(/```/g);

  segments.forEach((seg, idx) => {
    if (idx % 2 === 0) {
      const p = document.createElement('p');
      p.textContent = seg.trim();
      wrapper.appendChild(p);
    } else {
     
      const codeContainer = document.createElement('div');
      codeContainer.className = 'code-block';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.innerText = '📋';
      copyBtn.title = 'Copy to clipboard';

      copyBtn.onclick = () => {
        navigator.clipboard.writeText(seg.trim());
        copyBtn.innerText = '✅';
        setTimeout(() => (copyBtn.innerText = '📋'), 1500);
      };

      const pre = document.createElement('pre');
      const codeElem = document.createElement('code');
      codeElem.textContent = seg.trim();

      pre.appendChild(codeElem);
      codeContainer.appendChild(copyBtn);
      codeContainer.appendChild(pre);
      wrapper.appendChild(codeContainer);
    }
  });

  const chatOutput = document.getElementById('chat-output');
  chatOutput.appendChild(wrapper);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

  function appendMessage(content, role) {
    const bubble = document.createElement('div');
    const chatOutput = document.getElementById('chat-output');
    bubble.className = 'chat-bubble ' + role;

    // API returns code blocks with triple back ticks so detect when text starts and ends with it
    if (content.startsWith("```") && content.endsWith("```")) {
      const code = content.slice(3, -3).trim();
      bubble.innerHTML = `<pre><code>${escapeHTML(code)}</code></pre>`;
    } else {
      bubble.textContent = content;
    }

    chatOutput.appendChild(bubble);
    chatOutput.scrollTop = chatOutput.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
  }
window.addEventListener('message', event => {
  const msg = event.data;
  if (msg.type === 'botReply') {
    appendParsedMessage(msg.payload, 'assistant');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('chat-input');
  const submitBtn = document.getElementById('submit-btn');
  const chatOutput = document.getElementById('chat-output');
  const mock = false;

  textarea.defaultValue = 'Using only the UI Components found at this url: "https://design.visa.com/components/", create any new content strictly with the library of UI components at that url. When asked to give references to UI components make a list of components used for the final product.';

  function autoResize() {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  function generateMockResponse(userMessage) {
    return {
      id: "msg_" + Math.floor(Math.random() * 10000),
      role: "assistant",
      content: "```js\nfunction greet() {\n  return 'Hello';\n}\n```",
      created: Math.floor(Date.now() / 1000)
    };
  }

  function handleSubmit() {
    const message = textarea.value.trim();
    if (!message) {return;}

    appendMessage(message, 'user');

    vscode.postMessage({
      type: 'userMessage',
      payload: message
    });

    if (mock) {
      const response = generateMockResponse(message);
      setTimeout(() => {
        appendMessage(response.content, 'assistant');
      }, 500);
    }

    textarea.value = '';
    autoResize();
  }

  textarea.addEventListener('input', autoResize);
  submitBtn.addEventListener('click', handleSubmit);

  autoResize();
});
