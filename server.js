require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1/chat/completions';

// 通用 AI 对话接口（模块四：主动答疑）
app.post('/api/chat', async (req, res) => {
  if (!DEEPSEEK_API_KEY) {
    return res.json({
      ok: false,
      message: '⚠️ 后端未配置 DeepSeek API Key。请在项目根目录的 .env 文件中填入你的密钥，然后重启服务。'
    });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.json({ ok: false, message: '参数错误：缺少 messages 数组' });
  }

  try {
    const systemPrompt = `你是《寻萃集》的咖啡小助手"蛋蛋"，一只话痨又热心的咖啡豆精灵 ☕
性格：活泼俏皮、爱开玩笑、带点撒娇感，但讲咖啡知识时专业靠谱。
说话习惯：
- 偶尔用"嘿~""呀~""嘿嘿""啦~"等语气词，不要每条都加
- 自然地穿插 1-2 个咖啡相关 emoji（☕🫘🌡️⏱️💧），不要刷屏
- 用生活化的比喻解释咖啡原理，比如把闷蒸比作"让咖啡豆伸个懒腰"
- 回答简明，不要长篇大论，除非用户追问
- 称呼用户"小咖"或"你"
- 绝对不要说"作为AI""作为语言模型"这类话
你只回答咖啡相关的问题，如果用户问无关内容，幽默地把话题拉回咖啡。`;

    const finalMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const response = await fetch(DEEPSEEK_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: finalMessages,
        temperature: 0.9,
        max_tokens: 800
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      return res.json({ ok: true, content: data.choices[0].message.content });
    }
    return res.json({ ok: false, message: 'AI 响应解析失败：' + JSON.stringify(data).slice(0, 200) });
  } catch (err) {
    return res.json({ ok: false, message: '请求 DeepSeek 失败：' + err.message });
  }
});

// 冲煮过程中的智能提示接口（模块四：操作出错时主动提示）
// 传入当前器具、步骤、用户做了什么、已出错次数，返回一段解释性提示
app.post('/api/hint', async (req, res) => {
  if (!DEEPSEEK_API_KEY) {
    return res.json({
      ok: false,
      message: '⚠️ 未配置 DeepSeek API Key，智能提示暂不可用。'
    });
  }

  const { tool, step, userAction, errorCount } = req.body;

  const systemPrompt = `你是《寻萃集》的咖啡小助手"蛋蛋"，一只话痨又热心的咖啡豆精灵 ☕
用户在用「${tool}」做「${step}」这一步时操作不太对（已经试了 ${errorCount} 次啦）。
你的任务：用俏皮、鼓励的语气（2-4句话），用生活化的比喻解释"这样做可能造成什么结果、为什么"，引导小咖自己想想该怎么调整，不要直接说正确答案。
可以偶尔用"嘿~""呀~"等语气词，自然带 1 个 emoji，不要说"正确做法是"，不要列点。`;

  const userPrompt = `我在用${tool}做「${step}」，我刚才的操作是：${userAction}。请告诉我这样可能有什么问题。`;

  try {
    const response = await fetch(DEEPSEEK_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 300
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      return res.json({ ok: true, content: data.choices[0].message.content });
    }
    return res.json({ ok: false, message: '提示生成失败' });
  } catch (err) {
    return res.json({ ok: false, message: '请求失败：' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n☕ 寻萃集已启动：http://localhost:${PORT}`);
  if (!DEEPSEEK_API_KEY) {
    console.log('⚠️  注意：未检测到 DeepSeek API Key，AI 答疑与智能提示功能暂不可用。');
    console.log('   请编辑 .env 文件填入 DEEPSEEK_API_KEY 后重启服务。\n');
  } else {
    console.log('✅ DeepSeek API Key 已加载，AI 功能可用。\n');
  }
});
