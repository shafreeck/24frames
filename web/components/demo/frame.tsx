// 景别 / 镜头 / 光线 / 色彩 / 构图：视频与图片两侧共用一套演示机制。
import type {ReactNode} from 'react';
import {A, Bust, CamTop, Chair, Corners, D, type Demo, Floor, Inset, Lamp, Mv, Op, Person, Ridge, Ro, Sc, Show, Skyline, Sun, T, Table, Tree, Txt, W} from './kit';

const seq = (a: string | number, b: string | number) => `${a};${a};${b};${b};${a};${a}`;
const K = '0;.12;.5;.9;.95;1';
const Loop = ({children}: {children: ReactNode}) => <Op v="1;1;0;0;1" kt="0;.9;.94;.96;1">{children}</Op>;
const Label = ({a, b, t = 0.5}: {a: string; b: string; t?: number}) => <>
  <Show t0={0} t1={t}><Txt x={160} y={172} a="middle" s={7.5}>{a}</Txt></Show>
  <Show t0={t} t1={1}><Txt x={160} y={172} a="middle" s={7.5} c="sa-txt sa-txt-acc">{b}</Txt></Show>
</>;

// ── 景别：取景框先收拢到目标范围，再放大占满画面 ───────────────────────
type R = [number, number, number]; // x, y, w（高按 16:9）
function Framing({scene, to, label}: {scene: ReactNode; to: R; label: string}) {
  const [x, y, w] = to, h = (w * 9) / 16, k = W / w;
  const f = (a: number, b: number) => seq(a, b);
  const ktF = '0;.08;.36;.9;.95;1', ktZ = '0;.44;.72;.9;.95;1';
  return <Loop>
    <g><T type="translate" v={seq('0 0', `${-k * x} ${-k * y}`)} kt={ktZ} /><g><T type="scale" v={seq(1, k)} kt={ktZ} />
      {scene}
      <path className="sa-mask" fillRule="evenodd"><A a="d" kt={ktF} v={seq('M-10 -10 H330 V190 H-10 Z M0 0 H320 V180 H0 Z', `M-10 -10 H330 V190 H-10 Z M${x} ${y} H${x + w} V${y + h} H${x} Z`)} /></path>
      <rect className="sa-acc" x={0} y={0} width={W} height={180}>
        <A a="x" kt={ktF} v={f(0, x)} /><A a="y" kt={ktF} v={f(0, y)} /><A a="width" kt={ktF} v={f(W, w)} /><A a="height" kt={ktF} v={f(180, h)} />
      </rect>
    </g></g>
    <Show t0={0.72} t1={0.92}><Txt x={160} y={172} a="middle" s={7.5} c="sa-txt sa-txt-acc">{label}</Txt></Show>
  </Loop>;
}

/** 景别共用的外景：人物很小地站在开阔地里，所有景别都从这一张里取 */
const Land = ({ots = false}: {ots?: boolean}) => <g>
  <Sun x={262} y={52} r={9} />
  <Ridge y={112} amp={22} seed={5} c="sa-hill2" step={18} />
  <Ridge y={132} amp={12} seed={8} c="sa-hill" step={26} />
  <path className="sa-line" d="M0 150 L320 150" />
  <Floor vy={150} y0={150} n={9} spread={1} rows={3} />
  <path className="sa-soft" d="M176 150 C170 160 150 170 120 182 M180 150 C190 160 210 170 240 182" />
  <g transform="translate(46 150)"><path className="sa-body" d="M0 0 L0 -14 L10 -22 L20 -14 L20 0 Z" /><path className="sa-soft" d="M7 0 L7 -7 L13 -7 L13 0" /></g>
  <Tree x={106} y={150} s={0.7} /><Tree x={240} y={152} s={0.9} /><Tree x={286} y={151} s={0.55} />
  {ots ? <><Person x={186} y={150} h={30} face hairLong /><Person x={170} y={154} h={33} back /></> : <Person x={176} y={150} h={30} face />}
</g>;

/** 棚拍产品：底座上一只香水瓶 */
const Studio = () => <g>
  <rect className="sa-wall" x={0} y={0} width={W} height={180} />
  <path className="sa-faint" d="M0 128 C100 120 220 120 320 128" />
  <path className="sa-body" d="M130 150 L190 150 L186 128 L134 128 Z" /><ellipse className="sa-body" cx={160} cy={128} rx={26} ry={4} />
  <path className="sa-body" d="M146 126 L146 96 C146 90 150 88 154 88 L166 88 C170 88 174 90 174 96 L174 126 Z" />
  <rect className="sa-body" x={154} y={78} width={12} height={10} rx={1.5} /><rect className="sa-acc" x={152} y={72} width={16} height={6} rx={1.5} />
  <path className="sa-line" d="M150 96 L150 122" opacity={0.6} /><path className="sa-soft" d="M154 104 L166 104 M154 110 L166 110" />
  <Lamp x={40} y={150} s={1.2} /><Chair x={260} y={150} s={1} />
</g>;

const shot = (to: R, label: string, note: string, ots = false): Demo => ({note, art: () => <Framing scene={<Land ots={ots} />} to={to} label={label} />});

// ── 镜头：同一个人保持同样大小，换焦段后背景的大小与远近完全不同 ─────────
function FocalSwap({bg, from, to, a, b, u, blur = false}: {bg: ReactNode; from: number; to: number; a: string; b: string; u: string; blur?: boolean}) {
  const wa = from > 1 ? 9 : 22, wb = to > 1 ? 7 : 24;
  return <Loop>
    {blur && <defs><filter id={`${u}-fb`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="0"><A a="stdDeviation" kt={K} v={seq(0, 2.2)} /></feGaussianBlur></filter></defs>}
    <g filter={blur ? `url(#${u}-fb)` : undefined}><Sc cx={160} cy={118} kt={K} v={seq(from, to)}>{bg}</Sc></g>
    <Person x={160} y={196} h={150} face />
    <Inset label="视角">
      <path className="sa-fov"><A a="d" kt={K} v={seq(`M42 50 L${42 - wa} 12 L${42 + wa} 12 Z`, `M42 50 L${42 - wb * 1.6} 12 L${42 + wb * 1.6} 12 Z`)} /></path>
      <g transform="translate(42 52)"><CamTop wedge={false} /></g>
    </Inset>
    <Label a={a} b={b} />
  </Loop>;
}
const Street = ({seed = 12}: {seed?: number}) => <g>
  <Ridge y={104} amp={16} seed={seed} c="sa-hill2" /><Skyline x={-40} w={400} base={118} seed={seed} hMin={20} hMax={64} />
  <path className="sa-line" d="M-40 118 L360 118" /><Floor vy={118} y0={118} n={11} spread={1.2} rows={4} />
  <Lamp x={70} y={118} s={0.8} /><Lamp x={250} y={118} s={0.8} /><Tree x={210} y={118} s={0.7} />
</g>;

function Ladybug() {
  return <g>
    <path className="sa-body" d="M40 140 C100 108 200 96 300 118 L320 130 L320 200 L20 200 Z" />
    <path className="sa-soft" d="M30 150 C110 118 210 108 316 126" />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} className="sa-faint" d={`M${70 + i * 46} ${136 - i * 6} C${84 + i * 46} ${150 - i * 4} ${96 + i * 46} ${170} ${100 + i * 46} 196`} />)}
    <g transform="translate(166 102)">
      {[-1, 1].map((sd) => [0, 1, 2].map((i) => <path key={`${sd}${i}`} className="sa-line" d={`M${sd * 8} ${-4 + i * 6} L${sd * 20} ${-6 + i * 8} L${sd * 24} ${2 + i * 8}`} />))}
      <path className="sa-body" d="M0 -18 C16 -18 24 -6 24 4 C24 16 14 22 0 22 C-14 22 -24 16 -24 4 C-24 -6 -16 -18 0 -18 Z" />
      <path className="sa-line" d="M0 -18 L0 22" />
      {[[-10, -6, 3.6], [10, -6, 3.6], [-13, 8, 3], [13, 8, 3], [-5, 14, 2.4], [5, 14, 2.4]].map(([x, y, r], i) => <circle key={i} className="sa-ink" cx={x} cy={y} r={r} />)}
      <path className="sa-body" d="M-10 -18 C-10 -27 10 -27 10 -18 Z" />
      <circle className="sa-ink" cx={-5} cy={-21} r={1.6} /><circle className="sa-ink" cx={5} cy={-21} r={1.6} />
      <path className="sa-line" d="M-4 -25 C-8 -32 -12 -34 -16 -34 M4 -25 C8 -32 12 -34 16 -34" />
      <path className="sa-line" d="M-14 -10 C-10 -14 -6 -15 -2 -15" opacity={0.6} />
    </g>
  </g>;
}

function Macro({u, drop = false}: {u: string; drop?: boolean}) {
  return <g>
    <defs><filter id={`${u}-mf`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"><A a="stdDeviation" kt="0;.15;.45;.85;.95;1" v="4;4;0;0;4;4" /></feGaussianBlur></filter></defs>
    <g filter={`url(#sa-b3)`}>{[[40, 40, 16], [96, 30, 10], [250, 36, 20], [292, 82, 12], [30, 100, 12]].map(([x, y, r], i) => <circle key={i} className="sa-bokeh" cx={x} cy={y} r={r} />)}</g>
    <g filter={`url(#${u}-mf)`}>
      {drop ? <g>
        <path className="sa-body" d="M0 150 C80 100 200 80 330 92 L330 200 L0 200 Z" />
        <path className="sa-soft" d="M0 152 C90 112 210 94 328 98" />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} className="sa-faint" d={`M${40 + i * 50} ${138 - i * 8} C${54 + i * 50} ${160} ${70 + i * 50} ${180} ${76 + i * 50} 200`} />)}
        <path className="sa-drop" d="M160 64 C184 64 198 80 198 98 C198 116 182 126 160 126 C138 126 122 116 122 98 C122 80 136 64 160 64 Z" />
        <path className="sa-line" d="M136 86 C140 78 148 74 156 73" /><ellipse className="sa-ink" cx={146} cy={84} rx={4} ry={2.4} opacity={0.8} />
        <path className="sa-faint" d="M134 104 C150 116 172 116 188 104" />
      </g> : <Ladybug />}
    </g>
    <Txt x={300} y={170} a="end" s={7}>1 : 1</Txt>
  </g>;
}

// ── 光线：脸上的明暗分界随光源位置移动 ─────────────────────────────────
const HEAD = 'M0 -21 C9.6 -21 15 -13 15 -2 C15 9 10 18.6 0 19.6 C-10 18.6 -15 9 -15 -2 C-15 -13 -9.6 -21 0 -21 Z';
function LitFace({u, shadowX, shadowKt = K, blur = false, tri = false, rim = false, s = 2.5, cx = 160, cy = 92, tint}: {u: string; shadowX: string; shadowKt?: string; blur?: boolean; tri?: boolean; rim?: boolean; s?: number; cx?: number; cy?: number; tint?: ReactNode}) {
  return <g>
    <Bust x={cx} y={cy} s={s} blink={!rim} />
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <clipPath id={`${u}-fc`}><path d={HEAD} /></clipPath>
      <g clipPath={`url(#${u}-fc)`}>
        {tint}
        <g filter={blur ? `url(#sa-b1)` : undefined}><g><T type="translate" kt={shadowKt} v={shadowX} />
          <path className="sa-shade" d="M1.5 -30 C4 -10 3 4 1.6 6 C3 9 4 14 3 30 L40 30 L40 -30 Z" />
        </g></g>
        {tri && <Op v="0;0;.9;.9;0;0" kt={K}><path className="sa-key" d="M3.4 2.2 L10.4 1.6 L5.2 9.6 Z" /></Op>}
      </g>
      {rim && <path className="sa-rim" d={HEAD} filter={`url(#sa-glow)`}><A a="opacity" kt={K} v={seq(0.15, 1)} /></path>}
    </g>
  </g>;
}
const Bulb = ({x, y, soft = false}: {x: number; y: number; soft?: boolean}) => soft
  ? <g transform={`translate(${x} ${y})`}><rect className="sa-acc" x={-14} y={-18} width={28} height={36} rx={2} /><rect className="sa-fov" x={-12} y={-16} width={24} height={32} /><path className="sa-line" d="M0 18 L0 60 M-8 60 L8 60" /></g>
  : <g transform={`translate(${x} ${y})`}><circle className="sa-sunf" r={4} /><path className="sa-acc" d="M-7 0 L-11 0 M7 0 L11 0 M0 -7 L0 -11 M0 7 L0 11 M-5 -5 L-8 -8 M5 5 L8 8 M5 -5 L8 -8 M-5 5 L-8 8" /></g>;

function CastShadow({u, soft = false}: {u: string; soft?: boolean}) {
  const kt = '0;.5;1';
  return <g>
    <rect className="sa-wall" x={0} y={0} width={W} height={180} />
    <path className="sa-line" d="M0 150 L320 150" /><path className="sa-faint" d="M0 150 L-40 190 M320 150 L360 190" />
    <g opacity={soft ? 0.5 : 0.85} filter={soft ? `url(#sa-b3)` : undefined}>
      <g transform="translate(170 150)"><g><T type="skewX" v="38;-38;38" kt={kt} d={8} /><g className="sa-shadowgrp" transform="translate(-170 -150)"><Person x={170} y={150} h={104} /></g></g></g>
    </g>
    <Person x={160} y={158} h={100} face />
    <g><T type="translate" v="-90 0;90 0;-90 0" kt={kt} d={8} /><Bulb x={160} y={22} soft={soft} /></g>
  </g>;
}

// ── 色彩：同一张画面，从未调色的灰片过渡到目标调色 ───────────────────
type Pal = [string, string, string, string, string, string]; // 天、远山、近景、地面、皮肤、点缀
const RAW: Pal = ['#3a3c40', '#323438', '#26282c', '#2e3034', '#5a5c60', '#6a6c70'];
function Grade({pal, label}: {pal: Pal; label: string}) {
  const kt = '0;.15;.45;.88;.95;1';
  const F = ({i, children}: {i: number; children: ReactNode}) => <g fill={RAW[i]}><A a="fill" kt={kt} v={seq(RAW[i], pal[i])} ease={false} />{children}</g>;
  return <g>
    <F i={0}><rect x={0} y={0} width={W} height={180} /></F>
    <F i={5}><circle cx={238} cy={48} r={14} /></F>
    <F i={1}><Ridge y={104} amp={24} seed={4} c="" step={20} /></F>
    <F i={2}><Ridge y={122} amp={14} seed={9} c="" step={28} /></F>
    <F i={3}><path d="M0 138 C100 132 220 132 320 138 L320 180 L0 180 Z" /></F>
    <F i={2}><path d="M200 138 L206 96 C206 90 214 88 222 92 L232 98 L236 138 Z" /><path d="M150 138 L150 70 L180 70 L180 138 Z" /></F>
    <F i={4}><g transform="translate(96 160) scale(0.6)"><path d="M-12 -76 C-12 -60 -11 -50 -10 -40 L-8 0 L8 0 L10 -40 C11 -50 12 -60 12 -76 C8 -81 -8 -81 -12 -76 Z" /><ellipse cx={0} cy={-90} rx={6} ry={7.2} /></g></F>
    <path className="sa-faint" d="M0 138 C100 132 220 132 320 138" />
    <g transform="translate(206 152)">
      {pal.map((c, i) => <rect key={i} x={i * 16} y={0} width={14} height={14} rx={2} fill={RAW[i]} stroke="rgba(255,255,255,.25)" strokeWidth={0.5}><A a="fill" kt={kt} v={seq(RAW[i], c)} ease={false} /></rect>)}
    </g>
    <Show t0={0} t1={0.3}><Txt x={206} y={146} s={6.5}>原片 · 未调色</Txt></Show>
    <Show t0={0.3} t1={1}><Txt x={206} y={146} s={6.5} c="sa-txt sa-txt-acc">{label}</Txt></Show>
  </g>;
}

// ── 构图 ─────────────────────────────────────────────────────────────
const draw = (len: number, kt = '0;.08;.32;.9;.95;1') => <A a="stroke-dashoffset" kt={kt} v={seq(len, 0)} />;
const Guide = ({d, len = 400, kt}: {d: string; len?: number; kt?: string}) => <path className="sa-acc" d={d} strokeDasharray={len} strokeDashoffset={len} opacity={0.75}>{draw(len, kt)}</path>;

export const frame: Record<string, Demo> = {
  // 景别（视频）
  'shot-extreme-wide': {
    note: '镜头从人身上一路退到天地之间：最后人只剩一个小点，山、天、路成了主角——大远景交代的是「人在哪里、有多渺小」。',
    art: () => <Loop>
      <Sc cx={176} cy={140} kt="0;.1;.6;.9;.95;1" v={seq(6, 1)}><Land /></Sc>
      <Corners x={14} y={12} w={292} h={156} />
      <Show t0={0.6} t1={0.92}><Txt x={160} y={172} a="middle" s={7.5} c="sa-txt sa-txt-acc">EWS · 人物不到画面高度 1/10</Txt></Show>
    </Loop>,
  },
  'shot-wide': shot([140, 114, 72], 'WS 全景 · 头到脚完整入画', '取景框收到「头顶到脚底」刚好装下全身，上下各留一点边——动作、服装和站位都看得全。'),
  'shot-medium': shot([158, 118.5, 36], 'MS 中景 · 腰部以上', '取景框收到腰部以上：脸和手同时看得清，是对话和日常动作最常用的距离。'),
  'shot-close': shot([170.5, 119.3, 11], 'CU 特写 · 脸占满画面', '取景框收到只剩一张脸：环境被排除在外，观众只能看表情。'),
  'shot-extreme-close': shot([174.6, 121.9, 2.8], 'ECU 大特写 · 只剩眼睛', '取景框收到只剩一双眼睛：连睫毛都看得见，用来放大一个微表情。'),
  'shot-over-shoulder': shot([158, 116, 40], 'OTS 过肩 · 前景肩膀 + 对面的脸', '取景框越过前面那个人的肩膀，框住对面的人：前景的后脑勺交代了「谁在看」。', true),
  // 景别（图片）
  'img-shot-full-body': shot([140, 114, 72], '全身 · 头到脚完整', '取景框收到头顶到脚底：全身完整、脚不被裁，服装与姿态一眼看全。'),
  'img-shot-half-body': shot([158, 118.5, 36], '半身 · 腰部以上', '取景框收到腰部以上：上半身与手部动作都在，适合人像与穿搭细节。'),
  'img-shot-eye-closeup': shot([174.6, 121.9, 2.8], '眼部特写 · 只留眼睛', '取景框收到只剩一双眼睛：虹膜、睫毛和眼神光成了画面的全部。'),
  'img-shot-product-hero': {note: '从整间摄影棚收到只剩产品：主体居中、占满画面，背景干净——这就是电商主图里的「英雄镜头」。', art: () => <Framing scene={<Studio />} to={[96, 60, 128]} label="产品主体 · 占满画面" />},

  // 镜头（视频）
  'lens-wide': {note: '换成广角时，为了让人一样大，机位得贴近：人物不变，背后的街道却被推远、变小、变开阔——空间被夸张了。', art: (u) => <FocalSwap u={u} bg={<Street />} from={1} to={0.56} a="50mm 标准" b="18mm 广角 · 背景变远变小" />},
  'lens-tele': {note: '换成长焦时，为了让人一样大，机位得退很远：人物不变，背后的楼却被拉近、变大、挤在一起——这就是「压缩感」。', art: (u) => <FocalSwap u={u} bg={<Street seed={19} />} from={1} to={2.3} a="50mm 标准" b="200mm 长焦 · 背景被拉近压扁" />},
  'lens-macro': {note: '微距把一只小虫拍成占满画面的主角：焦点一推实，壳上的斑点和脚上的细节都出来，焦外全是光斑——景深只有几毫米。', art: (u) => <Macro u={u} />},
  'lens-anamorphic': {
    note: '上下黑边收成 2.39:1 的宽银幕，背景圆形光斑被拉成竖椭圆，强光里拉出一道横向蓝色光条——三个都是变形镜头的签名。',
    art: () => <Loop>
      <rect className="sa-wall" x={0} y={0} width={W} height={180} />
      <Skyline x={-20} w={360} base={140} seed={27} hMin={30} hMax={100} lit={0.4} />
      <path className="sa-line" d="M0 140 L320 140" />
      {[[40, 60], [90, 40], [230, 50], [280, 72], [130, 30]].map(([x, y], i) => <ellipse key={i} className="sa-bokeh" cx={x} cy={y} rx={9} ry={9}><A a="rx" kt={K} v={seq(9, 5)} /><A a="ry" kt={K} v={seq(9, 11)} /></ellipse>)}
      <Person x={160} y={176} h={110} face />
      <circle className="sa-glow" cx={214} cy={84} r={4} />
      <Op kt={K} v={seq(0, 1)}><path className="sa-flare" d="M40 84 L300 84" /><path className="sa-flare" d="M110 84 L320 84" opacity={0.5} /></Op>
      <rect className="sa-dark" x={0} y={-24} width={W} height={24}><A a="y" kt={K} v={seq(-24, 0)} /></rect>
      <rect className="sa-dark" x={0} y={180} width={W} height={24}><A a="y" kt={K} v={seq(180, 156)} /></rect>
      <Label a="16:9 普通镜头" b="2.39:1 变形宽银幕" />
    </Loop>,
  },
  'lens-fisheye': {
    note: '原本笔直的楼线和地面越往画面边缘越弯，中心被鼓起来，四周压成一个圆——鱼眼把 180 度塞进一个画框。',
    art: (u) => {
      const v = [40, 80, 120, 160, 200, 240, 280], h = [20, 50, 80, 110, 140, 170];
      const vl = (x: number, k: number) => `M${160 + (x - 160) * (1 - 0.25 * k)} -10 Q${160 + (x - 160) * (1 + 0.55 * k)} 90 ${160 + (x - 160) * (1 - 0.25 * k)} 190`;
      const hl = (y: number, k: number) => `M-10 ${90 + (y - 90) * (1 - 0.25 * k)} Q160 ${90 + (y - 90) * (1 + 0.55 * k)} 330 ${90 + (y - 90) * (1 - 0.25 * k)}`;
      return <Loop>
        <rect className="sa-wall" x={0} y={0} width={W} height={180} />
        {v.map((x) => <path key={x} className="sa-soft"><A a="d" kt={K} v={seq(vl(x, 0), vl(x, 1))} /></path>)}
        {h.map((y) => <path key={y} className="sa-faint"><A a="d" kt={K} v={seq(hl(y, 0), hl(y, 1))} /></path>)}
        <Sc cx={160} cy={130} kt={K} v={seq(1, 1.35)}><Person x={160} y={150} h={70} face /></Sc>
        <defs><radialGradient id={`${u}-fe`} cx=".5" cy=".5" r=".5"><stop offset=".86" stopColor="#000" stopOpacity="0" /><stop offset=".9" stopColor="#000" stopOpacity="1" /></radialGradient></defs>
        <Op kt={K} v={seq(0, 1)}><ellipse cx={160} cy={90} rx={230} ry={150} fill={`url(#${u}-fe)`} /></Op>
        <Label a="标准镜头 · 直线是直的" b="鱼眼 · 边缘弯成弧" />
      </Loop>;
    },
  },
  // 镜头（图片）
  'img-lens-wide-env': {
    note: '镜头一路往外拓：人还在画面里，但工作台、书架、窗户都进来了——广角环境人像让环境替人物说话。',
    art: () => <Loop>
      <Sc cx={150} cy={110} kt={K} v={seq(2.1, 1)}>
        <rect className="sa-wall" x={-20} y={-20} width={360} height={220} />
        <path className="sa-line" d="M0 150 L320 150 M30 0 L30 150 M290 0 L290 150" />
        <rect className="sa-body" x={40} y={30} width={60} height={70} /><path className="sa-faint" d="M70 30 L70 100 M40 65 L100 65" />
        {[0, 1, 2, 3].map((i) => <path key={i} className="sa-soft" d={`M210 ${36 + i * 26} L280 ${36 + i * 26}`} />)}
        {[0, 1, 2, 3].map((i) => [0, 1, 2, 3, 4].map((j) => <rect key={`${i}${j}`} className="sa-bld" x={214 + j * 13} y={36 + i * 26 - 18} width={9} height={18} />))}
        <Table x={150} y={150} w={110} cup /><Chair x={196} y={150} s={1.1} />
        <Person x={150} y={150} h={66} face />
        <Tree x={20} y={150} s={0.8} />
      </Sc>
      <Inset label="视角"><path className="sa-fov"><A a="d" kt={K} v={seq('M42 50 L28 12 L56 12 Z', 'M42 50 L6 12 L78 12 Z')} /></path><g transform="translate(42 52)"><CamTop wedge={false} /></g></Inset>
      <Label a="35mm" b="24mm 广角 · 环境进画" />
    </Loop>,
  },
  'img-lens-tele-portrait': {note: '换长焦后人物不变，背景被拉近、放大并化成柔和的虚化：杂乱的背景变成了衬托人的色块。', art: (u) => <FocalSwap u={u} bg={<g><Tree x={60} y={130} s={1.2} /><Tree x={250} y={128} s={1.4} /><Street seed={31} /></g>} from={1} to={2.1} a="50mm" b="135mm 长焦 · 压缩 + 虚化" blur />},
  'img-lens-macro': {note: '焦点推实的那一刻，水珠里的高光、叶面的纹理都出现了，焦外只剩光斑——微距让小东西变成一整张画。', art: (u) => <Macro u={u} drop />},
  'img-lens-tilt-shift': {
    note: '上下两条模糊带慢慢出现，只剩中间一窄条是清楚的：真实街景立刻像桌上的微缩模型。',
    art: (u) => {
      const city = <g>
        <rect className="sa-wall" x={0} y={0} width={W} height={180} />
        {[0, 1, 2, 3, 4, 5].map((r) => <path key={r} className="sa-faint" d={`M0 ${30 + r * 26} L320 ${18 + r * 26}`} />)}
        {Array.from({length: 18}, (_, i) => { const x = (i * 53) % 300, y = 10 + ((i * 37) % 150); return <g key={i}><path className="sa-bld" d={`M${x} ${y} l18 -4 l14 6 l0 14 l-14 -6 l-18 4 Z`} /><path className="sa-bld" d={`M${x} ${y} l14 6 l18 -4`} /></g>; })}
        <path className="sa-line" d="M0 100 L320 76 M0 112 L320 88" />
        {[0, 1, 2].map((i) => <g key={i}><T type="translate" v={`${-40 - i * 60} ${3 + i * 0.6};${360 - i * 60} ${-27 + i * 0.6}`} d={7} ease={false} /><rect className="sa-accf" x={0} y={100} width={8} height={4} rx={1} /></g>)}
      </g>;
      return <Loop>
        {city}
        <defs><linearGradient id={`${u}-tg`} x1="0" y1="0" x2="0" y2="1"><stop offset=".15" stopColor="#fff" /><stop offset=".42" stopColor="#000" /><stop offset=".6" stopColor="#000" /><stop offset=".88" stopColor="#fff" /></linearGradient><mask id={`${u}-tm`}><rect x={0} y={0} width={W} height={180} fill={`url(#${u}-tg)`} /></mask></defs>
        <g mask={`url(#${u}-tm)`}><Op kt={K} v={seq(0, 1)}><g filter={`url(#sa-b3)`}>{city}</g></Op></g>
        <Label a="普通俯拍" b="移轴 · 只留中间一条清楚" />
      </Loop>;
    },
  },

  // 光线（视频）
  'light-rembrandt': {note: '灯从正前方移到侧上方 45 度：脸的另一半沉入阴影，只在暗侧颧骨上留下一个三角形亮斑——那个三角就是伦勃朗光。', art: (u) => <Loop><rect className="sa-wall" x={0} y={0} width={W} height={180} /><g><T type="translate" kt={K} v={seq('120 40', '30 0')} /><Bulb x={0} y={30} /></g><LitFace u={u} shadowX={seq('22 0', '0 0')} tri /></Loop>},
  'light-rim': {note: '光源在人物身后：脸是暗的，但头发和肩膀边缘亮起一圈细光，人从黑背景里被「勾」了出来。', art: (u) => <Loop><rect className="sa-dark" x={0} y={0} width={W} height={180} /><Op kt={K} v={seq(0.2, 1)}><circle className="sa-glow" cx={186} cy={52} r={6} filter={`url(#sa-glow)`} /></Op><LitFace u={u} shadowX={seq('-30 0', '-30 0')} rim /></Loop>},
  'light-hard': {note: '一盏小而硬的灯左右移动：墙上的影子边缘像刀切一样清楚，影子随灯反方向摆动。', art: (u) => <CastShadow u={u} />},
  'light-soft': {note: '换成一块大柔光箱：同样移动，影子却是一团边缘发虚的淡影——光源越大，阴影越软。', art: (u) => <CastShadow u={u} soft />},
  'light-golden': {
    note: '太阳往地平线落下：天色从白变成橙金，人的影子越拉越长——日落前那一小时的低角度暖光。',
    art: () => {
      const kt = '0;.1;.8;.9;.95;1';
      return <Loop>
        <rect x={0} y={0} width={W} height={180} fill="#2a3240"><A a="fill" kt={kt} v={seq('#2a3644', '#5a3420')} ease={false} /></rect>
        <g><T type="translate" kt={kt} v={seq('0 0', '20 70')} /><circle cx={230} cy={40} r={13} fill="#f4e6c8"><A a="fill" kt={kt} v={seq('#f4e6c8', '#ffb050')} ease={false} /></circle></g>
        <Ridge y={124} amp={14} seed={6} c="sa-hill" />
        <path className="sa-line" d="M0 140 L320 140" />
        <path className="sa-shade"><A a="d" kt={kt} v={seq('M126 140 L140 140 L132 146 L120 146 Z', 'M126 140 L140 140 L40 170 L10 170 Z')} /></path>
        <Person x={133} y={141} h={74} face />
        <Tree x={250} y={140} s={0.9} />
      </Loop>;
    },
  },
  'light-neon': {
    note: '店招霓虹一闪一闪，粉和青两种颜色直接打在脸上，一边一个色——光源本身就在画面里。',
    art: (u) => <g>
      <rect className="sa-dark" x={0} y={0} width={W} height={180} />
      <g filter={`url(#sa-glow)`}>
        <path className="sa-neon1" d="M24 28 L64 28 L44 52 Z M44 52 L44 72 M32 72 L56 72 M50 22 L58 36"><A a="opacity" v="1;1;.2;1;.3;1;1" kt="0;.4;.42;.46;.5;.54;1" d={3} discrete /></path>
        <path className="sa-neon2" d="M236 26 C262 22 290 30 296 48 C290 66 262 72 236 68 C226 56 226 38 236 26 Z M250 40 L280 40"><A a="opacity" v="1;1;.3;1;1" kt="0;.7;.72;.76;1" d={4} discrete /></path>
      </g>
      <LitFace u={u} shadowX="-60 0;-60 0" shadowKt="0;1" tint={<><rect className="sa-tint1" x={-20} y={-30} width={20} height={60} /><rect className="sa-tint2" x={0} y={-30} width={20} height={60} /></>} />
      {Array.from({length: 14}, (_, i) => <path key={i} className="sa-faint" d={`M${(i * 23) % 320} 0 l-6 22`}><T type="translate" v="0 -20;0 200" d={1 + (i % 4) * 0.2} ease={false} /></path>)}
    </g>,
  },
  // 光线（图片）
  'img-light-window': {
    note: '一扇窗打进来一块斜斜的光：亮的落在人和桌上，屋里其余地方自然暗下去，空气里的灰尘被照亮——窗光柔和又有方向。',
    art: () => <g>
      <rect className="sa-wall" x={0} y={0} width={W} height={180} />
      <path className="sa-line" d="M0 140 L320 140" />
      <rect className="sa-body" x={20} y={24} width={70} height={92} /><path className="sa-faint" d="M55 24 L55 116 M20 70 L90 70" />
      <path className="sa-beam"><A a="d" v="M90 30 L90 116 L250 172 L230 70 Z;M90 30 L90 116 L262 172 L242 70 Z;M90 30 L90 116 L250 172 L230 70 Z" d={8} /></path>
      <Table x={190} y={140} w={70} /><Person x={226} y={150} h={80} face hairLong />
      {Array.from({length: 10}, (_, i) => <circle key={i} className="sa-subj" r={0.8} cx={110 + i * 12} cy={60 + (i * 17) % 60} opacity={0.6}><T type="translate" v="0 0;6 -14;0 0" d={4 + (i % 3)} /></circle>)}
    </g>,
  },
  'img-light-side': {note: '灯转到人的正侧面 90 度：明暗分界线正好落在鼻梁上，一半亮、一半暗，戏剧感最强。', art: (u) => <Loop><rect className="sa-wall" x={0} y={0} width={W} height={180} /><g><T type="translate" kt={K} v={seq('110 20', '0 60')} /><Bulb x={40} y={30} /></g><LitFace u={u} shadowX={seq('22 0', '-1.4 0')} /></Loop>},
  'img-light-backlit': {
    note: '太阳正好藏在人身后：头发和肩膀镶上一圈亮边，镜头里飘过几颗光斑——逆光让画面通透、有空气感。',
    art: (u) => <g>
      <rect className="sa-wall" x={0} y={0} width={W} height={180} />
      <circle className="sa-sunf" cx={172} cy={58} r={22} filter={`url(#sa-b3)`} opacity={0.75}><A a="r" v="20;26;20" d={4} /></circle>
      <Ridge y={130} amp={12} seed={3} c="sa-hill" />
      <path className="sa-rim" d="M144 180 C146 120 150 96 160 92 C150 84 150 60 168 54 C186 52 192 70 186 86 C198 92 204 120 206 180" filter={`url(#sa-glow)`} />
      <Person x={174} y={190} h={140} back />
      {[[110, 110, 7], [80, 140, 10], [50, 168, 14]].map(([x, y, r], i) => <circle key={i} className="sa-bokeh" cx={x} cy={y} r={r}><T type="translate" v="0 0;-14 10;0 0" d={5} /></circle>)}
    </g>,
  },
  'img-light-softbox': {
    note: '两侧柔光箱亮起：瓶身上出现两条干净的竖向高光，阴影又淡又软——棚拍产品图的标准打法。',
    art: () => <Loop>
      <rect className="sa-wall" x={0} y={0} width={W} height={180} />
      <g transform="translate(40 60)"><rect className="sa-acc" x={-22} y={-34} width={44} height={68} rx={2} /><rect className="sa-fov" x={-20} y={-32} width={40} height={64}><A a="opacity" kt={K} v={seq(0.1, 1)} /></rect></g>
      <g transform="translate(280 60)"><rect className="sa-acc" x={-22} y={-34} width={44} height={68} rx={2} /><rect className="sa-fov" x={-20} y={-32} width={40} height={64}><A a="opacity" kt={K} v={seq(0.1, 1)} /></rect></g>
      <Sc cx={160} cy={110} v="1.35;1.35" kt="0;1"><Studio /></Sc>
      <Op kt={K} v={seq(0, 0.9)}><rect className="sa-key" x={146} y={86} width={3} height={34} rx={1.5} /><rect className="sa-key" x={170} y={86} width={3} height={34} rx={1.5} /></Op>
    </Loop>,
  },
  'img-light-hard-shadow': {
    note: '硬光穿过百叶窗，在人和墙上打出一条条锐利的光影条纹，缓缓移动——影子本身成了图案。',
    art: (u) => <g>
      <rect className="sa-wall" x={0} y={0} width={W} height={180} />
      <Bust x={170} y={92} s={2.3} blink={false} />
      <clipPath id={`${u}-hs`}><rect x={0} y={0} width={W} height={180} /></clipPath>
      <g clipPath={`url(#${u}-hs)`}><g><T type="translate" v="-30 0;30 0;-30 0" d={10} />
        {Array.from({length: 12}, (_, i) => <path key={i} className="sa-stripe" d={`M${-80 + i * 40} -20 L${-40 + i * 40} -20 L${-120 + i * 40} 200 L${-160 + i * 40} 200 Z`} />)}
      </g></g>
    </g>,
  },
  'img-light-golden': {note: '太阳往地平线落下：天色从白变成橙金，影子越拉越长——低角度的暖光让皮肤和草地都镀上一层金。', art: () => <></>},
  'img-light-neon-mix': {
    note: '一侧品红、一侧青蓝两盏灯同时打在脸上，在鼻梁处交汇——两种颜色的光把一张脸分成两个世界。',
    art: (u) => <Loop>
      <rect className="sa-dark" x={0} y={0} width={W} height={180} />
      <g filter={`url(#sa-glow)`}><path className="sa-neon1" d="M30 20 L30 160" /><path className="sa-neon2" d="M290 20 L290 160" /></g>
      <LitFace u={u} shadowX="-60 0;-60 0" shadowKt="0;1" tint={<Op kt={K} v={seq(0.15, 1)}><rect className="sa-tint1" x={-20} y={-30} width={19} height={60} /><rect className="sa-tint2" x={1} y={-30} width={19} height={60} /></Op>} />
    </Loop>,
  },

  // 色彩
  'color-teal-orange': {note: '暗部和天空推向青蓝，人的皮肤推向橙色：冷暖互补让人物从背景里跳出来，好莱坞商业片最常见的调色。', art: () => <Grade label="青橙 · 暗部青 / 肤色橙" pal={['#1d4f5a', '#24606a', '#153840', '#3a2c22', '#e08a4a', '#f2a65a']} />},
  'color-warm-cool': {note: '画面里同时出现冷和暖：天空、远景偏蓝，灯光和人偏暖——两种温度一对撞，情绪立刻有了张力。', art: () => <Grade label="冷暖对撞 · 冷环境 / 暖光源" pal={['#24426e', '#2f5288', '#18284a', '#4a3020', '#f0a050', '#ffbf6a']} />},
  'color-muted': {note: '所有颜色都往灰里收：饱和度降低、对比柔和，画面安静、克制，像一部文艺片。', art: () => <Grade label="低饱和 · 颜色往灰里收" pal={['#7d8280', '#6c706c', '#555955', '#66615a', '#a2958a', '#968a7e']} />},
  'color-high-sat': {note: '每一种颜色都推到最浓：天更蓝、草更绿、衣服更艳——热闹、年轻、有冲击力。', art: () => <Grade label="高饱和 · 每种颜色推到最浓" pal={['#1478ff', '#00a86b', '#007a48', '#ffc400', '#ff5a36', '#ff2d95']} />},
  'color-monochrome': {note: '整张画面只剩一种颜色的深浅变化：统一成蓝调，情绪被压成一种温度。', art: () => <Grade label="单色调 · 只剩一种颜色" pal={['#3a5a80', '#2c4666', '#1e3149', '#263c58', '#7a9cc4', '#a0bcde']} />},
  'img-color-morandi': {note: '颜色全部掺了一点灰：灰粉、灰绿、灰蓝，彼此不抢——安静、高级、耐看。', art: () => <Grade label="莫兰迪 · 每种颜色都掺灰" pal={['#b8aea3', '#a3a79b', '#8e958c', '#c2b0a0', '#d1bfb0', '#9fa8b0']} />},
  'img-color-high-sat': {note: '把互补的浓色直接撞在一起：品红对青、紫对黄——颜色本身就是视觉冲击。', art: () => <Grade label="高饱和撞色 · 互补色硬碰" pal={['#ff3d7f', '#00c2ff', '#6a00ff', '#ffe600', '#ff7a00', '#00e676']} />},
  'img-color-blue-hour': {note: '日落后天还没黑的那段：天空是深蓝，窗户和路灯是暖黄——蓝和一点点暖，安静又有温度。', art: () => <Grade label="蓝调时刻 · 深蓝天 + 暖灯" pal={['#1a3a78', '#24457e', '#101e3c', '#182a50', '#e8b070', '#ffc870']} />},
  'img-color-earthy': {note: '颜色收到土、木、沙、苔藓：棕、赭、橄榄绿——自然、温暖、踏实。', art: () => <Grade label="大地色 · 土 / 木 / 苔" pal={['#c9b48f', '#a07850', '#6b4a2e', '#8a6a40', '#c08a60', '#5b6b3a']} />},
  'img-color-monochrome': {note: '整张只用一种颜色的深浅：统一成一种色相，画面纯粹、有设计感。', art: () => <Grade label="单色调 · 一种色相的深浅" pal={['#c8a878', '#a88858', '#7a6040', '#8e7450', '#e0c8a0', '#f0dcb8']} />},

  // 构图
  'comp-thirds': {note: '九宫格线画出来后，人从正中间挪到右边竖线上，地平线降到下三分之一——画面一下子有了呼吸和方向。', art: () => <Thirds />},
  'img-comp-thirds': {note: '九宫格线画出来后，主体从正中挪到交叉点上，地平线落在三分线上——不呆板，视线有地方去。', art: () => <Thirds />},
  'comp-symmetry': {note: '一条中轴线画下来，左右两半像镜子一样对折重合——稳定、庄重，也带一点压迫和诡异。', art: () => <Symmetry />},
  'img-comp-center-symmetry': {note: '主体压在中轴线上，左右像镜子一样对折重合：稳得像建筑立面，最怕的就是一点点歪。', art: () => <Symmetry />},
  'comp-leading': {
    note: '路的两条边和栏杆被金线描出来，全部汇向远处那个人——观众的眼睛会顺着这些线自己走到主体身上。',
    art: () => <Loop>
      <rect className="sa-wall" x={0} y={0} width={W} height={180} />
      <Ridge y={86} amp={12} seed={2} c="sa-hill2" /><path className="sa-line" d="M0 86 L320 86" />
      <path className="sa-body" d="M150 86 L170 86 L300 180 L20 180 Z" />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} className="sa-soft" d={`M${158 + (i - 2.5) * 0.4} ${90 + i * i * 2.6} L${162 + (i - 2.5) * 0.4} ${90 + i * i * 2.6 + 3 + i}`} />)}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => { const t = i / 6; return <path key={i} className="sa-line" d={`M${146 - t * 140} ${86 + t * 94 - 10 - t * 30} L${146 - t * 140} ${86 + t * 94}`} />; })}
      <path className="sa-line" d="M146 76 L6 140" />
      <Person x={160} y={88} h={18} />
      <Guide d="M20 180 L156 88" len={170} /><Guide d="M300 180 L164 88" len={170} /><Guide d="M6 140 L146 76" len={160} />
      <Op kt="0;.3;.4;.9;.95;1" v="0;0;1;1;0;0"><circle className="sa-acc" cx={160} cy={78} r={14} /></Op>
    </Loop>,
  },
  'comp-negative': {note: '镜头往后让，人缩到画面一角，剩下大片干净的天空——空着的地方让人显得更孤独，也给文字留了位置。', art: () => <Negative />},
  'img-comp-negative': {note: '主体缩到一角，大片干净的留白压住它：空的地方不是浪费，是情绪和排版的空间。', art: () => <Negative />},
  'comp-frame-in-frame': {note: '门框被金线描出来，四周压暗：人被框在第二层边框里，像在偷看，也更有纵深。', art: () => <FrameIn />},
  'img-comp-frame-in-frame': {note: '门框被金线描出来，外面压暗一两档：主体被套在第二层画框里，深度和窥视感都出来了。', art: () => <FrameIn />},
  'img-comp-flatlay': {
    note: '镜头垂直朝下，物件一件件滑进格子里摆整齐：间距一致、互不遮挡，像一张摊开的图鉴。',
    art: () => {
      const items: [number, number, ReactNode][] = [
        [70, 50, <><circle className="sa-body" r={18} /><circle className="sa-line" r={11} /><path className="sa-line" d="M18 0 C24 -2 24 6 18 4" /></>],
        [160, 50, <><rect className="sa-body" x={-26} y={-20} width={52} height={40} rx={2} /><path className="sa-faint" d="M0 -20 L0 20 M-20 -10 L-4 -10 M-20 -2 L-4 -2 M4 -10 L20 -10" /></>],
        [250, 50, <><rect className="sa-body" x={-12} y={-22} width={24} height={44} rx={4} /><rect className="sa-faint" x={-9} y={-18} width={18} height={34} /></>],
        [70, 130, <><path className="sa-body" d="M-24 -4 L20 -4 L24 0 L20 4 L-24 4 Z" /><path className="sa-acc" d="M-24 0 L-18 0" /></>],
        [160, 130, <><circle className="sa-body" r={20} /><circle className="sa-faint" r={14} /><path className="sa-line" d="M0 0 L0 -12 M0 0 L8 4" /></>],
        [250, 130, <><path className="sa-body" d="M-18 -20 C0 -28 18 -20 18 0 C18 20 0 26 -18 20 C-24 6 -24 -8 -18 -20 Z" /><path className="sa-faint" d="M-14 -12 C-2 -4 4 6 10 16" /></>],
      ];
      return <Loop>
        <rect className="sa-body" x={10} y={6} width={300} height={168} rx={3} />
        <path className="sa-faint sa-dash" d="M115 6 L115 174 M205 6 L205 174 M10 90 L310 90" />
        {items.map(([x, y, el], i) => <g key={i}><T type="translate" kt={`0;${0.08 + i * 0.06};${0.3 + i * 0.06};.9;.95;1`} v={seq(`${x + (i % 2 ? 60 : -60)} ${y + (i < 3 ? -50 : 50)}`, `${x} ${y}`)} /><Ro cx={0} cy={0} kt={`0;${0.08 + i * 0.06};${0.3 + i * 0.06};.9;.95;1`} v={seq(i * 23 - 40, 0)}>{el}</Ro></g>)}
      </Loop>;
    },
  },
  'img-comp-diagonal': {
    note: '一条对角线从左下画到右上，楼梯、人和视线都顺着它排开——斜线让静止的画面也有了动势。',
    art: () => <Loop>
      <rect className="sa-wall" x={0} y={0} width={W} height={180} />
      {Array.from({length: 9}, (_, i) => <path key={i} className="sa-line" d={`M${20 + i * 32} ${170 - i * 18} L${52 + i * 32} ${170 - i * 18} L${52 + i * 32} ${152 - i * 18}`} />)}
      <path className="sa-faint" d="M20 170 L20 180 M308 8 L320 8" />
      <Guide d="M10 178 L310 6" len={350} />
      <g><T type="translate" kt={K} v={seq('0 0', '96 -54')} /><Person x={110} y={124} h={40} /></g>
    </Loop>,
  },
  'shot-mcu': shot([167, 119.3, 18], 'MCU 近景 · 胸口以上', '取景框收到胸口以上：表情看得清，又留了一点肩膀和环境——对话里单人镜头最常用的距离。'),
  'rack-focus': {
    note: '机位一动不动，只是焦点从前景的戒指慢慢移到门口的人身上：清楚和模糊对调，观众的视线也被带了过去。',
    art: (u) => <Loop>
      <defs>
        <filter id={`${u}-rn`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="0"><A a="stdDeviation" kt={K} v={seq(0, 3.4)} /></feGaussianBlur></filter>
        <filter id={`${u}-rf`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"><A a="stdDeviation" kt={K} v={seq(3, 0)} /></feGaussianBlur></filter>
      </defs>
      <rect className="sa-wall" x={0} y={0} width={W} height={180} />
      <g filter={`url(#${u}-rf)`}>
        <path className="sa-line" d="M0 132 L320 132" />
        <rect className="sa-bld" x={176} y={30} width={74} height={102} /><rect className="sa-hill2" x={182} y={36} width={62} height={96} />
        <Person x={213} y={132} h={88} face />
        <Lamp x={100} y={132} s={0.9} />
      </g>
      <g filter={`url(#${u}-rn)`}>
        <path className="sa-body" d="M-10 150 L150 136 L150 190 L-10 190 Z" />
        <rect className="sa-body" x={44} y={112} width={46} height={30} rx={3} /><path className="sa-line" d="M44 120 L90 120" />
        <circle className="sa-acc" cx={67} cy={106} r={9} /><path className="sa-accf" d="M62 97 L67 90 L72 97 Z" />
      </g>
      <Label a="焦点：前景的戒指" b="焦点：门口的人" />
    </Loop>,
  },
  'shallow-dof': {
    note: '光圈一点点开大：人物始终清楚，身后的街景却越来越虚，路灯化成一颗颗圆光斑——观众的眼睛只剩一个去处。',
    art: (u) => <DofDemo u={u} />,
  },
  'img-lens-shallow-dof': {
    note: '光圈开到最大：只有眼睛是清楚的，树叶和灯光化成奶油一样的圆形光斑，主体一下子从背景里跳出来。',
    art: (u) => <DofDemo u={u} trees />,
  },
  'img-light-high-key': {
    note: '整张画面被提亮到以白色为主、阴影几乎消失；右下角的亮度分布（直方图）整体挤到了右边——这就是「高调」。',
    art: () => <KeyDemo high />,
  },
  'img-light-low-key': {
    note: '大部分画面沉进暗里，只留一束光照亮半张脸；右下角的直方图整体挤到左边——暗，但暗部还有层次。',
    art: (u) => <KeyDemo u={u} />,
  },
  'img-light-silhouette': {
    note: '天越来越亮，人却完全变黑，只剩一圈轮廓：没有五官也认得出是谁、在做什么，因为姿态和外形够清楚。',
    art: () => <Loop>
      <rect x={0} y={0} width={W} height={180} fill="#2a3036"><A a="fill" kt={K} v={seq('#2a3036', '#f0a050')} ease={false} /></rect>
      <rect x={0} y={90} width={W} height={60} fill="#3a3036" opacity={0.6}><A a="fill" kt={K} v={seq('#3a3036', '#ffd28a')} ease={false} /></rect>
      <circle className="sa-sunf" cx={196} cy={112} r={20} />
      <path d="M0 150 L80 128 L160 118 L240 126 L320 146 L320 180 L0 180 Z" fill="#0b0c0e" />
      <Op kt={K} v={seq(1, 0)}><Person x={160} y={122} h={90} face /></Op>
      <Op kt={K} v={seq(0, 1)}><g className="sa-shadowgrp"><Person x={160} y={122} h={90} /><path d="M146 37 L176 37 L171 29 L151 29 Z M171 56 L198 38 L201 41 L174 60 Z" /></g></Op>
    </Loop>,
  },
};

function DofDemo({u, trees = false}: {u: string; trees?: boolean}) {
  return <Loop>
    <defs><filter id={`${u}-dof`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="0"><A a="stdDeviation" kt={K} v={seq(0, 4.5)} /></feGaussianBlur></filter></defs>
    <rect className="sa-wall" x={0} y={0} width={W} height={180} />
    <g filter={`url(#${u}-dof)`}>
      {trees ? <><Tree x={40} y={140} s={2} /><Tree x={270} y={150} s={2.4} /><Ridge y={120} amp={20} seed={9} c="sa-hill2" /></> : <><Skyline x={-20} w={360} base={140} seed={15} hMin={30} hMax={100} lit={0.4} /><path className="sa-line" d="M0 140 L320 140" /></>}
      {[[40, 50], [90, 30], [250, 40], [290, 90], [230, 110], [60, 110]].map(([x, y], i) => <circle key={i} className="sa-bokeh" cx={x} cy={y} r={3}><A a="r" kt={K} v={seq(3, 13)} /></circle>)}
    </g>
    <Bust x={160} y={100} s={1.6} />
    <Label a="f/8 · 前后都清楚" b="f/1.4 · 只有人清楚" />
  </Loop>;
}

function KeyDemo({high = false, u}: {high?: boolean; u?: string}) {
  const lo = [2, 4, 7, 10, 12, 12, 10, 8, 6, 4, 3, 2], hiD = [0.5, 0.5, 1, 1, 2, 3, 4, 6, 9, 12, 14, 16], loD = [16, 14, 11, 8, 5, 3, 2, 2, 1.5, 1, 1, 2];
  const to = high ? hiD : loD;
  return <Loop>
    <rect x={0} y={0} width={W} height={180} fill="#3a3c40"><A a="fill" kt={K} v={seq('#3a3c40', high ? '#efede8' : '#08090b')} ease={false} /></rect>
    {!high && u && <><defs><radialGradient id={`${u}-spot`} cx=".42" cy=".42" r=".5"><stop offset="0" stopColor="#ffe6b8" stopOpacity=".35" /><stop offset="1" stopColor="#ffe6b8" stopOpacity="0" /></radialGradient></defs><Op kt={K} v={seq(0, 1)}><ellipse cx={150} cy={80} rx={90} ry={80} fill={`url(#${u}-spot)`} /></Op></>}
    <g className={high ? 'sa-flash' : undefined}><Bust x={150} y={88} s={1.65} blink={false} /></g>
    {!high && <Op kt={K} v={seq(0, 0.85)}><path className="sa-shade" d="M150 40 C160 70 160 100 152 120 L150 200 L330 200 L330 0 L150 0 Z" /></Op>}
    <g transform="translate(234 128)">
      <rect className="sa-panel" x={-6} y={-6} width={78} height={44} rx={3} />
      {lo.map((h, i) => <rect key={i} className="sa-clip" x={i * 5.6} width={4} y={30 - h * 1.6} height={h * 1.6}><A a="height" kt={K} v={seq(h * 1.6, to[i] * 1.6)} /><A a="y" kt={K} v={seq(30 - h * 1.6, 30 - to[i] * 1.6)} /></rect>)}
      <Txt x={0} y={-9} s={6}>亮度分布</Txt>
    </g>
  </Loop>;
}
frame['img-light-golden'] = {...frame['light-golden'], note: frame['img-light-golden'].note};

function Thirds() {
  return <Loop>
    <rect className="sa-wall" x={0} y={0} width={W} height={180} />
    <Mv kt={K} v={seq('0 0', '0 30')}><Ridge y={84} amp={16} seed={7} c="sa-hill2" /><path className="sa-line" d="M0 90 L320 90" /><Floor vy={90} y0={90} n={9} rows={3} /></Mv>
    <g><T type="translate" kt={K} v={seq('0 0', '53 0')} /><Person x={160} y={150} h={70} face /></g>
    {[[106.7, 0, 106.7, 180], [213.3, 0, 213.3, 180], [0, 60, 320, 60], [0, 120, 320, 120]].map(([x1, y1, x2, y2], i) => <Guide key={i} d={`M${x1} ${y1} L${x2} ${y2}`} len={330} kt="0;.05;.25;.9;.95;1" />)}
    <Op kt={K} v={seq(0, 1)}><circle className="sa-acc" cx={213.3} cy={60} r={4} /><circle className="sa-acc" cx={213.3} cy={120} r={4} /></Op>
  </Loop>;
}

function Symmetry() {
  const half = <g>
    <path className="sa-line" d="M160 20 L80 50 L80 160 M160 20 L160 160" />
    <rect className="sa-bld" x={90} y={60} width={22} height={100} /><rect className="sa-bld" x={124} y={70} width={24} height={90} />
    <path className="sa-soft" d="M90 74 L112 74 M90 88 L112 88 M124 84 L148 84 M80 50 L160 50" />
    <path className="sa-body" d="M136 160 L136 120 C136 108 160 104 160 104 L160 160 Z" />
    <Tree x={50} y={160} s={1} />
  </g>;
  return <Loop>
    <rect className="sa-wall" x={0} y={0} width={W} height={180} />
    <path className="sa-line" d="M0 160 L320 160" />
    {half}
    <g transform="translate(160 0)"><g><T type="scale" kt={K} v={seq('0 1', '-1 1')} /><g transform="translate(-160 0)">{half}</g></g></g>
    <Guide d="M160 4 L160 176" len={180} />
  </Loop>;
}

function Negative() {
  return <Loop>
    <Sc cx={250} cy={150} kt={K} v={seq(2.4, 1)}>
      <rect className="sa-wall" x={-200} y={-200} width={720} height={580} />
      <path className="sa-line" d="M-200 156 L520 156" />
      <Person x={262} y={156} h={34} />
      <Tree x={296} y={156} s={0.6} />
    </Sc>
    <Op kt={K} v={seq(0, 0.7)}>
      <rect className="sa-acc sa-dash" x={16} y={16} width={200} height={124} rx={3} />
      <Txt x={116} y={82} a="middle" s={8} c="sa-txt sa-txt-acc">留白</Txt>
    </Op>
  </Loop>;
}

function FrameIn() {
  return <Loop>
    <rect className="sa-wall" x={0} y={0} width={W} height={180} />
    <path className="sa-line" d="M0 160 L320 160" />
    <rect className="sa-bld" x={20} y={10} width={280} height={150} />
    <rect className="sa-hill2" x={118} y={36} width={84} height={124} />
    <Ridge x={118} w={84} y={110} amp={10} seed={4} c="sa-hill" step={14} />
    <Person x={168} y={156} h={44} face />
    <Op kt={K} v={seq(0, 0.6)}><path className="sa-mask" fillRule="evenodd" d="M0 0 H320 V180 H0 Z M118 36 H202 V160 H118 Z" /></Op>
    <Guide d="M118 160 L118 36 L202 36 L202 160 Z" len={420} />
    <Chair x={60} y={160} s={1.2} /><Lamp x={262} y={160} s={1.1} />
  </Loop>;
}

// 未用到的导出保持树摇友好
void D; void Table;
