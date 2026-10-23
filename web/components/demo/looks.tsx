// 流派 / 风格：每条画一个带签名动作的小场景——不是讲技法关系，而是让人一眼认出「这就是那种片子」。
import type {ReactNode} from 'react';
import {A, Bust, D, type Demo, Mv, Op, Person, Ridge, Ro, Sc, Show, Skyline, T, Table, Tree, Txt, W, Walker} from './kit';

const seq = (a: string | number, b: string | number) => `${a};${a};${b};${b};${a};${a}`;
const K = '0;.12;.5;.9;.95;1';

const Rain = ({n = 24, c = 'sa-rain'}: {n?: number; c?: string}) => <>{Array.from({length: n}, (_, i) => <path key={i} className={c} d={`M${(i * 37) % 330} 0 l-5 18`}><T type="translate" v="0 -30;0 200" d={0.7 + (i % 4) * 0.12} ease={false} begin={`${-i * 0.09}s`} /></path>)}</>;
const Hat = ({x, y, s = 1}: {x: number; y: number; s?: number}) => <path className="sa-body" transform={`translate(${x} ${y}) scale(${s})`} d="M-13 0 C-8 -1 8 -1 13 0 C10 2 -10 2 -13 0 Z M-7 -0.6 C-7 -9 7 -9 7 -0.6 Z" />;

function Cyber({street = false}: {street?: boolean}) {
  return <g>
    <rect className="sa-dark" x={0} y={0} width={W} height={180} />
    <rect x={0} y={0} width={W} height={180} fill="rgba(80,20,120,.18)" />
    <Skyline x={-20} w={360} base={150} seed={41} hMin={70} hMax={150} lit={0.45} />
    <g className="sa-neonglow">
      <path className="sa-neon1" d="M40 60 L40 110 M34 60 L46 60 M34 74 L46 74 M34 88 L46 88"><A a="opacity" v="1;1;.2;1;1" kt="0;.6;.62;.66;1" d={2.6} discrete /></path>
      <rect className="sa-neon2" x={226} y={40} width={44} height={22} rx={3}><A a="opacity" v="1;.3;1;1" kt="0;.1;.14;1" d={3.4} discrete /></rect>
      <path className="sa-neon2" d="M234 51 L262 51" />
      <path className="sa-neon1" d="M280 80 L280 130 M276 84 L284 84 M276 96 L284 96" />
    </g>
    <g><T type="translate" v="-60 0;380 0" d={4} ease={false} /><path className="sa-body" d="M0 46 L22 42 L30 46 L22 50 L0 50 Z" /><path className="sa-neon2" d="M-40 47 L0 47" opacity={0.6} /></g>
    <rect className="sa-holo" x={120} y={30} width={50} height={64}><A a="opacity" v=".5;.8;.4;.7;.5" d={1.4} /></rect>
    {Array.from({length: 10}, (_, i) => <path key={i} className="sa-neon2" d={`M120 ${34 + i * 6} L170 ${34 + i * 6}`} opacity={0.25} />)}
    <path className="sa-line" d="M0 150 L320 150" />
    <rect x={0} y={150} width={W} height={30} fill="rgba(255,79,168,.06)" />
    {street ? <><Person x={150} y={166} h={70} hairLong /><path className="sa-body" d="M122 104 C130 86 170 86 178 104 Z" /><path className="sa-line" d="M150 104 L150 140" /></> : <Person x={150} y={162} h={56} />}
    <Rain n={28} c="sa-rain2" />
  </g>;
}

function Ink({seal = false}: {seal?: boolean}) {
  const strokes = ['M10 120 C40 70 60 60 80 80 C96 50 116 40 140 70 C160 90 170 100 190 110', 'M150 130 C180 90 200 70 226 84 C246 60 270 54 300 90 C310 104 316 112 320 118', 'M0 150 C80 140 200 146 320 140'];
  return <g>
    <rect x={0} y={0} width={W} height={180} fill="#ebe5d8" />
    {strokes.map((d, i) => <path key={i} d={d} fill="none" stroke="#1d1d1d" strokeWidth={i === 2 ? 1 : 2.2} strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420} opacity={0.85 - i * 0.15}><A a="stroke-dashoffset" kt={`0;${0.06 + i * 0.12};${0.36 + i * 0.12};.9;.95;1`} v={seq(420, 0)} /></path>)}
    <Op kt="0;.2;.55;.9;.95;1" v={seq(0, 0.5)}><path d="M20 120 C50 80 70 74 82 90 C100 64 118 56 136 80 C150 96 170 106 190 116 L190 150 L20 150 Z" fill="#4a4a48" opacity={0.35} /><path d="M160 134 C190 100 206 84 228 96 C250 74 272 70 300 100 L310 150 L160 150 Z" fill="#2a2a28" opacity={0.3} /></Op>
    <g><T type="translate" v="60 0;180 0" d={D * 2} ease={false} /><path d="M0 146 C6 150 22 150 28 146 Z M14 146 L14 136" fill="none" stroke="#1d1d1d" strokeWidth={1} /></g>
    {[0, 1, 2].map((i) => <path key={i} d={`M${230 + i * 12} ${30 + i * 4} q4 -3 8 0`} fill="none" stroke="#1d1d1d" strokeWidth={0.8}><T type="translate" v="0 0;-30 6" d={6 + i} ease={false} /></path>)}
    {seal && <Op kt="0;.6;.66;.9;.95;1" v={seq(0, 1)}><rect x={278} y={20} width={22} height={22} fill="#b8322a" /><path d="M283 25 L295 25 M289 25 L289 37 M283 31 L295 31" stroke="#ebe5d8" strokeWidth={1.2} /></Op>}
  </g>;
}

/** 手绘：同一个角色 3 套略有差异的线条，按 8 帧/秒轮换 */
function Boil() {
  const j = (k: number) => (i: number) => +(Math.sin(i * 1.7 + k * 2.3) * 1.4).toFixed(1);
  const body = (k: number) => {
    const o = j(k);
    return `M${150 + o(1)} ${70 + o(2)} C${130 + o(3)} ${70} ${126 + o(4)} ${100} ${130} ${130 + o(5)} L${190 + o(6)} ${130} C${194} ${100 + o(7)} ${190 + o(8)} ${70} ${170} ${70 + o(9)} Z`;
  };
  const head = (k: number) => { const o = j(k + 3); return `M${160 + o(1)} ${30} C${182 + o(2)} ${30} ${186} ${58 + o(3)} ${160} ${66 + o(4)} C${134 + o(5)} ${58} ${138 + o(6)} ${30} ${160 + o(1)} ${30} Z`; };
  return <g>
    <rect x={0} y={0} width={W} height={180} fill="#f1ece0" />
    <path d="M0 140 C80 134 240 138 320 132" fill="none" stroke="#2c2a26" strokeWidth={1.2}><A a="d" v="M0 140 C80 134 240 138 320 132;M0 141 C80 135 240 137 320 133;M0 139 C80 133 240 139 320 131" d={0.375} discrete /></path>
    <g fill="#f6c76a" stroke="#2c2a26" strokeWidth={1.6} strokeLinejoin="round">
      <path d={body(0)}><A a="d" v={`${body(0)};${body(1)};${body(2)}`} d={0.375} discrete /></path>
      <path d={head(0)} fill="#fbe6c4"><A a="d" v={`${head(0)};${head(1)};${head(2)}`} d={0.375} discrete /></path>
    </g>
    <g stroke="#2c2a26" strokeWidth={1.6} fill="none" strokeLinecap="round">
      <circle cx={152} cy={46} r={1.8} fill="#2c2a26" /><circle cx={168} cy={46} r={1.8} fill="#2c2a26" />
      <path d="M152 56 C156 60 164 60 168 56" />
      <path d="M130 130 L126 138 M190 130 L194 138" />
      <g><Ro cx={186} cy={84} v="-20;30;-20" d={1.2} ease={false}><path d="M186 84 L214 64" /></Ro></g>
      <path d="M134 84 L114 104" />
    </g>
    <Txt x={300} y={168} a="end" s={7} c="sa-txt-ink">12 张 / 秒 · 线条在「抖」</Txt>
  </g>;
}

function Clay() {
  const steps = '0 0;0 -6;0 -12;0 -14;0 -12;0 -6;0 0;0 0';
  return <g>
    <rect x={0} y={0} width={W} height={180} fill="#3a3229" />
    <path d="M0 140 L320 140 L320 180 L0 180 Z" fill="#6b5a44" />
    {[[30, 150], [80, 162], [240, 156], [290, 168]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q6 -4 12 0`} fill="none" stroke="#86735a" strokeWidth={1} />)}
    <Tree x={270} y={140} s={1.1} />
    <g><T type="translate" v={steps} d={1.2} discrete />
      <g transform="translate(150 140)"><g><T type="scale" v="1.1 .88;1 1;.94 1.08;.92 1.1;.94 1.08;1 1;1.1 .88;1.1 .88" d={1.2} discrete />
        <path d="M-26 0 C-30 -30 -18 -54 0 -54 C18 -54 30 -30 26 0 Z" fill="#d8724a" stroke="#4a2a1a" strokeWidth={1.2} />
        <path d="M-12 -40 q3 -2 6 0 M-14 -20 q4 -3 8 0 M10 -14 q4 -2 7 1" fill="none" stroke="#a8502e" strokeWidth={0.8} />
        <circle cx={-8} cy={-34} r={4.6} fill="#f6f0e4" stroke="#4a2a1a" /><circle cx={9} cy={-34} r={4.6} fill="#f6f0e4" stroke="#4a2a1a" />
        <circle cx={-7} cy={-33} r={1.8} fill="#1a1a1a" /><circle cx={10} cy={-33} r={1.8} fill="#1a1a1a" />
        <path d="M-6 -22 C-2 -18 4 -18 8 -22" fill="none" stroke="#4a2a1a" strokeWidth={1.2} />
      </g></g>
    </g>
    <ellipse cx={150} cy={142} rx={26} ry={4} fill="rgba(0,0,0,.35)" />
    <Txt x={300} y={170} a="end" s={7} c="sa-txt">12 格 / 秒 · 一格一捏</Txt>
  </g>;
}

function Toon3D({u}: {u: string}) {
  const kt = '0;.35;.45;.55;1';
  return <g>
    <defs>
      <radialGradient id={`${u}-ball`} cx=".35" cy=".3" r=".75"><stop offset="0" stopColor="#ffd9a8" /><stop offset=".55" stopColor="#f08a4a" /><stop offset="1" stopColor="#8a3a20" /></radialGradient>
      <linearGradient id={`${u}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7cc4f0" /><stop offset="1" stopColor="#d8f0ff" /></linearGradient>
    </defs>
    <rect x={0} y={0} width={W} height={180} fill={`url(#${u}-sky)`} />
    <path d="M0 140 C80 128 240 128 320 140 L320 180 L0 180 Z" fill="#7cc46a" />
    <path d="M0 140 C80 128 240 128 320 140" fill="none" stroke="#4a8a44" strokeWidth={1} />
    <ellipse cx={160} cy={141} rx={30} ry={5} fill="rgba(0,40,0,.3)"><A a="rx" v="14;14;32;14;14" kt={kt} d={1.4} /></ellipse>
    <g><T type="translate" v="160 50;160 112;160 116;160 112;160 50" kt={kt} d={1.4} ease=".4 0 .9 .6;.2 .6 .4 1;.4 0 .6 1;.1 .4 .5 1" />
      <g><T type="scale" v="0.92 1.1;1 1;1.22 .8;1 1;.92 1.1" kt={kt} d={1.4} ease={false} />
        <circle cx={0} cy={-2} r={22} fill={`url(#${u}-ball)`} />
        <ellipse cx={-7} cy={-6} rx={3.2} ry={4.4} fill="#fff" /><ellipse cx={7} cy={-6} rx={3.2} ry={4.4} fill="#fff" />
        <circle cx={-6} cy={-5} r={1.8} fill="#1a1a1a" /><circle cx={8} cy={-5} r={1.8} fill="#1a1a1a" />
        <path d="M-5 6 C-2 9 4 9 7 6" fill="none" stroke="#5a2010" strokeWidth={1.2} strokeLinecap="round" />
      </g>
    </g>
  </g>;
}

function Splash() {
  const flat = 'M110 130 C130 130 140 130 150 130 C155 130 165 130 170 130 C180 130 190 130 210 130';
  const crown = 'M110 130 C130 128 138 98 146 92 C150 104 158 104 162 90 C168 102 174 102 178 92 C184 100 190 128 210 130';
  const kt = '0;.3;.75;.9;1';
  return <g>
    <rect className="sa-dark" x={0} y={0} width={W} height={180} />
    <rect x={0} y={130} width={W} height={50} fill="#d8d4cc" opacity={0.85} />
    <path d="M110 130 L210 130" fill="none" stroke="#f2efe9" strokeWidth={0.6} />
    <circle cx={160} cy={20} r={6} fill="#f2efe9"><A a="cy" v="10;126;126;126;10" kt={kt} ease={false} d={6} /><A a="opacity" v="1;1;0;0;1" kt={kt} d={6} discrete /></circle>
    <path d={flat} fill="#ebe7df" stroke="#fff" strokeWidth={0.8}><A a="d" v={`${flat};${flat};${crown};${flat};${flat}`} kt={kt} d={6} /></path>
    {[146, 162, 178].map((x, i) => <circle key={x} cx={x} cy={90} r={2.4} fill="#f2efe9"><A a="cy" v="130;130;76;100;130" kt={kt} d={6} /><A a="opacity" v="0;0;1;0;0" kt={kt} d={6} /><T type="translate" v={`0 0;0 0;${(i - 1) * 8} 0;${(i - 1) * 14} 0;0 0`} kt={kt} d={6} /></circle>)}
    <Txt x={300} y={20} a="end" s={7} c="sa-txt sa-txt-acc">1000 fps · 实际 0.02 秒</Txt>
  </g>;
}

function Strip({children, u}: {children: ReactNode; u: string}) {
  return <g>
    <rect className="sa-dark" x={0} y={0} width={W} height={180} />
    <g><T type="translate" v="0 0;0.8 -0.6;-0.6 0.5;0.4 0.8;0 0" d={0.5} discrete />
      <g transform="translate(36 8) scale(.775 .91)">{children}</g>
    </g>
    <rect x={36} y={8} width={248} height={164} fill="rgba(210,150,70,.12)" />
    <rect x={36} y={8} width={248} height={164} fill={`url(#sa-vig)`} />
    <rect x={0} y={0} width={W} height={180} filter={`url(#${u}-gr2)`} opacity={0.35} />
    <defs><filter id={`${u}-gr2`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="1"><A a="seed" v="1;2;3;4" d={0.33} discrete /></feTurbulence><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 .95  0 0 0 0 .85  0 0 0 3 -1.9" /></filter></defs>
    {[0, 284].map((x) => <g key={x}><T type="translate" v="0 0;0 24" d={0.5} ease={false} />{Array.from({length: 9}, (_, i) => <rect key={i} x={x + 12} y={-24 + i * 24} width={12} height={14} rx={2} fill="#1a1a1a" stroke="rgba(255,255,255,.18)" strokeWidth={0.5} />)}</g>)}
  </g>;
}

export const looks: Record<string, Demo> = {
  // 流派（视频）
  'genre-cyberpunk': {note: '高楼挤满画面、霓虹招牌一闪一闪、全息广告在雨里发光、飞车拖着光尾划过——赛博朋克就是「高科技、低生活」的夜。', art: () => <Cyber />},
  'genre-wuxia': {
    note: '竹林随风摇摆，一道人影踩着弧线腾空掠过，衣袂拖出残影，竹叶纷纷落下——武侠的轻功与写意。',
    art: () => <g>
      <rect x={0} y={0} width={W} height={180} fill="#1a2420" />
      {[30, 70, 100, 210, 250, 290].map((x, i) => <Ro key={x} cx={x} cy={180} v={`${-1.5 - i % 2};${1.5 + i % 2};${-1.5 - i % 2}`} d={3 + i * 0.3}>
        <path className="sa-bamboo" d={`M${x} 180 L${x} -10`} />
        {[30, 70, 110, 150].map((y) => <path key={y} className="sa-faint" d={`M${x - 3} ${y} L${x + 3} ${y}`} />)}
        <path className="sa-leaf" d={`M${x} ${40 + i * 6} q14 -4 22 4 q-12 2 -22 -4 Z M${x} ${80 + i * 4} q-14 -4 -22 4 q12 2 22 -4 Z`} />
      </Ro>)}
      <g><animateMotion dur="3s" repeatCount="indefinite" path="M-30 150 C60 20 220 20 360 140" rotate="auto" />
        <g transform="rotate(-10)"><path className="sa-trail" d="M-60 0 C-40 -6 -20 -4 -4 0" /><Walker x={0} y={22} h={46} walk={0.4} /><path className="sa-acc" d="M4 -2 L26 -16" /></g>
      </g>
      {[0, 1, 2, 3, 4].map((i) => <path key={i} className="sa-leaf" d="M0 0 q5 -2 8 2 q-5 1 -8 -2 Z"><T type="translate" v={`${40 + i * 60} -10;${20 + i * 60} 190`} d={4 + i * 0.7} ease={false} begin={`${-i}s`} /></path>)}
    </g>,
  },
  'genre-western': {
    note: '烈日下的荒原，平顶山一字排开，风滚草滚过画面，戴牛仔帽的人影一动不动——西部片的辽阔、干燥与对峙。',
    art: () => <g>
      <rect x={0} y={0} width={W} height={180} fill="#3a2418" />
      <circle cx={240} cy={50} r={22} fill="#f6c46a" opacity={0.9} />
      <path d="M0 112 L30 112 L36 86 L84 86 L90 112 L170 112 L176 96 L206 96 L212 112 L320 112 L320 180 L0 180 Z" fill="#5a3420" stroke="rgba(255,220,180,.3)" strokeWidth={0.6} />
      <path d="M0 140 L320 140" stroke="rgba(255,220,180,.25)" strokeWidth={0.6} />
      <Person x={66} y={156} h={62} /><Hat x={66} y={100.5} s={0.95} />
      <g><T type="translate" v="360 150;-40 150" d={5} ease={false} /><Ro cx={0} cy={0} v="0;-720" d={5} ease={false}><circle r={10} fill="none" stroke="#d8b080" strokeWidth={0.8} /><path d="M-8 -4 C0 4 4 -8 8 2 M-6 6 C0 -4 6 6 4 -8 M-9 2 L9 -2" fill="none" stroke="#d8b080" strokeWidth={0.6} /></Ro></g>
      <g opacity={0.25}><T type="translate" v="0 0;0 -2;0 0" d={0.8} /><path d="M0 118 q20 -2 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#f6c46a" /></g>
    </g>,
  },
  'genre-sci-fi-hard': {
    note: '巨大的行星弧面占据画面下方，飞船以真实的慢速掠过，舱段、太阳能板和抬头数据都很具体——硬科幻讲究「物理上可信」。',
    art: () => <g>
      <rect className="sa-dark" x={0} y={0} width={W} height={180} />
      <g><T type="translate" v="0 0;-30 0" d={D * 2} ease={false} />{Array.from({length: 40}, (_, i) => <circle key={i} className="sa-subj" cx={(i * 47) % 360} cy={(i * 29) % 120} r={i % 7 === 0 ? 0.9 : 0.5} opacity={0.6} />)}</g>
      <ellipse cx={160} cy={330} rx={300} ry={200} fill="#13202c" stroke="#5aa0d0" strokeWidth={0.8} />
      <ellipse cx={160} cy={330} rx={304} ry={204} fill="none" stroke="#5aa0d0" strokeWidth={4} opacity={0.15} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${-20 + i * 40} ${150 + i * 6} C80 ${140 + i * 6} 240 ${140 + i * 6} 340 ${150 + i * 6}`} fill="none" stroke="#5aa0d0" strokeWidth={0.4} opacity={0.4} />)}
      <g><T type="translate" v="-80 0;380 0" d={D * 2} ease={false} /><g transform="translate(0 70)">
        <rect className="sa-body" x={-30} y={-6} width={44} height={12} rx={3} /><rect className="sa-body" x={14} y={-4} width={14} height={8} rx={2} /><path className="sa-body" d="M28 -3 L36 0 L28 3 Z" />
        <rect className="sa-panelv" x={-20} y={-26} width={14} height={18} /><rect className="sa-panelv" x={-20} y={8} width={14} height={18} />
        <path className="sa-faint" d="M-13 -8 L-13 -6 M-13 6 L-13 8 M-20 -17 L-6 -17 M-20 17 L-6 17" />
        <path className="sa-flare" d="M-30 0 L-44 0"><A a="opacity" v=".3;1;.3" d={0.6} /></path>
      </g></g>
      <Txt x={14} y={20} s={6.5} c="sa-txt sa-txt-acc">ALT 412 km · V 7.66 km/s</Txt>
      <Txt x={14} y={30} s={6.5}>ORBIT 92 min</Txt>
    </g>,
  },
  'genre-docu': {
    note: '受访者坐在画面一侧，下方滑出名字条，角落是录制中的红点和时间码，画面轻微手持——观众默认这里说的是真的。',
    art: () => <g>
      <g><T type="translate" v="0 0;1.4 -0.8;-0.8 1;0 0" d={3} /><g transform="translate(160 90) scale(1.06) translate(-160 -90)">
        <rect className="sa-wall" x={0} y={0} width={W} height={180} />
        <rect className="sa-body" x={20} y={20} width={80} height={110} /><path className="sa-faint" d="M20 50 L100 50 M20 80 L100 80 M20 110 L100 110" />
        {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} className="sa-bld" x={24 + c * 19} y={28 + r * 30} width={14} height={20} />))}
        <Bust x={210} y={90} s={1.45} talk />
      </g></g>
      <g><T type="translate" kt="0;.15;.3;.9;.95;1" v={seq('-200 0', '0 0')} /><rect className="sa-lt" x={20} y={128} width={150} height={26} /><rect className="sa-accf" x={20} y={128} width={3} height={26} /><Txt x={30} y={140} s={8} c="sa-txt sa-txt-hi">张师傅</Txt><Txt x={30} y={150} s={6}>修表 32 年 · 受访者</Txt></g>
      <circle className="sa-rec" cx={22} cy={18} r={3}><A a="opacity" v="1;1;0;0" kt="0;.5;.5;1" d={1.2} discrete /></circle>
      <Txt x={30} y={20.5} s={7}>REC</Txt>
      <Txt x={300} y={20.5} a="end" s={7}>00:14:32:08</Txt>
    </g>,
  },
  // 风格（视频）
  'doc-realism': {
    note: '菜市场一角，自然光、不打灯，摊主照常干活、路人从镜头前穿过，画面跟着人轻轻晃——像偶然撞见的真实生活。',
    art: () => <g>
      <g><T type="translate" v="0 0;1.6 -1;-1 1.2;1 0.4;0 0" d={3.4} /><g transform="translate(160 90) scale(1.06) translate(-160 -90)">
        <rect className="sa-wall" x={0} y={0} width={W} height={180} />
        <path className="sa-line" d="M0 40 L320 30" /><path className="sa-faint" d="M0 40 L20 60 L60 44 L100 62 L140 46 L180 64 L220 48 L260 66 L300 50 L320 58" />
        <Table x={190} y={148} w={140} cup={false} />
        {[140, 160, 180, 200, 220, 240].map((x, i) => <circle key={x} className="sa-body" cx={x} cy={118 - (i % 2) * 4} r={7} />)}
        <Person x={196} y={148} h={64} face hairLong />
        <path className="sa-body" d="M160 102 L232 102 L232 120 L160 120 Z" opacity={0.0} />
      </g></g>
      <g><T type="translate" v="-80 0;400 0" d={5} ease={false} /><Walker x={0} y={186} h={120} walk={0.9} /></g>
      <Txt x={300} y={20} a="end" s={7}>自然光 · 不摆拍</Txt>
    </g>,
  },
  'macro-highspeed': {note: '一滴牛奶落进液面，溅起一圈皇冠状的水花，水珠悬在空中——真实只有零点零几秒，被高速摄影拉成好几秒。', art: () => <Splash />},
  'hand-drawn-2d': {note: '角色的轮廓线每一帧都略有不同，看起来像在微微「抖动」，手臂一格一格地挥——这是手绘逐帧动画特有的呼吸感。', art: () => <Boil />},
  claymation: {note: '黏土小人一格一格地跳，动作有明显的顿挫，身上还留着手指捏过的痕迹——定格动画的「笨拙」恰恰是它的魅力。', art: () => <Clay />},
  'stylized-3d': {note: '圆滚滚的角色落地时被压扁、弹起时又被拉长，光影柔和饱满——夸张的挤压拉伸是风格化三维动画的招牌。', art: (u) => <Toon3D u={u} />},
  cyberpunk: {note: '撑伞的人站在雨夜街头，霓虹倒映在湿地上，全息广告和飞车在头顶——霓虹、雨和拥挤，是赛博朋克画面的三件套。', art: () => <Cyber street />},
  'film-16mm': {note: '画面在片门里轻轻跳动，两侧齿孔向下滚，颗粒粗、边角暗、颜色偏暖——16mm 胶片自带的手工感和年代感。', art: (u) => <Strip u={u}><rect className="sa-wall" x={0} y={0} width={W} height={180} /><Ridge y={110} amp={18} seed={6} c="sa-hill2" /><path className="sa-line" d="M0 130 L320 130" /><Tree x={80} y={130} s={1.3} /><Person x={190} y={156} h={78} hairLong face /></Strip>},
  'hk-90s': {
    note: '霓虹招牌下的窄街，人跑过时拖出一串断续的残影（抽帧慢门），整体偏青绿——王家卫式的 90 年代港片味。',
    art: () => <g>
      <rect className="sa-dark" x={0} y={0} width={W} height={180} />
      <rect x={0} y={0} width={W} height={180} fill="rgba(40,140,110,.16)" />
      <Skyline x={-20} w={360} base={130} seed={51} hMin={60} hMax={130} lit={0.4} />
      <g className="sa-neonglow"><rect className="sa-neon1" x={40} y={30} width={26} height={60} rx={2} /><path className="sa-neon1" d="M46 40 L60 40 M46 52 L60 52 M53 40 L53 80 M46 66 L60 66" /><rect className="sa-neon2" x={240} y={40} width={50} height={20} rx={2} /><path className="sa-neon3" d="M250 50 L280 50" /></g>
      <path className="sa-line" d="M0 150 L320 150" />
      {[0, 1, 2, 3].map((k) => <g key={k} opacity={k === 0 ? 1 : 0.5 - k * 0.12}><T type="translate" v="-40 0;0 0;40 0;80 0;120 0;160 0;200 0;240 0;280 0;320 0" d={2.4} discrete begin={`${k * 0.08}s`} /><Walker x={0} y={150} h={76} walk={0.6} /></g>)}
      <Txt x={300} y={170} a="end" s={7} c="sa-txt sa-txt-acc">抽帧 · 慢门拖影</Txt>
    </g>,
  },
  'noir-bw': {
    note: '百叶窗的光一条条切在戴帽男人的脸上，烟雾缓缓升起，黑就是纯黑——黑色电影靠强烈明暗讲道德的灰色。',
    art: (u) => <g>
      <rect x={0} y={0} width={W} height={180} fill="#0a0a0a" />
      <g className="sa-bw"><Bust x={170} y={92} s={2.1} blink={false} /><Hat x={170} y={50} s={2.8} /></g>
      <clipPath id={`${u}-nb`}><rect x={0} y={0} width={W} height={180} /></clipPath>
      <g clipPath={`url(#${u}-nb)`}><g><T type="translate" v="0 -8;0 8;0 -8" d={8} />{Array.from({length: 10}, (_, i) => <path key={i} d={`M-20 ${10 + i * 18} L340 ${-30 + i * 18} L340 ${-22 + i * 18} L-20 ${18 + i * 18} Z`} fill="rgba(255,255,255,.22)" />)}</g></g>
      {[0, 1, 2].map((i) => <path key={i} d="M120 140 C110 120 130 110 120 90 C112 74 128 64 120 46" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={1}><T type="translate" v={`0 ${10 + i * 6};${i * 4 - 4} -20`} d={4} ease={false} begin={`${-i * 1.3}s`} /><A a="opacity" v="0;.8;0" d={4} begin={`${-i * 1.3}s`} /></path>)}
      <path d="M100 150 L126 142" stroke="#ddd" strokeWidth={2} /><circle cx={126} cy={142} r={1.6} fill="#ff6a3a" />
    </g>,
  },
  'ink-wash': {note: '山的轮廓一笔一笔被画出来，墨色在纸上慢慢洇开，一叶小舟漂过留白的江面——水墨讲的是笔意和留白。', art: () => <Ink />},

  // 流派（图片）
  'img-genre-pixel': {
    note: '画面被拆成一个个看得见的方格，角色只有两三帧来回切换着走路，金币一闪一闪——像素画的「颗粒」就是它的语言。',
    art: (u) => {
      const P = 8;
      const sprite = (frame: number) => {
        const rows = frame === 0
          ? ['..XXXX..', '.XXXXXX.', '.XoXXoX.', '.XXXXXX.', '..XXXX..', '.YYYYYY.', 'YYYYYYYY', '.YY..YY.', '.BB..BB.']
          : ['..XXXX..', '.XXXXXX.', '.XoXXoX.', '.XXXXXX.', '..XXXX..', '.YYYYYY.', 'YYYYYYYY', '..YYYY..', '.BB.BB..'];
        const col: Record<string, string> = {X: '#f2c79a', o: '#1a1a1a', Y: '#4a7ae0', B: '#5a3a20'};
        return rows.flatMap((r, y) => [...r].map((c, x) => c === '.' ? null : <rect key={`${x}${y}`} x={x * P} y={y * P} width={P} height={P} fill={col[c]} />));
      };
      return <g>
        <rect x={0} y={0} width={W} height={180} fill="#5ab0e8" />
        {[0, 1, 2].map((i) => <rect key={i} x={30 + i * 100} y={30 + (i % 2) * 16} width={40} height={8} fill="#fff" />)}
        {Array.from({length: 40}, (_, i) => <rect key={i} x={i * 8} y={148} width={8} height={32} fill={i % 2 ? '#3a9a4a' : '#44a854'} />)}
        <rect x={0} y={148} width={W} height={4} fill="#2a7a3a" />
        <g><T type="translate" v="-60 76;340 76" d={8} discrete={false} ease={false} />
          <Show t0={0} t1={0.5} d={0.4}><g>{sprite(0)}</g></Show><Show t0={0.5} t1={1} d={0.4}><g>{sprite(1)}</g></Show>
        </g>
        {[120, 200, 260].map((x) => <g key={x}><rect x={x} y={110} width={8} height={12} fill="#ffd23a"><A a="width" v="8;8;2;8" kt="0;.5;.75;1" d={0.8} discrete /></rect></g>)}
        <defs><pattern id={`${u}-px`} width="8" height="8" patternUnits="userSpaceOnUse"><path d="M8 0 L0 0 L0 8" fill="none" stroke="rgba(0,0,0,.12)" strokeWidth={0.5} /></pattern></defs>
        <rect x={0} y={0} width={W} height={180} fill={`url(#${u}-px)`} />
      </g>;
    },
  },
  'img-genre-editorial': {
    note: '闪光一亮，模特定格在一个有张力的姿势上，刊头、标题和小字依次排进来——时尚大片不只拍人，也拍版式和态度。',
    art: () => <g>
      <rect x={0} y={0} width={W} height={180} fill="#d8d2c8" />
      <g transform="translate(170 178)"><g transform="rotate(-6)"><Person x={0} y={0} h={164} hairLong /></g></g>
      <Op kt="0;.08;.12;.9;.95;1" v={seq(0, 1)}><Txt x={22} y={52} s={34} c="sa-mast">MODE</Txt></Op>
      <Op kt="0;.25;.32;.9;.95;1" v={seq(0, 1)}><Txt x={22} y={74} s={9} c="sa-mag">THE NEW SILHOUETTE</Txt><Txt x={22} y={86} s={7} c="sa-mag2">秋冬系列 · 第 24 期</Txt></Op>
      <Op kt="0;.4;.46;.9;.95;1" v={seq(0, 1)}><Txt x={298} y={160} a="end" s={7} c="sa-mag2">PHOTOGRAPHED IN STUDIO</Txt><rect x={22} y={150} width={60} height={2} fill="#1a1a1a" /></Op>
      <rect x={0} y={0} width={W} height={180} fill="#fff"><A a="opacity" v="0;.9;0;0" kt="0;.02;.08;1" d={D} /></rect>
    </g>,
  },
  'img-genre-cyberpunk': {note: '密不透风的楼群、闪烁的霓虹和全息广告、雨里的飞车光尾——一张图里塞满「高科技、低生活」的细节。', art: () => <Cyber />},
  'img-genre-ink-wash': {note: '远山一笔笔浮现，墨色由浓到淡洇开，小舟漂过大片留白，最后盖上一方朱红印章——水墨的笔意、留白与题款。', art: () => <Ink seal />},
  'img-genre-ukiyoe': {
    note: '一道巨浪卷起，浪尖碎成爪子一样的白沫，远处一座小小的富士山——平涂色块、粗轮廓线，是浮世绘木版画的样子。',
    art: () => {
      const wave = (k: number) => `M0 150 C40 ${130 - k} 80 ${110 - k} 120 ${70 - k} C150 ${34 - k} 200 ${30 - k} 220 ${54 - k} C204 ${48 - k} 186 ${56 - k} 186 ${72 - k} C186 ${90 - k} 210 ${96 - k} 226 ${86 - k} C240 ${110} 280 130 320 140 L320 180 L0 180 Z`;
      return <g>
        <rect x={0} y={0} width={W} height={180} fill="#e8dcc0" />
        <path d="M244 132 L268 104 L292 132 Z" fill="#3a5a80" stroke="#1a2a3a" strokeWidth={1.2} /><path d="M262 111 L268 104 L274 111 L268 114 Z" fill="#fff" />
        <path d={wave(0)} fill="#1f3a5f" stroke="#0e1e30" strokeWidth={1.6}><A a="d" v={`${wave(0)};${wave(8)};${wave(0)}`} d={4} /></path>
        <path d="M60 150 C90 130 110 120 140 100 M80 160 C110 140 140 128 170 112" fill="none" stroke="#e8dcc0" strokeWidth={1} opacity={0.6} />
        <g><T type="translate" v="0 0;0 -8;0 0" d={4} />{Array.from({length: 8}, (_, i) => <path key={i} d={`M${150 + i * 9} ${40 + Math.abs(i - 3) * 3} l3 -7 l3 7`} fill="#fff" stroke="#0e1e30" strokeWidth={0.8} />)}</g>
        <path d="M0 160 C60 150 120 156 180 150 C240 144 280 150 320 146" fill="none" stroke="#fff" strokeWidth={1} />
        <rect x={20} y={14} width={14} height={50} fill="#d8c8a0" stroke="#3a2a1a" strokeWidth={0.8} />
      </g>;
    },
  },
  // 风格（图片）
  'img-style-ccd-retro': {
    note: '「咔」的一下直闪：人脸被打得发亮、背景一下子黑下去，右下角跳出橙色日期——2000 年代卡片机的味道。',
    art: (u) => <g>
      <rect className="sa-dark" x={0} y={0} width={W} height={180} />
      <Op v="0;0;1;1;0;0" kt="0;.18;.2;.9;.95;1"><rect x={0} y={0} width={W} height={180} fill="#1a1612" /><g className="sa-flash"><Bust x={160} y={84} s={1.5} blink={false} /></g><rect x={0} y={0} width={W} height={180} fill={`url(#sa-vig)`} /><Txt x={296} y={166} a="end" s={11} c="sa-date">&apos;03 10 23</Txt></Op>
      <rect x={0} y={0} width={W} height={180} fill="#fff"><A a="opacity" v="0;0;1;0;0" kt="0;.16;.18;.26;1" ease={false} /></rect>
      <Op v="1;1;0;0;1;1" kt="0;.16;.17;.95;.96;1"><rect x={110} y={56} width={100} height={68} rx={4} className="sa-acc" /><Txt x={160} y={94} a="middle" s={7}>半按快门…</Txt></Op>
    </g>,
  },
  'img-style-cinematic-still': {
    note: '画面收成 2.39:1 宽银幕，人在窗边做着一个动作，冷调里带一点暖，字幕慢慢浮出来——像电影里随手停下的一帧。',
    art: () => <g>
      <rect x={0} y={0} width={W} height={180} fill="#16242a" />
      <rect x={30} y={34} width={90} height={110} fill="#2a4a54" stroke="rgba(255,255,255,.2)" strokeWidth={0.6} /><path d="M75 34 L75 144 M30 89 L120 89" stroke="rgba(255,255,255,.2)" strokeWidth={0.6} />
      <rect x={30} y={34} width={90} height={110} fill="rgba(255,200,140,.12)" />
      <Person x={190} y={190} h={150} hairLong face />
      <Table x={250} y={180} w={60} />
      <rect className="sa-dark" x={0} y={0} width={W} height={23} /><rect className="sa-dark" x={0} y={157} width={W} height={23} />
      <Op kt="0;.3;.4;.9;.95;1" v={seq(0, 1)}><Txt x={160} y={150} a="middle" s={8.5} c="sa-sub">「我以为你不会来了。」</Txt></Op>
    </g>,
  },
  'img-style-airy-japanese': {
    note: '曝光慢慢抬亮，对比被压低，窗边透进一层带点青的白光，阴影变得很浅——画面像被空气和光填满。',
    art: (u) => <g>
      <rect x={0} y={0} width={W} height={180} fill="#9aa6a8" />
      <rect x={180} y={10} width={120} height={130} fill="#dfe8ea" stroke="#fff" strokeWidth={0.8} /><path d="M240 10 L240 140 M180 75 L300 75" stroke="#fff" strokeWidth={0.8} />
      <path d="M0 140 L320 140 L320 180 L0 180 Z" fill="#b8b0a4" />
      <g transform="translate(120 140)"><path d="M-10 0 L-8 -24 L8 -24 L10 0 Z" fill="#e8e2d8" stroke="#6a6a6a" strokeWidth={0.6} /><path d="M0 -24 C-20 -50 -8 -70 0 -76 C8 -70 20 -50 0 -24 Z M0 -30 C-24 -40 -30 -56 -26 -62 M0 -30 C24 -40 30 -56 26 -62" fill="#8ab08a" stroke="#4a6a4a" strokeWidth={0.6} /></g>
      <g transform="translate(70 180)"><Person x={0} y={0} h={150} hairLong face /></g>
      <rect x={0} y={0} width={W} height={180} fill="#f4fbff"><A a="opacity" kt={K} v={seq(0, 0.42)} /></rect>
      <defs><radialGradient id={`${u}-lk`} cx="1" cy="0" r="1"><stop offset="0" stopColor="#fff6e0" stopOpacity=".9" /><stop offset=".6" stopColor="#fff6e0" stopOpacity="0" /></radialGradient></defs>
      <Op kt={K} v={seq(0, 1)}><rect x={0} y={0} width={W} height={180} fill={`url(#${u}-lk)`} /></Op>
    </g>,
  },
  'img-style-collage-poster': {
    note: '剪下来的纸片一张张斜着贴上来，带着白边和网点，大字压在最上面——拼贴海报的随意与冲撞。',
    art: (u) => {
      const kt = (i: number) => `0;${0.06 + i * 0.08};${0.16 + i * 0.08};.9;.95;1`;
      const pieces: [number, number, number, ReactNode][] = [
        [90, 80, -8, <><rect x={-60} y={-50} width={120} height={100} fill="#f2efe9" /><rect x={-54} y={-44} width={108} height={88} fill="#2a5a8a" /><Ridge y={20} x={-54} w={108} amp={20} seed={3} c="sa-hill" step={14} /></>],
        [210, 70, 7, <><rect x={-46} y={-56} width={92} height={112} fill="#f2efe9" /><rect x={-40} y={-50} width={80} height={100} fill="#e85a3a" /><g transform="translate(0 50) scale(.9)"><Person x={0} y={0} h={100} /></g></>],
        [150, 136, -3, <><rect x={-70} y={-16} width={140} height={32} fill="#f6d84a" /><Txt x={0} y={7} a="middle" s={18} c="sa-coll">NO.24</Txt></>],
      ];
      return <g>
        <rect x={0} y={0} width={W} height={180} fill="#e8e2d6" />
        <defs><pattern id={`${u}-ht`} width="5" height="5" patternUnits="userSpaceOnUse"><circle cx={2.5} cy={2.5} r={1.1} fill="rgba(0,0,0,.22)" /></pattern></defs>
        <rect x={0} y={0} width={W} height={180} fill={`url(#${u}-ht)`} />
        {pieces.map(([x, y, r, el], i) => <g key={i}><T type="translate" kt={kt(i)} v={seq(`${x + (i % 2 ? 200 : -200)} ${y}`, `${x} ${y}`)} /><Ro cx={0} cy={0} kt={kt(i)} v={seq(r * 4, r)}>{el}</Ro></g>)}
        <path d="M260 20 L300 30 L296 40 L256 30 Z" fill="rgba(255,255,255,.6)" />
      </g>;
    },
  },
  'img-style-3d-render': {
    note: '先是一副线框网格，渲染进度条走完后，表面、柔和的光影和落地阴影一起出现——干净、圆润的三维渲染质感。',
    art: (u) => {
      const kt = '0;.2;.55;.9;.95;1';
      return <g>
        <defs><radialGradient id={`${u}-r3`} cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#f6f0ff" /><stop offset=".5" stopColor="#a890f0" /><stop offset="1" stopColor="#4a3a8a" /></radialGradient></defs>
        <rect x={0} y={0} width={W} height={180} fill="#e6e2ee" />
        <path d="M0 132 C100 126 220 126 320 132" fill="none" stroke="#c8c0d8" strokeWidth={0.8} />
        <Op kt={kt} v={seq(0, 1)}><ellipse cx={160} cy={136} rx={44} ry={7} fill="rgba(60,40,120,.25)" /><circle cx={160} cy={90} r={42} fill={`url(#${u}-r3)`} /><ellipse cx={146} cy={72} rx={10} ry={6} fill="#fff" opacity={0.7} /><rect x={226} y={96} width={40} height={40} rx={8} fill="#f6b8c8" /><rect x={226} y={96} width={40} height={10} rx={5} fill="#fff" opacity={0.5} /></Op>
        <Op kt={kt} v={seq(1, 0)}>
          {[-30, -15, 0, 15, 30].map((a) => <ellipse key={a} cx={160} cy={90} rx={+(42 * Math.cos((a * Math.PI) / 180)).toFixed(2) || 1} ry={42} fill="none" stroke="#5a4a9a" strokeWidth={0.6} transform={`rotate(${a * 0} 160 90)`} />)}
          {[-28, -14, 0, 14, 28].map((y) => <ellipse key={y} cx={160} cy={90 + y} rx={+Math.sqrt(42 * 42 - y * y).toFixed(2)} ry={4} fill="none" stroke="#5a4a9a" strokeWidth={0.6} />)}
          <rect x={226} y={96} width={40} height={40} rx={8} fill="none" stroke="#5a4a9a" strokeWidth={0.6} /><path d="M226 116 L266 116 M246 96 L246 136" stroke="#5a4a9a" strokeWidth={0.6} />
        </Op>
        <rect x={60} y={160} width={200} height={4} rx={2} fill="#cfc8e0" />
        <rect x={60} y={160} width={0} height={4} rx={2} fill="#7a60d8"><A a="width" kt={kt} v={seq(0, 200)} /></rect>
        <Txt x={60} y={155} s={6.5} c="sa-txt-ink">RENDER</Txt>
      </g>;
    },
  },
};
void Mv; void Sc;
