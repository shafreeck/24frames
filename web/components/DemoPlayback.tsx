'use client';
// 演示线稿播放控制：只让视口里的动起来；系统要求减少动态时，停在一帧有代表性的画面上。
import {useEffect} from 'react';

export default function DemoPlayback() {
  useEffect(() => {
    const svgs = Array.from(document.querySelectorAll<SVGSVGElement>('svg.sa'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    for (const s of svgs) {
      s.pauseAnimations();
      if (reduce) s.setCurrentTime(Number(s.dataset.still) || 3);
    }
    if (reduce || !('IntersectionObserver' in window)) {
      if (!reduce) svgs.forEach((s) => s.unpauseAnimations());
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const s = e.target as SVGSVGElement;
        if (e.isIntersecting) s.unpauseAnimations(); else s.pauseAnimations();
      }
    }, {rootMargin: '80px'});
    svgs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return null;
}
