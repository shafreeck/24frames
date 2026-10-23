'use client';
import {useState} from 'react';
export default function CopyButton({text,english=false,primary=false}:{text:string;english?:boolean;primary?:boolean}){
  const [done,setDone]=useState(false);
  async function copy(){try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text.trim());else{const ta=document.createElement('textarea');ta.value=text.trim();ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();if(!ok)throw new Error('copy denied');}setDone(true);setTimeout(()=>setDone(false),1400);}catch{setDone(false);}}
  return <button className={`btn${primary?' primary':''}${done?' done':''}`} type="button" onClick={copy}>{done?(english?'Copied':'已复制'):(english?'Copy English':'复制中文模板')}</button>;
}
