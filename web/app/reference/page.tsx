import type {Metadata} from 'next';
import {getItems,DIM,SITE_NAME} from '../../lib/content';
import FilterView from '../../components/FilterView';
export const metadata:Metadata={title:`术语速查表｜${SITE_NAME}`};
export default function Reference(){const items=getItems();return <div className="wrap"><div className="prose"><h1>术语速查表</h1><p>一页看完 {items.length} 条：中文名、英文名、类别与一句话。点名字进详情页，那里有提示词模板和翻车点。</p><p>适合两种场景：写提示词时对一下英文写法；看片时认出「哦，这是环绕，不是摇」。<strong>左右滑动可看全表。</strong></p></div><FilterView table items={items} dimensions={Object.entries(DIM).filter(([id])=>items.some(i=>i.dim===id)).map(([id,d])=>({id,label:d.label}))}/></div>;}
