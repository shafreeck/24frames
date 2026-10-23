// 演示线稿工具箱：SMIL 动画助手 + 精细线稿原件。
// 画布统一 320×180（16:9）。动画全部用 SMIL，服务端渲染即可播放，不依赖客户端脚本；
// 首页由 DemoPlayback 按可见性暂停/恢复，减少同时动的数量。
import type {ReactNode} from 'react';

export const W = 320, H = 180;
export const D = 6; // 默认循环时长（秒）

export type Demo = {
  /** 详情页图注：看动画时该注意什么，写给不懂行的人 */
  note: string;
  /** 降低动态时停在哪一秒 */
  still?: number;
  art: (u: string) => ReactNode;
};

const EASE = '.45 0 .25 1';
const n = (v: string) => v.split(';').length;
const even = (k: number) => Array.from({length: k}, (_, i) => +(i / (k - 1)).toFixed(4)).join(';');

type AnimOpts = {v: string; kt?: string; d?: number; ease?: boolean | string; discrete?: boolean; begin?: string};
function timing({v, kt, d = D, ease = true, discrete, begin}: AnimOpts) {
  const k = n(v);
  const calcMode = discrete ? 'discrete' : ease ? 'spline' : 'linear';
  // SMIL 规定：非 discrete 时 keyTimes 必须以 1 结尾、个数与 values 一致，否则浏览器静默忽略整段动画
  if (kt && (kt.split(';').length !== k || (!discrete && Number(kt.split(';').pop()) !== 1))) throw new Error(`keyTimes 不合法：${v} / ${kt}`);
  return {
    values: v,
    keyTimes: kt ?? even(k),
    dur: `${d}s`,
    repeatCount: 'indefinite',
    begin,
    calcMode,
    keySplines: calcMode === 'spline' ? Array(k - 1).fill(ease === true ? EASE : ease).join(';') : undefined,
  };
}

/** 属性动画 */
export const A = ({a, ...o}: AnimOpts & {a: string}) => <animate attributeName={a} {...timing(o)} />;
/** 变换动画；additive 叠加到已有 transform 上 */
export const T = ({type, sum, ...o}: AnimOpts & {type: 'translate' | 'scale' | 'rotate' | 'skewX'; sum?: boolean}) => (
  <animateTransform attributeName="transform" type={type} additive={sum ? 'sum' : undefined} {...timing(o)} />
);

/** 平移组 */
export const Mv = ({children, ...o}: AnimOpts & {children: ReactNode}) => <g><T type="translate" {...o} />{children}</g>;
/** 绕点缩放组 */
export const Sc = ({cx, cy, children, ...o}: AnimOpts & {cx: number; cy: number; children: ReactNode}) => (
  <g transform={`translate(${cx} ${cy})`}><g><T type="scale" {...o} /><g transform={`translate(${-cx} ${-cy})`}>{children}</g></g></g>
);
/** 绕点旋转组；v 只写角度 */
export const Ro = ({cx, cy, children, v, ...o}: AnimOpts & {cx: number; cy: number; children: ReactNode}) => (
  <g><T type="rotate" v={v.split(';').map((a) => `${a} ${cx} ${cy}`).join(';')} {...o} />{children}</g>
);
/** 透明度组 */
export const Op = ({children, ...o}: AnimOpts & {children: ReactNode}) => <g><A a="opacity" {...o} />{children}</g>;

/** 在 [t0,t1] 区间可见（0..1 时间比例），其余时间隐藏 */
export const Show = ({t0, t1, d = D, children}: {t0: number; t1: number; d?: number; children: ReactNode}) => {
  const v: string[] = [], kt: number[] = [];
  if (t0 > 0) { v.push('0'); kt.push(0); }
  v.push('1'); kt.push(t0);
  if (t1 < 1) { v.push('0'); kt.push(t1); }
  return <g><animate attributeName="opacity" values={v.join(';')} keyTimes={kt.join(';')} dur={`${d}s`} calcMode="discrete" repeatCount="indefinite" />{children}</g>;
};

export const Txt = ({x, y, children, c = 'sa-txt', a = 'start', s}: {x: number; y: number; children: ReactNode; c?: string; a?: 'start' | 'middle' | 'end'; s?: number}) => (
  <text className={c} x={x} y={y} textAnchor={a} style={s ? {fontSize: s} : undefined}>{children}</text>
);

// ── 人物 ──────────────────────────────────────────────────────────────
/** 正面站立全身人像，单位高 100，脚底为原点 */
export function Person({x, y, h = 100, coat = true, hairLong = false, face = false, back = false}: {x: number; y: number; h?: number; coat?: boolean; hairLong?: boolean; face?: boolean; back?: boolean}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${h / 100})`}>
      <path className="sa-body" d="M-10.4 -45 L-0.4 -45 L-1.4 -36 L-2.6 -2.8 L-8.6 -2.8 L-9.8 -24 Z" />
      <path className="sa-body" d="M10.4 -45 L0.4 -45 L1.4 -36 L2.6 -2.8 L8.6 -2.8 L9.8 -24 Z" />
      <path className="sa-ink" d="M-9.2 0 C-9.4 -1.6 -8.8 -2.8 -8.4 -2.8 L-2.8 -2.8 C-1.4 -2.4 -0.6 -1 -0.4 0 Z" />
      <path className="sa-ink" d="M9.2 0 C9.4 -1.6 8.8 -2.8 8.4 -2.8 L2.8 -2.8 C1.4 -2.4 0.6 -1 0.4 0 Z" />
      <path className="sa-body" d="M-12 -76.5 C-15 -71 -16.4 -62 -16.6 -52 L-16.2 -45.5 L-13.6 -45.5 L-13.4 -52 C-13.2 -59 -12.4 -65 -11.4 -69 Z" />
      <path className="sa-body" d="M12 -76.5 C15 -71 16.4 -62 16.6 -52 L16.2 -45.5 L13.6 -45.5 L13.4 -52 C13.2 -59 12.4 -65 11.4 -69 Z" />
      <ellipse className="sa-body" cx={-14.9} cy={-43.6} rx={1.8} ry={2.2} />
      <ellipse className="sa-body" cx={14.9} cy={-43.6} rx={1.8} ry={2.2} />
      <path className="sa-body" d={coat
        ? 'M-2.1 -80.6 C-6 -80 -10.5 -79 -12 -76.5 C-12.6 -70 -12 -62 -11.2 -55 L-11 -40 L11 -40 L11.2 -55 C12 -62 12.6 -70 12 -76.5 C10.5 -79 6 -80 2.1 -80.6 Z'
        : 'M-2.1 -80.6 C-6 -80 -10.5 -79 -12 -76.5 C-12.6 -70 -12 -62 -11 -55 L-10.4 -45 L10.4 -45 L11 -55 C12 -62 12.6 -70 12 -76.5 C10.5 -79 6 -80 2.1 -80.6 Z'} />
      <path className="sa-soft" d={coat ? 'M-3.6 -80.2 L0 -73 L3.6 -80.2 M0 -73 L0 -40 M-8 -58 L-4 -58' : 'M-3.6 -80.2 L0 -75 L3.6 -80.2 M-10.4 -47 L10.4 -47'} />
      <path className="sa-body" d="M-2 -84.6 L-2.1 -80.4 L2.1 -80.4 L2 -84.6 Z" />
      <ellipse className="sa-body" cx={0} cy={-90.5} rx={5.6} ry={6.8} />
      <path className="sa-hair" d={hairLong
        ? 'M-6 -90 C-6.8 -98.5 -1 -100.4 1.5 -99.8 C5.8 -99 7 -95 6.2 -90 C6.6 -86 7 -82 6.2 -78.6 C5.4 -82 5.4 -86 4.8 -91 C3 -94.6 -1 -95.6 -4.6 -92.2 C-5.4 -87 -5.4 -82 -6.4 -78.6 C-7 -82 -6.6 -86 -6 -90 Z'
        : 'M-5.9 -91 C-6.6 -98.5 -1 -100 1.5 -99.4 C5.6 -98.6 6.6 -95 5.9 -91.2 C4.6 -94.6 1.6 -95.6 -1.2 -95.2 C-3.6 -94.8 -5.2 -93.4 -5.9 -91 Z'} />
      {back && <path className="sa-hair" d="M0 -97.6 C4.4 -97.6 6 -94 5.8 -90 C5.6 -86.6 4 -84.4 0 -84 C-4 -84.4 -5.6 -86.6 -5.8 -90 C-6 -94 -4.4 -97.6 0 -97.6 Z" />}
      {face && !back && <g>
        <path className="sa-face" d="M-3.3 -92.6 C-2.7 -93.1 -1.6 -93.1 -1 -92.7 M3.3 -92.6 C2.7 -93.1 1.6 -93.1 1 -92.7" />
        <path className="sa-face" d="M-3.2 -91.2 C-2.6 -91.9 -1.5 -91.9 -0.9 -91.2 C-1.5 -90.8 -2.6 -90.8 -3.2 -91.2 Z M3.2 -91.2 C2.6 -91.9 1.5 -91.9 0.9 -91.2 C1.5 -90.8 2.6 -90.8 3.2 -91.2 Z" />
        <circle className="sa-iris" cx={-2.05} cy={-91.3} r={0.36} /><circle className="sa-iris" cx={2.05} cy={-91.3} r={0.36} />
        <circle className="sa-ink" cx={-2.05} cy={-91.3} r={0.15} /><circle className="sa-ink" cx={2.05} cy={-91.3} r={0.15} />
        <path className="sa-face" d="M-3.3 -91.4 L-3.7 -91.8 M-3 -91.7 L-3.3 -92.2 M3.3 -91.4 L3.7 -91.8 M3 -91.7 L3.3 -92.2" />
        <path className="sa-face" d="M-0.1 -90.6 C-0.3 -89.4 -0.7 -88.6 -0.5 -88.3 C-0.2 -88 0.3 -88 0.6 -88.3" />
        <path className="sa-face" d="M-1.5 -86.6 C-0.6 -86.9 0.6 -86.9 1.5 -86.6 C0.6 -86.1 -0.6 -86.1 -1.5 -86.6 Z" />
      </g>}
    </g>
  );
}

/** 侧面行走人像（朝右），单位高 100；walk 给出一步周期秒数 */
export function Walker({x, y, h = 100, walk = 1.1, flip = false}: {x: number; y: number; h?: number; walk?: number; flip?: boolean}) {
  const s = h / 100;
  const swing = (a: number) => <T type="rotate" v={`${a};${-a};${a}`} d={walk} />;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g opacity={0.55}><g transform="translate(0 -45)"><g>{swing(-22)}<g transform="translate(0 45)">
        <path className="sa-body" d="M-4.4 -45 L-3.4 -24 L-3 -3 L2.2 -3 L2.6 -24 L4.4 -45 Z" />
        <path className="sa-ink" d="M-3.2 0 L-3.2 -3 L2.4 -3 C5 -2.6 7.4 -1.6 7.6 0 Z" />
      </g></g></g></g>
      <g opacity={0.55}><g transform="translate(0 -77)"><g>{swing(18)}<g transform="translate(0 77)">
        <path className="sa-body" d="M-2.2 -77 C-2.6 -68 -2.4 -58 -1.6 -50 L1.4 -50 C1.6 -58 2 -68 2.6 -76 Z" />
        <circle className="sa-body" cx={0} cy={-48.4} r={1.9} />
      </g></g></g></g>
      <g transform="translate(0 -45)"><g>{swing(22)}<g transform="translate(0 45)">
        <path className="sa-body" d="M-4.4 -45 L-3.4 -24 L-3 -3 L2.2 -3 L2.6 -24 L4.4 -45 Z" />
        <path className="sa-ink" d="M-3.2 0 L-3.2 -3 L2.4 -3 C5 -2.6 7.4 -1.6 7.6 0 Z" />
      </g></g></g>
      <path className="sa-body" d="M-3.8 -80.6 C-6.4 -78 -7 -70 -6.4 -60 L-5.6 -43 L5.8 -43 L6.4 -60 C7.4 -68 6.8 -77 3.8 -80.6 C1.4 -81.4 -1.6 -81.4 -3.8 -80.6 Z" />
      <path className="sa-body" d="M-0.8 -84.6 L-1 -80.6 L2.6 -80.6 L2.6 -84.6 Z" />
      <path className="sa-body" d="M-5 -92 C-5 -98.5 0 -100 3 -99 C6.4 -97.8 7 -94 6.6 -91.5 L7.8 -89 L6.6 -88.4 C6.8 -86.4 5.6 -84.6 3 -84.4 C-1 -84.2 -5 -87 -5 -92 Z" />
      <path className="sa-hair" d="M-5 -92 C-5.4 -98.6 0 -100.4 3.2 -99.2 C5.2 -98.4 6 -97 6.2 -95.6 C3 -96 0 -94.6 -1.4 -91 C-2.6 -90.4 -4 -90.8 -5 -92 Z" />
      <g transform="translate(0 -77)"><g>{swing(-18)}<g transform="translate(0 77)">
        <path className="sa-body" d="M-2.2 -77 C-2.6 -68 -2.4 -58 -1.6 -50 L1.4 -50 C1.6 -58 2 -68 2.6 -76 Z" />
        <circle className="sa-body" cx={0} cy={-48.4} r={1.9} />
      </g></g></g>
    </g>
  );
}

/** 正面胸像：头心为原点，头高约 40；turn 让五官左右偏移模拟转头（数值序列） */
export function Bust({x, y, s = 1, turn, talk, blink = true, d = D, long = false}: {x: number; y: number; s?: number; turn?: string; talk?: boolean; blink?: boolean; d?: number; long?: boolean}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="sa-body" d="M-7.4 25 C-16 27.4 -30 30 -36 38 C-39.4 44 -40.4 54 -40.6 66 L40.6 66 C40.4 54 39.4 44 36 38 C30 30 16 27.4 7.4 25 Z" />
      <path className="sa-soft" d="M-7.4 25 L0 37 L7.4 25 M-22 31 C-23 40 -24 50 -24.6 66 M22 31 C23 40 24 50 24.6 66" />
      <path className="sa-body" d="M-7 14 L-7.4 26 C-3 29 3 29 7.4 26 L7 14 Z" />
      {long && <path className="sa-hair" d="M-15.4 -2 C-17 10 -18 22 -21 32 C-15 31 -11 28 -9 24 C-12 14 -13 6 -12.6 -2 Z M15.4 -2 C17 10 18 22 21 32 C15 31 11 28 9 24 C12 14 13 6 12.6 -2 Z" />}
      <path className="sa-body" d="M-15 -2 C-18.8 -3.4 -19.4 4.4 -15 6 M15 -2 C18.8 -3.4 19.4 4.4 15 6" />
      <path className="sa-body" d="M0 -21 C9.6 -21 15 -13 15 -2 C15 9 10 18.6 0 19.6 C-10 18.6 -15 9 -15 -2 C-15 -13 -9.6 -21 0 -21 Z" />
      <g>
        {turn && <T type="translate" v={turn} d={d} />}
        <path className="sa-line" d="M-10.4 -6 C-8.4 -7.8 -5.2 -7.8 -3.4 -6.6 M10.4 -6 C8.4 -7.8 5.2 -7.8 3.4 -6.6" />
        <g>
          {blink && <T type="scale" v="1 1;1 1;1 .1;1 1;1 1" kt="0;.46;.48;.5;1" d={d} ease={false} />}
          <path className="sa-line" d="M-9.8 -1.2 C-8.2 -3.2 -5 -3.2 -3.6 -1.2 C-5 -0.2 -8.2 -0.2 -9.8 -1.2 Z M9.8 -1.2 C8.2 -3.2 5 -3.2 3.6 -1.2 C5 -0.2 8.2 -0.2 9.8 -1.2 Z" />
          <circle className="sa-ink" cx={-6.7} cy={-1.5} r={1.15} /><circle className="sa-ink" cx={6.7} cy={-1.5} r={1.15} />
        </g>
        <path className="sa-soft" d="M-0.4 -1 C-0.8 3.4 -2.4 6 -2.2 7.4 C-1 8.3 1 8.3 2.2 7.4" />
        <path className="sa-line" d="M-4.6 12.2 C-2 11.3 2 11.3 4.6 12.2">
          {talk && <A a="d" v="M-4.6 12.2 C-2 11.3 2 11.3 4.6 12.2;M-4.2 11.6 C-2 10.6 2 10.6 4.2 11.6;M-4.6 12.2 C-2 11.3 2 11.3 4.6 12.2" d={0.42} />}
        </path>
        <path className="sa-soft" d="M-4.6 12.2 C-2 13.6 2 13.6 4.6 12.2">
          {talk && <A a="d" v="M-4.6 12.2 C-2 13.6 2 13.6 4.6 12.2;M-4.2 11.6 C-2 16.4 2 16.4 4.2 11.6;M-4.6 12.2 C-2 13.6 2 13.6 4.6 12.2" d={0.42} />}
        </path>
      </g>
      <path className="sa-hair" d="M-15.6 -1 C-17 -16 -8 -24.6 1 -24.2 C11 -23.8 17 -15 15.6 -1 C14 -8 10.6 -12.6 5 -14.2 C1 -11 -6 -9.6 -12 -10.6 C-14 -7.8 -15 -4.6 -15.6 -1 Z" />
    </g>
  );
}

/** 背影胸像（过肩前景用） */
export function BackHead({x, y, s = 1}: {x: number; y: number; s?: number}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="sa-body" d="M-9 20 C-18 25 -34 29 -42 39 C-46 47 -47 60 -47 74 L47 74 C47 60 46 47 42 39 C34 29 18 25 9 20 Z" />
      <path className="sa-soft" d="M-9 22 C-4 25 4 25 9 22 M-26 31 C-27 44 -28 58 -28 74" />
      <path className="sa-body" d="M-15.4 -1 C-18.6 -2 -19 5 -15 6.4" />
      <path className="sa-hair" d="M0 -23 C10.6 -23 16.6 -14 16.4 -2 C16.2 8 13 15 8.6 20.6 C3 22.4 -3 22.4 -8.6 20.6 C-13 15 -16.2 8 -16.4 -2 C-16.6 -14 -10.6 -23 0 -23 Z" />
      <path className="sa-faint" d="M-3 -20 C-8 -12 -10 0 -9 14 M4 -20 C8 -10 9 2 7 15 M0 -22 C-1 -10 -1 4 0 18" />
    </g>
  );
}

// ── 环境 ──────────────────────────────────────────────────────────────
const rnd = (seed: number) => () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

/** 城市天际线，带窗格 */
export function Skyline({x, w, base, seed = 3, hMin = 26, hMax = 78, lit = 0.28}: {x: number; w: number; base: number; seed?: number; hMin?: number; hMax?: number; lit?: number}) {
  const r = rnd(seed);
  const out: ReactNode[] = [];
  let cx = x, i = 0;
  while (cx < x + w) {
    const bw = 12 + Math.round(r() * 20), bh = hMin + Math.round(r() * (hMax - hMin));
    const top = base - bh;
    out.push(<rect key={`b${i}`} className="sa-bld" x={cx} y={top} width={bw} height={bh} />);
    if (r() > 0.6) out.push(<path key={`a${i}`} className="sa-soft" d={`M${cx + bw / 2} ${top} L${cx + bw / 2} ${top - 6 - r() * 8}`} />);
    for (let wy = top + 5; wy < base - 4; wy += 6) for (let wx = cx + 3; wx < cx + bw - 3; wx += 4.5)
      if (r() < lit) out.push(<rect key={`w${i}-${wx}-${wy}`} className="sa-win" x={wx} y={wy} width={1.8} height={2.4} />);
    cx += bw + 1 + Math.round(r() * 3); i++;
  }
  return <g>{out}</g>;
}

/** 层叠山脊 */
export function Ridge({y, w = W, x = 0, amp = 18, seed = 2, c = 'sa-hill', step = 22}: {y: number; w?: number; x?: number; amp?: number; seed?: number; c?: string; step?: number}) {
  const r = rnd(seed);
  let d = `M${x} ${y}`;
  for (let px = x; px <= x + w; px += step) d += ` L${px} ${y - r() * amp}`;
  d += ` L${x + w} ${y + 200} L${x} ${y + 200} Z`;
  return <path className={c} d={d} />;
}

export function Tree({x, y, s = 1}: {x: number; y: number; s?: number}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="sa-body" d="M-1.6 0 L-1.2 -16 L1.2 -16 L1.6 0 Z" />
      <path className="sa-body" d="M0 -44 C9 -44 13 -36 12 -29 C16 -26 15 -17 8 -15.6 C4 -13 -4 -13 -8 -15.6 C-15 -17 -16 -26 -12 -29 C-13 -36 -9 -44 0 -44 Z" />
      <path className="sa-soft" d="M0 -16 L0 -26 M0 -22 L-5 -27 M0 -24 L5 -30" />
    </g>
  );
}

export function Lamp({x, y, s = 1}: {x: number; y: number; s?: number}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="sa-line" d="M0 0 L0 -60 C0 -66 4 -68 9 -68 M-3 0 L3 0" />
      <path className="sa-body" d="M5 -68 L13 -68 L12 -64 L6 -64 Z" />
      <circle className="sa-glow" cx={9} cy={-62} r={4} />
    </g>
  );
}

export function Chair({x, y, s = 1}: {x: number; y: number; s?: number}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="sa-line" d="M-8 0 L-8 -16 L8 -16 L8 0 M-8 -16 L-8 -38 L-6 -38 M8 -16 L8 -38 L6 -38 M-8 -24 L8 -24 M-8 -32 L8 -32 M-10 -16 L10 -16" />
    </g>
  );
}

export function Table({x, y, w = 60, s = 1, cup = true}: {x: number; y: number; w?: number; s?: number; cup?: boolean}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="sa-body" d={`M${-w / 2} -26 L${w / 2} -26 L${w / 2} -23 L${-w / 2} -23 Z`} />
      <path className="sa-line" d={`M${-w / 2 + 4} -23 L${-w / 2 + 4} 0 M${w / 2 - 4} -23 L${w / 2 - 4} 0`} />
      {cup && <><path className="sa-body" d="M-4 -26 L-3.4 -34 L3.4 -34 L4 -26 Z" /><path className="sa-line" d="M3.6 -32 C7 -32 7 -28 3.8 -28" /></>}
    </g>
  );
}

/** 地面透视线，消失点 (vx,vy)，从 y0 铺到画面底 */
export function Floor({vx = W / 2, vy, y0, n: k = 9, spread = 1.4, rows = 5}: {vx?: number; vy: number; y0: number; n?: number; spread?: number; rows?: number}) {
  const lines: ReactNode[] = [];
  for (let i = 0; i < k; i++) {
    const t = i / (k - 1) - 0.5;
    lines.push(<path key={`r${i}`} className="sa-faint" d={`M${vx + t * 20} ${y0} L${vx + t * W * spread * 1.6} ${H + 40}`} />);
  }
  for (let j = 1; j <= rows; j++) {
    const yy = y0 + (H + 20 - y0) * Math.pow(j / rows, 1.8);
    lines.push(<path key={`c${j}`} className="sa-faint" d={`M-40 ${yy} L${W + 40} ${yy}`} />);
  }
  void vy;
  return <g>{lines}</g>;
}

/** 太阳/月亮 */
export const Sun = ({x, y, r = 12}: {x: number; y: number; r?: number}) => (
  <g><circle className="sa-sunf" cx={x} cy={y} r={r} /><circle className="sa-faint" cx={x} cy={y} r={r + 5} /></g>
);

// ── 机位示意 ──────────────────────────────────────────────────────────
/** 俯视摄像机：机身 + 镜头，默认朝上（-y）；fov 为视角张开的半角 */
export function CamTop({fov = 24, len = 26, wedge = true}: {fov?: number; len?: number; wedge?: boolean}) {
  const r = (fov * Math.PI) / 180;
  return (
    <g>
      {wedge && <path className="sa-fov" d={`M0 -4 L${-Math.tan(r) * len} ${-4 - len} L${Math.tan(r) * len} ${-4 - len} Z`} />}
      <rect className="sa-cam" x={-3.6} y={-1} width={7.2} height={8} rx={1} />
      <rect className="sa-cam" x={-2.2} y={-4.4} width={4.4} height={3.6} rx={0.6} />
    </g>
  );
}

/** 侧视摄像机，朝右 */
export function CamSide({x, y, s = 1, rot = 0}: {x: number; y: number; s?: number; rot?: number}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect className="sa-cam" x={-9} y={-6} width={13} height={10} rx={1.4} />
      <path className="sa-cam" d="M4 -3.4 L10 -5 L10 3 L4 1.4 Z" />
      <circle className="sa-cam" cx={-6} cy={-9} r={3} /><circle className="sa-cam" cx={0} cy={-9} r={3} />
    </g>
  );
}

/** 左上角小窗：机位俯视图或侧视图 */
export function Inset({label = '机位 · 俯视', children, w = 84, h = 58}: {label?: string; children: ReactNode; w?: number; h?: number}) {
  return (
    <g transform="translate(10 10)">
      <rect className="sa-panel" x={0} y={0} width={w} height={h} rx={3} />
      <Txt x={5} y={9} s={6}>{label}</Txt>
      <svg x={0} y={0} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>{children}</svg>
    </g>
  );
}

/** 俯视图里的被摄主体 */
export const Subj = ({x, y, r = 3.4}: {x: number; y: number; r?: number}) => (
  <g><circle className="sa-subj" cx={x} cy={y} r={r} /><circle className="sa-faint" cx={x} cy={y} r={r + 2.6} /></g>
);

/** 取景框四角 */
export function Corners({x, y, w, h, c = 'sa-acc', k = 8}: {x: number; y: number; w: number; h: number; c?: string; k?: number}) {
  return <path className={c} d={`M${x} ${y + k} L${x} ${y} L${x + k} ${y} M${x + w - k} ${y} L${x + w} ${y} L${x + w} ${y + k} M${x + w} ${y + h - k} L${x + w} ${y + h} L${x + w - k} ${y + h} M${x + k} ${y + h} L${x} ${y + h} L${x} ${y + h - k}`} />;
}

/** 时间轴：剪辑块 + 播放头 */
export function Timeline({y = 162, x0 = 24, x1 = 296, cuts, d = D, label}: {y?: number; x0?: number; x1?: number; cuts: number[]; d?: number; label?: string}) {
  const w = x1 - x0;
  const xs = [0, ...cuts, 1];
  return (
    <g>
      <rect className="sa-panel" x={x0 - 6} y={y - 9} width={w + 12} height={18} rx={3} />
      {xs.slice(0, -1).map((t, i) => (
        <rect key={i} className={i % 2 ? 'sa-clip2' : 'sa-clip'} x={x0 + t * w + 0.8} y={y - 4} width={Math.max(0.6, (xs[i + 1] - t) * w - 1.6)} height={8} rx={1} />
      ))}
      <g><T type="translate" v={`0 0;${w} 0`} d={d} ease={false} /><path className="sa-acc" d={`M${x0} ${y - 8} L${x0} ${y + 8}`} /></g>
      {label && <Txt x={x0} y={y - 12} s={6}>{label}</Txt>}
    </g>
  );
}

/** 共用滤镜：每个 svg 一份，id 用 u 前缀避免页面内冲突 */
export function Defs({u}: {u: string}) {
  return (
    <defs>
      <filter id={`${u}-b1`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.2" /></filter>
      <filter id={`${u}-b3`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" /></filter>
      <filter id={`${u}-glow`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      <linearGradient id={`${u}-v`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".55" /></linearGradient>
      <radialGradient id={`${u}-vig`} cx=".5" cy=".5" r=".75"><stop offset=".55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".75" /></radialGradient>
    </defs>
  );
}
