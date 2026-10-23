import type {Metadata} from 'next';
import {getItems, SITE_NAME, type Item} from '../../lib/content';

export const metadata: Metadata = {
  title: `从零做一部 AI 短片｜${SITE_NAME}`,
  description: '零基础用 AI 做短视频剧情与短片：编剧、导演、美术、摄影、AI 制作、剪辑、声音，按制作顺序列出每一步要做的决定、产出和要懂的术语。',
};

type Step = {role: string; title: string; what: string; out: string; tool: string; pit: string; ids: string[]};

const ROLES: {role: string; ask: string; dims: string}[] = [
  {role: '编剧', ask: '讲一个什么故事？谁想要什么、被什么挡住？', dims: '编剧'},
  {role: '导演', ask: '故事拆成哪些镜头？每个镜头给观众看什么？', dims: '导演 · 景别'},
  {role: '美术', ask: '角色长什么样？整部片是什么风格和颜色？', dims: '流派 · 风格 · 色彩 · AI 制作'},
  {role: '摄影', ask: '每个镜头从哪拍、怎么动、光从哪来？', dims: '运镜 · 镜头 · 光线 · 构图'},
  {role: 'AI 制作', ask: '怎么让模型稳定地、一致地生成出来？', dims: 'AI 制作'},
  {role: '剪辑', ask: '镜头按什么顺序、什么节奏接起来？', dims: '转场 · 节奏'},
  {role: '声音', ask: '观众听到什么：对白、旁白、音乐、环境？', dims: '声音'},
];

const STEPS: Step[] = [
  {role: '编剧', title: '想清楚故事', tool: '对话模型（ChatGPT、Claude、豆包等）',
   what: '先用一句话说清「谁、想要什么、被什么挡住」，再拆成三幕的分场大纲。短剧要特别设计开头 3 秒的钩子和每集结尾的钩子。对白尽量短，把情绪藏在动作里。',
   out: '一句话梗概 + 分场大纲 + 对白', pit: '一上来就生成画面。没有故事的镜头再好看也串不起来。',
   ids: ['story-logline', 'story-hook', 'story-three-act', 'story-conflict', 'story-setup-payoff', 'story-twist', 'story-subtext', 'story-cliffhanger']},
  {role: '导演', title: '拆成分镜', tool: '对话模型 + 表格',
   what: 'AI 视频一次只生成一个 3 到 8 秒的镜头，所以要把剧本拆成镜头清单：每个镜头写景别、运镜、画面内容、时长、台词。新地点先给建立镜头；对话用正反打，守住轴线；关键信息用插入镜头，情绪用反应镜头。',
   out: '分镜表（每行一个镜头）', pit: '相邻镜头景别都一样，剪起来很闷；对话镜头越轴，左右颠倒。',
   ids: ['dir-shot-list', 'dir-establishing', 'dir-180-rule', 'dir-shot-reverse', 'dir-eyeline', 'dir-insert', 'dir-reaction', 'dir-blocking', 'shot-extreme-wide', 'shot-wide', 'shot-medium', 'shot-mcu', 'shot-close']},
  {role: '美术', title: '定角色与风格', tool: '图片模型',
   what: '先做角色设定图（正面、侧面、背面），把角色描述写成一段固定文字。再定整部片的风格和色调，找一张风格参考图。画幅也在这一步定：竖屏短剧用 9:16。',
   out: '角色设定图 + 风格参考图 + 画幅', pit: '角色服装太复杂，后面每个镜头都复现不了。',
   ids: ['img-ai-char-sheet', 'ai-consistency', 'img-ai-style-ref', 'img-ai-aspect', 'color-teal-orange', 'color-warm-cool', 'film-16mm', 'stylized-3d', 'hk-90s', 'genre-cyberpunk']},
  {role: '摄影 · 图片', title: '先出每个镜头的首帧图', tool: '图片模型',
   what: '按分镜表，为每个镜头先生成一张静态图：构图、光线、镜头焦段都在这一步定好，翻车的地方（手、文字）用局部重绘修掉。图比视频便宜、快、好改。',
   out: '每个镜头一张首帧图', pit: '首帧图本身有瑕疵，动起来会被放大。',
   ids: ['ai-i2v', 'img-ai-inpaint', 'comp-thirds', 'light-rembrandt', 'light-golden', 'light-rim', 'lens-tele', 'lens-wide', 'shallow-dof']},
  {role: '摄影 · 视频', title: '逐镜生成视频', tool: '视频模型（图生视频）',
   what: '把首帧图交给视频模型，提示词只写「怎么动」：人物动作 + 一种运镜。一条提示词只做一个镜头；需要精确落点就用首尾帧。每个镜头多生成几次，挑最好的那条。',
   out: '每个镜头 3 到 8 秒的视频片段', pit: '一条提示词里塞好几个动作或场景，模型只能给你一团乱。',
   ids: ['ai-one-shot', 'ai-first-last', 'ai-negative', 'dolly-in', 'pan', 'tilt', 'orbit', 'handheld', 'follow', 'crash-zoom', 'rack-focus']},
  {role: '剪辑', title: '剪在一起', tool: '剪辑软件（剪映、CapCut、Premiere 等）',
   what: '按分镜顺序排好，默认用硬切；动作在两镜之间接上（动作剪辑），形状相似的镜头可以做匹配剪辑。节奏先快后慢或越来越快，结尾在最紧张的地方停住。',
   out: '粗剪', pit: '每个镜头都加花哨转场；镜头留太长，节奏拖。',
   ids: ['cut-hard', 'cut-action', 'cut-match', 'cut-jl', 'cut-dissolve', 'cut-cross', 'cut-fade', 'tempo-fast-cut', 'tempo-hold', 'tempo-montage']},
  {role: '声音', title: '加上声音', tool: '配音 / 音乐生成工具 + 剪辑软件',
   what: '先做对白和旁白，有台词的近景用对口型；再铺环境底噪让空间可信，关键动作加拟音；最后上配乐，对白处压低。高潮前可以留一拍静默。',
   out: '成片', pit: '配乐从头铺到尾压住对白；环境声和地点对不上。',
   ids: ['ai-lipsync', 'sound-vo', 'sound-sync', 'sound-ambient', 'sound-foley', 'sound-score', 'sound-riser', 'sound-silence']},
];

const EXAMPLE: {n: string; t: string; shot: string; pic: string; snd: string; ids: string[]}[] = [
  {n: '01', t: '3s', shot: '大远景 · 缓推', pic: '除夕夜的县城车站，红灯笼在风里晃，远处有烟花', snd: '环境底噪、远处鞭炮', ids: ['dir-establishing', 'shot-extreme-wide']},
  {n: '02', t: '3s', shot: '近景 · 手持', pic: '外卖员冲进候车厅，发车屏显示「已发车」，他停住', snd: '急促的脚步声', ids: ['story-hook', 'handheld']},
  {n: '03', t: '2s', shot: '特写 · 插入', pic: '手机屏幕亮起：母亲发来年夜饭照片，桌边一副空碗筷', snd: '消息提示音', ids: ['dir-insert', 'story-setup-payoff']},
  {n: '04', t: '4s', shot: '近景 · 固定', pic: '他打电话：「今年加班，不回去了。」眼睛一直没抬', snd: '对白（对口型）', ids: ['story-subtext', 'ai-lipsync']},
  {n: '05', t: '3s', shot: '近景 · 固定', pic: '挂掉电话，他低头不动', snd: '静默', ids: ['dir-reaction', 'sound-silence']},
  {n: '06', t: '3s', shot: '近景', pic: '喇叭声响，他抬头看向画面右上方', snd: '汽车喇叭', ids: ['dir-eyeline']},
  {n: '07', t: '3s', shot: '仰拍', pic: '一辆货车亮着大灯驶下坡道', snd: '引擎声', ids: ['low-angle']},
  {n: '08', t: '6s', shot: '过肩 · 正反打', pic: '司机摇下车窗：「去哪？顺路捎你。」他愣住，笑了', snd: '对白，配乐进入', ids: ['dir-shot-reverse', 'sound-score']},
  {n: '09', t: '5s', shot: '航拍 · 升高', pic: '货车驶上下雪的公路，越来越小', snd: '配乐渐强', ids: ['aerial-reveal']},
  {n: '10', t: '4s', shot: '近景 · 固定', pic: '家门口，他抬手要敲门，屋里传来一个陌生男人的声音，切黑', snd: '上升音后突然静默', ids: ['story-cliffhanger', 'sound-riser']},
];

function Chips({ids, all}: {ids: string[]; all: Map<string, Item>}) {
  return <ul className="learn-chips">{ids.map((id) => all.get(id)).filter(Boolean).map((it) => <li key={it!.id}><a href={it!.url}><span className="d">{it!.dimLabel}</span>{it!.zh}</a></li>)}</ul>;
}

export default function Learn() {
  const all = new Map(getItems().map((it) => [it.id, it]));
  return <div className="wrap learn">
    <header className="learn-hero">
      <p className="hero__eyebrow">从零开始 · 一个人的剧组</p>
      <h1>从零做一部 AI 短片</h1>
      <p className="learn-lede">用 AI 做一条短视频剧情或一部短片，你一个人要同时当编剧、导演、美术、摄影、剪辑和录音师，还要多学一门手艺：怎么让模型稳定地生成。好消息是每个角色只需要先掌握少数几个关键概念。下面按真正的制作顺序排好了，每一步都连到对应的术语页，那里有动画演示和可以直接复制的提示词。</p>
    </header>

    <section className="learn-sec" aria-labelledby="roles">
      <h2 id="roles">你要兼的七个角色</h2>
      <div className="learn-roles">
        {ROLES.map((r) => <div key={r.role} className="learn-role"><strong>{r.role}</strong><p>{r.ask}</p><span>{r.dims}</span></div>)}
      </div>
    </section>

    <section className="learn-sec" aria-labelledby="steps">
      <h2 id="steps">七步做完一部片</h2>
      <ol className="learn-steps">
        {STEPS.map((s, i) => <li key={s.title} className="learn-step">
          <div className="learn-step__no">{String(i + 1).padStart(2, '0')}</div>
          <div className="learn-step__body">
            <p className="learn-step__role">{s.role}</p>
            <h3>{s.title}</h3>
            <p>{s.what}</p>
            <dl className="learn-meta">
              <div><dt>产出</dt><dd>{s.out}</dd></div>
              <div><dt>工具</dt><dd>{s.tool}</dd></div>
              <div><dt>常见坑</dt><dd>{s.pit}</dd></div>
            </dl>
            <Chips ids={s.ids} all={all} />
          </div>
        </li>)}
      </ol>
    </section>

    <section className="learn-sec" aria-labelledby="example">
      <h2 id="example">示例：40 秒竖屏短片《除夕》的分镜</h2>
      <p className="learn-note">一句话梗概：一个刚失业的外卖员想在除夕夜赶回家，但最后一班车已经开走，他还一直瞒着家里自己丢了工作。下面每一行就是一条要单独生成的视频，右列是这一镜用到的术语。</p>
      <div className="table-wrap">
        <table className="ref learn-table">
          <thead><tr><th>镜号</th><th>时长</th><th>景别 · 运镜</th><th>画面</th><th>声音</th><th>用到的术语</th></tr></thead>
          <tbody>{EXAMPLE.map((r) => <tr key={r.n}><td>{r.n}</td><td>{r.t}</td><td>{r.shot}</td><td>{r.pic}</td><td>{r.snd}</td><td><Chips ids={r.ids} all={all} /></td></tr>)}</tbody>
        </table>
      </div>
    </section>

    <section className="learn-sec" aria-labelledby="check">
      <h2 id="check">发布前检查</h2>
      <ul className="learn-check">
        <li>前 3 秒有没有发生事情？没有就重剪开头。</li>
        <li>主角在每个镜头里是不是同一个人（脸、发型、衣服）？</li>
        <li>对话镜头有没有越轴，人物左右是否一直不变？</li>
        <li>手、文字、招牌有没有翻车？翻车的帧用局部重绘或换一条。</li>
        <li>配乐有没有盖住对白？环境声和地点对得上吗？</li>
        <li>画幅是否和发布平台一致（短剧 9:16）？</li>
        <li>结尾有没有让人想看下一集的钩子？</li>
      </ul>
    </section>
  </div>;
}
