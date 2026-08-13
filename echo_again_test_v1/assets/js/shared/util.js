/**
 * shared/util.js — 複数サイトで共有する表示・検索ユーティリティ。
 * 読み込み元: index.html、contents/search.html、contents/fvs_home.html、contents/resona_home.html、contents/resona_cmp_20260520.html、contents/resona_staff.html、contents/fvs_research_archive.html、contents/fvs_safety_control.html。
 * 依存: なし（window.ECHO_AGAIN_UTIL と window.SHARED_WEB_SEARCH を公開）。
 * 役割: HTMLエスケープ、日付整形、検索文字列の正規化と分類を提供する。
 */
(() => {
  "use strict";

  // NFKC・小文字化・空白除去により、全半角や大文字小文字など検索時の表記ゆれを吸収する。
  const normalizeText = (value) =>
    String(value ?? "")
      .normalize("NFKC")
      .toLocaleLowerCase("ja")
      .replace(/[\s\u3000]+/g, "");

  const formatDate = (value) => {
    const match = String(value ?? "").match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    return match ? `${match[1]}年${Number(match[2])}月${Number(match[3])}日` : String(value ?? "");
  };

  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  const patterns = {
    all: /[&<>"']/g,
    doubleQuote: /[&<>"]/g,
    basic: /[&<>]/g,
  };
  const escapeHtml = (value, mode = "all") =>
    String(value).replace(patterns[mode] || patterns.all, (character) => entities[character]);

  window.ECHO_AGAIN_UTIL = Object.freeze({
    ...(window.ECHO_AGAIN_UTIL || {}),
    normalizeText,
    formatDate,
    escapeHtml,
  });

  const normalize = (value) => window.ECHO_AGAIN_UTIL.normalizeText(value);
  const rezonaTerms = new Set([
    "カラオケレゾナ",
    "カラオケレゾナ鈴森駅前店",
    "カラオケレゾナ鈴森",
    "カラオケ鈴森レゾナ",
    "レゾナカラオケ鈴森",
    "レゾナ鈴森カラオケ",
    "鈴森カラオケレゾナ",
    "鈴森レゾナカラオケ",
  ]);
  const fvsTerm = "未来音声科学研究所";
  const classify = (value) => {
    const query = normalize(value);
    if (query.includes(fvsTerm)) return "fvs";
    if (rezonaTerms.has(query)) return "rezona";
    return null;
  };

  window.SHARED_WEB_SEARCH = Object.freeze({
    normalize,
    classify,
    hit: (value) => classify(value) !== null,
  });
})();
