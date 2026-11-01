<!-- このファイルは scripts/finalize.sh が自動生成します。直接編集しないでください。 -->
<!-- 編集する場合は digests/2026-11-02.md を直してから finalize.sh を再実行してください。 -->

# 2026-11-02（月）Claude 更新ダイジェスト

## ① 今日の要点

**今日は更新なしです。**

機械で取得している8つのソースすべてが、**昨日とバイト単位で同一**でした。差分検出は `NO_CHANGES` を返しています。

- Claude Code は **2.1.316 のまま**（npm も CHANGELOG も昨日と同じ）
- Platform のリリースノートに**新規項目なし**
- 価格表・モデル一覧・モデル廃止一覧・ドキュメント目次（Platform / Claude Code 両方）**すべて変更なし**

**無理に埋めることはしません。** 以下は定点観測と、確認した範囲の記録です。

---

## ② ⚠️ 今の使い方が変わるもの

**今日はなし。** 新しい破壊的変更・価格改定・モデルの引退はありません。

**継続中のものだけ再掲します。日付が近いものから並べます。**

| 日付 | 内容 | 残り |
|---|---|---|
| 2026-11-24 | Claude Opus 4.5 の「これより前には停止しない」日 | 22日 |
| **2026-11-30** | **Claude Sonnet 4.5 が API から停止** | **28日** |
| **2026-11-30** | **Claude Opus 4.8 の Fast mode が削除**（削除後はエラー。標準速度にフォールバックしません） | **28日** |
| **2026-12-14** | **単独版 Claude Design が閉鎖** | **42日** |

**日付のないもの**

- **API バージョン `2026-10-21`** では `temperature`・`top_p`・`top_k` が**全モデルで使えなくなります**（既定値を送っても 400 エラー）。各 SDK のメジャーバージョンが上がり、**ライセンスが MIT から Apache 2.0 に変わりました**
- **「Ultra」プラン**が10月31日にドキュメントに現れました（**月額 API クレジット $200**、Max は $100）。**開始日と Max との関係は、依然として一次情報に書かれていません**
- **Claude Models on Google Cloud** が **Anthropic managed** と **Google managed** の2つに分かれ、**モデルの引退日の扱いが両者で違います**
- **組織の管理者が、組織全体で web fetch をオフにできます**（Claude Console の Capabilities ページ）
- **Claude Code 2.1.316（昨日報告分）**: **Team と Enterprise で、組織の設定が承認の確認なしに適用される**ようになりました。**`ultrathink` は xhigh で実行され、`CLAUDE_CODE_DISABLE_ULTRATHINK` でオフにできます**

**原さんの使用モデルは Claude Opus 5 で、claude.ai とアプリ経由なので、いずれも直接の影響はありません。**

---

## ③ 今日の変更（説明つき）

**今日は該当なし。** 説明する変更がありません。

---

## ④ 一行で流すもの

**今日は該当なし。** 一行で流す項目もゼロです。

---

## ⑤ 📊 定点観測

| 項目 | 今日 | 前日 |
|---|---|---|
| Claude Code（npm） | **2.1.316** | 2.1.316 |
| CHANGELOG 最新 | **2.1.316** | 2.1.316 |
| npm と CHANGELOG | **一致** | 一致 |
| CHANGELOG の新規項目 | **0** | 55 |
| Platform リリースノートの新規項目 | **0** | 0 |
| Platform リリースノートの先頭の日付 | **10月30日**（変化なし） | 10月30日 |
| Platform ドキュメントのページ数 | **845**（変化なし） | 845 |
| 変更のあったソース | **0 / 8** | 3 / 8 |
| ソース取得 | **8 / 8 成功** | 8 / 8 成功 |

**取得サイズ（すべて昨日と同一）**

| ソース | バイト数 |
|---|---|
| Claude Code CHANGELOG | 1,130,515 |
| Claude Code ドキュメント目次 | 63,679 |
| Platform リリースノート | 136,068 |
| Platform ドキュメント目次 | 93,771 |
| モデル概要 | 22,852 |
| モデル廃止一覧 | 14,620 |
| 価格表 | 53,451 |
| npm のバージョン情報 | 371 |

**8つすべてが前日と一致しました。** 取得自体はすべて成功しているので、**取得に失敗して「変化なし」に見えているのではなく、本当に変化がありません。**

モデルの状態: **変更なし。** 価格も変更なし。

| モデル | 状態 | 停止日 | 入力 / 出力（1Mトークンあたり） |
|---|---|---|---|
| claude-fable-5-1 / claude-mythos-5-1 | 現行 | 2027-09-01 以降 | $10 / $50 |
| claude-fable-5 / claude-mythos-5 | 現行 | 2027-06-09 以降 | $10 / $50 |
| claude-mythos-preview | 廃止予告 | 未定 | — |
| claude-opus-5-5 | 現行 | 2027-09-22 以降 | $4 / $20 |
| **claude-opus-5**（原さんの使用モデル） | **現行** | 2027-07-24 以降 | **$5 / $25** |
| **claude-opus-4-8** | 現行（**Fast mode は 2026-11-30 に削除**） | 2027-05-28 以降 | $5 / $25 |
| claude-opus-4-7 | 現行（Fast mode は削除済み） | 2027-04-16 以降 | $5 / $25 |
| claude-opus-4-6 | 現行（Fast mode は削除済み） | 2027-02-05 以降 | $5 / $25 |
| claude-opus-4-5-20251101 | 現行 | 2026-11-24 以降 | $5 / $25 |
| claude-sonnet-5-5 | 現行 | 2027-09-28 以降 | $2 / $10 |
| claude-sonnet-5 | 現行 | 2027-06-30 以降 | $2 / $10 |
| claude-sonnet-4-6 | 現行 | 2027-02-17 以降 | $3 / $15 |
| claude-sonnet-4-5-20250929 | 廃止予告 | **2026-11-30** | $3 / $15 |
| claude-haiku-5-5 | 現行 | 2027-10-07 以降 | $0.10 / $0.50（10万トークン超は $0.50 / $2.50） |
| claude-haiku-4-5-20251001 | 現行 | 2026-10-15 以降（過ぎました） | $1 / $5 |
| claude-opus-4-1 / 4, claude-sonnet-4, claude-3-7-sonnet, claude-3-5-haiku, claude-3-haiku | 停止済み | — | — |

**Claude Haiku 4.5 について**: 期限（10月15日）を過ぎて18日目です。**廃止予告は今日時点でも出ていません。**

**Claude Opus 4.8 の Fast mode について**: **価格表の Fast mode の節は、今日時点でも変わっていません**（53,451バイト、昨日と同一）。**11月30日の削除に向けて更新されるかを、引き続き見ていきます。**

---

## ⑥ 🔗 出典

取得できた一次情報（**8/8 成功。すべて変更なし**）

- Claude Code CHANGELOG — 変更なし（2.1.316 が最新のまま）
- npm `@anthropic-ai/claude-code` 最新版情報 — 変更なし（2.1.316）
- Claude Platform リリースノート — 変更なし
- Claude Platform ドキュメント目次 — 変更なし
- Claude Code ドキュメント目次 — 変更なし
- モデル概要（`models-overview.md`）— 変更なし
- モデル廃止一覧（`model-deprecations.md`）— 変更なし
- 価格表（`pricing.md`）— 変更なし

補足（未確認・二次情報）

WebSearch で1件検索しました（Anthropic の11月1日の発表）。**新しい一次情報は得られませんでした。**（このクラウド環境から anthropic.com / claude.com への接続はブロックされています。）

- **11月1日付の発表は見つかりませんでした。** 検索結果の大半は2025年5月の Claude Opus 4 と Sonnet 4 の発表で、**今回の問いには古すぎるもの**でした
- **2026年春の項目として挙がったもの**（いずれも**未確認**）: 「**Claude Opus 4.7 が、より強いコーディングと視覚の能力を備えて公開された。4月7日に Project Glasswing 経由で Claude Mythos Preview が導入された9日後だった**」「**Claude Code の『Dynamic Workflows』が、大規模な作業の間に複数の AI サブエージェントを連携させるリサーチプレビュー機能として説明されている**」。**日付が示されていない記事も混ざっています**

過去数日から持ち越しの未確認分（Claude Cowork のクラウド実行への移行と「Only on your computer」設定の削除、Ultra プランがいつ始まったか・Max の $200 の段との関係、Dreams の現在のサポート対象モデル、Claude for Government、Claude Frontier Academy の1億ドル、Claude Dashboards と Claude Motion の beta、Docs / Slides / Design の beta 終了と全プラン提供、Claude for Google Workspace、Project Glasswing の 129,000件、利用規約の更新、量子回路の研究、NIST 暗号のシード値の件、中間選挙への対応、Genesis Mission の1億5,000万ドル、Anthropic Public Benefit Fund、サソリの神経毒の研究、Claude が Anthropic のモデル研究開発の26%を主導、ART 酵素の先行性をめぐる争い、Claude Code projects のベータ、Claude for Small Business、Claude for Financial Advisors、Claude Design の移行の詳細、user profiles の料金とベータヘッダの詳細、第3四半期の決算と IPO の時期、Claude Tag の6月の立ち上げの詳細、Morning Brief の提供範囲、広告を入れない方針、プラグインのデモ用マーケットプレイスの扱い）は、今日も一次ソースに現れていません。**引き続き未確認**です。

---

## 運用メモ

**差分ゼロの日なので、`sources/` の中身は昨日から変わっていません。** ダイジェストのファイルと `INDEX.md` / `LATEST.md` だけがコミットされます。

---

過去のダイジェスト一覧は [INDEX.md](INDEX.md) を参照してください。
