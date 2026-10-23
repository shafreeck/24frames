import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

export const SITE_NAME = '二十四格 24frames';
export const SITE_DESC = 'AI 影像术语库：视频与图片两侧，按运镜、景别、镜头、光线、色彩、构图、质感、节奏、转场、声音、流派、风格分类，每条给中英术语、什么时候用、中英文提示词模板、容易翻车与参数建议。';
export const DIM: Record<string, {label: string}> = {
  move: {label:'运镜'}, shot:{label:'景别'}, lens:{label:'镜头'}, light:{label:'光线'},
  color:{label:'色彩'}, comp:{label:'构图'}, texture:{label:'质感'}, tempo:{label:'节奏'},
  cut:{label:'转场'}, sound:{label:'声音'}, genre:{label:'流派'}, style:{label:'风格'}, ai:{label:'AI 制作'},
  story:{label:'编剧'}, direct:{label:'导演'},
};
export const MEDIA: Record<string,string> = {video:'视频', image:'图片', plan:'编导'};
export const DIM_ORDER: Record<string,string[]> = {
  video:['move','shot','lens','light','color','comp','texture','tempo','cut','sound','genre','style','ai'],
  image:['comp','light','color','lens','shot','texture','genre','style','ai'],
  plan:['story','direct'],
};
const GROUP_ORDER = ['基础','进阶','视角','风格化','写实','动画','类型','东方','人像','静物','建筑','食物','风景','通用'];
const ALIAS: Record<string,string[]> = {
  'story-logline':['故事梗概','一句话故事','故事核'], 'story-hook':['开头','黄金三秒','前三秒','抓人'],
  'story-cliffhanger':['下集预告','留悬念','断章'], 'dir-shot-list':['分镜','分镜头脚本','拍摄清单','分镜脚本'],
  'dir-180-rule':['越轴','对话机位','左右反了'], 'dir-shot-reverse':['对话镜头','两人对话','来回切'],
  'ai-consistency':['人物一致','同一个人','脸不一样','换脸','角色统一'], 'ai-i2v':['图片变视频','让图片动起来','首帧'],
  'ai-lipsync':['口型','说话','配音对嘴'], 'img-ai-char-sheet':['三视图','人设图','角色三视图'], 'img-ai-inpaint':['局部修改','修手','改一部分'],
  orbit:['绕着人转','绕一圈','转一圈','转圈','绕人一圈','环绕镜头'],
  'rise-orbit':['边升边转','升起来转一圈','往上绕'],
  'dolly-in':['推近','推进','往前推','推镜头','靠近'],
  'dolly-out':['拉远','后拉','往后退','拉镜头','退后'],
  'dolly-zoom':['希区柯克变焦','眩晕变焦','推拉变焦','拉近同时后退'],
  truck:['平移','横移','侧移','跟着移动'], pan:['摇镜','左右摇','摇头','扫一圈'],
  'whip-pan':['甩镜','快速摇','甩过去','唰一下'], handheld:['手持','抖动','晃','纪录片感'],
  steadicam:['稳定器','斯坦尼康','跟拍','跟着走'], pov:['第一人称','主观视角','我看到的','从眼睛看'],
  fpv:['穿越机','无人机穿','穿梭','钻缝'], 'dutch-angle':['荷兰角','歪','斜着拍','倾斜'],
  'low-angle':['仰拍','从下往上','低机位'], ots:['过肩','肩膀后面','隔着人拍'],
  'shot-close':['特写','拍到脸','怼近'], 'shot-extreme-wide':['大远景','大场景','一个人在山里'],
  'shot-medium':['半身','中景'], 'macro-highspeed':['微距','高速摄影','慢动作','放慢'],
  'tempo-slow-motion':['慢动作','放慢','升格'], 'tempo-montage':['快剪','混剪','剪辑感'],
  'cut-match':['转场','动作接动作'], 'tex-film-grain':['颗粒','胶片颗粒','颗粒感'],
  'tex-vhs':['录像带','老录像','雪花点'], 'genre-cyberpunk':['赛博','赛博朋克','霓虹未来'],
  'img-genre-ink-wash':['水墨','国画','水墨风'], 'img-style-collage-poster':['拼贴','海报风','杂志拼贴'],
  'img-style-airy-japanese':['日系','空气感','小清新'], 'img-light-backlit':['逆光','背光','透光'],
  'img-comp-thirds':['三分法','九宫格'], 'img-tex-watercolor':['水彩','水彩画'],
  'img-lens-tilt-shift':['移轴','微缩模型感'], 'img-color-morandi':['莫兰迪','灰调','低饱和'],
};
export interface Item {
  id:string; kind:string; dim:string; media:string; dimLabel:string; mediaLabel:string; kindLabel:string;
  zh:string; en:string; group:string; one:string; when:string; keywords:string[];
  promptZh:string; promptEn:string; demoPrompt:string; say:string; fail:string[]; params:string; order:number; url:string; hay:string;
  nameCount:number; nameDup:boolean; dupTag:string;
}
type Raw = Record<string,unknown>;
const s = (v:unknown) => v == null ? '' : String(v);
const dimsOf = (media:string) => DIM_ORDER[media] || Object.keys(DIM);
const rank = (order:string[], value:string) => {const i=order.indexOf(value); return i < 0 ? order.length : i;};
const allowed = new Set(['id','dim','media','zh','en','group','one','when','keywords','promptZh','promptEn','fail','params']);

/** Trusted local JS data, executed only at build/server time, never shipped as a second data source. */
export function loadContent() {
  const src = path.resolve(process.cwd(), '../src');
  const files = fs.readdirSync(src).filter(f=>f==='data.js'||(f.startsWith('data-')&&f.endsWith('.js')))
    .sort((a,b)=>a==='data.js'?-1:b==='data.js'?1:a.localeCompare(b));
  const sandbox: {window:{MZ_DATA?:{moves:Raw[];styles:Raw[]}; MZ_DATA_EXTRA?:Raw[]; MZ_DEMO?:Record<string,string>; MZ_SAY?:Record<string,string>}} = {window:{}};
  vm.createContext(sandbox);
  for (const file of files) vm.runInContext(fs.readFileSync(path.join(src,file),'utf8'),sandbox,{filename:`src/${file}`});
  // demo-prompts.js 不算内容源：它只提供样例提示词，单独执行，不进 files 清单。
  const demoFile = path.join(src, 'demo-prompts.js');
  if (fs.existsSync(demoFile)) vm.runInContext(fs.readFileSync(demoFile, 'utf8'), sandbox, {filename: 'src/demo-prompts.js'});
  // search-say.js 同理：白话说法只进搜索，不是内容源。
  const sayFile = path.join(src, 'search-say.js');
  if (fs.existsSync(sayFile)) vm.runInContext(fs.readFileSync(sayFile, 'utf8'), sandbox, {filename: 'src/search-say.js'});
  const base=sandbox.window.MZ_DATA;
  if (!base || !Array.isArray(base.moves) || !Array.isArray(base.styles)) throw new Error('src/data.js 未提供 window.MZ_DATA.moves / .styles');
  const demo=sandbox.window.MZ_DEMO;
  const say=sandbox.window.MZ_SAY;
  return {...base, extra:Array.isArray(sandbox.window.MZ_DATA_EXTRA)?sandbox.window.MZ_DATA_EXTRA:[], demo:(demo&&typeof demo==='object')?demo:({} as Record<string,string>), say:(say&&typeof say==='object')?say:({} as Record<string,string>), files};
}

export function buildItems(data: ReturnType<typeof loadContent>): Item[] {
  const raws = [...data.moves.map((r,i)=>({r,kind:'move',i})), ...data.styles.map((r,i)=>({r,kind:'style',i})),
    ...data.extra.map((r,i)=>({r,kind:s(r?.dim)||'style',i}))];
  const problems:string[]=[];
  const items=raws.map(({r,kind,i}):Item=>{
    const where=`${kind}[${i}]（${s(r?.zh)}）`;
    if (!r || typeof r !== 'object' || Array.isArray(r)) throw new Error(`${where} 应为对象`);
    for(const key of Object.keys(r)) if(!allowed.has(key)) problems.push(`${where} 未知字段 ${key}`);
    for(const key of ['zh','en','one']) if(typeof r[key]!=='string'||!s(r[key]).trim()) problems.push(`${where} ${key} 应为非空字符串`);
    for(const key of ['when','promptZh','promptEn','params']) if(r[key]!=null&&(typeof r[key]!=='string'||!s(r[key]).trim())) problems.push(`${where} ${key} 应为非空字符串`);
    for(const key of ['keywords','fail']) if(r[key]!=null&&(!Array.isArray(r[key])||!(r[key] as unknown[]).every(v=>typeof v==='string'&&v.trim()))) problems.push(`${where} ${key} 应为非空字符串数组`);
    const id=s(r.id)||`${kind}-${i+1}`, dim=s(r.dim)||kind, media=s(r.media)||'video';
    if(r.id!=null&&!/^[a-z0-9][a-z0-9-]*$/.test(s(r.id))) problems.push(`${where} id 应为 kebab-case`);
    if(!MEDIA[media]||!DIM[dim]||!dimsOf(media).includes(dim)) problems.push(`${where} 非法 media / dim`);
    const dimLabel=DIM[dim]?.label||({move:'运镜',style:'风格'} as Record<string,string>)[kind]||dim;
    const it:Item={id,kind,dim,media,dimLabel,mediaLabel:MEDIA[media]||media,kindLabel:dimLabel,
      zh:s(r.zh),en:s(r.en),group:s(r.group)||'未分组',one:s(r.one),when:s(r.when),
      keywords:Array.isArray(r.keywords)?r.keywords.map(s):[], promptZh:s(r.promptZh),promptEn:s(r.promptEn),
      demoPrompt:s(data.demo?.[id]), say:[...(ALIAS[id]||[]), ...s(data.say?.[id]).split('|')].map(v=>v.trim()).filter(Boolean).join(' | '), fail:Array.isArray(r.fail)?r.fail.map(s):[],params:s(r.params),order:i,url:`/term/${id}`,hay:'',nameCount:0,nameDup:false,dupTag:''};
    it.hay=[it.zh,it.en,it.one,it.when,it.keywords.join(' '),it.promptZh,it.promptEn,it.fail.join(' '),it.params,it.group,it.dimLabel,it.mediaLabel,...(ALIAS[id]||[])].join(' ').toLowerCase();
    return it;
  });
  const mediaRank=(m:string)=>rank(Object.keys(MEDIA),m);
  items.sort((a,b)=>mediaRank(a.media)-mediaRank(b.media)||rank(dimsOf(a.media),a.dim)-rank(dimsOf(b.media),b.dim)||rank(GROUP_ORDER,a.group)-rank(GROUP_ORDER,b.group)||a.order-b.order);
  const ids=new Set<string>(), triples=new Set<string>();
  for(const it of items){
    const triple=`${it.media}|${it.dim}|${it.zh}`;
    if(ids.has(it.id)) problems.push(`id 重复：${it.id}`);
    if(triples.has(triple)) problems.push(`同介质同维度重名：${triple}`);
    ids.add(it.id); triples.add(triple);
    const peers=items.filter(p=>p.zh===it.zh);
    it.nameCount=peers.length; it.nameDup=peers.length>1;
    it.dupTag=it.nameDup?(new Set(peers.map(p=>p.media)).size>1?it.mediaLabel:it.dimLabel):'';
  }
  if(problems.length) throw new Error(`内容校验失败：\n${problems.join('\n')}`);
  return items;
}
let cached:Item[]|undefined;
export function getItems():Item[]{return cached ||= buildItems(loadContent());}
