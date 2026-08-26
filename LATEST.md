<!-- このファイルは scripts/finalize.sh が自動生成します。直接編集しないでください。 -->
<!-- 編集する場合は digests/2026-08-26.md を直してから finalize.sh を再実行してください。 -->

# Claude 日次ダイジェスト — 2026-08-26 (水)

> **初回収集。** 今回は差分の基準が無いため、直近24時間ぶんを手動で拾っています。
> 明日以降は前日スナップショットとの差分だけが自動で出ます。

---

## 🔴 今日必ず知るべき

**Claude Code 2.1.247 が出ました（CHANGELOG 反映済み / npm は未公開）**
CHANGELOG は `2.1.247` ですが、npm の `@anthropic-ai/claude-code` はまだ `2.1.246` です。
`claude update` が空振りしても数時間待てば入ります。**焦って手動インストールしないこと。**

**Zed ユーザー: `/terminal-setup` がキーマップを全消しするバグが直りました**
2.1.246 以前の `/terminal-setup` は Zed の `keymap.json` を**丸ごと上書き**していました。
自作キーバインドがある人は、実行前に必ず 2.1.247 に上げてください。既に消えている場合は git 履歴から復旧を。

**dotfiles 管理者: `~/.claude/settings.json` のシンボリックリンクが消えるバグが直りました**
nix/home-manager や stow で `settings.json` をシンボリックリンク管理していると、
Bash サンドボックスの後始末がリンクを削除することがありました。心当たりがあれば要更新。

**Sonnet 5 の自動コンパクト位置が変わりました**
1M コンテキストのセッションで、自動コンパクトが約 934K → **約 967K トークン**に後ろ倒し。
長いセッションで「いつ要約が挟まるか」の体感が変わります。壊れる変更ではありませんが、挙動が動きます。

---

## 🟡 知っておくと良い

- **`SendFeedback` ツールが追加**。セッション中に不具合が起きたとき、Claude 自身がフィードバック文面を下書きし、
  `/feedback` から確認・送信できます。不要なら `feedbackDrafts` 設定でオフに。
- **`/claude-api cost-optimize` が追加**。既存プロジェクトの Claude API 料金を分析し、キャッシュ・トークン量・バッチ・
  effort・モデル選択といったコスト要因を1つずつ測りながら潰していくスキルです。API 課金を使っているなら効きます。
- **サブエージェントがモデル 404 で即死しなくなった**。フォールバックのモデル連鎖を使うようになり、
  親に返るエラーにも型・ステータス・request id・モデル名が入るようになりました。
- **Bash の権限プロンプトから auto モードへ1キーで移行**できるようになりました（"Yes, and switch to auto mode"）。
- **セッション間メッセージが既定で1行に畳まれる**ように。全文は `Ctrl+O` で展開します。
- **巨大なエラー出力でセッションが詰まる問題が解消**。フックやバックグラウンドエージェントが数MBのエラーを吐いても
  "Prompt is too long" でセッションごと固まらなくなりました。
- **Compliance API が Cowork と Claude Code のセッションについて正式版に**（beta 卒業）。
  Enterprise 管理者向け。Claude Science と Microsoft 365 連携ぶんのトランスクリプトも beta で取れるようになりました。
- **Admin API が各種 SDK から使えるように**。`ant` CLI と Python/TypeScript/C#/Go/Java/PHP/Ruby の
  `client.beta.organization` 配下。組織情報・メンバー・招待・ワークスペース・APIキー・レート制限などが対象です。

---

## ⚪ 参考

2.1.247 のバグ修正・内部改善は上記以外に **約25件**（キーボードレイアウト、マウスレポート混入、`/rename`、
`/compact`、プラグインマーケットプレイスの堅牢化、Remote Control、セルフホストランナー、クラウドセッションの復帰など）。
全文は [`sources/claude-code-changelog.md`](sources/claude-code-changelog.md) の `## 2.1.247` を参照。

**Cowork 関連（二次情報 / 未確認）**
Cowork の公式チェンジログ（`claude.com/docs/cowork/changelog`）は、この収集環境の egress プロキシで
ブロックされているため直接取得できません。検索経由では「メモリ機能がチャットと Cowork の両方に対応」
「Claude Desktop v1.37937.1 が CLI 2.1.246 を同梱」といった情報が見えていますが、**一次情報で未確認**です。
確実な確認が要る場合は手元のブラウザで公式ページを開いてください。

---

## 📊 定点観測

| 項目 | 現在値 | 出典 |
|---|---|---|
| Claude Code (CHANGELOG) | **2.1.247** | `sources/claude-code-changelog.md` |
| Claude Code (npm 公開) | 2.1.246 *(反映待ち)* | `sources/npm-claude-code-latest.json` |
| 最上位モデル | Claude Fable 5 (`claude-fable-5`) $10 / $50 per MTok | `sources/models-overview.md` |
| 主力モデル | Claude Opus 5 (`claude-opus-5`) $5 / $25 per MTok | `sources/models-overview.md` |
| Sonnet 5 | `claude-sonnet-5` $2 / $10 per MTok（値上げ中止が確定済み） | `sources/pricing.md` |
| 収集ソース | 8件中 8件 取得成功 | `sources/_fetch-status.tsv` |

---

## 🔗 出典

- [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Claude Platform リリースノート](https://platform.claude.com/docs/en/release-notes/overview)
- [モデル一覧](https://platform.claude.com/docs/en/models/overview)
- [料金](https://platform.claude.com/docs/en/about-claude/pricing)

---

過去のダイジェスト一覧は [INDEX.md](INDEX.md) を参照してください。
