/**
 * websearch_page.js — 作中ウェブ検索結果ページの表示制御。
 * 読み込み元: contents/search.html。
 * 依存: shared/util.js（window.SHARED_WEB_SEARCH）。
 * 役割: 検索語を判定し、レゾナ・FVS・該当なしの結果レイアウトを切り替える。
 */
(() => {
  "use strict";

  const search = window.SHARED_WEB_SEARCH || {
    classify: () => null,
    hit: () => false,
  };
  if (!window.SHARED_WEB_SEARCH)
    console.warn("[websearch] 検索ユーティリティが読み込まれていません");
  const form = document.querySelector(".search-box");
  const input = form?.querySelector("input");
  const resultLayouts = new Map(
    [...document.querySelectorAll(".search-layout[data-search-kind]")].map((layout) => [
      layout.dataset.searchKind,
      layout,
    ]),
  );
  const rezonaLayout = resultLayouts.get("rezona");
  const zero = document.querySelector(".search-zero");

  const show = (value) => {
    const kind = search.classify(value);
    const hasResult = kind !== null;
    resultLayouts.forEach((layout, layoutKind) => {
      layout.hidden = layoutKind !== kind;
    });
    if (zero) zero.hidden = hasResult;
    document.title = value ? `${value} - ウェブ検索` : "ウェブ検索";
  };

  const query = new URLSearchParams(location.search).get("q")?.trim();
  if (query) {
    input.value = query;
    show(query);
  } else {
    input.value = "";
    show("");
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (search.hit(value)) {
      location.href = `search.html?q=${encodeURIComponent(value)}`;
      return;
    }
    show(value);
  });

  const results = rezonaLayout?.querySelector(".results");
  const primary = results?.querySelector(".primary-result");
  const place = rezonaLayout?.querySelector(".place-panel");
  const mobile = matchMedia("(max-width: 980px)");
  const arrange = () => {
    if (!results || !primary || !place) return;
    if (mobile.matches) primary.insertAdjacentElement("afterend", place);
    else rezonaLayout.append(place);
  };

  arrange();
  mobile.addEventListener?.("change", arrange);

  document.querySelectorAll(".dummy-link").forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });
})();
