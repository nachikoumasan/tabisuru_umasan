/**
 * shared_static_form.js — 受付終了済み・演出用フォームの共通送信抑止。
 * 読み込み元: contents/echoagain_monitor_form.html。
 * 対象: data-static-form を持つフォーム。
 */
(() => {
  "use strict";

  const preventSubmission = (form) => {
    form.addEventListener("submit", (event) => event.preventDefault());
  };

  document.querySelectorAll("form[data-static-form]").forEach(preventSubmission);
})();
