# 进度（2026-10-23，因用量上限中断）

## 已完成
- 方案确认：约 100 秒竖屏（实际按旁白约 121 秒），不出镜，Three.js 沉浸式，自动流水线、不审分镜。
- `SCRIPT.md`：18 句定稿旁白。
- `assets/vo/*.wav` + `*.words.json`：HeyGen James Gao 中文男声，speed 0.95，已统一到 -16 LUFS / -1.5 dBTP，含逐字时间戳（做字幕用）。
- `assets/audio/`：配乐 bgm.wav（153s，已归一到 -18 LUFS）、whoosh1-3、typing、riser、boom。
- `assets/site/`：真实网站竖屏截图（首页、卡片墙长图、白话搜索结果、详情页、提示词段、上手路线）、24 张卡片线稿、详情页变焦推拉动画视频 dolly-zoom-demo.mp4。
- `assets/models/`：Lee Perry-Smith 头部扫描（CC BY 3.0，Infinite Realities，片尾需署名）。`assets/vendor/`：three.js r147 + GLTFLoader（本地，不依赖网络）。
- `SPEC.md`：每一镜的时间、画面、动作、声音、禁用项、QA 帧。

## 还没做（下次从这里继续）
1. 写各场景 composition（compositions/*.html）：A 走廊变焦推拉、B 伦勃朗光、C 王家卫抽帧、D 韦斯·安德森对称、E 一百年、F 程序员、G 二十四格、H 网站、I 回扣、J 收尾；Three.js 场景用 `hf-seek` 按时间绘制。
2. 字幕 composition（按 words.json 逐字时间、按标点分组）。
3. index.html：挂载场景、18 段旁白 <audio>、配乐与音效，root 时长约 121s。
4. `npx hyperframes check` → `snapshot --review` → REVIEW.md → 预览 → 渲染。
5. 用户的两段真实 AI 片段到了以后，替换 F 段 58–65s 的翻车位和 I 段 104–110s 的成功位。

旁白时间安排（绝对起点，秒）：s1a 0.4 · s1b 7.1 · s2a 10.3 · s2b 16.1 · s2c 24.3 · s2d 32.9 · s2e 42.0 · s3a 48.0 · s3b 50.2 · s3c 58.0 · s3d 65.0 · s4 70.6 · s5a 77.0 · s5b 83.8 · s5c 92.8 · s5d 99.8 · s6 104.4 · s7 110.6
