/**
 * resona_official.js — カラオケレゾナ公式サイトとキャンペーンページの描画。
 * 読み込み元: contents/resona_home.html、contents/resona_cmp_20260520.html。
 * 依存: resona_home.html 内のテンプレート、resona_official_data.js、shared/util.js。
 * 役割: ?page= によるページ切替、ナビ、キャンペーン、店舗情報を制御する。
 */
(() => {
  "use strict";

  const officialPage = new URLSearchParams(location.search).get("page");
  const campaignDetailPages = new Set([
    "resona_cmp_20260720",
    "resona_cmp_20260725",
    "resona_cmp_20260801",
    "resona_cmp_20260805",
  ]);
  const songCampaignImage = "media/shared_banner_campaign_song_release.webp?v=20260813";
  const officialNewsItems = window.REZONA_OFFICIAL_NEWS || [];
  const officialContent = window.REZONA_OFFICIAL_CONTENT || {};
  const escapeHtml =
    window.ECHO_AGAIN_UTIL?.escapeHtml ||
    ((value) =>
      String(value ?? "").replace(
        /[&<>"']/g,
        (character) =>
          ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
            character
          ],
      ));
  if (!officialNewsItems.length) console.warn("[resona-official] お知らせデータが空です");

  const createMascotCampaignTemplate = () => {
    if (officialPage !== "resona_cmp_20260805") return;
    const mascotCampaignTemplate = document.createElement("template");
    mascotCampaignTemplate.dataset.officialPage = "resona_cmp_20260805";
    mascotCampaignTemplate.dataset.pageTitle =
      "レゾナくん デビューキャンペーン｜カラオケレゾナ 鈴森駅前店";
    mascotCampaignTemplate.innerHTML = officialContent.mascotCampaignPage || "";
    document.body.append(mascotCampaignTemplate);
  };

  const applyPageTemplate = () => {
    const pageTemplate = officialPage
      ? document.querySelector(`template[data-official-page="${CSS.escape(officialPage)}"]`)
      : null;
    if (!pageTemplate) return;
    const currentMain = document.querySelector("main");
    currentMain?.replaceWith(pageTemplate.content.cloneNode(true));
    const officialPageLabels = {
      price: "料金",
      rooms: "ルーム",
      menu: "メニュー",
      campaigns: "キャンペーン",
      access: "アクセス",
      news: "お知らせ",
    };
    const currentPageLabel = officialPageLabels[officialPage];
    if (currentPageLabel) {
      const pageHeading = document.querySelector(".page-hero .page-title");
      if (pageHeading) pageHeading.textContent = currentPageLabel;
      document.title = `${currentPageLabel}｜カラオケレゾナ 鈴森駅前店`;
    } else {
      document.title = pageTemplate.dataset.pageTitle || document.title;
    }
    const currentNavPage = campaignDetailPages.has(officialPage) ? "campaigns" : officialPage;
    document.querySelectorAll(".global-nav a").forEach((anchor) => {
      const url = new URL(anchor.href, location.href);
      anchor.toggleAttribute("aria-current", url.searchParams.get("page") === currentNavPage);
      if (anchor.hasAttribute("aria-current")) anchor.setAttribute("aria-current", "page");
    });
    if (location.hash)
      requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
  };

  const enhanceCampaignDetail = () => {
    const campaignDetail = document.querySelector(".campaign-detail");
    if (!campaignDetail) return;
    document.body.classList.add("rezona-subpage", "rezona-campaign-detail-page");
    let campaignBack = campaignDetail.querySelector(".campaign-back");
    if (!campaignBack) {
      campaignBack = document.createElement("p");
      campaignBack.className = "campaign-back";
      campaignBack.innerHTML =
        '<a href="contents/resona_home.html?page=campaigns">‹ キャンペーン一覧へ戻る</a>';
    }
    const campaignBackLink = campaignBack.querySelector("a");
    campaignBackLink?.classList.remove("button");
    if (campaignBackLink) campaignBackLink.textContent = "‹ キャンペーン一覧へ戻る";
    campaignDetail.prepend(campaignBack);

    const campaignPageHero = document.querySelector("main > .page-hero");
    const campaignTitle =
      campaignPageHero?.querySelector(".page-title")?.textContent.trim() ||
      document.title.split("｜")[0];
    const campaignDescription = campaignPageHero?.querySelector("p:last-child")?.textContent.trim();
    const campaignBanner = campaignDetail.querySelector(".campaign-detail-banner");
    const campaignContent = campaignDetail.querySelector(".content-card");
    const campaignLead = campaignContent?.querySelector(".campaign-copy-lead");
    const campaignPeriod = campaignContent?.querySelector(".campaign-start-date");
    const endedStatus = campaignDetail.querySelector(".ended-box");
    if (campaignBanner && campaignContent) {
      const summary = document.createElement("section");
      summary.className = "campaign-summary";
      const summaryCopy = document.createElement("div");
      summaryCopy.className = "campaign-summary-copy";
      summaryCopy.innerHTML = `<p class="eyebrow">CAMPAIGN</p><h1 class="campaign-summary-title">${campaignTitle}</h1><p class="campaign-summary-lead">${campaignLead?.textContent.trim() || campaignDescription || ""}</p>`;
      if (campaignPeriod) {
        const periodLabel = campaignPeriod.querySelector("span");
        const periodTime = campaignPeriod.querySelector("time");
        if (periodLabel) periodLabel.textContent = "開催期間";
        if (periodTime && !/[～〜]/.test(periodTime.textContent))
          periodTime.textContent = `${periodTime.textContent}～`;
        summaryCopy.append(campaignPeriod);
      } else if (endedStatus) {
        summaryCopy.append(endedStatus);
      }
      summary.append(campaignBanner, summaryCopy);
      campaignBack.after(summary);
      // 詳細ページでは一覧用の導入文を除き、キャンペーン本文を先頭に見せる。
      campaignLead?.remove();
      const detailHeading = document.createElement("h2");
      detailHeading.className = "campaign-detail-heading";
      detailHeading.textContent = "キャンペーン詳細";
      campaignContent.prepend(detailHeading);
      // 専用バナーと見出しがあるため、共通ページヒーローの重複表示を避ける。
      campaignPageHero?.remove();
    }
  };

  const customizeMascotCampaignTarget = () => {
    if (officialPage !== "resona_cmp_20260805") return;
    const targetSection = [...document.querySelectorAll(".campaign-copy section")].find(
      (section) => section.querySelector("h2")?.textContent.trim() === "対象",
    );
    if (targetSection) {
      targetSection.innerHTML = officialContent.mascotCampaignTarget || "";
    }
  };

  const applySongCampaignImages = () => {
    const applySongImage = (image) => {
      image.src = songCampaignImage;
      image.classList.add("song-campaign-image");
      image.width = 1672;
      image.height = 941;
      image.alt = "新曲リリース記念 楽曲歌唱キャンペーン";
    };
    document.querySelectorAll('a[href*="resona_cmp_20260801"] img').forEach(applySongImage);
    if (officialPage !== "resona_cmp_20260801") return;
    const detailBanner = document.querySelector(".campaign-detail-banner");
    if (detailBanner) applySongImage(detailBanner);
  };

  const renderCampaignGrid = () => {
    if (officialPage && officialPage !== "campaigns") return;
    const activeCampaignGrid = document.querySelector(".campaign-grid");
    // 開催中キャンペーンの正本は一覧ページのテンプレートとし、トップも同じカードを複製する。
    // これによりタイトル・画像・期間・矢印UIがページ間でずれない。
    if (!officialPage && activeCampaignGrid) {
      const campaignTemplate = document.querySelector(
        'template[data-official-page="campaigns"]',
      );
      const sourceGrid = campaignTemplate?.content.querySelector(".campaign-grid");
      if (sourceGrid) activeCampaignGrid.replaceChildren(...sourceGrid.cloneNode(true).children);
    }
    if (
      activeCampaignGrid &&
      !activeCampaignGrid.querySelector('[data-campaign="rezona-kun-debut"]')
    ) {
      activeCampaignGrid.insertAdjacentHTML(
        "beforeend",
        officialContent.mascotCampaignCard || "",
      );
    }

    const campaignCards = Array.from(
      activeCampaignGrid?.querySelectorAll(":scope > a.campaign-card") || [],
    );
    campaignCards
      .sort((a, b) => {
        const dateA =
          a
            .querySelector(".campaign-period")
            ?.textContent.match(/\d{4}年\d{1,2}月\d{1,2}日/)?.[0] || "";
        const dateB =
          b
            .querySelector(".campaign-period")
            ?.textContent.match(/\d{4}年\d{1,2}月\d{1,2}日/)?.[0] || "";
        return dateB.localeCompare(dateA, "ja", { numeric: true });
      })
      .forEach((card, index) => {
        // トップは開催中3件に限定し、全件はキャンペーン一覧ビューで表示する。
        if (!officialPage && index >= 3) card.remove();
        else activeCampaignGrid.appendChild(card);
      });

    activeCampaignGrid?.classList.toggle("has-four-campaigns", officialPage === "campaigns");
    activeCampaignGrid?.classList.toggle("has-three-campaigns", !officialPage);
  };

  const renderRooms = () => {
    document.body.classList.add("rezona-rooms-page");
  };
  const renderMenu = () => {
    const menuImage = document.querySelector(".menu-hero-image");
    if (menuImage) {
      const feature = document.createElement("div");
      feature.className = "menu-feature";
      feature.innerHTML = officialContent.menuFeature || "";
      menuImage.replaceWith(feature);
    }
  };
  const renderPrice = () => {
    document.body.classList.add("rezona-price-page");
    const priceSummary = document.querySelector(".price-summary");
    const priceContainer = priceSummary?.parentElement;
    const priceHeadings = priceContainer
      ? [...priceContainer.children].filter((element) => element.matches("h2"))
      : [];
    const priceClasses = ["price-day", "price-night", "price-free"];
    priceHeadings.forEach((heading, index) => {
      const table = heading.nextElementSibling;
      if (!table?.classList.contains("table-wrap")) return;
      const block = document.createElement("section");
      block.className = `price-block ${priceClasses[index] || ""}`;
      priceContainer.insertBefore(block, heading);
      block.append(heading, table);
      heading.removeAttribute("style");
    });
  };
  const normalizeInformationLayout = () => {
    // 同じ役割の情報に、ページをまたいで同じ見出し・幅・カード構造を与える。
    const sectionTitle = (heading, icon) => {
      if (!heading) return;
      heading.classList.add("content-section-title");
      heading.removeAttribute("style");
      if (icon) heading.style.setProperty("--rezona-content-icon", `url("${icon}")`);
    };
    if (officialPage === "rooms") {
      sectionTitle(document.querySelector(".equipment-grid")?.previousElementSibling, "../../media/resona_icon_ui_wifi.png?v=20260813");
    }
    if (officialPage === "menu") {
      document.querySelector(".menu-feature")?.classList.add("feature-card");
      document.querySelector(".menu-grid")?.removeAttribute("style");
    }
    if (officialPage === "access") {
      document.querySelector(".access-grid")?.classList.add("information-grid");
    }
    document.querySelectorAll(".campaign-copy section > h2, .news-article-card > h2, .menu-feature-copy > h2").forEach((heading) => {
      heading.classList.add("information-title");
    });
    document.querySelectorAll(".text-link").forEach((link) => {
      link.textContent = link.textContent.replace(/\s*(?:→|＞|›)\s*$/, "").trim();
    });
  };
  const applyBasePageClass = () => {
    if (officialPage) document.body.classList.add("rezona-subpage");
  };

  const applyCampaignPageClass = () => {
    if (officialPage === "campaigns" || campaignDetailPages.has(officialPage))
      document.body.classList.add("rezona-campaign-page");
  };

  const renderHome = () => {
    if (officialPage) return;
    document.body.classList.add("rezona-home-page");

    const campaignSection = document.querySelector("main > .section.compact.soft");
    campaignSection?.classList.add("home-campaign-section");
    campaignSection
      ?.querySelector(".section-head")
      ?.insertAdjacentHTML(
        "beforeend",
        '<div class="home-campaign-all home-news-all"><a href="contents/resona_home.html?page=campaigns">キャンペーン一覧を見る <span class="ui-link-arrow" aria-hidden="true"></span></a></div>',
      );
    const guideSection = document.createElement("section");
    guideSection.className = "section compact home-guide-section";
    guideSection.innerHTML = officialContent.guideSection || "";
    campaignSection?.before(guideSection);

    const newsSection = document.querySelector("main > .section.compact.white");
    newsSection?.classList.add("home-news-section");
    const newsSectionHeading = newsSection?.querySelector(".section-head h2");
    if (newsSectionHeading) newsSectionHeading.textContent = "お知らせ";
  };

  const renderHomeNews = () => {
    const homeNewsList = document.querySelector(".home-news-section .news-list");
    if (!homeNewsList) return;
    homeNewsList.innerHTML = officialNewsItems
      .slice(0, 3)
      .map((item) => renderNewsItem(item, { wrap: true, idPrefix: "home-" }))
      .join("");
    homeNewsList
      .closest(".home-news-section")
      ?.querySelector(".section-head")
      ?.insertAdjacentHTML(
        "beforeend",
        '<div class="home-news-all"><a href="contents/resona_home.html?page=news">お知らせ一覧を見る <span class="ui-link-arrow" aria-hidden="true"></span></a></div>',
      );
  };

  const renderNewsItem = (item, { wrap = false, idPrefix = "" } = {}) => {
    const article = `<details class="news-index-row${wrap ? " home-news-row" : ""} ui-disclosure" id="${escapeHtml(idPrefix + item.id)}">
      <summary class="ui-list-row">
        <span class="news-index-meta"><time datetime="${escapeHtml(item.date.replaceAll(".", "-"))}">${escapeHtml(item.date)}</time><span class="label">${escapeHtml(item.category)}</span></span>
        <span class="news-index-title">${escapeHtml(item.title)}</span>
        <span class="news-index-arrow ui-row-arrow" aria-hidden="true"></span>
      </summary>
      <div class="news-index-body ui-disclosure-body">${item.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}${item.related || ""}</div>
    </details>`;
    return wrap ? `<li>${article}</li>` : article;
  };

  const renderNews = () => {
    const newsArticles = document.querySelector(".news-articles");
    if (!newsArticles) return;
    document.body.classList.add("rezona-news-page");
    newsArticles.classList.add("news-index-list");
    newsArticles.innerHTML = officialNewsItems.map((item) => renderNewsItem(item)).join("");
  };
  const setupGlobalHandlers = () => {
    const body = document.body;
    const menu = document.querySelector("[data-menu-button]");
    const nav = document.querySelector("[data-nav]");

    document.querySelectorAll(".fiction-note").forEach((note) => {
      note.innerHTML =
        '<span class="fiction-line">このWebサイトの内容は考察コンテンツのために作られたフィクションであり、</span><span class="fiction-line">実在の人物・団体とは一切関係がありません。</span>';
    });
    const setMenu = (open) => {
      if (!menu || !nav) return;
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
      nav.classList.toggle("is-open", open);
      body.classList.toggle("nav-open", open);
    };

    menu?.addEventListener("click", () =>
      setMenu(menu.getAttribute("aria-expanded") !== "true"),
    );
    nav
      ?.querySelectorAll("a")
      .forEach((anchor) => anchor.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });

    document
      .querySelectorAll('a[href*="resona_staff.html"], a[href*="resona_cmp_20260520.html"]')
      .forEach((anchor) => {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      });

    document.addEventListener("click", (event) => {
      if (
        location.protocol !== "file:" ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = event.target.closest("a[href]");
      if (!anchor || anchor.hasAttribute("download") || anchor.target) return;
      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("#") || /^(?:mailto:|tel:|javascript:)/i.test(raw)) return;
      const destination = new URL(raw, location.href);
      if (destination.protocol === "file:" && destination.pathname.endsWith("/")) {
        event.preventDefault();
        destination.pathname += "index.html";
        location.href = destination.href;
      }
    });
  };
  const applySharedComponentClasses = () => {
    document
      .querySelectorAll(".campaign-card, .room-card, .menu-card, .content-card")
      .forEach((card) => card.classList.add("ui-card"));
    document
      .querySelectorAll(".campaign-card")
      .forEach((card) => card.classList.add("ui-card-media"));
  };
  // 実行順はDOMの前提関係を表す。テンプレート適用後に詳細ページを加工する。
  applyBasePageClass();
  createMascotCampaignTemplate();
  applyPageTemplate();
  enhanceCampaignDetail();
  customizeMascotCampaignTarget();
  applySongCampaignImages();
  renderCampaignGrid();
  if (officialPage === "rooms") renderRooms();
  if (officialPage === "menu") renderMenu();
  if (officialPage === "price") renderPrice();
  normalizeInformationLayout();
  applyCampaignPageClass();
  renderHome();
  renderHomeNews();
  if (officialPage === "news") renderNews();
  applySharedComponentClasses();
  setupGlobalHandlers();
})();
