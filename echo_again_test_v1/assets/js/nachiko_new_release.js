/**
 * nachiko_new_release.js — Nachiko特設ページの試聴プレイヤー制御。
 * 読み込み元: contents/nachiko_new_release.html。
 * 依存: nachiko_new_release.html の audio と data-campaign-player UI。
 * 役割: 再生・停止、シーク、音量、再生時間表示を同期する。
 */
(() => {
  "use strict";
  const format = (value) => {
    const seconds = Math.max(0, Math.floor(Number(value) || 0));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  };
  const players = [...document.querySelectorAll("[data-campaign-player]")];
  const pauseOtherPlayers = (currentAudio) => {
    players.forEach((other) => {
      const otherAudio = other.querySelector("audio");
      if (otherAudio !== currentAudio) otherAudio.pause();
    });
  };
  const createPlayer = (player) => {
    const audio = player.querySelector("audio");
    const play = player.querySelector("[data-play]");
    const seek = player.querySelector("[data-seek]");
    const current = player.querySelector("[data-current]");
    const duration = player.querySelector("[data-duration]");
    const mute = player.querySelector("[data-mute]");
    const volume = player.querySelector("[data-volume]");
    if (!audio || !play || !seek || !current || !duration || !mute || !volume) {
      console.warn("[nachiko-release] 試聴プレイヤーの要素が不足しています", player);
      return;
    }
    const playMark = play.querySelector("span");
    const sync = () => {
      seek.max = String(Number.isFinite(audio.duration) ? audio.duration : 0);
      seek.value = String(audio.currentTime);
      current.textContent = format(audio.currentTime);
      duration.textContent = format(audio.duration);
      volume.value = String(audio.volume);
      const muted = audio.muted || audio.volume === 0;
      play.classList.toggle("is-playing", !audio.paused);
      play.setAttribute("aria-label", audio.paused ? "再生" : "一時停止");
      if (playMark) playMark.textContent = audio.paused ? "▶" : "Ⅱ";
      mute.classList.toggle("is-muted", muted);
      mute.setAttribute("aria-label", muted ? "ミュートを解除" : "ミュート");
    };
    play.addEventListener("click", () => {
      if (audio.paused) {
        pauseOtherPlayers(audio);
        audio.play().catch(() => {});
      } else audio.pause();
    });
    mute.addEventListener("click", () => {
      audio.muted = !audio.muted;
      sync();
    });
    seek.addEventListener("input", () => {
      audio.currentTime = Number(seek.value);
      sync();
    });
    volume.addEventListener("input", () => {
      audio.volume = Number(volume.value);
      audio.muted = false;
      sync();
    });
    [
      "loadedmetadata",
      "durationchange",
      "timeupdate",
      "play",
      "pause",
      "ended",
      "volumechange",
    ].forEach((type) => audio.addEventListener(type, sync));
    sync();
  };
  players.forEach(createPlayer);
})();
