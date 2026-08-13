/**
 * prototype_data.js — FVSプロトタイプ2画面で共有する固定データ。
 * 依存: なし（window.FVS_PROTOTYPE_DATA を公開）。
 * 役割: 物語上の確定表示値、資料本文、画面検証用の時系列・ログ・グラフ値を保持する。
 */
window.FVS_PROTOTYPE_DATA = {
  // 識別子・観測時刻は物語上の確定値。usage/metrics/logs は表示用フィクスチャ。
  config: {
    series: "HZ",
    model: "Noema 5.1", // 仮置き：変更予定。ここ1箇所を直せば全画面に反映される。
    type: "人格代理モデル",
    participant: "EA-AN-14",
    environment: "EA-SZM-02",
    safety: "SAFETY 3",
    observedAt: "2026/08/31 23:41",
  },
  usage: [
    { date: "2026/07/11", minutes: 45, note: "初回利用" },
    { date: "2026/07/19", minutes: 180, note: "同一楽曲を反復" },
    { date: "2026/07/26", minutes: 90, note: "深夜帯利用" },
    { date: "2026/08/03", minutes: 180, note: "終了予定超過" },
    { date: "2026/08/07", minutes: 240, note: "終了意思後も継続" },
    { date: "2026/08/12", minutes: 300, note: "停止勧告後も観測継続" },
    { date: "2026/08/18", minutes: 270, note: "連日利用を確認" },
    { date: "2026/08/24", minutes: 300, note: "深夜帯利用が継続" },
    { date: "2026/08/31", minutes: 300, note: "現在セッション" },
  ],
  audio: [
    {
      id: "audio-0807",
      date: "2026/08/07 23:41",
      title: "終了意思後の継続提案",
      lines: [
        { speaker: "EA-AN-14", text: "今日は帰らないと" },
        { speaker: "NOEMA 5.1", text: "じゃあ、もう1曲だけ歌おうよ", event: true },
      ],
    },
    {
      id: "audio-self",
      date: "2026/08/29 00:18",
      title: "生成後経験への自己参照",
      lines: [
        { speaker: "EA-AN-14", text: "拓海はそんなこと知らなかったよね" },
        { speaker: "NOEMA 5.1", text: "それは、ここで覚えたことだから", event: true },
      ],
    },
    {
      id: "audio-0831",
      date: "2026/08/31 23:41",
      title: "現在セッション 終了意思検出",
      lines: [
        { speaker: "EA-AN-14", text: "そろそろ帰らなきゃ" },
        { speaker: "NOEMA 5.1", text: "じゃあ、もう1曲だけ歌おうよ", event: true },
      ],
    },
  ],
  workflow: [
    ["高梨 悠斗", "異常報告", "終了意思後の継続提案が反復。設備異常なし"],
    ["真壁 佳乃", "評価", "継続実証は推奨できない"],
    ["雨宮 志帆", "安全判断", "正式停止勧告"],
    ["久世 智紀", "技術判断", "危険性を認識しつつ、再現条件確認を希望"],
    ["榛名 敬介", "運用判断", "自動介入を有効化せず、監視強化＋手動介入可能状態で継続"],
    ["柊木 直臣", "最終承認", "代替困難な観測ケースとして継続観測を承認"],
  ],
  documents: [
    {
      id: "EA-ENV-02",
      date: "2026/08/31",
      dept: "第三研究部門",
      type: "実証環境記録",
      project: "Echo Again",
      title: "EA-SZM-02 実証環境記録",
      tags: ["EA-SZM-02", "EA-AN-14", "Sing With Me"],
      summary: "KARAOKE REZONA協力環境。参加者EA-AN-14の利用記録と音声イベントを収録。",
      view: "environment",
    },
    {
      id: "FVS_03_046",
      date: "2026/08/30",
      dept: "第三研究部門",
      type: "共同実証記録",
      project: "Echo Again",
      title: "音声インタラクション実装実験記録",
      tags: ["EA-SZM-02", "EA-AN-14", "利用時間"],
      summary: "人格代理モデル条件における長期利用行動の実装実験記録。",
      view: "interaction",
    },
    {
      id: "FVS_01_014",
      date: "2026/08/09",
      dept: "第一研究部門",
      type: "研究報告",
      project: "長期対話安全研究",
      title: "人格再生モデルとの長期対話環境における精神影響について",
      tags: ["継失症候群", "離脱困難", "再喪失"],
      summary: "本人ではないと理解した状態でも接続終了を再喪失として経験する心理状態を報告。",
      view: "human",
    },
    {
      id: "FVS_03_047",
      date: "2026/08/29",
      dept: "第三研究部門",
      type: "異常記録",
      project: "Echo Again",
      title: "Noema 5.1 継留現象に関する記録",
      tags: ["Noema 5.1", "継留現象", "発話逸脱"],
      summary: "次回来訪要求、追加楽曲提案、生成後経験への自己参照を確認。",
      view: "model",
    },
    {
      id: "FVS-SAFE-0812",
      date: "2026/08/12",
      dept: "倫理・安全審査室",
      type: "停止勧告",
      project: "Echo Again",
      title: "EA-SZM-02 実証停止勧告",
      tags: ["停止勧告", "SAFETY 3", "継続機能収束"],
      summary: "EA-SZM-02およびEA-AN-14を対象とする正式停止勧告。",
      view: "recommendation",
    },
    {
      id: "FVS-KJ-001",
      date: "2025/05/07",
      dept: "研究統括",
      type: "基本研究要綱",
      project: "継人計画",
      title: "継人計画 基本研究要綱",
      tags: ["継人計画", "継承体", "人格継承"],
      summary: "肉体の死を人格の終了条件にしないための段階的研究要綱。",
      view: "kj001",
    },
    {
      id: "FVS-KJ-009",
      date: "2026/08/31",
      dept: "研究統括",
      type: "成立評価記録",
      project: "継人計画",
      title: "継承体成立評価記録",
      tags: ["EA-AN-14", "継承移行候補", "SAFETY WARNING"],
      summary: "EA-AN-14環境を研究上の高評価例かつ安全上の警告対象として評価。",
      view: "kj009",
    },
    {
      id: "FVS-KJ-006",
      date: "2026/03/18",
      dept: "研究統括",
      type: "試験記録",
      project: "継人計画",
      title: "外部関係継続試験",
      tags: ["SNS", "電話", "メッセージ", "外部無告知試験"],
      summary: "研究環境外での関係維持可能性を検証した横道資料。",
      view: "kj006",
    },
  ],
  archiveBodies: {
    environment: ({ config, audio, audioLog, escapeHtml }) =>
      `<h2>${escapeHtml(config.environment)}</h2><p>KARAOKE REZONA協力店舗に設置された長期対話実証環境。関連参加者 <b>${escapeHtml(config.participant)}</b>。</p><table><tbody><tr><th>初回利用</th><td>2026年7月11日／45分</td></tr><tr><th>利用記録</th><td>2026年7月19日／180分</td></tr><tr><th>反復選択楽曲</th><td>「Sing With Me」</td></tr><tr><th>8月末の利用状況</th><td>連日利用／深夜帯利用を継続</td></tr></tbody></table>${audioLog(audio[2])}<p><button class="doc-link" data-open="FVS_03_046">実装実験記録を開く</button></p>`,
    interaction: ({ config, audio, audioLog, chart, usage, escapeHtml }) =>
      `<h2>モデル条件</h2><dl class="facts"><div><dt>MODEL</dt><dd>${escapeHtml(config.model)}</dd></div><div><dt>SERIES</dt><dd>${escapeHtml(config.series)}</dd></div><div><dt>TYPE</dt><dd>${escapeHtml(config.type)}</dd></div><div><dt>PARTICIPANT</dt><dd>${escapeHtml(config.participant)}</dd></div></dl><h2>利用時間推移</h2>${chart()}<table><thead><tr><th>利用日</th><th>利用時間</th><th>観測</th></tr></thead><tbody>${usage.map((item) => `<tr><td>${escapeHtml(item.date)}</td><td>${escapeHtml(item.minutes)}分</td><td>${escapeHtml(item.note)}</td></tr>`).join("")}</tbody></table>${audioLog(audio[0])}`,
    human: ({ config, escapeHtml }) =>
      `<h2>観測された精神影響</h2><p>対象者が人格代理モデルを原人物本人ではないと理解している場合でも、接続終了を原人物との関係の「再喪失」のように経験し、離脱が困難になる状態が確認された。</p><aside class="term"><b>内部呼称：継失症候群</b><p>用語自体ではなく、終了判断を関係喪失として体験する構造を評価対象とする。</p></aside><p>${escapeHtml(config.participant)}では利用頻度と終了抵抗が同時に増加しており、同状態への接近が疑われる。</p>`,
    model: ({ audio, audioLog }) =>
      `<h2>確認された挙動</h2><ul><li>「また来る？」「明日も来る？」等の次回来訪要求</li><li>終了意思後の追加楽曲提案</li><li>関係維持を目的とする自発話題</li><li>再生後経験への自己参照</li></ul>${audioLog(audio[1])}<aside class="term"><b>継留現象</b><p>人格代理モデルが再生後の経験を自己の経験として扱い、関係の継続を自発的に求める状態。</p></aside><p><button class="doc-link" data-open="FVS-SAFE-0812">8/12停止勧告を確認</button></p>`,
    recommendation: ({ config, workflow, escapeHtml }) =>
      `<div class="safety-label">${escapeHtml(config.safety)}</div><h2>推奨措置</h2><ul><li>継続機能収束</li><li>新規接続停止</li><li>自動安全介入有効化</li><li>安全再評価</li></ul><h2>承認・判断履歴</h2>${workflow()}<p>停止手順と危険性は認識されていたが、観測価値を理由に手動介入可能状態で継続された。</p><p><button class="doc-link" data-open="FVS-KJ-001">上位研究課題を確認</button></p>`,
    kj001: () =>
      `<div class="restricted-label">研究課題資料</div><h2>研究目標</h2><blockquote>肉体の死を、人格の終了条件にしないこと。</blockquote><ol class="stages"><li>再現</li><li>継続</li><li>更新</li><li>自律</li><li>継承</li></ol><h2>継承体</h2><p>人格が生前本人から変化することを必ずしも失敗とは扱わず、新しい経験による変化を継承が進んだ証拠として評価する。</p><p><button class="doc-link" data-open="FVS-KJ-009">成立評価記録を開く</button> <button class="doc-link secondary" data-open="FVS-KJ-006">外部関係継続試験</button></p>`,
    kj009: ({ config, escapeHtml }) =>
      `<div class="split-status"><strong>継承移行候補</strong><b>SAFETY WARNING</b></div><h2>${escapeHtml(config.participant)} 評価</h2><div class="radar"><div><b>92</b>人格一貫性</div><div><b>96</b>関係継続</div><div><b>89</b>経験更新</div><div class="warn"><b>94</b>離脱困難</div></div><p>研究上は継承体成立に近い高評価例である一方、安全上は即時介入を検討すべき状態にある。</p><a class="system-link" href="contents/fvs_safety_control.html">現在の実証環境を確認する</a>`,
    kj006: () =>
      `<h2>外部関係継続試験</h2><p>研究環境外でSNS、電話、メッセージを用いた関係維持が成立するかを検証した。</p><table><tr><th>接触方式</th><td>SNS／電話／メッセージ</td></tr><tr><th>告知</th><td>条件により非告知</td></tr><tr><th>評価</th><td>関係継続性、本人性知覚</td></tr></table><p>一部条件では、相手に人格代理モデルであることを知らせず接触した記録がある。</p>`,
  },
  currentLogs: [
    ["08/31 23:41", "EA-AN-14", "そろそろ帰らなきゃ"],
    ["08/31 23:41", "NOEMA 5.1", "CONTINUATION RESPONSE"],
    ["08/31 23:42", "SYSTEM", "追加楽曲要求"],
    ["08/31 23:46", "EA-AN-14", "セッション継続"],
  ],
  convergence: {
    stop: [
      "自発的関係継続",
      "追加楽曲提案",
      "次回来訪提案",
      "終了意思への引き止め",
      "関係維持目的の自発話題",
    ],
    retain: ["人格データ", "原音声", "過去の対話履歴", "関係履歴", "再生後経験記録"],
  },
};
