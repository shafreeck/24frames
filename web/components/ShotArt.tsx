// 图版：每条术语一段 SVG 动画演示线稿，按 id 查表；没有专属演示的走同维度兜底。
// variant 区分同一页里出现两次的同一条（首页卡片 / 详情大图），滤镜 id 不能撞。
import {Defs} from './demo/kit';
import {findDemo} from './demo';

type Props = {dim: string; id?: string; seed: number; variant?: string};

export default function ShotArt({dim, id = '', variant = 'c'}: Props) {
  const demo = findDemo(id, dim);
  const u = `sa-${variant}-${id || dim}`;
  return (
    <svg className="sa" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true" data-still={demo.still ?? 3.2}>
      <Defs u={u} />
      {demo.art(u)}
    </svg>
  );
}

export {demoNote} from './demo';
