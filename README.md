# 二十四格 24frames

一秒钟拆成 24 格，每一格都得有名字。这里收的是 AI 影像里那些本来就有名字的运镜与风格。

AI 让一个人也能做一部片子，但非专业的人缺的不是技术，是**词**——不知道那个运镜叫什么，就没法让模型精确还原。这个站压缩的就是这一段：从「说不清的画面」到「一个模型听得懂的词」。

- 线上站点：<https://24frames.art>
- 166 条术语：视频 100、图片 50、编导 16（编剧与导演不属于某一种画面，单独成一类）；15 个维度，运镜排在最前
- 每条：中英术语、一句话、什么时候用、中英文提示词模板、容易翻车、参数建议；运镜类另有可直接生成视频的样例提示词
- 纯静态：无后端、无账号、无第三方脚本、无追踪
- 每条一个独立静态页，可被搜索引擎索引、可直接分享链接

## 仓库结构

```
src/                  内容唯一来源
  data.js             运镜与风格主表
  data-extra-*.js     视频侧十维度、图片侧两级补充
  data-more.js        编剧 / 导演 / AI 制作等补充
  demo-prompts.js     各条术语的样例提示词（非内容源）
  search-say.js       白话说法（只进检索）
  search.js           检索算法（浏览器与 node 共用）
web/                  正式站点：Next.js App Router + TypeScript
  app/                路由：/ /term/[id] /reference /about /learn
  components/         卡片、筛选、线稿动画（demo/）
  lib/                内容装配、检索移植、站点地址
  tests/              数据一致性与白话查询用例
films/launch-01/      发布片工程与素材（约 44MB 二进制）
build.mjs dev.mjs     早先的零依赖生成器，保留可用作对照
```

`web/` 是当前的正式实现；根目录的 `build.mjs` 能把同一批数据生成一份纯 HTML 版本，用于比对与回退，两者共用 `src/` 作为唯一数据源，不存在手抄的副本。

## 本地开发

```bash
cd web
npm install
npm run dev            # 默认 http://127.0.0.1:3000
npm test               # 数据与检索用例
npm run build          # 静态导出到 web/out
npm start -- --port 3000   # 预览导出产物
```

旧的零依赖版本：

```bash
node build.mjs
python3 -m http.server 18766 --bind 127.0.0.1
```

## 构建与部署

站点为 `output: 'export'` 静态导出，托管在 Cloudflare Pages（项目名 `24frames`），由命令行的产物上传更新，不走 git 自动构建：

```bash
cd web && npm test && SITE_URL=https://24frames.art npm run build
npx -y wrangler@4 pages deploy out --project-name 24frames --branch main
```

`web/lib/site.ts` 里的 `SITE_URL` 决定 canonical、`sitemap.xml` 与 `robots.txt` 中的绝对地址，默认 `https://24frames.art`，构建时可用同名环境变量覆盖。`output: 'export'` 下 `sitemap.xml` 属静态路由，`app/sitemap.ts` 需显式声明 `dynamic = 'force-static'`。

部署后用带缓存戳的地址复测，不要以上传成功当作生效：

```bash
curl -s "https://24frames.art/?v=$(date +%s)" | head -20
```

## 加一条内容

在 `src/` 下对应的数据文件里加一项，字段照抄现有条目：

| 字段 | 说明 |
| --- | --- |
| `id` | 用于生成 `/term/<id>`，只能出现一次 |
| `zh` / `en` | 中英术语 |
| `dim` / `media` | 维度与载体（视频 / 图片 / 编导），决定归属与排序 |
| `group` | 分组，决定排序 |
| `one` | 一句话说明 |
| `when` | 什么时候用 |
| `keywords` | 风格关键词（风格类需要） |
| `promptZh` / `promptEn` | 中英提示词模板 |
| `fail` | 容易翻车，数组 |
| `params` | 参数建议 |

运镜类的样例提示词另写在 `src/demo-prompts.js`，键为条目 `id`；白话检索说法写在 `src/search-say.js`，建议每条 5 到 10 种普通人的说法（「背景模糊」「镜头晃」「像王家卫」）。改完跑 `npm test` 与 `npm run build`。

## 搜索

纯前端，没有向量检索，靠三件事让一句白话也能搜到（`src/search.js` 的 `createIndex`，`web/lib/search.ts` 是逐行对应的移植，测试比对两边结果）：

1. **词项**：英文按词，中文按相邻两字；含「的、了、着」这类虚词的两字组合丢掉。
2. **权重**：越少见的词越重（IDF），出现在 30% 以上条目里的词（镜头、画面、人物）自动降权；命中术语名 > 白话说法 > 正文。
3. **覆盖率**：句子里有信息量的词要命中一定比例才算匹配，防止长句把半个库带出来；结果按得分排序。

## 明确没做的

- **真实出片样例还没有。** 每条术语已有一段动画演示线稿（`web/components/demo/`），用来讲清技法本身是怎么回事；它是原理示意，不冒充成片。真实生成的视频与图片样例另行补充。
- **提示词未逐条真机验证。** 模板按生成模型的常见表现写，「容易翻车」属经验判断，不是官方限制。
- 未按模型（可灵 / 即梦 / Runway / Sora）分版本，目前只有中英两版通用模板。
- 没有收藏、投稿、评论、付费、后台。

## 许可

代码（`web/`、`build.mjs`、`src/*.js` 等程序部分）采用 Apache License 2.0，见 [LICENSE](LICENSE)。

条目文案（术语名称、一句话说明、提示词模板、容易翻车、参数建议等）采用 CC BY-NC-SA 4.0，**禁止商业使用**，见 [LICENSE-CONTENT.md](LICENSE-CONTENT.md)。

条目文字与提示词模板自写，未逐字引用他人原文。商业使用或成批转载请先联系 shafreeck@gmail.com。