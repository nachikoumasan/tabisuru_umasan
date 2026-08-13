/**
 * resona_journal.js — カラオケレゾナ 鈴森駅前店スタッフブログの描画。
 * 読み込み元: contents/resona_staff.html。
 * 依存: resona_journal_data.js、shared/util.js。
 * 役割: 最新記事、アーカイブ、記事詳細、前後記事リンクを生成する。
 */
(() => {
  "use strict";

  const menuButton = document.querySelector("[data-menu-button]");
  const navigation = document.querySelector("[data-nav]");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
      navigation.classList.toggle("is-open", open);
    });
  }

  if (!window.REZONA_JOURNAL_POSTS?.length) console.warn("[resona-journal] 記事データが空です");
  const posts = [...(window.REZONA_JOURNAL_POSTS || [])].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  const escapeHtml = window.ECHO_AGAIN_UTIL?.escapeHtml;
  if (!escapeHtml) {
    console.warn("[resona-journal] 共通ユーティリティが読み込まれていません");
    return;
  }
  const esc = escapeHtml;
  const articleUrl = (post) => `contents/resona_staff.html?post=${encodeURIComponent(post.id)}`;

  const requestedPost = new URLSearchParams(location.search).get("post") || "";
  const pageMain = document.querySelector("#main");
  if (requestedPost && pageMain) {
    pageMain.className = "";
    pageMain.innerHTML = '<div class="container blog-layout" data-blog-article></div>';
  }

  if (pageMain) {
    pageMain.insertAdjacentHTML(
      "afterbegin",
      '<section class="staff-blog-hero page-hero" aria-labelledby="staff-blog-title"><div class="container"><p class="eyebrow">STAFF BLOG</p><h1 id="staff-blog-title">鈴森駅前店 スタッフブログ</h1><p>店舗での出来事やキャンペーン情報を、スタッフがお届けします。</p></div></section>',
    );
  }

  const indexRoot = document.querySelector("[data-blog-index]");
  if (indexRoot) {
    const dateText = (post) => post.date.replaceAll("-", ".");
    const excerpt = (post) => esc(post.body[0] || "");
    const featuredVisuals = {
      "summer-nearly-over": "media/resona_home_campaign_summer_long.jpg?v=20260813",
      "monitor-program-duration": "media/resona_banner_campaign_monitor.webp?v=20260813",
      "same-song-at-night": "media/resona_home_campaign_one_more_song_cover.webp?v=20260813",
    };
    const featuredCard = (post) =>
      `<article class="staff-featured-card ui-card ui-card-media"><a href="${articleUrl(post)}"><img src="${featuredVisuals[post.id] || "media/resona_photo_store_exterior.webp?v=20260813"}" width="640" height="360" alt="" loading="lazy"><div><time datetime="${post.date}">${dateText(post)}</time><h2>${esc(post.title)}</h2><p>${excerpt(post)}</p><span>記事を読む <b class="ui-link-arrow" aria-hidden="true"></b></span></div></a></article>`;
    const archiveRow = (post) =>
      `<li><a class="ui-list-row" href="${articleUrl(post)}"><time datetime="${post.date}">${dateText(post)}</time><span>${esc(post.title)}</span><b class="ui-row-arrow" aria-hidden="true"></b></a></li>`;
    const featuredPosts = posts.slice(0, 3);
    const archivePosts = posts.slice(3);
    indexRoot.innerHTML = `<section class="staff-index"><section class="staff-featured"><div class="staff-index-heading"><h2><img src="media/resona_icon_staff_latest.png?v=20260813" width="34" height="34" alt="">新着記事</h2></div><div class="staff-featured-grid">${featuredPosts.map(featuredCard).join("")}</div></section><section class="staff-archive"><div class="staff-index-heading"><h2><img src="media/resona_icon_staff_archive.png?v=20260813" width="34" height="34" alt="">過去の記事</h2></div><ul class="staff-archive-list ui-card ui-list">${archivePosts.map(archiveRow).join("")}</ul></section></section>`;
  }

  const articleRoot = document.querySelector("[data-blog-article]");
  if (!articleRoot) return;

  const post = posts.find((item) => item.id === requestedPost);
  if (!post) {
    articleRoot.innerHTML =
      '<section class="error-state"><h1>記事が見つかりません</h1><p>指定された記事は存在しません。</p><a class="button" href="contents/resona_staff.html">記事一覧へ戻る</a></section>';
    return;
  }

  document.title = `${post.title}｜カラオケレゾナ 鈴森駅前店 スタッフブログ`;
  const description = post.body[0].slice(0, 110);
  const descriptionMeta = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const canonical = document.querySelector('link[rel="canonical"]');
  if (descriptionMeta) descriptionMeta.content = description;
  if (ogTitle) ogTitle.content = post.title;
  if (canonical) canonical.href = articleUrl(post);

  const currentIndex = posts.indexOf(post);
  const previous = posts[currentIndex + 1] || null;
  const next = posts[currentIndex - 1] || null;
  const paragraphs = post.body.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
  articleRoot.innerHTML = `
    <nav class="breadcrumb"><a href="contents/resona_staff.html">ブログトップ</a> &gt; ${esc(post.title)}</nav>
    <article class="blog-article">
      <header><time datetime="${post.date}">${post.date.replaceAll("-", ".")}</time><h1>${esc(post.title)}</h1></header>
      <div class="blog-body">${paragraphs}</div>
      <p class="entry-sign"><strong>店長 田村浩司</strong></p>
      <nav class="entry-pager" aria-label="記事間の移動">
        ${previous ? `<a class="pager-previous" href="${articleUrl(previous)}"><span>← 前の記事</span><strong>${esc(previous.title)}</strong></a>` : "<span></span>"}
        ${next ? `<a class="pager-next" href="${articleUrl(next)}"><span>次の記事 →</span><strong>${esc(next.title)}</strong></a>` : "<span></span>"}
      </nav>
      <p class="back-list"><a href="contents/resona_staff.html">記事一覧へ戻る</a></p>
    </article>`;
})();
