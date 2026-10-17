/* ===== 寻萃集 · SVG 器具插画库 ===== */
// 高保真 SVG 咖啡器具插画，支持皮肤换色
// 所有插画尺寸统一为 viewBox 0 0 200 200，通过 CSS 缩放

const SVGTools = {
  // 滤杯：type='melitta'（梯形陶瓷）或 'chemex'（玻璃漏斗+木领）
  dripper(color = '#FF7043', type = 'melitta', level = 0, opts = {}) {
    if (type === 'chemex') return this.chemexDripper(color, level, opts);
    return this.melittaDripper(color);
  },

  // Melitta 梯形陶瓷滤杯（带把手、肋骨、承托底座）
  melittaDripper(color) {
    const body = this.lighten(color, 55);
    const bodyDark = this.lighten(color, 40);
    const rim = this.lighten(color, 62);
    const rimInner = this.lighten(color, 48);
    const stroke = this.darken(color, 30);
    const rib = this.darken(color, 18);
    return `<svg viewBox="0 0 640 640" class="svg-tool">
      <g stroke="#493F36" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
        <!-- 把手 -->
        <g id="handle">
          <path d="M464 237C503 219 550 235 553 275C556 316 517 355 463 362L451 331C492 326 520 302 518 279C517 257 495 255 475 269Z" fill="${body}"/>
        </g>
        <!-- 底座 -->
        <g id="base">
          <path d="M195 445V460C195 480 445 480 445 460V445Z" fill="${bodyDark}"/>
          <ellipse cx="320" cy="445" rx="125" ry="22" fill="${rim}"/>
          <path d="M276 411V441C289 452 351 452 364 441V411" fill="${body}"/>
        </g>
        <!-- 杯身 -->
        <g id="body">
          <path d="M130 185L241 411C250 431 390 431 399 411L510 185Z" fill="${body}"/>
          <path d="M147 218L250 410C255 422 385 422 390 410L493 218" stroke="${rib}" stroke-width="3"/>
          <g stroke="${rib}" stroke-width="3">
            <path d="M180 245L264 403"/>
            <path d="M232 258L287 409"/>
            <path d="M290 265L309 412"/>
            <path d="M350 265L331 412"/>
            <path d="M408 258L353 409"/>
            <path d="M460 245L376 403"/>
          </g>
        </g>
        <!-- 杯口 -->
        <g id="rim">
          <ellipse cx="320" cy="185" rx="190" ry="65" fill="${rim}"/>
          <ellipse cx="320" cy="185" rx="172" ry="49" fill="${rimInner}" stroke="${stroke}" stroke-width="3"/>
          <path d="M179 204L268 220M226 223L291 230M290 233L309 236M350 233L331 236M414 223L349 230M461 204L372 220" stroke="${rib}" stroke-width="2.5"/>
          <path d="M197 160C260 135 378 135 442 159" stroke="#FFFFFF" stroke-width="6"/>
        </g>
        <!-- 细节 -->
        <g id="details" stroke="${stroke}" stroke-width="2.5">
          <path d="M282 454C305 457 335 457 358 454"/>
          <path d="M260 394C270 402 370 402 380 394"/>
        </g>
      </g>
    </svg>`;
  },

  // Chemex 完整沙漏壶（玻璃漏斗+木领+皮绳+下壶），可含咖啡液、滤纸、粉层
  chemexDripper(color, level = 0, opts = {}) {
    const { showFilter = false, showGrounds = false } = opts;
    const glass = 'rgba(220, 240, 255, 0.36)';
    const glassEdge = 'rgba(140, 180, 210, 0.7)';
    const wood = '#C69A62';
    const woodDark = '#967044';
    const woodLight = '#E4C398';
    const fillH = 215 * Math.min(level, 100) / 100;
    const coffeeTop = 565 - fillH;
    const bodyPath = 'M166 145C183 191 228 240 268 286C282 303 280 321 265 342C230 391 170 436 166 493C162 541 198 565 320 565C442 565 478 541 474 493C470 436 410 391 375 342C360 321 358 303 372 286C412 240 457 191 474 145Z';
    return `<svg viewBox="0 0 640 640" class="svg-tool">
      <defs>
        <linearGradient id="cheCoffee" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#8D6E63"/>
          <stop offset="100%" stop-color="#3E2723"/>
        </linearGradient>
        <clipPath id="cheBodyClip"><path d="${bodyPath}"/></clipPath>
      </defs>
      <g stroke="#493F36" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
        <g id="glass-body">
          <path d="${bodyPath}" fill="${glass}" fill-opacity="0.36"/>
          <path d="M188 164C214 212 246 251 280 286M452 164C426 212 394 251 360 286" stroke="#B6C7C2" stroke-width="3"/>
          <!-- 咖啡液（裁剪在壶身内） -->
          ${fillH > 0 ? `<g clip-path="url(#cheBodyClip)">
            <rect x="160" y="${coffeeTop}" width="320" height="${fillH + 8}" fill="url(#cheCoffee)"/>
            <ellipse cx="320" cy="${coffeeTop}" rx="95" ry="9" fill="#6D4C41" opacity="0.45"/>
          </g>` : ''}
          <path d="M267 365C229 411 198 450 194 487C190 512 201 526 225 535" stroke="#FFFFFF" stroke-width="10"/>
          <path d="M398 400C424 431 446 462 448 491" stroke="#BBCBC5" stroke-width="3"/>
          <path d="M201 542C254 557 387 557 439 542" stroke="#AEBFB8" stroke-width="3"/>
          <path d="M416 467H432M422 492H438" stroke="#9FAEA7" stroke-width="3"/>
        </g>
        <!-- 滤纸（上壶漏斗内） -->
        ${showFilter ? `<g id="filter" opacity="0.92">
          <path d="M190 160C215 205 245 240 278 272C296 289 296 305 278 322C242 360 210 395 205 430 L435 430C430 395 398 360 362 322C344 305 344 289 362 272C395 240 425 205 450 160 Z" fill="#FFFEF7" stroke="#D8CFBC" stroke-width="2"/>
          <path d="M320 165 L320 425" stroke="#C8BEA8" stroke-width="1.2" stroke-dasharray="3 4"/>
        </g>` : ''}
        <!-- 咖啡粉层 -->
        ${showGrounds ? `<g id="grounds" clip-path="url(#cheBodyClip)">
          <ellipse cx="320" cy="230" rx="100" ry="14" fill="#5D4037"/>
          <ellipse cx="320" cy="226" rx="92" ry="10" fill="#6D4C41"/>
        </g>` : ''}
        <g id="rim-and-spout">
          <path d="M474 145C474 119 404 99 320 99C235 99 166 119 166 145C166 171 235 191 320 191C389 191 446 178 468 158L494 132C483 132 478 137 474 145Z" fill="#F9FCFA" fill-opacity="0.85"/>
          <path d="M183 145C211 117 413 114 454 143C429 166 370 176 320 176C261 176 210 165 183 145Z" fill="#E6EEEA" fill-opacity="0.65" stroke="#A7BAB0" stroke-width="2.5"/>
          <path d="M432 175C447 167 458 158 466 148" stroke="#A7BAB0" stroke-width="2.5"/>
        </g>
        <g id="wood-collar">
          <path d="M258 280C291 290 349 290 382 280L374 303C368 321 373 339 383 356C348 367 292 367 257 356C267 339 272 321 266 303Z" fill="${wood}"/>
          <path d="M320 289V363" stroke="${woodDark}" stroke-width="3"/>
          <g stroke="#A87D4B" stroke-width="2">
            <path d="M278 299C291 303 302 304 309 304M332 304C343 304 352 303 363 300"/>
            <path d="M275 342C289 347 299 347 309 348M332 348C343 348 353 347 365 343"/>
          </g>
          <path d="M272 291C295 296 306 296 311 296" stroke="${woodLight}" stroke-width="3"/>
        </g>
        <g id="leather-tie" stroke="#684832" stroke-width="4">
          <path d="M263 317C299 325 342 325 377 317"/>
          <path d="M263 325C299 333 342 333 377 325"/>
          <path d="M326 328C346 345 357 365 357 391C358 409 366 421 376 427M321 332C324 360 316 379 321 396C326 414 321 430 311 439"/>
          <path d="M317 323C308 302 293 300 289 308C285 319 300 326 317 323ZM325 323C336 302 352 302 354 312C356 323 340 328 325 323Z" fill="#DAC2A5" stroke-width="3"/>
          <ellipse cx="322" cy="328" rx="11" ry="14" fill="#AC794B" stroke-width="3"/>
        </g>
      </g>
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
