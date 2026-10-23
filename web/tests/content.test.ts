import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
// @ts-ignore Node runs TypeScript directly for these regression tests.
import {getItems,loadContent} from '../lib/content.ts';
// @ts-ignore Node runs TypeScript directly for these regression tests.
import {normalize,tokens,score,compile} from '../lib/search.ts';
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
  for(const item of actual){item.url=item.url.slice(1).replace(/\.html$/,'');delete (item as Partial<typeof item>).demoPrompt;}
  for(const item of expected){item.url=item.url.replace(/\.html$/,'');}
  assert.deepEqual(actual,expected);
  assert.equal(items.length,123);assert.equal(items.filter(i=>i.media==='video').length,82);assert.equal(items.filter(i=>i.media==='image').length,41);
  assert.deepEqual(loadContent().files,['data.js','data-extra-image-style.js','data-extra-image.js','data-extra-video.js']);
});
test('search normalization, tokens, scores, matches preserve old algorithm',()=>{
  const queries=['','dolly','ＤＯＬＬＹ','dolly-in','dolly 推','水墨','绕着人转一圈','绕着人转','拍到脸','水墨风格画面','霓虹未来','不存在的词xyz','胶片颗粒','【光线】：Rembrandt','a_b / c·d'];
  for(const query of queries){assert.equal(normalize(query),original.normalize(query));assert.deepEqual(tokens(query),original.tokens(query));for(const it of items){for(const table of [false,true]){const fields={zh:normalize(table?'':it.zh),en:normalize(table?'':it.en),hay:normalize(it.hay)};assert.equal(score(fields,tokens(query)),original.score(fields,original.tokens(query)),`${query}/${it.id}`);assert.equal(compile(query)(fields),original.compile(query)(fields));}}}
  for(const [q,n] of [['dolly',3],['水墨',2],['绕着人转一圈',2]] as const)assert.equal(items.filter(it=>compile(q)({zh:normalize(it.zh),en:normalize(it.en),hay:normalize(it.hay)})>0).length,n);
});
