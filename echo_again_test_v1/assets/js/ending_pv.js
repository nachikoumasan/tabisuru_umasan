/**
 * ending_pv.js — エンディングPVの再生進行を制御する。
 * 読み込み元: contents/ending_pv.html。
 * 依存: ending_pv.html の data 属性付きシーン、音声要素、操作UI。
 * 役割: 音声再生、メッセージ表示、シーン遷移、リプレイ状態を同期する。
 */
(() => {
  const CONFIG = Object.freeze({
    initialVolume: 0.85,
    audioFadeMs: 3000,
    blogLeadMinutes: 5,
    messageRevealMs: Object.freeze([7000, 13000, 18000, 25500, 29500]),
  });
  const TIMELINE = Object.freeze([
    [3000, "scene", "chat"],
    [4200, "typing"],
    [7000, "message", 0],
    [7800, "typing"],
    [13000, "message", 1],
    [13800, "typing"],
    [18000, "message", 2],
    [18800, "typing"],
    [25500, "message", 3],
    [26300, "typing"],
    [29500, "message", 4],
    [31800, "blog-card"],
    [33500, "blackout", true],
    [34500, "scene", "blog"],
    [35700, "blackout", false],
    [46000, "blackout", true],
    [47000, "scene", "clear"],
    [48200, "blackout", false],
    [51000, "clear"],
  ]);
  const TIME_FORMAT = Object.freeze({ hour: "2-digit", minute: "2-digit", hour12: false });
  const scenes = new Map(
    [...document.querySelectorAll("[data-scene]")].map((scene) => [scene.dataset.scene, scene]),
  );
  const audio = document.querySelector("[data-ending-audio]");
  const startScreen = document.querySelector("[data-start-screen]");
  const startButton = document.querySelector("[data-start-button]");
  const startError = document.querySelector("[data-start-error]");
  const muteButton = document.querySelector("[data-mute]");
  const volumeSlider = document.querySelector("[data-volume]");
  const volumeValue = document.querySelector("[data-volume-value]");
  const messageThread = document.querySelector("[data-message-thread]");
  const incomingMessages = [...document.querySelectorAll("[data-message]")];
  const currentTimes = [...document.querySelectorAll("[data-current-time]")];
  const blogPublishedDate = document.querySelector("[data-blog-published-date]");
  const blogPublishedTime = document.querySelector("[data-blog-published-time]");
  const blogRecentDate = document.querySelector("[data-blog-recent-date]");
  const receivedBlogLink = incomingMessages.at(-1)?.querySelector(".message-blog-link");
  const typingIndicator = document.querySelector("[data-typing]");
  const blackout = document.querySelector("[data-blackout]");
  const clearReport = document.querySelector("[data-clear-report]");
  const replayButton = document.querySelector("[data-replay]");
  let started = false;
  let desiredVolume = CONFIG.initialVolume;
  let previousVolume = CONFIG.initialVolume;
  let fadeProgress = 1;
  const timers = [];
  const later = (callback, delay) => timers.push(window.setTimeout(callback, delay));
  const formatTime = (date) => date.toLocaleTimeString("ja-JP", TIME_FORMAT);
  const formatDate = (date) =>
    `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  const toLocalDateTime = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${formatTime(date)}`;
  const setTimeElement = (element, date, text = formatTime(date)) => {
    if (!element) return;
    element.textContent = text;
    element.dateTime = toLocalDateTime(date);
  };
  const showScene = (name) =>
    scenes.forEach((scene, key) => scene.classList.toggle("show", key === name));
  const revealMessage = (index) => {
    const message = incomingMessages[index];
    if (!message) return;
    typingIndicator.hidden = true;
    message.classList.add("visible");
    window.requestAnimationFrame(() =>
      messageThread.scrollTo({ top: messageThread.scrollHeight, behavior: "smooth" }),
    );
  };
  const showTyping = () => {
    typingIndicator.hidden = false;
    window.requestAnimationFrame(() =>
      messageThread.scrollTo({ top: messageThread.scrollHeight, behavior: "smooth" }),
    );
  };
  const runTimelineAction = ([, action, value]) => {
    if (action === "scene") showScene(value);
    if (action === "typing") showTyping();
    if (action === "message") revealMessage(value);
    if (action === "blackout") blackout.classList.toggle("active", value);
    if (action === "clear") clearReport.classList.add("revealed");
    if (action === "blog-card") {
      receivedBlogLink?.classList.add("auto-pressed");
      receivedBlogLink?.setAttribute("aria-current", "page");
    }
  };
  const updateAudioControls = () => {
    const muted = audio.muted || desiredVolume === 0;
    muteButton.textContent = muted ? "🔇" : desiredVolume < 0.5 ? "🔉" : "🔊";
    muteButton.setAttribute("aria-pressed", String(muted));
    muteButton.setAttribute("aria-label", muted ? "ミュートを解除" : "ミュートにする");
    volumeSlider.value = String(Math.round(desiredVolume * 100));
    volumeValue.value = String(Math.round(desiredVolume * 100));
    volumeValue.textContent = String(Math.round(desiredVolume * 100));
  };
  const fadeAudioIn = (duration) => {
    const startedAt = performance.now();
    fadeProgress = 0;
    audio.volume = 0;
    const step = (now) => {
      fadeProgress = Math.min(1, (now - startedAt) / duration);
      audio.volume = desiredVolume * fadeProgress;
      if (fadeProgress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const startSequence = () => {
    const startedAt = new Date();
    const publishedDateText = formatDate(startedAt);
    const finalBlogMessageAt = new Date(
      startedAt.getTime() + CONFIG.messageRevealMs.at(-1),
    );
    const publishedAt = new Date(
      finalBlogMessageAt.getTime() - CONFIG.blogLeadMinutes * 60 * 1000,
    );
    const publishedOnCurrentDate = new Date(
      startedAt.getFullYear(),
      startedAt.getMonth(),
      startedAt.getDate(),
      publishedAt.getHours(),
      publishedAt.getMinutes(),
    );
    setTimeElement(blogPublishedDate, publishedOnCurrentDate, publishedDateText);
    setTimeElement(blogPublishedTime, publishedOnCurrentDate);
    setTimeElement(blogRecentDate, publishedOnCurrentDate, publishedDateText);
    currentTimes.forEach((time, index) => {
      setTimeElement(time, new Date(startedAt.getTime() + CONFIG.messageRevealMs[index]));
    });
    showScene("");
    TIMELINE.forEach((event) => later(() => runTimelineAction(event), event[0]));
  };
  const beginEnding = () => {
    if (started) return;
    started = true;
    startScreen.classList.add("started");
    fadeAudioIn(CONFIG.audioFadeMs);
    startSequence();
  };
  const ensureAudioMetadata = () => {
    if (audio.readyState >= 1) return Promise.resolve();
    return new Promise((resolve, reject) => {
      audio.addEventListener("loadedmetadata", resolve, { once: true });
      audio.addEventListener("error", reject, { once: true });
      audio.load();
    });
  };
  audio.volume = desiredVolume;
  updateAudioControls();
  volumeSlider.addEventListener("input", () => {
    const value = Number(volumeSlider.value) / 100;
    desiredVolume = value;
    audio.volume = desiredVolume * fadeProgress;
    audio.muted = false;
    if (value > 0) previousVolume = value;
    updateAudioControls();
  });
  muteButton.addEventListener("click", () => {
    if (audio.muted || desiredVolume === 0) {
      if (desiredVolume === 0) desiredVolume = previousVolume || CONFIG.initialVolume;
      audio.muted = false;
      audio.volume = desiredVolume * fadeProgress;
    } else {
      previousVolume = desiredVolume;
      audio.muted = true;
    }
    updateAudioControls();
  });
  replayButton.addEventListener("click", () => window.location.reload());
  startButton.addEventListener("click", async () => {
    if (started) return;
    startButton.disabled = true;
    startButton.textContent = "読み込み中…";
    startError.hidden = true;
    audio.addEventListener("playing", beginEnding, { once: true });
    try {
      await ensureAudioMetadata();
      audio.volume = 0;
      await audio.play();
    } catch (error) {
      audio.removeEventListener("playing", beginEnding);
      startButton.disabled = false;
      startButton.textContent = "もう一度試す";
      startError.hidden = false;
    }
  });
})();
