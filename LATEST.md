<!-- このファイルは scripts/finalize.sh が自動生成します。直接編集しないでください。 -->
<!-- 編集する場合は digests/2026-10-16.md を直してから finalize.sh を再実行してください。 -->

# 2026-10-16（金）Claude 更新ダイジェスト

## ① 今日の要点

- **Fast mode（高速モード）が、Claude Opus 5.5 で研究プレビューを終えました。** 申請が不要になり、ベータヘッダも不要になり、全ての利用段階に既定のレート上限が付きました。
- Claude Code は **2.1.301**（前日 2.1.300）。報告対象 45件の小さめの日。
- **Code Review のドキュメントが6ページ新設**され、目次の区分も作り直されました。
- **Compliance API が、各メンバーが claude.ai に保存した「Claude への指示」を取得できる**ようになりました（beta）。
- **Claude Haiku 4.5 の廃止予告は、今日時点でも出ていません。**

---

## ② ⚠️ 今の使い方が変わるもの

### 1. Fast mode が Claude Opus 5.5 で研究プレビューを終えました

**Fast mode（高速モード）** は、出力が大幅に速くなる代わりに割増料金がかかる仕組みです。その提供状況が変わりました。

| | 旧 | 新 |
|---|---|---|
| アクセス申請 | 必要 | **不要** |
| ベータヘッダ `fast-mode-2026-02-01` | 必要 | **不要**（送っても動きます） |
| レート上限 | — | **全ての利用段階に既定の上限が付きました** |

**対象は Claude Opus 5.5 だけ**です。**Claude Opus 5 と Claude Opus 4.8 の Fast mode は、引き続き研究プレビュー**で、これらのモデルには**ベータヘッダを送り続ける必要があります**。

**提供経路も広がりました。** Claude Opus 5.5 の Fast mode が、**Azure でホストされる Claude in Microsoft Foundry** でも使えるようになりました。

価格表の記述も合わせて書き換わっています。

- 旧: 「Fast mode は**研究プレビュー**で、Opus 5.5 / Opus 5 / Opus 4.8 に対し割増料金で大幅に速い出力を提供。**Claude API（純正）でのみ利用可能**で、Claude Platform on AWS やパートナー運営のクラウドでは使えない」
- 新: 「Fast mode は Opus 5.5 / Opus 5 / Opus 4.8 に対し割増料金で大幅に速い出力を提供。**Opus 5 と Opus 4.8 の Fast mode は研究プレビュー**。Claude API（純正）と、**Opus 5.5 については Azure でホストされる Claude in Microsoft Foundry** で利用可能。Claude Platform on AWS やパートナー運営のクラウドでは使えない」

**原さんへの関係**: 原さんの使用モデルは Claude Opus 5 です。**Opus 5 の Fast mode は引き続き研究プレビューのまま**で、今日の変更の対象ではありません。

あわせて、価格表から1つ説明文が消えています。

- 旧: 「Fast mode は Claude Opus 4.7 では使えず（`speed: "fast"` を付けるとエラー）、**Claude Opus 4.6 では標準速度で実行され標準料金で請求される**」
- 新: 「Fast mode は Claude Opus 4.7 では使えず（`speed: "fast"` を付けるとエラー）、**Claude Opus 4.6 でも使えない**」

**Opus 4.6 で `speed: "fast"` を付けたときにどうなるかの説明が消えました。** 挙動が変わったのか、説明が整理されただけなのかは、今日の資料からは分かりません。

### 2. Compliance API が、各メンバーの「Claude への指示」を取得できるようになりました（beta）

**Compliance API**（組織のデータを取得・削除するための管理 API）が、**組織の各メンバーが保存した自由記述の指示文**を返すようになりました。

対象は2つです。

- claude.ai の **「Instructions for Claude」**（Claude への指示）
- Cowork の **「Global instructions」**（全体の指示）

取得方法: `GET /v1/compliance/organizations/{org_uuid}/user_preferences` を、既存の Compliance Access Key と **`read:compliance_user_data` のスコープ**で呼びます。Claude Enterprise 組織向けの beta です。

**個人が自分用に書いた指示文が、組織の管理者から取得できるようになった**という性質の変更です。原さんは個人利用なので該当しませんが、内容として記録しておきます。

### 3. 無人の再試行モードに、待ちすぎを止める上限が付きました

**`CLAUDE_CODE_RETRY_WATCHDOG_MAX_USAGE_LIMIT_WAIT_MS`** が追加されました。

無人の再試行モード（`CLAUDE_CODE_RETRY_WATCHDOG`）が、**使用上限の回復が遠すぎる場合に、待たずにリクエストを終了する**ようになります。以前は待ち続けていました。

（継続中のものを再掲します。**Claude Sonnet 4.5 が 2026年11月30日に API から停止**します。原さんの使用モデルは Claude Opus 5 なので直接の影響はありません。）

---

## ③ 今日の変更（説明つき）

### Code Review のドキュメントが6ページ新設され、目次が作り直されました

これまで Code Review の説明は1ページだけでしたが、**6ページ追加されて計7ページ構成**になりました。

| ページ | 内容（目次の説明文より） |
|---|---|
| **Code Review**（既存、説明文が書き換え） | GitHub のプルリクエストのバグを捕まえる。Claude が各変更をレビューし、所見を検証し、インラインでコメントする。**Team と Enterprise プラン向け** |
| **Set up Code Review**（新規） | 組織で Code Review を有効にする。GitHub を接続し、Claude GitHub App を入れ、リポジトリを選び、レビューを走らせるタイミングを決める |
| **Customize Code Review**（新規） | `REVIEW.md` と `CLAUDE.md` で、何を指摘するかを調整する。重大度の再調整、パスの除外、検査の追加、どの設定が適用されているかの確認 |
| **Read and request reviews on a pull request**（新規） | 所見の読み方、対応・却下の仕方、`@claude review` でのレビュー依頼 |
| **Code Review costs and usage**（新規） | 組織の支出の見積もりと上限設定。使用枠を通じた課金の仕組み、費用を決める要因、使用量の確認場所 |
| **Troubleshoot Code Review**（新規） | 始まらなかった・失敗した・予算で飛ばされたレビューの直し方、欠けた所見の探し方、設定と `REVIEW.md` の問題の解決 |
| **Review locally with /code-review**（新規） | Claude Code のセッションで `/code-review` を実行して、ブランチの変更のバグを探す。プルリクエストやパスを指定し、Claude に修正を適用させる |

既存の Code Review ページの説明文も書き換わりました。

- 旧: 「コードベース全体の多エージェント解析で、論理エラー・セキュリティの脆弱性・退行を捕まえる自動 PR レビューを設定する」
- 新: 「GitHub のプルリクエストのバグを捕まえる。Claude が各変更をレビューし、**所見を検証し**、インラインでコメントする。**Team と Enterprise プラン向け**」

**「Team と Enterprise プラン向け」という条件が、説明文に明記されるようになりました。**

目次の区分も作り直されています。

- 「Code review & CI/CD」という区分が、**「Code review and pull requests」**に改名
- その下に **「Code Review」**（上記7ページ）、**「Security scans」**、**「Run Claude in your own CI」** の3つの小区分ができました
- **GitHub Enterprise Server のページ**が、この区分に入りました（自己ホストの GitHub Enterprise Server にクラウドセッション・Code Review・プラグインマーケットプレイスを接続する内容）

### 小さいモデルに切り替えるときの、要約の扱いが2件

**コンテキストウィンドウ（一度に扱える文章量の上限）が小さいモデルに切り替える**ときの挙動です。

**改善**: 新しいモデルには長すぎる会話が、**切り替える前のモデルで先に要約される**ようになりました。

**修正**: その要約で、**切り替え前のモデルが使用枠を消費することが、確認なしに起きていた**のが直りました。

つまり「要約は前のモデルで行う」という仕組みが整えられ、同時に「黙って課金される」部分が塞がれた、という組み合わせです。

### LLM ゲートウェイ経由で、会話が延々と圧縮され続ける不具合

**LLM ゲートウェイ（API 呼び出しを中継する仕組み）が、要求されたのとは別のモデル名を応答に書いてくる**場合に、**会話が何度も何度も圧縮され、しかも自分が選んでいないモデルで動いていた**のが直りました。

「選んだモデルと違うモデルで動いていた」という部分が重い種類の不具合です。

### Read ツールが、バイナリファイルをテキストとして読んでいた

**`.xlsm`（マクロ付き Excel）・`.parquet`・`.epub`・`.heic`** といったバイナリ形式のファイルを、Read ツールが**テキストとして読んでいた**のが直りました。

10月9日に「Read ツールのバイナリファイル向けのメッセージを改善（その形式を読めるスキルやシェルコマンドを示す）」とお伝えしましたが、**そもそもバイナリと判定できていなかった形式があった**ということになります。

### worktree が、確認なしに削除されていた

**`WorktreeCreate` フックが作った worktree**（作業用の別フォルダ）が、**push していないコミットを含んでいる可能性があるのに、終了時に確認なしで削除されていた**のが直りました。

### Fast mode が Claude Platform on AWS でも Managed Agents の予定配備に対応

Claude Managed Agents の **scheduled deployments（予定された配備）** が、**Claude Platform on AWS** でも使えるようになりました（Platform リリースノートの既存項目への追記です）。

---

## ④ 一行で流すもの

Claude Code 2.1.301 の残りです。判断は原さんに委ねます。

### 計測（OpenTelemetry）

- `tool_decision` イベントに **`classifier_verdict` と `permission_mode`** を追加（auto モードの分類器の判定と、許可ルールによる判定を区別できる）
- `tool_decision` イベントに **`classifier_category`** を追加（分類器のブロックが一致した内蔵ルールの名前。`OTEL_LOG_TOOL_DETAILS=1` のとき）
- `claude-api` スキルに OpenTelemetry のトレースの手引きを追加（`ant` CLI でのトレース送信先の設定を含む）

### モデル・ログイン

- `fable`（および `best`）のモデル別名が、最新の Fable モデルが組織で使えない場合に Anthropic API でエラーになっていたのを修正（**1つ前の Fable モデルで1回再試行する**）
- モデル名に `application-inference-profile` を含むモデルに切り替えると、プロバイダが Bedrock でないのに `awsAuthRefresh` コマンドが実行され、モデル切り替えのフックが遅れていたのを修正
- **ディスクが満杯でログインの更新ができないとき**、紛らわしい「Please run /login」エラーが出ていたのを修正（今はディスクを名指しして、ファイルを削除するよう伝える）
- `claude auth status` や `claude plugin list` のような短いコマンドが、トークン更新の最中に終了すると、サインインの更新がタイムアウトし予期しないサインアウトが起きていたのを修正

### ツール・ファイル

- Grep と Glob が、検索プログラムが結果を返す前に予期せず失敗したときに「一致なし」と報告していたのを修正（今は検索の失敗を伝えるエラーを返す）
- スキルとコマンドが、引数名が非常に多い・非常に長い場合に、呼び出し時に数秒止まっていたのを修正（**最初の64個の名前、各64文字まで**が埋められる）
- スキル・コマンド・フックが、引数が多数のプレースホルダを埋めるときに非常に大量のメモリを使っていたのを修正
- ワークフローのスクリプトが、同じセッションで Bash の `cd` を行った後に、読み取り・編集・再実行で許可を求める・拒否されるのを修正
- アーティファクトの更新が、`PreToolUse` フックが Edit や Write を覆っていると拒否されていたのを修正（今は Claude がファイルを編集してから再公開する。公開の呼び出しの中で変更しない）
- ワークフローのエージェントが、「自分のタスク文には利用者の権限が無い」という内部の注記を読んだ後に、自分の工程を飛ばすことがあり、それでも実行が成功と報告されていたのを修正

### 許可・権限

- ターンの途中で送られたメッセージによって、許可の確認中にツール呼び出しが打ち切られたとき、**「利用者が拒否した」としてモデルに報告されていた**のを修正
- プラグインやスキルのフックの `ask` 判定による許可プロンプトが、**どのプラグイン・スキル由来のフックなのかを表示していなかった**のを修正

### 画面・入力

- vim モードに **`%` の移動**を追加（対応する括弧へ飛ぶ。単独でも d/c/y と組み合わせても使える）
- vim モードが、遅い・混んでいるマシンで Escape の後も INSERT に留まることがあったのを修正
- vim モードで、Esc が入力した AskUserQuestion の回答を破棄していたのを修正（自由記述欄が vim の NORMAL モードに対応し、**Esc は NORMAL からのみ取り消す**）
- Mod の `Input` に **`rows`** を追加（ターミナル上の複数行のテキスト欄。Enter で送信、Shift+Enter または Enter 前のバックスラッシュで改行）
- ヘッダー行だけの Markdown の表が、ターミナルに対して広すぎると何も描かれなかったのを修正（計画承認カードの計画の中も含む）
- **MATE Terminal on RHEL 8** のような VTE 0.53 より古いターミナルで、フォルダの信頼確認に `>0q` のような余計な文字が重なり、終了時にシェルのプロンプトの前に `>4m` が出ていたのを修正
- 一部のバージョンの **iTerm2** で、起動時に入力欄に余計な `GOK` というテキストが出ていたのを修正
- 薄いテキストの表示を修正（ダークの ANSI テーマと16色ターミナルで、塗られた枠の中では薄く、選択や検索の強調の下では薄くせず、一覧の説明文は他の副次的テキストと同じ薄さに）
- **`/rewind` を使った後、スキルがモデルに列挙されなくなっていた**のを修正
- 再開したセッションの圧縮の行が、読み込まれていない履歴に対して ctrl+o を提示していたのを修正（今は以前のメッセージの保存場所を伝え、全画面でも表示される）
- 「new task? /clear to save tokens」のヒントが、応答を中断した直後に戻ってきていたのを修正
- `/diff` が、git の確認の一つがタイムアウト・失敗した場合に、reftable 形式のリポジトリの衝突した cherry-pick / revert に気づいていなかったのを修正
- 全画面モード: `/compact` と自動圧縮が、見えている記録を再構築する間、画面を一瞬固めていたのを修正
- 長時間動くサブエージェントの作業中の描画性能を改善（進捗の履歴が、毎回の描画で全部作り直されず、差分だけ更新される）
- Windows: 停止したバックグラウンドの PowerShell コマンドの出力ファイルに、終わりを示す `[killed]` の行が欠けていたのを修正

### Mods

- Mod のフックの `.catch` ハンドラが、**そのフックが例外を投げたときとタイムアウトしたときだけ走る**よう変更。**そのフック自身の呼び出しの下で発生したイベントは、そのフックを飛ばし、`.catch` に尋ねない**ようになりました
- Mod の `$.env.set` が、変数が設定・解除されたら `{}` で、書き込みが行われなかったら理由を伴う `{ deny }` で解決するよう変更
- Mod の `$.model.fork` が、新しい Claude Code プロセスの最初の応答が終わる前に呼ばれると `nothing-to-fork` を返していたのを修正（`claude -p` の実行やクラウドセッションで起きていました）
- Mods を改善: VS Code・デスクトップアプリ・モバイルアプリで、**質問ダイアログの上に描かれるツリーが Markdown と最大48行**を保持できるように（ターミナルは12行の平文のまま）

### アーティファクト

- Claude が書くページが、**追従するヘッダー（sticky header）の上に帯を描く**ようになりました。モバイルアプリで、スクロールしたテキストがそこに見えてしまうのを防ぎます

### 自己ホストランナー

- Slack から始めたセッションが、管理設定が MCP サーバーを制限しているとリポジトリを見つけられず・添付できなかったのを修正（それらのツールをオフにするには `deniedMcpServers` を使う）
- 無関係なセットアップやセッションの失敗が、git の「参照が見つからない」という文面を引用した場合に、セッションが「元ブランチが削除された」と報告され、再試行されなかったのを修正
- 終了しようとしているセッションについて、失敗した・拒否されたセッション解放の再試行をログが約束していたのを修正（繰り返しの失敗は回数が表示される）

### ドキュメント（その他）

- `/claude-api` スキルが、CMEK（顧客管理の暗号鍵）の外部鍵エンドポイントが Claude Platform on AWS で使えないと言っていたのを修正
- Platform ドキュメントに3ページ新設: `about-claude/api-credits-for-subscribers`（10月7日の「Max と Team プランの月次 API クレジット」の詳細ページ）、`agents-and-tools/tool-use/browser-use-sdk`（10月7日の browser/computer use SDK の詳細ページ）、`managed-agents/choosing-an-environment`
- Compliance API のコード用アーティファクトのドキュメントの URL が、`api/compliance/code/...` から **`api/compliance/apps/code/...`** に移動しました。あわせて **`download`** のページが追加されています（以前は delete / list / retrieve_version のみ）

---

## ⑤ 📊 定点観測

| 項目 | 今日 | 前日 |
|---|---|---|
| Claude Code（npm） | 2.1.301 | 2.1.300 |
| CHANGELOG 最新 | 2.1.301 | 2.1.300 |
| CHANGELOG の新規項目 | 51 | 278 |
| うち報告対象 | **45**（VSCode 6件を除く） | 261 |
| Platform リリースノートの新規項目 | 3（+ 既存1件への追記） | 1 |
| 変更のあったソース | 6 / 8 | 5 / 8 |

モデルの状態: `model-deprecations.md` と `models-overview.md` は **変更なし**です。

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
| claude-haiku-4-5-20251001 | 現行 | 2026-10-15 以降（**過ぎました**） |
| claude-opus-4-1 / 4, claude-sonnet-4, claude-3-7-sonnet, claude-3-5-haiku, claude-3-haiku | 停止済み | — |

**Claude Haiku 4.5 について**: 「停止日 2026年10月15日以降」という期限は**昨日で過ぎました**。**廃止予告（deprecation）は今日時点でも出ていません。** `model-deprecations.md` の記載は「Active（現行）」のままです。この日付は「これより早くは停止しない」という約束の期限だったので、**期限を過ぎても自動で止まるわけではありません。** 実際に止めるには廃止予告が出ます。引き続き毎日確認します。

価格表の変更（`pricing.md`）。**価格の数字そのものは1つも動いていません。**

| 変更 | 内容 |
|---|---|
| 提供状況 | Fast mode の研究プレビューの範囲を Opus 5 / Opus 4.8 に限定、Opus 5.5 は Microsoft Foundry（Azure）でも利用可能に |
| 削除 | 「Opus 4.6 では標準速度で実行され標準料金で請求される」という説明文（今は「使えない」だけ） |

---

## ⑥ 🔗 出典

取得できた一次情報

- Claude Code CHANGELOG（2.1.301）
- Claude Code ドキュメント目次（Code Review 6ページの新設、目次の区分の作り直し、既存ページの説明文の書き換え）
- Claude Platform リリースノート（10月15日付3件: Compliance API の user preferences、Fast mode の研究プレビュー終了、Fast mode の Microsoft Foundry 対応。既存項目に Managed Agents の予定配備の AWS 対応の追記）
- Claude Platform ドキュメント目次（3ページ新設、Compliance API のコード用アーティファクトの URL 移動と `download` の追加）
- 価格表（`pricing.md`）— Fast mode の提供状況の記述変更
- モデル概要（`models-overview.md`）— 変更なし
- モデル廃止一覧（`model-deprecations.md`）— 変更なし
- npm `@anthropic-ai/claude-code` 最新版情報

補足（未確認・二次情報）

Web検索では、**10月15日付の新しい発表は見つかりませんでした。** 挙がったもののうち一次ソースの差分に無いものです。**すべて未確認**です（このクラウド環境から anthropic.com / claude.com への接続はブロックされています）。

- **選挙関連の不正利用で Claude の利用者を禁止（ban）した**と Anthropic が述べた、という記述。**11月3日**の中間選挙に向けて、選挙関連の悪用の試みを阻止した、とされています。昨日お伝えした投票情報の追加（10月14日）と同じ流れの報道です。あわせて「**選挙の夜とその後の数日間、Claude が現在の得票数を表示する**」という記述もありました
- **Claude Frontier Academy に1億ドルを投じ、1万人のエンジニアを育てる**、という記述。10月5日から「未確認」として挙げてきた項目に、**金額が付いた**形です

過去数日から持ち越しの未確認分（Claude for Government、Claude Dashboards と Claude Motion の beta、Docs / Slides / Design の beta 終了と全プラン提供、Claude for Google Workspace、Project Glasswing の 129,000件、利用規約の更新、Genesis Mission、Claude が Anthropic のモデル研究開発の26%を主導、ART 酵素の先行性をめぐる争い、Claude Code projects のベータ、Claude for Small Business、Claude for Financial Advisors）は、今日も一次ソースに現れていません。**引き続き未確認**です。

---

## 運用メモ

リポジトリは `50337bf`（10/15 分）まで送信済みです。今日の分もこのあと push します。

---

過去のダイジェスト一覧は [INDEX.md](INDEX.md) を参照してください。
