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
- 路由：`/`、`/term/[id]`（generateStaticParams）、`/reference`、`/about`；详情链接使用 `.html`，可直接由静态服务访问。
- 生产是纯静态，无运行时 API、数据库、用户系统或内容管理后台；Next.js 负责开发服务及构建时服务端渲染，不能把静态导出说成已部署的动态后端。

未部署、未购买域名；内容仍为经验初版，未逐条真机出片验证。
