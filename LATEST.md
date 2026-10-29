<!-- このファイルは scripts/finalize.sh が自動生成します。直接編集しないでください。 -->
<!-- 編集する場合は digests/2026-10-30.md を直してから finalize.sh を再実行してください。 -->

# 2026-10-30（金）Claude 更新ダイジェスト

## ① 今日の要点

**Claude Code は 2.1.312 のまま**（新しいバージョンは出ていません）。**今日の動きは Platform 側に2件です。**

- **使用量と費用を調べる API が、新しいものに置き換わりました。** これまでのものは「**レガシー（旧式）**」になりました。**まだ使えますが、今後の中心は新しい方です**（②に書きます）。
- **1回のリクエストで送れるデータの上限が、32MB から 128MB に上がりました**（4倍）。
- **Platform のドキュメントが 821 → 826ページ**に増えました（新しい API の分）。
- **価格の数字は1つも動いていません。** モデルの状態も変わっていません。

---

## ② ⚠️ 今の使い方が変わるもの

### 1. 使用量と費用を調べる API が「レガシー」になりました

**10月29日付のリリースノートです。2つの項目が対になっています。**

**新しい方**

> **`analytics-usage-cost-2026-08-24` のベータヘッダで、Usage and Cost Analytics API を beta として公開しました。** その `/v1/organizations/analytics/usage` と `/v1/organizations/analytics/cost` のエンドポイントは、**Claude Console と Claude Enterprise の組織について、トークンの使用量と費用を報告します。** **モデル・ワークスペース・API キー・そして各リクエストの背後にいるユーザーやサービスアカウントといった軸で、絞り込みとグループ化ができます。**

**古い方**

> **Usage and Cost API はレガシー API になりました。** **Claude Enterprise Analytics API の `usage_report`・`cost_report`・`user_usage_report`・`user_cost_report` のエンドポイントも同様です。** **これら全部は引き続きサポートされます。** 既存の連携を移すには、移行の案内を参照してください。

**「レガシーになった」が意味すること**: **止まるとは書かれていません。「引き続きサポートされます」と明記されています。** ただし**今後の機能追加は新しい方に来る**と読むのが自然です。**停止日は示されていません。**

**新しい API のドキュメント本文を取得して読みました。** 押さえておくべき点を挙げます。

**何ができるか**（ドキュメントの「Use this API to」から）

- **支出の帰属**: ワークスペース・API キー・モデル・サービス階層・リクエストを出した身元ごとに、費用とトークン使用量を分解できます
- **使用量の多い相手を見つける**: トークン・リクエスト数・費用で順位付けして、「**今月いちばん使っている API キーはどれか**」のような問いに答えられます
- **時系列を作る**: **1日ごと・1時間ごと・1分ごと**の区切りに分割できます
- **1回の連携で済む**: **同じエンドポイント・パラメータ・応答の項目が、Claude Console と Claude Enterprise の両方に使えます**

**気をつける点**

- **データは即時ではありません。** 「**使用の発生から通常4時間以内に更新され、最大24時間かかることがある**」「**遅れて届いたイベントと照合処理のため、値はその月末から約7日後まで改定されうる**」と書かれています。**たとえば10月1日の値は、11月7日ごろまで変わりえます**
- **応答には `data_refreshed_at` という時刻が入っていて、それより後の使用量は欠けているか不完全**です
- **期間の制限**: `starting_at` は**2026年1月1日以降かつ直近365日以内**。**1回のリクエストは最大31日**まで。**1分区切りのときは最大24時間**まで
- **グループ化は最大5つの軸**まで。絞り込みは**1つのフィルタに最大100個の値**まで
- **Claude Console の組織は Admin API キー**（または `org:admin` スコープの OAuth トークン）、**Claude Enterprise の組織は `read:analytics` スコープのキー**（Analytics API が有効化された後、primary owner が claude.ai で作成）が必要です
- **Claude Platform on AWS では、呼んだエンドポイントの AWS リージョンのワークスペースだけが対象**です。**組織全体を見るには各リージョンのエンドポイントを呼ぶ必要があります。** また `user_profile_id`・`claude_tag_category`・`claude_tag_user_id` と Managed Agents の軸（`agent_id`・`environment_id`・`deployment_id`・`session_id`）は**全ての行で `null`** になります
- **Claude Models on Google Cloud (Anthropic managed) でも使えます。** Admin API キーの代わりに Google Cloud の資格情報を使い、`/usage` には `usageAnalytics.list`、`/cost` には `costAnalytics.list` の IAM 権限が必要です

**ドキュメントに書かれている安全上の注意**をそのまま訳します。

> **これらのエンドポイントを Admin API キーで呼ぶ場合は、このデータを収集するサービスに専用のキーを与え、シークレットマネージャに保管し、定期的に回転させてください。** キーを作るときに有効期限を設定すると、その回転を強制できます。**可能な場合は、長期間有効なキーを漏らす余地がなくなるよう、代わりに `org:admin` スコープの Workload Identity Federation のルールを使い、サービスには短命のトークンを渡してください。**

**原さんへの関係**: 原さんは claude.ai とアプリ経由で Claude を使っていて、Admin API キーを持つ立場にありません。**直接の影響はありません。**

### 2. 1回に送れるデータの上限が 32MB から 128MB になりました

**10月28日付のリリースノートです。**

> **Messages API と Token Counting API の最大リクエストサイズを、ファーストパーティの Claude API で 32MB から 128MB に引き上げました。**

**4倍です。** 「ファーストパーティの Claude API」= Anthropic が直接提供している API のことで、**Bedrock・Google Cloud・Foundry 経由については何も書かれていません。**

**これは「送れるようになった」側の変更なので、今動いているものが壊れることはありません。** ②に入れているのは、**上限という制約の数字が変わったため**です。

（継続中のものを再掲します。**単独版の Claude Design が 2026年12月14日に閉鎖**されます。**Claude Sonnet 4.5 が 2026年11月30日に API から停止**します。**API バージョン `2026-10-21` では `temperature` 等が全モデルで使えなくなります。** 原さんの使用モデルは Claude Opus 5 で、claude.ai 経由なので、いずれも直接の影響はありません。）

---

## ③ 今日の変更（説明つき）

### 「誰が使ったか」を、キーではなく人で見られるようになりました

新しい API の `actor`（アクター）という軸の説明が、具体的で分かりやすいので訳します。

> `actor` の軸は、**リクエストが誰に帰属するか**です: **ユーザー、サービスアカウント、連携されたクラウドの身元**（クラウドプラットフォーム経由で Claude を使う組織の AWS または Google Cloud のプリンシパル）、**あるいはそれらのどれもリクエストの背後にいない場合は API キーそのもの**です。

**つまり「このキーが使った」ではなく「この人が使った」で集計できる**ということです。

**キーの種類によって見え方が違う**点も明記されています。

- **個人キーとサービスアカウントキー**は、**紐づいたユーザーまたはサービスアカウントとして振る舞う**ので、**そのリクエストはその身元を `actor` として表示し、キーは `api_key_id` に入ります**
- **旧来のワークスペースキーは身元に紐づいていない**ので、**キーが `actor` と `api_key_id` の両方として現れます**
- **例外**: **メンバーが Claude Console のアカウントでサインインしたときに Claude Code が作るキー**は、**Claude Code のワークスペースにあり、その使用量はそのメンバーに帰属します**
- **API キーなしのリクエスト**（Claude Console から、または Workload Identity Federation のトークンによるもの）は **`api_key_id` が `null`** になります

**2つの似たフィルタの違い**も書かれています。

> **`api_key_ids[]=apikey_...` は、そのキーが認証した全てのリクエストに一致します。誰に帰属するかは問いません。** **`actor_ids[]=apikey_...` は、そのキー自身に帰属するリクエストだけに一致します。**

### Claude Code の1人あたりの費用を出す方法が、はっきり書かれました

ドキュメントの「よくある質問」に、こう書かれています。

> **Claude Code の1人あたりの費用はどう取るか?**
>
> **費用のエンドポイントを `products[]=claude_code&group_by[]=actor` で呼んでください。** Claude Console の組織は、**1人あたりの Claude Code の活動と推定費用を報告する Claude Code Analytics API** も使えます。

### Platform のドキュメントが5ページ増えました

**821 → 826ページ**（英語版）です。他の11言語も305 → 306ページに増えています。

**新しく増えたページ**

- **`manage-claude/usage-cost-analytics-api`** — 新しい API の案内（②③で引用したページ）
- **`api/beta/organization/analytics/usage`** と **`api/beta/organization/analytics/usage/list`**（「Get Token Usage By Dimension」）
- **`api/beta/organization/analytics/cost`** と **`api/beta/organization/analytics/cost/list`**（「Get Cost By Dimension」）

**名前が変わったページ**

- **`manage-claude/usage-cost-api`** の表示名が「**Usage and Cost API**」から「**Usage and Cost API (legacy)**」に変わりました。**ページ自体は残っています**

---

## ④ 一行で流すもの

**Platform リリースノート（新規2項目。どちらも②に記載）**

- **10月29日**: Usage and Cost Analytics API の beta 公開 / 旧 API と Enterprise Analytics の4エンドポイントがレガシー化
- **10月28日**: Messages API と Token Counting API の最大リクエストサイズが 32MB → 128MB

**Platform ドキュメント目次（新規5ページ、改名1件。③に記載）**

**変更がなかったもの（8ソースのうち6つ）**

- **Claude Code CHANGELOG**: **変更なし**（1,104,632バイト、昨日と同一。最新は 2.1.312）
- **npm `@anthropic-ai/claude-code`**: **変更なし**（2.1.312）
- **Claude Code ドキュメント目次**: **変更なし**（63,679バイト）
- **モデル概要（`models-overview.md`）**: **変更なし**（22,852バイト）
- **モデル廃止一覧（`model-deprecations.md`）**: **変更なし**（14,620バイト）
- **価格表（`pricing.md`）**: **変更なし**（53,451バイト）

**価格表が変わっていない点について一言**: 新しい API は**費用を「調べる」仕組み**で、**費用そのものは変わりません。** 価格表が1バイトも動いていないことが、その裏付けになっています。

---

## ⑤ 📊 定点観測

| 項目 | 今日 | 前日 |
|---|---|---|
| Claude Code（npm） | **2.1.312** | 2.1.312 |
| CHANGELOG 最新 | **2.1.312** | 2.1.312 |
| npm と CHANGELOG | **一致** | 一致 |
| CHANGELOG の新規項目 | **0** | 0 |
| Platform リリースノートの新規項目 | **2**（10月29日付1件 + 10月28日付1件、ただしリリースノート上は計3段落） | 0 |
| Platform ドキュメントのページ数 | **826**（+5） | 821 |
| 変更のあったソース | **2 / 8** | 3 / 8 |
| ソース取得 | **8 / 8 成功** | 8 / 8 成功 |

**取得サイズ**

| ソース | 今日 | 前日 | 差 |
|---|---|---|---|
| Claude Code CHANGELOG | 1,104,632 | 1,104,632 | 0 |
| Claude Code ドキュメント目次 | 63,679 | 63,679 | 0 |
| Platform リリースノート | **135,456** | 133,980 | +1,476 |
| Platform ドキュメント目次 | **91,500** | 90,932 | +568 |
| モデル概要 | 22,852 | 22,852 | 0 |
| モデル廃止一覧 | 14,620 | 14,620 | 0 |
| 価格表 | 53,451 | 53,451 | 0 |

**新しい API の制限のまとめ**（一次情報から）

| 項目 | 内容 |
|---|---|
| ベータヘッダ | **`analytics-usage-cost-2026-08-24`**（毎回必要） |
| エンドポイント | `GET /v1/organizations/analytics/usage`（トークン数とリクエスト数）/ `GET /v1/organizations/analytics/cost`（USD の費用） |
| 対象期間の開始 | **2026年1月1日以降かつ直近365日以内** |
| 1回の最大期間 | **31日**（1分区切りのときは **24時間**） |
| 時間の区切り | **1分 / 1時間 / 1日**（UTC 基準） |
| グループ化の軸 | **最大5つ** |
| 1フィルタの値 | **最大100個** |
| データの鮮度 | **通常4時間以内、最大24時間。値は月末から約7日後まで改定されうる** |
| 認証（Console） | Admin API キー、または `org:admin` スコープの OAuth トークン |
| 認証（Enterprise） | **`read:analytics` スコープのキー**（primary owner が claude.ai で作成） |

モデルの状態: **変更なし。** 価格も変更なし。

| モデル | 状態 | 停止日 | 入力 / 出力（1Mトークンあたり） |
|---|---|---|---|
| claude-fable-5-1 / claude-mythos-5-1 | 現行 | 2027-09-01 以降 | $10 / $50 |
| claude-fable-5 / claude-mythos-5 | 現行 | 2027-06-09 以降 | $10 / $50 |
| claude-mythos-preview | 廃止予告 | 未定 | — |
| claude-opus-5-5 | 現行 | 2027-09-22 以降 | $4 / $20 |
| **claude-opus-5**（原さんの使用モデル） | **現行** | 2027-07-24 以降 | **$5 / $25** |
| claude-opus-4-8 | 現行 | 2027-05-28 以降 | $5 / $25 |
| claude-opus-4-7 | 現行 | 2027-04-16 以降 | $5 / $25 |
| claude-opus-4-6 | 現行 | 2027-02-05 以降 | $5 / $25 |
| claude-opus-4-5-20251101 | 現行 | 2026-11-24 以降 | $5 / $25 |
| claude-sonnet-5-5 | 現行 | 2027-09-28 以降 | $2 / $10 |
| claude-sonnet-5 | 現行 | 2027-06-30 以降 | $2 / $10 |
| claude-sonnet-4-6 | 現行 | 2027-02-17 以降 | $3 / $15 |
| claude-sonnet-4-5-20250929 | 廃止予告 | **2026-11-30** | $3 / $15 |
| claude-haiku-5-5 | 現行 | 2027-10-07 以降 | $0.10 / $0.50（10万トークン超は $0.50 / $2.50） |
| claude-haiku-4-5-20251001 | 現行 | 2026-10-15 以降（過ぎました） | $1 / $5 |
| claude-opus-4-1 / 4, claude-sonnet-4, claude-3-7-sonnet, claude-3-5-haiku, claude-3-haiku | 停止済み | — | — |

**Claude Haiku 4.5 について**: 期限（10月15日）を過ぎて15日目です。**廃止予告は今日時点でも出ていません。**

**近づいている日付**

| 日付 | 内容 | 残り |
|---|---|---|
| 2026-11-24 | Claude Opus 4.5 の「これより前には停止しない」日 | 25日 |
| **2026-11-30** | **Claude Sonnet 4.5 が API から停止** | **31日** |
| **2026-12-14** | **単独版 Claude Design が閉鎖** | **45日** |

---

## ⑥ 🔗 出典

取得できた一次情報（**8/8 成功**）

- Claude Platform リリースノート（**新規2日分**: 10月29日付と10月28日付）
- Claude Platform ドキュメント目次（**+5ページ、改名1件**）
- **Claude Platform ドキュメント「Usage and Cost Analytics API」本文**（`platform.claude.com/docs/en/manage-claude/usage-cost-analytics-api`、73,561バイト取得）— ②③⑤の新しい API に関する記述は、すべてこのページからの引用です
- Claude Code CHANGELOG — **変更なし**（2.1.312 が最新のまま）
- npm `@anthropic-ai/claude-code` 最新版情報 — **変更なし**（2.1.312）
- Claude Code ドキュメント目次 — **変更なし**
- モデル概要（`models-overview.md`）— **変更なし**
- モデル廃止一覧（`model-deprecations.md`）— **変更なし**
- 価格表（`pricing.md`）— **変更なし**

補足（未確認・二次情報）

WebSearch で1件検索しました（Anthropic の10月29日の発表）。**新しい一次情報は得られませんでした。**（このクラウド環境から anthropic.com / claude.com への接続はブロックされています。）

- **10月29日付の発表は見つかりませんでした。** 検索結果は2025年5月の Claude Opus 4 の発表、2025年8月の Opus 4.1（SWE-bench Verified で 74.5%）など、**古い項目ばかり**でした。**新しい情報はありません**

過去数日から持ち越しの未確認分（Claude Cowork のクラウド実行への移行と「Only on your computer」設定の削除、Claude for Government、Claude Frontier Academy の1億ドル、Claude Dashboards と Claude Motion の beta、Docs / Slides / Design の beta 終了と全プラン提供、Claude for Google Workspace、Project Glasswing の 129,000件、利用規約の更新、量子回路の研究、NIST 暗号のシード値の件、中間選挙への対応、Genesis Mission の1億5,000万ドル、Anthropic Public Benefit Fund、サソリの神経毒の研究、Claude が Anthropic のモデル研究開発の26%を主導、ART 酵素の先行性をめぐる争い、Claude Code projects のベータ、Claude for Small Business、Claude for Financial Advisors、Claude Design の移行の詳細、user profiles の料金とベータヘッダの詳細、第3四半期の決算と IPO の時期、Claude Tag の6月の立ち上げの詳細、Morning Brief の提供範囲、広告を入れない方針）は、今日も一次ソースに現れていません。**引き続き未確認**です。

**昨日からの持ち越しで、今日分かったこと**: 昨日「プラグインの配布元の説明から『デモ用』が消えたが、ページが消えたのかは目次だけでは分からない」と書きました。**今日は Claude Code のドキュメント目次に変更がなかったので、新しい情報はありません。引き続き未確定**です。

---

過去のダイジェスト一覧は [INDEX.md](INDEX.md) を参照してください。
