import {getItems,DIM} from '../lib/content';
import FilterView from '../components/FilterView';
import ShotArt from '../components/ShotArt';
export default function Home(){
  const items=getItems();
  const dims=Object.entries(DIM).filter(([id])=>items.some(i=>i.dim===id));
  const video=items.filter(i=>i.media==='video').length;
  const image=items.filter(i=>i.media==='image').length;
  const demo=items.filter(i=>!!i.demoPrompt).length;
  return <div className="wrap home">
    <section className="hero">
      <div className="hero__intro">
        <p className="hero__eyebrow">24 FRAMES · 镜头语言库</p>
        <h1>把「说不清的画面」，<br/><em>换成 AI 听得懂的词</em></h1>
      </div>
      <div className="hero__aside">
        <p className="hero__lede">从画面直觉，到镜头语言。<br/>找到技法，带走可用的提示词。</p>
        <dl className="hero__stats">
        <div className="stat"><dt>术语</dt><dd>{items.length}</dd></div>
        <div className="stat"><dt>视频</dt><dd>{video}</dd></div>
        <div className="stat"><dt>图片</dt><dd>{image}</dd></div>
        <div className="stat"><dt>维度</dt><dd>{dims.length}</dd></div>
        <div className="stat"><dt>样例</dt><dd>{demo}</dd></div>
        </dl>
      </div>
    </section>
    <FilterView items={items} dimensions={dims.map(([id,d])=>({id,label:d.label}))} arts={items.map((it,i)=><ShotArt key={it.id} dim={it.dim} id={it.id} seed={i}/>)}/>
  </div>;
}