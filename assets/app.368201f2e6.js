/* 二十四格 24frames — 检索核心（零依赖，构建期与浏览器共用）
 *
 * 浏览器：<script> 先加载本文件，挂到 window.MZ_SEARCH。
 * node  ：require('./src/search.js') 拿到同一份实现，所以「搜出几条、搜出哪些」
 *         可以在命令行里被真实断言，而不是只能靠肉眼点页面。
 *
 * 两级匹配：
 *   1) 整词命中——中文名/英文名精确 > 前缀 > 包含 > 其余字段（hay）> 0
 *   2) 整词全落空时，中文长句按二元组兜底，且至少命中 2 个二元组才算匹配。
 *      门槛设为 2 而不是 1：只命中「一圈」这种共用语会把不相关条目全带出来。
 */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.MZ_SEARCH = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var CJK = /[\u3400-\u9fff]/;

  // 全角转半角、小写、标点归一：让「ＤＯＬＬＹ」「dolly-in」「dolly in」等价。
  function normalize(text) {
    var v = text == null ? '' : String(text);
    v = v.replace(/[\uff01-\uff5e]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
    });
    v = v.replace(/\u3000/g, ' ').toLowerCase();
    v = v.replace(/-|_|\/|·|・|,|，|、|:|：|;|；|!|！|\?|？|\(|\)|（|）|\[|\]|【|】|"|'|“|”|‘|’/g, ' ');
    return v.replace(/\s+/g, ' ').trim();
  }

  function tokens(query) {
    return normalize(query).split(' ').filter(Boolean);
  }

  function bigrams(token) {
    var out = [];
    if (!CJK.test(token) || token.length < 3) return out;
    for (var i = 0; i < token.length - 1; i += 1) out.push(token.slice(i, i + 2));
    return out;
  }

  function weigh(fields, token) {
    if (!token) return 0;
    var zh = fields.zh || '';
    var en = fields.en || '';
    var hay = fields.hay || '';
    if (zh === token || en === token) return 100;
    if (zh.indexOf(token) === 0 || en.indexOf(token) === 0) return 60;
    if (zh.indexOf(token) >= 0 || en.indexOf(token) >= 0) return 30;
    if (hay.indexOf(token) >= 0) return 12;
    return 0;
  }

  function score(fields, list) {
    var best = 0;
    var i;
    for (i = 0; i < list.length; i += 1) {
      var w = weigh(fields, list[i]);
      if (w > best) best = w;
    }
    if (best) return best;
    var hits = 0;
    for (i = 0; i < list.length; i += 1) {
      var grams = bigrams(list[i]);
      for (var j = 0; j < grams.length; j += 1) {
        if ((fields.hay || '').indexOf(grams[j]) >= 0) hits += 1;
      }
    }
    return hits >= 2 ? 10 + hits : 0;
  }

  // 空查询匹配全部，返回值 >0 即命中，数值可用于排序。
  function compile(query) {
    var list = tokens(query);
    if (!list.length) return function () { return 1; };
    return function (fields) { return score(fields, list); };
  }

  return { normalize: normalize, tokens: tokens, score: score, compile: compile };
});

/* 二十四格 24frames — 前台脚本
   只做两件事：站内检索与筛选（媒体 / 维度 / 关键词）、一键复制提示词。
   无脚本时 HTML 本身仍能读完所有条目。无第三方依赖，无追踪，无网络请求。 */

(function () {
  'use strict';

  // 不能直接保存 Array.prototype.slice 再当普通函数调用：严格模式下 this 为
  // undefined，slice 内部 ToObject(this) 会抛 TypeError: Cannot convert
  // undefined or null to object，整个脚本在绑定筛选事件前就中断。
  function slice(list) { return Array.prototype.slice.call(list); }

  /* ---------- 复制 ---------- */
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* 浏览器拒绝时静默 */ }
    document.body.removeChild(ta);
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { fallbackCopy(text); });
    }
    fallbackCopy(text);
    return Promise.resolve();
  }

  function flash(btn, label) {
    var original = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', original);
    btn.textContent = label;
    btn.classList.add('done');
    window.setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove('done');
    }, 1400);
  }

  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest ? ev.target.closest('[data-copy]') : null;
    if (!btn) return;
    var src = document.querySelector(btn.getAttribute('data-copy'));
    if (!src) return;
    var label = btn.getAttribute('data-done') || '已复制';
    copy(src.textContent.trim()).then(function () { flash(btn, label); });
  });

  /* ---------- 检索与筛选 ---------- */
  slice(document.querySelectorAll('[data-filter-root]')).forEach(function (root) {
    var input = root.querySelector('[data-query]');
    var countEl = root.querySelector('[data-count]');
    var items = slice(root.querySelectorAll('[data-item]'));
    var mediaChips = slice(root.querySelectorAll('[data-fm]'));
    var dimChips = slice(root.querySelectorAll('[data-fd]'));
    var state = { q: '', media: 'all', dim: 'all' };

    // 筛选芯片上的属性是 data-fm / data-fd，卡片上才是 data-media / data-dim。
    // 之前直接用 name 取属性，一律拿到 null 回退成 'all'，于是点击只改高亮、什么都不筛。
    var CHIP_ATTR = { media: 'data-fm', dim: 'data-fd' };
    function attr(el, name) { return el.getAttribute(CHIP_ATTR[name]) || 'all'; }

    // 检索交给 src/search.js（与命令行共用同一份实现）；模块缺失时退回原来的整词子串匹配。
    var matcher = null;

    function compile() {
      matcher = window.MZ_SEARCH && state.q ? window.MZ_SEARCH.compile(state.q) : null;
    }

    function fieldsOf(el) {
      if (!el.__mz) {
        var n = window.MZ_SEARCH ? window.MZ_SEARCH.normalize : function (v) { return (v || '').toLowerCase(); };
        el.__mz = {
          zh: n(el.getAttribute('data-zh') || ''),
          en: n(el.getAttribute('data-en') || ''),
          hay: n(el.getAttribute('data-hay') || '')
        };
      }
      return el.__mz;
    }

    function matches(el) {
      if (state.media !== 'all' && el.getAttribute('data-media') !== state.media) return false;
      if (state.dim !== 'all' && el.getAttribute('data-dim') !== state.dim) return false;
      if (!state.q) return true;
      if (matcher) return matcher(fieldsOf(el)) > 0;
      var hay = el.getAttribute('data-hay') || '';
      // 任一词命中即算匹配，便于「绕着人转」「dolly 推」这类混输
      return state.q.split(/\s+/).filter(Boolean).some(function (t) {
        return hay.indexOf(t) >= 0;
      });
    }

    function toggle(el, visible) {
      if (visible) el.removeAttribute('hidden');
      else el.setAttribute('hidden', '');
    }

    function paint(chips, name) {
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', String(attr(c, name) === state[name]));
        // 当前媒体下没有条目的维度置灰，免得点了必空
        if (name === 'dim' && attr(c, name) !== 'all') {
          var d = attr(c, name);
          var any = items.some(function (el) {
            return el.getAttribute('data-dim') === d &&
              (state.media === 'all' || el.getAttribute('data-media') === state.media);
          });
          c.disabled = !any;
        }
      });
    }

    function render() {
      var shown = 0;
      var byMedia = { video: 0, image: 0 };

      items.forEach(function (el) {
        var ok = matches(el);
        toggle(el, ok);
        if (!ok) return;
        shown += 1;
        var m = el.getAttribute('data-media');
        if (byMedia[m] !== undefined) byMedia[m] += 1;
      });

      // 没有可见条目时，逐层收起：条目组 → 维度块 → 媒体块
      slice(root.querySelectorAll('[data-group-section]')).forEach(function (s) {
        toggle(s, !!s.querySelector('[data-item]:not([hidden])'));
      });
      slice(root.querySelectorAll('[data-dim-block]')).forEach(function (s) {
        toggle(s, !!s.querySelector('[data-item]:not([hidden])'));
      });
      slice(root.querySelectorAll('[data-media-block]')).forEach(function (s) {
        toggle(s, !!s.querySelector('[data-item]:not([hidden])'));
      });

      var empty = root.querySelector('[data-empty]');
      if (empty) toggle(empty, shown === 0);

      if (countEl) {
        countEl.textContent =
          '共 ' + shown + ' 条（视频 ' + byMedia.video + ' · 图片 ' + byMedia.image + '）';
      }

      paint(mediaChips, 'media');
      paint(dimChips, 'dim');
    }

    if (input) {
      input.addEventListener('input', function () {
        state.q = (input.value || '').trim().toLowerCase();
        compile();
        render();
      });
      document.addEventListener('keydown', function (ev) {
        if (ev.key === '/' && document.activeElement !== input) {
          ev.preventDefault();
          input.focus();
          input.select();
        }
      });
    }

    function wire(chips, name) {
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          if (chip.disabled) return;
          // 再点一次已选中的芯片就退回「全部」：否则只能用「全部维度」重置。
          var picked = attr(chip, name);
          state[name] = picked !== 'all' && state[name] === picked ? 'all' : picked;
          // 切媒体时把维度退回全部，避免「图片 + 运镜」这种必然清零的组合
          if (name === 'media' && state.dim !== 'all') {
            var still = items.some(function (el) {
              return el.getAttribute('data-dim') === state.dim &&
                (state.media === 'all' || el.getAttribute('data-media') === state.media);
            });
            if (!still) state.dim = 'all';
          }
          render();
        });
      });
    }

    wire(mediaChips, 'media');
    wire(dimChips, 'dim');
    compile();
    render();
  });
})();