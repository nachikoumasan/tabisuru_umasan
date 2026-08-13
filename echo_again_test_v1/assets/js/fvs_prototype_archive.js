/**
 * fvs_prototype_archive.js — FVS研究資料アーカイブのプロトタイプ画面。
 * 読み込み元: contents/fvs_research_archive.html。
 * 依存: shared/util.js、prototype_data.js、localStorage。
 * 役割: 文書検索・詳細表示・資料解放状態・デバッグ操作を制御する。
 */
(function () {
  "use strict";
  if (!window.FVS_PROTOTYPE_DATA || !Object.keys(window.FVS_PROTOTYPE_DATA).length)
    console.warn("[fvs-prototype] プロトタイプデータが空です");
  const D = window.FVS_PROTOTYPE_DATA,
    C = D.config,
    escapeHtml =
      window.ECHO_AGAIN_UTIL?.escapeHtml ||
      ((value) =>
        String(value ?? "").replace(
          /[&<>"']/g,
          (character) =>
            ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
              character
            ],
        )),
    key = "fvsPrototypeProgress",
    state = () => JSON.parse(localStorage.getItem(key) || "{}"),
    mark = (k) => localStorage.setItem(key, JSON.stringify({ ...state(), [k]: true }));
  const $ = (s) => document.querySelector(s),
    list = $("[data-list]"),
    view = $("[data-view]"),
    form = $("[data-search]");
  const chart = () => {
    const max = 300,
      w = 650,
      h = 210,
      p = 34,
      pts = D.usage
        .map(
          (x, i) =>
            `${p + (i * (w - p * 2)) / (D.usage.length - 1)},${h - p - (x.minutes / max) * (h - p * 2)}`,
        )
        .join(" ");
    return `<div class="chart"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="EA-AN-14利用時間推移"><line x1="${p}" y1="${h - p}" x2="${w - p}" y2="${h - p}"/><line x1="${p}" y1="${p}" x2="${p}" y2="${h - p}"/><polyline points="${pts}"/>${D.usage
      .map((x, i) => {
        const cx = p + (i * (w - p * 2)) / (D.usage.length - 1),
          cy = h - p - (x.minutes / max) * (h - p * 2);
        return `<circle cx="${cx}" cy="${cy}" r="5"/><text x="${cx}" y="${cy - 12}">${escapeHtml(x.minutes)}分</text><text class="date" x="${cx}" y="${h - 8}">${escapeHtml(x.date.slice(5))}</text>`;
      })
      .join("")}</svg></div>`;
  };
  const audio = (a) =>
    `<section class="audio-log"><header><button type="button" data-audio="${escapeHtml(a.id)}" aria-label="再生">▶</button><div><b>${escapeHtml(a.title)}</b><time>${escapeHtml(a.date)}</time></div><span>EVENT</span></header><div class="waveform">${Array.from({ length: 46 }, (_, i) => `<i style="height:${12 + ((i * 17) % 35)}px"></i>`).join("")}</div><div class="transcript" data-transcript="${escapeHtml(a.id)}" hidden>${a.lines.map((l) => `<p${l.event ? ' class="event"' : ""}><b>${escapeHtml(l.speaker)}</b>${escapeHtml(l.text)}</p>`).join("")}</div></section>`;
  const workflow = () =>
    `<ol class="workflow">${D.workflow.map((x) => `<li><b>${escapeHtml(x[0])}</b><span>${escapeHtml(x[1])}</span><p>${escapeHtml(x[2])}</p></li>`).join("")}</ol>`;
  const docBody = (d) => {
    const common = `<header class="doc-header"><p>${escapeHtml(d.id)} ／ ${escapeHtml(d.type)}</p><h1>${escapeHtml(d.title)}</h1><dl><div><dt>日付</dt><dd>${escapeHtml(d.date)}</dd></div><div><dt>担当</dt><dd>${escapeHtml(d.dept)}</dd></div><div><dt>研究課題</dt><dd>${escapeHtml(d.project)}</dd></div><div><dt>公開区分</dt><dd>内部参照</dd></div></dl></header>`;
    const body =
      D.archiveBodies[d.view]?.({
        config: C,
        usage: D.usage,
        audio: D.audio,
        audioLog: audio,
        chart,
        workflow,
        escapeHtml,
      }) ?? "";
    return (
      common +
      `<div class="doc-body">${body}</div><footer><button data-back>一覧へ戻る</button></footer>`
    );
  };
  function openDoc(id) {
    const documentData = D.documents.find((item) => item.id === id);
    if (!documentData) return;
    mark(`viewed:${id}`);
    view.innerHTML = docBody(documentData);
    list.hidden = true;
    view.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function render(
    items = D.documents,
    message = "キーワードまたは文書番号を入力して検索してください。",
  ) {
    list.hidden = false;
    view.hidden = true;
    if (!items.length) {
      list.innerHTML = `<div class="archive-empty"><b>資料検索</b><p>${escapeHtml(message)}</p></div>`;
      return;
    }
    list.innerHTML = `<header><span>文書番号</span><span>資料名</span><span>日付</span><span>部門</span></header>${items.map((d) => `<button data-open="${escapeHtml(d.id)}"><b>${escapeHtml(d.id)}</b><span><strong>${escapeHtml(d.title)}</strong><small>${escapeHtml(d.type)} ／ ${escapeHtml(d.project)}</small></span><time>${escapeHtml(d.date)}</time><em>${escapeHtml(d.dept)}</em><i>›</i></button>`).join("")}`;
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = $("[data-query]").value.trim().toLowerCase(),
      y = $("[data-year]").value,
      dep = $("[data-dept]").value,
      t = $("[data-type]").value;
    if (!query) {
      render(
        [],
        "検索するキーワードまたは文書番号を入力してください。絞り込み項目だけでは検索できません。",
      );
      return;
    }
    const hits = D.documents.filter(
      (d) =>
        JSON.stringify(d).toLowerCase().includes(query) &&
        (!y || d.date.startsWith(y)) &&
        (!dep || d.dept === dep) &&
        (!t || d.type === t),
    );
    render(hits, "該当する資料はありません。");
  });
  document.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-open]");
    if (openButton) openDoc(openButton.dataset.open);
    if (event.target.closest("[data-back]")) render();
    const audioButton = event.target.closest("[data-audio]");
    if (audioButton) {
      const transcript = $(`[data-transcript="${audioButton.dataset.audio}"]`);
      transcript.hidden = !transcript.hidden;
      mark(`audio:${audioButton.dataset.audio}`);
    }
  });
  const types = [...new Set(D.documents.map((d) => d.type))];
  $("[data-type]").insertAdjacentHTML(
    "beforeend",
    types.map((x) => `<option>${escapeHtml(x)}</option>`).join(""),
  );
  const debug = $("[data-debug]"),
    showProgress = () =>
      ($("[data-progress]").innerHTML =
        Object.keys(state())
          .map((x) => `<p>✓ ${escapeHtml(x)}</p>`)
          .join("") || "<p>進行記録なし</p>");
  $("[data-prototype]").onclick = () => {
    showProgress();
    debug.showModal();
  };
  $("[data-close]").onclick = () => debug.close();
  $("[data-unlock]").onclick = () => {
    D.documents.forEach((d) => mark(`viewed:${d.id}`));
    showProgress();
  };
  $("[data-reset]").onclick = () => {
    localStorage.removeItem(key);
    location.reload();
  };
  render();
})();
