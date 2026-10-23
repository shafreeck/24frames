/* 二十四格 24frames — 检索核心（零依赖，构建期与浏览器共用）
 *
 * 浏览器：<script> 先加载本文件，挂到 window.MZ_SEARCH。
 * node  ：require('./src/search.js') 拿到同一份实现，所以「搜出几条、搜出哪些」
 *         可以在命令行里被真实断言，而不是只能靠肉眼点页面。
 *
 * 第一代 compile（旧静态站在用）：两级匹配：
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

  /* ---------- 第二代：整库索引，支持一句白话 ----------
   * 没有 AI、没有向量，靠三件事把一句话变得可搜：
   *   1) 词项：英文按词、中文按相邻两字（单字就用单字）。
   *   2) 权重：越少见的词越有信息量（IDF）；「镜头」「画面」这种几乎条条都有的词自动降权。
   *      命中名称 > 白话说法 / 别名 > 正文。
   *   3) 覆盖率：一句话里有信息量的词，至少要命中一定比例，否则不算——防止长句把半个库都带出来。
   * docs: [{ zh, en, key, hay }]，key = 别名 + 白话说法；返回与 docs 对齐的分数数组，0 表示不匹配。 */
  var COMMON = 0.3;      // 出现在超过 30% 条目里的词视为常见词
  var FIELD = { name: 3, key: 2.5, hay: 1 };
  // 含虚词的两字组合（「的人」「多了」）不携带信息，只会拉低覆盖率
  var PARTICLE = /[的了着得地吗呢吧啊么]/;

  function terms(text) {
    var out = [];
    var list = tokens(text);
    for (var i = 0; i < list.length; i += 1) {
      var runs = list[i].match(/[㐀-鿿]+|[^㐀-鿿]+/g) || [];
      for (var r = 0; r < runs.length; r += 1) {
        var run = runs[r];
        if (CJK.test(run)) {
          if (run.length === 1) out.push(run);
          for (var j = 0; j < run.length - 1; j += 1) {
            var gram = run.slice(j, j + 2);
            if (!PARTICLE.test(gram)) out.push(gram);
          }
        } else if (run.length >= 2) {
          out.push(run);
        }
      }
    }
    var seen = {};
    return out.filter(function (t) { if (seen[t]) return false; seen[t] = true; return true; });
  }

  function createIndex(docs) {
    var rows = docs.map(function (d) {
      var name = normalize((d.zh || '') + ' ' + (d.en || ''));
      var key = normalize(d.key || '');
      var hay = normalize(d.hay || '');
      return { zh: normalize(d.zh), en: normalize(d.en), name: name, key: key, hay: hay, all: name + ' ' + key + ' ' + hay };
    });
    var N = rows.length || 1;
    var dfCache = {};
    function df(t) {
      if (dfCache[t] == null) {
        var n = 0;
        for (var i = 0; i < rows.length; i += 1) if (rows[i].all.indexOf(t) >= 0) n += 1;
        dfCache[t] = n;
      }
      return dfCache[t];
    }

    function search(query) {
      var raw = tokens(query);
      if (!raw.length) return rows.map(function () { return 1; });
      var ts = terms(query).map(function (t) {
        var d = df(t);
        var w = d ? Math.log(1 + N / d) : 0;
        if (d / N > COMMON) w *= 0.15;
        return { t: t, w: w };
      });
      // 库里根本没有的词不参与打分，但按三成权重计入分母：句子里大半是生词时不应硬凑出结果
      var total = 0;
      for (var k = 0; k < ts.length; k += 1) total += ts[k].w || 0.3 * Math.log(1 + N);
      ts = ts.filter(function (x) { return x.w > 0; });

      return rows.map(function (row) {
        // 整词加分：用户直接打出了术语名或别名
        var bonus = 0;
        for (var i = 0; i < raw.length; i += 1) {
          var tok = raw[i];
          if (tok.length < 2 && !CJK.test(tok)) continue;
          if (row.zh === tok || row.en === tok) bonus = Math.max(bonus, 100);
          else if (row.zh.indexOf(tok) === 0 || row.en.indexOf(tok) === 0) bonus = Math.max(bonus, 60);
          else if (row.name.indexOf(tok) >= 0) bonus = Math.max(bonus, 40);
          else if (tok.length >= 2 && row.key.indexOf(tok) >= 0) bonus = Math.max(bonus, 30);
        }
        var s = 0, hit = 0;
        for (var j = 0; j < ts.length; j += 1) {
          var t = ts[j].t, f = 0;
          if (row.name.indexOf(t) >= 0) f = FIELD.name;
          else if (row.key.indexOf(t) >= 0) f = FIELD.key;
          else if (row.hay.indexOf(t) >= 0) f = FIELD.hay;
          if (f) { s += ts[j].w * f; hit += ts[j].w; }
        }
        var cover = total ? hit / total : 0;
        // 词项越多，要求的覆盖率越高；整词命中则直接放行
        var need = ts.length <= 2 ? 0.5 : ts.length <= 5 ? 0.45 : 0.4;
        if (!bonus && cover < need) return 0;
        return +(bonus + s * (0.5 + cover)).toFixed(4);
      });
    }

    return { search: search, size: rows.length };
  }

  return { normalize: normalize, tokens: tokens, score: score, compile: compile, terms: terms, createIndex: createIndex };
});