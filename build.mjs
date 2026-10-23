#!/usr/bin/env node
/* 二十四格 24frames — 零依赖静态生成器
 *
 * 用法：
 *   node build.mjs
 *   SITE_URL=https://example.com node build.mjs   # 额外生成 sitemap.xml 与 robots 指引
 *
 * 输入：src/data.js（唯一内容源）、src/style.css、src/app.js
 * 输出：index.html、reference.html、about.html、term/<id>.html、assets/style.css、assets/app.js
 *
 * 设计原则：内容只写一次（data.js），页面由构建产出。改内容不改模板。
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const SITE = (process.env.SITE_URL || '').replace(/\/+$/, '');
const SITE_NAME = '二十四格 24frames';
const SITE_DESC =
  'AI 影像术语库：视频与图片两侧，按运镜、景别、镜头、光线、色彩、构图、质感、节奏、转场、声音、流派、风格分类，每条给中英术语、什么时候用、中英文提示词模板、容易翻车与参数建议。';

/* 资源文件名带内容指纹。
 * 之前 assets/app.js 用一个固定名字，python http.server 不发 Cache-Control，
 * 浏览器就按启发式规则长期用旧副本——改了脚本但页面照旧跑旧的，
 * 排查时会误判成“代码没生效”。内容一变 URL 就变，缓存问题自然消失。 */
let ASSET_CSS = 'assets/style.css';
let ASSET_JS = 'assets/app.js';
const digest = (text) => crypto.createHash('sha256').update(text).digest('hex').slice(0, 10);

/* ---------------- 工具 ---------------- */

const esc = (v) =>
  String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const s = (v) => (v == null ? '' : String(v));

const writeFile = (rel, text) => {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, text, 'utf8');
  return { rel, bytes: Buffer.byteLength(text) };
};

/* ---------------- 内容 ---------------- */

const KIND_LABEL = { move: '运镜', style: '风格' };

/* 维度：一件作品真正由哪些可控项组成。media 决定它出现在视频还是图片一侧。 */
const DIM = {
  move: { label: '运镜' },
  shot: { label: '景别' },
  lens: { label: '镜头' },
  light: { label: '光线' },
  color: { label: '色彩' },
  comp: { label: '构图' },
  texture: { label: '质感' },
  tempo: { label: '节奏' },
  cut: { label: '转场' },
  sound: { label: '声音' },
  genre: { label: '流派' },
  style: { label: '风格' },
  ai: { label: 'AI 制作' },
  story: { label: '编剧' },
  direct: { label: '导演' },
};

const MEDIA = { video: '视频', image: '图片', plan: '编导' };

const DIM_ORDER = {
  video: ['move', 'shot', 'lens', 'light', 'color', 'comp', 'texture', 'tempo', 'cut', 'sound', 'genre', 'style', 'ai'],
  image: ['comp', 'light', 'color', 'lens', 'shot', 'texture', 'genre', 'style', 'ai'],
  plan: ['story', 'direct'],
};

/* 口语别名：页面承诺「搜『绕着人转一圈』也能命中『环绕』」。
   这些词只进 hay（检索用），不进任何可见文案，也不改变术语本身。 */
const ALIAS = {
  'story-logline': ['故事梗概', '一句话故事', '故事核'],
  'story-hook': ['开头', '黄金三秒', '前三秒', '抓人'],
  'story-cliffhanger': ['下集预告', '留悬念', '断章'],
  'dir-shot-list': ['分镜', '分镜头脚本', '拍摄清单', '分镜脚本'],
  'dir-180-rule': ['越轴', '对话机位', '左右反了'],
  'dir-shot-reverse': ['对话镜头', '两人对话', '来回切'],
  'ai-consistency': ['人物一致', '同一个人', '脸不一样', '换脸', '角色统一'],
  'ai-i2v': ['图片变视频', '让图片动起来', '首帧'],
  'ai-lipsync': ['口型', '说话', '配音对嘴'],
  'img-ai-char-sheet': ['三视图', '人设图', '角色三视图'],
  'img-ai-inpaint': ['局部修改', '修手', '改一部分'],
  orbit: ['绕着人转', '绕一圈', '转一圈', '转圈', '绕人一圈', '环绕镜头'],
  'rise-orbit': ['边升边转', '升起来转一圈', '往上绕'],
  'dolly-in': ['推近', '推进', '往前推', '推镜头', '靠近'],
  'dolly-out': ['拉远', '后拉', '往后退', '拉镜头', '退后'],
  'dolly-zoom': ['希区柯克变焦', '眩晕变焦', '推拉变焦', '拉近同时后退'],
  truck: ['平移', '横移', '侧移', '跟着移动'],
  pan: ['摇镜', '左右摇', '摇头', '扫一圈'],
  'whip-pan': ['甩镜', '快速摇', '甩过去', '唰一下'],
  handheld: ['手持', '抖动', '晃', '纪录片感'],
  steadicam: ['稳定器', '斯坦尼康', '跟拍', '跟着走'],
  pov: ['第一人称', '主观视角', '我看到的', '从眼睛看'],
  fpv: ['穿越机', '无人机穿', '穿梭', '钻缝'],
  'dutch-angle': ['荷兰角', '歪', '斜着拍', '倾斜'],
  'low-angle': ['仰拍', '从下往上', '低机位'],
  ots: ['过肩', '肩膀后面', '隔着人拍'],
  'shot-close': ['特写', '拍到脸', '怼近'],
  'shot-extreme-wide': ['大远景', '大场景', '一个人在山里'],
  'shot-medium': ['半身', '中景'],
  'macro-highspeed': ['微距', '高速摄影', '慢动作', '放慢'],
  'tempo-slow-motion': ['慢动作', '放慢', '升格'],
  'tempo-montage': ['快剪', '混剪', '剪辑感'],
  'cut-match': ['转场', '动作接动作'],
  'tex-film-grain': ['颗粒', '胶片颗粒', '颗粒感'],
  'tex-vhs': ['录像带', '老录像', '雪花点'],
  'genre-cyberpunk': ['赛博', '赛博朋克', '霓虹未来'],
  'img-genre-ink-wash': ['水墨', '国画', '水墨风'],
  'img-style-collage-poster': ['拼贴', '海报风', '杂志拼贴'],
  'img-style-airy-japanese': ['日系', '空气感', '小清新'],
  'img-light-backlit': ['逆光', '背光', '透光'],
  'img-comp-thirds': ['三分法', '九宫格'],
  'img-tex-watercolor': ['水彩', '水彩画'],
  'img-lens-tilt-shift': ['移轴', '微缩模型感'],
  'img-color-morandi': ['莫兰迪', '灰调', '低饱和'],
};

const dimsOf = (media) => DIM_ORDER[media] || Object.keys(DIM);
const dimRank = (media) => {
  const order = dimsOf(media);
  return (d) => {
    const i = order.indexOf(d);
    return i < 0 ? order.length : i;
  };
};

const GROUP_ORDER = ['基础', '进阶', '视角', '风格化', '写实', '动画', '类型', '东方', '人像', '静物', '建筑', '食物', '风景', '通用'];

/* ---------------- 构建期内容校验 ----------------
 * 内容源是「用 JS 语法写的数据」，出错时过去只会静默变成空串，等到浏览器里才炸。
 * 这里做硬校验：字段名拼错、类型不对、dim 与 media 不匹配、重名重 id，一条不合格就整次构建失败，
 * 并指出是哪条、哪个字段。缺内容的软问题只提示，不阻断构建。 */
const ALLOWED_FIELDS = new Set([
  'id', 'dim', 'media', 'zh', 'en', 'group', 'one', 'when',
  'keywords', 'promptZh', 'promptEn', 'fail', 'params',
]);
const TEXT_FIELDS = ['zh', 'en', 'one'];
const OPTIONAL_TEXT = ['when', 'promptZh', 'promptEn', 'params'];
const LIST_FIELDS = ['keywords', 'fail'];

const problems = [];
const warnings = [];

function checkRaw(raw, where, defaultKind) {
  const before = problems.length;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    problems.push(`${where} · 记录：应为对象，实际是 ${Array.isArray(raw) ? 'array' : typeof raw}`);
    return false;
  }
  for (const k of Object.keys(raw)) {
    if (!ALLOWED_FIELDS.has(k)) {
      problems.push(`${where} · ${k}：未知字段（允许 ${[...ALLOWED_FIELDS].join(' ')}）`);
    }
  }
  for (const k of TEXT_FIELDS) {
    if (typeof raw[k] !== 'string' || !raw[k].trim()) {
      problems.push(`${where} · ${k}：应为非空字符串，实际是 ${JSON.stringify(raw[k] == null ? null : raw[k])}`);
    }
  }
  // 字段缺失本身不报警：老的 src/data.js 只写了基本字段，没有 keywords 不是错。
  // 只有整条除标题外全空时才提示，那才是真会让卡片变成空壳的情况。
  for (const k of OPTIONAL_TEXT) {
    if (raw[k] != null && (typeof raw[k] !== 'string' || !raw[k].trim())) {
      problems.push(`${where} · ${k}：应为非空字符串`);
    }
  }
  for (const k of LIST_FIELDS) {
    if (raw[k] == null) continue;
    if (!Array.isArray(raw[k])) {
      problems.push(`${where} · ${k}：应为数组，实际是 ${typeof raw[k]}`);
      continue;
    }
    raw[k].forEach((v, j) => {
      if (typeof v !== 'string' || !v.trim()) problems.push(`${where} · ${k}[${j}]：应为非空字符串`);
    });
  }
  const hasBody =
    OPTIONAL_TEXT.some((k) => raw[k] != null) ||
    LIST_FIELDS.some((k) => Array.isArray(raw[k]) && raw[k].length > 0);
  if (!hasBody) {
    warnings.push(`${where} · 整条只有标题：when／关键词／提示词／翻车／参数全空`);
  }
  if (raw.id != null && !/^[a-z0-9][a-z0-9-]*$/.test(String(raw.id))) {
    problems.push(`${where} · id：应为 kebab-case（小写字母/数字/连字符），实际是 ${JSON.stringify(raw.id)}`);
  }
  const media = raw.media == null ? 'video' : raw.media;
  if (!MEDIA[media]) {
    problems.push(`${where} · media：应为 ${Object.keys(MEDIA).join(' / ')}，实际是 ${JSON.stringify(raw.media)}`);
  }
  const dim = raw.dim == null ? defaultKind : raw.dim;
  if (!DIM[dim]) {
    problems.push(`${where} · dim：未知维度 ${JSON.stringify(raw.dim)}（已知 ${Object.keys(DIM).join(' ')}）`);
  } else if (MEDIA[media] && !dimsOf(media).includes(dim)) {
    problems.push(`${where} · dim：${dim} 不在 ${media} 一侧的维度表（${dimsOf(media).join(' ')}）`);
  }
  return problems.length === before;
}

function reportProblems() {
  if (warnings.length) {
    console.warn(`[24frames] 内容提示：${warnings.length} 处（不阻断构建）`);
    for (const w of warnings.slice(0, 12)) console.warn(`  - ${w}`);
    if (warnings.length > 12) console.warn(`  …另有 ${warnings.length - 12} 处`);
  }
  if (!problems.length) return;
  console.error(`[24frames] 内容校验失败：${problems.length} 处`);
  for (const p of problems.slice(0, 40)) console.error(`  - ${p}`);
  if (problems.length > 40) console.error(`  …另有 ${problems.length - 40} 处`);
  process.exit(1);
}

function loadContent() {
  // 约定：src/data.js 是旧的运镜/风格源；src/data-*.js 可追加任意维度，
  // 通过 window.MZ_DATA_EXTRA 合并。多个文件共用一个 window。
  const files = fs
    .readdirSync(SRC)
    .filter((f) => f === 'data.js' || (f.startsWith('data-') && f.endsWith('.js')))
    .sort((a, b) => (a === 'data.js' ? -1 : b === 'data.js' ? 1 : a.localeCompare(b)));

  const sandbox = { window: {} };
  vm.createContext(sandbox);
  for (const f of files) {
    vm.runInContext(fs.readFileSync(path.join(SRC, f), 'utf8'), sandbox, { filename: `src/${f}` });
  }

  const w = sandbox.window || {};
  const base = w.MZ_DATA;
  if (!base || !Array.isArray(base.moves) || !Array.isArray(base.styles)) {
    throw new Error('src/data.js 未提供 window.MZ_DATA.moves / .styles');
  }
  const extra = Array.isArray(w.MZ_DATA_EXTRA) ? w.MZ_DATA_EXTRA : [];
  return { moves: base.moves, styles: base.styles, extra, files };
}

function toItem(raw, kind, i) {
  const id = s(raw.id) || `${kind}-${i + 1}`;
  const dim = s(raw.dim) || kind;
  const media = s(raw.media) || 'video';
  const dimLabel = (DIM[dim] || { label: KIND_LABEL[kind] || dim }).label;
  const item = {
    id: String(id),
    kind,
    dim,
    media,
    dimLabel,
    mediaLabel: MEDIA[media] || media,
    kindLabel: dimLabel,
    zh: s(raw.zh),
    en: s(raw.en),
    group: s(raw.group) || '未分组',
    one: s(raw.one),
    when: s(raw.when),
    keywords: Array.isArray(raw.keywords) ? raw.keywords.map(s) : [],
    promptZh: s(raw.promptZh),
    promptEn: s(raw.promptEn),
    fail: Array.isArray(raw.fail) ? raw.fail.map(s) : [],
    params: s(raw.params),
    order: i,
  };
  item.url = `term/${item.id}.html`;
  item.hay = [
    item.zh, item.en, item.one, item.when,
    item.keywords.join(' '), item.promptZh, item.promptEn,
    item.fail.join(' '), item.params, item.group,
    item.dimLabel, item.mediaLabel,
    ...(ALIAS[item.id] || []),
  ].join(' ').toLowerCase();
  return item;
}

function buildItems(data) {
  const raws = [
    ...data.moves.map((r, i) => ({ r, kind: 'move', i, where: `src/data.js · moves[${i}]` })),
    ...data.styles.map((r, i) => ({ r, kind: 'style', i, where: `src/data.js · styles[${i}]` })),
    ...(data.extra || []).map((r, i) => ({ r, kind: s(r && r.dim) || 'style', i, where: `src/data-extra*.js · extra[${i}]` })),
  ];
  const items = [];
  for (const { r, kind, i, where } of raws) {
    const label = `${where}${r && r.zh ? `（${r.zh}）` : ''}`;
    if (checkRaw(r, label, kind)) items.push(toItem(r, kind, i));
  }
  const rank = (g) => {
    const i = GROUP_ORDER.indexOf(g);
    return i < 0 ? GROUP_ORDER.length : i;
  };
  const mediaRank = (m) => { const i = Object.keys(MEDIA).indexOf(m); return i < 0 ? 9 : i; };
  items.sort((a, b) =>
    mediaRank(a.media) - mediaRank(b.media) ||
    dimRank(a.media)(a.dim) - dimRank(b.media)(b.dim) ||
    rank(a.group) - rank(b.group) ||
    a.order - b.order
  );

  const seen = new Set();
  const triple = new Map();
  for (const it of items) {
    if (seen.has(it.id)) problems.push(`id 重复：${it.id}`);
    seen.add(it.id);
    const key = `${it.media}|${it.dim}|${it.zh}`;
    if (triple.has(key)) {
      problems.push(`同介质同维度重名：${it.zh}（${MEDIA[it.media]} · ${it.dimLabel}），${triple.get(key)} 与 ${it.id}`);
    } else {
      triple.set(key, it.id);
    }
  }
  // 跨介质/跨维度同名不是错误，但要标出来，否则海报墙上看起来是重复卡片。
  // 标签本身必须真能区分：跨介质的标介质，同介质但跨维度的标维度。
  const nameCount = new Map();
  for (const it of items) nameCount.set(it.zh, (nameCount.get(it.zh) || 0) + 1);
  const namePeers = new Map();
  for (const it of items) {
    if (nameCount.get(it.zh) < 2) continue;
    if (!namePeers.has(it.zh)) namePeers.set(it.zh, []);
    namePeers.get(it.zh).push(it);
  }
  for (const it of items) {
    it.nameCount = nameCount.get(it.zh);
    it.nameDup = it.nameCount > 1;
    it.dupTag = '';
    if (it.nameDup) {
      const peers = namePeers.get(it.zh) || [];
      const multiMedia = new Set(peers.map((p) => p.media)).size > 1;
      it.dupTag = multiMedia ? it.mediaLabel : it.dimLabel;
    }
  }
  reportProblems();
  return items;
}

/* ---------------- 页面片段 ---------------- */

function shell({ title, desc, base, active, body, extraHead = '', jsonld = '' }) {
  const home = base === '' ? '/' : base;
  const nav = [
    { key: 'home', href: home, label: '全部' },
    { key: 'video', href: `${home}#video`, label: '视频' },
    { key: 'image', href: `${home}#image`, label: '图片' },
    { key: 'reference', href: `${base}reference.html`, label: '速查表' },
    { key: 'about', href: `${base}about.html`, label: '关于' },
  ]
    .map(
      (n) =>
        `<a href="${n.href}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a>`
    )
    .join('\n      ');

  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0e0f12">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:site_name" content="${esc(SITE_NAME)}">
<meta property="og:locale" content="zh_CN">
<link rel="stylesheet" href="${base}${ASSET_CSS}">
${extraHead}${jsonld}</head>
<body>
<a class="skip" href="#main">跳到正文</a>
<header class="site-head"><div class="wrap head-inner">
  <a class="brand" href="${home}"><span class="brand-zh">二十四格</span><span class="brand-en">24frames</span></a>
  <nav class="site-nav">
      ${nav}
  </nav>
</div></header>
<main id="main">
${body}
</main>
<footer class="site-foot"><div class="wrap">
  <p><strong>二十四格 / 24frames</strong>：一秒钟拆成 24 格，每一格都得有名字。这里收的是 AI 影像里那些本来就有名字的运镜与风格。</p>
  <p>提示词模板按生成模型的常见表现自写，<strong>尚未逐条真机出片验证</strong>；「容易翻车」是经验判断，不是官方限制。示例素材一律自制，不引用院线片段。</p>
  <p class="foot-links"><a href="${base}reference.html">术语速查表</a> · <a href="${base}about.html">关于与更新</a> · 无账号、无后端、无追踪</p>
</div></footer>
<script src="${base}${ASSET_JS}" defer></script>
</body>
</html>
`;
}

function block(it, uid) {
  const zhId = `${uid}-zh`;
  const enId = `${uid}-en`;
  let h = '';
  if (it.when) {
    h += `<div class="block"><h4>什么时候用</h4><p>${esc(it.when)}</p></div>`;
  }
  if (it.keywords.length) {
    h += `<div class="block"><h4>风格关键词</h4><ul class="chips-static">${it.keywords
      .map((k) => `<li>${esc(k)}</li>`)
      .join('')}</ul></div>`;
  }
  if (it.promptZh) {
    h += `<div class="block"><h4>提示词模板 · 中文</h4><pre id="${zhId}">${esc(it.promptZh)}</pre><button class="btn" type="button" data-copy="#${zhId}">复制中文模板</button></div>`;
  }
  if (it.promptEn) {
    h += `<div class="block"><h4>提示词模板 · English</h4><pre id="${enId}">${esc(it.promptEn)}</pre><button class="btn" type="button" data-copy="#${enId}" data-done="Copied">Copy English</button></div>`;
  }
  if (it.fail.length) {
    h += `<div class="block"><h4>容易翻车</h4><ul class="fail-list">${it.fail
      .map((f) => `<li>${esc(f)}</li>`)
      .join('')}</ul></div>`;
  }
  if (it.params) {
    h += `<div class="block"><h4>参数建议</h4><p>${esc(it.params)}</p></div>`;
  }
  return h;
}

/* 海报瀑布流：一张卡片＝一张海报。高度按序数错开，形成砖墙节奏；
   属性与筛选完全沿用原来的 data-item / data-media / data-dim / data-hay，
   所以 app.js 的筛选逻辑不需要为版式改动。 */
const POSTER_H = [320, 240, 360, 260, 300, 220];
const DIM_HUE = {
  story: 52, direct: 12, ai: 176,
  move: 24, shot: 205, lens: 268, light: 44, color: 332, comp: 158,
  texture: 18, tempo: 296, cut: 190, sound: 214, genre: 282, style: 0,
};

function poster(it, i) {
  const h = POSTER_H[(i * 5 + it.dim.length) % POSTER_H.length];
  const hue = DIM_HUE[it.dim] == null ? 210 : DIM_HUE[it.dim];
  const no = String(i + 1).padStart(3, '0');
  return `      <a class="poster" href="${it.url}" data-item data-media="${it.media}" data-dim="${it.dim}" data-kind="${it.kind}" data-id="${esc(it.id)}" data-zh="${esc(it.zh)}" data-en="${esc(it.en)}" data-hay="${esc(it.hay)}" style="--ph:${h}px;--hue:${hue}">
        <span class="p-scan" aria-hidden="true"></span>
        <span class="p-top"><span class="p-no">${no}</span><span class="p-dim">${it.dimLabel}${it.dupTag && it.dupTag !== it.dimLabel ? ` · ${it.dupTag}` : ''}</span></span>
        <span class="p-mid">
          <span class="p-zh">${esc(it.zh)}</span>
          <span class="p-en">${esc(it.en)}</span>
        </span>
        <span class="p-one">${esc(it.one)}</span>
        <span class="p-foot"><span class="p-media">${it.mediaLabel}</span><span class="p-group">${esc(it.group)}</span></span>
      </a>`;
}

function searchControls(items, { id = 'q', staticCount } = {}) {
  const total = items.length;
  const videos = items.filter((i) => i.media === 'video').length;
  const images = items.filter((i) => i.media === 'image').length;
  const dimChips = Object.keys(DIM)
    .filter((d) => items.some((i) => i.dim === d))
    .map((d) => {
      const n = items.filter((i) => i.dim === d).length;
      return `<button class="chip dim" type="button" data-fd="${d}" aria-pressed="false">${(DIM[d] || { label: d }).label}<span class="n">${n}</span></button>`;
    })
    .join('\n        ');
  return `<div class="controls">
      <div class="search-row">
        <span class="icon" aria-hidden="true">/</span>
        <input id="${id}" data-query type="search" autocomplete="off"
          placeholder="搜「绕着人转一圈」「dolly」「水墨」…也可以直接描述你想要的画面"
          aria-label="搜索术语">
      </div>
      <div class="chip-row" id="${id}-media">
        <button class="chip" type="button" data-fm="all" aria-pressed="true">全部</button>
        <button class="chip" type="button" data-fm="video" aria-pressed="false">视频</button>
        <button class="chip" type="button" data-fm="image" aria-pressed="false">图片</button>
        <span class="count" data-count>${staticCount || `共 ${total} 条（视频 ${videos} · 图片 ${images}）`}</span>
      </div>
      <div class="chip-row dim-row" id="${id}-dims">
        <button class="chip dim" type="button" data-fd="all" aria-pressed="true">全部维度</button>
        ${dimChips}
      </div>
    </div>`;
}

/* ---------------- 首页 ---------------- */

function renderIndex(items) {
  const anchorAt = {
    video: items.findIndex((i) => i.media === 'video'),
    image: items.findIndex((i) => i.media === 'image'),
  };
  const wall = items
    .map((it, i) => {
      const hit = Object.keys(anchorAt).find((m) => anchorAt[m] === i);
      const mark = hit ? `<span class="wall-anchor" id="${hit}" aria-hidden="true"></span>\n` : '';
      return mark + poster(it, i);
    })
    .join('\n');

  const body = `<div class="wrap">
    <section class="hero">
      <h1>把「说不清的画面」，换成 AI 听得懂的词。</h1>
      <p class="meta">${items.length} 条 · 视频 ${items.filter((i) => i.media === 'video').length} · 图片 ${items.filter((i) => i.media === 'image').length} · ${Object.keys(DIM).filter((d) => items.some((i) => i.dim === d)).length} 个维度 · 中英双语提示词</p>
    </section>

    <div data-filter-root>
    ${searchControls(items)}
      <div class="wall">
${wall}
      </div>
      <p class="empty" data-empty hidden>没匹配到。换成「绕着人转」「dolly」「水墨」这类词试试，或按 <code>Esc</code> 清空后浏览全部。</p>
    </div>
  </div>`;

  return shell({
    title: `${SITE_NAME} · AI 影像镜头语言库`,
    desc: SITE_DESC,
    base: '',
    active: 'home',
    body,
  });
}

/* ---------------- 术语详情页 ---------------- */

function renderTerm(it, all) {
  const idx = all.findIndex((x) => x.id === it.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const sameGroup = all.filter((x) => x.id !== it.id && x.group === it.group && x.kind === it.kind);
  const related = (sameGroup.length ? sameGroup : all.filter((x) => x.id !== it.id && x.kind === it.kind)).slice(0, 4);

  const relatedHtml = related.length
    ? `<section class="related">
      <h2>同组术语</h2>
      <ul>${related
        .map(
          (r) => `<li><a href="../${r.url}"><span>${esc(r.zh)}</span><span class="en">${esc(r.en)}</span><span class="one">${esc(r.one)}</span></a></li>`
        )
        .join('')}</ul>
    </section>`
    : '';

  const pagerHtml = `<nav class="pager" aria-label="上下条">
      ${
        prev
          ? `<a href="../${prev.url}"><span class="dir">上一条</span>${esc(prev.zh)}</a>`
          : `<span class="disabled"><span class="dir">上一条</span>已经是第一条</span>`
      }
      ${
        next
          ? `<a href="../${next.url}"><span class="dir">下一条</span>${esc(next.zh)}</a>`
          : `<span class="disabled"><span class="dir">下一条</span>已经是最后一条</span>`
      }
    </nav>`;

  const body = `<div class="wrap">
    <div class="crumbs"><a href="../">全部</a><span class="sep">/</span><a href="../#${it.media}">${it.mediaLabel} · ${it.dimLabel}</a><span class="sep">/</span><span>${esc(it.zh)}</span></div>
    <div class="term-head">
      <h1>${esc(it.zh)}<span class="en">${esc(it.en)}</span></h1>
      <p class="term-lead">${esc(it.one)}</p>
      <div class="term-actions">
        ${it.promptZh ? `<button class="btn primary" type="button" data-copy="#term-zh">复制中文模板</button>` : ''}
        ${it.promptEn ? `<button class="btn" type="button" data-copy="#term-en" data-done="Copied">Copy English</button>` : ''}
        <a class="btn" href="../#${it.media}">回到${it.mediaLabel}总表</a>
      </div>
      <div class="term-tags"><span class="tag">${it.mediaLabel} · ${it.dimLabel}</span><span class="tag">${esc(it.group)}</span></div>
    </div>
    <div class="term-body">${block(it, 'term')}</div>
    ${relatedHtml}
    ${pagerHtml}
  </div>`;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: `${it.zh}（${it.en}）`,
    description: it.one,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: '二十四格 · AI 影像镜头语言库',
    },
  };

  return shell({
    title: `${it.zh} ${it.en}｜${SITE_NAME}`,
    desc: `${it.kindLabel}术语：${it.zh}（${it.en}）。${it.one}`,
    base: '../',
    active: it.kind,
    body,
    jsonld: `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>\n`,
  });
}

/* ---------------- 速查表 ---------------- */

function renderReference(items) {
  const rows = items
    .map(
      (it) => `        <tr data-item data-media="${it.media}" data-dim="${it.dim}" data-kind="${it.kind}" data-hay="${esc(it.hay)}">
          <td class="zh-cell"><a href="${it.url}">${esc(it.zh)}</a></td>
          <td><span class="en">${esc(it.en)}</span></td>
          <td>${it.kindLabel} · ${esc(it.group)}</td>
          <td>${esc(it.one)}</td>
        </tr>`
    )
    .join('\n');

  const body = `<div class="wrap">
    <div class="prose">
      <h1>术语速查表</h1>
      <p>一页看完 ${items.length} 条：中文名、英文名、类别与一句话。点名字进详情页，那里有提示词模板和翻车点。</p>
      <p>适合两种场景：写提示词时对一下英文写法；看片时认出「哦，这是环绕，不是摇」。<strong>左右滑动可看全表。</strong></p>
    </div>
    <div data-filter-root>
    ${searchControls(items, { id: 'q-ref' })}
      <div class="table-wrap">
        <table class="ref">
          <caption>按类别与组排列，共 ${items.length} 条；表格只是索引，详情页才是正文。</caption>
          <thead><tr><th>中文</th><th>English</th><th>类别</th><th>一句话</th></tr></thead>
          <tbody>
${rows}
          </tbody>
        </table>
      </div>
      <p class="empty" data-empty hidden>没匹配到。</p>
    </div>
  </div>`;

  return shell({
    title: `术语速查表｜${SITE_NAME}`,
    desc: `一页看完二十四格收录的 ${items.length} 条 AI 影像运镜与风格术语，含中英名称与一句话说明。`,
    base: '',
    active: 'reference',
    body,
  });
}

/* ---------------- 关于 ---------------- */

function renderAbout(items) {
  const videos = items.filter((i) => i.media === 'video').length;
  const images = items.filter((i) => i.media === 'image').length;
  const dimCount = Object.keys(DIM).filter((d) => items.some((i) => i.dim === d)).length;
  const body = `<div class="wrap">
    <article class="prose">
      <h1>关于这个站</h1>
      <p><strong>二十四格</strong>：一秒钟拆成 24 格，每一格都得有名字。</p>

      <h2>怎么用</h2>
      <ol class="steps">
        <li><h3>说人话搜</h3><p>搜「绕着人转一圈」也能命中「环绕」；搜 dolly、push in 同样命中，不用先知道术语。</p></li>
        <li><h3>先看它到底在做什么</h3><p>每条先给一句人话，再说专业叫法。推轨和变焦不是一回事，混着写就会变形。</p></li>
        <li><h3>复制模板</h3><p>中英两版，直接粘进可灵、即梦、Runway、Sora 这类工具，再按你的场景改主体。</p></li>
        <li><h3>最后看翻车点</h3><p>每个词最容易错在哪、要写明哪一句才不塌，都列在「容易翻车」里。</p></li>
      </ol>

      <h2>为什么叫这个</h2>
      <p>24 格是一秒的帧率，也是电影最朴素的计量单位。做 AI 影像时，你要控制的正是一格一格发生的事：镜头怎么动、光怎么落、这一段该停几秒。名字取这个，是因为它说的不是「我看过很多片子」，而是「这一格拍什么」。</p>

      <h2>要解决的问题</h2>
      <p>一个人现在可以做出一部片子：编剧、导演、摄影，都靠提示词驱动 AI。但非专业的人真正缺的不是技能——不需要先去学摄影和导演——而是<strong>词</strong>。普通人不知道那个运镜叫什么，就没法让 AI 精确还原；这和零基础学编程的人不知道前端、后端、数据库、导航栏分别指什么，是同一件事。</p>
      <p>这个站只压缩这一段：从「说不清的画面」到「一个 AI 听得懂的词」。所以每条都先给一句人话，再给专业叫法，再给中英模板，最后给最容易翻车的地方。</p>

      <h2>现在有什么</h2>
      <ul>
        <li>${videos} 条视频 + ${images} 条图片，覆盖 ${dimCount} 个维度（运镜、景别、镜头、光线、色彩、构图、质感、节奏、转场、声音、流派、风格），每条含：中英术语、一句话、什么时候用、中英文提示词模板、容易翻车、参数建议。</li>
        <li>中英混搜（「绕着人转」和 dolly 都能搜到）、按「视频/图片」与维度两级筛选、一键复制模板。</li>
        <li>每条一个独立静态页，可被搜索引擎索引、可直接分享链接。</li>
        <li>纯静态：无账号、无后端、无第三方脚本、无追踪、无广告。</li>
      </ul>

      <h2>明确没做的</h2>
      <ul>
        <li><strong>出片示例还没有。</strong>要有真实生成素材才有说服力，编一个「示意图」是骗人的，所以先空着。</li>
        <li><strong>提示词未逐条真机验证。</strong>模板按生成模型的常见表现写，「容易翻车」来自经验判断，不是官方限制。你实际跑出来不一样，是对的，不是你的错。</li>
        <li>没有按模型分版本（可灵 / 即梦 / Runway / Sora 的写法差异）。现在只有中英两版通用模板。</li>
        <li>没有收藏、投稿、评论、付费。</li>
      </ul>

      <h2>内容怎么改</h2>
      <p>内容只有一处：<code>src/data.js</code>。页面全部由构建脚本生成，改数据不改模板。</p>
      <pre>node build.mjs
# 本地预览
python3 -m http.server 18766 --bind 127.0.0.1</pre>
      <p>站点样式在 <code>src/style.css</code>，交互在 <code>src/app.js</code>，产物是根目录的 <code>index.html</code>、<code>reference.html</code>、<code>term/</code> 与 <code>assets/</code>。</p>

      <h2>名字与域名</h2>
      <p>英文写作 24frames。域名暂未购买——这个站不靠域名活着，先有内容再说。项目目录名 <code>24frames</code>。</p>

      <h2>版权</h2>
      <p>所有条目文字与提示词模板为自写，未逐字引用他人原文。目前未声明开源许可；要转载或引用成批内容，请先问一声。</p>
    </article>
  </div>`;

  return shell({
    title: `关于与更新｜${SITE_NAME}`,
    desc: '二十四格是什么、为什么做、现在有什么、明确没做什么，以及如何更新内容。',
    base: '',
    active: 'about',
    body,
  });
}

/* ---------------- 构建 ---------------- */

function main() {
  const items = buildItems(loadContent());
  const written = [];

  // 资源先算好、先落盘：页面模板要引用带指纹的文件名，所以顺序不能反。
  // 样式分三层：style.css 是基底，style-extra.css 补结构，style-poster.css 只管 poster/wall
  const css = ['style.css', 'style-extra.css', 'style-poster.css']
    .map((n) => path.join(SRC, n))
    .filter((p) => fs.existsSync(p))
    .map((p) => fs.readFileSync(p, 'utf8'))
    .join('\n\n');
  // 检索核心与前台脚本打成一个文件，顺序固定：search.js 先挂 window.MZ_SEARCH。
  const appSrc = ['search.js', 'app.js']
    .map((n) => path.join(SRC, n))
    .filter((p) => fs.existsSync(p))
    .map((p) => fs.readFileSync(p, 'utf8'))
    .join('\n\n');

  ASSET_CSS = `assets/style.${digest(css)}.css`;
  ASSET_JS = `assets/app.${digest(appSrc)}.js`;

  // 清旧产物：term 避免改名留孤儿页；assets 避免指纹文件越积越多
  fs.rmSync(path.join(ROOT, 'term'), { recursive: true, force: true });
  fs.rmSync(path.join(ROOT, 'assets'), { recursive: true, force: true });

  written.push(writeFile(ASSET_CSS, css));
  written.push(writeFile(ASSET_JS, appSrc));

  written.push(writeFile('index.html', renderIndex(items)));
  written.push(writeFile('reference.html', renderReference(items)));
  written.push(writeFile('about.html', renderAbout(items)));

  for (const it of items) {
    written.push(writeFile(it.url, renderTerm(it, items)));
  }

  let robots = 'User-agent: *\nAllow: /\n';
  if (SITE) {
    const urls = ['index.html', 'reference.html', 'about.html', ...items.map((i) => i.url)];
    const today = new Date().toISOString().slice(0, 10);
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${SITE}/${u === 'index.html' ? '' : u}</loc><lastmod>${today}</lastmod></url>`
  )
  .join('\n')}
</urlset>
`;
    written.push(writeFile('sitemap.xml', sitemap));
    robots += `Sitemap: ${SITE}/sitemap.xml\n`;
  }
  written.push(writeFile('robots.txt', robots));

  const total = written.reduce((n, w) => n + w.bytes, 0);
  console.log(`[24frames] 生成完成：${written.length} 个文件，${items.length} 条术语，共 ${(total / 1024).toFixed(1)} KB`);
  for (const w of written) {
    console.log(`  ${String(w.bytes).padStart(7)}  ${w.rel}`);
  }
  if (!SITE) {
    console.log('[24frames] 未设置 SITE_URL，已跳过 sitemap.xml（部署后设 SITE_URL 再构建一次即可）');
  }
}

main();