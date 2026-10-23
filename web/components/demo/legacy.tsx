// 图版：每张卡画它自己的技法结构，而不是同一套线框母版的翻转与位移。
// 同维度共享母题，具体条目按 id 换结构；seed 只做确定性微扰，保证服务端与水合一致。
type Props = { dim: string; id?: string; seed: number };

const L = ({ x1, y1, x2, y2, c = 'sa-soft' }: { x1: number; y1: number; x2: number; y2: number; c?: string }) => (
  <line className={c} x1={x1} y1={y1} x2={x2} y2={y2} />
);
const B = ({ x, y, w, h, c = 'sa-line', r = 1.5 }: { x: number; y: number; w: number; h: number; c?: string; r?: number }) => (
  <rect className={c} x={x} y={y} width={w} height={h} rx={r} />
);
const C = ({ cx, cy, r, c = 'sa-line' }: { cx: number; cy: number; r: number; c?: string }) => (
  <circle className={c} cx={cx} cy={cy} r={r} />
);
const D = ({ cx, cy, r = 1.8 }: { cx: number; cy: number; r?: number }) => (
  <circle className="sa-dot" cx={cx} cy={cy} r={r} />
);
const P = ({ d, c = 'sa-line' }: { d: string; c?: string }) => <path className={c} d={d} />;
const F = ({ d }: { d: string }) => <path className="sa-fill" d={d} />;

function Head({ x, y, deg, s = 4.4 }: { x: number; y: number; deg: number; s?: number }) {
  const r = (deg * Math.PI) / 180;
  return (
    <path
      className="sa-dot"
      d={`M${x} ${y} L${x + s * Math.cos(r + 2.55)} ${y + s * Math.sin(r + 2.55)} L${x + s * Math.cos(r - 2.55)} ${y + s * Math.sin(r - 2.55)} Z`}
    />
  );
}

// 人形示意：头 + 肩线，用于景别与机位
function Figure({ cx, cy, h }: { cx: number; cy: number; h: number }) {
  const hr = h * 0.13;
  const sw = h * 0.34;
  return (
    <>
      <C cx={cx} cy={cy - h * 0.34} r={hr} />
      <P d={`M${cx - sw / 2} ${cy + h * 0.16} C${cx - sw / 2 + 2} ${cy} ${cx + sw / 2 - 2} ${cy} ${cx + sw / 2} ${cy + h * 0.16}`} />
    </>
  );
}

function Frame({ children, tilt = 0 }: { children: React.ReactNode; tilt?: number }) {
  return (
    <svg viewBox="0 0 150 84" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g transform={tilt ? `rotate(${tilt} 75 42)` : undefined}>{children}</g>
    </svg>
  );
}

// ── 运镜：轨迹 + 取景框 + 主体，按技法换结构 ───────────────────────────────
function Move({ id, seed }: { id: string; seed: number }) {
  const s = id.toLowerCase();
  const sway = ((seed % 4) - 1.5) * 2;

  if (s.includes('dolly-zoom')) {
    return (
      <Frame tilt={sway * 0.4}>
        <B x={46} y={14} w={58} h={56} />
        <B x={58} y={24} w={34} h={36} c="sa-soft" />
        <D cx={75} cy={42} r={2.1} />
        <L x1={36} y1={42} x2={16} y2={42} />
        <Head x={16} y={42} deg={180} />
        <L x1={114} y1={42} x2={134} y2={42} />
        <Head x={134} y={42} deg={0} />
        <P d="M20 18 L34 28" c="sa-soft" />
        <P d="M130 18 L116 28" c="sa-soft" />
        <P d="M20 66 L34 56" c="sa-soft" />
        <P d="M130 66 L116 56" c="sa-soft" />
      </Frame>
    );
  }

  if (s.includes('whip')) {
    return (
      <Frame>
        {[0, 1, 2, 3, 4].map((i) => (
          <L key={i} x1={12 + i * 6} y1={26 + i * 8} x2={96 + i * 4} y2={26 + i * 8} c={i % 2 ? 'sa-soft' : 'sa-line'} />
        ))}
        <B x={104} y={26} w={30} h={32} c="sa-soft" />
        <P d="M132 20 L142 34" c="sa-soft" />
      </Frame>
    );
  }

  if (s.includes('handheld')) {
    const jit = [0, 3, -2, 4, -3, 2, -4, 1];
    return (
      <Frame>
        <P d={`M14 56 ${jit.map((j, i) => `L${22 + i * 9} ${56 + j}`).join(' ')}`} c="sa-soft" />
        <B x={54} y={20} w={42} h={40} c="sa-soft" />
        <Figure cx={75} cy={54} h={34} />
      </Frame>
    );
  }

  if (s.includes('fpv')) {
    return (
      <Frame>
        <B x={30} y={20} w={90} h={44} c="sa-soft" />
        <P d="M118 74 C96 62 82 54 58 46" c="sa-line" />
        <Head x={58} y={46} deg={210} />
        <P d="M124 66 L142 54" c="sa-soft" />
        <P d="M130 74 L146 66" c="sa-soft" />
        <C cx={75} cy={42} r={5} c="sa-soft" />
      </Frame>
    );
  }

  if (s.includes('foreground-wipe') || s.includes('foreground')) {
    return (
      <Frame>
        <B x={44} y={18} w={92} h={48} c="sa-soft" />
        <Figure cx={90} cy={54} h={30} />
        <F d="M6 8 L58 0 L50 84 L0 84 Z" />
        <P d="M6 8 L58 0" />
        <P d="M46 40 L96 40" c="sa-soft" />
        <Head x={96} y={40} deg={0} />
      </Frame>
    );
  }

  if (s.includes('macro')) {
    return (
      <Frame>
        <C cx={76} cy={42} r={26} c="sa-soft" />
        <C cx={76} cy={42} r={18} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <L key={i} x1={62 + i * 5} y1={32} x2={62 + i * 5} y2={52} c="sa-soft" />
        ))}
        <L x1={112} y1={62} x2={136} y2={78} />
        <Head x={112} y={62} deg={215} />
      </Frame>
    );
  }

  if (s.includes('top-shot') || s.includes('birds-eye') || s.includes('birdeye')) {
    return (
      <Frame>
        <B x={16} y={10} w={118} h={64} c="sa-soft" />
        <C cx={75} cy={42} r={22} c="sa-soft" />
        <C cx={75} cy={42} r={12} />
        <D cx={75} cy={42} r={2.4} />
        <P d="M75 20 L75 12" c="sa-soft" />
        <P d="M75 64 L75 72" c="sa-soft" />
        <P d="M53 42 L45 42" c="sa-soft" />
        <P d="M97 42 L105 42" c="sa-soft" />
        <P d="M28 76 L40 64" c="sa-soft" />
      </Frame>
    );
  }

  if (s.includes('low-angle')) {
    return (
      <Frame>
        <L x1={0} y1={70} x2={150} y2={70} />
        <P d="M0 70 L46 18" c="sa-soft" />
        <P d="M150 70 L104 18" c="sa-soft" />
        <P d="M0 70 L150 70" c="sa-soft" />
        <Figure cx={75} cy={64} h={56} />
        <P d="M75 14 L75 6" c="sa-soft" />
        <Head x={75} y={14} deg={270} />
      </Frame>
    );
  }

  if (s.includes('dutch')) {
    return (
      <Frame tilt={-13}>
        <L x1={8} y1={58} x2={142} y2={58} />
        <B x={50} y={16} w={50} h={34} c="sa-soft" />
        <Figure cx={75} cy={50} h={30} />
        <L x1={8} y1={70} x2={142} y2={70} c="sa-soft" />
      </Frame>
    );
  }

  if (s === 'pov' || s.includes('pov')) {
    return (
      <Frame>
        <B x={34} y={14} w={82} h={38} c="sa-soft" />
        <P d="M18 84 C22 62 40 56 52 66" c="sa-line" />
        <P d="M132 84 C128 62 110 56 98 66" c="sa-line" />
        <Circle2 cx={57} cy={62} />
        <Circle2 cx={93} cy={62} />
        <P d="M70 30 L80 30" c="sa-soft" />
      </Frame>
    );
  }

  if (s.includes('ots') || s.includes('over-the-shoulder') || s.includes('shoulder')) {
    return (
      <Frame>
        <P d="M0 84 C6 40 34 22 56 30" c="sa-line" />
        <P d="M22 84 C30 56 40 44 54 40" c="sa-soft" />
        <Figure cx={104} cy={58} h={30} />
        <B x={80} y={14} w={54} h={26} c="sa-soft" />
      </Frame>
    );
  }

  if (s.includes('orbit') && s.includes('rise')) {
    return (
      <Frame>
        <P d="M46 72 C30 50 46 26 76 24 C104 22 122 40 118 58" />
        <Head x={118} y={58} deg={75} />
        <C cx={76} cy={52} r={3} c="sa-soft" />
        <P d="M76 52 L76 34" c="sa-soft" />
        <Head x={76} y={34} deg={270} />
        <P d="M40 76 C34 60 42 44 56 36" c="sa-soft" />
      </Frame>
    );
  }

  if (s.includes('orbit')) {
    return (
      <Frame>
        <P d="M22 56 C22 26 128 26 128 56 C128 78 22 78 22 56" c="sa-soft" />
        <P d="M128 56 C128 46 120 40 110 38" />
        <Head x={110} y={38} deg={200} />
        <Figure cx={75} cy={58} h={28} />
        <D cx={75} cy={72} r={1.4} />
      </Frame>
    );
  }

  if (s.includes('steadicam')) {
    return (
      <Frame>
        <P d={`M14 ${62 + sway} C40 46 60 66 86 ${56 - sway} C104 48 118 54 136 46`} />
        <Head x={136} y={46} deg={-18} />
        <Figure cx={78} cy={66} h={26} />
        <L x1={78} y1={46} x2={78} y2={36} c="sa-soft" />
      </Frame>
    );
  }

  if (s.includes('crane') || s.includes('rise')) {
    return (
      <Frame>
        <L x1={0} y1={72} x2={150} y2={72} c="sa-soft" />
        <L x1={34} y1={72} x2={34} y2={20} />
        <Head x={34} y={20} deg={270} />
        {[0, 1, 2, 3].map((i) => (
          <L key={i} x1={28} y1={64 - i * 12} x2={40} y2={64 - i * 12} c="sa-soft" />
        ))}
        <B x={78} y={28} w={56} h={32} c="sa-soft" />
        <Figure cx={106} cy={58} h={26} />
      </Frame>
    );
  }

  if (s.includes('zoom') || s.includes('push-in') || s.includes('dolly-in')) {
    return (
      <Frame>
        <B x={18} y={12} w={114} h={60} c="sa-soft" />
        <B x={44} y={24} w={62} h={36} c="sa-soft" />
        <B x={58} y={30} w={34} h={24} />
        <Figure cx={75} cy={54} h={22} />
        <L x1={12} y1={42} x2={30} y2={42} />
        <Head x={30} y={42} deg={0} />
      </Frame>
    );
  }

  if (s.includes('dolly-out') || s.includes('pull')) {
    return (
      <Frame>
        <B x={58} y={30} w={34} h={24} />
        <B x={44} y={24} w={62} h={36} c="sa-soft" />
        <B x={18} y={12} w={114} h={60} c="sa-soft" />
        <Figure cx={75} cy={54} h={22} />
        <L x1={30} y1={42} x2={12} y2={42} />
        <Head x={12} y={42} deg={180} />
      </Frame>
    );
  }

  if (s.includes('truck') || s.includes('track') || s.includes('dolly')) {
    return (
      <Frame>
        <L x1={10} y1={66} x2={140} y2={66} c="sa-soft" />
        <L x1={10} y1={72} x2={140} y2={72} c="sa-soft" />
        <B x={52 + sway} y={18} w={42} h={38} c="sa-soft" />
        <Figure cx={73 + sway} cy={50} h={26} />
        <L x1={22} y1={30} x2={44} y2={30} c="sa-soft" />
        <L x1={22} y1={36} x2={40} y2={36} c="sa-soft" />
        <Head x={46} y={30} deg={0} s={3.6} />
      </Frame>
    );
  }

  if (s.includes('pan')) {
    return (
      <Frame>
        <P d="M18 62 C40 22 110 22 132 62" c="sa-soft" />
        <L x1={18} y1={56} x2={18} y2={68} />
        <L x1={132} y1={56} x2={132} y2={68} />
        <P d="M44 44 L44 40" c="sa-soft" />
        <Figure cx={75} cy={62} h={26} />
        <Head x={126} y={58} deg={-22} />
      </Frame>
    );
  }

  if (s.includes('follow')) {
    return (
      <Frame>
        <Figure cx={92} cy={58} h={30} />
        {[0, 1, 2].map((i) => (
          <L key={i} x1={18 + i * 8} y1={30 + i * 6} x2={62 + i * 8} y2={30 + i * 6} c={i === 2 ? 'sa-line' : 'sa-soft'} />
        ))}
        <Head x={86} y={42} deg={0} />
        <L x1={18} y1={72} x2={132} y2={72} c="sa-soft" />
      </Frame>
    );
  }

  // 默认运镜：轨迹 + 取景框
  return (
    <Frame>
      <L x1={14} y1={26} x2={74} y2={26} c="sa-soft" />
      <L x1={14} y1={64} x2={64} y2={64} c="sa-soft" />
      <L x1={16} y1={45} x2={106} y2={45} />
      <Head x={106} y={45} deg={0} />
      <B x={112} y={30} w={22} h={30} />
      <D cx={123} cy={45} r={1.9} />
    </Frame>
  );
}

// 小块手/镜片占位，避免与 C 的类名混淆
function Circle2({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <C cx={cx} cy={cy} r={5} c="sa-soft" />
      <D cx={cx} cy={cy} r={1.3} />
    </>
  );
}

function Shot({ id }: { id: string }) {
  const s = id.toLowerCase();
  if (s.includes('extreme-wide')) return (<Frame><B x={10} y={8} w={130} h={24} c="sa-soft" /><Figure cx={75} cy={74} h={8} /><L x1={10} y1={64} x2={140} y2={64} c="sa-soft" /><D cx={75} cy={74} r={1.2} /></Frame>);
  if (s.includes('wide') || s.includes('long')) return (<Frame><B x={10} y={8} w={130} h={68} c="sa-soft" /><Figure cx={75} cy={72} h={16} /><L x1={10} y1={58} x2={140} y2={58} c="sa-soft" /></Frame>);
  if (s.includes('extreme-close') || s.includes('macro')) return (<Frame><C cx={75} cy={42} r={26} /><D cx={68} cy={36} r={2} /><D cx={84} cy={50} r={1.4} /><P d="M96 30 L118 18" c="sa-soft" /></Frame>);
  if (s.includes('close') || s.includes('tight')) return (<Frame><B x={44} y={10} w={62} h={64} /><Figure cx={75} cy={72} h={44} /><P d="M60 30 L90 30" c="sa-soft" /></Frame>);
  if (s.includes('medium') || s.includes('waist')) return (<Frame><B x={34} y={10} w={82} h={64} c="sa-soft" /><Figure cx={75} cy={70} h={34} /><L x1={34} y1={54} x2={116} y2={54} c="sa-soft" /></Frame>);
  return (<Frame><B x={26} y={12} w={98} h={60} c="sa-soft" /><Figure cx={75} cy={68} h={28} /></Frame>);
}

function Lens({ id }: { id: string }) {
  const s = id.toLowerCase();
  const rings = s.includes('tele') || s.includes('long') ? 3 : s.includes('wide') ? 1 : 2;
  return (
    <Frame>
      {[0, 1, 2, 3].slice(0, rings + 1).map((i) => (
        <C key={i} cx={75} cy={42} r={34 - i * 8} c={i === rings ? 'sa-line' : 'sa-soft'} />
      ))}
      <D cx={75} cy={42} r={2} />
      <L x1={8} y1={42} x2={41} y2={42} c="sa-soft" />
      <L x1={109} y1={42} x2={142} y2={42} c="sa-soft" />
      {s.includes('tilt') && <L x1={30} y1={68} x2={120} y2={20} c="sa-soft" />}
    </Frame>
  );
}

function Light({ id }: { id: string }) {
  const s = id.toLowerCase();
  const lx = s.includes('back') ? 132 : s.includes('side') || s.includes('rembrandt') ? 34 : 75;
  return (
    <Frame>
      <D cx={lx} cy={12} r={2.6} />
      <F d={`M${lx - 4} 12 L${lx - 44} 76 L${lx + 44} 76 Z`} />
      <P d={`M${lx} 12 L${lx - 40} 76`} c="sa-soft" />
      <P d={`M${lx} 12 L${lx + 40} 76`} c="sa-soft" />
      <Figure cx={75} cy={64} h={34} />
      <L x1={8} y1={76} x2={142} y2={76} c="sa-soft" />
    </Frame>
  );
}

function Color({ id }: { id: string }) {
  const s = id.toLowerCase();
  const mono = s.includes('mono') || s.includes('single') || s.includes('desat');
  const bands = mono ? 1 : 4;
  return (
    <Frame>
      {Array.from({ length: bands }, (_, i) => (
        <B key={i} x={16 + i * (110 / bands)} y={18} w={110 / bands - (mono ? 0 : 4)} h={48} c="sa-soft" />
      ))}
      {!mono && <P d="M16 74 L126 74" c="sa-soft" />}
      {mono && <P d="M20 42 L122 42" c="sa-line" />}
      <D cx={mono ? 71 : 16} cy={42} r={2} />
    </Frame>
  );
}

function Comp({ id }: { id: string }) {
  const s = id.toLowerCase();
  if (s.includes('center') || s.includes('symmetr')) return (<Frame><L x1={75} y1={6} x2={75} y2={78} c="sa-soft" /><L x1={8} y1={42} x2={142} y2={42} c="sa-soft" /><Figure cx={75} cy={64} h={30} /><D cx={75} cy={42} r={2} /></Frame>);
  if (s.includes('frame') || s.includes('box')) return (<Frame><B x={12} y={10} w={126} h={64} c="sa-soft" /><B x={44} y={26} w={62} h={34} /><Figure cx={75} cy={62} h={24} /></Frame>);
  return (
    <Frame>
      <L x1={50} y1={6} x2={50} y2={78} c="sa-soft" />
      <L x1={100} y1={6} x2={100} y2={78} c="sa-soft" />
      <L x1={8} y1={28} x2={142} y2={28} c="sa-soft" />
      <L x1={8} y1={56} x2={142} y2={56} c="sa-soft" />
      <Figure cx={88} cy={64} h={26} />
    </Frame>
  );
}

function Texture({ id }: { id: string }) {
  const s = id.toLowerCase();
  if (s.includes('grain') || s.includes('film')) {
    return (
      <Frame>
        {Array.from({ length: 26 }, (_, i) => (
          <D key={i} cx={10 + ((i * 41) % 130)} cy={8 + ((i * 29) % 68)} r={i % 3 === 0 ? 1.1 : 0.7} />
        ))}
      </Frame>
    );
  }
  return (
    <Frame>
      {Array.from({ length: 8 }, (_, i) => (
        <L key={`a${i}`} x1={4 + i * 18} y1={0} x2={-24 + i * 18} y2={84} c="sa-soft" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <L key={`b${i}`} x1={-8 + i * 26} y1={84} x2={44 + i * 26} y2={0} c="sa-soft" />
      ))}
    </Frame>
  );
}

function Tempo({ id }: { id: string }) {
  const s = id.toLowerCase();
  const dense = s.includes('fast') || s.includes('rush');
  const bars = dense ? 16 : 9;
  return (
    <Frame>
      {Array.from({ length: bars }, (_, i) => (
        <L
          key={i}
          x1={14 + i * (122 / bars)}
          y1={70}
          x2={14 + i * (122 / bars)}
          y2={70 - (i % 4 === 0 ? 44 : i % 2 === 0 ? 26 : 14)}
          c={i % 4 === 0 ? 'sa-line' : 'sa-soft'}
        />
      ))}
      <L x1={10} y1={70} x2={140} y2={70} c="sa-soft" />
    </Frame>
  );
}

function Cut({ id }: { id: string }) {
  const s = id.toLowerCase();
  const diagonal = s.includes('whip') || s.includes('match');
  return (
    <Frame>
      <B x={10} y={14} w={62} h={56} c="sa-soft" />
      <B x={78} y={18} w={62} h={52} c="sa-soft" />
      {diagonal ? (
        <>
          <P d="M70 4 L82 80" />
          <F d="M70 4 L82 80 L150 80 L150 4 Z" />
        </>
      ) : (
        <>
          <L x1={75} y1={0} x2={75} y2={84} />
          <P d="M40 42 L64 42" c="sa-soft" />
          <P d="M86 42 L110 42" c="sa-soft" />
        </>
      )}
    </Frame>
  );
}

function Sound({ id }: { id: string }) {
  const s = id.toLowerCase();
  const env = s.includes('riser') ? [1, 2, 3, 5, 8, 12, 18, 26, 30, 24, 12, 5, 2] : [3, 9, 4, 16, 6, 26, 9, 15, 5, 22, 7, 12, 3];
  return (
    <Frame>
      <L x1={8} y1={42} x2={142} y2={42} c="sa-soft" />
      <P d={env.map((a, i) => `${i === 0 ? 'M' : 'L'}${12 + i * (124 / (env.length - 1))} ${42 - a}`).join(' ')} />
      <P d={env.map((a, i) => `${i === 0 ? 'M' : 'L'}${12 + i * (124 / (env.length - 1))} ${42 + a * 0.62}`).join(' ')} c="sa-soft" />
    </Frame>
  );
}

function Genre({ id, seed }: { id: string; seed: number }) {
  const s = id.toLowerCase();
  if (s.includes('western')) return (<Frame><L x1={6} y1={66} x2={144} y2={66} c="sa-soft" /><C cx={112} cy={24} r={9} /><P d="M0 66 L34 46 L52 58 L74 40 L100 66" c="sa-soft" /><Figure cx={58} cy={64} h={18} /></Frame>);
  if (s.includes('noir')) return (<Frame><F d="M0 0 L74 0 L56 84 L0 84 Z" /><P d="M74 0 L56 84" c="sa-soft" /><Figure cx={104} cy={64} h={30} /></Frame>);
  if (s.includes('cyber') || s.includes('neon')) return (<Frame>{[0, 1, 2, 3, 4].map((i) => (<B key={i} x={14 + i * 26} y={20 + (i % 3) * 8} w={18} h={44 - (i % 3) * 10} c="sa-soft" />))}<L x1={6} y1={74} x2={144} y2={74} /></Frame>);
  const hues = [0, 1, 2, 3].map((i) => i);
  return (<Frame>{hues.map((i) => (<B key={i} x={18 + i * 30} y={20} w={22} h={44} c="sa-soft" />))}<D cx={75} cy={42} r={2} /></Frame>);
}

function Style({ id, seed }: { id: string; seed: number }) {
  const s = id.toLowerCase();
  const k = (seed % 5) + 1;
  if (s.includes('collage')) return (<Frame>{[0, 1, 2, 3].map((i) => (<B key={i} x={14 + i * 22} y={14 + ((i + k) % 3) * 6} w={34} h={44 - ((i + k) % 3) * 8} c={i === 1 ? 'sa-line' : 'sa-soft'} />))}</Frame>);
  if (s.includes('ccd') || s.includes('retro') || s.includes('film')) return (<Frame><B x={14} y={12} w={122} h={60} c="sa-soft" />{Array.from({ length: 18 }, (_, i) => (<D key={i} cx={10 + ((i * 37) % 130)} cy={10 + ((i * 23) % 64)} r={i % 4 === 0 ? 1.3 : 0.8} />))}<L x1={14} y1={72} x2={136} y2={72} c="sa-soft" /></Frame>);
  if (s.includes('water') || s.includes('ink')) return (<Frame><P d="M10 56 C40 24 74 68 108 34 C122 22 136 28 142 36" c="sa-soft" /><P d="M10 66 C44 40 78 76 112 48" /><D cx={96} cy={30} r={2} /></Frame>);
  return (<Frame><F d="M18 74 L62 12 L106 74 Z" /><P d="M18 74 L62 12 L106 74 Z" /><D cx={62} cy={58} r={2} /></Frame>);
}

export default function LegacyArt({ dim, id = '', seed }: Props) {
  switch (dim) {
    case 'move':
      return <Move id={id} seed={seed} />;
    case 'shot':
      return <Shot id={id} />;
    case 'lens':
      return <Lens id={id} />;
    case 'light':
      return <Light id={id} />;
    case 'color':
      return <Color id={id} />;
    case 'comp':
      return <Comp id={id} />;
    case 'texture':
      return <Texture id={id} />;
    case 'tempo':
      return <Tempo id={id} />;
    case 'cut':
      return <Cut id={id} />;
    case 'sound':
      return <Sound id={id} />;
    case 'genre':
      return <Genre id={id} seed={seed} />;
    case 'style':
      return <Style id={id} seed={seed} />;
    default:
      return <Shot id={id} />;
  }
}