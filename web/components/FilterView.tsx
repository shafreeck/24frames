'use client';
import {Fragment, useEffect, useMemo, useRef, useState, type CSSProperties} from 'react';
import type {Item} from '../lib/content';
import {createIndex} from '../lib/search';
import ShotArt from './ShotArt';

const HUES: Record<string, number> = {story: 52, direct: 12, ai: 176, move: 26, shot: 202, lens: 268, light: 45, color: 332, comp: 158, texture: 18, tempo: 292, cut: 192, sound: 214, genre: 278, style: 4};

const MEDIA_LABEL: Record<string, string> = {video: '视频', image: '图片', plan: '编导'};

export default function FilterView({items, dimensions, table = false}: {items: Item[]; dimensions: {id: string; label: string}[]; table?: boolean}) {
  const [q, setQ] = useState('');
  const [media, setMedia] = useState('all');
  const [dim, setDim] = useState('all');
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== input.current) {
        e.preventDefault();
        input.current?.focus();
        input.current?.select();
      }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, []);

  const index = useMemo(() => createIndex(items.map((it) => ({zh: it.zh, en: it.en, key: it.say, hay: it.hay}))), [items]);
  const query = q.trim();
  const scores = useMemo(() => index.search(query), [index, query]);
  const visible = items.map((it, i) => (media === 'all' || it.media === media) && (dim === 'all' || it.dim === dim) && scores[i] > 0);
  const shown = items.filter((_, i) => visible[i]);
  // 有搜索词时按得分排序（同分保持原顺序）；没有时保持术语表的固定顺序
  const order = items.map((_, i) => i);
  if (query) order.sort((a, b) => scores[b] - scores[a] || a - b);
  const count = (m: string) => shown.filter((it) => it.media === m).length;

  function pickMedia(picked: string) {
    const next = picked !== 'all' && media === picked ? 'all' : picked;
    setMedia(next);
    if (dim !== 'all' && !items.some((it) => it.dim === dim && (next === 'all' || it.media === next))) setDim('all');
  }

  function attrs(it: Item, i: number) {
    return {'data-item': '', 'data-media': it.media, 'data-dim': it.dim, 'data-kind': it.kind, 'data-id': it.id, 'data-zh': table ? undefined : it.zh, 'data-en': table ? undefined : it.en, 'data-hay': it.hay, hidden: !visible[i]};
  }

  return <div data-filter-root="">
    <div className="filters">
      <div className="filter-bar">
        <div className="searchfield">
          <span className="searchfield__key" aria-hidden="true">/</span>
          <input ref={input} id={table ? 'q-ref' : 'q'} data-query="" type="search" autoComplete="off" placeholder="说人话也行：背景模糊 / 绕着人转一圈 / 拍得像王家卫 / dolly" aria-label="搜索术语" value={q} onChange={(e) => setQ(e.target.value)}/>
        </div>
        <div className="seg" role="group" aria-label="按介质筛选" id={table ? 'q-ref-media' : 'q-media'}>
          {[{id: 'all', label: '全部'}, {id: 'video', label: '视频'}, {id: 'image', label: '图片'}, {id: 'plan', label: '编导'}].map((m) =>
            <button key={m.id} className="seg__btn" type="button" data-fm={m.id} aria-pressed={media === m.id} onClick={() => pickMedia(m.id)}>{m.label}</button>)}
        </div>
        <span className="filter-count" data-count="">共 <strong>{shown.length}</strong> 条 · 视频 {count('video')} · 图片 {count('image')} · 编导 {count('plan')}</span>
      </div>
      <div className="pills" id={table ? 'q-ref-dims' : 'q-dims'}>
        <button className="pill" type="button" data-fd="all" aria-pressed={dim === 'all'} onClick={() => setDim('all')}>全部维度<span className="pill__n">{items.filter((it) => media === 'all' || it.media === media).length}</span></button>
        {dimensions.map((d) =>
          <button key={d.id} className="pill" type="button" data-fd={d.id} hidden={!items.some((it) => it.dim === d.id && (media === 'all' || it.media === media))} aria-pressed={dim === d.id} onClick={() => setDim(dim === d.id ? 'all' : d.id)}>
            {d.label}<span className="pill__n">{items.filter((it) => it.dim === d.id && (media === 'all' || it.media === media)).length}</span>
          </button>)}
      </div>
    </div>

    {table
      ? <div className="table-wrap">
          <table className="ref">
            <caption>{query ? '按与搜索词的相关度排列' : '按类别与组排列'}，共 {items.length} 条；表格只是索引，每条详情里才有提示词模板、翻车点与参数建议。</caption>
            <thead><tr><th>中文</th><th>English</th><th>类别</th><th>一句话</th></tr></thead>
            <tbody>{order.map((i) => { const it = items[i]; return (
              <tr key={it.id} {...attrs(it, i)}>
                <td className="zh-cell"><a href={it.url}>{it.zh}</a></td>
                <td><span className="en">{it.en}</span></td>
                <td>{it.dimLabel} · {it.group}</td>
                <td>{it.one}</td>
              </tr>); })}
            </tbody>
          </table>
        </div>
      : <div className="wall">
          {order.map((i) => { const it = items[i]; return (
            <Fragment key={it.id}>
              {!query && items.findIndex((x) => x.media === it.media) === i && <span className="wall__anchor" id={it.media} aria-hidden="true"/>}
              <a className="poster" href={it.url} {...attrs(it, i)} style={{'--hue': HUES[it.dim] ?? 210, '--i': String(i)} as CSSProperties}>
                <span className="poster__glow" aria-hidden="true"/>
                <span className="poster__art">
                  <ShotArt dim={it.dim} id={it.id} seed={i} />
                  <span className="poster__media">{MEDIA_LABEL[it.media] ?? it.mediaLabel}</span>
                  <span className="poster__no">{String(i + 1).padStart(3, '0')}</span>
                  <span className="poster__dim">{it.dimLabel}</span>
                </span>
                <span className="poster__body">
                  <span className="poster__zh">{it.zh}</span>
                  <span className="poster__en">{it.en}</span>
                  <span className="poster__one">{it.one}</span>
                  {!!it.when && <span className="poster__when">{it.when}</span>}
                  <span className="poster__tags">
                    <span className="poster__badge">{it.group}</span>
                    {it.keywords.slice(0, 3).map((k) => <span key={k}>{k}</span>)}
                  </span>
                </span>
                <span className="poster__foot">
                  <span className="poster__kind">{it.keywords.length ? `${it.keywords.length} 个关键词` : '术语'}</span>
                  <span className="poster__go">{it.promptZh || it.promptEn ? '提示词模板 →' : '详情 →'}</span>
                </span>
              </a>
            </Fragment>); })}
        </div>}

    <p className="empty" data-empty="" hidden={shown.length !== 0}>没匹配到。换个说法试试，比如「背景模糊」「镜头晃」「像老电影」，或清空后浏览全部。</p>
  </div>;
}