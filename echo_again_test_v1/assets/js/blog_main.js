/**
 * blog_main.js — 奈緒ブログ（index.html）の描画と画面遷移。
 * 読み込み元: index.html。
 * 依存: blog_articles.js、shared/util.js。
 * 役割: 記事一覧・記事詳細のルーティング、写真モーダル、サイドバー検索を制御する。
 */
"use strict";
(() => {
  if (!window.BLOG_ARTICLES?.length) console.warn("[blog] 記事データが空です");
  const articles = [...(window.BLOG_ARTICLES || [])].sort((a, b) =>
    `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`),
  );
  const utility = window.ECHO_AGAIN_UTIL || {};
  if (!utility.escapeHtml || !utility.formatDate) {
    console.warn("[blog] 共通ユーティリティが読み込まれていません");
    return;
  }
  const escapeHtml = utility.escapeHtml;
  const fmt = utility.formatDate;
  const searchHit = (value) => window.SHARED_WEB_SEARCH?.hit(value) === true;
  const href = (a) => `index.html#/entry/${a.id}`;
  const listHref = (key, value, page = 1) => {
    const searchParams = new URLSearchParams();
    if (key && value) searchParams.set(key, value);
    if (page > 1) searchParams.set("page", String(page));
    const queryString = searchParams.toString();
    return `index.html${queryString ? `?${queryString}` : ""}`;
  };
  const iconPaths = {
    home: `<path d="m3 11 9-8 9 8v9H6v-9m4 9v-6h4v6"/>`,
    list: `<path d="M8 6h12M8 12h12M8 18h12M4 6h.1M4 12h.1M4 18h.1"/>`,
    category: `<path d="M3 5h7l2 3h9v11H3z"/>`,
    archive: `<path d="M4 8h16v12H4zM3 4h18v4H3zm6 8h6"/>`,
    clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
    calendar: `<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M7 3v4m10-4v4M3 10h18"/>`,
    profile: `<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/>`,
    prev: `<path d="m15 5-7 7 7 7"/>`,
    next: `<path d="m9 5 7 7-7 7"/>`,
    zoom: `<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5M10.5 7v7m-3.5-3.5h7"/>`,
    search: `<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>`,
    menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
  };
  const icon = (name) =>
    `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${iconPaths[name] || ""}</svg>`;
  const image = (a) => `media/${a.image.includes(".") ? a.image : `${a.image}.webp`}?v=20260813`;
  const header = () =>
    `<a class="skip" href="#main">本文へ移動</a><header class="site-head"><div class="header-visual"><img src="media/blog_header_blog.webp?v=20260813" width="1600" height="400" alt="夕方の部屋に置いたカメラと写真"><a class="logo" href="index.html"><b>日々の置き場所</b><span>写真と、忘れたくないこと。</span></a></div></header>`;
  const footer = () =>
    `<footer class="site-footer"><p class="fiction-note"><span class="fiction-line">このWebサイトの内容は考察コンテンツのために作られたフィクションであり、</span><span class="fiction-line">実在の人物・団体とは一切関係がありません。</span></p></footer>`;
  const sidebar = () => {
    const cats = [...new Set(articles.map((a) => a.category))],
      months = [...new Set(articles.map((a) => a.date.slice(0, 7)))];
    return `<aside class="sidebar"><section class="profile"><h2>${icon("profile")}プロフィール</h2><img src="media/blog_profile.webp?v=20260813" width="600" height="600" alt="明るい窓辺の黄色い花とコンパクトカメラ"><div><b>奈緒</b></div><p>音楽と散歩と、たまに出かけた場所のこと。写真を整理しながら、思い出したことを書いています。</p></section><section class="google-search"><h2>${icon("search")}ウェブ検索</h2><form class="google-search-box" role="search"><label class="sr-only" for="google-q">ウェブ検索</label><input id="google-q" type="search" autocomplete="off" placeholder="ウェブ検索"><button type="submit" aria-label="検索">検索</button></form><p class="web-search-message" role="status" hidden>該当する検索結果はありません。</p></section><section class="recent"><h2>${icon("clock")}最近の記事</h2><ul>${articles
      .slice(0, 5)
      .map(
        (a) =>
          `<li><a href="${href(a)}"><span>${escapeHtml(a.title)}</span><time>${fmt(a.date)}</time></a></li>`,
      )
      .join(
        "",
      )}</ul></section><section><h2>${icon("category")}カテゴリー</h2><ul>${cats.map((c) => `<li><a class="side-stat" href="${listHref("category", c)}"><span>${c}</span><small>（${articles.filter((a) => a.category === c).length}）</small></a></li>`).join("")}</ul></section><section><h2>${icon("archive")}月別</h2><ul>${months
      .map((m) => {
        const [y, mo] = m.split("-");
        return `<li><a class="side-stat" href="${listHref("month", m)}"><span>${y}年${Number(mo)}月</span><small>（${articles.filter((a) => a.date.startsWith(m)).length}）</small></a></li>`;
      })
      .join("")}</ul></section></aside>`;
  };
  const photo = (a, detail = false) =>
    detail
      ? `<button class="photo-open" data-photo="${a.id}" aria-label="画像を拡大：${escapeHtml(a.title)}"><img src="${image(a)}" width="1448" height="1086" alt="${escapeHtml(a.imageAlt)}"><span class="zoom-hint" aria-hidden="true">${icon("zoom")}</span></button>`
      : `<a class="post-photo" href="${href(a)}"><img src="${image(a)}" width="1448" height="1086" alt="${escapeHtml(a.imageAlt)}" loading="lazy"></a>`;
  const articlePhoto = (a) =>
    a.image ? `<figure class="inline-photo">${photo(a, true)}</figure>` : "";
  const articleBody = (a) => a.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
  const card = (a) =>
    `<article class="post${a.image ? " has-photo" : ""}${a.excerpt.length ? "" : " is-empty"}"><header><h2><a href="${href(a)}">${escapeHtml(a.title)}</a></h2><p class="meta"><span>${icon("calendar")}<time datetime="${a.date}T${a.time}">${fmt(a.date)}</time></span><span>${icon("clock")}${a.time}</span><span>${a.category}</span></p></header>${a.image ? `<figure class="list-photo">${photo(a)}</figure>` : ""}<div class="excerpt${a.excerpt.length ? "" : " empty-excerpt"}"${a.excerpt.length ? "" : ' aria-label="本文はありません"'}>${a.excerpt.length ? `<p>${a.excerpt.map((p) => escapeHtml(p)).join("\n\n")}</p>` : ""}</div><a class="read-more" href="${href(a)}">${a.excerpt.length ? "続きを読む" : "記事を開く"} <span>→</span></a></article>`;
  const adSection = () =>
    `<section class="ad-section" aria-label="広告"><h2>広告</h2><button class="ad-card" type="button" data-ad-open aria-haspopup="dialog" aria-controls="ad-modal"><img src="media/blog_ad_nachiko_one_more_song_202608.webp?v=20260813" width="1672" height="941" alt="Nachiko ニューシングル One More Song 2026年8月リリース広告"></button></section>`;
  const modal = () =>
    `<dialog id="photo-modal" aria-labelledby="modal-title"><div class="modal-box"><button class="close" type="button" aria-label="画像を閉じる"><span aria-hidden="true">×</span></button><h2 id="modal-title">写真を拡大</h2><div class="modal-content"></div></div></dialog>`;
  const adModal = () => `
    <dialog id="ad-modal" class="ad-modal" aria-labelledby="ad-title">
      <div class="ad-release ad-splash">
        <button class="ad-close" type="button" data-ad-close aria-label="広告を閉じる">×</button>
        <div class="ad-splash-hero">
          <section class="ad-release-info">
            <p class="ad-release-label">NEW DIGITAL SINGLE</p>
            <p class="ad-release-date">2026.08 RELEASE</p>
            <h2 id="ad-title">One More Song</h2>
            <p class="ad-release-artist">Nachiko</p>
            <p class="ad-release-copy">夜の帰り道に残る、<br>言葉にできなかった気持ちを歌った一曲。</p>
          </section>
          <img class="ad-cover" src="media/nachiko_cover_one_more_song.webp?v=20260813" width="1254" height="1254" alt="Nachiko One More Song ジャケット写真">
        </div>
        <section class="ad-campaign-teaser">
          <img src="media/shared_banner_campaign_song_release.webp?v=20260813" width="1672" height="941" alt="新曲リリース記念 楽曲歌唱キャンペーン">
          <div>
            <p>KARAOKE CAMPAIGN</p>
            <h3>新曲リリース記念<br>楽曲歌唱キャンペーン</h3>
            <a class="ad-feature-link" href="contents/nachiko_new_release.html" target="_blank" rel="noopener">特集ページへ <span aria-hidden="true">›</span></a>
          </div>
        </section>
      </div>
    </dialog>`;
  const shell = (content) =>
    `${header()}<main id="main"><div class="wrap layout">${content}${sidebar().replace("</aside>", `${adSection()}</aside>`)}</div></main>${footer()}${modal()}${adModal()}`;
  const pageNav = (page, total, key, value) =>
    total > 1
      ? `<nav class="page-nav" aria-label="ページ送り">${page > 1 ? `<a class="page-prev" href="${listHref(key, value, page - 1)}">${icon("prev")}前のページ</a>` : "<span></span>"}<div>${Array.from(
          { length: total },
          (_, i) => i + 1,
        )
          .map((n) =>
            n === page
              ? `<strong aria-current="page">${n}</strong>`
              : `<a href="${listHref(key, value, n)}">${n}</a>`,
          )
          .join(
            "",
          )}</div>${page < total ? `<a class="page-next" href="${listHref(key, value, page + 1)}">次のページ${icon("next")}</a>` : "<span></span>"}</nav>`
      : "";
  const entryDirectionLink = (direction, article) => {
    if (!article) return "";
    const isPrevious = direction === "prev";
    const copy = `<span><small>${isPrevious ? "前の記事" : "次の記事"}</small><b>${escapeHtml(article.title)}</b></span>`;
    const arrow = `<span class="nav-arrow">${icon(direction)}</span>`;
    return `<a class="${isPrevious ? "prev-post" : "next-post"}" href="${href(article)}">${isPrevious ? `${arrow}${copy}` : `${copy}${arrow}`}</a>`;
  };
  const entryNav = (previous, next) =>
    `<nav class="entry-nav" aria-label="前後の記事">${entryDirectionLink("prev", previous)}${entryDirectionLink("next", next)}</nav>`;
  const bindSidebarSearch = () => {
    const searchForm = document.querySelector(".google-search-box"),
      searchInput = document.querySelector("#google-q"),
      searchMessage = document.querySelector(".web-search-message");
    searchForm?.addEventListener("submit", (ev) => {
      ev.preventDefault();
      if (searchHit(searchInput.value)) {
        if (searchMessage) searchMessage.hidden = true;
        window.open(
          `contents/search.html?q=${encodeURIComponent(searchInput.value.trim())}`,
          "_blank",
          "noopener",
        );
      } else if (searchMessage) searchMessage.hidden = false;
    });
    searchInput?.addEventListener("input", () => {
      if (searchMessage) searchMessage.hidden = true;
    });
    searchInput?.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        searchForm.requestSubmit();
      }
    });
  };
  const bindMobileMenu = () => {
    const menu = document.querySelector(".menu"),
      nav = document.querySelector("#nav");
    menu?.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("open", !open);
    });
  };
  const bindPhotoDialog = () => {
    const dialog = document.querySelector("#photo-modal");
    let opener = null;
    const close = () => dialog?.close();
    document.querySelectorAll("[data-photo]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const article = articles.find((item) => item.id === btn.dataset.photo);
        opener = btn;
        dialog.querySelector(".modal-content").innerHTML =
          `<div class="modal-photo"><img src="${image(article)}" alt="${escapeHtml(article.imageAlt)}"></div>`;
        document.body.classList.add("locked");
        dialog.showModal();
        dialog.querySelector(".close").focus();
      }),
    );
    dialog?.querySelector(".close").addEventListener("click", close);
    dialog?.addEventListener("click", (ev) => {
      if (ev.target === dialog) close();
    });
    dialog?.addEventListener("cancel", (ev) => {
      ev.preventDefault();
      close();
    });
    dialog?.addEventListener("close", () => {
      document.body.classList.remove("locked");
      opener?.focus();
    });
    dialog?.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" || ev.key === "Esc") {
        ev.preventDefault();
        close();
        return;
      }
      if (ev.key !== "Tab") return;
      const focusableElements = [...dialog.querySelectorAll("button,[href]")].filter(
        (element) => !element.disabled,
      );
      if (!focusableElements.length) return;
      const first = focusableElements[0],
        last = focusableElements[focusableElements.length - 1];
      if (ev.shiftKey && document.activeElement === first) {
        ev.preventDefault();
        last.focus();
      } else if (!ev.shiftKey && document.activeElement === last) {
        ev.preventDefault();
        first.focus();
      }
    });
  };
  const bind = () => {
    bindSidebarSearch();
    bindMobileMenu();
    bindPhotoDialog();
  };
  const renderHome = () => {
    const searchParams = new URLSearchParams(location.search),
      category = searchParams.get("category"),
      month = searchParams.get("month"),
      key = category ? "category" : month ? "month" : "",
      value = category || month || "";
    const filtered = category
      ? articles.filter((a) => a.category === category)
      : month && /^\d{4}-\d{2}$/.test(month)
        ? articles.filter((a) => a.date.startsWith(month))
        : articles;
    const requested = Number(searchParams.get("page")) || 1,
      total = Math.max(1, Math.ceil(filtered.length / 5)),
      page = Math.min(Math.max(requested, 1), total),
      items = filtered.slice((page - 1) * 5, page * 5);
    const heading = category
      ? `カテゴリー「${escapeHtml(category)}」`
      : month
        ? `${escapeHtml(month.slice(0, 4))}年${Number(month.slice(5))}月の記事`
        : "最近の記事";
    document.querySelector("#app").innerHTML = shell(
      `<section class="content"><div class="section-title"><h1>${heading}</h1><span>${filtered.length}件</span></div>${items.map(card).join("")}${pageNav(page, total, key, value)}</section>`,
    );
    bind();
  };
  const renderArticle = (id) => {
    const article = articles.find((item) => item.id === id);
    if (!article) {
      location.replace("index.html");
      return;
    }
    const oldest = [...articles].reverse(),
      articleIndex = oldest.findIndex((item) => item.id === article.id),
      prev = oldest[articleIndex - 1],
      next = oldest[articleIndex + 1];
    document.title = `${article.title}｜日々の置き場所`;
    document.querySelector("#app").innerHTML = shell(
      `<article class="entry${article.body.length ? "" : " is-empty"}">
        <nav class="breadcrumbs"><a href="index.html">トップ</a><span>›</span><span>${escapeHtml(article.title)}</span></nav>
        <header>
          <h1>${escapeHtml(article.title)}</h1>
          <p class="meta"><span>${icon("calendar")}<time datetime="${article.date}T${article.time}">${fmt(article.date)}</time></span><span>${icon("clock")}${article.time}</span><span>${article.category}</span></p>
        </header>
        <div class="body${article.body.length ? "" : " empty-body"}"${article.body.length ? "" : ' aria-label="本文はありません"'}>${articleBody(article)}</div>
        ${articlePhoto(article)}
        ${entryNav(prev, next)}
      </article>`,
    );
    bind();
  };
  const route = () => {
    const match = location.hash.match(/^#\/entry\/(\d{2})$/);
    if (match) {
      renderArticle(match[1]);
      window.scrollTo(0, 0);
      return;
    }
    if (location.hash === "#main") {
      document.querySelector("#main")?.focus();
      return;
    }
    document.title = "日々の置き場所";
    renderHome();
  };
  let adOpener = null;
  document.addEventListener("click", (ev) => {
    const open = ev.target.closest?.("[data-ad-open]"),
      close = ev.target.closest?.("[data-ad-close]"),
      dialog = document.querySelector("#ad-modal");
    if (open && dialog) {
      adOpener = open;
      document.body.classList.add("locked");
      dialog.showModal();
      dialog.querySelector(".ad-close")?.focus();
      return;
    }
    if (close && dialog) {
      dialog.close();
      return;
    }
    if (ev.target === dialog) dialog.close();
  });
  document.addEventListener(
    "close",
    (ev) => {
      if (ev.target.id !== "ad-modal") return;
      document.body.classList.remove("locked");
      adOpener?.focus();
    },
    true,
  );
  window.addEventListener("hashchange", route);
  route();
})();
