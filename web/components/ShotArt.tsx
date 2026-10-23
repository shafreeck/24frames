'use client';
// 图版：每条术语一段 SVG 动画演示线稿，按 id 查表（components/demo），新条目没画演示时显示占位框。
// variant 区分同一页里出现两次的同一条（首页卡片 / 详情大图），滤镜 id 不能撞。
// 客户端组件：页面的 RSC 载荷里只带 {dim,id}，不会把整张 SVG 再序列化一遍。
import {findDemo} from './demo';

type Props = {dim: string; id?: string; seed: number; variant?: string};

export default function ShotArt({dim, id = '', variant = 'c'}: Props) {
  const demo = findDemo(id, dim);
  const u = `sa-${variant}-${id || dim}`;
  return (
    <svg className="sa" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true" data-still={demo.still ?? 3.2}>
      {demo.art(u)}
    </svg>
  );
}

