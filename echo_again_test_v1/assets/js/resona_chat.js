/**
 * resona_chat.js — カラオケレゾナの案内チャット。
 * 読み込み元: contents/resona_home.html、contents/resona_cmp_20260520.html、contents/resona_staff.html。
 * 依存: shared/util.js、resona_journal_data.js、resona_official_data.js、resona_chat_data.js。
 * 役割: 検索語の正規化、回答候補の選択、結果リンク、チャットUIを制御する。
 */
(() => {
  "use strict";

  const CHAT_SEARCH_DATA = window.REZONA_CHAT_DATA || [];
  if (!CHAT_SEARCH_DATA.length) console.warn("[resona-chat] 応答データが空です");
  const utility = window.ECHO_AGAIN_UTIL || {};
  if (!utility.normalizeText || !utility.escapeHtml) {
    console.warn("[resona-chat] 共通ユーティリティが読み込まれていません");
    return;
  }
  const sourceCollections = {
    journal: new Map(
      (window.REZONA_JOURNAL_POSTS || []).map((item) => [item.id, item]),
    ),
    official: new Map(
      (window.REZONA_OFFICIAL_NEWS || []).map((item) => [item.id, item]),
    ),
  };
  const resolveResult = (result) => {
    if (!result.source) return result;
    const sourceItem = sourceCollections[result.source.collection]?.get(result.source.id);
    if (!sourceItem) {
      console.warn(
        `[resona-chat] 参照データが見つかりません: ${result.source.collection}/${result.source.id}`,
      );
      return result;
    }
    return { ...result, title: sourceItem.title };
  };

  const normalizeText = (value) => {
    return utility.normalizeText(value);
  };

  const normalize = (value) =>
    normalizeText(value).replace(/karaokerezona|カラオケレゾナ|rezona|レゾナ/g, "カラオケレゾナ");

  CHAT_SEARCH_DATA.forEach((group) => {
    group.normalizedKeywords = group.keywords.map(normalize);
  });

  const songCampaign = [...document.querySelectorAll(".campaign-card")].find((card) =>
    card.querySelector("h3")?.textContent.includes("楽曲歌唱キャンペーン"),
  );
  if (songCampaign) {
    songCampaign.id = "song-campaign";
    if (location.hash === "#song-campaign")
      requestAnimationFrame(() => songCampaign.scrollIntoView());
  }

  const root = document.createElement("div");
  root.className = "rezona-chat";
  root.innerHTML = `
    <button class="rezona-chat-launcher" type="button" aria-expanded="false" aria-controls="rezona-chat-panel">
      <img src="media/resona_mascot_face.webp?v=20260813" width="72" height="72" alt=""><b>お困りですか？</b>
    </button>
    <section class="rezona-chat-panel" id="rezona-chat-panel" aria-label="ご案内チャット" hidden>
      <header class="rezona-chat-head">
        <img class="rezona-chat-mark" src="media/resona_mascot_face.webp?v=20260813" width="42" height="42" alt="レゾナくん">
        <div><strong>ご案内チャット</strong><small>レゾナくんがご案内します</small></div>
        <button type="button" class="rezona-chat-close" aria-label="チャットを閉じる">×</button>
      </header>
      <div class="rezona-chat-log" role="log" aria-live="polite" aria-relevant="additions">
        <div class="rezona-chat-message is-bot is-intro"><p>公式サイト内の情報をお探しします。気になる言葉を自由に入力してください。</p></div>
        <div class="rezona-chat-quick" aria-label="よく検索されるキーワード">
          ${["料金", "ルーム", "メニュー", "キャンペーン"].map((label) => `<button type="button" data-chat-keyword="${label}">${label}</button>`).join("")}
        </div>
      </div>
      <form class="rezona-chat-form" role="search">
        <label class="sr-only" for="rezona-chat-input">検索キーワード</label>
        <input id="rezona-chat-input" type="search" placeholder="キーワードを入力" autocomplete="off">
        <button type="submit">送信</button>
      </form>
    </section>`;
  document.body.append(root);

  const launcher = root.querySelector(".rezona-chat-launcher");
  const panel = root.querySelector(".rezona-chat-panel");
  const close = root.querySelector(".rezona-chat-close");
  const log = root.querySelector(".rezona-chat-log");
  const form = root.querySelector(".rezona-chat-form");
  const input = root.querySelector("input");

  let closeTimer = 0;
  const finishClose = () => {
    panel.hidden = true;
    panel.classList.remove("is-closing");
    launcher.classList.remove("is-hidden");
    launcher.focus();
  };
  const setOpen = (open) => {
    window.clearTimeout(closeTimer);
    launcher.setAttribute("aria-expanded", String(open));
    if (open) {
      panel.hidden = false;
      launcher.classList.add("is-hidden");
      panel.classList.remove("is-closing");
      requestAnimationFrame(() => {
        panel.classList.add("rez-chat-open");
        input.focus();
      });
      return;
    }
    panel.classList.remove("rez-chat-open");
    panel.classList.add("is-closing");
    closeTimer = window.setTimeout(finishClose, 220);
  };

  const escapeHtml = utility.escapeHtml;

  const addMessage = (className, html) => {
    const message = document.createElement("div");
    message.className = `rezona-chat-message ${className}`;
    message.innerHTML = html;
    log.append(message);
    log.scrollTop = log.scrollHeight;
    return message;
  };

  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  let isSearching = false;
  const setSearching = (searching) => {
    isSearching = searching;
    input.disabled = searching;
    form.querySelector("button").disabled = searching;
    root.querySelectorAll("[data-chat-keyword]").forEach((button) => {
      button.disabled = searching;
    });
  };

  const findBestGroup = (keyword) => {
    let bestMatch = null;
    CHAT_SEARCH_DATA.forEach((item, index) => {
      item.normalizedKeywords.forEach((target) => {
        if (!keyword.includes(target)) return;
        const candidate = {
          item,
          index,
          priority: Number(item.priority || 0),
          matchLength: target.length,
        };
        if (
          !bestMatch ||
          candidate.priority > bestMatch.priority ||
          (candidate.priority === bestMatch.priority &&
            candidate.matchLength > bestMatch.matchLength) ||
          (candidate.priority === bestMatch.priority &&
            candidate.matchLength === bestMatch.matchLength &&
            candidate.index < bestMatch.index)
        ) {
          bestMatch = candidate;
        }
      });
    });
    return bestMatch ? bestMatch.item : null;
  };

  const search = async (rawValue) => {
    const value = String(rawValue || "").trim();
    const keyword = normalize(value);
    if (!keyword || isSearching) return;
    setSearching(true);
    addMessage("is-user", `<p>${escapeHtml(value)}</p>`);
    const typing = addMessage(
      "is-bot is-typing",
      '<p aria-label="検索中"><span class="rezona-chat-typing-dots" aria-hidden="true"><i></i><i></i><i></i></span></p>',
    );
    try {
      await wait(1200);
      typing.remove();
      const group = findBestGroup(keyword);
      if (!group) {
        addMessage(
          "is-bot",
          "<p>該当する情報は見つかりませんでした。<br>別のキーワードをお試しください。</p>",
        );
        return;
      }
      const answer = addMessage("is-bot", `<p>${escapeHtml(group.response)}</p>`);
      await wait(350);
      const cards = group.results
        .map((rawResult) => {
          const result = resolveResult(rawResult);
          const opensNewTab = /(?:resona_staff\.html|resona_cmp_20260520\.html)/.test(result.url);
          const newTabAttributes = opensNewTab ? ' target="_blank" rel="noopener noreferrer"' : "";
          return `<a class="rezona-chat-result" href="${escapeHtml(result.url)}"${newTabAttributes}><span><strong>${escapeHtml(result.title)}</strong>${result.description ? `<small>${escapeHtml(result.description)}</small>` : ""}${result.meta ? `<small>${escapeHtml(result.meta)}</small>` : ""}</span><b class="ui-link-arrow" aria-hidden="true"></b></a>`;
        })
        .join("");
      answer.insertAdjacentHTML("beforeend", `<div class="rezona-chat-results">${cards}</div>`);
      log.scrollTop = log.scrollHeight;
    } catch (error) {
      typing.remove();
      addMessage("is-bot", "<p>検索中に問題が発生しました。<br>もう一度お試しください。</p>");
      console.error("REZONA chat search failed:", error);
    } finally {
      setSearching(false);
      input.focus();
    }
  };

  launcher.addEventListener("click", () => setOpen(true));
  close.addEventListener("click", () => setOpen(false));
  document.addEventListener("pointerdown", (event) => {
    if (panel.hidden || !panel.classList.contains("rez-chat-open")) return;
    if (panel.contains(event.target) || launcher.contains(event.target)) return;
    setOpen(false);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value;
    input.value = "";
    search(value);
  });
  root
    .querySelectorAll("[data-chat-keyword]")
    .forEach((button) =>
      button.addEventListener("click", () => search(button.dataset.chatKeyword)),
    );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });
})();
