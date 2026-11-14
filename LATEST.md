<!-- このファイルは scripts/finalize.sh が自動生成します。直接編集しないでください。 -->
<!-- 編集する場合は digests/2026-11-15.md を直してから finalize.sh を再実行してください。 -->

# 2026-11-15（日）Claude 更新ダイジェスト

## ① 今日の要点

**小さい日です。8つのソースのうち、変わったのは1つだけ**でした。

- **Claude Code は 2.1.325 のまま。CHANGELOG は新規項目ゼロで、バイト単位で昨日と同一**です
- **Platform 側の4つと価格表も、すべてバイト単位で昨日と同一**です
- **変わったのは Claude Code のドキュメント目次だけ。** **新しいページが1本増えました**（Google Cloud 経由で Claude Code を使うための設定の説明）。**中身を読んで③にまとめました**
- **あわせて、既存のページの説明文が2件 書き換わりました。** そのうち1件から、**まだ CHANGELOG に出ていない変更の気配が読み取れます**（③に書きます）
- **価格は1つも変わっていません**（価格表がバイト単位で同一）

**明後日（11月17日）が、持ち越している「`coworkTabEnabled` の警告が出始める日」とされている日です。** **ただしこの日付は、昨日の検索で裏が取れませんでした。** ②に書きます。

---

## ② ⚠️ 今の使い方が変わるもの

**今日はなし。** **CHANGELOG に新規項目がなく、価格・モデル・破壊的変更も一切ありません。**

### 日付が決まっているもの

| 日付 | 内容 | 残り |
|---|---|---|
| **2026-11-17** | **`coworkTabEnabled` を設定している利用者に警告が出始める**（**未確認。昨日の検索では裏が取れませんでした**） | **2日** |
| 2026-11-24 | Claude Opus 4.5 の「これより前には停止しない」日 | 9日 |
| **2026-11-30** | **Claude Sonnet 4.5 が API から停止** | **15日** |
| **2026-11-30** | **Claude Opus 4.8 の Fast mode が削除**（削除後はエラー。標準速度にフォールバックしません） | **15日** |
| **2026-12-14** | **単独版 Claude Design が閉鎖** | **29日** |
| **2026-12-17** | **`coworkTabEnabled` が受け付けられる最終日**（**未確認。昨日の検索では裏が取れませんでした**） | **32日** |

**11月17日・12月17日の2つについて、念のため繰り返します**: **この日付は11月12日の Web 検索で出てきたものです。** **昨日（11月14日）に別の検索で確かめようとしましたが、裏が取れませんでした。** **引き続き未確認**です。**確定した日付として扱わないでください。**

### 日付のないもの（持ち越し。今日の変更はありません）

- **Claude Desktop の「Unified Claude」**（11月10日に適用済み。**一次情報では未確認**）
- **Claude Code 2.1.325 の「zstd のセキュリティ問題の修正」**（昨日。**内容は1行しか書かれていません**）
- **サンドボックスの中の Bash コマンドが、既定で確認を求めるようになりました**（昨日。`sandbox.autoAllowBashIfSandboxed: true` で元に戻せます）
- **予定実行と `/loop` が、`allowed-tools` やフックを宣言しているスキルの実行前に確認するようになりました**（昨日）
- **「Code Mode」が実験的に使えます**（自分でオンにしない限り動きません。**対応モデルは Opus 5.5 / Sonnet 5.5 / Haiku 5.5 / Fable 5.2 で、Opus 5 は入っていません**）
- **API バージョン `2026-10-21`** では `temperature`・`top_p`・`top_k` が**全モデルで使えなくなります**
- **Claude Fable 5.2 / Mythos 5.2** に乗り換えるときの注意（prefix check の全アカウント強制、`computer_20251124` は 400 エラー、advisor tool は 5.2 系どうしのみ、30日間のデータ保持が必須、思考内容はアカウントに紐づく）
- **Fable 5.1 を選んでいた人は、Pro と Max では自動で 5.2 に移されます**
- **Claude が書いた mod が、auto モードと bypass モードでは確認なしに有効化されます**
- **MCP の古い接続方式（v1）が削除されました**
- **「Ultra」プラン**（月額 API クレジット $200、Max は $100）。**開始日と Max との関係は今日も未記載**（**21日目**）
- **IP 許可リスト**が beta（組織の管理者向け。**締め出しに注意**）
- **Claude が書いた文章に透かし**（対象は Claude Mythos 5・Opus 4.7・Sonnet 4.6）

**原さんの使用モデルは Claude Opus 5 で、価格は $5 / $25（100万トークンあたり）のまま変わっていません。**

---

## ③ 今日の変更（説明つき）

### 1. 「Google Cloud 経由（Anthropic 運用）で Claude Code を使う」ページが新設されました

**Claude Code のドキュメント目次に、1行追加されました。**

> **Claude Code with Claude Models on Google Cloud (Anthropic managed)** — **Claude Code を、あなたの Google Cloud のプロジェクト経由で Anthropic が動かしている Claude API を使うように設定する。Google Cloud の資格情報・IAM・Marketplace 課金つきで**

**ページを取得して読みました。中身を説明します。**

**用語を一言で**:

- **「Google Cloud」**: **Google が提供しているクラウドサービス**です
- **「Anthropic managed（Anthropic 運用）」**: **Claude 本体を Anthropic が動かしていて、Google Cloud のプロジェクトを窓口として通すだけ**という形です
- **「IAM」**: **誰が何をしてよいかを決める、Google Cloud の権限の仕組み**です
- **「Marketplace 課金」**: **Google Cloud の請求書にまとめて乗る形での支払い**です

**ページの冒頭の説明**:

> **Claude Models on Google Cloud（Anthropic managed）は、Anthropic が動かし、あなたの Google Cloud のプロジェクトを通して到達する Claude API です。** **Claude Code から使うには、Google Cloud にサインインして、3つの環境変数を設定します**

**ここで大事な注意が1つ、ページに書かれています**:

> ⚠️ **Google Cloud は、Google が運用する「Google Cloud の Agent Platform（旧 Vertex AI）」経由でも Claude を提供しています。** **Agent Platform を使っている場合は、別のページ（Claude Code on Google Cloud's Agent Platform）に従ってください**

**つまり、Google Cloud 経由で Claude を使う道は2本あって、設定方法が違います。** **どちらを使っているか分からない場合の確認先も、ページにリンクされています。**

**必要なもの**（ページの記述）:

> - **Google Cloud のプロジェクト**（アカウントの設定が済んでいるもの）
> - **そのプロジェクトでの `roles/claude.user` という IAM の役割**（Claude Code を動かす Google アカウント・サービスアカウントごとに必要）
> - **プロジェクト ID と、`wrkspc_` で始まるワークスペース ID**
> - **gcloud CLI**（サービスアカウントのキーファイルではなく、Google アカウントでサインインする場合）
> - **Claude Code v2.1.307 以降**

**設定する環境変数**（ページの表をそのまま訳します）:

| 変数 | 必須か | 説明 |
|---|---|---|
| `CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD` | **必須** | `1` にすると、モデルへのリクエストを Google Cloud 経由（Anthropic 運用）に送ります |
| `ANTHROPIC_GOOGLE_CLOUD_WORKSPACE_ID` | **必須**（`ANTHROPIC_GOOGLE_CLOUD_BASE_URL` を設定する場合を除く） | ワークスペース ID |
| `ANTHROPIC_GOOGLE_CLOUD_PROJECT` | **推奨** | Google Cloud のプロジェクト ID。無い場合は `GOOGLE_CLOUD_PROJECT` を使います |
| `ANTHROPIC_GOOGLE_CLOUD_LOCATION` | 任意 | リクエストの URL に入る場所。既定は `global` |
| `ANTHROPIC_GOOGLE_CLOUD_BASE_URL` | 任意 | Claude Code が組み立てる接続先の URL を置き換えます（LLM ゲートウェイのアドレスなど）。Claude Code が `/v1/messages` などの API のパスを後ろに付けます |
| `CLAUDE_CODE_SKIP_ANTHROPIC_GOOGLE_CLOUD_AUTH` | 任意 | `1` にすると、Claude Code は Google のアクセストークンを送りません（ゲートウェイ側が Google の資格情報を付ける場合） |

**この経路では使えない機能**（ページが明記しているもの）:

> - **Fast mode**: **`/fast` でも `fastMode` の設定でもオンにできません**
> - **Remote Control とクラウドセッション**
> - **claude.ai の MCP コネクタ**
> - **Channels**
> - **`/design-sync` と `/import` のコマンド**
> - **サーバー管理の設定**（**チームに設定を強制するには、各マシンの管理設定を使ってください**）

**困ったときの確認**（ページの記述）:

> **Claude Code がログインを求めてくる場合、または `/status` の `API provider` の行に `on Google Cloud` が入っていない場合**:
> - **`CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD` が `1` になっているか確認**
> - **`claude --version` が 2.1.307 以降を出すか確認**
> - **シェルと設定ファイルから `CLAUDE_CODE_USE_BEDROCK`・`CLAUDE_CODE_USE_FOUNDRY`・`CLAUDE_CODE_USE_ANTHROPIC_AWS` を外す**
>
> **`CLAUDE_CODE_USE_VERTEX` は設定されたままでも構いません。** 変数を変えたら Claude Code を再起動してください

**エラーメッセージごとの対処も5件、ページに載っています**（`No workspace ID found` / `No project was given` / `Could not load Google Cloud credentials` / `Google Cloud credentials expired or invalid` / `Google Cloud authentication failed`）。

**原さんへの関係**: **ありません。** 原さんは Google Cloud 経由では Claude を使っていません。**会社の Google Cloud 契約で Claude を使う組織向けのページ**です。

**記録しておくこと**: **このページが必要とするバージョン（2.1.307）は、10月22日のものです。** **つまり、機能自体は3週間以上前からあって、ドキュメントが今日できた**という形です。**理由は書かれていません。**

### 2. Agent SDK の説明文に、まだ CHANGELOG に出ていない項目の気配があります

**既存のページの説明文が1件、こう書き換わりました。**

**昨日まで**:
> **Troubleshoot the Agent SDK** — Agent SDK のエラーを直す: **Claude Code の CLI が起動しない、CLI のプロセスが終了する、構造化された出力なしで成功の結果が届く**場合

**今日から**:
> **Troubleshoot the Agent SDK** — Agent SDK のエラーを直す: **Claude Code の CLI が起動しないか終了する、道具のメッセージが大きすぎる、構造化された出力なしで結果が届く**場合

**何が増えたか**: **「道具のメッセージが大きすぎる（a tool message is too large）」という項目**です。

**つまり**: **「道具の呼び出しの結果が大きすぎてエラーになる」という症状への対処が、トラブルシューティングのページに追加された**ということです。

**ここで記録しておくこと**: **CHANGELOG には、この件についての項目が出ていません**（今日の CHANGELOG は新規項目ゼロで、バイト単位で昨日と同一でした）。**ドキュメントだけが先に変わっています。**

**推測はしません。** **ただ、「ドキュメントの説明文の変化から、これから出る（またはすでに静かに入った）変更が見えることがある」ということは、記録しておきます。**

**原さんへの関係**: **ありません。** Agent SDK（プログラムから Claude Code を呼ぶ仕組み）を使う人向けです。

### 3. 「機能の対応表」のページの説明文が、短くなりました

**昨日まで**:
> **Feature availability** — Claude Code の機能が、**Anthropic のサブスクリプションのプラン、Anthropic Console、Amazon Bedrock、Claude Platform on AWS、Google Cloud の Agent Platform、Microsoft Foundry** のそれぞれで使えるかを比べる

**今日から**:
> **Feature availability** — Claude Code の機能が、**Anthropic のサブスクリプションの各プラン、Anthropic Console、および Amazon Bedrock や Google Cloud のようなクラウドの提供元**で動くかを比べる

**何が変わったか**: **提供元を全部並べる書き方から、「〜のような」でまとめる書き方に変わりました。**

**記録しておくこと**: **今日 Google Cloud（Anthropic managed）のページが増えたので、並べる提供元が増えて書ききれなくなった**という形に見えますが、**理由は書かれていません。断定しません。**

**なお、新しい Google Cloud のページは、この「機能の対応表」に「Google Cloud (Anthropic managed)」というタブがあることを案内しています。** **提供元が1つ増えているはずです。**

---

## ④ 一行で流すもの

**今日は、上に書いた以外の項目がありません。**

- **CHANGELOG の新規項目は 0件**（バイト単位で昨日と同一）
- **Platform リリースノートの新規項目も 0件**（同じくバイト単位で同一）
- **変わったのは Claude Code のドキュメント目次1つだけ**で、その中身は**ページ1本の追加と、説明文2件の書き換え**です（全部③に書きました）
- **各言語版が 204 → 205ページ**（**増えた1ページは、新設された Google Cloud のページ**と見られます）

**間引いたものはありません。**

---

## ⑤ 📊 定点観測

| 項目 | 今日 | 前日 |
|---|---|---|
| Claude Code（npm） | **2.1.325**（変化なし） | 2.1.325 |
| CHANGELOG 最新 | **2.1.325**（変化なし） | 2.1.325 |
| npm と CHANGELOG | **一致** | 一致 |
| CHANGELOG の新規項目 | **0** | 139 |
| Platform リリースノートの新規項目 | **0** | 0 |
| Platform リリースノートの先頭の日付 | **11月12日**（変化なし） | 11月12日 |
| Platform ドキュメントのページ数 | **901**（変化なし） | 901 |
| Claude Code ドキュメント（各言語版） | **205ページ**（+1） | 204 |
| 変更のあったソース | **1 / 8** | 3 / 8 |
| ソース取得 | **8 / 8 成功** | 8 / 8 成功 |

**取得サイズ**

| ソース | 今日 | 前日 | 差 |
|---|---|---|---|
| Claude Code CHANGELOG | 1,255,016 | 1,255,016 | **0** |
| Claude Code ドキュメント目次 | 58,496 | 58,222 | +274 |
| Platform リリースノート | 145,184 | 145,184 | **0** |
| Platform ドキュメント目次 | 102,075 | 102,075 | **0** |
| モデル概要 | 29,196 | 29,196 | **0** |
| モデル廃止一覧 | 14,846 | 14,846 | **0** |
| 価格表 | 55,573 | 55,573 | **0** |
| npm のバージョン情報 | 371 | 371 | **0** |

**8つのうち7つが、バイト単位で昨日と完全に同一です。** **取得はすべて成功しているので、取得に失敗して「変化なし」に見えているのではなく、本当に変化がありません。**

モデル一覧（**今日の変更はありません。モデル概要・モデル廃止一覧・価格表がバイト単位で同一のため**）

| モデル | 状態 | 停止日 | 入力 / 出力（1Mトークンあたり） |
|---|---|---|---|
| claude-fable-5-2 / claude-mythos-5-2 | 現行 | 2027-11-09 以降 | $8 / $40（Fast mode $16 / $80） |
| claude-fable-5-1 / claude-mythos-5-1 | 現行（legacy） | 2027-09-01 以降 | $10 / $50 |
| claude-fable-5 / claude-mythos-5（透かしの対象） | 現行（legacy） | 2027-06-09 以降 | $10 / $50 |
| claude-mythos-preview | 廃止予告 | 未定 | — |
| claude-opus-5-5 | 現行 | 2027-09-22 以降 | $4 / $20 |
| **claude-opus-5**（原さんの使用モデル） | **現行** | 2027-07-24 以降 | **$5 / $25** |
| claude-opus-4-8 | 現行（**Fast mode は 2026-11-30 に削除**） | 2027-05-28 以降 | $5 / $25 |
| claude-opus-4-7（透かしの対象） | 現行（Fast mode は削除済み） | 2027-04-16 以降 | $5 / $25 |
| claude-opus-4-6 | 現行（Fast mode は削除済み） | 2027-02-05 以降 | $5 / $25 |
| claude-opus-4-5-20251101 | 現行（文脈窓20万・最大出力6万4千） | 2026-11-24 以降 | $5 / $25 |
| claude-sonnet-5-5 | 現行 | 2027-09-28 以降 | $2 / $10 |
| claude-sonnet-5 | 現行 | 2027-06-30 以降 | $2 / $10 |
| claude-sonnet-4-6（透かしの対象） | 現行 | 2027-02-17 以降 | $3 / $15 |
| claude-sonnet-4-5-20250929 | 廃止予告（文脈窓20万） | **2026-11-30** | $3 / $15 |
| claude-haiku-5-5 | 現行 | 2027-10-07 以降 | $0.10 / $0.50（10万トークン超は $0.50 / $2.50） |
| claude-haiku-4-5-20251001 | 現行（文脈窓20万） | 2026-10-15 以降（過ぎました） | $1 / $5 |
| claude-haiku-3-5 | 停止済み（Google managed の Google Cloud を除く） | — | 価格表から削除済み |
| claude-opus-4-1 / 4, claude-sonnet-4, claude-3-7-sonnet, claude-3-haiku | 停止済み | — | Opus 4.1 と Sonnet 4 は価格表に残っています |

**価格は1つも変わっていません**（価格表がバイト単位で同一）。

**Claude Haiku 4.5 について**: 期限（10月15日）を過ぎて**31日目**です。**廃止予告は今日時点でも出ていません。**

**Claude Opus 4.8 の Fast mode について**: **削除まで15日**です。

**Code Mode について**: **ドキュメントは公開済み**（昨日確認）。**今日は Claude Code のドキュメント目次に残ったまま、変更なし**です。

---

## ⑥ 🔗 出典

取得できた一次情報（**8/8 成功。1件に差分、7件は変更なし**）

- Claude Code ドキュメント目次 — **1ページ追加**（Google Cloud / Anthropic managed）、**説明文の書き換え2件**、各言語版 204 → 205ページ
- Claude Code CHANGELOG — **変更なし**（2.1.325。バイト単位で同一）
- npm `@anthropic-ai/claude-code` 最新版情報 — **変更なし**（2.1.325）
- Claude Platform リリースノート — **変更なし**
- Claude Platform ドキュメント目次 — **変更なし**
- モデル概要（`models-overview.md`）— **変更なし**
- モデル廃止一覧（`model-deprecations.md`）— **変更なし**
- 価格表（`pricing.md`）— **変更なし**

**自分で取得した一次情報**（③の1番の内容は、すべてこのページからの引用です）

- **`https://code.claude.com/docs/en/claude-models-on-google-cloud-anthropic-managed.md`** — **HTTP 200。全文（152行）を取得して読みました**

補足（未確認・二次情報）

**WebSearch を1件行いました**（Anthropic の11月14日・15日の発表）。**新しい一次情報は得られませんでした。**（このクラウド環境から anthropic.com / claude.com への接続はブロックされています。）

- **11月14日・15日付の発表は見つかりませんでした。** **検索結果の多くは今年2月〜5月の古い記事**（Opus 4.6、Sonnet 4.6、Opus 4.7、Opus 4.8 の発表）でした
- **1件、新しい名前が出てきました（未確認）**: **「Claude Corps」** — 「**キャリアの早い段階にいる人向けの、全国規模のフェローシップ（研修・奨励）プログラム**」と説明されています。**出どころはリリースの集約フィードで、公開日が表示されていません。** **一次情報での裏は取れていません**
- **同じフィードに「Fable 5 が7月1日から Claude Platform・Claude.ai・Claude Code・Claude Cowork で利用可能」という記述**がありました（未確認。**Fable 5 は6月9日の発表なので、この「7月1日」が何を指すのかは分かりません**）
- **検索結果自身が「11月14〜15日については Anthropic のニュースページを直接確認するか、日付を指定した技術ニュースの検索をするのがよい。検索の索引がまだその日のものを取り込んでいない可能性がある」と述べています**

**出典のページ**（二次情報。未確認）: [anthropic news（releases.sh）](https://releases.sh/anthropic/anthropic-news)、[Anthropic debuts flagship Claude Opus 4.8（Yahoo Finance）](https://finance.yahoo.com/news/anthropic-debuts-flagship-claude-opus-48-ai-model-as-ipo-race-with-openai-heats-up-170000527.html)

持ち越しの未確認分（**「Claude Corps」というプログラム**（今日の新規）、**Agent SDK の「道具のメッセージが大きすぎる」の中身**（今日の新規。**ドキュメントの説明文だけが変わり、CHANGELOG には出ていません**）、**Google Cloud（Anthropic managed）のページが 2.1.307 の機能なのに今日できた理由**（今日の新規）、zstd のセキュリティ問題の内容、Claude Desktop の11月10日の変更の一次情報での裏取り、`coworkTabEnabled` の廃止日程（11月17日・12月17日。**裏が取れていません**）、セッション間のメッセージ上限を3日で 20 → 100,000 にした理由、自前ランナーの終了コードを3日で差し戻した理由、CHANGELOG から GrowthBook の社名を消した理由、Claude Code の「What's New」が構成から外された理由、週刊まとめが Week 37 で止まっている理由、Bedrock の `mantle` / `runtime` に変えた理由、モデル概要と価格表で Mythos のキャッシュ料金の書き方が食い違っている件、Per-message effort の中身、Security posture のリリースノートが11月5日の節に後から足された理由、Ultra プランがいつ始まったか・Max の $200 の段との関係（**21日目**）、Fable 5.2 が claude.ai とアプリで使えるのか、Dreams の対応モデルの完全な一覧、透かしの対象モデルとプラットフォームの完全な一覧、Text Completions のページが削除されたのか索引から外れただけなのか、Claude Haiku 3.5 だけが価格表から外れた理由、Claude for Government、Claude Frontier Academy の1億ドル、Claude Dashboards と Claude Motion の beta、Docs / Slides / Design の beta 終了と全プラン提供、Claude for Google Workspace、Project Glasswing の 129,000件、利用規約の更新、量子回路の研究、NIST 暗号のシード値の件、中間選挙への対応、Genesis Mission の1億5,000万ドル、Anthropic Public Benefit Fund、サソリの神経毒の研究、Claude が Anthropic のモデル研究開発の26%を主導、ART 酵素の先行性をめぐる争い、Claude Code projects のベータ、Claude for Small Business、Claude for Financial Advisors、Claude Design の移行の詳細、user profiles の料金とベータヘッダの詳細、第3四半期の決算と IPO の時期、Claude Tag の6月の立ち上げの詳細、Morning Brief の提供範囲、広告を入れない方針、プラグインのデモ用マーケットプレイスの扱い）は、今日も一次ソースに現れていません。**引き続き未確認**です。

---

過去のダイジェスト一覧は [INDEX.md](INDEX.md) を参照してください。
