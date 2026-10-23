// TypeScript port of ../src/search.js：第一代 compile 保留给旧逻辑比对，页面用第二代 createIndex。
export interface Fields {zh?:string; en?:string; hay?:string}
const CJK = /[\u3400-\u9fff]/;
export function normalize(text: unknown):string {
  let v=text==null?'':String(text);
  v=v.replace(/[\uff01-\uff5e]/g,ch=>String.fromCharCode(ch.charCodeAt(0)-0xfee0));
  v=v.replace(/\u3000/g,' ').toLowerCase();
  v=v.replace(/-|_|\/|·|・|,|，|、|:|：|;|；|!|！|\?|？|\(|\)|（|）|\[|\]|【|】|"|'|“|”|‘|’/g,' ');
  return v.replace(/\s+/g,' ').trim();
}
export function tokens(query:unknown){return normalize(query).split(' ').filter(Boolean);}
function bigrams(token:string){const out:string[]=[];if(!CJK.test(token)||token.length<3)return out;for(let i=0;i<token.length-1;i++)out.push(token.slice(i,i+2));return out;}
function weigh(fields:Fields,token:string){
  if(!token)return 0;const zh=fields.zh||'',en=fields.en||'',hay=fields.hay||'';
  if(zh===token||en===token)return 100;
  if(zh.indexOf(token)===0||en.indexOf(token)===0)return 60;
  if(zh.indexOf(token)>=0||en.indexOf(token)>=0)return 30;
  if(hay.indexOf(token)>=0)return 12;
  return 0;
}
export function score(fields:Fields,list:string[]){
  let best=0;for(const token of list){const w=weigh(fields,token);if(w>best)best=w;}if(best)return best;
  let hits=0;for(const token of list)for(const gram of bigrams(token))if((fields.hay||'').indexOf(gram)>=0)hits++;
  return hits>=2?10+hits:0;
}
export function compile(query:unknown){const list=tokens(query);if(!list.length)return ()=>1;return (fields:Fields)=>score(fields,list);}

/* 第二代：整库索引（与 ../src/search.js 的 createIndex 逐行对应，测试会比对两边分数）。
   英文按词、中文按相邻两字；IDF 让少见词更重、常见词（出现在 30% 以上条目里）降权；
   命中名称 > 白话说法/别名 > 正文；长句要求有信息量的词至少命中一定比例。 */
export interface Doc {zh?:string; en?:string; key?:string; hay?:string}
const COMMON=0.3;
const FIELD={name:3,key:2.5,hay:1};
const PARTICLE=/[的了着得地吗呢吧啊么]/;
export function terms(text:unknown){
  const out:string[]=[];
  for(const tok of tokens(text)){
    for(const run of tok.match(/[㐀-鿿]+|[^㐀-鿿]+/g)||[]){
      if(CJK.test(run)){if(run.length===1)out.push(run);for(let j=0;j<run.length-1;j++){const gram=run.slice(j,j+2);if(!PARTICLE.test(gram))out.push(gram);}}
      else if(run.length>=2)out.push(run);
    }
  }
  return [...new Set(out)];
}
export function createIndex(docs:Doc[]){
  const rows=docs.map(d=>{const name=normalize(`${d.zh||''} ${d.en||''}`),key=normalize(d.key||''),hay=normalize(d.hay||'');return {zh:normalize(d.zh),en:normalize(d.en),name,key,hay,all:`${name} ${key} ${hay}`};});
  const N=rows.length||1;
  const dfCache=new Map<string,number>();
  const df=(t:string)=>{let n=dfCache.get(t);if(n==null){n=0;for(const r of rows)if(r.all.indexOf(t)>=0)n++;dfCache.set(t,n);}return n;};
  function search(query:unknown):number[]{
    const raw=tokens(query);
    if(!raw.length)return rows.map(()=>1);
    const all=terms(query).map(t=>{const d=df(t);let w=d?Math.log(1+N/d):0;if(d/N>COMMON)w*=0.15;return {t,w};});
    // 库里根本没有的词不参与打分，但按三成权重计入分母
    let total=0;for(const x of all)total+=x.w||0.3*Math.log(1+N);
    const ts=all.filter(x=>x.w>0);
    return rows.map(row=>{
      let bonus=0;
      for(const tok of raw){
        if(tok.length<2&&!CJK.test(tok))continue;
        if(row.zh===tok||row.en===tok)bonus=Math.max(bonus,100);
        else if(row.zh.indexOf(tok)===0||row.en.indexOf(tok)===0)bonus=Math.max(bonus,60);
        else if(row.name.indexOf(tok)>=0)bonus=Math.max(bonus,40);
        else if(tok.length>=2&&row.key.indexOf(tok)>=0)bonus=Math.max(bonus,30);
      }
      let s=0,hit=0;
      for(const {t,w} of ts){
        let f=0;
        if(row.name.indexOf(t)>=0)f=FIELD.name;else if(row.key.indexOf(t)>=0)f=FIELD.key;else if(row.hay.indexOf(t)>=0)f=FIELD.hay;
        if(f){s+=w*f;hit+=w;}
      }
      const cover=total?hit/total:0;
      const need=ts.length<=2?0.5:ts.length<=5?0.45:0.4;
      if(!bonus&&cover<need)return 0;
      return +(bonus+s*(0.5+cover)).toFixed(4);
    });
  }
  return {search,size:rows.length};
}
