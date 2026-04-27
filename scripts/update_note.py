import requests
import re
from pathlib import Path
from datetime import datetime

API_URL = "https://note.com/api/v2/creators/nachiko0215/contents?kind=note&page=1"
INDEX_HTML = Path(__file__).parent.parent / "index.html"
MAX_ARTICLES = 6
START_MARKER = "<!-- NOTE_ARTICLES_START -->"
END_MARKER = "<!-- NOTE_ARTICLES_END -->"

# タイトルからジャンルタグを判定
GENRE_MAP = [
    (["ARG"], "ARG"),
    (["周遊"], "周遊型謎解き"),
    (["宿泊"], "宿泊型謎解き"),
    (["VR", "XR"], "VR体験"),
    (["没入", "チームラボ", "ネイキッド", "アート"], "没入型アート"),
    (["謎解き", "脱出", "SCRAP"], "謎解き"),
]

PLACEHOLDER_COLORS = [
    "linear-gradient(135deg,#4a2fa3,#ff8b3d)",
    "linear-gradient(135deg,#2a1262,#ffd23f)",
    "linear-gradient(135deg,#6b4bd6,#f26a1a)",
    "linear-gradient(135deg,#161033,#ff8b3d)",
    "linear-gradient(135deg,#4a2fa3,#ffd23f)",
    "linear-gradient(135deg,#2c205f,#ff6699)",
]

PLACEHOLDER_CHARS = ["謎", "扉", "解", "旅", "冒", "ARG"]


def get_genre(title):
    for keywords, label in GENRE_MAP:
        if any(kw in title for kw in keywords):
            return label
    return "体験レポ"


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


def build_card(article: dict, index: int) -> str:
    url = article.get("noteUrl", "")
    title = article.get("name", "")
    date_str = format_date(article.get("publishAt", ""))
    genre = get_genre(title)
    thumb = article.get("eyecatch") or article.get("eyecatchUrl") or ""
    color = PLACEHOLDER_COLORS[index % len(PLACEHOLDER_COLORS)]
    char = PLACEHOLDER_CHARS[index % len(PLACEHOLDER_CHARS)]

    if thumb:
        thumb_html = f'<img src="{thumb}" alt="" loading="lazy" onerror="this.style.display=\'none\';this.parentNode.style.background=\'{color}\';this.parentNode.innerHTML+=\'<span>{char}</span>\'">'
    else:
        thumb_html = f'<span>{char}</span>'
        thumb_style = f' style="background:{color};"'

    if thumb:
        return (
            f'      <a class="article-card" href="{url}" target="_blank" rel="noopener">\n'
            f'        <div class="article-card__thumb">\n'
            f'          {thumb_html}\n'
            f'        </div>\n'
            f'        <div class="article-card__body">\n'
            f'          <h3 class="article-card__title">{title}</h3>\n'
            f'          <div class="article-card__meta">\n'
            f'            <span class="article-card__date">{date_str}</span>\n'
            f'            <span class="article-card__tag">{genre}</span>\n'
            f'          </div>\n'
            f'        </div>\n'
            f'      </a>'
        )
    else:
        return (
            f'      <a class="article-card" href="{url}" target="_blank" rel="noopener">\n'
            f'        <div class="article-card__thumb article-card__thumb--placeholder"{thumb_style}>{thumb_html}</div>\n'
            f'        <div class="article-card__body">\n'
            f'          <h3 class="article-card__title">{title}</h3>\n'
            f'          <div class="article-card__meta">\n'
            f'            <span class="article-card__date">{date_str}</span>\n'
            f'            <span class="article-card__tag">{genre}</span>\n'
            f'          </div>\n'
            f'        </div>\n'
            f'      </a>'
        )


def update_html(cards_html: str):
    with open(INDEX_HTML, encoding="utf-8") as f:
        html = f.read()

    pattern = re.compile(
        re.escape(START_MARKER) + r".*?" + re.escape(END_MARKER),
        re.DOTALL,
    )
    replacement = f"{START_MARKER}\n{cards_html}\n      {END_MARKER}"

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
    cards = "\n".join(build_card(a, i) for i, a in enumerate(articles))
    update_html(cards)


if __name__ == "__main__":
    main()
