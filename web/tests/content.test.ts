import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
// @ts-ignore Node runs TypeScript directly for these regression tests.
import {getItems,loadContent} from '../lib/content.ts';
// @ts-ignore Node runs TypeScript directly for these regression tests.
import {normalize,tokens,score,compile,terms,createIndex} from '../lib/search.ts';
const require=createRequire(import.meta.url);
const original=require('../../src/search.js');
const items=getItems();
test('single source, exact original item order and fields',()=>{
  const source=fs.readFileSync('../build.mjs','utf8');
  const start=source.indexOf('const KIND_LABEL ='),end=source.indexOf('/* ---------------- 页面片段');
  const sandbox={s:(v:unknown)=>v==null?'':String(v),fs,path:require('node:path'),vm,SRC:require('node:path').resolve('../src'),process,console,result:undefined};
  vm.createContext(sandbox);vm.runInContext(source.slice(start,end)+'\nresult = buildItems(loadContent());',sandbox);
  const expected=JSON.parse(JSON.stringify(sandbox.result));
  const actual=JSON.parse(JSON.stringify(items));
  // 两处有意差异不作为回归失败：Next 站点新增 demoPrompt 字段；链接改用干净 URL，旧 build.mjs 为 term/<id>.html。
  // 其余字段与顺序仍逐一比对。
  for(const item of actual){item.url=item.url.slice(1).replace(/\.html$/,'');delete (item as Partial<typeof item>).demoPrompt;delete (item as Partial<typeof item>).say;}
  for(const item of expected){item.url=item.url.replace(/\.html$/,'');}
  assert.deepEqual(actual,expected);
  assert.equal(items.length,166);assert.equal(items.filter(i=>i.media==='video').length,100);assert.equal(items.filter(i=>i.media==='image').length,50);assert.equal(items.filter(i=>i.media==='plan').length,16);assert.equal(items[0].dim,'move');
  assert.deepEqual(loadContent().files,['data.js','data-extra-image-style.js','data-extra-image.js','data-extra-video.js','data-more.js']);
});
test('search normalization, tokens, scores, matches preserve old algorithm',()=>{
  const queries=['','dolly','ＤＯＬＬＹ','dolly-in','dolly 推','水墨','绕着人转一圈','绕着人转','拍到脸','水墨风格画面','霓虹未来','不存在的词xyz','胶片颗粒','【光线】：Rembrandt','a_b / c·d'];
  for(const query of queries){assert.equal(normalize(query),original.normalize(query));assert.deepEqual(tokens(query),original.tokens(query));for(const it of items){for(const table of [false,true]){const fields={zh:normalize(table?'':it.zh),en:normalize(table?'':it.en),hay:normalize(it.hay)};assert.equal(score(fields,tokens(query)),original.score(fields,original.tokens(query)),`${query}/${it.id}`);assert.equal(compile(query)(fields),original.compile(query)(fields));}}}
  for(const [q,n] of [['dolly',3],['水墨',2],['绕着人转一圈',2]] as const)assert.equal(items.filter(it=>compile(q)({zh:normalize(it.zh),en:normalize(it.en),hay:normalize(it.hay)})>0).length,n);
});
test('every term has an animated demo and a full sample prompt',()=>{
  const ids=new Set<string>();
  for(const f of ['moves','frame','time','looks','craft']){const src=fs.readFileSync(`components/demo/${f}.tsx`,'utf8');for(const m of src.matchAll(/^ {2}'?([a-z0-9-]+)'?: (?:\{|shot\()/gm))ids.add(m[1]);}
  assert.deepEqual(items.filter(it=>!ids.has(it.id)).map(it=>it.id),[]);
  assert.deepEqual(items.filter(it=>!it.demoPrompt).map(it=>it.id),[]);
});
test('learning path only links to existing terms',()=>{
  const src=fs.readFileSync('app/learn/page.tsx','utf8');
  const ids=new Set(items.map(it=>it.id));
  const used=[...src.matchAll(/ids: \[([^\]]*)\]/g)].flatMap(m=>[...m[1].matchAll(/'([a-z0-9-]+)'/g)].map(x=>x[1]));
  assert.ok(used.length>50);
  assert.deepEqual(used.filter(id=>!ids.has(id)),[]);
});

// 「说人话也能搜」是页面上的承诺：每一句白话都要在前 3 条里找到它想要的术语。
const PLAIN:[string,string][]=[
  ['绕着人转一圈','orbit'],['镜头绕着人转一圈','orbit'],['从远处慢慢推到脸上','dolly-in'],['画面像老电影','tex-film-grain'],
  ['背景虚化','shallow-dof'],['让背景模糊','shallow-dof'],['人物每个镜头都长得一样','ai-consistency'],['开头怎么抓人','story-hook'],
  ['拍得像王家卫','hk-90s'],['镜头晃来晃去','handheld'],['慢动作','tempo-slow-motion'],['人物大小不变背景在变','dolly-zoom'],
  ['俯视桌面','img-comp-flatlay'],['怎么让两个人对话不乱','dir-180-rule'],['dolly','dolly-in'],['水墨','ink-wash'],['推','dolly-in'],
  ['环绕','orbit'],['orbit','orbit'],['夕阳下的人','light-golden'],['让图片动起来','ai-i2v'],['手指多了一根','ai-negative'],
  ['像皮克斯动画','stylized-3d'],['从下往上拍显得很高大','low-angle'],['车灯拉成一条条线','img-tex-long-exposure'],['只改图片的一部分','img-ai-inpaint'],
  ['抖音竖屏尺寸','img-ai-aspect'],['说话嘴型对不上','ai-lipsync'],['无人机飞过山顶','aerial-reveal'],['一镜到底跟着人走','steadicam'],
  ['镜头从脚拍到头','tilt'],['画面歪着很不安','dutch-angle'],['日系小清新','img-style-airy-japanese'],['背景音乐','sound-score'],
  ['突然没有声音','sound-silence'],['下集预告留悬念','story-cliffhanger'],['分镜脚本怎么写','dir-shot-list'],['眼睛特写','img-shot-eye-closeup'],
  ['只有轮廓的黑影','img-light-silhouette'],['霓虹灯下的雨夜','light-neon'],['录像带的感觉','tex-vhs'],['第一人称视角','pov'],
  ['焦点从前面转到后面','rack-focus'],['颜色淡淡的灰灰的','color-muted'],['tilt shift','img-lens-tilt-shift'],['rembrandt','light-rembrandt'],
];
const docs=items.map(it=>({zh:it.zh,en:it.en,key:it.say,hay:it.hay}));
const rankOf=(ix:{search:(q:string)=>number[]},q:string)=>{const sc=ix.search(q);return items.map((_,i)=>i).filter(i=>sc[i]>0).sort((a,b)=>sc[b]-sc[a]||a-b).map(i=>items[i].id);};
test('plain-language queries find the intended term in the top 3',()=>{
  const ix=createIndex(docs);
  const miss=PLAIN.filter(([q,want])=>{const r=rankOf(ix,q).indexOf(want);return r<0||r>2;}).map(([q,want])=>`${q} → ${want}：${rankOf(ix,q).slice(0,3).join(', ')||'无结果'}`);
  assert.deepEqual(miss,[]);
  // 长句不能把半个库都带出来
  for(const q of ['人物每个镜头都长得一样','怎么让两个人对话不乱','我想拍一个人在雨夜等车'])assert.ok(rankOf(ix,q).length<=20,q);
  assert.equal(rankOf(ix,'qwxzv').length,0);assert.equal(rankOf(ix,'喵呜喵呜').length,0);
  assert.equal(ix.search('').every(v=>v===1),true);
});
test('createIndex in TS and src/search.js give identical scores',()=>{
  const a=createIndex(docs),b=original.createIndex(docs);
  for(const [q] of [...PLAIN,['',''],['ＤＯＬＬＹ',''],['【光线】：Rembrandt','']] as [string,string][]){
    assert.deepEqual(terms(q),original.terms(q),q);
    assert.deepEqual(a.search(q),b.search(q),q);
  }
});
test('every term has plain-language phrases for search',()=>{
  assert.deepEqual(items.filter(it=>it.say.split('|').filter(x=>x.trim()).length<4).map(it=>it.id),[]);
});
