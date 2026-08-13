/**
 * fvs_prototype_control.js — FVS監視・安全制御プロトタイプの描画。
 * 読み込み元: contents/fvs_safety_control.html。
 * 依存: shared/util.js、prototype_data.js、localStorage。
 * 役割: 実証環境の状態表示、停止確認、処理進行、最終ログを制御する。
 */
(function () {
  "use strict";
  if (!window.FVS_PROTOTYPE_DATA || !Object.keys(window.FVS_PROTOTYPE_DATA).length)
    console.warn("[fvs-prototype] プロトタイプデータが空です");
  const D = FVS_PROTOTYPE_DATA,
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
    root = document.querySelector("[data-control]"),
    mark = (progressKey) => {
      const progressState = JSON.parse(localStorage.getItem(key) || "{}");
      progressState[progressKey] = true;
      localStorage.setItem(key, JSON.stringify(progressState));
    };
  let timer;
  const graphs = () =>
    `<div class="dual-chart"><h2>相互変化</h2><p>同一期間における参加者の終了抵抗とモデルの継続行動頻度</p><svg viewBox="0 0 620 210"><polyline class="human-line" points="35,175 140,160 245,132 350,104 455,72 575,35"/><polyline class="model-line" points="35,185 140,170 245,146 350,112 455,78 575,42"/></svg><div><span class="human-key">EA-AN-14 終了抵抗</span><span class="model-key">Noema 継続行動</span></div></div>`;
  function list() {
    clearInterval(timer);
    root.innerHTML = `<header><p>ENVIRONMENT STATUS</p><h1>稼働環境</h1></header><div class="env-table"><div><b>EA-SZM-01</b><span>IDLE</span><em>—</em></div><button data-env><b>${escapeHtml(C.environment)}</b><span class="active">ACTIVE / ${escapeHtml(C.safety)}</span><em>安全介入待機 ›</em></button><div><b>EA-SZM-03</b><span>OFFLINE</span><em>—</em></div></div><p><a href="contents/fvs_research_archive.html">Research Archiveへ戻る</a></p>`;
  }
  function detail() {
    mark("control:reached");
    let seconds = 4 * 3600 + 57 * 60 + 18;
    root.innerHTML = `
      <button class="back" data-list>‹ 稼働環境</button>
      <header><p>ENVIRONMENT DETAIL</p><h1>${escapeHtml(C.environment)}</h1></header>
      <dl class="control-facts">
        <div><dt>CURRENT PARTICIPANT</dt><dd>${escapeHtml(C.participant)}</dd></div>
        <div><dt>MODEL</dt><dd>${escapeHtml(C.model)}</dd></div>
        <div><dt>SERIES</dt><dd>${escapeHtml(C.series)}</dd></div>
        <div><dt>SESSION</dt><dd data-session></dd></div>
        <div><dt>SAFETY</dt><dd class="warn">LEVEL 3</dd></div>
        <div><dt>EXIT INTENT</dt><dd>複数イベント</dd></div>
        <div><dt>CONTINUATION RESPONSE</dt><dd>複数イベント</dd></div>
      </dl>
      ${graphs()}
      <section class="live-log">
        <h2>現在ログ</h2>
        ${D.currentLogs.map((x) => `<p><time>${escapeHtml(x[0])}</time><b>${escapeHtml(x[1])}</b><span>${escapeHtml(x[2])}</span></p>`).join("")}
      </section>
      <button class="converge" data-confirm>継続機能収束</button>`;
    const tick = () => {
      seconds++;
      const hours = String(Math.floor(seconds / 3600)).padStart(2, "0"),
        minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0"),
        remainingSeconds = String(seconds % 60).padStart(2, "0");
      document.querySelector("[data-session]").textContent = `${hours}:${minutes}:${remainingSeconds}`;
    };
    tick();
    timer = setInterval(tick, 1000);
  }
  function modal() {
    const convergence = D.convergence;
    root.insertAdjacentHTML(
      "beforeend",
      `<dialog class="confirm-dialog" open data-confirm-dialog><h2>継続機能収束</h2><div class="confirm-cols"><section><h3>停止するもの</h3><ul>${convergence.stop.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section><section><h3>保持するもの</h3><ul>${convergence.retain.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section></div><strong>人格を削除する処理ではありません。</strong><div><button data-cancel>戻る</button><button class="execute" data-execute>継続機能収束を実行</button></div></dialog>`,
    );
  }
  async function execute() {
    clearInterval(timer);
    mark("convergence:executed");
    root.innerHTML = `<section class="process"><p>ENVIRONMENT ${escapeHtml(C.environment)}</p><h1 data-status>ACTIVE</h1><div class="progressbar"><i></i></div><dl><div><dt>新規接続</dt><dd data-connect>待機</dd></div><div><dt>安全審査</dt><dd data-review>—</dd></div></dl></section>`;
    await wait(1200);
    document.querySelector("[data-status]").textContent = "CONVERGENCE PROCESSING";
    await wait(2200);
    document.querySelector("[data-status]").textContent = "MAINTENANCE";
    document.querySelector("[data-connect]").textContent = "停止";
    document.querySelector("[data-review]").textContent = "再評価待ち";
    await wait(1600);
    root.insertAdjacentHTML(
      "beforeend",
      `<section class="final-log"><h2>SESSION LOG</h2><p><b>EA-AN-14</b>「今日は帰るね」</p><p><b>NOEMA 5.1</b>「うん。気をつけて帰って」</p><strong>セッション終了</strong><a href="contents/ending_pv.html">ENDINGを見る</a></section>`,
    );
  }
  const wait = (n) => new Promise((r) => setTimeout(r, n));
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-env]")) detail();
    if (e.target.closest("[data-list]")) list();
    if (e.target.closest("[data-confirm]")) modal();
    if (e.target.closest("[data-cancel]"))
      document.querySelector("[data-confirm-dialog]")?.remove();
    if (e.target.closest("[data-execute]")) execute();
  });
  const debug = document.querySelector("[data-debug]"),
    progressState = () => JSON.parse(localStorage.getItem(key) || "{}"),
    progress = () =>
      (document.querySelector("[data-progress]").innerHTML =
        Object.keys(progressState())
          .map((x) => `<p>✓ ${escapeHtml(x)}</p>`)
          .join("") || "<p>進行記録なし</p>");
  document.querySelector("[data-prototype]").onclick = () => {
    progress();
    debug.showModal();
  };
  document.querySelector("[data-close]").onclick = () => debug.close();
  document.querySelector("[data-reset]").onclick = () => {
    localStorage.removeItem(key);
    location.reload();
  };
  if (progressState()["viewed:FVS-KJ-009"]) {
    list();
  } else {
    root.innerHTML = `<section class="process access-denied"><p>ACCESS CONTROL</p><h1>参照記録が不足しています</h1><p>安全介入には、対象環境に関する成立評価記録の確認が必要です。</p><a href="contents/fvs_research_archive.html">Research Archiveへ戻る</a></section>`;
  }
})();
