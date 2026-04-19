import requests
import re
from datetime import datetime

API_URL = "https://note.com/api/v2/creators/nachiko0215/contents?kind=note&page=1"
INDEX_HTML = "index.html"
MAX_ARTICLES = 6

START_MARKER = "<!-- NOTE_ARTICLES_START -->"
END_MARKER = "<!-- NOTE_ARTICLES_END -->"


def fetch_articles():
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(API_URL, headers=headers, timeout=15)
    response.raise_for_status()
    data = response.json()
    return data.get("data", {}).get("contents", [])[:MAX_ARTICLES]


def format_date(publish_at: str) -> str:
    try:
        dt = datetime.fromisoformat(publish_at.replace("Z", "+00:00"))
        return dt.strftime("%Y.%m.%d")
    except Exception:
        return ""


def build_card(article: dict) -> str:
    url = article.get("noteUrl", "")
    title = article.get("name", "")
    date_str = format_date(article.get("publishAt", ""))

    # サムネイル取得（eyecatch → key_visual → fallback）
    thumb = (
        article.get("eyecatchUrl")
        or article.get("key_visual_url")
        or ""
    )

    if thumb:
        img_tag = f'<img src="{thumb}" alt="" loading="lazy" onerror="this.parentNode.innerHTML=\'📝\'">'
    else:
        img_tag = "📝"

    return (
        f'<a class="note-card" href="{url}" target="_blank">\n'
        f'  <div class="note-thumb">\n'
        f'    {img_tag}\n'
        f'  </div>\n'
        f'  <div class="note-info">\n'
        f'    <div class="note-title">{title}</div>\n'
        f'    <div class="note-date">{date_str}</div>\n'
        f'  </div>\n'
        f'</a>'
    )


def update_html(cards_html: str):
    with open(INDEX_HTML, encoding="utf-8") as f:
        html = f.read()

    pattern = re.compile(
        re.escape(START_MARKER) + r".*?" + re.escape(END_MARKER),
        re.DOTALL,
    )
    replacement = f"{START_MARKER}\n{cards_html}\n{END_MARKER}"

    if not pattern.search(html):
        raise ValueError("index.html にマーカーコメントが見つかりません")

    new_html = pattern.sub(replacement, html)

    with open(INDEX_HTML, "w", encoding="utf-8") as f:
        f.write(new_html)

    print("index.html を更新しました")


def main():
    print("note API から記事を取得中...")
    articles = fetch_articles()
    print(f"{len(articles)} 件取得")

    cards = "\n".join(build_card(a) for a in articles)
    update_html(cards)


if __name__ == "__main__":
    main()
