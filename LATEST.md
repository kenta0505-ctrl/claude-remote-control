<!-- このファイルは scripts/finalize.sh が自動生成します。直接編集しないでください。 -->
<!-- 編集する場合は digests/2026-10-23.md を直してから finalize.sh を再実行してください。 -->

# 2026-10-23（金）Claude 更新ダイジェスト

## ① 今日の要点

- **Claude の API が Google Cloud 経由で使えるようになりました。** ただしこれまでの「Google 版 Claude」とは別物で、**中身は Anthropic 自身が動かす Claude API** です。支払いだけ Google Cloud の請求にまとまります。
- Claude Code は **2.1.307（43項目、うち VSCode 7項目）** と **2.1.308（修正のみ1項目）**。昨日食い違っていた npm と CHANGELOG は**今日そろいました**。
- Claude Code に **`/claude-api api-version` コマンドが追加**されました。昨日の新しい API バージョンへの書き換えを手伝ってくれるものです。
- **MCP のツールが二重に実行されていた不具合**が直りました。
- 価格表は **数字は1つも動いていません。**「USD」の追記と言い換えだけです。ただし **Fast mode の提供範囲の書き方が変わりました**（②に書きます）。

---

## ② ⚠️ 今の使い方が変わるもの

### 1. Google Cloud 版の Claude が「2種類」に分かれました

これまで「Google Cloud の Claude」は1つでした（Vertex AI 経由のもの）。**今日から2つになり、名前も付き直しました。**

| 新しい呼び方 | 誰が動かしているか | 中身 |
|---|---|---|
| **Claude Models on Google Cloud (Anthropic managed)**（今日できた新しい方） | **Anthropic** | **Claude API そのもの。** Google Cloud のプロジェクト経由で届く |
| **Claude Models on Google Cloud (Google managed)**（従来の Vertex AI 版） | **Google** | Google が提供する Claude |

**何が変わるのか**を、公式ドキュメントの説明をそのまま訳します。

> Claude Models on Google Cloud (Anthropic managed) は、**Anthropic が運用し、あなたの Google Cloud プロジェクト経由で到達する Claude API** です。

**重要な区別が1つあります。** モデルの引退日（いつ使えなくなるか）の扱いが、この2つで違います。

モデル廃止一覧のページが、今日こう書き換わりました。

- **旧**: 「このページの日付は Anthropic が運用するプラットフォーム（Claude API、Claude Platform on AWS、Microsoft Foundry）に適用されます。**パートナーが運用するプラットフォーム（Amazon Bedrock と Google Cloud）は独自の引退スケジュールを設定します**」
- **新**: 「…（Claude API、Claude Platform on AWS、**Claude Models on Google Cloud (Anthropic managed)**、Microsoft Foundry）に適用されます。パートナーが運用するプラットフォーム、**Amazon Bedrock と Claude Models on Google Cloud (Google managed)** は独自の引退スケジュールを設定します」

つまり **新しい方（Anthropic managed）は Anthropic の日付に従い、従来の Vertex AI 版（Google managed）は Google の日付に従う**、という線引きです。

**この新しい方の制約**も明記されています。

- **APIキーが使えません。** 認証は Google Cloud の資格情報だけです
- **Anthropic の組織が新しく1つ作られます。** 既に会社で Anthropic の組織（Claude Enterprise も含む）を持っていても、**それとは別の組織**になります
- **Claude Console にメールアドレスでサインインできません。** Google Cloud コンソールの Claude ページから開く形で、**`roles/claude.admin` を持つ人だけ**が開けます
- **MCP tunnels が使えません**（MCP tunnel = 手元のネットワークの中にある MCP サーバーに外から届かせる仕組み）
- **割引は過去の利用分には適用できません。** 既に割引を持っている場合は、設定を始める前に担当者に連絡するよう案内されています
- **ZDR（会話データを一切保持しない取り扱い）は申請すれば使えます**が、**他の Anthropic 組織で結んだ ZDR の取り決めは、この新しい組織には引き継がれません**

**原さんへの関係**: 原さんは claude.ai とアプリから Claude を使っていて、Google Cloud のプロジェクトを通していません。**直接の影響はありません。**

### 2. Fast mode の「使えない場所」の記述が消えました

価格表の Fast mode の文が書き換わりました。**消えた部分があるので、そのまま並べます。**

- **旧**: 「Fast mode は Claude API（直接）で、そして Claude Opus 5.5 については Azure 上にホストされた Claude in Microsoft Foundry のデプロイで利用可能です。**Claude Platform on AWS やパートナー運用のクラウドプラットフォームでは利用できません。**」
- **新**: 「Fast mode は Claude API（直接）で、そして Claude Opus 5.5 については **Claude Models on Google Cloud (Anthropic managed)** と Azure 上にホストされた Claude in Microsoft Foundry のデプロイで利用可能です。」

**「AWS やパートナー運用のクラウドでは使えない」という一文が削除され、代わりの記述はありません。** 新しい文は、使えない場所については何も言っていません。**AWS で使えるようになったとは書かれていないので、ここは断定しません。**

（Fast mode = Claude Opus の返答を速くする有料の設定。追加料金がかかります。）

### 3. MCP のツールが二重に実行されていた不具合が直りました

2.1.307 の修正です。

> **HTTP の MCP ツール呼び出しが、呼び出しの途中で接続が閉じたときに2回送られていた**のを修正。**今後は読み取り専用か、何度実行しても結果が同じツールだけが再試行されます。**

MCP = Claude に外部のサービス（原さんの場合 Square・Gmail・Google Drive・Google カレンダー）をつなぐ仕組みです。

**「2回送られていた」というのは、たとえば予定を1件作るはずが2件できる、という種類の不具合です。** 今回から、**やり直しても害のないツールだけ**が再試行されるようになりました。

### 4. 画面読み上げの設定が、置き場所によって効かなくなりました（2.1.305 から）

> `axScreenReader` の設定と、設定の `env` ブロックの `CLAUDE_AX_SCREEN_READER` が、**ユーザー設定・管理設定・`--settings` で渡した設定からのみ適用される**ように変更（2.1.305 から）

**プロジェクトごとの設定ファイルに書いていた場合は効かなくなります。** 2.1.305 からの変更が、今回明記されました。

### 5. 自前サーバーで Claude Code を動かしている場合、準備処理に30分の上限がつきました

> **自前ランナー**: チェックアウトフックを**既定で30分後に停止**するよう変更。セッションの準備が失敗します。もっと長くかかる場合は `--checkout-hook-timeout-min` を上げるか `0` に設定してください

（チェックアウトフック = セッション開始時にリポジトリを取ってきて準備をする処理）

（継続中のものを再掲します。**単独版の Claude Design が 2026年12月14日に閉鎖**されます。**Claude Sonnet 4.5 が 2026年11月30日に API から停止**します。**昨日出た API バージョン `2026-10-21` では `temperature` 等が全モデルで使えなくなります。** 原さんの使用モデルは Claude Opus 5 で、claude.ai 経由なので、いずれも直接の影響はありません。）

---

## ③ 今日の変更（説明つき）

### Claude Code が、新しい API バージョンへの書き換えを手伝ってくれるようになりました

**`/claude-api api-version` というコマンドが追加されました。**

> Claude API のコードを API バージョン `2026-10-21` に移行する `/claude-api api-version` を追加

**昨日報告した破壊的変更**（`temperature` が使えなくなる、`workspace_id` が `scope` になる、など）に**自分のコードを合わせる作業を、Claude Code にやらせられる**ようになったということです。

### Claude が「止められた操作」を記録に残せるようになりました

> **権限ルール・auto モード・安全性チェック・フック・サンドボックスが止めた、確認を求めた、または差し戻した**ツール呼び出しごとに、`claude_code.safety_event` という OpenTelemetry のイベントを追加

OpenTelemetry = 動作の記録を外部の監視サービスに送るための共通の仕組みです。

**これまでは「何が止められたか」が記録として外に出ていませんでした。** 今回から、**止められた1件ごとにイベントが残る**ようになりました。組織で Claude Code を使っていて「どんな操作が止まっているのか」を把握したい場合に使うものです。

### 消したはずの会話が戻ってくる不具合が直りました

クラウドセッション（原さんのこのダイジェストもクラウドセッションです）の修正が2件あります。

> - **`/clear` でクリアした会話が、クラウドまたは自前ランナーのセッションが再起動したときに戻ってくることがあった**のを修正
> - **クラウドセッションの `/autocompact` が、セッション再起動後に既定の幅に戻っていた**のを修正

`/clear` は会話をまっさらにするコマンド、`/autocompact` は会話が長くなったときに自動で要約する設定です。**どちらも「再起動すると設定前の状態に戻ってしまう」という同じ形の不具合**でした。

### Claude Code が、おかしなツール呼び出しで諦めずにやり直すようになりました

> **解釈できないツール呼び出しからの復帰を改善**: Claude Code は**ターンをエラーで終える前に、最大2回まで呼び出しをやり直す**ようになりました

これまでは、Claude が壊れた形でツールを呼んでしまうと**そこで作業が終わっていました。** 今回から2回までやり直します。

### 手分けして働く Claude が、お互いの仕事を取り合わなくなりました

> **一緒に起動された fork サブエージェントを改善**: **それぞれに「どの起動が自分のものか」が伝えられる**ようになり、fork がお互いの仕事を始めようとすることがずっと少なくなりました

Claude は大きな仕事をするとき、自分の会話をそのまま引き継いだ作業係（fork サブエージェント）を複数呼び出すことがあります。**同時に呼ばれると、どちらも「自分が担当だ」と思って同じ仕事を始めてしまう**ことがありました。今回それが直りました。

---

## ④ 一行で流すもの

**Claude Code 2.1.308（1項目）**

- バグ修正と信頼性の改善（内容の明細はありません）

**Claude Code 2.1.307 のうち、③と②で触れていない残り（30項目）**

追加（③に記載の2件以外はありません）

修正

- `CLAUDE_CODE_DISABLE_1M_CONTEXT` を設定し、かつモデルが `opus[1m]` のような `[1m]` 付きの別名のとき、**モデルが見つからないエラーでリクエストが失敗していた**のを修正
- **`prompt-caching-scope` のベータヘッダが、独自の `ANTHROPIC_BASE_URL` を通した接続と Foundry に送られていた**のを修正（そこでは効果がありません）
- **macOS でログインキーチェーンがロックされている間、`claude -p` で MCP サーバーが「認証が必要」と表示されていた**のを修正。**理由が表示されるようになり、ロック解除後の次回起動は再サインイン無しでつながります**
- **macOS や Linux の端末が、MCP サーバーの接続中にスリープしたときに、サーバーがタイムアウトと報告され、ヘッドレス実行では失敗したままになっていた**のを修正
- **バックグラウンドのタスクが動いているときに、SDK MCP サーバーの最新のツールなしでターンが始まることがあった**のを修正
- **PDF のページ・画像・その他の大きなツール結果を多く読むターンで出ていた「Autocompact is thrashing」エラー**の一部を修正
- **Claude アプリのゲートウェイ経由のセッションで `CLAUDE_STREAM_FIRST_BYTE_TIMEOUT_MS` が無視されていた**のを修正
- **Claude Desktop のセッションから、Claude アプリのゲートウェイ経由で送られるテレメトリが、`OTEL_EXPORTER_OTLP_HEADERS` が設定されていると拒否されていた**のを修正
- **`/permissions` の「Recently denied」に、拒否されたシェルコマンドが表示されていなかった**のを修正。また **auto モードのローカル分類器が、再試行されたコマンドを確認するときに、そこからの承認を無視していた**のも修正。**行を承認すると、説明ではなくコマンド自体が表示されます**
- **`/help` と `/` のコマンドメニューが、`/claude-api` のような同梱スキルについて、短い説明ではなくモデル向けの長い説明を表示していた**のを修正
- **サブエージェントの記録が、ストリーミングされた応答についてプレースホルダのトークン使用量と空の停止理由を記録していた**のを修正
- **Agent SDK の `setModel()` 経由のモデル切り替えと、それを使って作られたアプリで、API がモデルの確認に5秒以上かかると拒否されていた**のを修正。**Claude Code は最大15秒待つようになりました**
- **接続したアプリ（デスクトップアプリがアイドルのセッションを格納するなど）から停止されたバックグラウンドコマンドが、Claude には「ユーザーが停止した」と報告されていた**のを修正。**通知はその出力ファイルの名前を示すようになりました**
- **Cowork のクラウドセッションで、サイトが 4xx のステータスや robots.txt の拒否で応答したときに、WebFetch がツールのエラーを報告していた**のを修正。**ローカルのセッションと同じく、通常の結果になりました**
- **直接設定した GitHub MCP サーバーの書き込みツールが、デスクトップアプリの Code タブで、何も作らずに閉じるフォームを表示していた**のを修正
- **Artifact ツールの読み取りが、サーバーが再利用中の接続を閉じていたときに、接続リセットで失敗していた**のを修正
- **自前ランナー**: **`--use-anthropic-git-proxy` を使うセッションが、前のセッションがクローンに残した `.claude/settings.local.json` をコミットしていた**のを修正
- **自前ランナー**: **チェックアウトフックの実行中にセッションを格納・再投入したり、ランナーを停止したりすると、フックのプロセスが動いたままになり、ランナーの枠が押さえられたままになっていた**のを修正

改善

- **ブラウザのサインインを改善**: **アカウントのプロフィールの読み込みを待たずに、サインイン完了と同時に成功ページが表示される**ようになりました
- **クラウドと自前ランナーのセッションでの Web 検索のエラーを改善**: **403 で拒否され、かつ理由が示された検索は、一般的な「Authentication error」ではなくその理由を表示する**ようになりました
- **デスクトップアプリの MCP サーバーの1つが接続できないときの、クラウドセッションの最初の返答までの時間を改善**
- **大きな貼り付け画像や PDF の読み取りを含む記録を持つセッションの、Remote Control の接続時間を改善**

変更

- **WebSearch の予算を使い切ったときに Claude が受け取る通知**を、**ブラウザや computer use で検索エンジンに問い合わせないようにも伝える**よう変更
- **自前ランナー**: **Anthropic 管理の git 用に作られる証明書ファイルを、CLI と同じように信頼する証明書を絞り込む**よう変更。**`[runner:warn]` の行が除外された数を示します**

VSCode（7項目）

- **音声入力が自分で止まったとき（15秒間、認識できる発話がない／2分の上限）に、マイクボタンに通知を追加。** 理由と、**それまでのテキストは保持されること**を伝えます
- **「Show more」で展開した長いプロンプトがチャットパネル全体を覆っていた**のを修正。**固定されたプロンプトはパネルの40%が上限になり、スクロールします**
- **LaTeX の数式を含むリスト項目や表のセルの一部が、リッチテキストエディタに新しいリストや表として貼り付けられていた**のを修正
- **`NODE_EXTRA_CA_CERTS` が `~/.claude/settings.json` にだけ設定されているとき、TLS を検査するプロキシの背後で音声入力が失敗していた**のを修正。**`CLAUDE_CODE_CERT_STORE` にも従うようになりました**
- **「still open somewhere else」の通知**が、**拡張機能の再起動で残った Claude のプロセスも対象にする**よう変更（通常は10分ほどで自然に終わります）
- **音声入力が、CLI と同じように信頼する証明書を絞り込む**よう変更
- **拡張機能自身のリクエストが、CLI と同じように信頼する証明書を絞り込み、環境またはユーザー設定で指定された `NODE_EXTRA_CA_CERTS` のファイルを信頼する**よう変更

クラウドセッション（2項目。③に記載の2件とは別です）

- **リポジトリの選択画面が、検索中なのに「No repositories match」と表示していた**のを修正。**結果が届くまで「Searching…」が表示されます**
- **自前環境での「Waiting for a runner」の表示が途中で切れていた**のを修正。**オンデマンドのランナーでは、最後のメッセージからの経過時間を数え上げ、失敗した試行回数も表示します**

Code Review（1項目）

- **`@claude review stop`（`off` と `pause` も可）を追加。** プルリクエストの `@claude review always` の購読を、**新しいレビューを始めずに終わらせます**

**Platform リリースノート（10月22日付、2項目）**

- **Claude Models on Google Cloud (Anthropic managed) を公開**（②③に記載）
- **Fast mode が、Claude Models on Google Cloud (Anthropic managed) の Claude Opus 5.5 で利用可能に**

**価格表（`pricing.md`）の変更**

**数字は1つも動いていません。** 変わったのは名称・リンク・表記です。

- **「Google Cloud」という表記が「Claude Models on Google Cloud (Google managed)」に置き換え**（4か所）。リンク先も新しいページに
- **パートナー運用プラットフォームの説明に、新しい Anthropic managed 版への案内を追加**
- **地域別価格（1.1倍）の適用範囲に「Claude Models on Google Cloud (Anthropic managed)」を追加**
- **CCU（Claude Consumption Unit = AWS / Azure 経由の支払い単位）の表で、`$0.01 per CCU` → `$0.01 USD per CCU`** に。**価格は変わっていません**
- **Managed Agents のセッション実行料金 `$0.08 per session-hour` → `$0.08 USD per session-hour`。価格は変わっていません**
- **計算例の金額に「USD」を追記**（$0.20 USD、$0.30 USD、$0.08 USD、合計 $0.58 USD／$0.04 USD、$0.008 USD、$0.30 USD、$0.08 USD、合計 $0.428 USD）。**どの数字も変わっていません**
- **コードブロックの表示が `json` から `text wrap` に**（3か所）
- **「search iterations executed」→「search iterations run」**
- **請求に関する箇条書き7件に句点を追加**し、「**Credit card and invoicing options available**」→「options **are** available」、「**Usage tracking available**」→「tracking **is** available」

**モデル廃止一覧（`model-deprecations.md`）**

- **Google Cloud が「Anthropic managed」と「Google managed」に分けて書き直されました**（②に記載）。**モデルの状態と日付は何も動いていません**

**モデル概要（`models-overview.md`、1項目）**

- 「adjust your prompts to guide the model toward **the desired output length**」→「toward **the output length you want**」

**ドキュメント索引**

- **Claude Code の索引**: 変更なし
- **Platform の索引**: **新しいページは増えていません。** 既存2件の表示名が整理されただけです
  - 「Tool Runner (SDK)」→「Tool **runner** (SDK)」
  - 「Manage WIF via API」→「Manage WIF **with the Admin API**」
  - **注記**: 今日のリリースノートが案内している新しい Google Cloud のページ（`claude-models-on-google-cloud/anthropic-managed` など）は、**索引にはまだ載っていません。** 索引の67行目は従来の `claude-on-vertex-ai` のままです。**ページ自体は取得できたので（②③の引用はそこからです）、索引の更新が遅れているだけと思われます**

---

## ⑤ 📊 定点観測

| 項目 | 今日 | 前日 |
|---|---|---|
| Claude Code（npm） | **2.1.308** | 2.1.307 |
| CHANGELOG 最新 | **2.1.308** | 2.1.306 |
| **npm と CHANGELOG** | **一致** | **食い違い** |
| CHANGELOG の新規項目 | **44**（2.1.308 が1件、2.1.307 が43件。うち VSCode 7件） | 2 |
| Platform リリースノートの新規項目 | 2（10月22日付） | 9 |
| 変更のあったソース | 7 / 8 | 7 / 8 |
| ソース取得 | **8 / 8 成功** | 8 / 8 成功 |

**昨日の食い違いは解消しました。** 昨日「npm は 2.1.307 だが CHANGELOG は 2.1.306 まで」と書きました。**今日、2.1.307 の内容（43項目）が CHANGELOG に出ました。** 同時に 2.1.308 も出て、npm も 2.1.308 に揃っています。

**新しいプラットフォーム**

| 項目 | 内容 |
|---|---|
| 名前 | **Claude Models on Google Cloud (Anthropic managed)** |
| 運用 | **Anthropic**（Claude API そのもの） |
| アクセス | Google Cloud プロジェクト経由。IAM で制御 |
| 請求 | **Google Cloud Marketplace**。Anthropic からの請求書は別に来ません |
| 必要なサービス | `claude.googleapis.com` と `anthropic-managed-claude.cloudpartnerservices.goog` |
| IAM の役割 | `roles/claude.viewer`（読み取りのみ）／`roles/claude.user`（メッセージ送信など）／`roles/claude.admin`（組織全体 + Claude Console を開ける） |
| モデル ID | **Claude API と同じ**（例: `claude-opus-5-5`） |
| 使えないもの | **APIキー / MCP tunnels / 自前サンドボックスでの memory store / 既製の自前サンドボックスワーカー** |
| Fast mode | **Claude Opus 5.5 で利用可能** |
| 監査ログ | Cloud Audit Logs。**Data Access ログは既定でオフ**、Admin Activity ログは常にオン |

モデルの状態: **現行・廃止予告・停止済みの区分に変更はありません。**

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
| claude-haiku-4-5-20251001 | 現行 | 2026-10-15 以降（過ぎました） |
| claude-opus-4-1 / 4, claude-sonnet-4, claude-3-7-sonnet, claude-3-5-haiku, claude-3-haiku | 停止済み | — |

**Claude Haiku 4.5 について**: 期限（10月15日）を過ぎて8日目です。**廃止予告は今日時点でも出ていません。**

価格表（`pricing.md`）: **数字は1つも動いていません。** 名称の置き換えと「USD」の追記、言い換えだけです（④に全件記載）。**ただし Fast mode の提供範囲の記述からは一文が削除されています**（②に記載）。

---

## ⑥ 🔗 出典

取得できた一次情報

- Claude Code CHANGELOG（2.1.308 と 2.1.307）
- npm `@anthropic-ai/claude-code` 最新版情報（2.1.308。**CHANGELOG と一致**）
- Claude Platform リリースノート（10月22日付2件）
- **Claude Platform ドキュメント「Claude Models on Google Cloud (Anthropic managed)」本文**（`platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed`、50,443バイト取得）— ②③⑤の Google Cloud に関する記述は、すべてこのページからの引用です
- 価格表（`pricing.md`）
- モデル廃止一覧（`model-deprecations.md`）
- モデル概要（`models-overview.md`）
- Claude Platform ドキュメント目次（新規ページなし。表示名の整理2件）
- Claude Code ドキュメント目次 — 変更なし

補足（未確認・二次情報）

WebSearch で3件検索しました（Claude Cowork / Anthropic の発表 / Google Cloud の新プラットフォーム）。**一次情報で裏が取れたものはありません。いずれも未確認です**（このクラウド環境から anthropic.com / claude.com への接続はブロックされています）。

- **Google Cloud の新プラットフォームについて**: 今日の一次情報（Platform リリースノートとドキュメント本文）で確認できました。一方 **Google 側の発表は見つかりませんでした。** 検索で出てきたのは従来の Vertex AI 版（Google managed）の資料で、**10月2026 の発表は見つかりません。** Google 側のページでは Claude Fable 5.1 の引退日が「2027年3月1日より前にはならない」、Claude Opus 5 が「2027年1月24日より前にはならない」と記載されているという情報がありました（**Anthropic 側のモデル廃止一覧の日付とは別の数字です。②で書いた「2つは別のスケジュールに従う」の実例に見えますが、Google 側のページは未確認です**）
- **Claude Cowork について**: 公式のリリースノートで10月付の Cowork の項目は見つかりませんでした。第三者サイト（SmartScope）の記事に「**Pro と Max プランの Cowork の新しいタスクが 2026年10月6日からクラウド実行に移り、ローカル実行のみの設定「Only on your computer」が削除される。既存のローカルのタスクは端末上で完了まで動き続けられる**」という記述がありましたが、**一次情報では確認できていません。未確認**です
- **Anthropic の発表について**: 10月22日付の発表は見つかりませんでした。10月15日付の報道として「**14日にサンフランシスコで IPO 前の決算説明会を開き、第3四半期の売上 168億ドル（前四半期比 45%増）と、同四半期に調整後の黒字化を達成したと報告した**」「**上場は11月の米中間選挙後にずれ込む可能性がある**」というものがありました。**いずれも二次情報で、引用元自身が「一次情報を確認するように」と注意書きを付けています。未確認**です

過去数日から持ち越しの未確認分（Claude for Government、Claude Frontier Academy の1億ドル、Claude Dashboards と Claude Motion の beta、Docs / Slides / Design の beta 終了と全プラン提供、Claude for Google Workspace、Project Glasswing の 129,000件、利用規約の更新、量子回路の研究、NIST 暗号のシード値の件、中間選挙への対応、Genesis Mission の1億5,000万ドル、Anthropic Public Benefit Fund、サソリの神経毒の研究、Claude が Anthropic のモデル研究開発の26%を主導、ART 酵素の先行性をめぐる争い、Claude Code projects のベータ、Claude for Small Business、Claude for Financial Advisors、Claude Design の移行の詳細、user profiles の料金とベータヘッダの詳細）は、今日も一次ソースに現れていません。**引き続き未確認**です。

---

過去のダイジェスト一覧は [INDEX.md](INDEX.md) を参照してください。
