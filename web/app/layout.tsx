import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {SITE_NAME,SITE_DESC} from '../lib/content';
import {SITE_URL} from '../lib/site';
import DemoPlayback from '../components/DemoPlayback';
import {SharedDefs} from '../components/demo/kit';
import {ComboTray} from '../components/Combo';
import './styles/ui.css';
import './styles/term.css';
export const metadata:Metadata={metadataBase:new URL(SITE_URL),title:`${SITE_NAME} · AI 影像镜头语言库`,description:SITE_DESC,alternates:{canonical:'./'},other:{'color-scheme':'dark'}};
export default function Layout({children}:{children:ReactNode}){
  return <html lang="zh-CN"><body suppressHydrationWarning><SharedDefs/><a className="skip" href="#main">跳到正文</a><header className="site-head"><div className="wrap head-inner"><a className="brand" href="/"><span className="brand-zh">二十四格</span><span className="brand-en">24frames</span></a><nav className="site-nav"><a href="/">全部</a><a href="/#video">视频</a><a href="/#image">图片</a><a href="/#plan">编导</a><a href="/learn">上手路线</a><a href="/reference">速查表</a><a href="/about">关于</a></nav></div></header><main id="main">{children}</main><DemoPlayback/><ComboTray/><footer className="site-foot"><div className="wrap"><p><strong>二十四格 / 24frames</strong>：一秒钟拆成 24 格，每一格都得有名字。这里收的是 AI 影像里那些本来就有名字的运镜与风格。</p><p>提示词模板按生成模型的常见表现自写，<strong>尚未逐条真机出片验证</strong>；「容易翻车」是经验判断，不是官方限制。示例素材一律自制，不引用院线片段。</p><p className="foot-links"><a href="/learn">从零做一部 AI 短片</a> · <a href="/reference">术语速查表</a> · <a href="/about">关于与更新</a> · 无账号、无追踪</p></div></footer></body></html>;
}