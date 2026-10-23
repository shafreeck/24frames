'use client';
// 组合提示词：在详情页把运镜、景别、光线、风格……各挑一个，拼成一条完整提示词。
// 只存在本机浏览器（localStorage），无账号、无上报；同一介质同一维度只留一个，后加的替换先加的。
import {useEffect, useState} from 'react';

export type Pick = {id: string; zh: string; en: string; dim: string; dimLabel: string; media: string; mediaLabel: string; promptZh: string; promptEn: string; rank: number};

const KEY = '24f-combo-v1', SUBJ = '24f-combo-subject';
const EVT = 'combo:change';

function load(): Pick[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
}
function save(list: Pick[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* 隐私模式下写不进去就只在本页生效 */ }
  window.dispatchEvent(new CustomEvent(EVT, {detail: list}));
}

function useCombo(): [Pick[], (l: Pick[]) => void] {
  const [list, setList] = useState<Pick[]>([]);
  useEffect(() => {
    setList(load());
    const on = (e: Event) => setList((e as CustomEvent<Pick[]>).detail ?? load());
    const st = (e: StorageEvent) => { if (e.key === KEY) setList(load()); };
    window.addEventListener(EVT, on);
    window.addEventListener('storage', st);
    return () => { window.removeEventListener(EVT, on); window.removeEventListener('storage', st); };
  }, []);
  return [list, (l) => { setList(l); save(l); }];
}

const trimEnd = (s: string) => s.trim().replace(/[。；;.,，\s]+$/, '');

/** 拼接顺序：运镜/镜头运动最先（模型权重最高），然后是你的画面内容，再按维度顺序接其余技法 */
export function compose(list: Pick[], subject: string, en = false) {
  const sorted = [...list].sort((a, b) => a.rank - b.rank);
  const first = sorted.filter((p) => p.dim === 'move');
  const rest = sorted.filter((p) => p.dim !== 'move');
  const body = (p: Pick) => trimEnd(en ? p.promptEn || p.promptZh : p.promptZh || p.promptEn);
  const subj = subject.trim() ? (en ? `Scene: ${trimEnd(subject)}` : `画面内容：${trimEnd(subject)}`) : (en ? 'Scene: [describe your subject and action]' : '画面内容：【在这里写你要拍的人、物和动作】');
  const parts = [...first.map(body), subj, ...rest.map(body)];
  return en ? parts.join('. ') + '.' : parts.join('。') + '。';
}

export function ComboButton({pick}: {pick: Pick}) {
  const [list, set] = useCombo();
  const on = list.some((p) => p.id === pick.id);
  const clash = list.find((p) => p.id !== pick.id && p.media === pick.media && p.dim === pick.dim);
  function toggle() {
    if (on) set(list.filter((p) => p.id !== pick.id));
    else set([...list.filter((p) => !(p.media === pick.media && p.dim === pick.dim)), pick]);
  }
  return <button className={`btn combo-add${on ? ' on' : ''}`} type="button" onClick={toggle} title={clash && !on ? `会替换已选的「${clash.zh}」` : undefined}>
    {on ? '✓ 已加入组合' : clash ? `＋ 替换组合里的「${clash.zh}」` : '＋ 加入组合'}
  </button>;
}

export function ComboTray() {
  const [list, set] = useCombo();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [copied, setCopied] = useState(false);
  useEffect(() => { try { setSubject(localStorage.getItem(SUBJ) || ''); } catch { /* 忽略 */ } }, []);
  useEffect(() => {
    const on = (e: Event) => { if ((e as CustomEvent<Pick[]>).detail?.length) setOpen(true); };
    window.addEventListener(EVT, on);
    return () => window.removeEventListener(EVT, on);
  }, []);
  if (!list.length) return null;

  const sorted = [...list].sort((a, b) => a.rank - b.rank);
  const media = new Set(list.map((p) => p.media));
  const text = compose(list, subject, lang === 'en');
  const editSubject = (v: string) => { setSubject(v); try { localStorage.setItem(SUBJ, v); } catch { /* 忽略 */ } };
  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch { setCopied(false); }
  }

  return <div className={`combo${open ? ' is-open' : ''}`}>
    {open && <section className="combo__panel" aria-label="组合提示词">
      <header className="combo__head">
        <h2>组合提示词</h2>
        <button className="combo__x" type="button" onClick={() => setOpen(false)} aria-label="收起">×</button>
      </header>
      <label className="combo__label" htmlFor="combo-subject">1 · 你要拍什么</label>
      <textarea id="combo-subject" className="combo__subject" rows={2} value={subject} onChange={(e) => editSubject(e.target.value)} placeholder="例如：雨夜的公交站，一个穿黄色雨衣的女孩抬头看站牌" />
      <p className="combo__label">2 · 已选技法 <span>同一类只留一个，后加的会替换</span></p>
      <ul className="combo__chips">
        {sorted.map((p) => <li key={p.id}><a href={`/term/${p.id}`}><em>{p.dimLabel}</em>{p.zh}</a><button type="button" aria-label={`移除${p.zh}`} onClick={() => set(list.filter((x) => x.id !== p.id))}>×</button></li>)}
      </ul>
      {media.size > 1 && <p className="combo__warn">同时选了视频和图片两侧的术语，生成时请只保留一侧。</p>}
      <div className="combo__label combo__row">3 · 复制结果
        <span className="combo__seg" role="group" aria-label="语言">
          <button type="button" aria-pressed={lang === 'zh'} onClick={() => setLang('zh')}>中文</button>
          <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
        </span>
      </div>
      <pre className="combo__out">{text}</pre>
      <div className="combo__actions">
        <button className={`btn primary${copied ? ' done' : ''}`} type="button" onClick={copy}>{copied ? '已复制' : '复制这条提示词'}</button>
        <button className="btn" type="button" onClick={() => set([])}>清空</button>
      </div>
    </section>}
    <button className="combo__fab" type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
      组合提示词 <b>{list.length}</b>
    </button>
  </div>;
}
