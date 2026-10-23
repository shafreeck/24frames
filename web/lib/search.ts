// TypeScript port of ../src/search.js. Preserve OR tokens and CJK bigram fallback.
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
