import {getItems,DIM} from '../lib/content';
import FilterView from '../components/FilterView';
export default function Home(){
  const items=getItems();
  const dims=Object.entries(DIM).filter(([id])=>items.some(i=>i.dim===id));
  const video=items.filter(i=>i.media==='video').length;
  const image=items.filter(i=>i.media==='image').length;
  const plan=items.filter(i=>i.media==='plan').length;
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
        <div className="stat"><dt>编导</dt><dd>{plan}</dd></div>
        <div className="stat"><dt>维度</dt><dd>{dims.length}</dd></div>
        <div className="stat"><dt>样例</dt><dd>{demo}</dd></div>
        </dl>
      </div>
    </section>
    <ol className="howto" aria-label="三步上手">
      <li><b>01</b><span><strong>找画面</strong>说人话搜：「绕着人转一圈」「拍到脸」「霓虹夜景」都能命中。</span></li>
      <li><b>02</b><span><strong>看动画确认</strong>每张卡片的线稿都会动，演示这个技法到底在做什么。</span></li>
      <li><b>03</b><span><strong>复制或组合</strong>复制单条模板，或把运镜、景别、光线、风格各挑一个，拼成一条完整提示词。</span></li>
      <li className="howto__learn"><a href="/learn"><b>NEW</b><span><strong>零基础？从这里开始 →</strong>编剧、导演、摄影、剪辑、声音、AI 制作，七步做完一部 AI 短片。</span></a></li>
    </ol>
    <FilterView items={items} dimensions={dims.map(([id,d])=>({id,label:d.label}))}/>
  </div>;
}