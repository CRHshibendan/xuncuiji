/* ===== 寻萃集 · 器具数据 ===== */
// 所有器具数据，包含：基础信息、结构、学习内容、冲煮步骤、皮肤

const TOOLS = [
  {
    id: 'chemex',
    name: 'Chemex',
    emoji: '⏳',
    method: '滴滤式',
    color: 'sky',
    desc: '标志性的沙漏型玻璃壶，厚滤纸过滤，口感干净清澈如茶。',
    unlocked: true,
    hasFullFlow: true,
    structure: [
      { name: '上壶', desc: '装咖啡粉和热水，漏斗形' },
      { name: '下壶', desc: '承接咖啡液，沙漏型玻璃瓶身' },
      { name: '木领', desc: '木质把手，隔热且标志性' },
      { name: '滤纸', desc: 'Chemex 专用厚滤纸，过滤油脂' },
      { name: '手冲壶', desc: '细长壶嘴控制水流' },
      { name: '电子秤', desc: '称量粉量与注水量' }
    ],
    usage: [
      '称取 15g 咖啡豆，研磨至中研磨度',
      '折叠厚滤纸放入上壶，用热水润湿并温壶',
      '倒入咖啡粉，轻拍整平',
      '注入 40g 水闷蒸 45 秒',
      '缓慢注水至 240g，保持稳定水流',
      '滴干后移除上壶，即可享用'
    ],
    principle: 'Chemex 属于滴滤式冲煮。其沙漏造型和厚滤纸是核心：厚滤纸过滤掉咖啡油脂和细粉，使口感如茶般干净清澈；木领不仅隔热，更是 Chemex 的经典符号。',
    brewSteps: [
      { id: 'weigh', name: '称豆', desc: '把咖啡豆拖到秤上，称取 15g', tip: '粉水比约 1:16', target: { weight: 15 } },
      { id: 'grind', name: '研磨', desc: '点击研磨机，把豆子磨成中粉', tip: '中研磨度，类似粗砂糖', target: { grindTimes: 6 } },
      { id: 'boil', name: '烧水', desc: '点击水壶加热，到 93°C 停止', tip: 'Chemex 适合稍高水温', target: { temp: 93, range: [90, 96] } },
      { id: 'rinse', name: '润纸温壶', desc: '倒入热水润湿滤纸并温壶', tip: '厚滤纸需要充分润湿去纸味', target: { rinsed: true } },
      { id: 'dose', name: '投粉', desc: '把咖啡粉倒入上壶', tip: '轻拍让粉床平整', target: { dosed: true } },
      { id: 'bloom', name: '闷蒸', desc: '注入 40g 水，等待 45 秒', tip: 'Chemex 闷蒸时间稍长', target: { bloomWater: 40, wait: 45 } },
      { id: 'pour', name: '注水萃取', desc: '缓慢注水至 240g', tip: '保持稳定细水流', target: { totalWater: 240 } },
      { id: 'finish', name: '完成', desc: '移除上壶，一杯干净的 Chemex 完成！', tip: '厚滤纸让口感如茶般清澈', target: { done: true } }
    ],
    skins: [
      { id: 'default', name: '透明玻璃', color: '#4FC3F7', dripperColor: '#4FC3F7' },
      { id: 'premium', name: '琥珀金领', color: '#FFA726', dripperColor: '#FFA726', unlocked: true }
    ]
  },
  {
    id: 'melitta',
    name: 'Melitta',
    emoji: '🫖',
    method: '滴滤式',
    color: 'peach',
    desc: '滤纸咖啡的鼻祖，梯形平底单孔设计，简单经典。',
    unlocked: true,
    hasFullFlow: true,
    structure: [
      { name: '滤杯', desc: '梯形陶瓷杯，平底单孔' },
      { name: '滤纸', desc: 'Melitta 扇形滤纸' },
      { name: '分享壶', desc: '承接萃取的咖啡液' },
      { name: '手冲壶', desc: '控制水流' },
      { name: '电子秤', desc: '称量粉量与注水量' },
      { name: '磨豆机', desc: '研磨咖啡豆' }
    ],
    usage: [
      '称取 15g 咖啡豆，研磨至中细研磨度',
      '将扇形滤纸放入梯形滤杯，润湿滤纸',
      '倒入咖啡粉，轻拍整平',
      '注入 30g 水闷蒸 30 秒',
      '注水至 225g，保持稳定水流',
      '滴干后移除滤杯，享用'
    ],
    principle: 'Melitta 是滤纸咖啡的发明者。梯形平底单孔设计让水流速度均匀，操作容错率高，非常适合新手。单孔设计控制流速，内壁凸肋帮助排气。',
    brewSteps: [
      { id: 'weigh', name: '称豆', desc: '把咖啡豆拖到秤上，称取 15g', tip: '粉水比约 1:15', target: { weight: 15 } },
      { id: 'grind', name: '研磨', desc: '点击研磨机，把豆子磨成中细粉', tip: '中细研磨，类似细砂糖', target: { grindTimes: 6 } },
      { id: 'boil', name: '烧水', desc: '点击水壶加热，到 92°C 停止', tip: '标准手冲水温', target: { temp: 92, range: [88, 96] } },
      { id: 'rinse', name: '润纸温杯', desc: '倒入热水润湿滤纸', tip: '去除纸味并温杯', target: { rinsed: true } },
      { id: 'dose', name: '投粉', desc: '把咖啡粉倒入滤杯', tip: '轻拍整平粉床', target: { dosed: true } },
      { id: 'bloom', name: '闷蒸', desc: '注入 30g 水，等待 30 秒', tip: '排出二氧化碳', target: { bloomWater: 30, wait: 30 } },
      { id: 'pour', name: '注水萃取', desc: '缓慢注水至 225g', tip: '单孔设计流速稳定', target: { totalWater: 225 } },
      { id: 'finish', name: '完成', desc: '移除滤杯，一杯经典 Melitta 完成！', tip: '简单好用的入门手冲', target: { done: true } }
    ],
    skins: [
      { id: 'default', name: '经典白瓷', color: '#FFCCBC', dripperColor: '#FFCCBC' },
      { id: 'premium', name: '复古棕陶', color: '#A1887F', dripperColor: '#A1887F', unlocked: true }
    ]
  },
  {
    id: 'frenchpress',
    name: '法压壶',
    emoji: '🫖',
    method: '浸泡式',
    color: 'mint',
    desc: '浸泡式萃取的代表，操作简单，口感浓郁醇厚。',
    unlocked: true,
    hasFullFlow: true,
    structure: [
      { name: '玻璃壶身', desc: '耐高温玻璃，容纳咖啡与水' },
      { name: '滤网压杆', desc: '金属滤网，下压分离粉液' },
      { name: '压盖', desc: '密封壶口，保持温度' },
      { name: '把手', desc: '隔热握持' }
    ],
    usage: [
      '称取 30g 咖啡豆，研磨至粗研磨度（类似粗砂糖）',
      '将咖啡粉倒入法压壶',
      '倒入 480g 约 93°C 的热水，搅拌均匀',
      '盖上盖子（不压下），浸泡 4 分钟',
      '缓慢匀速压下压杆到底',
      '立即倒出咖啡，避免继续萃取'
    ],
    principle: '法压壶属于浸泡式冲煮。咖啡粉与水完全接触浸泡，金属滤网保留了咖啡油脂，因此口感比滤纸手冲更浓郁厚重。浸泡时间决定萃取程度，压杆下压只是物理分离，不再继续萃取。',
    brewSteps: [
      {
        id: 'weigh',
        name: '称豆',
        desc: '把咖啡豆拖到秤上，称取 30g',
        tip: '法压壶用粉量较大，因为是浸泡式',
        target: { weight: 30 }
      },
      {
        id: 'grind',
        name: '研磨',
        desc: '点击研磨机手柄，把豆子磨成粗粉',
        tip: '粗研磨，类似粗砂糖，避免细粉穿过滤网',
        target: { grindTimes: 4 }
      },
      {
        id: 'dose',
        name: '投粉',
        desc: '把咖啡粉倒入法压壶',
        tip: '确保所有粉都进入壶底',
        target: { dosed: true }
      },
      {
        id: 'pour',
        name: '注水',
        desc: '按住水壶注水至 480g，然后搅拌',
        tip: '水温约 93°C，一次性注满',
        target: { water: 480 }
      },
      {
        id: 'steep',
        name: '浸泡',
        desc: '等待 4 分钟，让咖啡充分浸泡',
        tip: '不要压下滤网，让粉自由浸泡',
        target: { wait: 240 }
      },
      {
        id: 'press',
        name: '压滤',
        desc: '缓慢向下拖动压杆到底，分离粉液',
        tip: '匀速下压，不要太快以免溅出',
        target: { pressed: true }
      },
      {
        id: 'finish',
        name: '完成',
        desc: '倒出咖啡，一杯醇厚的法压咖啡完成！',
        tip: '立即倒出，避免壶底咖啡过度萃取',
        target: { done: true }
      }
    ],
    skins: [
      { id: 'default', name: '经典木', color: '#8D6E63', dripperColor: '#8D6E63' },
      { id: 'premium', name: '暗夜黑钢', color: '#37474F', dripperColor: '#37474F', unlocked: true }
    ]
  },
  {
    id: 'moka',
    name: '摩卡壶',
    emoji: '⚗️',
    method: '加压式',
    color: 'sky',
    desc: '利用蒸汽压力萃取，口感接近意式浓缩，居家意式入门。',
    unlocked: true,
    hasFullFlow: true,
    structure: [
      { name: '下壶', desc: '装水，加热产生蒸汽' },
      { name: '粉槽', desc: '漏斗形，装咖啡粉' },
      { name: '上壶', desc: '承接萃取的咖啡' },
      { name: '密封圈', desc: '密封上下壶，建立压力' },
      { name: '安全阀', desc: '压力过高时泄压' }
    ],
    usage: [
      '下壶加水至安全阀下方',
      '粉槽装入咖啡粉（细研磨），轻刮平，不要压紧',
      '拧紧上下壶，放在小火上加热',
      '听到咕噜声、咖啡开始流出时，离火',
      '用冷水冲下壶底部停止萃取',
      '摇匀上壶后倒出饮用'
    ],
    principle: '摩卡壶利用蒸汽压力原理。下壶的水加热后产生蒸汽，压力将热水推过粉槽中的咖啡粉，萃取后的咖啡液上升到上壶。压力约 1-2 个大气压，萃取浓度高于手冲但低于专业意式机。',
    brewSteps: [
      {
        id: 'fillwater',
        name: '装水',
        desc: '把水倒入下壶至安全阀下方',
        tip: '水位不要超过安全阀，否则有安全隐患',
        target: { water: true }
      },
      {
        id: 'dose',
        name: '装粉',
        desc: '把咖啡粉倒入粉槽，刮平表面',
        tip: '细研磨，不要压实，让水均匀通过',
        target: { dosed: true }
      },
      {
        id: 'assemble',
        name: '组装',
        desc: '把上壶拧紧到下壶上',
        tip: '确保拧紧，建立密封压力',
        target: { assembled: true }
      },
      {
        id: 'heat',
        name: '加热',
        desc: '点击炉灶开火加热，等咖啡流出后关火',
        tip: '小火加热，听到咕噜声就可以离火了',
        target: { heated: true }
      },
      {
        id: 'finish',
        name: '完成',
        desc: '摩卡壶咖啡完成！摇匀后倒出享用',
        tip: '可用冷水冲下壶底部停止萃取',
        target: { done: true }
      }
    ],
    skins: [
      { id: 'default', name: '经典铝', color: '#B0BEC5', dripperColor: '#B0BEC5' },
      { id: 'premium', name: '玫瑰金', color: '#BCAAA4', dripperColor: '#BCAAA4', unlocked: true }
    ]
  },
  {
    id: 'siphon',
    name: '虹吸壶',
    emoji: '🔮',
    method: '真空式',
    color: 'lavender',
    desc: '利用蒸汽压力和真空原理萃取，视觉效果华丽，风味干净。',
    unlocked: true,
    hasFullFlow: true,
    structure: [
      { name: '上壶', desc: '玻璃球，装咖啡粉，水上升后萃取' },
      { name: '下壶', desc: '玻璃球，装水，加热产生蒸汽' },
      { name: '滤芯', desc: '金属滤网+弹簧，过滤咖啡粉' },
      { name: '支架', desc: '固定上下壶' },
      { name: '酒精灯', desc: '加热下壶' }
    ],
    usage: [
      '下壶加水，插入滤芯',
      '点燃酒精灯加热下壶',
      '水沸腾后上升到上壶',
      '倒入咖啡粉，搅拌均匀',
      '浸泡 60 秒后移开火源',
      '咖啡液因真空下降到下壶，完成'
    ],
    principle: '虹吸壶利用蒸汽压力和真空原理。加热下壶使水沸腾产生蒸汽，压力将水推到上壶与咖啡粉接触萃取；移开火源后下壶冷却形成真空，咖啡液被吸回下壶，同时通过滤芯过滤。',
    brewSteps: [
      { id: 'fillwater', name: '装水', desc: '把水倒入下壶', tip: '加到下壶标记线', target: { water: true } },
      { id: 'assemble', name: '组装', desc: '插入滤芯，扣上上壶', tip: '确保滤芯弹簧朝下', target: { assembled: true } },
      { id: 'heat', name: '加热', desc: '点燃酒精灯加热，等水升到上壶', tip: '水全部升上去后再加粉', target: { heated: true } },
      { id: 'dose', name: '投粉', desc: '把咖啡粉倒入上壶并搅拌', tip: '中研磨度，搅拌让粉充分接触', target: { dosed: true } },
      { id: 'brew', name: '萃取', desc: '等待 60 秒让咖啡萃取', tip: '不要搅拌，静置萃取', target: { wait: 60 } },
      { id: 'remove', name: '离火', desc: '移走酒精灯，咖啡会流回下壶', tip: '用湿布擦下壶加速冷却', target: { removed: true } },
      { id: 'finish', name: '完成', desc: '虹吸咖啡完成！倒出享用', tip: '风味干净，有花果香', target: { done: true } }
    ],
    skins: [
      { id: 'default', name: '透明玻璃', color: '#CE93D8', dripperColor: '#CE93D8' },
      { id: 'premium', name: '紫晶限定', color: '#AB47BC', dripperColor: '#AB47BC', unlocked: true }
    ]
  },
  {
    id: 'espresso',
    name: '意式咖啡机',
    emoji: '🎛️',
    method: '高压式',
    color: 'lavender',
    desc: '9 个大气压高压萃取，是拿铁、卡布奇诺的基底。',
    unlocked: true,
    hasFullFlow: false,
    structure: [
      { name: '冲煮头', desc: '高压热水通过的出口' },
      { name: '手柄', desc: '装粉并锁定在冲煮头' },
      { name: '蒸汽棒', desc: '打发牛奶制作奶泡' },
      { name: '锅炉', desc: '产生高温高压热水' }
    ],
    usage: [
      '研磨 18-20g 咖啡粉至细研磨',
      '装入手柄并压粉',
      '锁定手柄，启动萃取 25-30 秒',
      '得到约 36-40g 浓缩咖啡'
    ],
    principle: '意式咖啡机通过 9 个大气压的高压，让 90-96°C 的热水在 25-30 秒内通过压紧的咖啡粉饼，高效萃取出可溶性物质和油脂（crema）。',
    brewSteps: [],
    skins: []
  },
  {
    id: 'aeropress',
    name: '爱乐压',
    emoji: '💉',
    method: '加压浸泡式',
    color: 'peach',
    desc: '结合浸泡与加压，玩法多变，便携耐用。',
    unlocked: true,
    hasFullFlow: false,
    structure: [
      { name: '管筒', desc: '主容器，装粉装水' },
      { name: '活塞', desc: '下压产生压力' },
      { name: '滤盖', desc: '滤纸+盖子，过滤咖啡' },
      { name: '搅拌棒', desc: '搅拌粉水混合' }
    ],
    usage: [
      '正放或倒放，装入 15g 中细研磨粉',
      '注入 80°C 水 240g',
      '搅拌后浸泡 1-2 分钟',
      '缓慢下压活塞完成萃取'
    ],
    principle: '爱乐压结合了浸泡和加压。先浸泡让风味充分溶出，再通过活塞加压加速过滤。可通过研磨、水温、浸泡时间灵活调节风味。',
    brewSteps: [],
    skins: []
  },
  {
    id: 'coldbrew',
    name: '冷萃壶',
    emoji: '🧊',
    method: '冷浸泡式',
    color: 'pink',
    desc: '低温长时间萃取，口感顺滑低酸，适合夏天。',
    unlocked: true,
    hasFullFlow: false,
    structure: [
      { name: '壶身', desc: '装水和咖啡粉' },
      { name: '滤网', desc: '分离咖啡渣' },
      { name: '壶盖', desc: '密封冷藏' }
    ],
    usage: [
      '粗研磨咖啡粉 100g',
      '加入 1L 冷水或室温水',
      '搅拌均匀，密封冷藏 12-24 小时',
      '过滤后即可饮用'
    ],
    principle: '冷萃利用低温长时间萃取，减少了酸性物质和苦味化合物的溶出，因此口感更顺滑、甜度更高、酸度更低。',
    brewSteps: [],
    skins: []
  }
];

// 器具颜色映射
const COLOR_MAP = {
  yellow: '#FFE5B4',
  pink: '#FFD6E0',
  mint: '#C8E6C9',
  sky: '#B3E5FC',
  lavender: '#E1BEE7',
  peach: '#FFCCBC'
};

// 从 localStorage 读取解锁状态（开发阶段默认全解锁）
function loadProgress() {
  // 开发模式：所有器具和皮肤都解锁
  const allUnlocked = TOOLS.map(t => t.id);
  const allSkins = {};
  TOOLS.forEach(t => {
    allSkins[t.id] = {};
    t.skins.forEach(s => { allSkins[t.id][s.id] = true; });
  });
  return { unlocked: allUnlocked, skins: allSkins, completed: allUnlocked };
}

function saveProgress(progress) {
  localStorage.setItem('xuncui_progress', JSON.stringify(progress));
}
