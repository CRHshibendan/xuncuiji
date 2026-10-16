/* ===== 模块二：选择并学习器具 ===== */
const LearnModule = {
  currentToolId: null,
  scrolledToBottom: false,

  init() {
    this.renderToolList();
  },

  renderToolList() {
    const list = document.getElementById('learnToolList');
    const progress = loadProgress();
    list.innerHTML = TOOLS.map(t => {
      const isUnlocked = progress.unlocked.includes(t.id);
      return `<div class="learn-tool-chip ${isUnlocked ? '' : ''}" data-id="${t.id}">
        ${isUnlocked ? '✓ ' : ''}${t.name}
      </div>`;
    }).join('');

    list.querySelectorAll('.learn-tool-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const id = chip.dataset.id;
        this.selectTool(id);
      });
    });
  },

  selectTool(id) {
    this.currentToolId = id;
    const tool = TOOLS.find(t => t.id === id);
    const progress = loadProgress();
    const isUnlocked = progress.unlocked.includes(id);
    this.scrolledToBottom = false;

    // 高亮选中
    document.querySelectorAll('.learn-tool-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.id === id);
    });

    const main = document.getElementById('learnMain');
    main.innerHTML = `
      <div class="learn-content">
        <div class="learn-hero">
          <div class="hero-emoji">${SVGTools.toolIcon(tool.id)}</div>
          <div class="hero-info">
            <h2>${tool.name}</h2>
            <p>${tool.method} · ${tool.desc}</p>
          </div>
        </div>

        <div class="learn-section">
          <h3>🔧 器具结构</h3>
          <div class="structure-diagram">
            ${tool.structure.map(s => `<div class="structure-part">${s.name}</div>`).join('')}
          </div>
          <ul style="margin-top:10px;">
            ${tool.structure.map(s => `<li><b>${s.name}</b>：${s.desc}</li>`).join('')}
          </ul>
        </div>

        <div class="learn-section">
          <h3>📋 使用方法</h3>
          <ol style="padding-left:20px;">
            ${tool.usage.map(u => `<li>${u}</li>`).join('')}
          </ol>
        </div>

        <div class="learn-section">
          <h3>💡 冲煮原理</h3>
          <p>${tool.principle}</p>
        </div>

        ${isUnlocked
          ? `<div class="unlock-status">${icon('check', 18)} 此器具已解锁，可前往「冲煮工坊」使用</div>`
          : `<button class="unlock-btn" id="unlockBtn" disabled>${icon('lock', 18)} <span>向下滚动阅读完整内容后解锁</span></button>`
        }
      </div>
    `;

    if (!isUnlocked) {
      const btn = document.getElementById('unlockBtn');
      let unlocked = false;
      const checkScroll = () => {
        if (unlocked) return;
        // 检查学习内容容器是否滚到底
        const atBottom = main.scrollTop + main.clientHeight >= main.scrollHeight - 30;
        // 兼容内容不够长无需滚动的情况
        const noScroll = main.scrollHeight <= main.clientHeight + 10;
        if (atBottom || noScroll) {
          unlocked = true;
          btn.disabled = false;
          btn.innerHTML = icon('sparkles', 18) + ' <span>解锁此器具</span>';
        }
      };
      main.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('scroll', checkScroll, { passive: true });
      // 内容渲染后立即检查一次
      setTimeout(checkScroll, 100);

      btn.addEventListener('click', () => this.unlockTool(id));
    }
  },

  unlockTool(id) {
    const progress = loadProgress();
    if (!progress.unlocked.includes(id)) {
      progress.unlocked.push(id);
      saveProgress(progress);
      showToast(`🎉 已解锁「${TOOLS.find(t=>t.id===id).name}」`);
      this.selectTool(id);
      this.renderToolList();
      App.updateUnlockCount();
      BrewModule.renderSelector();
    }
  }
};
