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
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const module = item.dataset.module;
        this.switchModule(module);
        document.querySelectorAll('.nav-item').forEach(n => {
          n.classList.toggle('active', n.dataset.module === module);
        });
        this.updateNavBall();
      });
    });
    this.updateNavBall();
    window.addEventListener('resize', () => this.updateNavBall());
  },

  // 把液态小球移动到当前 active 导航项中心
  updateNavBall() {
    const bottomNav = document.getElementById('bottomNav');
    const active = bottomNav.querySelector('.nav-item.active');
    const ball = bottomNav.querySelector('.nav-ball');
    const track = bottomNav.querySelector('.nav-track');
    if (!active || !ball) return;
    const navRect = bottomNav.getBoundingClientRect();
    const itemRect = active.getBoundingClientRect();
    const centerX = itemRect.left - navRect.left + itemRect.width / 2;
    ball.style.left = centerX + 'px';
    // 轨道凹口位置：相对轨道宽度（轨道左右各留 14px）
    if (track) {
      const trackWidth = navRect.width - 28;
      const xPercent = ((centerX - 14) / trackWidth) * 100;
      track.style.setProperty('--ball-x', xPercent + '%');
    }
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
        this.updateNavBall();
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
