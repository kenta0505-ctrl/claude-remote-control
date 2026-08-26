#!/usr/bin/env bash
# 前回コミット時点の sources/ と、今回取得した sources/ の差分を人間可読で出す。
# ダイジェスト生成エージェントはこの出力だけを読めばよい（原文全体を読み直す必要がない）。
# 引数: 1ファイルあたりに表示する最大差分行数（省略時 400）
set -uo pipefail

cd "$(dirname "$0")/.."
MAX_LINES="${1:-400}"

# -uall がないと、未追跡のディレクトリが 'sources/' の1行に畳まれてしまう。
# cut -c4- はステータス2文字＋空白を落とすためで、空白入りのパスでも壊れない。
# sort -u は「ステージ済み かつ 作業ツリーでも変更」が二重に出るのを防ぐ。
# _fetch-status.tsv は毎日必ず変わる運用ログなので差分レポートからは除外する。
mapfile -t changed < <(
  git status --porcelain -uall -- sources/ \
    | cut -c4- \
    | grep -v '_fetch-status.tsv$' \
    | sort -u
)

if [ "${#changed[@]}" -eq 0 ]; then
  echo "NO_CHANGES"
  echo "前回収集時点から、機械取得できる全ソースに差分はありません。"
  exit 0
fi

echo "CHANGED_SOURCES: ${#changed[@]}"
for f in "${changed[@]}"; do
  echo "  - $f"
done
echo

# 変更行だけを抜き出す。
# 最初の @@ より前は diff ヘッダ（--- a/x, +++ b/x）なので捨てる。
# ヘッダを行頭パターンで弾いてはいけない: CHANGELOG の箇条書きは '-' 始まりなので、
# 追加された箇条書きは '+- Added ...' となり、素朴な除外だと本文が丸ごと消える。
extract_changes() {
  git diff --unified=0 --no-color -- "$1" | awk '
    /^@@/  { inbody = 1; next }
    !inbody { next }
    /^[+-]/ { print }
  '
}

for f in "${changed[@]}"; do
  echo "================================================================"
  echo "=== $f"
  echo "================================================================"
  if git ls-files --error-unmatch "$f" >/dev/null 2>&1; then
    body=$(extract_changes "$f")
    total=$(printf '%s\n' "$body" | grep -c . || true)
    printf '%s\n' "$body" | head -n "$MAX_LINES"
    if [ "$total" -gt "$MAX_LINES" ]; then
      echo "... (差分 $total 行のうち $MAX_LINES 行を表示。全体は 'git diff -- $f' で確認)"
    fi
  else
    # 新規ソース: 冒頭だけ出す（初回はファイル全体が「差分」になるため）
    echo "[新規ソース — 冒頭 $MAX_LINES 行]"
    head -n "$MAX_LINES" "$f"
  fi
  echo
done
