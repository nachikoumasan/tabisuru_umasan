/**
 * resona_chat_data.js — カラオケレゾナ案内チャットの応答データ。
 * 依存: なし（window.REZONA_CHAT_DATAを公開）。
 * 役割: 検索キーワード、回答文、結果リンクを保持する。
 */
  window.REZONA_CHAT_DATA = [
    {
      keywords: ["レゾナくん", "キャラクター", "ステッカー"],
      response: "関連するキャンペーン情報が見つかりました。",
      results: [
        {
          title: "レゾナくん デビューキャンペーン",
          description: "オリジナルステッカーをプレゼント",
          url: "contents/resona_home.html?page=resona_cmp_20260805",
        },
      ],
    },
    {
      keywords: ["カラオケレゾナ"],
      priority: -100,
      response: "店舗情報が見つかりました。",
      results: [{ title: "カラオケレゾナ 鈴森駅前店", url: "contents/resona_home.html" }],
    },
    {
      keywords: ["Echo Again", "エコーアゲイン", "音声インタラクション"],
      response: "関連するキャンペーン情報が見つかりました。",
      results: [
        {
          title: "Echo Again モニター参加者募集",
          description: "終了したキャンペーンです。",
          url: "contents/resona_cmp_20260520.html",
        },
      ],
    },
    {
      keywords: ["モニター", "モニター企画"],
      response: "関連する記事が見つかりました。",
      results: [
        {
          title: "スタッフブログ",
          description: "本部から案内が届きました",
          meta: "2026.05.08",
          url: "contents/resona_staff.html?post=monitor-program-notice",
        },
      ],
    },
    {
      keywords: ["同じ歌", "同じ曲", "深夜", "二人", "歌ってます"],
      response: "関連するスタッフブログが見つかりました。",
      results: [
        {
          source: { collection: "journal", id: "same-song-at-night" },
          url: "contents/resona_staff.html?post=same-song-at-night",
        },
      ],
    },
    {
      keywords: ["Nachiko"],
      response: "「Nachiko」に関連する情報が見つかりました。",
      results: [
        {
          title: "Nachiko 楽曲情報",
          description: "One More Song / Sing With Me",
          url: "contents/resona_home.html?page=campaigns#song-campaign",
        },
        {
          title: "楽曲歌唱キャンペーン",
          url: "contents/resona_home.html?page=campaigns#song-campaign",
        },
      ],
    },
    {
      keywords: ["One More Song"],
      response: "「One More Song」に関連する楽曲情報が見つかりました。",
      results: [
        {
          title: "One More Song",
          description: "Nachiko",
          url: "contents/resona_home.html?page=campaigns#song-campaign",
        },
      ],
    },
    {
      keywords: ["Sing With Me"],
      response: "「Sing With Me」に関連する楽曲情報が見つかりました。",
      results: [
        {
          title: "Sing With Me",
          description: "Nachiko",
          url: "contents/resona_home.html?page=campaigns#song-campaign",
        },
      ],
    },
    {
      keywords: ["歌唱キャンペーン", "歌唱"],
      response: "関連するキャンペーン情報が見つかりました。",
      results: [
        {
          title: "楽曲歌唱キャンペーン",
          url: "contents/resona_home.html?page=campaigns#song-campaign",
        },
      ],
    },
    {
      keywords: ["傘", "忘れ物"],
      response: "関連するスタッフブログが見つかりました。",
      results: [
        {
          source: { collection: "journal", id: "umbrella-lost-items" },
          meta: "2026.06.21",
          url: "contents/resona_staff.html?post=umbrella-lost-items",
        },
      ],
    },
    {
      keywords: ["夏休み"],
      response: "夏休みに関連する情報が見つかりました。",
      results: [
        {
          source: { collection: "journal", id: "summer-season-started" },
          description: "スタッフブログ",
          meta: "2026.07.18",
          url: "contents/resona_staff.html?post=summer-season-started",
        },
        {
          source: { collection: "official", id: "summer-price" },
          description: "お知らせ",
          meta: "2026.07.15",
          url: "contents/resona_home.html?page=news#summer-price",
        },
      ],
    },
    {
      keywords: ["料金"],
      response: "「料金」に関連する情報が見つかりました。",
      results: [{ title: "料金", url: "contents/resona_home.html?page=price" }],
    },
    {
      keywords: ["ルーム"],
      response: "「ルーム」に関連する情報が見つかりました。",
      results: [{ title: "ルーム", url: "contents/resona_home.html?page=rooms" }],
    },
    {
      keywords: ["メニュー", "フード", "ドリンク"],
      response: "「メニュー」に関連する情報が見つかりました。",
      results: [{ title: "メニュー", url: "contents/resona_home.html?page=menu" }],
    },
    {
      keywords: ["キャンペーン"],
      response: "「キャンペーン」に関連する情報が見つかりました。",
      results: [{ title: "キャンペーン", url: "contents/resona_home.html?page=campaigns" }],
    },
    {
      keywords: ["アクセス"],
      response: "「アクセス」に関連する情報が見つかりました。",
      results: [{ title: "アクセス", url: "contents/resona_home.html?page=access" }],
    },
  ];
