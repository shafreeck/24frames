// 运镜演示：主画面是「镜头里看到的」，左上小窗是「机位怎么动」。
// 循环节奏统一：0–10% 停 → 10–75% 运动 → 停住看结果 → 90% 起淡出复位。
import type {ReactNode} from 'react';
import {A, BackHead, Bust, CamSide, CamTop, Chair, D, type Demo, Floor, Inset, Lamp, Mv, Op, Person, Ridge, Ro, Sc, Show, Skyline, Subj, T, Table, Tree, Txt, W, Walker} from './kit';

const K = '0;.1;.75;.94;.95;1';
const seq = (a: string | number, b: string | number) => `${a};${a};${b};${b};${a};${a}`;
const Loop = ({children}: {children: ReactNode}) => <Op v="1;1;0;0;1" kt="0;.9;.94;.96;1">{children}</Op>;
const mv = (a: string, b: string) => ({v: seq(a, b), kt: K});
const sc = (a: number, b: number) => ({v: seq(a, b), kt: K});

/** 一条带天际线、地面透视的街：远景 / 中景 / 近景三层分开，便于做视差 */
const Far = ({seed = 4}: {seed?: number}) => <><Ridge y={98} amp={14} seed={seed} c="sa-hill2" /><Skyline x={-60} w={440} base={112} seed={seed} hMin={18} hMax={56} /></>;
const Ground = () => <><path className="sa-line" d="M-60 112 L380 112" /><Floor vy={112} y0={112} n={11} spread={1.2} /></>;

const camAt = (x: number, y: number, rot = 0) => `translate(${x} ${y}) rotate(${rot})`;

export const moves: Record<string, Demo> = {
  'dolly-in': {
    note: '机身真的往前走：前景路灯冲出画面最快，人物其次，远处楼几乎不动——近大远小的变化，就是「推」和「变焦放大」的区别。',
    art: () => <Loop>
      <Sc cx={160} cy={86} {...sc(1, 1.08)}><Far /></Sc>
      <Sc cx={160} cy={86} {...sc(1, 1.6)}><Ground /></Sc>
      <Sc cx={160} cy={86} {...sc(1, 2.5)}><Person x={160} y={152} h={72} /></Sc>
      <Sc cx={160} cy={86} {...sc(1, 3.4)}><Lamp x={46} y={186} s={1.5} /><Lamp x={292} y={186} s={1.5} /><Tree x={-6} y={190} s={1.6} /></Sc>
      <Inset><Subj x={42} y={18} /><g><T type="translate" {...mv('42 50', '42 32')} /><CamTop fov={22} len={16} /></g></Inset>
    </Loop>,
  },
  'dolly-out': {
    note: '机位往后退：前景从画面外慢慢进来，人物在空旷环境里越来越小——退开就是把环境还给观众。',
    art: () => <Loop>
      <Sc cx={160} cy={86} {...sc(1.08, 1)}><Far seed={7} /></Sc>
      <Sc cx={160} cy={86} {...sc(1.6, 1)}><Ground /></Sc>
      <Sc cx={160} cy={86} {...sc(2.5, 1)}><Person x={160} y={152} h={72} hairLong /><Chair x={184} y={152} s={0.9} /></Sc>
      <Sc cx={160} cy={86} {...sc(3.4, 1)}><Lamp x={40} y={186} s={1.5} /><Tree x={300} y={192} s={1.7} /></Sc>
      <Inset><Subj x={42} y={18} /><g><T type="translate" {...mv('42 32', '42 52')} /><CamTop fov={22} len={16} /></g></Inset>
    </Loop>,
  },
  pan: {
    note: '机位站着不动，只把镜头转过去：远处楼和近处人以同样速度划过画面，没有前后错位（没有视差）。',
    art: () => <Loop>
      <Mv {...mv('0 0', '-250 0')}>
        <Ridge y={98} w={620} x={-20} amp={14} seed={5} c="sa-hill2" />
        <Skyline x={-20} w={620} base={112} seed={6} hMin={16} hMax={50} />
        <path className="sa-line" d="M-20 112 L600 112" />
        <Person x={110} y={160} h={66} />
        <Table x={330} y={160} w={56} /><Chair x={365} y={160} s={1.2} />
        <Lamp x={250} y={160} s={1.1} /><Tree x={470} y={160} s={1.4} />
      </Mv>
      <Inset>
        <Subj x={18} y={18} r={3} /><Subj x={66} y={18} r={3} />
        <g transform="translate(42 48)"><g><T type="rotate" {...mv('-40', '40')} /><CamTop fov={20} len={24} /></g></g>
      </Inset>
    </Loop>,
  },
  truck: {
    note: '机位沿直线横着走、镜头朝向不变：近处的柱子掠过最快，人物其次，远处楼最慢——这层层错开的速度就是视差。',
    art: () => <Loop>
      <Mv {...mv('0 0', '-40 0')}><Far seed={9} /></Mv>
      <Mv {...mv('0 0', '-150 0')}>
        <path className="sa-line" d="M-60 112 L560 112" />
        {[0, 1, 2, 3, 4, 5].map((i) => <Person key={i} x={60 + i * 62} y={154} h={58} hairLong={i % 2 === 1} />)}
      </Mv>
      <Mv {...mv('0 0', '-320 0')}>
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} className="sa-dark" x={-10 + i * 170} y={-10} width={22} height={210} />)}
        {[0, 1, 2, 3, 4].map((i) => <path key={`l${i}`} className="sa-line" d={`M${-10 + i * 170} -10 L${-10 + i * 170} 200 M${12 + i * 170} -10 L${12 + i * 170} 200`} />)}
      </Mv>
      <Inset>
        {[0, 1, 2, 3, 4].map((i) => <Subj key={i} x={14 + i * 14} y={18} r={2.2} />)}
        <path className="sa-soft sa-dash" d="M8 48 L76 48" />
        <g><T type="translate" {...mv('18 48', '66 48')} /><CamTop fov={18} len={20} /></g>
      </Inset>
    </Loop>,
  },
  follow: {
    note: '镜头和人一起走：人在画面里始终一样大、位置不变，变的只是两边流过去的街景。',
    art: () => <g>
      <Far seed={11} />
      <path className="sa-line" d="M-20 140 L340 140" />
      <g><T type="translate" v="0 0;-80 0" d={2.2} ease={false} />
        {[0, 1, 2, 3, 4, 5].map((i) => <Lamp key={i} x={20 + i * 80} y={140} s={1.05} />)}
      </g>
      <g><T type="translate" v="0 0;-40 0" d={1.1} ease={false} />
        {Array.from({length: 11}, (_, i) => <path key={i} className="sa-soft" d={`M${i * 40} 156 L${i * 40 + 18} 156`} />)}
      </g>
      <Walker x={160} y={148} h={78} />
      <Inset>
        <path className="sa-soft sa-dash" d="M42 52 L42 6" />
        <g><T type="translate" v="0 0;0 -6;0 0" d={2.2} /><Subj x={42} y={22} r={2.6} /><g transform="translate(42 44)"><CamTop fov={20} len={14} /></g></g>
      </Inset>
    </g>,
  },
  ots: {
    note: '越过前面这个人的肩膀看对面的人：前景虚、后面实，观众自然站到了前景那个人的位置上。',
    art: (u) => <g>
      <Mv v="0 0;3 -1;0 0" d={D}>
        <rect className="sa-wall" x={-10} y={-10} width={340} height={200} />
        <path className="sa-faint" d="M200 20 L200 120 L300 120 L300 20 Z M250 20 L250 120 M200 70 L300 70" />
        <Bust x={214} y={86} s={1.15} talk />
      </Mv>
      <g filter={`url(#${u}-b1)`}><Mv v="0 0;-2 1;0 0" d={D}><BackHead x={76} y={128} s={1.9} /></Mv></g>
      <Inset>
        <Subj x={52} y={18} r={3} /><Subj x={30} y={38} r={3} />
        <g transform={camAt(24, 48, 30)}><CamTop fov={18} len={30} /></g>
      </Inset>
    </g>,
  },
  'foreground-wipe': {
    note: '镜头横移时一根近处的柱子把整个画面挡黑，挡住的瞬间换到下一场——观众看到的是一次不着痕迹的转场。',
    art: () => <g>
      <Show t0={0} t1={0.5}><Far seed={2} /><Ground /><Person x={150} y={154} h={70} /><Tree x={250} y={154} s={1.3} /></Show>
      <Show t0={0.5} t1={1}><rect className="sa-wall" x={0} y={0} width={W} height={180} /><path className="sa-faint" d="M40 30 L40 150 L120 150 L120 30 Z" /><Bust x={196} y={84} s={1.2} long /></Show>
      <g><T type="translate" v="330 0;330 0;-370 0;-370 0" kt="0;.2;.8;1" ease={false} />
        <rect className="sa-dark" x={0} y={-10} width={360} height={200} />
        <path className="sa-line" d="M0 -10 L0 200 M360 -10 L360 200" />
        <path className="sa-faint" d="M18 -10 L18 200 M342 -10 L342 200" />
      </g>
      <Inset>
        <rect className="sa-cam" x={36} y={18} width={12} height={8} />
        <path className="sa-soft sa-dash" d="M10 44 L74 44" />
        <g><T type="translate" v="12 44;12 44;72 44;72 44" kt="0;.2;.8;1" ease={false} /><CamTop fov={18} len={22} /></g>
      </Inset>
    </g>,
  },
  crane: {
    note: '机位整体升高：近处的灌木掉出画面最快，地面越看越多，人物变成环境里的一小块——高度换来了信息量。',
    art: () => <Loop>
      <Mv {...mv('0 0', '0 26')}><Far seed={13} /></Mv>
      <Mv {...mv('0 0', '0 54')}><path className="sa-line" d="M-20 112 L340 112" /><Floor vy={112} y0={112} n={13} spread={1.4} rows={7} /></Mv>
      <Sc cx={160} cy={120} {...sc(1, 0.72)}><Mv {...mv('0 0', '0 40')}><Person x={160} y={150} h={66} /><Table x={110} y={150} w={44} /></Mv></Sc>
      <Mv {...mv('0 0', '0 140')}><Tree x={30} y={200} s={2} /><Tree x={300} y={206} s={2.2} /></Mv>
      <Inset label="机位 · 侧视">
        <path className="sa-soft" d="M4 52 L80 52" />
        <path className="sa-line" d="M62 52 L62 44 M59 52 L65 52" />
        <g><T type="translate" {...mv('22 46', '22 18')} /><CamSide x={0} y={0} s={0.6} rot={22} /></g>
        <path className="sa-soft sa-dash" d="M22 48 L22 16" />
      </Inset>
    </Loop>,
  },
  orbit: {
    note: '机位绕着人画弧，人始终在画面中心：脸从一侧转到另一侧，身后的城市反方向滑过——人不用转身，是机器在转。',
    art: () => <Loop>
      <Mv {...mv('0 0', '-220 0')}><Ridge y={104} w={620} x={-20} amp={16} seed={3} c="sa-hill2" /><Skyline x={-20} w={620} base={120} seed={21} hMin={22} hMax={70} /></Mv>
      <path className="sa-line" d="M0 120 L320 120" />
      <Bust x={160} y={96} s={1.55} turn={seq('8 0', '-8 0')} />
      <Inset>
        <Subj x={42} y={30} r={3} />
        <ellipse className="sa-soft sa-dash" cx={42} cy={30} rx={20} ry={20} />
        <g><T type="rotate" v={seq('-60 42 30', '60 42 30')} kt={K} /><g transform="translate(42 50)"><CamTop fov={16} len={12} /></g></g>
      </Inset>
    </Loop>,
  },
  'dolly-zoom': {
    note: '一边后退一边推焦距：人物大小一点没变，身后的走廊却被拉长、扑过来——看起来像空间在变形，这就是眩晕感。',
    art: () => <Loop>
      <Sc cx={160} cy={84} {...sc(1, 2.1)}>
        {[0, 1, 2, 3, 4].map((i) => {
          const k = 1 - i * 0.18;
          return <rect key={i} className="sa-soft" x={160 - 150 * k} y={84 - 84 * k} width={300 * k} height={168 * k} />;
        })}
        {[[10, 0], [310, 0], [10, 168], [310, 168]].map(([x, y], i) => <path key={i} className="sa-faint" d={`M${x} ${y} L${160 + (x - 160) * 0.28} ${84 + (y - 84) * 0.28}`} />)}
        <rect className="sa-bld" x={146} y={62} width={28} height={44} />
      </Sc>
      <Bust x={160} y={100} s={1.25} blink={false} />
      <Inset>
        <Subj x={42} y={14} r={2.6} />
        <g><T type="translate" {...mv('0 0', '0 16')} />
          <path className="sa-fov"><A a="d" v={seq('M42 34 L28 14 L56 14 Z', 'M42 34 L35 14 L49 14 Z')} kt={K} /></path>
          <g transform="translate(42 36)"><CamTop wedge={false} /></g>
        </g>
      </Inset>
    </Loop>,
  },
  'macro-push': {
    note: '贴着一滴露水往前推：越近，叶脉和水珠里的高光越清楚，背景只剩一圈圈虚化光斑——平时看不见的纹理被放大成主角。',
    art: (u) => <Loop>
      <g filter={`url(#${u}-b3)`}><Sc cx={160} cy={90} {...sc(1, 1.3)}>
        {[[40, 40, 14], [90, 130, 10], [250, 36, 18], [290, 120, 12], [200, 150, 9]].map(([x, y, r], i) => <circle key={i} className="sa-bokeh" cx={x} cy={y} r={r} />)}
      </Sc></g>
      <Sc cx={176} cy={84} {...sc(1, 3)}>
        <path className="sa-body" d="M40 150 C90 80 200 50 290 60 C240 110 140 150 40 150 Z" />
        <path className="sa-soft" d="M44 148 C110 110 200 80 288 61" />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} className="sa-faint" d={`M${80 + i * 34} ${132 - i * 13} C${92 + i * 34} ${118 - i * 13} ${104 + i * 34} ${108 - i * 13} ${118 + i * 34} ${100 - i * 12}`} />)}
        <path className="sa-drop" d="M176 76 C182 76 186 81 186 86 C186 92 181 95 176 95 C171 95 166 92 166 86 C166 81 170 76 176 76 Z" />
        <path className="sa-line" d="M170 82 C171 80 173 79 175 79" />
      </Sc>
      <Txt x={300} y={168} a="end" s={7}>1 : 1</Txt>
    </Loop>,
  },
  steadicam: {
    note: '跟着人穿过一道道门，镜头像漂浮着往前滑：没有颠簸、没有剪切，空间一层层扑面而来。',
    art: () => <g>
      <Ro cx={160} cy={84} v="-1.2;1.2;-1.2" d={4}>
        {[0, 1, 2, 3].map((i) => (
          <Sc key={i} cx={160} cy={88} v="0.25;2.6" d={4} ease={false} begin={`${-i}s`}>
            <g><A a="opacity" v="0;1;1;0" kt="0;.2;.8;1" d={4} ease={false} begin={`${-i}s`} />
              <path className="sa-line" d="M100 150 L100 40 L220 40 L220 150" />
              <path className="sa-faint" d="M106 150 L106 46 L214 46 L214 150" />
            </g>
          </Sc>
        ))}
        <Floor vy={88} y0={88} n={9} spread={0.9} rows={0} />
        <Mv v="0 0;0 -1.6;0 0" d={1.1}><Person x={160} y={150} h={58} /></Mv>
      </Ro>
      <Inset>
        <path className="sa-soft sa-dash" d="M30 54 C20 40 60 34 44 22 C34 14 50 8 54 4" />
        <circle className="sa-subj" r={2.4}><animateMotion dur="4s" repeatCount="indefinite" path="M34 46 C24 34 60 30 46 18 C38 12 50 6 54 2" /></circle>
        <g><animateMotion dur="4s" repeatCount="indefinite" rotate="auto" path="M30 54 C20 40 60 34 44 22 C34 14 50 8 54 4" /><g transform="rotate(90)"><CamTop fov={18} len={10} /></g></g>
      </Inset>
    </g>,
  },
  'rise-orbit': {
    note: '一边升高一边绕：地面往下沉、背景往一侧滑，两个方向叠在一起，像史诗片里主角亮相的那一下。',
    art: () => <Loop>
      <Mv {...mv('0 0', '-160 30')}><Ridge y={98} w={560} x={-20} amp={16} seed={8} c="sa-hill2" /><Skyline x={-20} w={560} base={112} seed={17} hMin={18} hMax={56} /></Mv>
      <Mv {...mv('0 0', '0 46')}><path className="sa-line" d="M-20 112 L340 112" /><Floor vy={112} y0={112} n={13} spread={1.4} rows={6} /></Mv>
      <Sc cx={160} cy={150} {...sc(1, 0.8)}><Mv {...mv('0 0', '0 28')}><Person x={160} y={152} h={70} hairLong /></Mv></Sc>
      <Inset>
        <ellipse className="sa-faint" cx={42} cy={34} rx={24} ry={9} />
        <path className="sa-soft sa-dash" d="M18 46 C18 36 66 36 66 28 C66 20 30 18 32 10" />
        <Subj x={42} y={34} r={2.6} />
        <circle className="sa-accf" r={2.6}><animateMotion dur={`${D}s`} repeatCount="indefinite" keyPoints="0;0;1;1;0;0" keyTimes={K} calcMode="linear" path="M18 46 C18 36 66 36 66 28 C66 20 30 18 32 10" /></circle>
      </Inset>
    </Loop>,
  },
  'top-shot': {
    note: '镜头垂直朝下，像上帝视角：桌面上的东西变成一张平面图，慢慢旋转时形状和排列本身就是画面。',
    art: () => <g>
      <Ro cx={160} cy={92} v="-6;14" d={D * 2} ease={false}>
        <Sc cx={160} cy={92} v="1.08;.96;1.08" d={D * 2}>
          <rect className="sa-body" x={40} y={14} width={240} height={156} rx={4} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} className="sa-faint" d={`M44 ${30 + i * 20} C120 ${26 + i * 20} 200 ${36 + i * 20} 276 ${30 + i * 20}`} />)}
          <path className="sa-body" d="M70 40 L150 34 L156 110 L76 116 Z" /><path className="sa-body" d="M150 34 L224 40 L218 116 L156 110 Z" />
          <path className="sa-line" d="M153 34 L156 110" />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} className="sa-faint" d={`M${84} ${54 + i * 10} L${142} ${50 + i * 10} M${166} ${50 + i * 10} L${210} ${54 + i * 10}`} />)}
          <circle className="sa-body" cx={240} cy={130} r={17} /><circle className="sa-line" cx={240} cy={130} r={11} /><circle className="sa-bokeh" cx={240} cy={130} r={8} />
          <path className="sa-line" d="M257 128 C264 126 266 134 257 134" />
          <rect className="sa-body" x={88} y={128} width={22} height={38} rx={3} transform="rotate(-14 99 147)" />
          <path className="sa-acc" d="M182 132 L226 160" />
          <path className="sa-body" d="M186 186 C186 168 192 152 202 146 C208 142 214 144 214 150 C212 160 208 172 208 186 Z" />
        </Sc>
      </Ro>
      <Inset label="机位 · 侧视">
        <path className="sa-soft" d="M8 50 L76 50 M26 50 L26 44 M58 50 L58 44 M24 44 L60 44" />
        <g transform="translate(42 18)"><CamSide x={0} y={0} s={0.55} rot={90} /></g>
        <path className="sa-faint sa-dash" d="M42 24 L42 42" />
      </Inset>
    </g>,
  },
  'low-angle': {
    note: '机位贴地、镜头往上抬：人物显得高大，楼的竖线往天上收拢——同一个人，从下往上看就多了压迫和气势。',
    art: () => <Loop>
      <Sc cx={160} cy={176} {...sc(1, 1.22)}>
        {[[-20, 80], [40, 110], [250, 120], [300, 70]].map(([x, w], i) => (
          <path key={i} className="sa-bld" d={`M${x} 176 L${x + w} 176 L${x + w * 0.82 + (160 - x) * 0.18} 0 L${x + w * 0.18 + (160 - x) * 0.18} 0 Z`} />
        ))}
        <path className="sa-faint" d="M0 176 L160 -120 L320 176" />
      </Sc>
      <Sc cx={160} cy={176} {...sc(1, 1.4)}>
        <g transform="translate(160 176) scale(1.15 1.5) translate(-160 -176)"><Person x={160} y={176} h={110} /></g>
      </Sc>
      <path className="sa-line" d="M0 176 L320 176" />
      <Inset label="机位 · 侧视">
        <path className="sa-soft" d="M4 52 L80 52" />
        <path className="sa-line" d="M58 52 L58 30 M54 52 L62 52 M58 30 C55 30 54 26 58 24 C62 26 61 30 58 30" />
        <g><T type="rotate" {...mv('0 16 48', '-34 16 48')} /><CamSide x={16} y={48} s={0.55} /></g>
      </Inset>
    </Loop>,
  },
  'dutch-angle': {
    note: '机器绕镜头轴歪过去：地平线不再水平（金色虚线是本来的水平），画面立刻显得不安、失衡。',
    art: () => <Loop>
      <Ro cx={160} cy={96} {...mv('0', '-14')}>
        <g transform="translate(160 96) scale(1.25) translate(-160 -96)">
          <Far seed={23} /><Ground /><Person x={150} y={156} h={74} /><Lamp x={230} y={156} s={1.2} />
        </g>
      </Ro>
      <path className="sa-acc sa-dash" d="M20 112 L300 112" opacity={0.6} />
      <Txt x={300} y={106} a="end" s={6.5} c="sa-txt sa-txt-acc">水平</Txt>
    </Loop>,
  },
  pov: {
    note: '镜头就是角色的眼睛：画面下方是「我」的手，走路时画面跟着脚步上下起伏——观众直接成了这个人。',
    art: () => <g>
      <Mv v="0 0;0 3;0 0;0 3;0 0" d={2.2}>
        <Sc cx={160} cy={96} v="1;1.12" d={4.4} ease={false}>
          <path className="sa-wall" d="M0 0 L320 0 L320 180 L0 180 Z" />
          <path className="sa-line" d="M0 0 L120 60 L200 60 L320 0 M0 180 L120 120 L200 120 L320 180" />
          <path className="sa-soft" d="M120 60 L120 120 M200 60 L200 120" />
          <rect className="sa-bld" x={142} y={70} width={36} height={50} />
          <path className="sa-faint" d="M150 76 L170 76 L170 120 M40 20 L40 160 M280 20 L280 160" />
        </Sc>
      </Mv>
      <Mv v="0 0;0 -3;0 0;0 -3;0 0" d={2.2}>
        <path className="sa-body" d="M60 190 C70 160 88 140 104 132 C114 128 122 132 120 140 L112 150 C104 160 98 176 96 190 Z" />
        <path className="sa-body" d="M108 128 L136 120 L142 136 L114 146 Z" />
        <rect className="sa-body" x={120} y={104} width={30} height={46} rx={4} transform="rotate(-8 135 127)" />
        <path className="sa-body" d="M268 190 C258 166 246 150 230 144 C222 142 216 146 218 152 C226 162 232 176 234 190 Z" />
      </Mv>
    </g>,
  },
  handheld: {
    note: '像有人举着机器站在现场：画面不停地轻微晃、轻微歪，幅度很小但一直在动——纪实和紧张感就来自这里。',
    art: () => {
      const j = '0 0;1.6 -1;-1 1.4;2 0.6;-1.6 -0.8;0.4 1.8;-2 0.4;1 -1.6;0 0';
      return <g>
        <g><T type="translate" v={j} d={2.4} ease="0.5 0 0.5 1" /><Ro cx={160} cy={90} v="0;0.8;-0.6;0.4;-0.9;0" d={3.1}>
          <g transform="translate(160 90) scale(1.08) translate(-160 -90)">
            <rect className="sa-wall" x={-20} y={-20} width={360} height={220} />
            <path className="sa-line" d="M-20 150 L340 150" /><path className="sa-faint" d="M40 20 L40 150 M120 20 L120 150 M120 20 L40 20" />
            <Person x={196} y={168} h={96} />
            <path className="sa-soft" d="M260 40 L300 40 L300 150 L260 150 Z" />
          </g>
        </Ro></g>
        <circle className="sa-rec" cx={292} cy={20} r={3}><A a="opacity" v="1;1;0;0" kt="0;.5;.5;1" d={1.2} discrete /></circle>
        <Txt x={284} y={22.5} a="end" s={7}>REC</Txt>
      </g>;
    },
  },
  'whip-pan': {
    note: '镜头极快地甩向一边，中间整个画面糊成横向拖影，再急停在新的主体上——常被当作一刀转场使用。',
    art: (u) => <g>
      <defs><filter id={`${u}-wb`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="0 0"><A a="stdDeviation" v="0 0;0 0;22 0;0 0;0 0" kt="0;.36;.5;.64;1" /></feGaussianBlur></filter></defs>
      <g filter={`url(#${u}-wb)`}>
        <Mv v="0 0;0 0;-320 0;-320 0;0 0;0 0" kt="0;.36;.64;.95;.96;1">
          <rect className="sa-wall" x={-20} y={-20} width={700} height={220} />
          <Far seed={31} /><path className="sa-line" d="M0 130 L640 130" />
          <Person x={150} y={156} h={78} />
          <g transform="translate(320 0)"><Bust x={170} y={86} s={1.2} long talk /><Lamp x={70} y={170} s={1.3} /></g>
        </Mv>
      </g>
      <Op v="0;0;1;0;0" kt="0;.4;.5;.6;1">{[30, 60, 90, 120, 150].map((y, i) => <path key={i} className="sa-acc" d={`M${60 + i * 8} ${y} L${200 + i * 6} ${y}`} opacity={0.5} />)}</Op>
      <Inset><Subj x={14} y={18} r={2.6} /><Subj x={70} y={18} r={2.6} /><g transform="translate(42 48)"><g><T type="rotate" v="-42;-42;42;42;-42;-42" kt="0;.36;.64;.95;.96;1" /><CamTop fov={18} len={24} /></g></g></Inset>
    </g>,
  },
  fpv: {
    note: '穿越机贴着楼缝高速往前钻，拐弯时整个画面侧倾：前方的楼一层层扑过来，速度感来自「近」和「倾斜」。',
    art: () => <g>
      <Ro cx={160} cy={90} v="-9;9;-9" d={3.2}>
        <rect className="sa-wall" x={-40} y={-40} width={400} height={260} />
        <Floor vy={92} y0={92} n={13} spread={1.6} rows={0} />
        {[0, 1, 2, 3].map((i) => (
          <Sc key={i} cx={160} cy={92} v="0.3;3.4" d={1.6} ease={false} begin={`${-i * 0.4}s`}>
            <g><A a="opacity" v="0;1;1;0" kt="0;.2;.7;1" d={1.6} ease={false} begin={`${-i * 0.4}s`} />
              <rect className="sa-bld" x={70} y={30} width={50} height={100} /><rect className="sa-bld" x={200} y={20} width={56} height={110} />
              <path className="sa-faint" d="M78 40 L112 40 M78 52 L112 52 M78 64 L112 64 M208 34 L248 34 M208 48 L248 48 M208 62 L248 62" />
            </g>
          </Sc>
        ))}
        <path className="sa-line" d="M-40 92 L360 92" />
      </Ro>
      <Inset>
        <rect className="sa-cam" x={26} y={14} width={10} height={14} /><rect className="sa-cam" x={48} y={26} width={10} height={14} />
        <path className="sa-soft sa-dash" d="M42 54 C30 44 52 36 42 26 C34 18 44 10 50 4" />
        <g><animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto" path="M42 54 C30 44 52 36 42 26 C34 18 44 10 50 4" /><g transform="rotate(90)"><CamTop fov={20} len={10} /></g></g>
      </Inset>
    </g>,
  },
};
