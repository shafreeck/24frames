# 二十四格 / 24frames · Next.js

Next.js App Router + TypeScript；`output: 'export'`。这是独立的新工程，仓库根旧的 `build.mjs` / `dev.mjs` 保留可用。

## 本地开发

```sh
cd web
npm install
npm run dev
```

## 构建与静态预览

```sh
npm test
npm run build
npm start -- --port 3000
```

`out/` 为部署目录。Python 预览服务只监听 `127.0.0.1`，并为 `/reference`、`/about`、`/term/<id>` 解析同名 `.html`。生产静态托管也需设置 clean URL → `.html` 规则；若直接使用 `python3 -m http.server --directory out`，请访问 `/reference.html` 与 `/about.html`。`next start` 不适用于 export。

## 内容与样式

- 唯一内容源仍在根目录 `src/data*.js`，`lib/content.ts` 在构建期通过 `node:vm` 按旧构建器相同顺序执行并合并，未维护 JSON 副本。
- `app/styles/style.css` 与 `style-poster.css` 原样复制自 `src/`，没有重写选择器。源样式变化时需同步复制这两份文件。
- 首页与速查表由 `FilterView` 处理筛选；第二次点击当前介质/维度芯片复位。`lib/search.ts` 保留旧搜索评分与中文二元组兜底。
- `tests/content.test.ts` 对比原构建器所有内容字段、排序（仅 URL 加 `/` 前缀）及原搜索算法。速查表旧 DOM 无 `data-zh`/`data-en`，其搜索字段语义也保留。
- 演示线稿：`components/demo/` 下每条术语一段 SVG 动画（SMIL，服务端直出，无依赖）。`kit.tsx` 是动画助手与线稿原件（人物、胸像、天际线、机位图……），`moves` / `frame` / `time` / `looks` 按维度分文件，`index.tsx` 合并成按 id 查的表。加新条目时在对应文件加一项即可，没画的会显示占位框；`tests/content.test.ts` 会检查每条都有演示和样例提示词。SMIL 的 keyTimes 必须以 1 结尾，`kit.tsx` 里会直接报错提示。
- 播放：`DemoPlayback` 只让视口内的线稿动；系统开了「减少动态」时停在 `still` 指定的那一帧。
- 样例提示词：`src/demo-prompts.js`，123 条全覆盖；详情页「样例提示词」一节读这里。
- 上手路线：`/learn`，把编剧 → 导演 → 美术 → 摄影 → AI 制作 → 剪辑 → 声音按制作顺序串起来，每步连到术语；页面里引用的术语 id 由测试校验。
- 编剧类条目的提示词是写给对话模型的（写故事、改剧本），详情页标题会相应改成「直接问对话模型」；编剧/导演/AI 制作不提供「加入组合」。
- 组合提示词：详情页「加入组合」，右下角面板把各维度各挑一个拼成一条（运镜在最前，其余按维度顺序），只存本机 localStorage。
- 路由：`/`、`/term/[id]`（generateStaticParams）、`/reference`、`/about`；详情链接使用 `.html`，可直接由静态服务访问。
- 生产是纯静态，无运行时 API、数据库、用户系统或内容管理后台；Next.js 负责开发服务及构建时服务端渲染，不能把静态导出说成已部署的动态后端。

未部署、未购买域名；内容仍为经验初版，未逐条真机出片验证。
