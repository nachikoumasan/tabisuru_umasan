/**
 * fvs_research.js — 未来音声科学研究所サイトのページ描画と資料検索。
 * 読み込み元: contents/fvs_home.html。
 * 依存: fvs_public_data.js、fvs_publications_data.js、shared/util.js。
 * 役割: ?page= によるビュー切替、検索結果、研究資料詳細、外部導線を制御する。
 */
(function () {
  "use strict";
 
  if (!window.FVS_PUBLICATIONS?.length) console.warn("[fvs] 研究資料データが空です");
  const publications = Array.isArray(window.FVS_PUBLICATIONS) ? window.FVS_PUBLICATIONS : [];
  const publicData = window.FVS_PUBLIC_DATA || {};
  const utility = window.ECHO_AGAIN_UTIL || {};
  if (!utility.normalizeText || !utility.escapeHtml) {
    console.warn("[fvs] 共通ユーティリティが読み込まれていません");
    return;
  }
  const normalizeCode = (value) =>
    String(value || "")
      .toUpperCase()
      .replace(/[‐‑‒–—―ー−－]/g, "-")
      .replace(/[^A-Z0-9]/g, "");
  const normalizeText = (value) =>
    utility.normalizeText(value).replace(/[‐‑‒–—―ー−－]/g, "-");
  const normalizeSearchText = (value) =>
    normalizeText(value)
      .replace(/[.．・_-]/g, "")
      .replace(/karaokerezona|カラオケレゾナ|rezona|レゾナ/g, "カラオケレゾナ");
  const escapeHtml = (value) => utility.escapeHtml(value || "", "doubleQuote");
  const detailHref = (entry) =>
    entry.href || `contents/fvs_home.html?page=publications&id=${encodeURIComponent(entry.id)}`;
  const documentNumberParts = (entry) => {
    const match = normalizeCode(entry?.number).match(/^FVS(\d{2})(\d{3})$/);
    return match ? { department: match[1], sequence: Number(match[2]) } : null;
  };
  const hasDocumentNumberGap = (previous, current) => {
    const before = documentNumberParts(previous);
    const after = documentNumberParts(current);
    return Boolean(
      before &&
        after &&
        before.department === after.department &&
        after.sequence > before.sequence + 1,
    );
  };
  const publicationRowsHtml = (entries, tableMode = false, showNumberGaps = false) =>
    entries
      .map((entry, index) =>
        publicationRow(
          entry,
          tableMode,
          showNumberGaps && hasDocumentNumberGap(entries[index - 1], entry),
        ),
      )
      .join("");
  const findPublications = (raw) => {
    const query = raw.trim();
    if (!query) return [];
    const normalizedCode = normalizeCode(query);
    const lowered = normalizeText(query);
    const compacted = normalizeSearchText(query);
    return publications
      .filter((entry) => {
        const exactNumberMatch = Boolean(
          normalizedCode && entry.number && normalizeCode(entry.number) === normalizedCode,
        );
        if (exactNumberMatch) return true;
        if (!entry.listed) {
          return (entry.discoverTerms || []).some(
            (term) => normalizeSearchText(term) === compacted,
          );
        }
        const searchable = normalizeText(
          [entry.number, entry.title, entry.author, entry.body, ...(entry.keywords || [])].join(
            " ",
          ),
        );
        return searchable.includes(lowered) || normalizeSearchText(searchable).includes(compacted);
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0) || b.date.localeCompare(a.date))
      .slice(0, 4);
  };
  const isExactDocumentNumberQuery = (raw, entry) =>
    Boolean(raw && entry?.number && normalizeCode(raw) === normalizeCode(entry.number));
  const hasNearDiscoveryTerm = (raw) => {
    const query = normalizeSearchText(raw);
    if (query.length < 3) return false;
    return publications.some((entry) => {
      if (entry.listed) return false;
      return (entry.discoverTerms || []).some((term) => {
        const normalizedTerm = normalizeSearchText(term);
        if (normalizedTerm.length < 3 || normalizedTerm === query) return false;
        return (
          query.includes(normalizedTerm) || (query.length >= 4 && normalizedTerm.includes(query))
        );
      });
    });
  };
  const noMatchMessage = (raw, label = "資料") =>
    hasNearDiscoveryTerm(raw)
      ? `<p class="search-message search-message--near"><strong>関連する語を含む資料があります。</strong><br><small>検索語を一語ずつ入力してください。</small></p>`
      : `<p class="search-message">該当する${label}は見つかりませんでした。<br><small>※入力した語に一致する資料を検索しています。</small></p>`;
  const bibliographicRow = (
    entry,
  ) => `<article class="bibliographic-result" aria-label="${escapeHtml(entry.title)}の書誌情報">
    <div><span>文書番号</span><strong>${escapeHtml(entry.number)}</strong></div>
    <div><span>資料名</span><strong>${escapeHtml(entry.title)}</strong></div>
    <div><span>担当部門</span><strong>${escapeHtml(entry.author)}</strong></div>
    <div><span>公開日</span><strong>${escapeHtml(entry.date)}</strong></div>
    <div><span>公開区分</span><strong class="bibliographic-access">${escapeHtml(entry.access || "非公開")}</strong></div>
  </article>`;
  const searchResultsHtml = (matches, raw = "") =>
    `<div class="publication-panel search-publication-results">${matches.map((entry) => (isExactDocumentNumberQuery(raw, entry) && !entry.listed ? bibliographicRow(entry) : publicationRow(entry))).join("")}</div>`;
 
  const viewNames = {
    about: "研究所について",
    research: "研究分野",
    projects: "共同研究",
    publications: "成果・刊行物",
    news: "お知らせ",
    notice: "お知らせ",
    ethics: "研究倫理・安全",
    contact: "お問い合わせ",
    recruit: "採用情報",
    sitemap: "サイトマップ",
    policy: "サイトポリシー",
    privacy: "プライバシーポリシー",
    disclosure: "情報公開",
    accessibility: "ウェブアクセシビリティ方針",
  };
  // ?page=<name> は同名の id を持つHTML内ビューへ対応し、未指定時はトップを表示する。
  const requestedView = new URLSearchParams(window.location.search).get("page") || "";
  const activeView = Object.prototype.hasOwnProperty.call(viewNames, requestedView)
    ? requestedView
    : "";
  document.body.classList.add(`view-${activeView || "home"}`);
  document.body.classList.toggle("about-page", activeView === "about");
  document.body.classList.toggle("research-page", activeView === "research");
  document.body.classList.toggle("publications-page", activeView === "publications");
  document.body.classList.toggle("collaboration-page", activeView === "projects");
  const viewPresentation = {
    about: {
      eyebrow: "ABOUT FVS",
      description: "未来音声科学研究所の理念、研究体制および沿革をご案内します。",
    },
    research: {
      eyebrow: "RESEARCH",
      description: "声・対話・個人性・関係性を対象とする5つの研究領域と研究基盤をご紹介します。",
    },
    projects: {
      eyebrow: "PARTICIPATION & COLLABORATION",
      description: "研究参加者の募集、共同研究、社会実証および研究資源の利用についてご案内します。",
    },
    publications: {
      eyebrow: "PUBLICATIONS",
      description:
        "当研究所の論文、学会発表、技術報告、社会実証報告およびガイドラインを公開しています。",
    },
    news: {
      eyebrow: "NEWS",
      description: "研究活動、イベント、募集および機構運営に関する最新情報です。",
    },
    notice: { eyebrow: "NEWS", description: "当研究所からのお知らせです。" },
  };
  const hero = document.querySelector(".hero");
  if (hero) hero.hidden = Boolean(activeView);
  Object.keys(viewNames).forEach((view) => {
    const section =
      document.querySelector(`.utility-view#${view}`) || document.getElementById(view);
    if (section) section.hidden = view !== activeView;
  });
  [
    "home-pickup",
    "home-overview",
    "home-fields",
    "home-projects",
    "home-news",
    "home-numbers",
    "home-recruit",
  ].forEach((id) => {
    const section = document.getElementById(id);
    if (section) section.hidden = Boolean(activeView);
  });
  document.querySelector(".partnership-section")?.toggleAttribute("hidden", Boolean(activeView));
  if (
    activeView &&
    activeView !== "about" &&
    activeView !== "research" &&
    activeView !== "publications" &&
    activeView !== "projects" &&
    !document.getElementById(activeView)?.classList.contains("utility-view")
  ) {
    const activeSection = document.getElementById(activeView);
    const presentation = viewPresentation[activeView];
    activeSection?.insertAdjacentHTML(
      "beforebegin",
      `<header class="view-hero"><div class="shell"><p class="breadcrumb"><a href="contents/fvs_home.html">ホーム</a><span>›</span>${viewNames[activeView]}</p><p class="eyebrow">${presentation.eyebrow}</p><h1>${viewNames[activeView]}</h1><p>${presentation.description}</p></div></header>`,
    );
  }
  document.querySelectorAll(".global-nav a").forEach((anchor) => {
    const view = new URL(anchor.href, window.location.href).searchParams.get("page") || "";
    anchor.toggleAttribute("aria-current", view === activeView);
    if (view === activeView) anchor.setAttribute("aria-current", "page");
  });
  if (activeView) document.title = `${viewNames[activeView]}｜未来音声科学研究所`;
  if (activeView === "notice") {
    const requestedNotice =
      new URLSearchParams(window.location.search).get("id") || "search-maintenance";
    document.querySelectorAll("[data-notice-detail]").forEach((article) => {
      article.hidden = article.dataset.noticeDetail !== requestedNotice;
    });
  }
  document.body.classList.add("fvs-ready");
 
  const fieldCard = (item, index) =>
    `<article class="public-field-card compact field-${index + 1}"><span class="field-mark" aria-hidden="true"></span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`;
  document.querySelectorAll("[data-fields-home]").forEach((container) => {
    container.innerHTML = (publicData.fields || []).map(fieldCard).join("");
  });
  const projectImages = {
    "03": "media/fvs_project_long_dialogue.webp?v=20260813",
    "04": "media/fvs_project_personality.webp?v=20260813",
    "06": "media/fvs_project_echo_again.webp?v=20260813",
  };
  const projectCard = (item) =>
    `<article class="public-project-card"><img class="project-image" src="${projectImages[item.no]}" alt="" loading="lazy"><div class="project-card-body"><span class="status">${escapeHtml(item.status)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p>${item.partner ? `<dl><dt>共同実証</dt><dd>${escapeHtml(item.partner)}</dd><dt>期間</dt><dd>${escapeHtml(item.period)}</dd></dl>` : ""}<a class="project-more" href="contents/fvs_home.html?page=research#featured-projects">詳しく見る</a></div></article>`;
  document.querySelectorAll("[data-projects-home]").forEach((container) => {
    const projects = publicData.projects || [];
    const featured = [projects[2], projects[3], projects[5]].filter(Boolean);
    container.innerHTML = featured.map(projectCard).join("");
  });
  const noticeDetails = new Map([
    ["2026.08.30|資料検索機能のメンテナンスについて", "search-maintenance"],
    ["2026.08.05|研究データ等の取り扱いに関する公開情報を更新しました", "research-data-policy"],
    [
      "2026.07.18|長期対話における話者印象の時間的変化に関する研究成果を公開",
      "speaker-impression-study",
    ],
    ["2026.06.10|KARAOKE REZONAとの音声インタラクション共同実証について", "rezona-collaboration"],
    ["2026.05.23|公開シンポジウム「声と個人性の未来」を開催", "voice-individuality-symposium"],
    ["2026.04.20|共同実証モニター募集のお知らせ", "monitor-recruitment"],
  ]);
  const newsRow = (item) => {
    const noticeId = noticeDetails.get(`${item[0]}|${item[2]}`);
    const title = noticeId
      ? `<a href="contents/fvs_home.html?page=notice&amp;id=${encodeURIComponent(noticeId)}">${escapeHtml(item[2])}</a>`
      : `<p>${escapeHtml(item[2])}</p>`;
    return `<article><time>${escapeHtml(item[0])}</time><span>${escapeHtml(item[1])}</span>${title}</article>`;
  };
  document.querySelectorAll("[data-news-home]").forEach((container) => {
    container.innerHTML = (publicData.news || []).slice(0, 4).map(newsRow).join("");
  });
  // お知らせ一覧はカテゴリを選択して絞り込める。
  const NEWS_INITIAL_COUNT = 8;
  document.querySelectorAll("[data-news-full]").forEach((container) => {
    // 冒頭の注目記事に出している1件は、下の一覧では繰り返さない。
    const featured = container
      .closest(".news-index")
      ?.querySelector(".news-featured");
    const featuredKey = featured
      ? `${featured.querySelector("time")?.textContent.trim()}|${featured.querySelector("h2")?.textContent.trim()}`
      : "";
    const entries = (publicData.news || []).filter(
      (item) => `${item[0]}|${item[2]}` !== featuredKey,
    );
    let activeCategory = "すべて";
    let expanded = false;
    const more = document.createElement("p");
    more.className = "list-more";
    more.hidden = true;
    more.innerHTML = '<button type="button"></button>';
    container.insertAdjacentElement("afterend", more);
    const moreButton = more.querySelector("button");
    const render = () => {
      const filtered =
        activeCategory === "すべて"
          ? entries
          : entries.filter((item) => item[1] === activeCategory);
      const shown = expanded ? filtered : filtered.slice(0, NEWS_INITIAL_COUNT);
      container.innerHTML = shown.map(newsRow).join("");
      const rest = filtered.length - shown.length;
      more.hidden = rest <= 0;
      if (rest > 0) moreButton.textContent = `過去のお知らせを見る（残り${rest}件）`;
    };
    moreButton.addEventListener("click", () => {
      expanded = true;
      render();
    });
    render();
    container
      .closest(".news-index")
      ?.querySelectorAll("[data-news-filter]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          activeCategory = button.dataset.newsFilter || "すべて";
          expanded = false;
          button.parentElement
            .querySelectorAll("button")
            .forEach((item) => item.classList.toggle("is-current", item === button));
          render();
        });
      });
  });
  document.querySelectorAll("[data-researchers]").forEach((container) => {
    container.innerHTML = (publicData.researchers || [])
      .map(
        (item, index) => {
          const primarySpecialty = String(item.specialty || "").split("／")[0];
          return `<article><div class="researcher-initial researcher-${index + 1}" aria-hidden="true">${escapeHtml(item.name.slice(0, 1))}</div><div><h4>${escapeHtml(item.name)}</h4><p>${escapeHtml(item.role)}<span>${escapeHtml(primarySpecialty)}</span></p></div></article>`;
        },
      )
      .join("");
  });
  document.querySelectorAll("[data-partners]").forEach((container) => {
    container.innerHTML = (publicData.partners || [])
      .map((name) => `<div>${escapeHtml(name)}</div>`)
      .join("");
  });
 
  const publicationSection = document.getElementById("publications");
  const publicationPanel = publicationSection?.querySelector(
    ".publication-panel[data-publication-list]",
  );
  if (
    publicationPanel &&
    !publicationSection.querySelector(".result-search[data-publication-search-form]")
  ) {
    publicationPanel.insertAdjacentHTML(
      "beforebegin",
      `<div class="publication-search" id="publication-search"><h2>資料検索</h2><p>資料番号・タイトル・キーワードから検索できます。</p><form class="search-form" data-publication-search-form><input type="search" data-publication-search-input aria-label="資料番号・タイトル・キーワード" placeholder="資料番号・タイトル・キーワード" autocomplete="off"><button type="submit">検索</button></form><div data-publication-search-results aria-live="polite"></div></div>`,
    );
    const form = publicationSection.querySelector("[data-publication-search-form]");
    const input = publicationSection.querySelector("[data-publication-search-input]");
    const results = publicationSection.querySelector("[data-publication-search-results]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const raw = input.value.trim();
      if (!raw) {
        results.innerHTML = `<p class="search-message">検索語を入力してください。</p>`;
        return;
      }
      const matches = findPublications(raw);
      results.innerHTML = matches.length ? searchResultsHtml(matches, raw) : noMatchMessage(raw);
    });
    if (window.location.hash === "#publication-search") {
      window.requestAnimationFrame(() => {
        document.getElementById("publication-search")?.scrollIntoView({ block: "start" });
        input.focus();
      });
    }
  }
 
  let renderPublicEntriesOnLoad = () => {};
  const redesignedSearchForm = publicationSection?.querySelector(
    ".result-search[data-publication-search-form]",
  );
  if (redesignedSearchForm) {
    const input = redesignedSearchForm.querySelector("[data-publication-search-input]");
    const field = redesignedSearchForm.querySelector("[data-result-field]");
    const type = redesignedSearchForm.querySelector("[data-result-type]");
    const year = redesignedSearchForm.querySelector("[data-result-year]");
    const results = redesignedSearchForm.querySelector("[data-publication-search-results]");
    const sortSelect = publicationSection.querySelector("[data-publication-sort]");
    const pagination = publicationSection.querySelector("[data-publication-pagination]");
    const publicEntries = publications.filter((entry) => entry.listed);
    const pageSize = 12;
    let currentPublicationPage = 1;
    const sortedPublicEntries = () =>
      [...publicEntries].sort((a, b) =>
        sortSelect?.value === "date"
          ? b.date.localeCompare(a.date) ||
            normalizeCode(a.number).localeCompare(normalizeCode(b.number))
          : normalizeCode(a.number || "ZZZ").localeCompare(normalizeCode(b.number || "ZZZ")) ||
            b.date.localeCompare(a.date),
      );
    const renderPublicEntries = (entries = sortedPublicEntries()) => {
      if (!publicationPanel) return;
      const showNumberGaps =
        sortSelect?.value === "number" && entries.length === publicEntries.length;
      const pageCount = Math.max(1, Math.ceil(entries.length / pageSize));
      currentPublicationPage = Math.min(currentPublicationPage, pageCount);
      const start = (currentPublicationPage - 1) * pageSize;
      publicationPanel.innerHTML =
        publicationTableHead() +
        publicationRowsHtml(entries.slice(start, start + pageSize), true, showNumberGaps);
      if (pagination) {
        pagination.innerHTML =
          pageCount > 1
            ? Array.from(
                { length: pageCount },
                (_, index) =>
                  `<button type="button" data-publication-page="${index + 1}"${index + 1 === currentPublicationPage ? ' aria-current="page"' : ""}>${index + 1}</button>`,
              ).join("")
            : "";
      }
    };
    const restorePublicRows = () => {
      results.innerHTML = "";
      renderPublicEntries();
    };
    const readPublicationFilters = () => ({
      raw: input.value.trim(),
      field: field.value,
      type: type.value,
      year: year.value,
    });
    const matchesPublicationFilters = (entry, filters) => {
      const searchable = normalizeSearchText(
        [entry.number, entry.title, entry.author, entry.body, ...(entry.keywords || [])].join(" "),
      );
      return (
        (!filters.raw || searchable.includes(normalizeSearchText(filters.raw))) &&
        (!filters.field || entry.field === filters.field) &&
        (!filters.type || entry.type === filters.type) &&
        (!filters.year || entry.date.startsWith(filters.year))
      );
    };
    const submitPublicationSearch = (event) => {
      event.preventDefault();
      const filters = readPublicationFilters();
      results.innerHTML = "";
      const visibleEntries = sortedPublicEntries().filter((entry) =>
        matchesPublicationFilters(entry, filters),
      );
      currentPublicationPage = 1;
      renderPublicEntries(visibleEntries);
      if (!visibleEntries.length) results.innerHTML = noMatchMessage(filters.raw, "研究成果");
    };
    const changePublicationPage = (event) => {
      const button = event.target.closest("[data-publication-page]");
      if (!button) return;
      currentPublicationPage = Number(button.dataset.publicationPage) || 1;
      renderPublicEntries();
      document.getElementById("latest-results")?.scrollIntoView({ block: "start" });
    };
    redesignedSearchForm.addEventListener("reset", () => {
      currentPublicationPage = 1;
      window.requestAnimationFrame(restorePublicRows);
    });
    redesignedSearchForm.addEventListener("submit", submitPublicationSearch);
    renderPublicEntriesOnLoad = renderPublicEntries;
    sortSelect?.addEventListener("change", () => redesignedSearchForm.requestSubmit());
    pagination?.addEventListener("click", changePublicationPage);
  }
 
  function publicationRow(entry, tableMode = false, numberGap = false) {
    const metadataOnly = !entry.detail && entry.body === "メタデータのみ";
    const tableContents = `<span class="publication-number">${escapeHtml(entry.number || "—")}</span>
      <span class="publication-type">${escapeHtml(entry.type)}</span><time>${escapeHtml(entry.date)}</time>
      <span class="publication-copy"><strong>${escapeHtml(entry.title)}</strong></span>
      <span class="publication-department">${escapeHtml(entry.author)}</span>`;
    const number = entry.number
      ? `<span class="publication-number">${escapeHtml(entry.number)}</span>`
      : "";
    const standardContents = `<div class="publication-meta"><span class="tag tag-${entry.type}">${escapeHtml(entry.type)}</span><time>${escapeHtml(entry.date)}</time></div>
      <div class="publication-copy">${number}<h3>${escapeHtml(entry.title)}</h3>${metadataOnly ? '<p class="metadata-only-note">公開区分：メタデータのみ（本文は公開していません）</p>' : ""}</div>
      <div class="publication-department">${escapeHtml(entry.author)}</div>`;
    const contents = tableMode ? tableContents : standardContents;
    const gapClass = numberGap ? " publication-number-gap" : "";
    if (entry.detail)
      return `<a class="publication-row has-detail${gapClass}" href="${detailHref(entry)}" aria-label="${escapeHtml(entry.title)}を読む">
      ${contents}
      <span class="row-arrow" aria-hidden="true">›</span>
    </a>`;
    return `<article class="publication-row no-detail${gapClass}">
      ${contents}
    </article>`;
  }
 
  function publicationTableHead() {
    return `<div class="publication-table-head" aria-hidden="true"><span>文書番号</span><span>種別</span><span>公開日</span><span>資料名</span><span>担当部門</span><span></span></div>`;
  }
 
  // 検索フォームを持つページでは初回からページ送り付きで描画する。
  // 持たないページ（検索なしの一覧）だけ、従来どおり全件を出す。
  if (redesignedSearchForm) {
    renderPublicEntriesOnLoad();
  } else {
    document.querySelectorAll(".publication-panel[data-publication-list]").forEach((container) => {
      const numberedEntries = publications
        .filter((entry) => entry.listed)
        .sort((a, b) =>
          normalizeCode(a.number || "ZZZ").localeCompare(normalizeCode(b.number || "ZZZ")),
        );
      container.innerHTML =
        publicationTableHead() + publicationRowsHtml(numberedEntries, true, true);
    });
  }
 
  const detail = document.querySelector("[data-publication-detail]");
  const requestedId = new URLSearchParams(window.location.search).get("id") || "";
  if (detail && requestedId) {
    const entry = publications.find((item) => item.id === requestedId);
    if (!entry || !entry.detail) {
      detail.innerHTML = `<div class="empty-state"><h2>資料を表示できません</h2><p>指定された資料はありません。</p><a class="text-link" href="contents/fvs_home.html?page=publications">論文・成果一覧へ戻る</a></div>`;
      document.title = "資料を表示できません｜未来音声科学研究所";
    } else {
      const restriction = entry.restricted
        ? `<div class="publication-ended"><strong>⚠ この資料は公開を終了しました</strong><span>公開区分：限定公開（2026.06.02〜）</span></div>`
        : "";
      const related =
        Array.isArray(entry.related) && entry.related.length
          ? `<section class="related-documents"><h2>関連資料</h2>${entry.related.map((item) => `<div class="related-document"><span>${escapeHtml(item.number)}</span><strong>${escapeHtml(item.title)}</strong></div>`).join("")}</section>`
          : "";
      const documentBody = entry.html
        ? `<div class="document-body" style="white-space:normal">${entry.html}</div>`
        : `<pre class="document-body">${escapeHtml(entry.body)}</pre>`;
      detail.innerHTML = `<nav class="document-breadcrumb" aria-label="パンくず"><a href="contents/fvs_home.html?page=publications">論文・成果</a><span>›</span><span>資料詳細</span></nav>${restriction}<header class="document-header">
         ${entry.number ? `<p class="document-number">${escapeHtml(entry.number)}</p>` : ""}
         <h1>${escapeHtml(entry.title)}</h1>
        <p class="document-meta-line">${escapeHtml(entry.detailAuthor || entry.author)} ／ ${escapeHtml(entry.type)} ／ ${escapeHtml(entry.date)}</p>
      </header>${documentBody}${related}
      <p class="document-back"><a class="text-link" href="contents/fvs_home.html?page=publications">論文・成果一覧へ戻る</a></p>`;
      document.title = `${entry.number ? `${entry.number} ` : ""}${entry.title}｜未来音声科学研究所`;
    }
  }
 
  const detailSection = document.querySelector("[data-publication-detail-section]");
  if (detailSection) {
    const hasDocument = new URLSearchParams(window.location.search).has("id");
    detailSection.hidden = activeView !== "publications" || !hasDocument;
    if (activeView === "publications" && hasDocument) {
      publicationSection.hidden = true;
      document.body.classList.add("view-document");
      const viewHero = document.querySelector(".view-hero");
      const heroEyebrow = viewHero?.querySelector(".eyebrow");
      const heroTitle = viewHero?.querySelector("h1");
      const heroDescription = viewHero?.querySelector("p:last-child");
      if (heroEyebrow) heroEyebrow.textContent = "DOCUMENT";
      if (heroTitle) heroTitle.textContent = "資料詳細";
      if (heroDescription) heroDescription.textContent = "公開資料の詳細情報です。";
    }
  }
 
  document.querySelectorAll("[data-menu-button]").forEach((button) => {
    button.addEventListener("click", () => {
      const header = button.closest(".site-header");
      const isOpen = header.classList.toggle("menu-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });
 
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.getAttribute("href") === "#mission" && activeView !== "about") {
        event.preventDefault();
        window.location.href = "contents/fvs_home.html?page=about#mission";
        return;
      }
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
