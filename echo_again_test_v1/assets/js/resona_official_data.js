/**
 * resona_official_data.js — カラオケレゾナ公式サイトの固定表示データ。
 * 依存: なし（window.REZONA_OFFICIAL_NEWS / REZONA_OFFICIAL_CONTENTを公開）。
 * 役割: お知らせ記事と、キャンペーン・おすすめ案内などの固定HTMLを保持する。
 */
  window.REZONA_OFFICIAL_NEWS = [
    {
      id: "maintenance",
      date: "2026.08.24",
      category: "設備",
      title: "一部ルームの設備メンテナンスについて",
      body: [
        "9月2日11時〜16時まで、一部ルームを休止します。その他のルームは通常どおり営業します。",
      ],
    },
    {
      id: "rezona-kun-debut",
      date: "2026.08.05",
      category: "キャンペーン",
      title: "レゾナくん デビューキャンペーン開催",
      body: [
        "店舗マスコット「レゾナくん」のデビューを記念して、キャンペーンを開催します。",
        "対象商品をご注文いただいた方に、オリジナルステッカーをプレゼントします。",
        "期間：2026年8月5日〜9月15日",
      ],
      related:
        '<a class="text-link" href="contents/resona_home.html?page=resona_cmp_20260805">キャンペーン詳細を見る →</a>',
    },
    {
      id: "nachiko-campaign",
      date: "2026.08.01",
      category: "キャンペーン",
      title: "楽曲歌唱キャンペーン開催",
      body: ["対象曲で90点以上を獲得した方に、カラオケレゾナ公式グッズをプレゼントします。"],
      related:
        '<a class="text-link" href="contents/resona_home.html?page=resona_cmp_20260801">キャンペーン詳細を見る →</a>',
    },
    {
      id: "summer-long",
      date: "2026.07.20",
      category: "キャンペーン",
      title: "夏休みロングカラオケキャンペーン",
      body: ["昼の時間帯に3時間以上ご利用いただくと、お得なパック料金で楽しめます。"],
      related:
        '<a class="text-link" href="contents/resona_home.html?page=resona_cmp_20260720">キャンペーン詳細を見る →</a>',
    },
    {
      id: "summer-price",
      date: "2026.07.15",
      category: "料金",
      title: "夏休み期間の料金について",
      body: ["夏休み期間は特別料金でのご案内となります。詳しい料金は店頭でご確認ください。"],
    },
    {
      id: "charger",
      date: "2026.05.28",
      category: "サービス",
      title: "スマートフォン充電器の貸し出しについて",
      body: ["受付にて各種充電器を無料で貸し出しています。数に限りがあります。"],
    },
    {
      id: "echo-monitor",
      date: "2026.05.20",
      category: "キャンペーン",
      title: "モニター参加者募集について",
      body: [
        "一部店舗限定の試験サービスについて、モニター参加者を募集しています。",
        "詳細は店頭にてご案内します。",
      ],
    },
    {
      id: "staff-blog",
      date: "2026.03.08",
      category: "お知らせ",
      title: "鈴森駅前店 スタッフブログを開設しました",
      body: ["鈴森駅前店の日々の出来事をお伝えするスタッフブログを始めました。"],
      related:
        '<a class="text-link" href="contents/resona_staff.html" target="_blank" rel="noopener noreferrer">スタッフブログを見る →</a>',
    },
    {
      id: "cleaning-hours",
      date: "2026.02.22",
      category: "店舗",
      title: "店内清掃実施時間のお知らせ",
      body: [
        "毎日午前6時から午前9時まで、店内および各ルームの清掃を実施しています。営業時間中も通常どおりご利用いただけます。",
      ],
    },
    {
      id: "winter-menu-end",
      date: "2026.02.10",
      category: "メニュー",
      title: "冬季限定メニュー販売終了のお知らせ",
      body: [
        "冬季限定メニューは2月28日をもって販売を終了します。期間中のご利用をお待ちしています。",
      ],
    },
    {
      id: "blanket-service",
      date: "2026.01.15",
      category: "サービス",
      title: "貸出用ブランケットのご案内",
      body: [
        "受付にてブランケットを無料で貸し出しています。数に限りがありますので、ご希望の際はスタッフへお申し付けください。",
      ],
    },
  ];

window.REZONA_OFFICIAL_CONTENT = {
  mascotCampaignPage: `
    <main>
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">CAMPAIGN</p>
          <h1 class="page-title">レゾナくん デビューキャンペーン</h1>
          <p>店舗マスコット「レゾナくん」のデビューを記念した期間限定キャンペーンです。</p>
        </div>
      </section>
      <section class="section">
        <div class="container campaign-detail active-campaign-detail">
          <img class="campaign-detail-banner mascot-campaign-image" src="media/resona_campaign_rezona_kun_debut.webp?v=20260813" width="1672" height="941" alt="レゾナくん デビューキャンペーン">
          <article class="content-card">
            <p class="campaign-start-date"><span>開催期間</span><time datetime="2026-08-05">2026年8月5日～9月15日</time></p>
            <div class="campaign-copy">
              <p class="campaign-copy-lead">レゾナくんのデビューを記念して、オリジナルステッカーをプレゼント。</p>
              <p>対象商品をご注文いただいた方に、レゾナくんのオリジナルステッカーを差し上げます。</p>
              <section><h2>対象</h2><p>店内で対象商品をご注文いただいたお客様</p></section>
              <section><h2>プレゼント</h2><p>レゾナくん オリジナルステッカー</p></section>
              <section><h2>注意事項</h2><p>ステッカーは数量限定です。なくなり次第終了となります。</p></section>
            </div>
          </article>
        </div>
      </section>
    </main>`,
  mascotCampaignTarget:
    '<h2>対象商品</h2><ul class="campaign-target-menu"><li><span>鶏の唐揚げ</span><b>590円</b></li><li><span>ミックスピザ</span><b>890円</b></li><li><span>焼きナポリタン</span><b>790円</b></li><li><span>チョコレートパフェ</span><b>590円</b></li></ul><p class="campaign-target-note">上記いずれか1品のご注文につき、オリジナルステッカーを1枚お渡しします。</p>',
  mascotCampaignCard:
    '<a class="campaign-card mascot-campaign-card" data-campaign="rezona-kun-debut" href="contents/resona_home.html?page=resona_cmp_20260805"><img class="mascot-campaign-image" src="media/resona_campaign_rezona_kun_debut.webp?v=20260813" width="1672" height="941" alt="レゾナくん デビューキャンペーン"><div><h3>レゾナくん デビューキャンペーン</h3><p>対象商品をご注文いただいた方に、オリジナルステッカーをプレゼントします。</p><p class="campaign-period">2026年8月5日開始</p></div></a>',
  menuFeature:
    '<div class="menu-feature-copy"><span>おすすめ！</span><h2>ミックスピザ</h2><p>みんなでシェアしやすい定番ピザ。<br>唐揚げやポテトと一緒にどうぞ。</p><strong>890円 <small>（税込）</small></strong></div><img src="media/resona_home_food_drink.webp?v=20260813" width="900" height="675" alt="ミックスピザ、唐揚げ、フライドポテトのおすすめセット">',
  guideSection: `
    <div class="container">
      <div class="home-section-title"><span>♪</span><h2>おすすめ案内</h2><span>♫</span></div>
      <div class="home-guide-cards">
        <a class="home-guide-card" href="contents/resona_home.html?page=price">
          <div><img src="media/resona_icon_guide_price.png?v=20260813" width="42" height="42" alt=""><h3>料金</h3><p>ご利用時間に合わせた料金をご案内します。</p><b class="ui-link-arrow" aria-hidden="true"></b></div>
          <img src="media/resona_home_guide_price.webp?v=20260813" width="800" height="1000" alt="料金を確認するイメージ">
        </a>
        <a class="home-guide-card" href="contents/resona_home.html?page=rooms">
          <div><img src="media/resona_icon_guide_rooms.png?v=20260813" width="42" height="42" alt=""><h3>ルーム</h3><p>人数や目的に合わせたお部屋をご紹介します。</p><b class="ui-link-arrow" aria-hidden="true"></b></div>
          <img src="media/resona_home_room_standard.webp?v=20260813" width="1200" height="800" alt="スタンダードルーム">
        </a>
        <a class="home-guide-card" href="contents/resona_home.html?page=menu">
          <div><img src="media/resona_icon_guide_menu.png?v=20260813" width="42" height="42" alt=""><h3>メニュー</h3><p>定番メニューからドリンクまでご用意しています。</p><b class="ui-link-arrow" aria-hidden="true"></b></div>
          <img src="media/resona_home_food_drink.webp?v=20260813" width="900" height="675" alt="ドリンクとフード">
        </a>
      </div>
    </div>`,
};
