// 质感 / 节奏 / 转场 / 声音：都是「随时间变化」的东西，所以多配一条时间轴或波形。
import type {ReactNode} from 'react';
import {A, Bust, Chair, D, type Demo, Floor, Lamp, Mv, Op, Person, Ridge, Sc, Show, Skyline, Sun, T, Table, Timeline, Tree, Txt, W, Walker} from './kit';

const seq = (a: string | number, b: string | number) => `${a};${a};${b};${b};${a};${a}`;
const K = '0;.12;.5;.9;.95;1';

// ── 小场景：转场与节奏用的「镜头」 ──────────────────────────────────
const Street = () => <g><rect className="sa-wall" x={0} y={0} width={W} height={180} /><Ridge y={96} amp={14} seed={4} c="sa-hill2" /><Skyline x={-20} w={360} base={112} seed={4} hMin={18} hMax={56} /><path className="sa-line" d="M0 112 L320 112" /><Floor vy={112} y0={112} n={11} spread={1.2} /><Person x={150} y={156} h={70} face /><Lamp x={238} y={156} s={1.1} /></g>;
const Face = () => <g><rect className="sa-wall" x={0} y={0} width={W} height={180} /><path className="sa-faint" d="M30 20 L30 160 M290 20 L290 160" /><Bust x={160} y={86} s={1.5} /></g>;
const Room = ({who = 1}: {who?: number}) => <g>
  <rect className="sa-wall" x={0} y={0} width={W} height={180} />
  <path className="sa-line" d="M0 146 L320 146" />
  <rect className="sa-body" x={30} y={30} width={70} height={84} /><path className="sa-faint" d="M65 30 L65 114 M30 72 L100 72" />
  <circle className="sa-line" cx={232} cy={44} r={14} /><path className="sa-line" d="M232 44 L232 34 M232 44 L240 48" />
  <Table x={170} y={146} w={80} />
  {who === 1 && <Person x={140} y={146} h={78} face />}
  {who === 2 && <><Chair x={250} y={146} s={1.4} /><Person x={250} y={136} h={70} face /></>}
  {who === 3 && <Person x={86} y={150} h={84} face hairLong />}
  {who === 4 && <Person x={196} y={146} h={66} face />}
</g>;
const Moon = () => <g><rect className="sa-dark" x={0} y={0} width={W} height={180} />{Array.from({length: 22}, (_, i) => <circle key={i} className="sa-subj" cx={(i * 61) % 320} cy={(i * 37) % 90} r={0.7} opacity={0.6} />)}<circle className="sa-sunf" cx={160} cy={74} r={30} /><circle className="sa-faint" cx={150} cy={66} r={6} /><circle className="sa-faint" cx={172} cy={84} r={4} /><Skyline x={-20} w={360} base={180} seed={9} hMin={20} hMax={60} /></g>;
const Plate = () => <g><rect className="sa-body" x={0} y={0} width={W} height={180} />{[0, 1, 2, 3, 4, 5].map((i) => <path key={i} className="sa-faint" d={`M0 ${20 + i * 30} C100 ${14 + i * 30} 220 ${26 + i * 30} 320 ${20 + i * 30}`} />)}<circle className="sa-body" cx={160} cy={74} r={44} /><circle className="sa-line" cx={160} cy={74} r={36} /><circle className="sa-sunf" cx={160} cy={74} r={30} opacity={0.85} /><path className="sa-line" d="M226 30 L226 130 M236 30 L236 130" /></g>;
const Sea = () => <g><rect className="sa-wall" x={0} y={0} width={W} height={180} /><Sun x={200} y={70} r={16} /><path className="sa-line" d="M0 100 L320 100" />{[0, 1, 2, 3, 4].map((i) => <path key={i} className="sa-soft" d={`M${-20 + (i % 2) * 20} ${110 + i * 14} q20 -5 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`}><T type="translate" v="0 0;-40 0" d={3 + i * 0.4} ease={false} /></path>)}</g>;
const Run = () => <g><rect className="sa-wall" x={0} y={0} width={W} height={180} /><Ridge y={110} amp={12} seed={12} c="sa-hill2" /><path className="sa-line" d="M0 150 L320 150" /><g><T type="translate" v="0 0;-60 0" d={0.6} ease={false} />{Array.from({length: 8}, (_, i) => <path key={i} className="sa-soft" d={`M${i * 60} 162 L${i * 60 + 24} 162`} />)}</g><Walker x={160} y={150} h={84} walk={0.55} /></g>;
const Cup = () => <g><rect className="sa-wall" x={0} y={0} width={W} height={180} /><path className="sa-line" d="M0 130 L320 130" /><Table x={160} y={180} w={200} cup={false} /><path className="sa-body" d="M136 154 L140 112 L180 112 L184 154 Z" /><path className="sa-line" d="M182 120 C198 120 198 144 183 144" />{[0, 1, 2].map((i) => <path key={i} className="sa-soft" d={`M${150 + i * 10} 106 C${144 + i * 10} 96 ${156 + i * 10} 88 ${150 + i * 10} 76`}><A a="opacity" v="0;.9;0" d={3} begin={`${-i}s`} /><T type="translate" v="0 6;0 -10" d={3} begin={`${-i}s`} ease={false} /></path>)}</g>;

const Grain = ({u, op = 0.32}: {u: string; op?: number}) => <>
  <defs><filter id={`${u}-gr`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="1"><A a="seed" v="1;2;3;4;5;6" d={0.5} discrete /></feTurbulence><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 3 -1.9" /></filter></defs>
  <rect x={0} y={0} width={W} height={180} filter={`url(#${u}-gr)`} opacity={op} />
</>;
/** 左右对比划像：左边 before，右边 after，分界线从左扫到右 */
function Wipe({u, before, after, a, b}: {u: string; before: ReactNode; after: ReactNode; a: string; b: string}) {
  const kt = '0;.12;.6;.9;.95;1';
  return <g>
    {before}
    <clipPath id={`${u}-wc`}><rect x={0} y={0} width={0} height={180}><A a="width" kt={kt} v={seq(0, W)} /></rect></clipPath>
    <g clipPath={`url(#${u}-wc)`}>{after}</g>
    <g><T type="translate" kt={kt} v={seq('0 0', `${W} 0`)} /><path className="sa-acc" d="M0 0 L0 180" /><rect className="sa-accf" x={-3} y={84} width={6} height={12} rx={2} /></g>
    <Txt x={312} y={170} a="end" s={7}>{a}</Txt>
    <Op kt={kt} v={seq(0, 1)}><Txt x={10} y={170} s={7} c="sa-txt sa-txt-acc">{b}</Txt></Op>
  </g>;
}
const Gloss = ({matte = false}: {matte?: boolean}) => <g>
  <Face />
  {!matte && <><path className="sa-key" d="M150 60 C152 56 158 55 162 57 L160 62 Z" /><ellipse className="sa-key" cx={182} cy={86} rx={3} ry={1.6} /><path className="sa-key" d="M140 100 L146 98 L144 102 Z" /><path className="sa-key" d="M98 150 L110 136 L114 140 L102 156 Z" opacity={0.6} /></>}
  {matte && <rect x={0} y={0} width={W} height={180} fill="rgba(140,140,140,.14)" />}
</g>;

function Wave({amp, x0 = 24, x1 = 296, y = 158, h = 12, step = 2.4, d = D, label}: {amp: (t: number) => number; x0?: number; x1?: number; y?: number; h?: number; step?: number; d?: number; label?: string}) {
  const bars: ReactNode[] = [];
  for (let x = x0, i = 0; x <= x1; x += step, i++) {
    const a = Math.max(0.04, Math.min(1, amp((x - x0) / (x1 - x0))));
    const xx = +x.toFixed(1), hh = +(a * h).toFixed(2); // 三角函数在 Node 与浏览器里末位可能不同，取整避免水合不一致
    bars.push(<path key={i} className="sa-wave" d={`M${xx} ${y - hh} L${xx} ${y + hh}`} />);
  }
  return <g>
    <rect className="sa-panel" x={x0 - 8} y={y - h - 8} width={x1 - x0 + 16} height={h * 2 + 16} rx={3} />
    {bars}
    <g><T type="translate" v={`0 0;${x1 - x0} 0`} d={d} ease={false} /><path className="sa-acc" d={`M${x0} ${y - h - 6} L${x0} ${y + h + 6}`} /></g>
    {label && <Txt x={x0} y={y - h - 11} s={6.5}>{label}</Txt>}
  </g>;
}
// 整数哈希做伪随机：不用 Math.sin，保证服务端与浏览器算出同一个数
const noise = (seed: number) => (t: number) => { let h = (Math.round(t * 10000) * 374761393 + seed * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

export const time: Record<string, Demo> = {
  // 质感
  'tex-film-grain': {note: '分界线扫过后，画面多了一层会跳动的细颗粒，暗部偏暖、边角压暗——像真的从胶片上扫出来的。', art: (u) => <Wipe u={u} before={<Street />} after={<g><Street /><rect x={0} y={0} width={W} height={180} fill="rgba(200,140,60,.08)" /><Grain u={u} /><rect x={0} y={0} width={W} height={180} fill={`url(#sa-vig)`} /></g>} a="数码原片" b="胶片颗粒" />},
  'img-tex-film-grain': {note: '分界线扫过后，整张图覆上一层细碎跳动的颗粒，边角微暗——数码的「塑料感」一下子没了。', art: (u) => <Wipe u={u} before={<Face />} after={<g><Face /><rect x={0} y={0} width={W} height={180} fill="rgba(200,140,60,.08)" /><Grain u={u} /><rect x={0} y={0} width={W} height={180} fill={`url(#sa-vig)`} /></g>} a="数码原片" b="胶片颗粒" />},
  'tex-clean': {note: '分界线扫过后，噪点和脏东西全部消失，线条锐利、暗部干净——像新机器直出的高清数码画面。', art: (u) => <Wipe u={u} before={<g><Street /><Grain u={u} op={0.7} /></g>} after={<Street />} a="噪点 / 脏" b="干净数码" />},
  'tex-matte': {note: '分界线扫过后，脸上和衣服上刺眼的反光点没了，黑色被轻轻抬亮成深灰——画面变得柔、不反光。', art: (u) => <Wipe u={u} before={<Gloss />} after={<Gloss matte />} a="亮面 · 有反光" b="哑光 · 高光收住" />},
  'tex-wet': {
    note: '雨后的地面像一面暗镜子：路灯在地上拉出长长的倒影，雨点落下激起一圈圈涟漪，倒影跟着晃。',
    art: () => <g>
      <rect className="sa-dark" x={0} y={0} width={W} height={180} />
      <Skyline x={-20} w={360} base={100} seed={14} hMin={24} hMax={70} lit={0.4} />
      <path className="sa-line" d="M0 100 L320 100" />
      {[60, 150, 250].map((x, i) => <g key={x}><Lamp x={x} y={100} s={0.9} /><g transform={`translate(${x + 8} 104)`}><g><T type="scale" v="1 1;1.8 1;1 1" d={1.6 + i * 0.3} /><rect className="sa-refl" x={-2} y={0} width={4} height={60} rx={2} /></g></g></g>)}
      <Person x={200} y={136} h={50} />
      <g transform="translate(200 137) scale(1 -0.6) translate(-200 -137)" opacity={0.3}><Person x={200} y={136} h={50} /></g>
      {[[80, 140], [130, 160], [230, 150], [280, 170], [40, 165]].map(([x, y], i) => <ellipse key={i} className="sa-soft" cx={x} cy={y} rx={2} ry={0.6}><A a="rx" v="1;18" d={1.8} begin={`${-i * 0.37}s`} ease={false} /><A a="ry" v="0.3;5" d={1.8} begin={`${-i * 0.37}s`} ease={false} /><A a="opacity" v="1;0" d={1.8} begin={`${-i * 0.37}s`} ease={false} /></ellipse>)}
      {Array.from({length: 18}, (_, i) => <path key={i} className="sa-faint" d={`M${(i * 19) % 320} 0 l-4 16`}><T type="translate" v="0 -20;0 190" d={0.8 + (i % 3) * 0.15} ease={false} begin={`${-i * 0.11}s`} /></path>)}
    </g>,
  },
  'tex-vhs': {
    note: '画面上叠着细扫描线，颜色边缘错开一点红蓝重影，一条滚动的干扰带从上往下走，角落还有录像机的屏显——老录像带的样子。',
    art: (u) => <g>
      <g><T type="translate" v="0 0;-1.4 0;1 0;0 0" d={0.4} discrete /><Street /></g>
      <g opacity={0.5}><T type="translate" v="2 0;3 0;1.6 0" d={0.6} discrete /><path className="sa-chromar" d="M150 86 C150 80 158 78 160 84 M140 156 L140 110 M160 156 L160 110" /></g>
      <defs><pattern id={`${u}-sl`} width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="1.2" fill="rgba(0,0,0,.55)" /></pattern></defs>
      <rect x={0} y={0} width={W} height={180} fill={`url(#${u}-sl)`} />
      <g><T type="translate" v="0 -30;0 190" d={3.4} ease={false} /><rect x={0} y={0} width={W} height={14} fill="rgba(255,255,255,.08)" /><rect x={0} y={0} width={W} height={14} filter={`url(#${u}-gr)`} opacity={0.6} /></g>
      <Grain u={u} op={0.25} />
      <Txt x={22} y={26} s={9} c="sa-osd">PLAY ▶</Txt>
      <Txt x={298} y={162} a="end" s={9} c="sa-osd">SP 0:13:07</Txt>
    </g>,
  },
  'img-tex-wet-glossy': {
    note: '瓶身挂满水珠，一道高光从左到右滑过——湿润的表面会把光拉成细长、锐利的反光。',
    art: (u) => <g>
      <rect className="sa-wall" x={0} y={0} width={W} height={180} />
      <path className="sa-faint" d="M0 140 C100 134 220 134 320 140" />
      <clipPath id={`${u}-bt`}><path d="M128 158 L128 70 C128 58 140 54 148 54 L172 54 C180 54 192 58 192 70 L192 158 Z" /></clipPath>
      <path className="sa-body" d="M128 158 L128 70 C128 58 140 54 148 54 L172 54 C180 54 192 58 192 70 L192 158 Z" />
      <rect className="sa-body" x={148} y={34} width={24} height={20} rx={2} />
      <g clipPath={`url(#${u}-bt)`}><g><T type="translate" v="-80 0;-80 0;90 0;90 0" kt="0;.2;.7;1" ease={false} /><path className="sa-gloss" d="M150 40 L162 40 L150 170 L138 170 Z" /></g></g>
      {[[140, 80, 2.4], [176, 92, 3], [150, 112, 2], [182, 124, 2.6], [136, 136, 3.2], [166, 146, 2.2], [158, 72, 1.6], [186, 76, 1.8]].map(([x, y, r], i) => <g key={i}><ellipse className="sa-drop" cx={x} cy={y} rx={r} ry={r * 1.25} /><circle className="sa-key" cx={x - r * 0.35} cy={y - r * 0.4} r={r * 0.3} /></g>)}
      <ellipse className="sa-shade" cx={160} cy={160} rx={42} ry={4} />
    </g>,
  },
  'img-tex-silver-gelatin': {
    note: '暗房显影盘里，一张黑白照片慢慢浮现：黑是真的黑、灰阶细腻、带着银盐颗粒——这就是银盐黑白的质感。',
    art: (u) => <g>
      <rect className="sa-dark" x={0} y={0} width={W} height={180} />
      <rect x={0} y={0} width={W} height={180} fill="rgba(170,40,30,.12)" />
      <rect className="sa-body" x={44} y={14} width={232} height={152} rx={6} />
      <rect x={70} y={28} width={180} height={124} fill="#e8e4dc" />
      <Op v="0;0;1;1;0;0" kt="0;.1;.6;.9;.95;1"><g transform="translate(70 28) scale(.5625 .689)">
        <rect x={0} y={0} width={W} height={180} fill="#151515" />
        <g className="sa-bw"><Bust x={160} y={86} s={1.5} /></g>
        <Grain u={u} op={0.4} />
      </g></Op>
      <path className="sa-soft" d="M262 10 L230 60 M272 14 L238 62" />
      <Txt x={160} y={174} a="middle" s={6.5}>显影中</Txt>
    </g>,
  },
  'img-tex-brushed-metal': {
    note: '金属表面布满极细的同向拉丝纹，一条高光顺着纹路横向滑过——拉丝金属的光是一条，而不是一个点。',
    art: (u) => <g>
      <rect className="sa-wall" x={0} y={0} width={W} height={180} />
      <clipPath id={`${u}-mt`}><rect x={40} y={30} width={240} height={120} rx={14} /></clipPath>
      <rect x={40} y={30} width={240} height={120} rx={14} fill="#2a2d33" />
      <g clipPath={`url(#${u}-mt)`}>
        {Array.from({length: 80}, (_, i) => <path key={i} className="sa-brush" d={`M40 ${31 + i * 1.5} L280 ${31 + i * 1.5 + ((i * 7) % 3) * 0.2}`} opacity={0.25 + ((i * 13) % 7) / 14} />)}
        <defs><linearGradient id={`${u}-mg`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".55" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient></defs>
        <g><T type="translate" v="-120 0;260 0;-120 0" d={5} /><rect x={40} y={30} width={60} height={120} fill={`url(#${u}-mg)`} /></g>
      </g>
      <rect className="sa-line" x={40} y={30} width={240} height={120} rx={14} />
      <circle className="sa-body" cx={66} cy={56} r={5} /><circle className="sa-body" cx={254} cy={124} r={5} />
    </g>,
  },
  'img-tex-watercolor': {
    note: '颜色在纸上一团团晕开，边缘不规则、互相渗透，纸的纹理透出来——水彩的「水」比「彩」更重要。',
    art: (u) => <g>
      <defs><filter id={`${u}-wc`} x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="16" /><feGaussianBlur stdDeviation="1.4" /></filter>
        <filter id={`${u}-pp`}><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" /><feColorMatrix type="matrix" values="0 0 0 0 .95  0 0 0 0 .93  0 0 0 0 .88  0 0 0 .12 0" /></filter></defs>
      <rect x={0} y={0} width={W} height={180} fill="#ece6da" />
      <rect x={0} y={0} width={W} height={180} filter={`url(#${u}-pp)`} />
      <g filter={`url(#${u}-wc)`}>
        {[[90, 70, 48, '#7aa6c8', 0], [170, 96, 56, '#e8a08a', 0.8], [240, 64, 40, '#a8c890', 1.6], [130, 130, 38, '#c8b0d8', 2.4]].map(([x, y, r, c, b], i) => <circle key={i} cx={x as number} cy={y as number} r={r as number} fill={c as string} opacity={0.55}><A a="r" v={`0;${r};${r};0`} kt="0;.4;.9;1" d={6} begin={`${b}s`} /></circle>)}
      </g>
      <path d="M40 150 C100 120 180 160 280 128" fill="none" stroke="#3a4a5a" strokeWidth={1.2} strokeDasharray={300} strokeDashoffset={300}><A a="stroke-dashoffset" v="300;0;0" kt="0;.5;1" d={6} /></path>
    </g>,
  },

  // 节奏
  'tempo-long-take': {
    note: '整段只有一个镜头：机器一路穿过街道、跟到人身边，下面的时间轴从头到尾没有一道剪辑点。',
    art: () => <g>
      <Mv v="0 0;-260 0" d={D} ease={false}>
        <rect className="sa-wall" x={0} y={0} width={620} height={180} />
        <Skyline x={-20} w={640} base={112} seed={5} hMin={18} hMax={56} /><path className="sa-line" d="M0 112 L620 112" />
        <Person x={120} y={146} h={60} face /><Lamp x={220} y={146} s={1} /><Table x={330} y={146} w={50} /><Person x={420} y={146} h={64} face hairLong /><Tree x={520} y={146} s={1.2} />
      </Mv>
      <Timeline cuts={[]} label="1 个镜头 · 0 次剪辑" />
    </g>,
  },
  'tempo-fast-cut': {
    note: '每零点几秒就换一个画面，时间轴被切成很多短块——信息密度高、节奏快，适合运动、广告和高潮段落。',
    art: () => {
      const scenes = [<Street key="a" />, <Face key="b" />, <Run key="c" />, <Moon key="d" />, <Room key="e" />, <Sea key="f" />, <Cup key="g" />, <Face key="h" />, <Run key="i" />, <Street key="j" />];
      const cuts = scenes.map((_, i) => i / scenes.length);
      return <g>
        {scenes.map((s, i) => <Show key={i} t0={cuts[i]} t1={cuts[i + 1] ?? 1}>{s}</Show>)}
        <Timeline cuts={cuts.slice(1)} label={`${scenes.length} 个镜头 / 6 秒`} />
      </g>;
    },
  },
  'tempo-slow-motion': {
    note: '同一滴水：左边按正常速度一眨眼就落下，右边用升格拍摄放慢五倍——下落、溅起的水花每一帧都看得清。',
    art: () => {
      const Drop = ({d}: {d: number}) => <g>
        <path className="sa-line" d="M0 130 L140 130" />
        <path className="sa-drop" d="M70 0 C74 6 76 9 76 12 C76 16 73 18 70 18 C67 18 64 16 64 12 C64 9 66 6 70 0 Z"><T type="translate" v="0 10;0 112;0 112" kt="0;.4;1" d={d} ease=".5 0 1 1" /><A a="opacity" v="1;1;0;0" kt="0;.4;.41;1" d={d} discrete /></path>
        {[-1, 1].map((sd) => [0, 1, 2].map((k) => <circle key={`${sd}${k}`} className="sa-drop" r={2 - k * 0.4}><A a="cx" v={`70;70;${70 + sd * (16 + k * 10)}`} kt="0;.4;1" d={d} ease={false} /><A a="cy" v={`130;130;${110 - k * 6};130`} kt="0;.4;.7;1" d={d} /><A a="opacity" v="0;0;1;0" kt="0;.4;.41;1" d={d} discrete /></circle>))}
        <ellipse className="sa-soft" cx={70} cy={131} rx={2} ry={1}><A a="rx" v="0;0;40" kt="0;.4;1" d={d} ease={false} /><A a="opacity" v="0;0;1;0" kt="0;.4;.45;1" d={d} ease={false} /></ellipse>
      </g>;
      return <g>
        <rect className="sa-wall" x={0} y={0} width={W} height={180} />
        <g transform="translate(14 14)"><Drop d={1.2} /></g>
        <path className="sa-faint" d="M160 14 L160 166" />
        <g transform="translate(166 14)"><Drop d={6} /></g>
        <Txt x={84} y={168} a="middle" s={7}>24 fps · 正常速度</Txt>
        <Txt x={236} y={168} a="middle" s={7} c="sa-txt sa-txt-acc">120 fps 升格 · 慢 5 倍</Txt>
      </g>;
    },
  },
  'tempo-montage': {
    note: '清晨、出门、工作、黄昏、夜晚，五个不相干的镜头接在一起，一分钟讲完一整天——意义来自镜头之间的拼接。',
    art: () => {
      const s = [[<Sea key="a" />, '清晨'], [<Run key="b" />, '出门'], [<Room key="c" />, '工作'], [<Cup key="d" />, '黄昏'], [<Moon key="e" />, '夜']] as const;
      return <g>
        {s.map(([el, t], i) => <Show key={i} t0={i / 5} t1={(i + 1) / 5}>{el}<Txt x={300} y={26} a="end" s={8} c="sa-txt sa-txt-acc">{`0${i + 1} ${t}`}</Txt></Show>)}
        <Timeline cuts={[0.2, 0.4, 0.6, 0.8]} label="5 个镜头 · 拼出一整天" />
      </g>;
    },
  },
  'tempo-hold': {
    note: '镜头完全不动，什么都不剪：只有杯子里的热气在升、时间在走——画面静止，情绪被留给观众自己消化。',
    art: () => <g>
      <Cup />
      <Txt x={300} y={26} a="end" s={8}>00:0</Txt>
      {[1, 2, 3, 4, 5, 6].map((n) => <Show key={n} t0={(n - 1) / 6} t1={n / 6}><Txt x={300} y={26} s={8}>{n}</Txt></Show>)}
      <Timeline cuts={[]} label="固定机位 · 不剪 · 让时间流过" />
    </g>,
  },

  // 转场
  'cut-hard': {note: '上一个画面直接跳成下一个，中间没有任何过渡——最干脆、最常用，时间轴上就是一道竖线。', art: () => <g><Show t0={0} t1={0.5}><Street /></Show><Show t0={0.5} t1={1}><Face /></Show><Timeline cuts={[0.5]} label="A → B 硬切" /></g>},
  'cut-fade': {
    note: '画面慢慢沉入黑场，再从黑里浮出下一场——用来告诉观众「时间过去了」或「这一段结束了」。',
    art: () => <g>
      <rect className="sa-dark" x={0} y={0} width={W} height={180} />
      <Op v="1;1;0;0" kt="0;.3;.48;1"><Street /></Op>
      <Op v="0;0;1;1" kt="0;.52;.7;1"><Room /></Op>
      <Timeline cuts={[0.5]} label="A → 黑 → B 淡入淡出" />
    </g>,
  },
  'cut-match': {
    note: '月亮慢慢推近，一刀切到一只位置、大小都一样的圆盘子——形状接住了形状，两个时空被无缝缝在一起。',
    art: () => <g>
      <Show t0={0} t1={0.5}><Sc cx={160} cy={74} v="1;1.08" kt="0;1" d={3}><Moon /></Sc></Show>
      <Show t0={0.5} t1={1}><Plate /></Show>
      <circle className="sa-acc sa-dash" cx={160} cy={74} r={34}><A a="opacity" v="0;0;1;1;0;0" kt="0;.35;.45;.6;.7;1" /></circle>
      <Timeline cuts={[0.5]} label="形状匹配 · 圆 → 圆" />
    </g>,
  },
  'cut-jump': {
    note: '机位和景别都不变，人却突然跳到房间别处、墙上的钟也跳了——同一画面里时间被直接剪掉，有焦躁、断裂感。',
    art: () => <g>
      {[1, 2, 3, 4].map((w, i) => <Show key={w} t0={i / 4} t1={(i + 1) / 4}><Room who={w} /><g transform="translate(232 44)"><path className="sa-acc" d={`M0 0 L${(Math.cos(i * 1.4) * 8).toFixed(2)} ${(Math.sin(i * 1.4) * 8).toFixed(2)}`} /></g></Show>)}
      <Timeline cuts={[0.25, 0.5, 0.75]} label="同一机位 · 时间被剪掉" />
    </g>,
  },
  'cut-occlusion': {
    note: '一个路人从镜头前走过，把整个画面挡黑的那一刻切到下一场——遮挡物替剪辑点打了掩护。',
    art: () => <g>
      <Show t0={0} t1={0.5}><Street /></Show>
      <Show t0={0.5} t1={1}><Room /></Show>
      <g><T type="translate" v="420 0;420 0;-420 0;-420 0" kt="0;.25;.75;1" ease={false} />
        <path className="sa-dark" d="M-170 200 C-170 120 -130 70 -60 60 C-60 20 -30 -10 0 -10 C30 -10 60 20 60 60 C130 70 170 120 170 200 Z" />
        <path className="sa-line" d="M-170 200 C-170 120 -130 70 -60 60 C-60 20 -30 -10 0 -10 C30 -10 60 20 60 60 C130 70 170 120 170 200" opacity={0.4} />
      </g>
      <Timeline cuts={[0.5]} label="前景遮挡 → 切" />
    </g>,
  },

  // 声音
  'sound-sync': {note: '嘴一张一合，下方波形同步起伏：画面里谁在说话，声音就从谁那里来——同期声让人物「活」起来。', art: () => <g><rect className="sa-wall" x={0} y={0} width={W} height={180} /><path className="sa-faint" d="M30 10 L30 130 M290 10 L290 130" /><Bust x={160} y={70} s={1.4} talk /><Wave label="对白 · 与口型同步" amp={(t) => (Math.sin(t * 60) * 0.5 + 0.5) * (0.4 + 0.6 * Math.abs(Math.sin(t * 9))) * (t % 0.33 < 0.26 ? 1 : 0.1)} /></g>},
  'sound-ambient': {
    note: '没有人说话时，画面底下也一直铺着一层低低的城市声：车流、风、远处的人声——波形不高，但从不归零。',
    art: () => <g>
      <rect className="sa-wall" x={0} y={0} width={W} height={180} />
      <Skyline x={-20} w={360} base={118} seed={22} hMin={24} hMax={80} lit={0.35} />
      <path className="sa-line" d="M0 118 L320 118" />
      {[0, 1].map((i) => <g key={i}><T type="translate" v={`${i ? 340 : -40} 0;${i ? -40 : 340} 0`} d={4 + i * 1.5} ease={false} /><rect className="sa-body" x={0} y={106 + i * 4} width={22} height={8} rx={2} /><circle className="sa-glow" cx={i ? 1 : 21} cy={110 + i * 4} r={1.4} /></g>)}
      <Wave label="环境底噪 · 一直都在" amp={(t) => 0.18 + noise(3)(t) * 0.16} />
    </g>,
  },
  'sound-foley': {note: '人每踩一步，波形上就跳出一个尖峰：脚步、衣服摩擦、杯子放下，这些声音都是后期一个个「配」进去的。', art: () => <g><rect className="sa-wall" x={0} y={0} width={W} height={180} /><path className="sa-line" d="M0 128 L320 128" /><Walker x={160} y={128} h={92} walk={1.1} /><Wave label="拟音 · 脚步声逐个对位" d={4.4} amp={(t) => { const p = (t * 8) % 1; return p < 0.06 ? 1 - p * 8 : 0.05; }} /></g>},
  'sound-riser': {
    note: '声音越来越高、越来越密，画面跟着慢慢推近——张力被一路拉满，在最高点「砰」地切到下一场。',
    art: () => <g>
      <Show t0={0} t1={0.85}><Sc cx={160} cy={80} v="1;1.6;1.6" kt="0;.85;1"><rect className="sa-wall" x={0} y={0} width={W} height={180} /><path className="sa-line" d="M0 140 L320 140" /><rect className="sa-body" x={126} y={40} width={68} height={100} /><circle className="sa-acc" cx={182} cy={92} r={3} /><path className="sa-faint" d="M134 50 L186 50 L186 130 L134 130 Z" /></Sc></Show>
      <Show t0={0.85} t1={1}><rect x={0} y={0} width={W} height={180} fill="#f2efe9" /><Txt x={160} y={96} a="middle" s={16} c="sa-txt-dark">CUT</Txt></Show>
      <Wave label="上升音 · 越来越高、越来越密" amp={(t) => (t < 0.85 ? Math.pow(t / 0.85, 2.2) * (0.6 + 0.4 * Math.abs(Math.sin(t * t * 120))) : 0.06)} />
    </g>,
  },
  'sound-silence': {
    note: '前半段声音满满，突然一下全部抽空，波形变成一条平线——在最该有声音的地方安静下来，反而最震耳。',
    art: () => <g>
      <Show t0={0} t1={0.5}><Street />{Array.from({length: 10}, (_, i) => <path key={i} className="sa-faint" d={`M${(i * 37) % 320} 0 l-5 18`}><T type="translate" v="0 -20;0 190" d={0.7} ease={false} begin={`${-i * 0.07}s`} /></path>)}</Show>
      <Show t0={0.5} t1={1}><Street /><rect x={0} y={0} width={W} height={180} fill="rgba(0,0,0,.35)" /><Txt x={160} y={40} a="middle" s={9} c="sa-txt sa-txt-acc">—— 静 ——</Txt></Show>
      <Wave label="声音突然抽空" amp={(t) => (t < 0.5 ? 0.45 + noise(7)(t) * 0.55 : 0)} />
    </g>,
  },
  'cut-dissolve': {
    note: '窗边的年轻女孩慢慢变透明，同一扇窗边的老人同时浮现，两个画面重叠了一秒——几十年就在这一秒里过去了。',
    art: () => <g>
      <Op v="1;1;0;0" kt="0;.36;.64;1"><Room who={3} /></Op>
      <Op v="0;0;1;1" kt="0;.36;.64;1"><Room who={1} /></Op>
      <Timeline cuts={[0.5]} label="A、B 重叠约 1 秒 · 叠化" />
    </g>,
  },
  'cut-cross': {
    note: '一边是赶车的人，一边是正在关上的车门，来回切、每次都更短——两条线越切越快，最后撞在同一个时刻。',
    art: () => {
      const b = [0, 0.26, 0.46, 0.62, 0.74, 0.83, 0.9, 0.95, 1];
      const Train = () => <g>
        <rect className="sa-wall" x={0} y={0} width={W} height={180} />
        <path className="sa-line" d="M0 140 L320 140" />
        <rect className="sa-body" x={30} y={30} width={260} height={110} rx={8} />
        <rect className="sa-dark" x={128} y={44} width={64} height={96} />
        <g><T type="translate" v="-34 0;0 0" d={6} ease={false} /><rect className="sa-body" x={128} y={44} width={32} height={96} /></g>
        <g><T type="translate" v="34 0;0 0" d={6} ease={false} /><rect className="sa-body" x={160} y={44} width={32} height={96} /></g>
        <circle className="sa-rec" cx={250} cy={56} r={4}><A a="opacity" v="1;0;1" d={0.6} discrete /></circle>
        <Txt x={60} y={60} s={9} c="sa-txt sa-txt-acc">B 线</Txt>
      </g>;
      return <g>
        {b.slice(0, -1).map((t, i) => <Show key={i} t0={t} t1={b[i + 1]}>{i % 2 ? <Train /> : <g><Run /><Txt x={20} y={24} s={9} c="sa-txt sa-txt-acc">A 线</Txt></g>}</Show>)}
        <Timeline cuts={b.slice(1, -1)} label="两条线交替 · 越切越短" />
      </g>;
    },
  },
  'cut-jl': {
    note: '画面还停在走廊，下一场教室里的上课铃声和说话声已经先进来了，一秒后画面才切过去——声音替画面「开门」，这叫 J 剪辑。',
    art: () => <g>
      <Show t0={0} t1={0.6}><Street /></Show>
      <Show t0={0.6} t1={1}><Room /></Show>
      <g transform="translate(0 0)">
        <rect className="sa-panel" x={18} y={134} width={284} height={40} rx={3} />
        <Txt x={24} y={146} s={6}>画面</Txt><Txt x={24} y={165} s={6}>声音</Txt>
        <rect className="sa-clip" x={50} y={140} width={146} height={8} rx={1} /><rect className="sa-clip2" x={198} y={140} width={98} height={8} rx={1} />
        <rect className="sa-clip" x={50} y={159} width={102} height={8} rx={1} /><rect className="sa-accf" x={154} y={159} width={142} height={8} rx={1} />
        <path className="sa-acc sa-dash" d="M153 156 L153 170 M197 136 L197 150" />
        <g><T type="translate" v="0 0;246 0" d={D} ease={false} /><path className="sa-acc" d="M50 136 L50 172" /></g>
      </g>
      <Show t0={0.42} t1={0.6}><Txt x={160} y={124} a="middle" s={8} c="sa-txt sa-txt-acc">♪ 下一场的声音先进来了</Txt></Show>
    </g>,
  },
  'cut-action': {
    note: '全景里手伸向门把手，动作做到一半就切到门把手特写，手接着把门拉开——切点藏在动作里，观众只看到一个连贯的开门。',
    art: () => <g>
      <Show t0={0} t1={0.5}>
        <rect className="sa-wall" x={0} y={0} width={W} height={180} />
        <path className="sa-line" d="M0 150 L320 150" />
        <rect className="sa-bld" x={170} y={30} width={70} height={120} /><circle className="sa-acc" cx={180} cy={92} r={3} />
        <Person x={130} y={150} h={110} face />
        <path className="sa-body"><A a="d" v="M143 70 L150 92 L153 92 L147 70 Z;M143 70 L175 90 L177 94 L144 74 Z;M143 70 L175 90 L177 94 L144 74 Z" kt="0;.4;1" d={3} /></path>
      </Show>
      <Show t0={0.5} t1={1}>
        <rect className="sa-wall" x={0} y={0} width={W} height={180} />
        <g><T type="skewY" v="0;0;-6;-6" kt="0;.55;.85;1" /><rect className="sa-bld" x={100} y={-20} width={240} height={220} /></g>
        <circle className="sa-body" cx={170} cy={92} r={22} /><circle className="sa-acc" cx={170} cy={92} r={8} />
        <g><T type="rotate" v="0 170 92;0 170 92;-35 170 92;-35 170 92" kt="0;.55;.75;1" /><rect className="sa-body" x={164} y={86} width={70} height={12} rx={6} /></g>
        <g><T type="translate" v="0 0;0 0;0 18;0 18" kt="0;.55;.75;1" /><path className="sa-body" d="M330 140 C290 130 250 110 222 100 C212 96 208 104 214 110 C226 120 260 140 300 170 Z" /><path className="sa-line" d="M220 98 C224 92 232 92 236 98 M226 102 C230 96 238 96 242 102" /></g>
      </Show>
      <Timeline cuts={[0.5]} label="剪在动作进行到一半" />
    </g>,
  },
  'sound-score': {
    note: '画面不变，音乐慢慢铺进来、在情绪高点涨满、最后回落：同一个日落，配了乐就从「好看」变成了「想哭」。',
    art: () => <g>
      <Sea />
      <Person x={110} y={102} h={40} />
      {[0, 1, 2, 3, 4].map((i) => <text key={i} className="sa-note" x={60 + i * 50} y={90} style={{fontSize: 14}}>{i % 2 ? '♪' : '♫'}<T type="translate" v="0 30;0 -60" d={4} ease={false} begin={`${-i * 0.8}s`} /><A a="opacity" v="0;1;0" d={4} begin={`${-i * 0.8}s`} /></text>)}
      <Wave label="配乐 · 渐强到高点再回落" amp={(t) => +(Math.min(1, 0.15 + Math.pow(Math.sin(Math.min(t / 0.75, 1) * Math.PI / 2), 2) * (t < 0.75 ? 1 : 1 - (t - 0.75) * 3)) * (0.75 + 0.25 * Math.abs(Math.sin(t * 40)))).toFixed(3)} />
    </g>,
  },
  'sound-vo': {
    note: '画面里的人一句话没说，声音从画外传来，字幕一句句出现：旁白讲的是画面拍不出来的东西——回忆、想法、结局。',
    art: () => <g>
      <rect className="sa-wall" x={0} y={0} width={W} height={180} />
      <Ridge y={96} amp={14} seed={21} c="sa-hill2" /><path className="sa-line" d="M0 112 L320 112" />
      <Walker x={160} y={112} h={70} />
      <g transform="translate(28 24)"><rect className="sa-acc" x={-4} y={-8} width={8} height={13} rx={4} /><path className="sa-acc" d="M-7 0 C-7 7 7 7 7 0 M0 7 L0 11" /><Txt x={12} y={4} s={7} c="sa-txt sa-txt-acc">VO 画外音</Txt></g>
      <Show t0={0.05} t1={0.5}><Txt x={160} y={128} a="middle" s={9} c="sa-sub">那年夏天，我第一次离开家。</Txt></Show>
      <Show t0={0.55} t1={0.98}><Txt x={160} y={128} a="middle" s={9} c="sa-sub">站台上，妈妈一直没有挥手。</Txt></Show>
      <Wave label="画外音 · 画面里没人开口" amp={(t) => ((t > 0.05 && t < 0.45) || (t > 0.55 && t < 0.93) ? +(0.3 + 0.5 * Math.abs(Math.sin(t * 47))).toFixed(3) : 0.05)} />
    </g>,
  },
  'img-tex-long-exposure': {
    note: '快门开了 30 秒：车灯拖成一条条连续的红白光轨，楼和路灯纹丝不动——动的东西变成线，不动的东西依然清楚。',
    art: () => <g>
      <rect className="sa-dark" x={0} y={0} width={W} height={180} />
      {Array.from({length: 18}, (_, i) => <circle key={i} className="sa-subj" cx={(i * 59) % 320} cy={(i * 23) % 60} r={0.6} opacity={0.5} />)}
      <Skyline x={-20} w={360} base={100} seed={36} hMin={30} hMax={80} lit={0.45} />
      <path className="sa-body" d="M0 180 C80 150 120 120 160 112 C200 104 260 104 320 100 L320 110 C260 116 210 116 170 124 C130 134 90 160 40 180 Z" />
      {[[0, '#ff6a5a'], [3, '#ff8a6a'], [8, '#fff4e0'], [11, '#ffe8c8']].map(([o, c], i) => <path key={i} d={`M${-10 + (o as number)} 180 C${80 + (o as number)} ${150 - (o as number) * 0.6} ${120 + (o as number)} ${121 - (o as number) * 0.5} 160 ${113 + (o as number) * 0.2} C200 ${105 + (o as number) * 0.4} 260 ${105 + (o as number) * 0.3} 330 ${101 + (o as number) * 0.3}`} fill="none" stroke={c as string} strokeWidth={1.4} strokeDasharray="60 14" opacity={0.85}><A a="stroke-dashoffset" v={i < 2 ? '0;-148' : '0;148'} d={1.2} ease={false} /></path>)}
      <Lamp x={60} y={160} s={1.2} /><Lamp x={240} y={108} s={0.6} />
      <Txt x={300} y={170} a="end" s={7}>快门 30 秒</Txt>
    </g>,
  },
};
void Tree; void Sun;
