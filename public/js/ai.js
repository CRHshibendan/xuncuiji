/* ===== 模块四：AI 答疑 ===== */
const AIModule = {
  chatHistory: [],
  // 冲煮过程中的错误计数
  brewErrorCount: {},

  init() {
    this.bindChat();
  },

  bindChat() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');

    const send = () => {
      const text = input.value.trim();
      if (!text) return;
      this.sendMessage(text);
      input.value = '';
    };

    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') send();
    });

    // 快捷问题
    document.querySelectorAll('.quick-q').forEach(btn => {
      btn.addEventListener('click', () => this.sendMessage(btn.textContent));
    });
  },

  addMessage(role, text) {
    const container = document.getElementById('chatMessages');
    const msg = document.createElement('div');
    msg.className = `chat-msg ${role}`;
    msg.innerHTML = `
      <div class="msg-avatar">${role === 'ai' ? icon('bean', 18) : icon('coffee', 18)}</div>
      <div class="msg-bubble ${text === '' ? 'typing' : ''}">${text || ''}</div>
    `;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
    return msg;
  },

  async sendMessage(text) {
    this.chatHistory.push({ role: 'user', content: text });
    this.addMessage('user', text);

    const loadingMsg = this.addMessage('ai', '');
    const bubble = loadingMsg.querySelector('.msg-bubble');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: this.chatHistory })
      });
      const data = await res.json();

      bubble.classList.remove('typing');
      if (data.ok) {
        bubble.textContent = data.content;
        this.chatHistory.push({ role: 'assistant', content: data.content });
      } else {
        bubble.textContent = data.message || 'AI 暂时开小差了，请稍后再试～';
      }
    } catch (err) {
      bubble.classList.remove('typing');
      bubble.textContent = '网络异常，请检查后端服务是否启动。';
    }
  },

  // 冲煮过程中：用户操作出错时主动提示
  async triggerHint(toolName, stepName, userAction, stepId) {
    this.brewErrorCount[stepId] = (this.brewErrorCount[stepId] || 0) + 1;
    const count = this.brewErrorCount[stepId];

    // 出错 2 次以上才提示
    if (count < 2) return;

    const bubble = document.getElementById('aiHintBubble');
    const content = document.getElementById('aiHintContent');
    content.textContent = '正在思考…';
    bubble.classList.remove('hidden');

    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: toolName,
          step: stepName,
          userAction,
          errorCount: count
        })
      });
      const data = await res.json();
      if (data.ok) {
        content.textContent = data.content;
      } else {
        content.textContent = '再试试看～注意观察当前步骤的提示哦。';
      }
    } catch (e) {
      content.textContent = '再试试看～注意观察当前步骤的提示哦。';
    }
  },

  resetErrorCount(stepId) {
    delete this.brewErrorCount[stepId];
  },

  closeHint() {
    document.getElementById('aiHintBubble').classList.add('hidden');
  }
};
