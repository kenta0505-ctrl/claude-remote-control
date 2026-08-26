#!/usr/bin/env bash
# 全ソースを sources/ にバイト単位で取得する。
# 差分検知は git に任せるので、ここでは「取得」と「失敗の記録」だけを行う。
# 取得失敗時は既存ファイルを壊さない（tmp に落としてから atomic に mv）。
set -uo pipefail

cd "$(dirname "$0")/.."
ROOT=$(pwd)
SRC_DIR="$ROOT/sources"
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

mkdir -p "$SRC_DIR"
STATUS="$SRC_DIR/_fetch-status.tsv"
printf 'name\thttp_code\tbytes\tresult\n' > "$STATUS"

fail_count=0
ok_count=0

while IFS=$'\t' read -r name url; do
  # 空行とコメント行を飛ばす
  [ -z "${name:-}" ] && continue
  case "$name" in \#*) continue ;; esac
  [ -z "${url:-}" ] && continue

  tmp="$TMP_DIR/$name"
  code=$(curl -sSL --max-time 60 --retry 3 --retry-delay 2 --retry-all-errors \
              -o "$tmp" -w '%{http_code}' "$url" 2>/dev/null) || code="000"

  if [ "$code" != "200" ] || [ ! -s "$tmp" ]; then
    printf '%s\t%s\t0\tFAIL\n' "$name" "$code" >> "$STATUS"
    echo "FAIL  $name (HTTP $code)" >&2
    fail_count=$((fail_count + 1))
    continue
  fi

  # npm のメタデータは巨大かつノイズが多いので、日次で意味のある項目だけに絞る
  if [ "$name" = "npm-claude-code-latest.json" ]; then
    if jq -S '{name, version, description, engines, bin, dependencies}' "$tmp" > "$tmp.trim" 2>/dev/null; then
      mv "$tmp.trim" "$tmp"
    fi
  fi

  bytes=$(wc -c < "$tmp" | tr -d ' ')
  mv "$tmp" "$SRC_DIR/$name"
  printf '%s\t%s\t%s\tOK\n' "$name" "$code" "$bytes" >> "$STATUS"
  echo "OK    $name ($bytes bytes)"
  ok_count=$((ok_count + 1))
done < "$ROOT/sources.tsv"

echo "---"
echo "取得成功: $ok_count / 失敗: $fail_count"
# 失敗があっても他ソースの処理は続けたいので、終了コードは失敗数を反映するだけに留める
[ "$fail_count" -eq 0 ]
