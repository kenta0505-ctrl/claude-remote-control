#!/usr/bin/env bash
# 指定日のダイジェストを LATEST.md に反映し、INDEX.md に追記する。
# 同じ日付で再実行しても INDEX.md が二重にならない（冪等）。
# 使い方: ./scripts/finalize.sh 2026-08-26
set -euo pipefail

cd "$(dirname "$0")/.."

DATE="${1:-}"
if [ -z "$DATE" ]; then
  echo "使い方: $0 YYYY-MM-DD" >&2
  exit 1
fi
if ! printf '%s' "$DATE" | grep -qE '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'; then
  echo "日付の形式が不正です: $DATE (YYYY-MM-DD で指定してください)" >&2
  exit 1
fi

DIGEST="digests/$DATE.md"
if [ ! -f "$DIGEST" ]; then
  echo "ダイジェストがありません: $DIGEST" >&2
  echo "先に手順4でダイジェストを作成してください。" >&2
  exit 1
fi

# --- LATEST.md: 最新ダイジェストの実体コピー ---
{
  echo "<!-- このファイルは scripts/finalize.sh が自動生成します。直接編集しないでください。 -->"
  echo "<!-- 編集する場合は $DIGEST を直してから finalize.sh を再実行してください。 -->"
  echo
  cat "$DIGEST"
  echo
  echo "---"
  echo
  echo "過去のダイジェスト一覧は [INDEX.md](INDEX.md) を参照してください。"
} > LATEST.md

# --- INDEX.md: 新しい日付が上に来る形で追記 ---
if [ ! -f INDEX.md ]; then
  {
    echo "# ダイジェスト索引"
    echo
    echo "新しい順。最新版は [LATEST.md](LATEST.md) にも同じ内容が入っています。"
    echo
  } > INDEX.md
fi

ENTRY="- [$DATE](digests/$DATE.md)"
if grep -qF "(digests/$DATE.md)" INDEX.md; then
  echo "INDEX.md には $DATE が既にあります（追記をスキップ）"
else
  # ヘッダ（先頭の空行までのブロック）を保ったまま、一覧の先頭に挿入する
  header_end=$(grep -n '^$' INDEX.md | sed -n '2p' | cut -d: -f1)
  header_end="${header_end:-4}"
  {
    head -n "$header_end" INDEX.md
    echo "$ENTRY"
    tail -n +$((header_end + 1)) INDEX.md
  } > INDEX.md.tmp
  mv INDEX.md.tmp INDEX.md
  echo "INDEX.md に $DATE を追記しました"
fi

echo "LATEST.md を $DATE のダイジェストで更新しました"
