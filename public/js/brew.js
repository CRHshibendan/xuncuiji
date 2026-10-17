/* ===== 模块三：交互游戏式冲煮教学（SVG 高保真版） ===== */
const BrewModule = {
  currentTool: null,
  currentStepIdx: 0,
  state: {},
  currentSkin: 'default',

  init() {
    this.renderSelector();
    document.getElementById('brewBackBtn').addEventListener('click', () => this.exitBrew());
    document.getElementById('aiHintClose').addEventListener('click', () => AIModule.closeHint());
    document.getElementById('completeContinue').addEventListener('click', () => this.exitBrew());
    // 模式选择
    document.getElementById('modeBackBtn').addEventListener('click', () => this.backToSelector());
    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.dataset.mode;
        if (mode === 'free' && card.classList.contains('locked')) {
          showToast('先完成一次教学冲煮来解锁自由模式');
          return;
        }
        this.enterMode(mode);
      });
    });
    // 自由冲煮
    document.getElementById('freeBackBtn').addEventListener('click', () => this.exitFreeBrew());
    document.getElementById('serveBtn').addEventListener('click', () => this.serveToCustomer());
    document.getElementById('resultRetryBtn').addEventListener('click', () => this.retryFreeBrew());
    document.getElementById('resultExitBtn').addEventListener('click', () => this.exitFreeBrew());
  },

  renderSelector() {
    const grid = document.getElementById('brewToolGrid');
    const progress = loadProgress();
    const unlockedTools = TOOLS.filter(t => progress.unlocked.includes(t.id));

    if (unlockedTools.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-soft);padding:40px;display:flex;flex-direction:column;align-items:center;gap:12px;">
        <div style="width:60px;height:60px;border-radius:50%;background:var(--bg-warm);display:flex;align-items:center;justify-content:center;color:var(--text-faint);">${icon('lock', 28)}</div>
        <div>还没有解锁任何器具<br><br>先去「学习」模块读完器具介绍来解锁吧～</div>
      </div>`;
      return;
    }

    grid.innerHTML = unlockedTools.map(t => {
      const hasPremium = progress.skins[t.id]?.premium;
      return `<div class="brew-tool-card" data-id="${t.id}">
        ${hasPremium ? '<div class="skin-tag">' + icon('sparkles', 10) + ' 皮肤</div>' : ''}
        <div class="emoji">${SVGTools.toolIcon(t.id)}</div>
        <div class="name">${t.name}</div>
      </div>`;
    }).join('');

    grid.querySelectorAll('.brew-tool-card').forEach(card => {
      card.addEventListener('click', () => this.startBrew(card.dataset.id));
    });
  },

  startBrew(toolId) {
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool || !tool.hasFullFlow || tool.brewSteps.length === 0) {
      showToast('该器具的冲煮教学即将上线，敬请期待～');
      return;
    }
    this.currentTool = tool;

    const progress = loadProgress();
    const hasPremium = progress.skins[tool.id]?.premium;

    document.getElementById('brewSelector').classList.add('hidden');
    document.getElementById('modeSelector').classList.remove('hidden');
    document.getElementById('modeToolName').textContent = tool.name;

    const freeCard = document.getElementById('freeModeCard');
    if (hasPremium) {
      freeCard.classList.remove('locked');
      document.getElementById('freeModeLock').style.display = 'none';
    } else {
      freeCard.classList.add('locked');
      document.getElementById('freeModeLock').style.display = 'block';
    }
  },

  backToSelector() {
    document.getElementById('modeSelector').classList.add('hidden');
    document.getElementById('brewSelector').classList.remove('hidden');
  },

  enterMode(mode) {
    document.getElementById('modeSelector').classList.add('hidden');
    if (mode === 'guide') {
      this.currentStepIdx = 0;
      this.state = {};
      this.currentSkin = 'default';
      document.getElementById('brewStage').classList.remove('hidden');
      this.renderSkinSwitcher();
      this.renderStep();
    } else {
      this.startFreeBrew();
    }
  },

  renderSkinSwitcher() {
    const container = document.getElementById('skinSwitcher');
    const progress = loadProgress();
    const skins = this.currentTool.skins;
    container.innerHTML = skins.map(s => {
      const isUnlocked = s.id === 'default' || progress.skins[this.currentTool.id]?.[s.id];
      return `<div class="skin-dot ${this.currentSkin === s.id ? 'active' : ''}" 
              data-skin="${s.id}" 
              style="background:${s.color};${isUnlocked ? '' : 'opacity:0.3;'}"
              title="${s.name}${isUnlocked ? '' : ' (未解锁)'}"></div>`;
    }).join('');

    container.querySelectorAll('.skin-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const skinId = dot.dataset.skin;
        const isUnlocked = skinId === 'default' || progress.skins[this.currentTool.id]?.[skinId];
        if (!isUnlocked) {
          showToast('完成一次冲煮即可解锁此皮肤');
          return;
        }
        this.currentSkin = skinId;
        this.renderSkinSwitcher();
        this.renderStep();
      });
    });
  },

  exitBrew() {
    document.getElementById('brewStage').classList.add('hidden');
    document.getElementById('brewComplete').classList.add('hidden');
    document.getElementById('brewSelector').classList.remove('hidden');
    this.currentTool = null;
    AIModule.brewErrorCount = {};
    this.renderSelector();
  },

  renderStep() {
    const step = this.currentTool.brewSteps[this.currentStepIdx];
    const tool = this.currentTool;
    const canvas = document.getElementById('brewCanvas');

    const total = tool.brewSteps.length;
    document.getElementById('progressFill').style.width = `${(this.currentStepIdx / total) * 100}%`;
    document.getElementById('progressText').textContent = `${this.currentStepIdx + 1} / ${total}`;

    document.getElementById('instructionStep').textContent = `步骤 ${this.currentStepIdx + 1}：${step.name}`;
    document.getElementById('instructionDesc').textContent = step.desc;
    document.getElementById('instructionTip').textContent = step.tip;

    AIModule.closeHint();

    canvas.innerHTML = '';

    if (tool.id === 'chemex' || tool.id === 'melitta') this.renderPourOverScene(step);
    else if (tool.id === 'frenchpress') this.renderFrenchPressScene(step);
    else if (tool.id === 'moka') this.renderMokaScene(step);
    else if (tool.id === 'siphon') this.renderSiphonScene(step);
  },

  // ============ 手冲场景（Chemex / Melitta 共用） ============
  renderPourOverScene(step) {
    const canvas = document.getElementById('brewCanvas');
    const s = this.state;
    const skin = this.currentTool.skins.find(x => x.id === this.currentSkin) || this.currentTool.skins[0];
    const isChemex = this.currentTool.id === 'chemex';

    // 秤（居中）
    const scale = this.addSVG(SVGTools.scale(s.beansWeight || 0), 'tool-scale', 0, 290, true);
    canvas.appendChild(scale);

    // 称豆之后显示器具
    if (step.id !== 'weigh') {
      if (isChemex) {
        // Chemex：完整沙漏壶（含滤纸/粉层/咖啡液），无需单独分享壶
        const che = this.addSVG(
          SVGTools.chemexDripper(skin.dripperColor, s.coffeeLevel || 0, {
            showFilter: true,
            showGrounds: !!s.groundsLevel
          }),
          'tool-dripper', 0, 165, true
        );
        che.style.width = '130px';
        che.style.height = '130px';
        canvas.appendChild(che);
      } else {
        // Melitta：滤杯 + 分享壶
        const server = this.addSVG(SVGTools.server(s.coffeeLevel || 0), 'tool-server', 0, 285, true);
        canvas.appendChild(server);
        const dripper = this.addSVG(SVGTools.dripper(skin.dripperColor, this.currentTool.id), 'tool-dripper', 0, 175, true);
        canvas.appendChild(dripper);
        const filter = this.addSVG(SVGTools.filter(), 'tool-dripper', 0, 175, true);
        filter.style.opacity = '0.9';
        canvas.appendChild(filter);
        if (s.groundsLevel) {
          const grounds = this.addSVG(SVGTools.grounds(30), 'tool-dripper', 0, 175, true);
          canvas.appendChild(grounds);
        }
      }
    }

    if (step.id === 'weigh') {
      const beans = this.addSVG(SVGTools.beans(), 'tool-beans', 20, 120);
      canvas.appendChild(beans);
      this.enableDrag(beans, () => {
        if (this.isOverlapping(beans, scale)) {
          s.beansWeight = Math.min((s.beansWeight || 0) + 5, 15);
          scale.innerHTML = SVGTools.scale(s.beansWeight);
          beans.style.left = '20px';
          beans.style.top = '120px';
          if (s.beansWeight >= 15) {
            beans.style.display = 'none';
            setTimeout(() => this.nextStep(), 400);
          }
        }
      });
    }

    if (step.id === 'grind') {
      const grinder = this.addSVG(SVGTools.grinder(s.grindCount || 0), 'tool-grinder', 25, 100);
      canvas.appendChild(grinder);
      grinder.style.cursor = 'pointer';
      grinder.addEventListener('click', () => {
        s.grindCount = (s.grindCount || 0) + 1;
        grinder.innerHTML = SVGTools.grinder(s.grindCount);
        grinder.querySelector('.grinder-handle-svg')?.style.setProperty('animation', 'spin 0.4s');
        if (s.grindCount >= 6) setTimeout(() => this.nextStep(), 400);
      });
    }

    if (step.id === 'boil') {
      const kettle = this.addSVG(SVGTools.kettle(s.temp || 20, s.kettleHeating), 'tool-kettle', 120, 30);
      canvas.appendChild(kettle);
      kettle.style.cursor = 'pointer';
      kettle.addEventListener('click', () => {
        if (!s.kettleHeating) {
          s.kettleHeating = true;
          this.heatKettle(kettle);
        } else {
          s.kettleHeating = false;
          kettle.innerHTML = SVGTools.kettle(s.temp, false);
          if (s.temp >= 88 && s.temp <= 96) {
            setTimeout(() => this.nextStep(), 300);
          } else {
            AIModule.triggerHint(this.currentTool.name, step.name, `在 ${s.temp}°C 时停止了加热`, step.id);
            showToast(`水温 ${s.temp}°C，目标 88-96°C`, 'info');
          }
        }
      });
    }

    if (step.id === 'rinse') {
      const kettle = this.addSVG(SVGTools.kettle(92, false), 'tool-kettle', 120, 20);
      canvas.appendChild(kettle);
      this.enablePour(kettle, canvas, () => {
        s.rinsed = true;
        setTimeout(() => this.nextStep(), 500);
        return false;
      }, true);
    }

    if (step.id === 'dose') {
      const grounds = this.addSVG(SVGTools.grounds(30), 'tool-beans', 20, 120);
      canvas.appendChild(grounds);
      grounds.style.background = 'none';
      const dripper = canvas.querySelector('.tool-dripper');
      this.enableDrag(grounds, () => {
        if (this.isOverlapping(grounds, dripper)) {
          s.groundsLevel = 100;
          grounds.style.display = 'none';
          s.dosed = true;
          setTimeout(() => this.nextStep(), 400);
        }
      });
    }

    if (step.id === 'bloom') {
      const kettle = this.addSVG(SVGTools.kettle(92, false), 'tool-kettle', 120, 20);
      canvas.appendChild(kettle);
      s.bloomWater = 0;
      this.enablePour(kettle, canvas, (amount) => {
        s.bloomWater += amount;
        if (s.bloomWater >= 30 && !s.bloomWaiting) {
          s.bloomWaiting = true;
          this.startTimer(30, () => setTimeout(() => this.nextStep(), 300));
          return false;
        }
      });
    }

    if (step.id === 'pour') {
      const kettle = this.addSVG(SVGTools.kettle(92, false), 'tool-kettle', 120, 20);
      canvas.appendChild(kettle);
      s.totalWater = s.bloomWater || 30;
      const server = canvas.querySelector('.tool-server');
      const dripper = canvas.querySelector('.tool-dripper');
      this.enablePour(kettle, canvas, (amount) => {
        s.totalWater += amount;
        const level = Math.min((s.totalWater / 240) * 100, 100);
        s.coffeeLevel = level;
        if (isChemex) {
          if (dripper) dripper.innerHTML = SVGTools.chemexDripper(skin.dripperColor, level, { showFilter: true, showGrounds: true });
        } else if (server) {
          server.innerHTML = SVGTools.server(level);
        }
        if (s.totalWater >= 240) {
          setTimeout(() => this.nextStep(), 400);
          return false;
        }
      });
    }

    if (step.id === 'finish') {
      if (isChemex) {
        // Chemex：整壶直接出餐
        const che = canvas.querySelector('.tool-dripper');
        if (che) {
          che.style.cursor = 'pointer';
          che.classList.add('clickable');
          che.addEventListener('click', () => this.completeBrew());
        }
      } else {
        const dripper = canvas.querySelector('.tool-dripper');
        if (dripper) {
          dripper.style.cursor = 'pointer';
          dripper.classList.add('clickable');
          dripper.addEventListener('click', () => {
            dripper.style.transition = 'transform 0.6s, opacity 0.6s';
            dripper.style.transform = 'translateY(-80px)';
            dripper.style.opacity = '0';
            setTimeout(() => this.completeBrew(), 700);
          });
        }
      }
    }
  },

  // ============ 法压壶场景 ============
  renderFrenchPressScene(step) {
    const canvas = document.getElementById('brewCanvas');
    const s = this.state;

    const fp = this.addSVG(SVGTools.frenchPress(s.fpWater || 0, s.plungerPos || 0), 'tool-fp', 0, 180, true);
    canvas.appendChild(fp);

    if (step.id === 'weigh') {
      const scale = this.addSVG(SVGTools.scale(s.beansWeight || 0), 'tool-scale', 20, 290);
      canvas.appendChild(scale);
      const beans = this.addSVG(SVGTools.beans(), 'tool-beans', 20, 120);
      canvas.appendChild(beans);
      this.enableDrag(beans, () => {
        if (this.isOverlapping(beans, scale)) {
          s.beansWeight = Math.min((s.beansWeight || 0) + 10, 30);
          scale.innerHTML = SVGTools.scale(s.beansWeight);
          beans.style.left = '20px';
          beans.style.top = '120px';
          if (s.beansWeight >= 30) {
            beans.style.display = 'none';
            setTimeout(() => this.nextStep(), 400);
          }
        }
      });
    }

    if (step.id === 'grind') {
      const grinder = this.addSVG(SVGTools.grinder(s.grindCount || 0), 'tool-grinder', 20, 100);
      canvas.appendChild(grinder);
      grinder.style.cursor = 'pointer';
      grinder.addEventListener('click', () => {
        s.grindCount = (s.grindCount || 0) + 1;
        grinder.innerHTML = SVGTools.grinder(s.grindCount);
        if (s.grindCount >= 4) setTimeout(() => this.nextStep(), 400);
      });
    }

    if (step.id === 'dose') {
      const grounds = this.addSVG(SVGTools.grounds(30), 'tool-beans', 20, 120);
      canvas.appendChild(grounds);
      this.enableDrag(grounds, () => {
        if (this.isOverlapping(grounds, fp)) {
          grounds.style.display = 'none';
          s.dosed = true;
          setTimeout(() => this.nextStep(), 400);
        }
      });
    }

    if (step.id === 'pour') {
      const kettle = this.addSVG(SVGTools.kettle(93, false), 'tool-kettle', 120, 20);
      canvas.appendChild(kettle);
      s.fpWater = 0;
      this.enablePour(kettle, canvas, (amount) => {
        s.fpWater += amount;
        const level = Math.min((s.fpWater / 480) * 100, 100);
        fp.innerHTML = SVGTools.frenchPress(level, 0);
        if (s.fpWater >= 480) {
          setTimeout(() => this.nextStep(), 400);
          return false;
        }
      });
    }

    if (step.id === 'steep') {
      fp.innerHTML = SVGTools.frenchPress(100, 0);
      this.startTimer(240, () => setTimeout(() => this.nextStep(), 300), '浸泡中');
    }

    if (step.id === 'press') {
      fp.innerHTML = SVGTools.frenchPress(100, 0);
      fp.style.cursor = 'ns-resize';
      let pressing = false;
      fp.addEventListener('pointerdown', (e) => {
        pressing = true;
        e.preventDefault();
      });
      document.addEventListener('pointermove', (e) => {
        if (!pressing) return;
        const fpRect = fp.getBoundingClientRect();
        const relY = e.clientY - fpRect.top;
        const maxPress = fpRect.height - 55;
        const pressAmount = Math.max(0, Math.min(relY - 15, maxPress));
        s.plungerPos = pressAmount;
        fp.innerHTML = SVGTools.frenchPress(100, pressAmount);
        if (pressAmount >= maxPress - 10) {
          pressing = false;
          s.pressed = true;
          setTimeout(() => this.nextStep(), 400);
        }
      });
      document.addEventListener('pointerup', () => { pressing = false; });
    }

    if (step.id === 'finish') {
      setTimeout(() => this.completeBrew(), 500);
    }
  },

  // ============ 摩卡壶场景 ============
  renderMokaScene(step) {
    const canvas = document.getElementById('brewCanvas');
    const s = this.state;

    const moka = this.addSVG(SVGTools.mokaPot(s.mokaCoffee || 0, s.heating || false), 'tool-moka', 0, 165, true);
    canvas.appendChild(moka);

    if (step.id === 'fillwater') {
      const water = this.makeDraggable(icon('drop', 36), 20, 120);
      water.style.color = '#29B6F6';
      canvas.appendChild(water);
      this.enableDrag(water, () => {
        if (this.isOverlapping(water, moka)) {
          water.style.display = 'none';
          s.water = true;
          setTimeout(() => this.nextStep(), 400);
        }
      });
    }

    if (step.id === 'dose') {
      const grounds = this.addSVG(SVGTools.grounds(30), 'tool-beans', 20, 120);
      canvas.appendChild(grounds);
      this.enableDrag(grounds, () => {
        if (this.isOverlapping(grounds, moka)) {
          grounds.style.display = 'none';
          s.dosed = true;
          setTimeout(() => this.nextStep(), 400);
        }
      });
    }

    if (step.id === 'assemble') {
      moka.style.cursor = 'pointer';
      moka.classList.add('clickable');
      moka.addEventListener('click', () => {
        s.assembled = true;
        showToast('已拧紧上下壶');
        setTimeout(() => this.nextStep(), 400);
      });
    }

    if (step.id === 'heat') {
      const stove = this.makeDraggable(icon('flame', 32), 20, 320);
      stove.style.color = '#FF6F00';
      stove.style.cursor = 'pointer';
      canvas.appendChild(stove);
      stove.addEventListener('click', () => {
        if (!s.heating) {
          s.heating = true;
          moka.innerHTML = SVGTools.mokaPot(s.mokaCoffee || 0, true);
          this.heatMoka((level) => {
            s.mokaCoffee = level;
            moka.innerHTML = SVGTools.mokaPot(level, true);
            if (level >= 80) {
              stove.innerHTML = icon('drop', 28);
              stove.style.color = '#29B6F6';
              stove.addEventListener('click', () => {
                s.heating = false;
                moka.innerHTML = SVGTools.mokaPot(s.mokaCoffee, false);
                s.heated = true;
                setTimeout(() => this.nextStep(), 500);
              }, { once: true });
            }
          });
        }
      });
    }

    if (step.id === 'finish') {
      setTimeout(() => this.completeBrew(), 500);
    }
  },

  // ============ 虹吸壶场景 ============
  renderSiphonScene(step) {
    const canvas = document.getElementById('brewCanvas');
    const s = this.state;

    const siphon = this.addSVG(SVGTools.siphon(s.waterLevel || 0, s.phase || 'idle'), 'tool-siphon', 0, 30, true);
    canvas.appendChild(siphon);

    // 装水
    if (step.id === 'fillwater') {
      const water = this.makeDraggable(icon('drop', 36), 10, 100);
      water.style.color = '#29B6F6';
      canvas.appendChild(water);
      this.enableDrag(water, () => {
        if (this.isOverlapping(water, siphon)) {
          water.style.display = 'none';
          s.water = true;
          s.waterLevel = 80;
          siphon.innerHTML = SVGTools.siphon(80, 'idle');
          setTimeout(() => this.nextStep(), 400);
        }
      });
    }

    // 组装
    if (step.id === 'assemble') {
      siphon.innerHTML = SVGTools.siphon(80, 'idle');
      siphon.style.cursor = 'pointer';
      siphon.classList.add('clickable');
      siphon.addEventListener('click', () => {
        s.assembled = true;
        showToast('已组装好虹吸壶');
        setTimeout(() => this.nextStep(), 400);
      });
    }

    // 加热
    if (step.id === 'heat') {
      siphon.innerHTML = SVGTools.siphon(80, 'heating');
      const lamp = this.makeDraggable(icon('flame', 32), 10, 300);
      lamp.style.color = '#FF6F00';
      lamp.style.cursor = 'pointer';
      canvas.appendChild(lamp);
      lamp.addEventListener('click', () => {
        showToast('加热中，水正在上升到上壶…');
        this.heatSiphon((level) => {
          s.waterLevel = level;
          siphon.innerHTML = SVGTools.siphon(level, level > 60 ? 'heating' : 'heating');
          if (level >= 100) {
            siphon.innerHTML = SVGTools.siphon(100, 'heating');
            setTimeout(() => { s.heated = true; this.nextStep(); }, 600);
          }
        });
      });
    }

    // 投粉
    if (step.id === 'dose') {
      siphon.innerHTML = SVGTools.siphon(100, 'brewing');
      const grounds = this.addSVG(SVGTools.grounds(30), 'tool-beans', 10, 100);
      canvas.appendChild(grounds);
      this.enableDrag(grounds, () => {
        if (this.isOverlapping(grounds, siphon)) {
          grounds.style.display = 'none';
          s.dosed = true;
          showToast('咖啡粉已加入上壶，正在萃取');
          setTimeout(() => this.nextStep(), 400);
        }
      });
    }

    // 萃取
    if (step.id === 'brew') {
      siphon.innerHTML = SVGTools.siphon(100, 'brewing');
      this.startTimer(60, () => setTimeout(() => this.nextStep(), 300), '萃取中');
    }

    // 离火
    if (step.id === 'remove') {
      siphon.innerHTML = SVGTools.siphon(100, 'brewing');
      const lamp = this.makeDraggable(icon('flame', 32), 10, 300);
      lamp.style.color = '#FF6F00';
      lamp.style.cursor = 'pointer';
      canvas.appendChild(lamp);
      lamp.addEventListener('click', () => {
        lamp.style.display = 'none';
        showToast('移开火源，咖啡流回下壶…');
        s.phase = 'descending';
        let level = 100;
        const interval = setInterval(() => {
          level -= 5;
          s.waterLevel = level;
          siphon.innerHTML = SVGTools.siphon(level, 'descending');
          if (level <= 0) {
            clearInterval(interval);
            s.removed = true;
            setTimeout(() => this.nextStep(), 500);
          }
        }, 100);
      });
    }

    if (step.id === 'finish') {
      setTimeout(() => this.completeBrew(), 500);
    }
  },

  // 虹吸加热动画
  heatSiphon(onUpdate) {
    let level = 0;
    const interval = setInterval(() => {
      level += 5;
      if (onUpdate) onUpdate(level);
      if (level >= 100) clearInterval(interval);
    }, 150);
  },

  // ============ 辅助：添加 SVG 器具到场景 ============
  addSVG(svgString, sizeClass, x, y, center = false) {
    const el = document.createElement('div');
    el.className = `scene-item ${sizeClass}`;
    if (center) {
      el.style.left = '50%';
      el.style.transform = 'translateX(-50%)';
      el.style.top = y + 'px';
    } else {
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    }
    el.innerHTML = svgString;
    return el;
  },

  makeDraggable(innerHtml, x, y) {
    const el = document.createElement('div');
    el.className = 'scene-item';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.innerHTML = innerHtml;
    return el;
  },

  // 碰撞检测
  isOverlapping(a, b) {
    const ra = a.getBoundingClientRect();
    const rb = b.getBoundingClientRect();
    const cx = ra.left + ra.width / 2;
    const cy = ra.top + ra.height / 2;
    return cx > rb.left && cx < rb.right && cy > rb.top && cy < rb.bottom;
  },

  // ============ 拖动 ============
  enableDrag(el, onDrop) {
    let startX, startY, origLeft, origTop;
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const pt = e.touches ? e.touches[0] : e;
      startX = pt.clientX;
      startY = pt.clientY;
      const rect = el.getBoundingClientRect();
      const canvasRect = el.parentElement.getBoundingClientRect();
      origLeft = rect.left - canvasRect.left;
      origTop = rect.top - canvasRect.top;
      el.classList.add('dragging');

      const onMove = (ev) => {
        const p = ev.touches ? ev.touches[0] : ev;
        el.style.left = (origLeft + p.clientX - startX) + 'px';
        el.style.top = (origTop + p.clientY - startY) + 'px';
      };
      const onUp = (ev) => {
        el.classList.remove('dragging');
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        const p = ev.changedTouches ? ev.changedTouches[0] : ev;
        if (onDrop) onDrop(p.clientX, p.clientY);
      };
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });
  },

  // ============ 注水 ============
  enablePour(kettle, canvas, onPour, isRinse = false) {
    let pouring = false;
    let pourInterval = null;
    let tilt = 0;

    // SVG 水柱（从壶嘴画曲线到滤杯）
    const stream = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    stream.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:40;overflow:visible;display:none;';
    stream.innerHTML = `
      <defs>
        <linearGradient id="teachStreamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(180,220,255,0.95)"/>
          <stop offset="100%" stop-color="rgba(80,150,210,0.6)"/>
        </linearGradient>
      </defs>
      <path id="teachStreamPath" d="" fill="none" stroke="url(#teachStreamGrad)" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
      <path id="teachStreamLight" d="" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" stroke-linecap="round"/>
    `;
    canvas.appendChild(stream);

    // 壶嘴位置（考虑倾斜）
    const getSpout = () => {
      const kRect = kettle.getBoundingClientRect();
      const cRect = canvas.getBoundingClientRect();
      const w = kRect.width, h = kRect.height;
      const sx = 16 / 200 * w, sy = 44 / 200 * h;
      const cx = w / 2, cy = h / 2;
      const rad = tilt * Math.PI / 180;
      const rx = sx - cx, ry = sy - cy;
      const rotX = rx * Math.cos(rad) - ry * Math.sin(rad) + cx;
      const rotY = rx * Math.sin(rad) + ry * Math.cos(rad) + cy;
      return { x: kRect.left - cRect.left + rotX, y: kRect.top - cRect.top + rotY };
    };

    const stopPour = () => {
      pouring = false;
      stream.style.display = 'none';
      kettle.style.transform = '';
      tilt = 0;
      if (pourInterval) { clearInterval(pourInterval); pourInterval = null; }
    };

    const startPour = () => {
      if (pouring) return;
      pouring = true;
      stream.style.display = 'block';
      // 倾斜水壶
      tilt = 25;
      kettle.style.transition = 'transform 0.3s';
      kettle.style.transform = `rotate(${tilt}deg)`;
      pourInterval = setInterval(() => {
        const spout = getSpout();
        const dripper = canvas.querySelector('.tool-dripper');
        const cRect = canvas.getBoundingClientRect();
        // 水柱按壶嘴方向 + 重力自然流出
        const tiltRad = tilt * Math.PI / 180;
        const pourDist = 130;
        const endX = spout.x + Math.sin(tiltRad) * pourDist + tilt * 1.5;
        const endY = spout.y + Math.cos(tiltRad) * pourDist + 50;
        const midX = spout.x + (endX - spout.x) * 0.5;
        const midY = spout.y + (endY - spout.y) * 0.4;
        const d = `M ${spout.x} ${spout.y} Q ${midX} ${midY} ${endX} ${endY}`;
        const p1 = document.getElementById('teachStreamPath');
        const p2 = document.getElementById('teachStreamLight');
        if (p1) p1.setAttribute('d', d);
        if (p2) p2.setAttribute('d', d);

        const result = onPour(isRinse ? 10 : 5);
        if (result === false) stopPour();
      }, 100);
    };

    kettle.style.cursor = 'pointer';
    kettle.addEventListener('pointerdown', startPour);
    document.addEventListener('pointerup', stopPour);
  },

  heatKettle(kettleEl) {
    if (!this.state.kettleHeating) return;
    this.state.temp = Math.min((this.state.temp || 20) + 1, 100);
    kettleEl.innerHTML = SVGTools.kettle(this.state.temp, true);
    if (this.state.kettleHeating) setTimeout(() => this.heatKettle(kettleEl), 250);
  },

  heatMoka(onUpdate) {
    let level = 0;
    const interval = setInterval(() => {
      if (!this.state.heating) { clearInterval(interval); return; }
      level += 4;
      if (onUpdate) onUpdate(level);
      if (level >= 100) clearInterval(interval);
    }, 300);
  },

  startTimer(seconds, onDone, label = '闷蒸中') {
    const canvas = document.getElementById('brewCanvas');
    const timer = document.createElement('div');
    timer.className = 'timer-badge';
    let remaining = seconds;
    timer.textContent = `${label} ${remaining}s`;
    canvas.appendChild(timer);
    const interval = setInterval(() => {
      remaining--;
      timer.textContent = `${label} ${remaining}s`;
      if (remaining <= 0) {
        clearInterval(interval);
        timer.remove();
        if (onDone) onDone();
      }
    }, 1000);
  },

  nextStep() {
    const step = this.currentTool.brewSteps[this.currentStepIdx];
    AIModule.resetErrorCount(step.id);
    this.currentStepIdx++;
    if (this.currentStepIdx >= this.currentTool.brewSteps.length) {
      this.completeBrew();
    } else {
      this.renderStep();
    }
  },

  completeBrew() {
    const tool = this.currentTool;
    const progress = loadProgress();

    if (!progress.skins[tool.id]) progress.skins[tool.id] = {};
    progress.skins[tool.id].premium = true;
    if (!progress.completed.includes(tool.id)) progress.completed.push(tool.id);
    saveProgress(progress);

    const premiumSkin = tool.skins.find(s => s.id === 'premium');
    document.getElementById('completeDesc').textContent =
      `恭喜完成「${tool.name}」冲煮！解锁了「${premiumSkin.name}」皮肤`;

    const preview = document.getElementById('skinPreview');
    preview.innerHTML = `<div class="skin-preview-item">${SVGTools.toolIcon(tool.id)}</div>`;

    document.getElementById('brewStage').classList.add('hidden');
    document.getElementById('brewComplete').classList.remove('hidden');
  },

  // ============ 自由冲煮：客人点单模式 ============
  freeState: null,

  startFreeBrew() {
    this.freeState = {
      dose: 15,
      grind: 5,       // 1粗-10细
      temp: 92,
      water: 240,
      bloom: 30,
      brewTime: 150,
      // 实际操作状态
      beansWeight: 0,
      beansUsed: false,
      beansOnGrinder: false,
      grindClicks: 0,
      ground: false,
      heated: false,
      dosed: false,
      poured: false,
      pouredWater: 0,
      wastedWater: 0,
      customerWet: false,
      // 虹吸壶
      waterAdded: false,
      waterRisen: false,
      beansAdded: false,
      heating: false,
      brewed: false,
      phase: 'idle',
      waterLevel: 0
    };

    document.getElementById('freeToolName').textContent = this.currentTool.name;
    document.getElementById('freeBrew').classList.remove('hidden');

    // 随机客人
    const customers = [
      { avatar: '🧑', order: '我想要一杯香醇浓郁、不酸不苦的咖啡~' },
      { avatar: '👩', order: '今天想来点明亮果酸的，别太苦哦！' },
      { avatar: '👨', order: '要一杯醇厚的，苦味重一点没关系，别酸！' },
      { avatar: '🧓', order: '年纪大了，来杯温和顺口的就行。' },
      { avatar: '🧑‍🎓', order: '熬夜赶论文，需要一杯强劲的提神！' }
    ];
    const c = customers[Math.floor(Math.random() * customers.length)];
    document.querySelector('.customer-avatar').textContent = c.avatar;
    document.getElementById('customerBubble').textContent = c.order;
    this.freeState.customer = c;

    this.renderFreeSkinSwitcher();
    if (this.currentTool.id === 'siphon') {
      this.renderFreeSiphonScene();
    } else {
      this.renderFreeScene();
    }
    this.renderFreeControls();
  },

  renderFreeSkinSwitcher() {
    const container = document.getElementById('freeSkinSwitcher');
    const progress = loadProgress();
    const skins = this.currentTool.skins;
    container.innerHTML = skins.map(s => {
      const isUnlocked = s.id === 'default' || progress.skins[this.currentTool.id]?.[s.id];
      return `<div class="skin-dot ${this.currentSkin === s.id ? 'active' : ''}" 
              data-skin="${s.id}" 
              style="background:${s.color};${isUnlocked ? '' : 'opacity:0.3;'}"
              title="${s.name}${isUnlocked ? '' : ' (未解锁)'}"></div>`;
    }).join('');
    container.querySelectorAll('.skin-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const skinId = dot.dataset.skin;
        const isUnlocked = skinId === 'default' || progress.skins[this.currentTool.id]?.[skinId];
        if (!isUnlocked) return;
        this.currentSkin = skinId;
        this.renderFreeSkinSwitcher();
        this.renderFreeScene();
      });
    });
  },

  renderFreeScene() {
    const canvas = document.getElementById('freeCanvas');
    const s = this.freeState;
    const skin = this.currentTool.skins.find(x => x.id === this.currentSkin) || this.currentTool.skins[0];
    const isChemex = this.currentTool.id === 'chemex';
    canvas.innerHTML = '';

    let dripper;
    if (isChemex) {
      // Chemex：完整沙漏壶，含滤纸/粉层
      dripper = this.addSVG(
        SVGTools.chemexDripper(skin.dripperColor, 0, { showFilter: true, showGrounds: !!s.dosed }),
        'tool-dripper', 0, 175, true
      );
      dripper.style.width = '130px';
      dripper.style.height = '130px';
      canvas.appendChild(dripper);
    } else {
      // Melitta：滤杯 + 分享壶 + 滤纸 + 粉层
      const server = this.addSVG(SVGTools.server(0), 'tool-server', 0, 250, true);
      canvas.appendChild(server);
      dripper = this.addSVG(SVGTools.dripper(skin.dripperColor, this.currentTool.id), 'tool-dripper', 0, 120, true);
      canvas.appendChild(dripper);
      const filter = this.addSVG(SVGTools.filter(), 'tool-dripper', 0, 120, true);
      filter.style.opacity = '0.9';
      canvas.appendChild(filter);
      if (s.dosed) {
        const grounds = this.addSVG(SVGTools.grounds(30), 'tool-dripper', 0, 120, true);
        canvas.appendChild(grounds);
      }
    }

    // 秤（可拖动），居中
    const scale = this.addSVG(SVGTools.scale(s.beansWeight || 0), 'tool-scale', 0, 310, true);
    canvas.appendChild(scale);
    this.enableDrag(scale);

    // 咖啡豆（左上）
    if (!s.beansUsed) {
      const beans = this.addSVG(SVGTools.beans(), 'tool-beans', 10, 10);
      canvas.appendChild(beans);
      this.enableDrag(beans, () => {
        if (s.beansUsed) return;
        // 拖到秤上
        if (this.isOverlapping(beans, scale)) {
          s.beansWeight = s.dose;
          s.beansUsed = true;
          s.beansOnGrinder = false;
          scale.innerHTML = SVGTools.scale(s.dose);
          beans.style.display = 'none';
          showToast(`称了 ${s.dose}g 豆子，拖到磨豆机吧`);
        }
        // 拖到磨豆机上直接磨
        const grinder = canvas.querySelector('.tool-grinder');
        if (grinder && this.isOverlapping(beans, grinder)) {
          s.beansOnGrinder = true;
          beans.style.display = 'none';
          s.beansUsed = true;
          showToast('豆子放进磨豆机了，点击研磨');
        }
      });
    }

    // 磨豆机（顶部居中，可拖动，点击研磨）
    const grinder = this.addSVG(SVGTools.grinder(s.grindClicks || 0), 'tool-grinder', 0, 5, true);
    canvas.appendChild(grinder);
    this.enableDrag(grinder);
    grinder.style.cursor = 'pointer';
    grinder.addEventListener('click', () => {
      if (!s.beansOnGrinder && !s.beansUsed) {
        showToast('先把豆子拖到磨豆机上');
        return;
      }
      if (s.ground) {
        showToast('已经磨好了');
        return;
      }
      s.grindClicks = (s.grindClicks || 0) + 1;
      grinder.innerHTML = SVGTools.grinder(s.grindClicks);
      if (s.grindClicks >= 5) {
        s.ground = true;
        showToast(`磨好了！研磨度 ${this.grindLabel(s.grind)}，把粉拖进滤杯`);
        // 磨好后在磨豆机下方出现粉
        this.renderFreeScene();
      }
    });

    // 咖啡粉（磨好后出现，可拖入滤杯）
    if (s.ground && !s.dosed) {
      const gRect = grinder.getBoundingClientRect();
      const cRect = canvas.getBoundingClientRect();
      const grounds = this.addSVG(SVGTools.grounds(30), 'tool-beans', gRect.left - cRect.left, gRect.bottom - cRect.top + 5);
      canvas.appendChild(grounds);
      this.enableDrag(grounds, () => {
        if (this.isOverlapping(grounds, dripper)) {
          s.dosed = true;
          grounds.style.display = 'none';
          showToast('粉倒进滤杯了，用水壶注水吧');
          this.renderFreeScene();
        }
      });
    }

    // 水壶（右上，可拖动，点击加热/注水）
    const kettle = this.addSVG(SVGTools.kettle(s.temp || 92, false), 'tool-kettle', 0, 10);
    kettle.style.left = 'auto';
    kettle.style.right = '10px';
    canvas.appendChild(kettle);

    if (!s.heated) {
      // 未加热：拖动 + 点击加热
      this.enableDrag(kettle);
      kettle.style.cursor = 'pointer';
      kettle.addEventListener('click', (e) => {
        if (s.heated) return;
        e.stopPropagation();
        let t = 20;
        const heat = setInterval(() => {
          t += 2;
          kettle.innerHTML = SVGTools.kettle(Math.min(t, s.temp), true);
          if (t >= s.temp) {
            clearInterval(heat);
            kettle.innerHTML = SVGTools.kettle(s.temp, false);
            s.heated = true;
            showToast(`水烧到 ${s.temp}°C，拖到滤杯上方点一下注水`);
            this.renderFreeScene();
          }
        }, 80);
      });
    } else if (!s.poured) {
      // 已加热：enableKettlePour 自带拖拽
      const skin = this.currentTool.skins.find(x => x.id === this.currentSkin) || this.currentTool.skins[0];
      this.enableKettlePour(kettle, dripper, canvas, (level) => {
        if (isChemex) {
          dripper.innerHTML = SVGTools.chemexDripper(skin.dripperColor, level, { showFilter: true, showGrounds: true });
        } else {
          const server = canvas.querySelector('.tool-server');
          if (server) server.innerHTML = SVGTools.server(level);
        }
      });
    } else {
      this.enableDrag(kettle);
    }
  },

  // 虹吸壶自由场景
  renderFreeSiphonScene() {
    const canvas = document.getElementById('freeCanvas');
    const s = this.freeState;
    canvas.innerHTML = '';

    const siphon = this.addSVG(SVGTools.siphon(s.waterLevel || 0, s.phase || 'idle'), 'tool-siphon', 0, 20, true);
    canvas.appendChild(siphon);

    // 水（可拖入下壶）
    if (!s.waterAdded) {
      const water = this.makeDraggable(icon('drop', 36), 10, 50);
      water.style.color = '#29B6F6';
      canvas.appendChild(water);
      this.enableDrag(water, () => {
        if (this.isOverlapping(water, siphon)) {
          s.waterAdded = true;
          s.waterLevel = 80;
          water.style.display = 'none';
          siphon.innerHTML = SVGTools.siphon(80, 'idle');
          showToast('水加好了');
        }
      });
    }

    // 豆子（可拖入上壶，需水上升后）
    if (!s.beansAdded && s.waterRisen) {
      const beans = this.addSVG(SVGTools.grounds(30), 'tool-beans', 10, 50);
      canvas.appendChild(beans);
      this.enableDrag(beans, () => {
        if (this.isOverlapping(beans, siphon)) {
          s.beansAdded = true;
          beans.style.display = 'none';
          s.phase = 'brewing';
          siphon.innerHTML = SVGTools.siphon(100, 'brewing');
          showToast('粉加进去了，开始萃取');
        }
      });
    }

    // 酒精灯（点击加热/移开）
    const lamp = this.makeDraggable(icon('flame', 32), 10, 320);
    lamp.style.color = s.heating ? '#FF6F00' : '#90A4AE';
    lamp.style.cursor = 'pointer';
    canvas.appendChild(lamp);
    lamp.addEventListener('click', () => {
      if (!s.waterAdded) {
        showToast('先加水');
        return;
      }
      if (!s.heating && !s.brewed) {
        s.heating = true;
        lamp.style.color = '#FF6F00';
        showToast('加热中…');
        let level = 0;
        const heatInt = setInterval(() => {
          if (!s.heating) { clearInterval(heatInt); return; }
          level += 5;
          s.waterLevel = level;
          siphon.innerHTML = SVGTools.siphon(level, 'heating');
          if (level >= 100) {
            clearInterval(heatInt);
            s.waterRisen = true;
            siphon.innerHTML = SVGTools.siphon(100, 'heating');
            showToast('水升上去了，加粉吧');
          }
        }, 150);
      } else if (s.heating && s.beansAdded) {
        // 移开火源，咖啡回流
        s.heating = false;
        lamp.style.color = '#90A4AE';
        s.phase = 'descending';
        let level = 100;
        const downInt = setInterval(() => {
          level -= 5;
          s.waterLevel = level;
          siphon.innerHTML = SVGTools.siphon(level, 'descending');
          if (level <= 0) {
            clearInterval(downInt);
            s.brewed = true;
            s.poured = true;
            showToast('咖啡好了，可以出餐');
          }
        }, 100);
      }
    });
  },

  // 水壶自由拖动注水：倒到滤杯里算注水，浇到客人头上会被骂
  enableKettlePour(kettle, dripper, canvas, onLevelChange) {
    const s = this.freeState;
    let dragging = false;
    let pouring = false;
    let pourInterval = null;
    let stream = null;
    let droplets = [];
    let startX, startY, origLeft, origTop;
    let moved = 0;
    let splashTimer = null;
    let currentTilt = 0;

    // 水流容器（SVG，从壶嘴画出曲线水柱）
    stream = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    stream.setAttribute('class', 'water-stream-svg');
    stream.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:50;overflow:visible;display:none;';
    stream.innerHTML = `
      <defs>
        <linearGradient id="streamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(180,220,255,0.95)"/>
          <stop offset="60%" stop-color="rgba(120,180,230,0.85)"/>
          <stop offset="100%" stop-color="rgba(80,150,210,0.6)"/>
        </linearGradient>
      </defs>
      <path id="streamPath" d="" fill="none" stroke="url(#streamGrad)" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
      <path id="streamPathLight" d="" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" stroke-linecap="round"/>
    `;
    canvas.appendChild(stream);

    // 计算壶嘴尖端位置（SVG viewBox 200x200，鹅颈壶嘴在左上约 x=16,y=44）
    const getSpoutPos = () => {
      const kRect = kettle.getBoundingClientRect();
      const cRect = canvas.getBoundingClientRect();
      const w = kRect.width;
      const h = kRect.height;
      // 壶嘴在 SVG 中的相对位置
      const spoutRelX = 16 / 200 * w;
      const spoutRelY = 44 / 200 * h;
      // 旋转中心（壶中心）
      const cx = kRect.width / 2;
      const cy = kRect.height / 2;
      const rad = currentTilt * Math.PI / 180;
      // 旋转后的壶嘴位置
      const rx = spoutRelX - cx;
      const ry = spoutRelY - cy;
      const rotX = rx * Math.cos(rad) - ry * Math.sin(rad) + cx;
      const rotY = rx * Math.sin(rad) + ry * Math.cos(rad) + cy;
      return {
        x: kRect.left - cRect.left + rotX,
        y: kRect.top - cRect.top + rotY
      };
    };

    const stopPour = () => {
      pouring = false;
      if (stream) stream.style.display = 'none';
      if (pourInterval) { clearInterval(pourInterval); pourInterval = null; }
      droplets.forEach(d => d.remove());
      droplets = [];
    };

    const startPour = () => {
      if (pouring || s.poured) return;
      pouring = true;
      stream.style.display = 'block';
      pourInterval = setInterval(() => {
        const spout = getSpoutPos();
        const dRect = dripper.getBoundingClientRect();
        const cRect = canvas.getBoundingClientRect();

        // 水柱自然方向：壶嘴朝向 + 重力
        // 倾斜角度决定水平初速度，重力决定下落
        const tiltRad = currentTilt * Math.PI / 180;
        const pourDist = 140; // 水柱长度
        const endX = spout.x + Math.sin(tiltRad) * pourDist + currentTilt * 2;
        const endY = spout.y + Math.cos(tiltRad) * pourDist + 60;

        // 画曲线水柱（壶嘴 -> 自然落点）
        const midX = spout.x + (endX - spout.x) * 0.5;
        const midY = spout.y + (endY - spout.y) * 0.4;
        const path = document.getElementById('streamPath');
        const pathLight = document.getElementById('streamPathLight');
        const d = `M ${spout.x} ${spout.y} Q ${midX} ${midY} ${endX} ${endY}`;
        path.setAttribute('d', d);
        pathLight.setAttribute('d', d);

        // 溅水小水滴
        if (Math.random() < 0.6) {
          const drop = document.createElement('div');
          drop.style.cssText = `position:absolute;width:4px;height:4px;border-radius:50%;background:rgba(150,200,240,0.8);pointer-events:none;z-index:51;left:${endX - 2}px;top:${endY}px;`;
          canvas.appendChild(drop);
          droplets.push(drop);
          const angle = Math.random() * Math.PI * 2;
          const dist = 6 + Math.random() * 12;
          const tX = Math.cos(angle) * dist;
          const tY = Math.sin(angle) * dist - 3;
          drop.animate([
            { transform: 'translate(0,0)', opacity: 1 },
            { transform: `translate(${tX}px, ${tY}px)`, opacity: 0 }
          ], { duration: 500, easing: 'ease-out' });
          setTimeout(() => drop.remove(), 500);
        }

        // 判断落点是否在滤杯上方
        const dripperLeft = dRect.left - cRect.left;
        const dripperRight = dRect.right - cRect.left;
        const dripperTop = dRect.top - cRect.top;
        const dripperBottom = dRect.bottom - cRect.top;
        const overDripper = endX > dripperLeft - 5 && endX < dripperRight + 5 && endY > dripperTop - 10 && endY < dripperBottom + 30;

        if (overDripper) {
          s.pouredWater = (s.pouredWater || 0) + 4;
          const level = Math.min((s.pouredWater / s.water) * 100, 100);
          if (onLevelChange) onLevelChange(level);
          if (s.pouredWater >= s.water) {
            s.poured = true;
            stopPour();
            showToast(`注满 ${s.water}g！可以出餐了`);
          }
        } else {
          s.wastedWater = (s.wastedWater || 0) + 4;
          if (s.wastedWater > 20 && !s.customerWet) {
            s.customerWet = true;
            const bubble = document.getElementById('customerBubble');
            if (bubble) {
              bubble.textContent = '喂！你把水洒我手上了！😤';
              bubble.style.background = '#FFCDD2';
              if (splashTimer) clearTimeout(splashTimer);
              splashTimer = setTimeout(() => {
                if (s.customer) {
                  bubble.textContent = s.customer.order;
                  bubble.style.background = '';
                }
              }, 2500);
            }
          }
        }
      }, 70);
    };

    kettle.style.cursor = 'grab';
    kettle.style.touchAction = 'none';

    kettle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (s.poured) return;
      dragging = true;
      moved = 0;
      const p = e.touches ? e.touches[0] : e;
      startX = p.clientX;
      startY = p.clientY;
      const rect = kettle.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      origLeft = rect.left - canvasRect.left;
      origTop = rect.top - canvasRect.top;
      kettle.style.cursor = 'grabbing';
    });

    document.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const p = e.touches ? e.touches[0] : e;
      const dx = p.clientX - startX;
      const dy = p.clientY - startY;
      moved = Math.max(moved, Math.abs(dx), Math.abs(dy));
      kettle.style.left = (origLeft + dx) + 'px';
      kettle.style.top = (origTop + dy) + 'px';
      currentTilt = Math.max(-35, Math.min(35, dx * 0.3));
      kettle.style.transform = `rotate(${currentTilt}deg)`;
    });

    document.addEventListener('pointerup', () => {
      if (dragging) {
        dragging = false;
        kettle.style.cursor = 'grab';
        kettle.style.transform = '';
        currentTilt = 0;
      }
    });

    // 点击切换注水
    kettle.addEventListener('click', (e) => {
      if (s.poured || moved > 5) return;
      e.stopPropagation();
      if (pouring) stopPour();
      else startPour();
    });
  },

  grindLabel(g) {
    if (g <= 2) return '极粗';
    if (g <= 4) return '粗';
    if (g <= 6) return '中';
    if (g <= 8) return '细';
    return '极细';
  },

  renderFreeControls() {
    const box = document.getElementById('freeControls');
    const s = this.freeState;
    box.innerHTML = `
      <div class="param-grid">
        <div class="param-item">
          <label>粉量 <span class="param-val">${s.dose}g</span></label>
          <input type="range" min="5" max="30" value="${s.dose}" data-param="dose">
          <div class="param-range">5g — 30g</div>
        </div>
        <div class="param-item">
          <label>研磨度 <span class="param-val">${this.grindLabel(s.grind)}</span></label>
          <input type="range" min="1" max="10" value="${s.grind}" data-param="grind">
          <div class="param-range">粗 ← — → 细</div>
        </div>
        <div class="param-item">
          <label>水温 <span class="param-val">${s.temp}°C</span></label>
          <input type="range" min="80" max="100" value="${s.temp}" data-param="temp">
          <div class="param-range">80°C — 100°C</div>
        </div>
        <div class="param-item">
          <label>注水量 <span class="param-val">${s.water}g</span></label>
          <input type="range" min="120" max="360" value="${s.water}" data-param="water">
          <div class="param-range">120g — 360g</div>
        </div>
        <div class="param-item">
          <label>闷蒸时间 <span class="param-val">${s.bloom}s</span></label>
          <input type="range" min="0" max="60" value="${s.bloom}" data-param="bloom">
          <div class="param-range">0s — 60s</div>
        </div>
      </div>
    `;
    box.querySelectorAll('input[type="range"]').forEach(slider => {
      slider.addEventListener('input', (e) => {
        s[e.target.dataset.param] = parseInt(e.target.value);
        e.target.closest('.param-item').querySelector('.param-val').textContent =
          e.target.dataset.param === 'grind' ? this.grindLabel(s.grind) : s[e.target.dataset.param] + (e.target.dataset.param === 'dose' ? 'g' : e.target.dataset.param === 'temp' ? '°C' : e.target.dataset.param === 'water' ? 'g' : 's');
      });
    });
  },

  serveToCustomer() {
    const s = this.freeState;
    if (!s.poured) {
      showToast('还没冲完呢，先注水吧～');
      return;
    }
    const result = this.evaluateTaste();
    document.getElementById('resultEmoji').textContent = result.emoji;
    document.getElementById('resultComment').textContent = result.comment;
    document.getElementById('resultTaste').innerHTML = result.tasteBars;
    document.getElementById('customerResult').classList.remove('hidden');
  },

  evaluateTaste() {
    const s = this.freeState;
    // V60 理想参数
    const ideal = { dose: 15, grind: 5, temp: 92, water: 240, bloom: 30, ratio: 16 };
    const ratio = s.water / s.dose;

    // 酸度：研磨粗+水温低+时间短 → 酸
    let sour = 0;
    sour += Math.max(0, (ideal.grind - s.grind)) * 8;       // 研磨越粗越酸
    sour += Math.max(0, (ideal.temp - s.temp)) * 3;          // 水温越低越酸
    sour += Math.max(0, (ideal.ratio - ratio)) * 4;          // 粉多水少也偏酸(浓)
    sour += Math.max(0, (s.bloom < 15 ? 15 - s.bloom : 0)) * 2;
    sour = Math.min(100, Math.max(0, sour));

    // 苦度：研磨细+水温高+时间长 → 苦
    let bitter = 0;
    bitter += Math.max(0, (s.grind - ideal.grind)) * 8;
    bitter += Math.max(0, (s.temp - ideal.temp)) * 4;
    bitter += Math.max(0, (ratio - ideal.ratio)) * 3;        // 水太多稀释但久泡也苦
    bitter += Math.max(0, (s.bloom - 45)) * 1.5;
    bitter = Math.min(100, Math.max(0, bitter));

    // 浓郁度：粉水比
    let strong = Math.max(0, Math.min(100, (ideal.ratio - ratio) * 10 + 50));

    // 平衡度：酸苦越接近越平衡
    let balance = 100 - Math.abs(sour - bitter);

    // 综合评分
    const score = balance * 0.4 + (100 - Math.abs(sour - 30)) * 0.2 + (100 - Math.abs(bitter - 30)) * 0.2 + (strong > 30 && strong < 80 ? 100 : 50) * 0.2;

    let emoji, comment;
    if (score >= 75) {
      emoji = '😍';
      comment = '好喝死了！这就是我想要的味道～';
    } else if (sour > 65) {
      emoji = '😣';
      comment = '酸死了！牙都要酸掉了……';
    } else if (bitter > 65) {
      emoji = '😖';
      comment = '苦死了！这是中药吧？';
    } else if (strong < 25) {
      emoji = '😐';
      comment = '淡如水……没啥咖啡味啊。';
    } else if (strong > 85) {
      emoji = '🥴';
      comment = '浓死了！苦得我嗓子发紧……';
    } else if (score >= 55) {
      emoji = '🙂';
      comment = '还行吧，能喝。';
    } else {
      emoji = '🤢';
      comment = '难喝死了！这能叫咖啡？';
    }

    const tasteBars = `
      <div class="taste-bar"><span>酸度</span><div class="taste-track"><div class="taste-fill sour" style="width:${sour}%"></div></div></div>
      <div class="taste-bar"><span>苦度</span><div class="taste-track"><div class="taste-fill bitter" style="width:${bitter}%"></div></div></div>
      <div class="taste-bar"><span>浓郁</span><div class="taste-track"><div class="taste-fill strong" style="width:${strong}%"></div></div></div>
      <div class="taste-bar"><span>平衡</span><div class="taste-track"><div class="taste-fill balance" style="width:${balance}%"></div></div></div>
    `;

    return { emoji, comment, tasteBars, score };
  },

  retryFreeBrew() {
    document.getElementById('customerResult').classList.add('hidden');
    this.startFreeBrew();
  },

  exitFreeBrew() {
    document.getElementById('freeBrew').classList.add('hidden');
    document.getElementById('customerResult').classList.add('hidden');
    document.getElementById('brewSelector').classList.remove('hidden');
    this.renderSelector();
  }
};
