/* ===== 寻萃集 · 主应用 ===== */
const App = {
  init() {
    this.injectIcons();
    this.initNavigation();
    this.renderDiscover();
    LearnModule.init();
    BrewModule.init();
    AIModule.init();
    this.updateUnlockCount();
  },

  // 注入所有 Lucide 图标
  injectIcons() {
    document.getElementById('logoIcon').innerHTML = icon('coffee', 22);
    document.getElementById('logoIconSide').innerHTML = icon('coffee', 22);
    document.getElementById('backIcon').innerHTML = icon('arrowLeft', 16);
    document.getElementById('freeBackIcon').innerHTML = icon('arrowLeft', 16);
    document.getElementById('sendIcon').innerHTML = icon('send', 18);
    document.getElementById('phIcon').innerHTML = icon('book', 32);
    document.getElementById('hintIcon').innerHTML = icon('sparkles', 14);
    document.getElementById('aiAvatar').innerHTML = icon('bean', 18);
    document.getElementById('completeContinue').insertAdjacentHTML('afterbegin', icon('sparkles', 16));
    // 悬浮小助手（咖啡豆头像）
    document.getElementById('aiFloatIcon').innerHTML = icon('bean', 26);
    document.getElementById('aiPanelIcon').innerHTML = icon('bean', 18);
    document.getElementById('aiPanelClose').innerHTML = icon('x', 18);

    // 导航图标
    document.querySelectorAll('[data-icon]').forEach(el => {
      el.innerHTML = icon(el.dataset.icon, 20);
    });

    // 悬浮面板开关
    const floatBtn = document.getElementById('aiFloatBtn');
    const panel = document.getElementById('aiPanel');
    const closeBtn = document.getElementById('aiPanelClose');
    floatBtn.addEventListener('click', () => panel.classList.toggle('open'));
    closeBtn.addEventListener('click', () => panel.classList.remove('open'));

    // 手机端软键盘弹起时，把 AI 面板底部上推，避免输入框被挡
    if (window.visualViewport) {
      const adjustPanel = () => {
        if (window.innerWidth >= 900) return;
        const kbHeight = window.innerHeight - window.visualViewport.height;
        panel.style.bottom = kbHeight > 0 ? kbHeight + 'px' : '0px';
      };
      window.visualViewport.addEventListener('resize', adjustPanel);
      window.visualViewport.addEventListener('scroll', adjustPanel);
    }
  },

  initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const module = item.dataset.module;
        this.switchModule(module);
        document.querySelectorAll('.nav-item').forEach(n => {
          n.classList.toggle('active', n.dataset.module === module);
        });
      });
    });
  },

  switchModule(name) {
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    const target = document.getElementById(`module-${name}`);
    if (target) target.classList.add('active');
    document.getElementById('mainContent').scrollTop = 0;
  },

  // 模块一：认识器具
  renderDiscover() {
    const grid = document.getElementById('toolGrid');
    grid.innerHTML = TOOLS.map(t => `
      <div class="tool-card" data-id="${t.id}">
        <div class="tool-icon">${SVGTools.toolIcon(t.id)}</div>
        <div class="tool-name">${t.name}</div>
        <div class="tool-tag">${t.method}</div>
        <div class="tool-desc">${t.desc}</div>
      </div>
    `).join('');

    grid.querySelectorAll('.tool-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        this.switchModule('learn');
        document.querySelectorAll('.nav-item').forEach(n => {
          n.classList.toggle('active', n.dataset.module === 'learn');
        });
        LearnModule.selectTool(id);
        document.querySelectorAll('.learn-tool-chip').forEach(c => {
          c.classList.toggle('active', c.dataset.id === id);
        });
      });
    });
  },

  updateUnlockCount() {
    const progress = loadProgress();
    const total = TOOLS.length;
    const unlocked = progress.unlocked.length;
    document.getElementById('unlockCount').textContent = `已解锁 ${unlocked} / ${total}`;
  }
};

// Toast
let toastTimer = null;
function showToast(msg, iconName = 'sparkles') {
  const toast = document.getElementById('toast');
  toast.innerHTML = `<span style="display:flex;align-items:center;">${icon(iconName, 16)}</span><span>${msg}</span>`;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

document.addEventListener('DOMContentLoaded', () => App.init());
