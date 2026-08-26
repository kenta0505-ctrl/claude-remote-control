# Claude 日次情報ストック

Claude / Claude Code / Claude Cowork の更新を**毎朝7時台(JST)に自動収集**し、
日本語ダイジェストとしてこのリポジトリに蓄積します。

## まずここを見る

👉 **[LATEST.md](LATEST.md)** — 今朝時点の最新ダイジェスト（常にここが最新）
👉 [INDEX.md](INDEX.md) — 過去のダイジェスト一覧

## 仕組み

```
毎朝 07:17 JST
   │
   ├─ ① fetch-sources.sh … 8つの一次ソースを curl でバイト単位取得 → sources/
   │
   ├─ ② diff-report.sh   … 前日コミットとの git 差分だけを抽出
   │                        （差分ゼロなら「更新なし」で終了）
   │
   ├─ ③ WebSearch        … curl できない領域（Cowork / 製品発表）を補完
   │
   ├─ ④ ダイジェスト生成 … 差分を3層（🔴🟡⚪）に整理して日本語化
   │
   └─ ⑤ commit & push    … digests/ + LATEST.md + sources/ を一緒に保存
```

**要点は「差分だけを読む」こと。** CHANGELOG だけで55万文字あるため、毎朝それを全部読ませると
遅く・高く・要約がブレます。前日のスナップショットを git に置き、差分行だけをダイジェスト化することで、
処理が安定し、「昨日と同じ話が今日も出る」ことがなくなります。

## ディレクトリ

| パス | 中身 |
|---|---|
| `LATEST.md` | 最新ダイジェスト（自動生成・直接編集しない） |
| `INDEX.md` | 全ダイジェストの索引（自動生成） |
| `digests/YYYY-MM-DD.md` | その日のダイジェスト本体（**日付は JST 基準**） |
| `sources/` | 一次ソースの生スナップショット（**翌日の差分基準。消さないこと**） |
| `sources/_fetch-status.tsv` | 直近の取得結果。`FAIL` があればソースのURLが変わった可能性 |
| `sources.tsv` | 収集対象の定義。**1行足せば収集対象が増えます** |
| `PLAYBOOK.md` | 毎朝のセッションが読んで実行する手順書 |
| `scripts/` | 収集・差分・確定の各スクリプト |

## 収集しているソース

| ソース | 何が分かるか |
|---|---|
| Claude Code CHANGELOG | Claude Code の全変更（一次情報・最重要） |
| Claude Code ドキュメント索引 | ページの増減 = **新機能の先行指標** |
| Claude Platform リリースノート | API / SDK / Console の変更 |
| Claude Platform ドキュメント索引 | 同上の先行指標 |
| モデル一覧・引退予定・料金 | モデル追加、価格改定、引退日 |
| npm `@anthropic-ai/claude-code` | 実際にインストールできる最新版 |

### 取得できないもの（意図的な制約）

このクラウド環境の egress プロキシは `www.anthropic.com` / `claude.com` / `support.claude.com` /
`status.anthropic.com` をブロックしています。そのため **Cowork の公式チェンジログ・Anthropic の製品発表・
ステータスページ**は curl では取れません。この領域は WebSearch で補完し、ダイジェスト上では
**「二次情報 / 未確認」と明示**します。断定しません。

## 手を入れるとき

- **収集対象を増やしたい** → `sources.tsv` に `名前<TAB>URL` を1行追加
- **ダイジェストの書き方を変えたい** → `PLAYBOOK.md` の手順4を編集
- **時刻を変えたい** → Routine（後述）の cron を変更
- **手動で今すぐ回したい** → `./scripts/fetch-sources.sh && ./scripts/diff-report.sh`

## スケジュール

Claude の Routine 機能で毎朝 **07:17 JST**（= 22:17 UTC）に新規セッションが起動し、
`PLAYBOOK.md` に従って収集・生成・push まで行います。
一覧・停止・時刻変更は Claude に「Routine を見せて」と頼めば操作できます。
完了時にスマホへプッシュ通知が飛びます（不要なら Claude に「日次収集の通知を切って」と言えば止まります）。

> **日付は JST 基準で統一しています。** 実行コンテナは UTC で動くため、素の `date` を使うと
> ファイル名が読み手のカレンダーより1日古くなります。スクリプトと PLAYBOOK は
> `TZ=Asia/Tokyo date +%F` を使うよう固定してあります。
