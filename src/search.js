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