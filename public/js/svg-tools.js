/* ===== 寻萃集 · SVG 器具插画库 ===== */
// 高保真 SVG 咖啡器具插画，支持皮肤换色
// 所有插画尺寸统一为 viewBox 0 0 200 200，通过 CSS 缩放

const SVGTools = {
  // 滤杯：type='melitta'（梯形陶瓷）或 'chemex'（玻璃漏斗+木领）
  dripper(color = '#FF7043', type = 'melitta') {
    if (type === 'chemex') return this.chemexDripper(color);
    return this.melittaDripper(color);
  },

  // Melitta 梯形陶瓷滤杯
  melittaDripper(color) {
    const light = this.lighten(color, 30);
    const dark = this.darken(color, 15);
    const darker = this.darken(color, 28);
    return `<svg viewBox="0 0 200 200" class="svg-tool">
      <defs>
        <linearGradient id="meltGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${light}"/>
          <stop offset="40%" stop-color="${color}"/>
          <stop offset="100%" stop-color="${dark}"/>
        </linearGradient>
        <radialGradient id="meltInner" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="${this.lighten(color, 15)}"/>
          <stop offset="100%" stop-color="${darker}"/>
        </radialGradient>
        <linearGradient id="meltBase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${dark}"/>
          <stop offset="100%" stop-color="${darker}"/>
        </linearGradient>
      </defs>
      <!-- 杯身梯形（上宽下窄） -->
      <path d="M42 38 L158 38 L142 148 L58 148 Z" fill="url(#meltGrad)" stroke="${dark}" stroke-width="2"/>
      <!-- 杯口椭圆（厚边） -->
      <ellipse cx="100" cy="38" rx="58" ry="12" fill="${light}" stroke="${dark}" stroke-width="2"/>
      <ellipse cx="100" cy="38" rx="50" ry="8.5" fill="url(#meltInner)"/>
      <!-- 内壁竖直凸肋 -->
      <g stroke="${darker}" stroke-width="1.5" opacity="0.35" fill="none" stroke-linecap="round">
        <path d="M60 48 L57 143"/>
        <path d="M71 44 L69 146"/>
        <path d="M82 42 L82 147"/>
        <path d="M100 40 L100 148"/>
        <path d="M118 42 L118 147"/>
        <path d="M129 44 L131 146"/>
        <path d="M140 48 L143 143"/>
      </g>
      <!-- 平底 -->
      <ellipse cx="100" cy="148" rx="42" ry="9" fill="url(#meltBase)" stroke="${dark}" stroke-width="1.5"/>
      <!-- 单孔 -->
      <ellipse cx="100" cy="148" rx="11" ry="3.2" fill="#1A120D"/>
      <!-- 底座圈 -->
      <path d="M64 148 L136 148 L132 162 L68 162 Z" fill="${dark}" stroke="${darker}" stroke-width="1.5"/>
      <ellipse cx="100" cy="162" rx="32" ry="5" fill="${darker}"/>
      <!-- 陶瓷高光 -->
      <path d="M52 46 Q46 95 60 145" fill="none" stroke="${this.lighten(color, 40)}" stroke-width="3.5" opacity="0.5" stroke-linecap="round"/>
      <ellipse cx="80" cy="55" rx="12" ry="4" fill="#fff" opacity="0.25"/>
    </svg>`;
  },

  // Chemex 滤杯上半部（玻璃漏斗 + 木领 + 皮绳）
  chemexDripper(color) {
    const glass = 'rgba(220, 240, 255, 0.35)';
    const glassEdge = 'rgba(140, 180, 210, 0.7)';
    const wood = '#8D6E63';
    const woodDark = '#5D4037';
    const woodLight = '#A1887F';
    return `<svg viewBox="0 0 200 200" class="svg-tool">
      <defs>
        <linearGradient id="cheGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.5)"/>
          <stop offset="50%" stop-color="${glass}"/>
          <stop offset="100%" stop-color="rgba(180,210,235,0.5)"/>
        </linearGradient>
        <linearGradient id="cheWood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${woodLight}"/>
          <stop offset="50%" stop-color="${wood}"/>
          <stop offset="100%" stop-color="${woodDark}"/>
        </linearGradient>
      </defs>
      <!-- 玻璃漏斗（上宽下窄的锥形） -->
      <path d="M52 30 L148 30 L128 110 L72 110 Z" fill="url(#cheGlass)" stroke="${glassEdge}" stroke-width="2"/>
      <!-- 杯口 -->
      <ellipse cx="100" cy="30" rx="48" ry="10" fill="rgba(255,255,255,0.4)" stroke="${glassEdge}" stroke-width="2"/>
      <ellipse cx="100" cy="30" rx="40" ry="7" fill="rgba(200,225,245,0.3)"/>
      <!-- 漏斗内壁斜线（玻璃厚度） -->
      <path d="M58 38 L142 38" stroke="${glassEdge}" stroke-width="1" opacity="0.5"/>
      <!-- 木领（Chemex 标志性木质把手，在漏斗底部） -->
      <rect x="62" y="108" width="76" height="20" rx="3" fill="url(#cheWood)" stroke="${woodDark}" stroke-width="1.5"/>
      <!-- 木领上的皮绳 -->
      <path d="M78 108 L78 128" stroke="#5D4037" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M122 108 L122 128" stroke="#5D4037" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="100" cy="118" r="5" fill="none" stroke="#6D4C41" stroke-width="2"/>
      <!-- 木领高光 -->
      <rect x="66" y="110" width="68" height="3" rx="1.5" fill="${woodLight}" opacity="0.7"/>
      <!-- 漏斗底颈（接下壶的部分） -->
      <rect x="88" y="128" width="24" height="16" fill="url(#cheGlass)" stroke="${glassEdge}" stroke-width="1.5"/>
      <ellipse cx="100" cy="144" rx="12" ry="3" fill="rgba(180,210,235,0.4)"/>
      <!-- 玻璃高光 -->
      <path d="M58 38 Q52 72 72 108" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="78" cy="50" rx="8" ry="3" fill="#fff" opacity="0.3"/>
    </svg>`;
  },

  // 滤纸（适配梯形滤杯）
  filter() {
    return `<svg viewBox="0 0 200 200" class="svg-tool" style="opacity:0.93">
      <defs>
        <linearGradient id="filtPaper" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFEF7"/>
          <stop offset="100%" stop-color="#F5EFE0"/>
        </linearGradient>
      </defs>
      <path d="M56 38 L144 38 L132 145 L68 145 Z" fill="url(#filtPaper)" stroke="#D8CFBC" stroke-width="1.5"/>
      <!-- 滤纸接缝 -->
      <path d="M100 41 L100 143" stroke="#C8BEA8" stroke-width="1" stroke-dasharray="2 3"/>
      <!-- 纸纹 -->
      <g stroke="#E8E0D0" stroke-width="0.6" opacity="0.5">
        <path d="M68 55 Q100 57 132 55" fill="none"/>
        <path d="M70 75 Q100 77 130 75" fill="none"/>
        <path d="M72 95 Q100 97 128 95" fill="none"/>
        <path d="M74 115 Q100 117 126 115" fill="none"/>
      </g>
    </svg>`;
  },

  // 咖啡粉层
  grounds(height = 30) {
    return `<svg viewBox="0 0 200 200" class="svg-tool">
      <defs>
        <linearGradient id="grdTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#6D4C41"/>
          <stop offset="100%" stop-color="#4E342E"/>
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="${148 - height}" rx="38" ry="6" fill="#3E2723"/>
      <path d="M62 ${148 - height} Q100 ${153 - height} 138 ${148 - height} L132 148 Q100 154 68 148 Z" fill="url(#grdTop)"/>
      <ellipse cx="100" cy="${148 - height}" rx="36" ry="3.5" fill="#8D6E63" opacity="0.5"/>
    </svg>`;
  },

  // 细嘴手冲壶（鹅颈壶）
  kettle(temp = 20, boiling = false) {
    const tempColor = temp >= 90 ? '#FF5252' : temp >= 70 ? '#FFA726' : '#66BB6A';
    return `<svg viewBox="0 0 200 200" class="svg-tool">
      <defs>
        <linearGradient id="ketBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#90A4AE"/>
          <stop offset="30%" stop-color="#607D8B"/>
          <stop offset="70%" stop-color="#455A64"/>
          <stop offset="100%" stop-color="#37474F"/>
        </linearGradient>
        <linearGradient id="ketShine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.5)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </linearGradient>
      </defs>
      <!-- 壶身（圆润矮胖） -->
      <path d="M58 72 Q58 62 70 62 L132 62 Q144 62 144 72 L148 158 Q148 170 136 170 L66 170 Q54 170 54 158 Z" fill="url(#ketBody)" stroke="#263238" stroke-width="2"/>
      <!-- 高光带 -->
      <path d="M62 66 L138 66 L140 88 L60 88 Z" fill="url(#ketShine)"/>
      <ellipse cx="100" cy="100" rx="30" ry="6" fill="rgba(255,255,255,0.08)"/>
      <!-- 壶盖 -->
      <ellipse cx="101" cy="60" rx="36" ry="7" fill="#546E7A" stroke="#263238" stroke-width="1.5"/>
      <ellipse cx="101" cy="58" rx="36" ry="4" fill="#78909C" opacity="0.6"/>
      <circle cx="101" cy="52" r="6" fill="#37474F" stroke="#263238" stroke-width="1.5"/>
      <circle cx="101" cy="51" r="3" fill="#546E7A"/>
      <!-- 鹅颈细嘴（向左上方弯曲） -->
      <path d="M58 75 Q30 70 18 52 Q14 45 20 42 L26 46 Q24 50 28 56 Q38 70 58 78 Z" fill="url(#ketBody)" stroke="#263238" stroke-width="1.8"/>
      <path d="M20 44 L28 50" stroke="#78909C" stroke-width="1" opacity="0.6"/>
      <!-- 把手 -->
      <path d="M144 72 Q172 78 172 108 Q172 138 144 144" fill="none" stroke="#37474F" stroke-width="7" stroke-linecap="round"/>
      <path d="M144 72 Q172 78 172 108 Q172 138 144 144" fill="none" stroke="#546E7A" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
      <!-- 温度显示屏 -->
      <rect x="68" y="108" width="64" height="30" rx="5" fill="#0D3110" stroke="#000" stroke-width="1.5"/>
      <rect x="70" y="110" width="60" height="26" rx="3" fill="#1B5E20"/>
      <text x="100" y="129" text-anchor="middle" font-family="'Courier New', monospace" font-size="15" font-weight="bold" fill="${tempColor}">${temp}°C</text>
      ${boiling ? `
      <g>
        <ellipse cx="78" cy="42" rx="3" ry="9" fill="#fff" opacity="0.5">
          <animate attributeName="cy" values="46;22;46" dur="1.1s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.5;0;0.5" dur="1.1s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="100" cy="40" rx="2.5" ry="7" fill="#fff" opacity="0.4">
          <animate attributeName="cy" values="42;20;42" dur="0.9s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0;0.4" dur="0.9s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="120" cy="43" rx="3" ry="8" fill="#fff" opacity="0.45">
          <animate attributeName="cy" values="47;24;47" dur="1.3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.45;0;0.45" dur="1.3s" repeatCount="indefinite"/>
        </ellipse>
      </g>` : ''}
    </svg>`;
  },

  // 电子秤
  scale(weight = 0) {
    return `<svg viewBox="0 0 200 200" class="svg-tool">
      <defs>
        <linearGradient id="scBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#6D4C41"/>
          <stop offset="100%" stop-color="#3E2723"/>
        </linearGradient>
        <linearGradient id="scTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#A1887F"/>
          <stop offset="100%" stop-color="#8D6E63"/>
        </linearGradient>
      </defs>
      <!-- 秤盘 -->
      <rect x="35" y="112" width="130" height="10" rx="3" fill="url(#scTop)" stroke="#5D4037" stroke-width="1"/>
      <rect x="40" y="112" width="120" height="3" rx="1.5" fill="#BCAAA4" opacity="0.6"/>
      <!-- 机身 -->
      <path d="M32 122 L168 122 L162 170 Q162 176 156 176 L44 176 Q38 176 38 170 Z" fill="url(#scBody)" stroke="#2E1A12" stroke-width="2"/>
      <!-- 显示屏 -->
      <rect x="52" y="136" width="96" height="26" rx="4" fill="#0D3110" stroke="#000" stroke-width="1.5"/>
      <rect x="54" y="138" width="92" height="22" rx="3" fill="#1B5E20"/>
      <text x="100" y="155" text-anchor="middle" font-family="'Courier New', monospace" font-size="17" font-weight="bold" fill="#69F0AE">${weight.toFixed(1)}g</text>
      <!-- 按钮 -->
      <circle cx="58" cy="167" r="3.5" fill="#4E342E" stroke="#2E1A12" stroke-width="0.8"/>
      <circle cx="142" cy="167" r="3.5" fill="#4E342E" stroke="#2E1A12" stroke-width="0.8"/>
      <!-- 高光 -->
      <rect x="42" y="124" width="116" height="2" rx="1" fill="#8D6E63" opacity="0.5"/>
    </svg>`;
  },

  // 咖啡豆
  beans() {
    return `<svg viewBox="0 0 200 200" class="svg-tool">
      <defs>
        <radialGradient id="beanA" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stop-color="#A1887F"/>
          <stop offset="55%" stop-color="#5D4037"/>
          <stop offset="100%" stop-color="#2E1A12"/>
        </radialGradient>
        <radialGradient id="beanB" cx="40%" cy="30%" r="75%">
          <stop offset="0%" stop-color="#8D6E63"/>
          <stop offset="55%" stop-color="#4E342E"/>
          <stop offset="100%" stop-color="#1A0E08"/>
        </radialGradient>
      </defs>
      <ellipse cx="72" cy="105" rx="30" ry="38" fill="url(#beanA)" transform="rotate(-22 72 105)"/>
      <path d="M58 73 Q72 105 58 137" fill="none" stroke="#1A0E08" stroke-width="2.5" stroke-linecap="round" transform="rotate(-22 72 105)"/>
      <ellipse cx="128" cy="112" rx="26" ry="34" fill="url(#beanB)" transform="rotate(18 128 112)"/>
      <path d="M116 82 Q128 112 116 142" fill="none" stroke="#1A0E08" stroke-width="2.5" stroke-linecap="round" transform="rotate(18 128 112)"/>
      <ellipse cx="100" cy="62" rx="22" ry="28" fill="url(#beanA)" transform="rotate(-8 100 62)" opacity="0.92"/>
      <path d="M89 38 Q100 62 89 86" fill="none" stroke="#1A0E08" stroke-width="2.2" stroke-linecap="round" transform="rotate(-8 100 62)"/>
      <!-- 高光 -->
      <ellipse cx="62" cy="88" rx="6" ry="10" fill="#D7CCC8" opacity="0.3" transform="rotate(-22 62 88)"/>
      <ellipse cx="118" cy="98" rx="5" ry="8" fill="#BCAAA4" opacity="0.25" transform="rotate(18 118 98)"/>
    </svg>`;
  },

  // 磨豆机（手摇）
  grinder(progress = 0) {
    const outH = 8 + progress * 22;
    return `<svg viewBox="0 0 200 200" class="svg-tool">
      <defs>
        <linearGradient id="grBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#78909C"/>
          <stop offset="50%" stop-color="#546E7A"/>
          <stop offset="100%" stop-color="#37474F"/>
        </linearGradient>
        <linearGradient id="grWood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#A1887F"/>
          <stop offset="100%" stop-color="#6D4C41"/>
        </linearGradient>
      </defs>
      <!-- 机身（金属） -->
      <rect x="62" y="58" width="76" height="88" rx="10" fill="url(#grBody)" stroke="#263238" stroke-width="2"/>
      <rect x="62" y="58" width="76" height="18" rx="9" fill="#90A4AE" opacity="0.7"/>
      <!-- 品牌标 -->
      <rect x="82" y="92" width="36" height="18" rx="3" fill="#263238" opacity="0.4"/>
      <text x="100" y="105" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#B0BEC5">GRIND</text>
      <!-- 顶部豆仓（木） -->
      <path d="M72 58 L128 58 L120 36 L80 36 Z" fill="url(#grWood)" stroke="#3E2723" stroke-width="1.5"/>
      <ellipse cx="100" cy="36" rx="20" ry="5" fill="#3E2723"/>
      <ellipse cx="100" cy="36" rx="16" ry="3.5" fill="#1A0E08"/>
      <!-- 摇柄 -->
      <g class="grinder-handle-svg">
        <rect x="96" y="12" width="8" height="26" rx="3" fill="#37474F" stroke="#263238" stroke-width="1"/>
        <circle cx="100" cy="11" r="9" fill="url(#grWood)" stroke="#3E2723" stroke-width="1.5"/>
        <circle cx="100" cy="11" r="4" fill="#3E2723" opacity="0.5"/>
      </g>
      <!-- 出粉口 -->
      <rect x="80" y="${150 - outH}" width="40" height="${outH}" rx="5" fill="#5D4037"/>
      <ellipse cx="100" cy="${150 - outH}" rx="20" ry="4" fill="#6D4C41" opacity="0.6"/>
    </svg>`;
  },

  // 分享壶（玻璃）
  server(level = 0) {
    const h = 115 * level / 100;
    return `<svg viewBox="0 0 200 200" class="svg-tool">
      <defs>
        <linearGradient id="svCoffee" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#8D6E63"/>
          <stop offset="100%" stop-color="#3E2723"/>
        </linearGradient>
        <linearGradient id="svGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.08)"/>
          <stop offset="50%" stop-color="rgba(255,255,255,0.3)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.08)"/>
        </linearGradient>
      </defs>
      <!-- 壶身（圆润） -->
      <path d="M62 52 L138 52 L142 70 L138 168 Q138 178 128 178 L72 178 Q62 178 62 168 Z" fill="rgba(255,255,255,0.12)" stroke="#A1887F" stroke-width="2.5"/>
      <path d="M62 52 L138 52 L142 70 L138 168 Q138 178 128 178 L72 178 Q62 178 62 168 Z" fill="url(#svGlass)"/>
      <!-- 咖啡液 -->
      <path d="M66 ${170 - h} L134 ${170 - h} L133 168 Q133 174 128 174 L72 174 Q67 174 67 168 Z" fill="url(#svCoffee)"/>
      <ellipse cx="100" cy="${170 - h}" rx="34" ry="5" fill="#A1887F" opacity="0.6"/>
      <!-- 壶嘴 -->
      <path d="M138 58 L160 50 L158 60 L140 66 Z" fill="rgba(255,255,255,0.18)" stroke="#A1887F" stroke-width="2"/>
      <!-- 把手 -->
      <path d="M62 62 Q34 68 34 100 Q34 132 62 138" fill="none" stroke="#A1887F" stroke-width="6" stroke-linecap="round"/>
      <path d="M62 62 Q34 68 34 100 Q34 132 62 138" fill="none" stroke="#8D6E63" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
      <!-- 刻度 -->
      <g stroke="#A1887F" stroke-width="1" opacity="0.5">
        <line x1="68" y1="95" x2="74" y2="95"/>
        <line x1="68" y1="120" x2="74" y2="120"/>
        <line x1="68" y1="145" x2="74" y2="145"/>
      </g>
      <!-- 玻璃高光 -->
      <path d="M68 58 Q60 110 72 170" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  },

  // 法压壶
  frenchPress(waterLevel = 0, pressPos = 0) {
    const h = 105 * waterLevel / 100;
    const pressY = 38 + pressPos;
    return `<svg viewBox="0 0 200 200" class="svg-tool">
      <defs>
        <linearGradient id="fpCoffee" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#A1887F"/>
          <stop offset="100%" stop-color="#4E342E"/>
        </linearGradient>
        <linearGradient id="fpMetal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#B0BEC5"/>
          <stop offset="50%" stop-color="#78909C"/>
          <stop offset="100%" stop-color="#546E7A"/>
        </linearGradient>
        <linearGradient id="fpGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.05)"/>
          <stop offset="50%" stop-color="rgba(255,255,255,0.25)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.05)"/>
        </linearGradient>
      </defs>
      <!-- 底座 -->
      <ellipse cx="100" cy="178" rx="48" ry="7" fill="#546E7A"/>
      <rect x="52" y="172" width="96" height="8" rx="4" fill="url(#fpMetal)" stroke="#37474F" stroke-width="1.5"/>
      <!-- 金属框架竖条 -->
      <rect x="54" y="48" width="6" height="124" fill="url(#fpMetal)" stroke="#37474F" stroke-width="1"/>
      <rect x="140" y="48" width="6" height="124" fill="url(#fpMetal)" stroke="#37474F" stroke-width="1"/>
      <!-- 玻璃壶身 -->
      <rect x="60" y="48" width="80" height="124" rx="4" fill="url(#fpGlass)" stroke="#90A4AE" stroke-width="2"/>
      <!-- 咖啡液 -->
      <rect x="63" y="${170 - h}" width="74" height="${Math.max(0, h - 3)}" rx="2" fill="url(#fpCoffee)"/>
      <ellipse cx="100" cy="${170 - h}" rx="37" ry="3.5" fill="#A1887F" opacity="0.5"/>
      <!-- 压杆 -->
      <rect x="96" y="${pressY}" width="8" height="${168 - pressY}" rx="3" fill="url(#fpMetal)" stroke="#37474F" stroke-width="1"/>
      <!-- 压盘（带滤网） -->
      <circle cx="100" cy="${162 - pressPos}" r="34" fill="none" stroke="#546E7A" stroke-width="2"/>
      <circle cx="100" cy="${162 - pressPos}" r="30" fill="#78909C" opacity="0.6" stroke="#455A64" stroke-width="1"/>
      <g stroke="#455A64" stroke-width="0.8" opacity="0.6">
        <line x1="74" y1="${162 - pressPos}" x2="126" y2="${162 - pressPos}"/>
        <line x1="78" y1="${156 - pressPos}" x2="122" y2="${156 - pressPos}"/>
        <line x1="78" y1="${168 - pressPos}" x2="122" y2="${168 - pressPos}"/>
      </g>
      <!-- 顶部压钮 -->
      <circle cx="100" cy="${pressY}" r="11" fill="url(#fpMetal)" stroke="#37474F" stroke-width="1.5"/>
      <circle cx="100" cy="${pressY}" r="5" fill="#37474F" opacity="0.5"/>
      <!-- 壶盖 -->
      <ellipse cx="100" cy="48" rx="42" ry="8" fill="url(#fpMetal)" stroke="#37474F" stroke-width="1.5"/>
      <!-- 把手 -->
      <path d="M146 62 Q172 68 172 100 Q172 130 146 136" fill="none" stroke="#546E7A" stroke-width="6" stroke-linecap="round"/>
      <path d="M146 62 Q172 68 172 100 Q172 130 146 136" fill="none" stroke="#37474F" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
      <!-- 玻璃高光 -->
      <path d="M66 54 Q60 110 70 168" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  },

  // 摩卡壶
  mokaPot(coffeeLevel = 0, heating = false) {
    const h = 42 * coffeeLevel / 100;
    return `<svg viewBox="0 0 200 200" class="svg-tool">
      <defs>
        <linearGradient id="mkMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ECEFF1"/>
          <stop offset="40%" stop-color="#B0BEC5"/>
          <stop offset="100%" stop-color="#607D8B"/>
        </linearGradient>
        <linearGradient id="mkDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#78909C"/>
          <stop offset="100%" stop-color="#455A64"/>
        </linearGradient>
        <linearGradient id="mkCoffee" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#6D4C41"/>
          <stop offset="100%" stop-color="#2E1A12"/>
        </linearGradient>
      </defs>
      ${heating ? `
      <ellipse cx="100" cy="188" rx="38" ry="9" fill="#FF6F00" opacity="0.55">
        <animate attributeName="opacity" values="0.35;0.7;0.35" dur="0.3s" repeatCount="indefinite"/>
      </ellipse>` : ''}
      <!-- 下壶（八角形简化为梯形带圆角） -->
      <path d="M52 128 L148 128 L142 176 Q142 184 134 184 L66 184 Q58 184 58 176 Z" fill="url(#mkMetal)" stroke="#455A64" stroke-width="2"/>
      <ellipse cx="100" cy="128" rx="48" ry="9" fill="url(#mkDark)"/>
      <!-- 下壶高光 -->
      <path d="M62 132 L72 176" stroke="rgba(255,255,255,0.3)" stroke-width="3" stroke-linecap="round"/>
      <!-- 安全阀 -->
      <circle cx="138" cy="156" r="5" fill="#37474F" stroke="#263238" stroke-width="1"/>
      <circle cx="138" cy="156" r="2" fill="#546E7A"/>
      <!-- 粉槽漏斗 -->
      <path d="M74 128 L126 128 L118 106 L82 106 Z" fill="#90A4AE" stroke="#546E7A" stroke-width="1.5"/>
      <ellipse cx="100" cy="106" rx="18" ry="3.5" fill="#546E7A"/>
      <!-- 上下壶连接处螺纹 -->
      <rect x="72" y="100" width="56" height="10" rx="2" fill="#78909C" stroke="#455A64" stroke-width="1"/>
      <g stroke="#455A64" stroke-width="0.8" opacity="0.7">
        <line x1="76" y1="103" x2="124" y2="103"/>
        <line x1="76" y1="107" x2="124" y2="107"/>
      </g>
      <!-- 上壶 -->
      <path d="M60 100 L140 100 L134 56 Q134 46 124 46 L76 46 Q66 46 66 56 Z" fill="url(#mkMetal)" stroke="#455A64" stroke-width="2"/>
      <!-- 上壶咖啡液 -->
      <path d="M68 ${96 - h} L132 ${96 - h} L130 96 Q130 98 128 98 L72 98 Q70 98 70 96 Z" fill="url(#mkCoffee)"/>
      <ellipse cx="100" cy="${96 - h}" rx="31" ry="4" fill="#8D6E63" opacity="0.6"/>
      <!-- 上壶高光 -->
      <path d="M68 52 L74 94" stroke="rgba(255,255,255,0.3)" stroke-width="3" stroke-linecap="round"/>
      <!-- 壶盖 -->
      <ellipse cx="100" cy="46" rx="30" ry="8" fill="url(#mkDark)" stroke="#455A64" stroke-width="1.5"/>
      <circle cx="100" cy="37" r="8" fill="url(#mkDark)" stroke="#37474F" stroke-width="1.5"/>
      <circle cx="100" cy="37" r="3.5" fill="#37474F" opacity="0.6"/>
      <!-- 壶嘴 -->
      <path d="M134 62 L158 52 L156 64 L134 72 Z" fill="url(#mkMetal)" stroke="#455A64" stroke-width="1.5"/>
      <!-- 把手 -->
      <path d="M60 58 Q32 64 32 96 Q32 124 60 128" fill="none" stroke="#37474F" stroke-width="7" stroke-linecap="round"/>
      <path d="M60 58 Q32 64 32 96 Q32 124 60 128" fill="none" stroke="#546E7A" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
    </svg>`;
  },

  // 虹吸壶
  siphon(waterLevel = 0, phase = 'idle') {
    const w = 60 * waterLevel / 100;
    return `<svg viewBox="0 0 200 200" class="svg-tool">
      <defs>
        <linearGradient id="spGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.55)"/>
          <stop offset="50%" stop-color="rgba(200,230,255,0.3)"/>
          <stop offset="100%" stop-color="rgba(180,210,240,0.5)"/>
        </linearGradient>
        <linearGradient id="spWater" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#81D4FA"/>
          <stop offset="100%" stop-color="#29B6F6"/>
        </linearGradient>
        <linearGradient id="spCoffee" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#6D4C41"/>
          <stop offset="100%" stop-color="#3E2723"/>
        </linearGradient>
        <linearGradient id="spFrame" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#8D6E63"/>
          <stop offset="100%" stop-color="#5D4037"/>
        </linearGradient>
      </defs>
      <!-- 底座 -->
      <ellipse cx="100" cy="180" rx="52" ry="6" fill="#3E2723"/>
      <rect x="48" y="174" width="104" height="8" rx="4" fill="url(#spFrame)" stroke="#3E2723" stroke-width="1"/>
      <!-- 支柱 -->
      <rect x="44" y="96" width="5" height="78" fill="url(#spFrame)"/>
      <rect x="151" y="96" width="5" height="78" fill="url(#spFrame)"/>
      <rect x="40" y="94" width="14" height="7" rx="2" fill="#5D4037"/>
      <rect x="146" y="94" width="14" height="7" rx="2" fill="#5D4037"/>
      <!-- 酒精灯 -->
      <path d="M82 174 L118 174 L114 148 L86 148 Z" fill="#90A4AE" stroke="#546E7A" stroke-width="1.5"/>
      <ellipse cx="100" cy="148" rx="16" ry="4" fill="#78909C"/>
      <rect x="96" y="136" width="8" height="14" rx="2" fill="#5D4037"/>
      ${phase === 'heating' ? `
      <path d="M100 128 Q90 116 100 102 Q110 116 100 128" fill="#FF6F00">
        <animate attributeName="d" values="M100 128 Q90 116 100 102 Q110 116 100 128;M100 130 Q88 118 100 100 Q112 118 100 130;M100 128 Q90 116 100 102 Q110 116 100 128" dur="0.4s" repeatCount="indefinite"/>
      </path>
      <path d="M100 124 Q94 115 100 108 Q106 115 100 124" fill="#FFEB3B">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="0.3s" repeatCount="indefinite"/>
      </path>` : ''}
      <!-- 下壶 -->
      <path d="M54 174 Q42 138 64 118 L136 118 Q158 138 146 174 Z" fill="url(#spGlass)" stroke="rgba(120,160,200,0.6)" stroke-width="2"/>
      <ellipse cx="100" cy="118" rx="36" ry="7" fill="rgba(180,210,240,0.3)"/>
      <!-- 下壶水 -->
      ${phase === 'idle' || phase === 'heating' ? `<path d="M54 174 Q42 138 64 118 L136 118 Q158 138 146 174 Z" fill="url(#spWater)" opacity="0.6"/>` : ''}
      <!-- 下壶咖啡 -->
      ${phase === 'descending' ? `<path d="M62 ${174 - w * 0.6} Q54 ${148 - w * 0.3} 70 ${128 - w * 0.2} L130 ${128 - w * 0.2} Q146 ${148 - w * 0.3} 138 ${174 - w * 0.6} Z" fill="url(#spCoffee)" opacity="0.75"/>` : ''}
      <!-- 连接管 -->
      <rect x="97" y="88" width="6" height="32" fill="rgba(180,210,240,0.4)" stroke="rgba(120,160,200,0.6)" stroke-width="1"/>
      <!-- 滤芯 -->
      <ellipse cx="100" cy="88" rx="11" ry="3.5" fill="#90A4AE" stroke="#546E7A" stroke-width="1"/>
      <line x1="100" y1="88" x2="100" y2="118" stroke="#78909C" stroke-width="1.5" opacity="0.6"/>
      <!-- 上壶 -->
      <path d="M64 88 Q48 48 100 22 Q152 48 136 88 Z" fill="url(#spGlass)" stroke="rgba(120,160,200,0.6)" stroke-width="2"/>
      <ellipse cx="100" cy="88" rx="36" ry="7" fill="rgba(180,210,240,0.3)"/>
      <!-- 上壶液体 -->
      ${(phase === 'heating' || phase === 'brewing') ? `<path d="M64 88 Q48 48 100 22 Q152 48 136 88 Z" fill="${phase === 'brewing' ? 'url(#spCoffee)' : 'url(#spWater)'}" opacity="${phase === 'brewing' ? 0.75 : 0.6}"/>` : ''}
      <!-- 上壶粉 -->
      ${phase === 'brewing' ? `<ellipse cx="100" cy="55" rx="23" ry="5" fill="#4E342E" opacity="0.6"/>` : ''}
      <!-- 玻璃高光 -->
      <path d="M60 56 Q54 78 68 100" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="78" cy="40" rx="6" ry="3" fill="#fff" opacity="0.3"/>
    </svg>`;
  },

  // 卡片用器具图标
  toolIcon(id) {
    switch(id) {
      case 'chemex': return this.chemexDripper('#4FC3F7');
      case 'melitta': return this.melittaDripper('#FFCCBC');
      case 'frenchpress': return this.frenchPress(60, 0);
      case 'moka': return this.mokaPot(50, false);
      case 'siphon': return this.siphon(50, 'idle');
      case 'espresso': return this.mokaPot(30, false); // 暂用摩卡代替
      case 'aeropress': return this.frenchPress(40, 0); // 暂用法压代替
      case 'coldbrew': return this.server(50);
      default: return this.beans();
    }
  },

  // 辅助：颜色变亮
  lighten(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + percent);
    const g = Math.min(255, ((num >> 8) & 0xff) + percent);
    const b = Math.min(255, (num & 0xff) + percent);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  },

  // 辅助：颜色变暗
  darken(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - percent);
    const g = Math.max(0, ((num >> 8) & 0xff) - percent);
    const b = Math.max(0, (num & 0xff) - percent);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
};
