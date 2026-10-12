<!-- このファイルは scripts/finalize.sh が自動生成します。直接編集しないでください。 -->
<!-- 編集する場合は digests/2026-10-13.md を直してから finalize.sh を再実行してください。 -->

# 2026-10-13（火）Claude 更新ダイジェスト

## ① 今日の要点

- **変更があったのは8ソースのうち1つだけ**です。ごく小さい日です。
- Claude Platform のドキュメントに、**ドキュメント自身を検索・閲覧できる MCP サーバー**が用意されました。
- Claude Code のバージョンは **2.1.296 のまま**、CHANGELOG にも差分なしです（3日連続）。
- 価格表・モデル一覧には変更がありません。

---

## ② ⚠️ 今の使い方が変わるもの

今日はなし。価格の変更・モデルの廃止予告・既存の使い方が壊れる変更はありません。

継続中のものを2つ、再掲します。

- **Claude Sonnet 4.5 が 2026年11月30日に API から停止**します。原さんの使用モデルは Claude Opus 5 なので直接の影響はありません。
- **Claude Haiku 4.5 の停止日が「2026年10月15日以降」** です。明後日になります。**廃止予告（deprecation）はまだ出ていません。** この日付は「これより早くは停止しない」という約束の期限で、実際の停止には別途予告が出る形です。

---

## ③ 今日の変更（説明つき）

### Claude Platform のドキュメントに、MCP サーバーが用意されました

Platform ドキュメントの目次に、以下の案内が追加されました。

> MCP クライアントを `https://platform.claude.com/docs/mcp`（Streamable HTTP 方式）に接続すると、これらのドキュメントを検索・閲覧できます。サーバーカードは `https://platform.claude.com/docs/mcp/server-card` にあります。

**何ができるようになったのか**: Claude（やその他の MCP 対応アプリ）が、**Claude Platform のドキュメントと API リファレンスを、コネクタとして直接検索・読み取り**できるようになりました。

サーバーカード（接続情報が書かれた定義ファイル）の中身を取得して確認しました。実際の内容は以下です。

| 項目 | 値 |
|---|---|
| 名前 | `com.claude.platform/docs` |
| 表示名 | Claude Platform Docs |
| 説明 | Search and read the Claude documentation and API reference.（Claude のドキュメントと API リファレンスを検索・閲覧する） |
| バージョン | 1.0.0 |
| 接続方式 | streamable-http |
| 接続先 | `https://platform.claude.com/docs/mcp` |
| 対応プロトコル | 2025-11-25 / 2025-06-18 / 2025-03-26 / 2024-11-05 / 2024-10-07 |

対応プロトコルの一覧に、**10月8日と9日に既定になったと報告した `2026-07-28` は含まれていません。** 一覧されているのは 2025-11-25 以前のバージョンだけです。これが意味するところ（新しい既定で繋がるのか）は、今日の資料には書かれていません。

ドキュメントのページ数は変わっていません。**追加されたのは、この案内文と2つの URL だけ**です。

---

## ④ 一行で流すもの

**変更があったもの**
- Claude Platform ドキュメント目次に「MCP server」の節が追加（上記）。URL 2つの追加（`docs/mcp`、`docs/mcp/server-card`）。ページ数は変わらず

**変更がなかったもの（7ソース）**
- Claude Code の CHANGELOG（2.1.296 のまま、3日連続で差分なし）
- Claude Code のドキュメント目次
- Claude Platform リリースノート
- モデル概要（`models-overview.md`）
- モデル廃止一覧（`model-deprecations.md`）
- 価格表（`pricing.md`）
- npm `@anthropic-ai/claude-code` 最新版情報

---

## ⑤ 📊 定点観測

| 項目 | 今日 | 前日 |
|---|---|---|
| Claude Code（npm） | 2.1.296 | 2.1.296 |
| CHANGELOG 最新 | 2.1.296 | 2.1.296 |
| CHANGELOG の新規項目 | 0 | 0 |
| Platform リリースノートの新規項目 | 0 | 0 |
| 変更のあったソース | **1 / 8** | 0 / 8 |

モデルの状態: **変更なし**です。

| モデル | 状態 | 停止日 |
|---|---|---|
| claude-fable-5-1 / claude-mythos-5-1 | 現行 | 2027-09-01 以降 |
| claude-fable-5 / claude-mythos-5 | 現行 | 2027-06-09 以降 |
| claude-mythos-preview | 廃止予告 | 未定 |
| claude-opus-5-5 | 現行 | 2027-09-22 以降 |
| **claude-opus-5**（原さんの使用モデル） | **現行** | 2027-07-24 以降 |
| claude-opus-4-8 | 現行 | 2027-05-28 以降 |
| claude-opus-4-7 | 現行 | 2027-04-16 以降 |
| claude-opus-4-6 | 現行 | 2027-02-05 以降 |
| claude-opus-4-5-20251101 | 現行 | 2026-11-24 以降 |
| claude-sonnet-5-5 | 現行 | 2027-09-28 以降 |
| claude-sonnet-5 | 現行 | 2027-06-30 以降 |
| claude-sonnet-4-6 | 現行 | 2027-02-17 以降 |
| claude-sonnet-4-5-20250929 | 廃止予告 | **2026-11-30** |
| claude-haiku-5-5 | 現行 | 2027-10-07 以降 |
| claude-haiku-4-5-20251001 | 現行 | **2026-10-15 以降**（明後日） |
| claude-opus-4-1 / 4, claude-sonnet-4, claude-3-7-sonnet, claude-3-5-haiku, claude-3-haiku | 停止済み | — |

価格表（`pricing.md`）も変更なしです。

---

## ⑥ 🔗 出典

取得できた一次情報

- Claude Platform ドキュメント目次（「MCP server」の節の追加）
- Claude Platform の MCP サーバーカード（`platform.claude.com/docs/mcp/server-card`）— ③の表はこのファイルの中身からの引用です
- Claude Code CHANGELOG — 差分なし
- Claude Code ドキュメント目次 — 差分なし
- Claude Platform リリースノート — 差分なし
- モデル概要・モデル廃止一覧・価格表 — すべて差分なし
- npm `@anthropic-ai/claude-code` 最新版情報 — 差分なし

補足（未確認・二次情報）

Web検索では **10月12日付の新しい発表は見つかりませんでした。** ただし、これまで出ていなかった項目がいくつか挙がったので、間引かずに並べます。**すべて未確認**です（このクラウド環境から anthropic.com / claude.com への接続はブロックされています）。

- **Claude Dashboards と Claude Motion が beta に**、**Docs / Slides / Design が beta を終了し、Free を含む全プランで利用可能に**（10月7〜8日頃）という記述。Docs / Slides / Design については、10月5日から「未確認」として挙げ続けてきた項目に、**beta 終了と全プラン提供という具体的な情報が付いた**形です
- **Google Workspace 向けのアドオンと、Google ドキュメント・スプレッドシート・スライドのコネクタ**が beta で提供開始（10月7日）という記述
- **Claude が Anthropic のモデル研究開発の 26% を主導している**と Anthropic が述べた（9月17日）という記述
- **「Claude 主導」の発見（ART 酵素）について、コペンハーゲン大学のチームが「2022年から同じ酵素を研究していた」として先行性を主張**している、という記述。10月8日に未確認として挙げた「Claude 主導の生物学的発見」に対する反論です。**どちらの主張も一次情報では確認できていません**

過去数日から持ち越しの未確認分（Claude for Government、Claude Frontier Academy、Project Glasswing の 129,000件、利用規約の更新、Genesis Mission、Claude Code projects のベータ、Claude for Small Business、Claude for Financial Advisors）は、今日も一次ソースに現れていません。**引き続き未確認**です。

---

## 運用メモ

リポジトリは `4d3030c`（10/12 分）まで送信済みです。今日の分もこのあと push します。

---

過去のダイジェスト一覧は [INDEX.md](INDEX.md) を参照してください。
