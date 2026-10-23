import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {getItems,SITE_NAME,DIM_ORDER} from '../../../lib/content';
import {ComboButton} from '../../../components/Combo';
import CopyButton from '../../../components/CopyButton';
import ShotArt from '../../../components/ShotArt';
import {demoNote} from '../../../components/demo';

type Props={params:Promise<{id:string}>};
type Section={key:string;title:string;body:ReactNode;action?:ReactNode};

const pad=(n:number)=>String(n).padStart(3,'0');
const idx=(n:number)=>String(n).padStart(2,'0');

export const dynamicParams=false;
export function generateStaticParams(){return getItems().map(it=>({id:it.id}));}

export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {id}=await params;
  const it=getItems().find(it=>it.id===id);
  if(!it)return {};
  return {title:`${it.zh} ${it.en}｜${SITE_NAME}`,description:`${it.kindLabel}术语：${it.zh}（${it.en}）。${it.one}`};
}

export default async function Term({params}:Props){
  const {id}=await params;
  const all=getItems();
  const it=all.find(x=>x.id===id);
  if(!it)notFound();

  const index=all.indexOf(it);
  const prev=all[index-1],next=all[index+1];
  const group=all.filter(x=>x.id!==it.id&&x.group===it.group&&x.kind===it.kind);
  const related=(group.length?group:all.filter(x=>x.id!==it.id&&x.kind===it.kind)).slice(0,4);
  const sameDim=all.filter(x=>x.id!==it.id&&x.dim===it.dim&&x.media===it.media).slice(0,6);

  const sections:Section[]=[];
  if(it.when)sections.push({key:'when',title:'什么时候用',body:<p>{it.when}</p>});
  if(it.keywords.length)sections.push({key:'keywords',title:'风格关键词',body:<ul className="td-kw">{it.keywords.map(k=><li key={k}>{k}</li>)}</ul>});
  if(it.promptZh)sections.push({
    key:'prompt-zh',title:'提示词模板 · 中文',
    action:<CopyButton text={it.promptZh}/>,
    body:<pre className="td-pre">{it.promptZh}</pre>,
  });
  if(it.promptEn)sections.push({
    key:'prompt-en',title:'提示词模板 · English',
    action:<CopyButton english text={it.promptEn}/>,
    body:<pre className="td-pre td-pre--en">{it.promptEn}</pre>,
  });
  if(it.demoPrompt)sections.push({
    key:'demo',title:(it.dim==='story'||it.id==='dir-shot-list')?'样例提示词 · 直接问对话模型':`样例提示词 · 直接生成${it.media==='image'?'图片':'视频'}`,
    action:<CopyButton text={it.demoPrompt} label="复制样例"/>,
    body:<>
      <p className="td-note">{(it.dim==='story'||it.id==='dir-shot-list')
        ?'这一条是写给 ChatGPT、Claude、豆包这类对话模型的：把方括号里的想法换成你自己的，它会帮你写故事、改剧本。'
        :it.media==='image'
        ?'本条技法写在最前，后面是具体的主体、场景、细节与画幅；复制后直接投给图片模型，把主体换成你自己的即可。'
        :'本条技法写在最前，后面带场景、动作、表演与时长；复制后直接投给视频模型，把人物和情节换成你自己的即可。'}</p>
      <pre className="td-pre">{it.demoPrompt}</pre>
    </>,
  });
  if(it.fail.length)sections.push({key:'fail',title:'容易翻车',body:<ul className="td-fail">{it.fail.map(f=><li key={f}>{f}</li>)}</ul>});
  if(it.params)sections.push({key:'params',title:'参数建议',body:<p>{it.params}</p>});

  const ld={
    '@context':'https://schema.org',
    '@type':'DefinedTerm',
    name:`${it.zh}（${it.en}）`,
    description:it.one,
    inDefinedTermSet:{'@type':'DefinedTermSet',name:'二十四格 · AI 影像镜头语言库'},
  };

  return <div className="wrap td">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld).replace(/</g,'\\u003c')}}/>

    <nav className="td-crumbs" aria-label="位置">
      <a href="/">全部</a>
      <span className="sep">/</span>
      <a href={`/#${it.media}`}>{it.mediaLabel} · {it.dimLabel}</a>
      <span className="sep">/</span>
      <span className="cur">{it.zh}</span>
    </nav>

    <div className="td-hero">
      <figure className="td-figure">
        <div className="td-art">
          <ShotArt dim={it.dim} id={it.id} seed={index} variant="d"/>
          <span className="td-art__scan" aria-hidden="true"/>
          <span className="td-art__tag">{it.mediaLabel} · {it.dimLabel}</span>
          <span className="td-art__no">NO.{pad(index+1)} <em>/ {pad(all.length)}</em></span>
        </div>
        <figcaption className="td-cap"><span><strong>看动画：</strong>{demoNote(it.id,it.dim)}<em>线稿演示，只示意技法本身，不是成片画面。</em></span></figcaption>
      </figure>

      <div className="td-meta">
        <p className="td-eyebrow">{it.mediaLabel} · {it.dimLabel}</p>
        <h1 className="td-h1">{it.zh}<span>{it.en}</span></h1>
        <p className="td-lead">{it.one}</p>

        <dl className="td-spec">
          <div><dt>类别</dt><dd>{it.dimLabel}</dd></div>
          <div><dt>分组</dt><dd>{it.group}</dd></div>
          {it.keywords.length?<div><dt>关键词</dt><dd>{it.keywords.length} 个</dd></div>:<div><dt>介质</dt><dd>{it.mediaLabel}</dd></div>}
          <div><dt>全库</dt><dd>{pad(index+1)} / {pad(all.length)}</dd></div>
        </dl>

        <div className="td-actions">
          {it.promptZh&&<CopyButton primary text={it.promptZh}/>}
          {it.promptEn&&<CopyButton english text={it.promptEn}/>}
          {!['story','direct','ai'].includes(it.dim)&&<ComboButton pick={{id:it.id,zh:it.zh,en:it.en,dim:it.dim,dimLabel:it.dimLabel,media:it.media,mediaLabel:it.mediaLabel,promptZh:it.promptZh,promptEn:it.promptEn,rank:(DIM_ORDER[it.media]||[]).indexOf(it.dim)}}/>}
        </div>

        {['story','direct','ai'].includes(it.dim)
          ?<p className="td-fine td-howto">这是做片子的一个步骤，不是画面技法；完整流程见 <a href="/learn">从零做一部 AI 短片</a>。</p>
          :<p className="td-fine td-howto">想把它和别的技法（景别、光线、风格……）拼成一条完整提示词？点「加入组合」，再去其他条目里各挑一个。</p>}
        <p className="td-fine">提示词模板按生成模型的常见表现自写，尚未逐条真机出片验证；「容易翻车」是经验判断，不是官方限制。</p>
      </div>
    </div>

    <div className="td-cols">
      <main className="td-main">
        {sections.map((s,i)=>
          <section className="td-sec" id={s.key} key={s.key}>
            <div className="td-sec__head">
              <span className="td-sec__no">{idx(i+1)}</span>
              <h2>{s.title}</h2>
              {s.action}
            </div>
            <div className="td-sec__body">{s.body}</div>
          </section>)}
      </main>

      <aside className="td-aside">
        <div className="td-card">
          <h2>速览</h2>
          <dl className="td-facts">
            <div><dt>维度</dt><dd>{it.dimLabel}</dd></div>
            <div><dt>分组</dt><dd>{it.group}</dd></div>
            <div><dt>介质</dt><dd>{it.mediaLabel}</dd></div>
            <div><dt>提示词</dt><dd>{it.promptZh?'中':'—'} / {it.promptEn?'英':'—'}</dd></div>
            <div><dt>样例</dt><dd>{it.demoPrompt?'有':'—'}</dd></div>
          </dl>
        </div>

        {sections.length>1&&
          <div className="td-card">
            <h2>本页</h2>
            <ul className="td-nav">
              {sections.map((s,i)=>
                <li key={s.key}><a href={`#${s.key}`}><span className="n">{idx(i+1)}</span>{s.title}</a></li>)}
            </ul>
          </div>}

        {sameDim.length>0&&
          <div className="td-card">
            <h2>同维度</h2>
            <ul className="td-side-list">
              {sameDim.map(x=>
                <li key={x.id}><a href={x.url}><span>{x.zh}</span><span className="en">{x.en}</span></a></li>)}
            </ul>
          </div>}
      </aside>
    </div>

    {related.length>0&&
      <section className="td-related">
        <h2>同组术语</h2>
        <ul className="td-wall">
          {related.map(r=>
            <li key={r.id}>
              <a className="td-mini" href={r.url}>
                <span className="td-mini__zh">{r.zh}</span>
                <span className="td-mini__en">{r.en}</span>
                <span className="td-mini__one">{r.one}</span>
              </a>
            </li>)}
        </ul>
      </section>}

    <nav className="td-pager" aria-label="上下条">
      {prev
        ?<a href={prev.url}><span className="dir">上一条</span><span className="name">{prev.zh}</span><span className="en">{prev.en}</span></a>
        :<span className="off"><span className="dir">上一条</span><span className="name">已经是第一条</span></span>}
      {next
        ?<a className="next" href={next.url}><span className="dir">下一条</span><span className="name">{next.zh}</span><span className="en">{next.en}</span></a>
        :<span className="off next"><span className="dir">下一条</span><span className="name">已经是最后一条</span></span>}
    </nav>
  </div>;
}