#!/usr/bin/env node
/* 二十四格 24frames — 零依赖开发服务器
 *
 * 用法：
 *   node dev.mjs                 # http://127.0.0.1:18766/
 *   PORT=8080 node dev.mjs
 *
 * 为什么不再用 python3 -m http.server：
 *   1. 它不发 Cache-Control，浏览器按启发式缓存长期用旧 app.js，改代码看不到效果；
 *   2. 它没有 MIME 兜底，.mjs / .webmanifest 之类会以 octet-stream 返回；
 *   3. 它不监听源码，改 src/*.js 必须手动重跑 build.mjs，也没有自动刷新。
 *
 * 这个服务器只做三件事：正确的缓存语义、改源码自动重建、重建成功后浏览器自动刷新。
 * 仍然零第三方依赖，只用 Node 内置模块；产物目录结构与 build.mjs 输出保持一致，
 * 因此部署时需要的还是纯静态文件，跟本文件无关。
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const PORT = Number(process.env.PORT || 18766);
const HOST = process.env.HOST || '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

/* 内容指纹文件名 shape：assets/app.f931d5d81c.js —— 内容变 URL 就变，可以放心长缓存。 */
const FINGERPRINTED = /\.[0-9a-f]{10}\.[a-z0-9]+$/i;

const ts = () => new Date().toTimeString().slice(0, 8);
const log = (...a) => console.log(`[${ts()}]`, ...a);

/* ---------------- 构建 ---------------- */

function build() {
  return new Promise((resolve) => {
    const t0 = Date.now();
    execFile(process.execPath, ['build.mjs'], { cwd: ROOT, maxBuffer: 8 << 20 }, (err, stdout, stderr) => {
      const ms = Date.now() - t0;
      const out = String(stdout || '').trim();
      const errText = String(stderr || '').trim();
      if (err) {
        log(`build FAILED in ${ms}ms: ${errText.split('\n').slice(-4).join(' | ') || err.message}`);
        resolve({ ok: false, ms, error: errText || err.message });
        return;
      }
      const tail = out.split('\n').filter(Boolean).slice(-2).join(' | ');
      log(`build ok in ${ms}ms${tail ? ' — ' + tail : ''}`);
      resolve({ ok: true, ms });
    });
  });
}

/* ---------------- 活刷新（SSE） ---------------- */

const clients = new Set();

function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data || {})}\n\n`;
  for (const res of clients) {
    try {
      res.write(payload);
    } catch {
      clients.delete(res);
    }
  }
}

const CLIENT_SCRIPT = `
<script>
(function () {
  if (!window.EventSource) return;
  var box = null;
  function overlay(text) {
    if (!box) {
      box = document.createElement('pre');
      box.style.cssText = 'position:fixed;left:0;right:0;bottom:0;max-height:40vh;overflow:auto;margin:0;padding:12px 16px;background:#3a0d0d;color:#ffd9d9;font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;z-index:2147483647;border-top:1px solid #7a2020';
      document.body.appendChild(box);
    }
    box.textContent = text;
  }
  var es = new EventSource('/__livereload');
  es.addEventListener('reload', function () { location.reload(); });
  es.addEventListener('building', function () { log_start(); });
  es.addEventListener('build-error', function (ev) {
    var d = {};
    try { d = JSON.parse(ev.data); } catch (e) {}
    overlay('构建失败，页面保留上一次成功的结果：\\n\\n' + (d.error || '未知错误'));
  });
  function log_start() {}
  es.onerror = function () {
    /* 服务器重启（比如改了 dev.mjs 本身）：稍后自动重连，这里不动用户页面。 */
  };
})();
</script>`;

/* ---------------- 静态服务 ---------------- */

function cacheControl(urlPath) {
  if (urlPath === '/__livereload') return 'no-store';
  const ext = path.extname(urlPath).toLowerCase();
  if (ext === '.html' || ext === '') return 'no-store';
  if (urlPath.startsWith('/assets/') && FINGERPRINTED.test(urlPath)) {
    return 'public, max-age=31536000, immutable';
  }
  return 'no-cache';
}

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  if (body === undefined) res.end();
  else res.end(body);
}

function notFound(res, reason) {
  send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    `404 ${reason}\n\n这是本地开发服务器（dev.mjs）。改源码后会自动重建并刷新页面。\n`);
}

function resolveFile(urlPath) {
  let rel = decodeURIComponent(urlPath.split('?')[0]);
  if (!rel.startsWith('/')) return null;
  rel = rel.replace(/\/+$/, '');
  const abs = path.join(ROOT, rel);
  /* 防目录穿越：解析后必须仍在 ROOT 内。 */
  if (abs !== ROOT && !abs.startsWith(ROOT + path.sep)) return null;
  return abs;
}

async function serveStatic(req, res, urlPath) {
  let file = resolveFile(urlPath);
  if (!file) return notFound(res, '非法路径');

  let stat = null;
  try {
    stat = fs.statSync(file);
    if (stat.isDirectory()) {
      file = path.join(file, 'index.html');
      stat = fs.statSync(file);
    }
  } catch {
    return notFound(res, `找不到 ${urlPath}`);
  }

  const ext = path.extname(file).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  const cc = cacheControl(urlPath);

  /* HTML 要在响应里注入活刷新客户端，所以不参与 ETag/304；它本来也是 no-store。 */
  if (ext === '.html') {
    let html = fs.readFileSync(file, 'utf8');
    html = html.includes('</body>')
      ? html.replace('</body>', `${CLIENT_SCRIPT}\n</body>`)
      : html + CLIENT_SCRIPT;
    const buf = Buffer.from(html, 'utf8');
    return send(res, 200, {
      'Content-Type': type,
      'Content-Length': buf.length,
      'Cache-Control': cc,
    }, req.method === 'HEAD' ? undefined : buf);
  }

  const etag = `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`;
  if (req.headers['if-none-match'] === etag) {
    return send(res, 304, { ETag: etag, 'Cache-Control': cc });
  }

  const headers = {
    'Content-Type': type,
    'Content-Length': stat.size,
    'Cache-Control': cc,
    ETag: etag,
    'Last-Modified': stat.mtime.toUTCString(),
  };
  if (req.method === 'HEAD') return send(res, 200, headers);

  res.writeHead(200, headers);
  fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
}

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];

  if (urlPath === '/__livereload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.write('retry: 1000\n\n');
    clients.add(res);
    const drop = () => clients.delete(res);
    req.on('close', drop);
    req.on('error', drop);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' }, '405 只支持 GET/HEAD\n');
  }

  serveStatic(req, res, urlPath).catch((e) => {
    log('serve error', urlPath, e && e.message);
    if (!res.headersSent) notFound(res, '内部错误');
    else res.destroy();
  });
});

/* ---------------- 监听源码 ---------------- */

let timer = null;
let building = false;
let pending = false;

async function rebuild(reason) {
  if (building) {
    pending = true;
    return;
  }
  building = true;
  broadcast('building', { reason });
  const r = await build();
  building = false;
  if (r.ok) broadcast('reload', { reason });
  else broadcast('build-error', { error: r.error });
  if (pending) {
    pending = false;
    rebuild('queued');
  }
}

function watchDir(dir) {
  try {
    fs.watch(dir, { recursive: true, persistent: true }, (_ev, filename) => {
      if (!filename) return;
      const name = String(filename);
      if (name.startsWith('.') || name.includes('/.') || name.endsWith('~')) return;
      clearTimeout(timer);
      timer = setTimeout(() => rebuild(name), 180);
    });
    log(`watching ${path.relative(ROOT, dir) || '.'}`);
  } catch (e) {
    log(`watch ${dir} failed: ${e.message}`);
  }
}

(async () => {
  log(`二十四格 24frames dev server — 首次构建`);
  const first = await build();
  if (!first.ok) log('首次构建失败，仍启动服务，页面会用现有产物；修复源码后会自动重建。');

  watchDir(SRC);
  try {
    fs.watch(path.join(ROOT, 'build.mjs'), { persistent: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(() => rebuild('build.mjs'), 180);
    });
    log('watching build.mjs');
  } catch { /* build.mjs 不在就算了 */ }

  server.listen(PORT, HOST, () => {
    log(`serving ${ROOT}`);
    log(`http://${HOST}:${PORT}/  (Cache-Control: html no-store / 指纹资源 immutable / 源码变更自动重建+刷新)`);
  });
})();

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    log('shutdown');
    for (const res of clients) { try { res.end(); } catch {} }
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 500).unref();
  });
}