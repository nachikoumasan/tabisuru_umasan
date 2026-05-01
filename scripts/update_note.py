import requests
import re
from pathlib import Path
from datetime import datetime

API_URL = "https://note.com/api/v2/creators/nachiko0215/contents?kind=note&page=1"
INDEX_HTML = Path(__file__).parent.parent / "index.html"
MAX_ARTICLES = 3
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
    thumb = (
        article.get("eyecatch")
        or article.get("eyecatchUrl")
        or ""
    )

    if thumb:
        img_tag = f'<img src="{thumb}" alt="{title}" loading="lazy">'
    else:
        img_tag = '<img src="assets/record-lantern-book.jpg" alt="">'

    return (
        f'<article class="card article" onclick="location.href=\'{url}\'" '
        f'style="cursor:pointer">\n'
        f'  <div class="thumb">{img_tag}</div>\n'
        f'  <h3>{title}</h3>\n'
        f'  <time>{date_str}</time>\n'
        f'</article>'
    )


def update_html(cards_list: list):
    with open(INDEX_HTML, encoding="utf-8") as f:
        html = f.read()

    pattern = re.compile(
        re.escape(START_MARKER) + r".*?" + re.escape(END_MARKER),
        re.DOTALL,
    )
    replacement = (
        START_MARKER + "\n"
        + "\n".join(f"      {card}" for card in cards_list)
        + "\n      " + END_MARKER
    )

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
    cards_list = [build_card(a) for a in articles]
    update_html(cards_list)


if __name__ == "__main__":
    main()
