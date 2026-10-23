// 编剧 / 导演 / AI 制作：这些不是「画面长什么样」，而是「怎么组织画面」，所以多用分镜格、时间轴和对照图来演示。
import type {ReactNode} from 'react';
import {A, BackHead, Bust, Chair, D, type Demo, Floor, Lamp, Mv, Op, Person, Ridge, Ro, Sc, Show, Skyline, T, Table, Timeline, Tree, Txt, W, Walker} from './kit';

const seq = (a: string | number, b: string | number) => `${a};${a};${b};${b};${a};${a}`;
const Loop = ({children}: {children: ReactNode}) => <Op v="1;1;0;0;1" kt="0;.9;.94;.96;1">{children}</Op>;
const Bg = () => <rect className="sa-wall" x={0} y={0} width={W} height={180} />;
/** 在 [t0, .9] 之间淡入并停住，配合 Loop 复位 */
const In = ({t, children, dy = 8}: {t: number; children: ReactNode; dy?: number}) => (
  <g><A a="opacity" v="0;0;1;1" kt={`0;${t};${Math.min(t + 0.06, 0.95)};1`} /><T type="translate" v={`0 ${dy};0 ${dy};0 0;0 0`} kt={`0;${t};${Math.min(t + 0.06, 0.95)};1`} />{children}</g>
);
/** 缩小版画面：把整幅 320×180 的场景塞进一个格子 */
const Panel = ({x, y, w, children, hi = false}: {x: number; y: number; w: number; children: ReactNode; hi?: boolean}) => {
  const h = (w * 9) / 16;
  return <g>
    <svg x={x} y={y} width={w} height={h} viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">{children}</svg>
    <rect className={hi ? 'sa-acc' : 'sa-faint'} x={x} y={y} width={w} height={h} rx={2} />
  </g>;
};
const Chip = ({x, y, text, tag, t}: {x: number; y: number; text: string; tag: string; t: number}) => {
  const w = text.length * 11 + 12;
  return <In t={t}>
    <rect className="sa-card-hi" x={x} y={y - 14} width={w} height={20} rx={4} />
    <Txt x={x + 6} y={y} s={11} c="sa-txt-big">{text}</Txt>
    <Txt x={x + 2} y={y - 18} s={6.5} c="sa-txt sa-txt-acc">{tag}</Txt>
  </In>;
};
const Word = ({x, y, children}: {x: number; y: number; children: string}) => <Txt x={x} y={y} s={11} c="sa-txt-big">{children}</Txt>;
const Check = ({x, y, ok = true}: {x: number; y: number; ok?: boolean}) => ok
  ? <path className="sa-good" d={`M${x - 5} ${y} L${x - 1} ${y + 4} L${x + 6} ${y - 5}`} />
  : <path className="sa-bad" d={`M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x + 5} ${y - 5} L${x - 5} ${y + 5}`} />;
const Arrow = ({d, t}: {d: string; t: number}) => <path className="sa-acc" d={d} strokeDasharray={300} strokeDashoffset={300}><A a="stroke-dashoffset" v="300;300;0;0" kt={`0;${t};${t + 0.12};1`} /></path>;

// 小场景（分镜格里用）
const SceneCity = () => <g><Bg /><Ridge y={96} amp={14} seed={4} c="sa-hill2" /><Skyline x={-20} w={360} base={130} seed={6} hMin={30} hMax={90} lit={0.4} /><path className="sa-line" d="M0 130 L320 130" /></g>;
const SceneRoom = ({who = true}: {who?: boolean}) => <g><Bg /><path className="sa-line" d="M0 146 L320 146" /><rect className="sa-body" x={30} y={30} width={70} height={84} /><path className="sa-faint" d="M65 30 L65 114 M30 72 L100 72" /><Table x={180} y={146} w={90} />{who && <Person x={150} y={146} h={84} face />}</g>;
const SceneFace = ({long = false, talk = false}: {long?: boolean; talk?: boolean}) => <g><Bg /><path className="sa-faint" d="M40 20 L40 170 M280 20 L280 170" /><Bust x={160} y={86} s={1.6} long={long} talk={talk} /></g>;

/** 一只手，n 根手指 */
function Hand({x, y, n = 5}: {x: number; y: number; n?: number}) {
  const xs = Array.from({length: n}, (_, i) => -16 + (i * 32) / Math.max(1, n - 1));
  return <g transform={`translate(${x} ${y})`}>
    {xs.map((fx, i) => <rect key={i} className="sa-body" x={fx - 3.4} y={-44 + Math.abs(fx) * 0.5} width={6.8} height={30} rx={3.4} transform={`rotate(${fx * 0.6} ${fx} -14)`} />)}
    <path className="sa-body" d="M-22 -16 C-22 -24 22 -24 22 -16 L20 14 C20 26 -20 26 -20 14 Z" />
    <path className="sa-body" d="M-20 -4 C-30 -10 -36 -20 -34 -28 C-30 -30 -24 -22 -18 -14" />
    <path className="sa-body" d="M-14 24 L-14 50 L14 50 L14 24" />
  </g>;
}

export const craft: Record<string, Demo> = {
  // ── 编剧 ──
  'story-logline': {
    note: '三块拼图依次落位：谁（主角）、想要什么（目标）、被什么挡住（阻碍）。三块都齐了，这一句就是你整部片的方向盘。',
    art: () => <Loop>
      <Bg />
      <Txt x={24} y={30} s={8}>一句话梗概 = 谁 + 想要什么 + 被什么挡住</Txt>
      <Word x={24} y={78}>一个</Word><Chip x={50} y={78} text="失业的外卖员" tag="主角" t={0.08} />
      <Word x={140} y={78}>想要</Word><Chip x={166} y={78} text="除夕夜赶回家" tag="目标" t={0.26} />
      <Word x={24} y={124}>但是</Word><Chip x={50} y={124} text="最后一班车已经开走" tag="阻碍" t={0.44} />
      <In t={0.62}><path className="sa-acc" d="M24 140 L296 140" /><Txt x={296} y={156} a="end" s={7} c="sa-txt sa-txt-acc">这就是整部片的方向</Txt></In>
    </Loop>,
  },
  'story-hook': {
    note: '同一条视频的观众留存：灰线是先交代背景的开头，前 3 秒就掉了一大半；金线是一开场就抛出问题的开头，大部分人留了下来。',
    art: () => <Loop>
      <Bg />
      <rect className="sa-card" x={22} y={14} width={86} height={152} rx={10} />
      <svg x={26} y={24} width={78} height={134} viewBox="0 0 160 280" preserveAspectRatio="xMidYMid slice"><rect className="sa-dark" width={160} height={280} /><Bust x={80} y={130} s={1.5} /><In t={0.08}><rect className="sa-card-hi" x={86} y={40} width={64} height={34} rx={8} /><Txt x={118} y={64} a="middle" s={20} c="sa-txt-big">？</Txt></In></svg>
      <g transform="translate(130 30)">
        <path className="sa-faint" d="M0 0 L0 110 L170 110" />
        <rect className="sa-card-hi" x={1} y={0} width={30} height={110} opacity={0.6} />
        <Txt x={16} y={124} a="middle" s={6.5} c="sa-txt sa-txt-acc">前 3 秒</Txt>
        <Txt x={-4} y={6} a="end" s={6}>留存</Txt><Txt x={170} y={124} a="end" s={6}>时间</Txt>
        <path className="sa-soft" d="M0 6 C14 40 24 76 50 90 C90 100 130 102 170 104" strokeDasharray={260} strokeDashoffset={260} strokeWidth={1.4}><A a="stroke-dashoffset" v="260;260;0;0" kt="0;.1;.6;1" /></path>
        <path className="sa-acc" d="M0 6 C14 10 24 16 50 22 C90 30 130 36 170 42" strokeDasharray={260} strokeDashoffset={260}><A a="stroke-dashoffset" v="260;260;0;0" kt="0;.1;.6;1" /></path>
        <In t={0.6}><Txt x={168} y={36} a="end" s={6.5} c="sa-txt sa-txt-acc">开场就抛问题</Txt><Txt x={168} y={98} a="end" s={6.5}>先讲背景</Txt></In>
      </g>
    </Loop>,
  },
  'story-three-act': {
    note: '一条紧张度曲线：第一幕出事（激励事件），第二幕越来越难、中间来一次转折，第三幕冲到最高点后解决——小点走完这条线，就是一个完整的故事。',
    art: () => {
      const path = 'M20 140 C50 138 60 132 74 116 C110 100 130 108 160 86 C190 66 214 76 240 46 C252 32 262 26 270 30 C282 40 290 110 300 130';
      return <Loop>
        <Bg />
        <path className="sa-faint" d="M20 150 L300 150 M100 30 L100 150 M240 30 L240 150" />
        <Txt x={60} y={166} a="middle" s={7}>第一幕 · 建置</Txt><Txt x={170} y={166} a="middle" s={7}>第二幕 · 对抗</Txt><Txt x={270} y={166} a="middle" s={7}>第三幕 · 结局</Txt>
        <path className="sa-acc" d={path} strokeDasharray={400} strokeDashoffset={400}><A a="stroke-dashoffset" v="400;400;0;0" kt="0;.05;.8;1" /></path>
        <circle className="sa-accf" r={4}><animateMotion dur={`${D}s`} repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;.05;.8;1" calcMode="linear" path={path} /></circle>
        <In t={0.18}><circle className="sa-subj" cx={74} cy={116} r={3} /><Txt x={74} y={106} a="middle" s={6.5} c="sa-txt sa-txt-acc">激励事件</Txt></In>
        <In t={0.4}><circle className="sa-subj" cx={160} cy={86} r={3} /><Txt x={160} y={76} a="middle" s={6.5} c="sa-txt sa-txt-acc">中点转折</Txt></In>
        <In t={0.68}><circle className="sa-subj" cx={266} cy={28} r={3} /><Txt x={250} y={20} a="end" s={6.5} c="sa-txt sa-txt-acc">高潮</Txt></In>
        <Txt x={24} y={24} s={6.5}>紧张度</Txt>
      </Loop>;
    },
  },
  'story-conflict': {
    note: '主角朝目标走去，一堵墙升起把他挡住，他推、被弹回、再推——「想要」撞上「阻碍」，故事才开始。',
    art: () => <Loop>
      <Bg />
      <path className="sa-line" d="M0 146 L320 146" />
      <g transform="translate(270 146)"><path className="sa-line" d="M0 0 L0 -60" /><path className="sa-accf" d="M0 -60 L24 -52 L0 -44 Z" /><Txt x={0} y={14} a="middle" s={7} c="sa-txt sa-txt-acc">目标</Txt></g>
      <g><T type="translate" v="0 80;0 80;0 0;0 0" kt="0;.2;.3;1" /><rect className="sa-bld" x={196} y={66} width={20} height={80} /><path className="sa-faint" d="M196 86 L216 86 M196 106 L216 106 M196 126 L216 126" /><Txt x={206} y={60} a="middle" s={7}>阻碍</Txt></g>
      <g><T type="translate" v="-90 0;10 0;10 0;-6 0;10 0;-6 0;10 0" kt="0;.25;.4;.5;.62;.72;1" ease={false} /><Walker x={160} y={146} h={70} walk={0.6} /></g>
      <Txt x={40} y={30} s={8}>主角想要 → 但被挡住 → 只能想别的办法</Txt>
    </Loop>,
  },
  'story-setup-payoff': {
    note: '开头一个不起眼的镜头：抽屉里一把旧钥匙（伏笔）。结尾它打开了密室（回收）。金线把两头连起来时，观众会「哦——」一声。',
    art: () => {
      const Key = ({x, y, glow = false}: {x: number; y: number; glow?: boolean}) => <g transform={`translate(${x} ${y})`}><circle className={glow ? 'sa-acc' : 'sa-line'} cx={0} cy={0} r={7} /><path className={glow ? 'sa-acc' : 'sa-line'} d="M7 0 L28 0 M20 0 L20 6 M25 0 L25 5" /></g>;
      return <Loop>
        <Bg />
        <Panel x={20} y={30} w={110}><SceneRoom who={false} /><rect className="sa-card" x={120} y={100} width={120} height={60} /><Key x={160} y={128} /></Panel>
        <Panel x={190} y={30} w={110} hi><Bg /><rect className="sa-bld" x={100} y={20} width={120} height={160} /><Key x={150} y={100} glow /></Panel>
        <Txt x={75} y={102} a="middle" s={7}>开头 · 伏笔</Txt><Txt x={245} y={102} a="middle" s={7} c="sa-txt sa-txt-acc">结尾 · 回收</Txt>
        <Timeline cuts={[0.15, 0.3, 0.45, 0.6, 0.75, 0.85]} label="一集" />
        <path className="sa-acc sa-dash" d="M75 120 C120 140 200 140 245 120" opacity={0}><A a="opacity" v="0;0;1;1" kt="0;.82;.86;1" /></path>
      </Loop>;
    },
  },
  'story-twist': {
    note: '卡片一翻：观众以为的事和真相完全相反。前面埋的两条线索同时亮起——好的反转让人回头一看「原来早就告诉过我」。',
    art: () => <Loop>
      <Bg />
      <g transform="translate(160 76)"><g><T type="scale" v="1 1;1 1;0.02 1;1 1;1 1" kt="0;.4;.48;.56;1" ease={false} />
        <Show t0={0} t1={0.48}><rect className="sa-card" x={-110} y={-40} width={220} height={80} rx={6} /><Txt x={0} y={-14} a="middle" s={7}>你以为</Txt><Txt x={0} y={12} a="middle" s={13} c="sa-txt-big">他在跟踪她</Txt></Show>
        <Show t0={0.48} t1={1}><rect className="sa-card-hi" x={-110} y={-40} width={220} height={80} rx={6} /><Txt x={0} y={-14} a="middle" s={7} c="sa-txt sa-txt-acc">其实</Txt><Txt x={0} y={12} a="middle" s={13} c="sa-txt-big">他一直在保护她</Txt></Show>
      </g></g>
      <path className="sa-faint" d="M20 150 L300 150" />
      {[0.22, 0.48].map((p, i) => <g key={i}><circle className="sa-subj" cx={20 + p * 280} cy={150} r={3} /><circle className="sa-accf" cx={20 + p * 280} cy={150} r={4.5} opacity={0}><A a="opacity" v="0;0;1;1" kt="0;.56;.6;1" /></circle><Txt x={20 + p * 280} y={166} a="middle" s={6.5}>{`线索 ${i + 1}`}</Txt></g>)}
      <Txt x={300} y={166} a="end" s={6.5} c="sa-txt sa-txt-acc">反转</Txt><circle className="sa-accf" cx={296} cy={150} r={4} />
    </Loop>,
  },
  'story-subtext': {
    note: '她嘴上说「我没事」，眼睛却躲开了；身后浮出的那句才是她真正想说的。好台词把情绪藏在没说出口的地方。',
    art: () => <Loop>
      <Bg />
      <Bust x={110} y={90} s={1.5} long talk turn={seq('0 0', '-4 1')} />
      <rect className="sa-card" x={170} y={40} width={120} height={36} rx={8} /><path className="sa-card" d="M176 70 L162 84 L188 74 Z" />
      <Txt x={230} y={64} a="middle" s={12} c="sa-txt-big">我没事。</Txt>
      <In t={0.35} dy={-8}><rect className="sa-card-hi sa-dash" x={176} y={96} width={124} height={34} rx={8} /><Txt x={238} y={118} a="middle" s={10} c="sa-txt sa-txt-acc">（我很难过，别走）</Txt></In>
      <In t={0.55}><Txt x={238} y={150} a="middle" s={6.5}>说出口的 ≠ 心里想的</Txt></In>
    </Loop>,
  },
  'story-cliffhanger': {
    note: '门慢慢打开，门口站着一个看不清的人——就在这一刻画面切黑，「下集见」。问题留着，观众就会点下一集。',
    art: () => <g>
      <Show t0={0} t1={0.78}>
        <Sc cx={210} cy={90} v="1;1.25" kt="0;1" d={D * 0.78}>
          <SceneRoom who={false} />
          <rect className="sa-dark" x={190} y={40} width={50} height={106} />
          <g><T type="skewY" v="0;-14" d={D * 0.78} ease={false} /><rect className="sa-bld" x={190} y={40} width={50} height={106} /></g>
          <Op v="0;0;1" kt="0;.5;1" d={D * 0.78}><g className="sa-shadowgrp"><Person x={214} y={146} h={90} /></g></Op>
        </Sc>
      </Show>
      <Show t0={0.78} t1={1}><rect className="sa-dark" x={0} y={0} width={W} height={180} /><Txt x={160} y={86} a="middle" s={14} c="sa-txt-big">未完待续</Txt><Txt x={160} y={108} a="middle" s={8} c="sa-txt sa-txt-acc">▶ 下一集</Txt></Show>
      <Timeline cuts={[0.78]} label="第 1 集 · 停在最紧张的地方" />
    </g>,
  },

  // ── 导演 ──
  'dir-shot-list': {
    note: '剧本被拆成一格一格的镜头，每格写清景别、运镜和时长。AI 一次只生成一格，这张表就是你的生产清单。',
    art: () => {
      const cells: [ReactNode, string][] = [
        [<SceneCity key="a" />, '01 大远景 · 固定 · 3s'],
        [<SceneRoom key="b" />, '02 中景 · 慢推 · 4s'],
        [<SceneFace key="c" talk />, '03 近景 · 对白 · 3s'],
        [<SceneFace key="d" long />, '04 特写 · 反应 · 2s'],
      ];
      return <Loop>
        <Bg />
        {cells.map(([sc, cap], i) => {
          const x = i % 2 ? 166 : 14, y = i < 2 ? 6 : 92;
          return <In key={i} t={0.06 + i * 0.16}><Panel x={x} y={y} w={140}>{sc}</Panel><Txt x={x} y={y + 87} s={7} c="sa-txt sa-txt-acc">{cap}</Txt></In>;
        })}
      </Loop>;
    },
  },
  'dir-establishing': {
    note: '先给一个远景：夜里的居民楼，一扇窗亮着——观众知道了「在哪、什么时候」；再切进那扇窗里的房间，戏才开始。',
    art: () => <g>
      <Show t0={0} t1={0.5}>
        <Sc cx={190} cy={90} v="1;1.15" kt="0;1" d={D / 2}>
          <rect className="sa-dark" x={0} y={0} width={W} height={180} />
          {Array.from({length: 14}, (_, i) => <circle key={i} className="sa-subj" cx={(i * 61) % 320} cy={(i * 19) % 50} r={0.6} opacity={0.5} />)}
          <Skyline x={-20} w={360} base={170} seed={47} hMin={60} hMax={140} lit={0.2} />
          <rect className="sa-accf" x={186} y={86} width={8} height={10} />
        </Sc>
      </Show>
      <Show t0={0.5} t1={1}><SceneRoom /></Show>
      <Timeline cuts={[0.5]} label="建立镜头：先交代在哪 → 再进屋" />
    </g>,
  },
  'dir-180-rule': {
    note: '甲乙之间有一条看不见的线（轴线）。机位在线的一侧时，甲永远在左、乙永远在右；机位一越过去，画面里两人左右对调——观众会以为换了人。',
    art: () => {
      const kt = '0;.5;.62;.92;.95;1';
      return <Loop>
        <Bg />
        <rect className="sa-card" x={10} y={10} width={136} height={160} rx={4} />
        <Txt x={16} y={22} s={6}>俯视</Txt>
        <rect x={12} y={80} width={132} height={88} fill="rgba(111,208,140,.08)" /><rect x={12} y={12} width={132} height={68} fill="rgba(240,106,90,.08)" />
        <path className="sa-acc sa-dash" d="M14 80 L142 80" /><Txt x={140} y={76} a="end" s={6} c="sa-txt sa-txt-acc">轴线</Txt>
        <circle className="sa-subj" cx={50} cy={80} r={6} /><Txt x={50} y={83} a="middle" s={7} c="sa-txt-dark">甲</Txt>
        <circle className="sa-subj" cx={106} cy={80} r={6} /><Txt x={106} y={83} a="middle" s={7} c="sa-txt-dark">乙</Txt>
        <g><T type="translate" v={seq('78 140', '78 30')} kt={kt} /><g><T type="rotate" v={seq('0', '180')} kt={kt} /><path className="sa-fov" d="M0 -4 L-14 -30 L14 -30 Z" /><rect className="sa-cam" x={-4} y={-2} width={8} height={9} rx={1} /></g></g>
        <Show t0={0} t1={0.56}><Panel x={158} y={30} w={150}><Bg /><g transform="translate(160 0) scale(-1 1) translate(-160 0)"><Bust x={230} y={90} s={1.2} turn="-5 0;-5 0" /></g><Bust x={230} y={90} s={1.2} long turn="-5 0;-5 0" /><Txt x={90} y={170} a="middle" s={16} c="sa-txt-big">甲</Txt><Txt x={230} y={170} a="middle" s={16} c="sa-txt-big">乙</Txt></Panel><Check x={290} y={130} /><Txt x={232} y={132} a="middle" s={7} c="sa-txt sa-txt-good">同一侧 · 左右稳定</Txt></Show>
        <Show t0={0.56} t1={1}><Panel x={158} y={30} w={150}><Bg /><g transform="translate(160 0) scale(-1 1) translate(-160 0)"><Bust x={230} y={90} s={1.2} long turn="-5 0;-5 0" /></g><Bust x={230} y={90} s={1.2} turn="-5 0;-5 0" /><Txt x={90} y={170} a="middle" s={16} c="sa-txt-big">乙</Txt><Txt x={230} y={170} a="middle" s={16} c="sa-txt-big">甲</Txt></Panel><Check x={290} y={130} ok={false} /><Txt x={232} y={132} a="middle" s={7} c="sa-txt sa-txt-bad">越轴 · 左右颠倒</Txt></Show>
      </Loop>;
    },
  },
  'dir-shot-reverse': {
    note: '过乙的肩膀拍甲说话，再过甲的肩膀拍乙回应，来回切——两个镜头景别一样、方向相对，观众就感觉他们在面对面说话。',
    art: () => {
      const A1 = <g><Bg /><Bust x={120} y={88} s={1.45} talk turn="4 0;4 0" /><BackHead x={262} y={124} s={1.8} /><Txt x={20} y={24} s={8} c="sa-txt sa-txt-acc">甲（正打）</Txt></g>;
      const B1 = <g><Bg /><Bust x={200} y={88} s={1.45} long talk turn="-4 0;-4 0" /><BackHead x={58} y={124} s={1.8} /><Txt x={20} y={24} s={8} c="sa-txt sa-txt-acc">乙（反打）</Txt></g>;
      return <g>
        <Show t0={0} t1={0.25}>{A1}</Show><Show t0={0.25} t1={0.5}>{B1}</Show><Show t0={0.5} t1={0.75}>{A1}</Show><Show t0={0.75} t1={1}>{B1}</Show>
        <Timeline y={164} cuts={[0.25, 0.5, 0.75]} />
      </g>;
    },
  },
  'dir-eyeline': {
    note: '他抬头看向画面右上方，下一个镜头就从他的位置往右上方仰拍，给出他看到的东西——视线方向对上了，观众就跟着他「看见」。',
    art: () => <g>
      <Show t0={0} t1={0.5}><Bg /><Bust x={120} y={100} s={1.5} turn="4 -3;4 -3" blink={false} /><path className="sa-acc sa-dash" d="M150 70 L300 10" /><Txt x={300} y={62} a="end" s={7} c="sa-txt sa-txt-acc">看向右上方</Txt></Show>
      <Show t0={0.5} t1={1}><Bg />
        {[[40, 200, 30], [200, 260, 60]].map(([x1, x2, h], i) => <path key={i} className="sa-bld" d={`M${x1} 180 L${x1 + 10} ${h} L${x2 - 10} ${h} L${x2} 180 Z`} />)}
        <g transform="translate(250 40)"><path className="sa-acc" d="M-14 0 C-6 -6 6 -6 14 0 M-6 -2 L-12 -8 M6 -2 L12 -8" /><circle className="sa-accf" r={2.5} /><T type="translate" v="0 0;6 -4;0 0" d={1.2} /></g>
        <Txt x={20} y={24} s={7} c="sa-txt sa-txt-acc">从他的位置仰拍 · 他看到的</Txt>
      </Show>
      <Timeline cuts={[0.5]} label="视线 → 他看到的东西" />
    </g>,
  },
  'dir-insert': {
    note: '全景里她坐在桌边，插进一个手机屏幕亮起的特写，再回到全景——观众知道了她收到了什么，这一下也藏住了前后两镜的不连贯。',
    art: () => <g>
      <Show t0={0} t1={0.4}><SceneRoom /></Show>
      <Show t0={0.4} t1={0.7}><Bg /><rect className="sa-body" x={0} y={110} width={W} height={70} /><g transform="rotate(-8 160 100)"><rect className="sa-body" x={112} y={40} width={96} height={130} rx={10} /><rect x={118} y={52} width={84} height={110} rx={4} fill="#1b2430"><A a="fill" v="#0b0d11;#0b0d11;#1d3a52;#1d3a52" kt="0;.42;.46;1" /></rect><rect className="sa-card-hi" x={126} y={70} width={66} height={22} rx={6} /><path className="sa-line" d="M132 78 L180 78 M132 85 L166 85" /></g></Show>
      <Show t0={0.7} t1={1}><SceneRoom /></Show>
      <Timeline cuts={[0.4, 0.7]} label="全景 → 插入特写 → 回到全景" />
    </g>,
  },
  'dir-reaction': {
    note: '先拍说话的人，再切到听的人：她一动不动、镜头慢慢推近。观众的情绪不是跟着台词走的，是跟着这张脸走的。',
    art: () => <g>
      <Show t0={0} t1={0.42}><SceneFace talk /><Txt x={20} y={24} s={7}>说话的人</Txt></Show>
      <Show t0={0.42} t1={1}><Sc cx={160} cy={84} v="1;1;1.18;1.18" kt="0;.45;.9;1"><SceneFace long /></Sc><Txt x={20} y={24} s={7} c="sa-txt sa-txt-acc">听的人 · 反应</Txt></Show>
      <Timeline cuts={[0.42]} label="台词 → 反应镜头（多留 1 秒）" />
    </g>,
  },
  'dir-blocking': {
    note: '俯视平面图：甲从门口走到窗边（1→2→3），乙随后进门停在桌旁，两人隔着一整张桌子；镜头沿着下方横移跟拍。人怎么走、停在哪，本身就在讲关系。',
    art: () => {
      const pa = 'M30 90 L110 60 L250 50 L284 70';
      return <Loop>
        <Bg />
        <rect className="sa-card" x={20} y={20} width={280} height={120} rx={3} />
        <rect className="sa-wall" x={18} y={70} width={4} height={40} /><Txt x={26} y={104} s={6}>门</Txt>
        <rect className="sa-acc" x={296} y={40} width={4} height={60} /><Txt x={292} y={36} a="end" s={6}>窗</Txt>
        <rect className="sa-bld" x={130} y={76} width={80} height={36} rx={3} /><Txt x={170} y={98} a="middle" s={6}>餐桌</Txt>
        <path className="sa-acc sa-dash" d={pa} />
        {[[30, 90, '1'], [110, 60, '2'], [284, 70, '3']].map(([x, y, n]) => <g key={n as string}><path className="sa-acc" d={`M${(x as number) - 4} ${(y as number) - 4} L${(x as number) + 4} ${(y as number) + 4} M${(x as number) + 4} ${(y as number) - 4} L${(x as number) - 4} ${(y as number) + 4}`} /><Txt x={(x as number) + 6} y={(y as number) - 6} s={6.5} c="sa-txt sa-txt-acc">{n as string}</Txt></g>)}
        <g><animateMotion dur={`${D}s`} repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;.05;.55;1" calcMode="linear" path={pa} /><circle className="sa-subj" r={6} /><Txt x={0} y={3} a="middle" s={7} c="sa-txt-dark">甲</Txt></g>
        <g><animateMotion dur={`${D}s`} repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;.5;.8;1" calcMode="linear" path="M30 100 L120 120 L170 124" /><circle className="sa-subj" r={6} opacity={0.75} /><Txt x={0} y={3} a="middle" s={7} c="sa-txt-dark">乙</Txt></g>
        <path className="sa-soft sa-dash" d="M30 158 L290 158" />
        <g><T type="translate" v="40 158;40 158;270 158;270 158" kt="0;.05;.55;1" ease={false} /><g transform="rotate(180)"><path className="sa-fov" d="M0 4 L-12 26 L12 26 Z" /></g><rect className="sa-cam" x={-4} y={-4} width={8} height={8} rx={1} /></g>
      </Loop>;
    },
  },

  // ── AI 制作（视频） ──
  'ai-consistency': {
    note: '上半段每个镜头各写各的，人越生成越不像（发型、衣服都变了）；下半段先做一张角色设定图当参考、描述一字不改，三个镜头里就是同一个人。',
    art: () => {
      const Shots = ({ok}: {ok: boolean}) => <g>
        {[0, 1, 2].map((i) => <In key={i} t={(ok ? 0.55 : 0.05) + i * 0.08}><Panel x={116 + i * 68} y={40} w={62}>
          <g className={ok || i === 0 ? 'sa-char' : i === 1 ? 'sa-char2' : 'sa-char3'}>
            {i === 0 && <><Bg /><Person x={160} y={170} h={120} face hairLong={!ok && false} /></>}
            {i === 1 && <><Bg /><Person x={160} y={240} h={220} face hairLong={!ok} /></>}
            {i === 2 && <><Bg /><Bust x={160} y={90} s={1.6} long={!ok} /></>}
          </g>
        </Panel><g transform={`translate(${147 + i * 68} 88)`}><Check x={0} y={0} ok={ok} /></g></In>)}
      </g>;
      return <Loop>
        <Bg />
        <rect className="sa-card" x={12} y={22} width={92} height={110} rx={4} />
        <Txt x={18} y={34} s={6.5}>角色设定图</Txt>
        <g className="sa-char"><Person x={40} y={124} h={78} face /><Person x={78} y={124} h={78} back /></g>
        <Show t0={0} t1={0.5}><Txt x={214} y={112} a="middle" s={7} c="sa-txt sa-txt-bad">各写各的：越来越不像</Txt><Shots ok={false} /></Show>
        <Show t0={0.5} t1={1}><Txt x={214} y={112} a="middle" s={7} c="sa-txt sa-txt-good">同一参考图 + 同一段描述</Txt><Arrow d="M104 78 L114 78" t={0.52} /><Shots ok /></Show>
        <Txt x={160} y={160} a="middle" s={6.5}>【28 岁女性，齐肩黑短发，深绿风衣，白帆布鞋】每条提示词原样复制</Txt>
      </Loop>;
    },
  },
  'ai-i2v': {
    note: '左边是先用图片模型做好的一张图，右边是把它交给视频模型后的样子：构图和人都没变，只是窗帘被风吹动、人慢慢转头。提示词只写「怎么动」。',
    art: () => <Loop>
      <Bg />
      <Panel x={14} y={30} w={128}><SceneRoom /><path className="sa-soft" d="M100 30 C108 60 96 90 104 114" /></Panel>
      <Txt x={78} y={112} a="middle" s={7}>首帧图片（静止）</Txt>
      <Arrow d="M148 66 L172 66 M166 60 L172 66 L166 72" t={0.1} />
      <Panel x={178} y={30} w={128} hi>
        <Sc cx={150} cy={100} v="1;1.12" kt="0;1"><Bg /><path className="sa-line" d="M0 146 L320 146" /><rect className="sa-body" x={30} y={30} width={70} height={84} /><path className="sa-faint" d="M65 30 L65 114 M30 72 L100 72" />
          <path className="sa-soft"><A a="d" v="M100 30 C108 60 96 90 104 114;M100 30 C124 56 118 92 128 112;M100 30 C108 60 96 90 104 114" d={2} /></path>
          <Table x={180} y={146} w={90} /><Person x={150} y={146} h={84} face /></Sc>
      </Panel>
      <Txt x={242} y={112} a="middle" s={7} c="sa-txt sa-txt-acc">视频（只加了「怎么动」）</Txt>
      <rect className="sa-card" x={30} y={128} width={260} height={32} rx={4} />
      <Txt x={160} y={148} a="middle" s={8}>提示词：窗帘被风吹起，镜头缓慢推近，其余不变</Txt>
    </Loop>,
  },
  'ai-first-last': {
    note: '下方两张是你给的首帧和尾帧：人在门口 → 人坐在窗边。中间的走动过程交给模型补——开头和结尾都在你手里。',
    art: () => <Loop>
      <Bg />
      <path className="sa-line" d="M0 112 L320 112" />
      <rect className="sa-body" x={20} y={20} width={44} height={92} /><rect className="sa-body" x={250} y={24} width={56} height={60} /><path className="sa-faint" d="M278 24 L278 84 M250 54 L306 54" />
      <Chair x={262} y={112} s={1.3} />
      {[0, 1, 2].map((k) => <g key={k} opacity={k === 0 ? 1 : 0.25}><T type="translate" v={`${-k * 14} 0;${-k * 14} 0;${190 - k * 14} -8;${190 - k * 14} -8`} kt="0;.1;.7;1" begin={`${k * 0.12}s`} /><Person x={44} y={112} h={78} /></g>)}
      <Panel x={20} y={124} w={76}><Bg /><rect className="sa-body" x={20} y={40} width={60} height={110} /><Person x={70} y={160} h={110} /></Panel>
      <Panel x={224} y={124} w={76} hi><Bg /><Chair x={170} y={160} s={2} /><Person x={170} y={140} h={100} /></Panel>
      <Txt x={58} y={176} a="middle" s={6.5}>首帧</Txt><Txt x={262} y={176} a="middle" s={6.5} c="sa-txt sa-txt-acc">尾帧</Txt>
      <path className="sa-acc sa-dash" d="M100 146 L220 146" /><Txt x={160} y={142} a="middle" s={6.5}>中间由模型生成</Txt>
    </Loop>,
  },
  'ai-one-shot': {
    note: '一条提示词塞了五件事，模型只能给你一团乱；拆成一条一镜，每条只做一件事，再剪在一起——这是 AI 视频最重要的工作习惯。',
    art: () => <Loop>
      <Bg />
      <Show t0={0} t1={0.45}>
        <rect className="sa-card" x={20} y={20} width={280} height={30} rx={4} />
        <Txt x={30} y={39} s={8}>起床、刷牙、出门、在地铁睡着、到公司开会……</Txt>
        <Panel x={100} y={66} w={120}><Bg /><g opacity={0.5}><SceneRoom /></g><g opacity={0.5} transform="translate(60 0)"><SceneCity /></g><Bust x={200} y={90} s={1.2} /></Panel>
        <g transform="translate(236 100)"><Check x={0} y={0} ok={false} /></g><Txt x={160} y={150} a="middle" s={7} c="sa-txt sa-txt-bad">一条里塞多个场景：崩</Txt>
      </Show>
      <Show t0={0.45} t1={1}>
        {['① 被闹钟吵醒 · 4s', '② 地铁上睡着 · 3s', '③ 走进会议室 · 4s'].map((t, i) => <In key={i} t={0.47 + i * 0.08}>
          <rect className="sa-card-hi" x={14 + i * 100} y={20} width={92} height={22} rx={4} /><Txt x={60 + i * 100} y={35} a="middle" s={7} c="sa-txt sa-txt-big">{t}</Txt>
          <Panel x={18 + i * 100} y={52} w={84}>{i === 0 ? <SceneRoom /> : i === 1 ? <SceneFace /> : <SceneCity />}</Panel>
          <g transform={`translate(${60 + i * 100} 112)`}><Check x={0} y={0} /></g>
        </In>)}
        <Txt x={160} y={140} a="middle" s={7} c="sa-txt sa-txt-good">一条一镜 → 剪辑拼起来</Txt>
      </Show>
      <Timeline y={164} cuts={[0.33, 0.66]} />
    </Loop>,
  },
  'ai-negative': {
    note: '左边是常见的翻车：六根手指、招牌乱码、角落水印。把它们写进负面提示后重新生成，手变回五根、乱码和水印消失。',
    art: () => <Loop>
      <Bg />
      <Show t0={0} t1={0.5}>
        <Hand x={90} y={110} n={6} />
        <rect className="sa-card" x={150} y={30} width={80} height={26} rx={2} /><Txt x={190} y={47} a="middle" s={9} c="sa-txt-big">氵口囗卄</Txt>
        <Txt x={300} y={168} a="end" s={9} c="sa-txt">© WATERMARK</Txt>
        <g transform="translate(140 118)"><Check x={0} y={0} ok={false} /></g>
      </Show>
      <Show t0={0.5} t1={1}>
        <Hand x={90} y={110} n={5} />
        <rect className="sa-card" x={150} y={30} width={80} height={26} rx={2} />
        <g transform="translate(140 118)"><Check x={0} y={0} /></g>
      </Show>
      <rect className="sa-card" x={176} y={70} width={130} height={68} rx={4} />
      <Txt x={184} y={84} s={7} c="sa-txt sa-txt-acc">负面提示</Txt>
      {['多余的手指', '乱码文字', '水印'].map((t, i) => <In key={t} t={0.12 + i * 0.1}><Txt x={184} y={100 + i * 13} s={8} c="sa-txt-big">{`− ${t}`}</Txt></In>)}
    </Loop>,
  },
  'ai-lipsync': {
    note: '正脸、嘴部不遮挡，配音的每个字落下时嘴型跟着张合——下方波形和嘴的动作对齐，台词才可信。',
    art: () => <g>
      <Bg />
      <Bust x={160} y={70} s={1.45} talk />
      <rect className="sa-panel" x={18} y={136} width={284} height={36} rx={3} />
      {['我', '等', '了', '你', '整', '整', '三', '年'].map((w, i) => <g key={i}><rect className="sa-clip" x={26 + i * 34} y={146} width={26} height={14} rx={3} opacity={0.7} /><Txt x={39 + i * 34} y={156.5} a="middle" s={8} c="sa-txt-big">{w}</Txt></g>)}
      <g><T type="translate" v="0 0;272 0" d={D} ease={false} /><path className="sa-acc" d="M24 140 L24 168" /></g>
      <Txt x={24} y={132} s={6.5}>配音（先定）→ 嘴型对齐</Txt>
      <Txt x={20} y={24} s={6.5} c="sa-txt sa-txt-acc">正脸 · 嘴部无遮挡</Txt>
    </g>,
  },

  // ── AI 制作（图片） ──
  'img-ai-char-sheet': {
    note: '同一个角色的正面、四分之三侧、侧面和背面并排画在一张图上，金框依次扫过——之后每个镜头都拿这张图当参考，人才不会变。',
    art: () => <Loop>
      <rect className="sa-card" x={6} y={6} width={308} height={168} rx={4} />
      <Txt x={14} y={20} s={7}>角色设定图 · 林夏</Txt>
      <g className="sa-char">
        <Person x={60} y={150} h={116} face />
        <g transform="translate(130 0) scale(.82 1) translate(-130 0)"><Person x={130} y={150} h={116} face /></g>
        <Walker x={200} y={150} h={116} walk={99999} />
        <Person x={268} y={150} h={116} back />
      </g>
      {['正面', '3/4 侧', '侧面', '背面'].map((t, i) => <Txt key={t} x={60 + i * 69.3} y={166} a="middle" s={7}>{t}</Txt>)}
      <rect className="sa-acc" x={30} y={26} width={60} height={130} rx={3}><A a="x" v="30;30;99;99;168;168;238;238;30" kt="0;.18;.22;.4;.44;.62;.66;.9;1" ease={false} /></rect>
    </Loop>,
  },
  'img-ai-style-ref': {
    note: '左边的参考图只提供颜色、光线和笔触；右边的新画面内容完全不同（雨后街角撑伞的人），颜色却慢慢变成了参考图的那一套。',
    art: () => {
      const pal = ['#2a3f5f', '#e07a4a', '#f2c46a', '#6a8caf', '#c94f4f'];
      const kt = '0;.15;.6;.9;.95;1';
      return <g>
        <Bg />
        <g transform="translate(14 30)">
          <rect x={0} y={0} width={110} height={90} fill={pal[0]} />
          <circle cx={78} cy={30} r={16} fill={pal[2]} />
          <path d="M0 60 C30 40 60 70 110 50 L110 90 L0 90 Z" fill={pal[1]} />
          <path d="M0 76 C40 66 70 86 110 72 L110 90 L0 90 Z" fill={pal[4]} />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${10 + i * 20} ${20 + i * 6} q8 -6 16 0`} fill="none" stroke="#f2efe9" strokeWidth={0.8} opacity={0.5} />)}
          <rect className="sa-acc" x={0} y={0} width={110} height={90} />
          <Txt x={55} y={104} a="middle" s={7} c="sa-txt sa-txt-acc">风格参考图</Txt>
        </g>
        {pal.map((c, i) => <circle key={i} r={4} fill={c}><animateMotion dur={`${D}s`} repeatCount="indefinite" begin={`${i * 0.25}s`} path="M128 74 L180 74" /><A a="opacity" v="0;1;1;0;0" kt="0;.1;.4;.5;1" /></circle>)}
        <g transform="translate(186 30)">
          <rect x={0} y={0} width={120} height={90} fill="#3a3c40"><A a="fill" kt={kt} v={seq('#3a3c40', pal[0])} ease={false} /></rect>
          <rect x={0} y={60} width={120} height={30} fill="#4a4c50"><A a="fill" kt={kt} v={seq('#4a4c50', pal[3])} ease={false} /></rect>
          <rect x={10} y={10} width={30} height={50} fill="#55575b"><A a="fill" kt={kt} v={seq('#55575b', pal[1])} ease={false} /></rect>
          <circle cx={98} cy={18} r={8} fill="#66686c"><A a="fill" kt={kt} v={seq('#66686c', pal[2])} ease={false} /></circle>
          <path d="M60 40 C60 26 92 26 92 40 Z" fill="#5a5c60"><A a="fill" kt={kt} v={seq('#5a5c60', pal[4])} ease={false} /></path>
          <path d="M76 40 L76 76" stroke="#ddd" strokeWidth={0.8} />
          <g transform="translate(76 86) scale(.42)"><Person x={0} y={0} h={100} /></g>
          <Txt x={60} y={104} a="middle" s={7}>新画面 · 内容不同、风格一致</Txt>
        </g>
      </g>;
    },
  },
  'img-ai-inpaint': {
    note: '只在杯子那块涂上一笔选区，提示词只写「这里该有什么」：杯子被换成了一瓶花，画面其余部分一个像素都没变。',
    art: () => <Loop>
      <Bg />
      <path className="sa-line" d="M0 130 L320 130" />
      <rect className="sa-body" x={30} y={20} width={80} height={90} /><path className="sa-faint" d="M70 20 L70 110 M30 65 L110 65" />
      <Table x={200} y={170} w={170} cup={false} />
      <Show t0={0} t1={0.55}><path className="sa-body" d="M184 144 L188 112 L212 112 L216 144 Z" /><path className="sa-line" d="M214 120 C226 120 226 136 215 136" /></Show>
      <Show t0={0.55} t1={1}><path className="sa-body" d="M190 144 C184 132 188 120 196 116 L204 116 C212 120 216 132 210 144 Z" />{[[188, 96], [200, 88], [212, 98], [196, 104], [206, 106]].map(([x, y], i) => <g key={i}><path className="sa-soft" d={`M200 116 L${x} ${y}`} /><circle className="sa-accf" cx={x} cy={y} r={4} opacity={0.85} /></g>)}</Show>
      <ellipse cx={200} cy={118} rx={34} ry={36} fill="rgba(255,79,168,.22)" stroke="#ff4fa8" strokeWidth={1} strokeDasharray={230} strokeDashoffset={230}><A a="stroke-dashoffset" v="230;230;0;0;0" kt="0;.1;.4;.55;1" /><A a="opacity" v="1;1;1;0;0" kt="0;.1;.5;.6;1" /></ellipse>
      <Show t0={0.12} t1={0.55}><Txt x={250} y={70} s={7} c="sa-txt sa-txt-acc">① 涂出选区</Txt></Show>
      <Show t0={0.55} t1={1}><Txt x={250} y={70} s={7} c="sa-txt sa-txt-acc">② 只重画这一块</Txt></Show>
      <Txt x={160} y={170} a="middle" s={7}>提示词只写选区里的内容：「一小瓶黄色的花」</Txt>
    </Loop>,
  },
  'img-ai-aspect': {
    note: '同一个人，画幅从 1:1 变到 4:5、9:16、16:9、2.39:1：竖幅适合短视频和手机，横幅适合电影感——比例先定，构图才定得下来。',
    art: () => {
      const st = [[90, 18, 140, 140], [100, 13, 120, 150], [118, 13, 84, 150], [27, 13, 266, 150], [15, 28, 290, 121]];
      const labels = ['1:1 · 社交方图', '4:5 · 小红书 / 朋友圈', '9:16 · 抖音 / 短剧', '16:9 · 横屏视频', '2.39:1 · 电影宽银幕'];
      const kt = '0;.12;.2;.32;.4;.52;.6;.72;.8;.92;1';
      const v = (k: number) => [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0].map((i) => st[i][k]).join(';');
      return <g>
        <Bg />
        <Ridge y={110} amp={16} seed={3} c="sa-hill2" /><path className="sa-line" d="M0 130 L320 130" /><Tree x={60} y={130} s={1} /><Tree x={270} y={130} s={1.2} />
        <Person x={160} y={150} h={110} face />
        <path className="sa-mask" fillRule="evenodd"><A a="d" kt={kt} ease={false} v={[0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0].map((i) => { const [x, y, w, h] = st[i]; return `M-10 -10 H330 V190 H-10 Z M${x} ${y} H${x + w} V${y + h} H${x} Z`; }).join(';')} /></path>
        <rect className="sa-acc" fill="none"><A a="x" kt={kt} v={v(0)} ease={false} /><A a="y" kt={kt} v={v(1)} ease={false} /><A a="width" kt={kt} v={v(2)} ease={false} /><A a="height" kt={kt} v={v(3)} ease={false} /></rect>
        {labels.map((l, i) => <Show key={l} t0={i * 0.2} t1={i * 0.2 + 0.2}><Txt x={160} y={176} a="middle" s={7.5} c="sa-txt sa-txt-acc">{l}</Txt></Show>)}
      </g>;
    },
  },
};
void Floor; void Lamp; void Mv; void Ro;
