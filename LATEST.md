<!-- このファイルは scripts/finalize.sh が自動生成します。直接編集しないでください。 -->
<!-- 編集する場合は digests/2026-11-12.md を直してから finalize.sh を再実行してください。 -->

# 2026-11-12（木）Claude 更新ダイジェスト

## ① 今日の要点

**ずっと追っていた「Claude Desktop の11月10日の変更」の中身が、今日の Web 検索でようやく出てきました。** ただし**一次情報としては取れていません（未確認）**。②に詳しく書きます。

- **Claude Code は 2.1.322 のまま。CHANGELOG に新規項目はゼロ**です
- **Platform のリリースノートに1件追加**（**Dreams が Claude Fable 5.2 に対応**）
- **モデル一覧に「全モデルの一覧表」が新設されました。** 全21モデルの文脈窓・最大出力・価格が1つの表になりました
- **Amazon Bedrock の呼び方が変わりました。** 「Opus 4.7 以降」「Opus 4.6 以前」という呼び分けが、**`bedrock-mantle` / `bedrock-runtime`** という名前に置き換わりました。**Fable 5.2 の Bedrock の ID も変わっています**
- **価格表で、Claude Opus 4.8 の Fast mode の表記が「research preview」から「deprecated（廃止予告）」に変わりました。** ずっと定点観測していた箇所が、ようやく動きました
- **価格は1つも変わっていません**（価格表の `$` の出現回数を昨日と突き合わせて確認。完全に一致しました）

---

## ② ⚠️ 今の使い方が変わるもの

### 1. 【未確認・ただし内容は具体的】Claude Desktop の11月10日の変更は「Unified Claude（統合された Claude）」でした

**先に、情報の出どころをはっきりさせます。**

- **一次情報として自分で取得できたのは、11月7日の Claude Code 2.1.319 の CHANGELOG の1行だけ**です（「`desktopHome` がないのに `coworkTabEnabled: false` または `chatSessionRetentionDays` に依存しているポリシーに起動時の警告を追加。**Claude Desktop の11月10日の変更に先立つもの**」）
- **以下の内容は、今日の Web 検索で得たものです。** **検索結果は「Anthropic の公式ドキュメントに書かれている」と述べていますが、そのページ（`claude.com/docs/third-party/claude-desktop/configuration-changelog`）は、このクラウド環境からブロックされていて自分では開けません。** **したがって未確認です**
- **さらに、検索結果自身が次の但し書きを付けています**: 「**検索結果の日付情報が今日（2026年11月11日）と食い違っている。例えば11月10日の項目が『124日前』『119日前』と表示されている。内容に書かれている日付のほうを採った**」

**以上を踏まえたうえで、検索で出てきた内容を、間引かずに書きます。**

**（1）11月10日の正午（太平洋時間）から、`desktopHome` が設定されていない場合、次の起動で「Unified Claude」が開きます**

- **`coworkTabEnabled` が false でない場合**: **Chat と Advanced file analysis（高度なファイル分析）が、Cowork と一緒にオンになります。** **`chatTabEnabled` や `chatAdvancedFileAnalysisEnabled` が false であってもオンになります**
- **`coworkTabEnabled` が false の場合**: **Cowork・Chat・Advanced file analysis は、今のままの状態（オンならオン、オフならオフ）で変わりません**

**（2）保存期間の設定が分かれました**

- **新しい会話のうち Cowork のタスクであるものは、`coworkSessionRetentionDays` で削除されます。`chatSessionRetentionDays` ではありません。** **両方を設定してください**と書かれています
- **Cowork がオンで `chatSessionRetentionDays` だけを設定している組織は、今の見え方のままになります**

**（3）`coworkTabEnabled` は廃止予告になりました（未確認の日付が2つ増えます）**

- **`coworkTabEnabled` は 2026年12月17日まで受け付けられます。** 以後は **`desktopHome` を使ってください**
- **11月17日から、まだ `coworkTabEnabled` を設定している利用者に警告が表示されます**

**（4）第三者の手引きからの注意**

- **オランダ語の手引きが「`desktopHome` の値は小文字で書くこと」と注意しています。** **`Standard` のような知らない値は、アプリがオフとして読む**ためだそうです（**これは第三者の記事です。公式の記述かどうかは確認できていません**）

**用語を一言で**:

- **「Unified Claude」**: **Chat（ふつうの会話）と Cowork（Claude に作業を任せる機能）が、1つの画面にまとまったもの**です
- **「`desktopHome`」**: **デスクトップアプリを開いたときに、最初に何を表示するか**を決める設定です
- **「`coworkTabEnabled`」**: **Cowork のタブを表示するかどうか**の設定です
- **「Advanced file analysis（高度なファイル分析）」**: **アップロードしたファイルを Claude が詳しく解析する機能**です
- **「太平洋時間の正午」**: **日本時間では11月11日の午前5時**です（11月なので太平洋標準時。日本との差は17時間）

**昨日の報告とのつながり**: **昨日、Web 検索で「Chat と Cowork が1つの選択タブにまとめられた」「Chat と Cowork のプロジェクトが1つの Projects タブに統合された」というユーザーの報告を拾いました。** **今日出てきた「Unified Claude」の説明と、話が合っています。** **ただし、どちらも未確認です。** 「同じことを指している」と断定はしません。

**原さんへの関係**: **これらの設定（`desktopHome`・`coworkTabEnabled`・`chatSessionRetentionDays`）は、組織の管理者がデスクトップアプリに適用するもの**です。**原さんの個人アカウントには設定されていないはずなので、「`desktopHome` が設定されていない」状態にあたります。** **その場合「次の起動で Unified Claude が開く」ことになります。** **つまり、デスクトップアプリの見た目が変わる可能性があります。** **ただし、ここまで全部 未確認です。実際にどう見えるかは、原さんがアプリを開けば分かります。**

**引き続き、一次情報が取れるかを毎日見ていきます。**

### 2. Claude Opus 4.8 の Fast mode が、価格表でも「廃止予告」になりました

**価格表の Fast mode の節が、今日書き換わりました。**

**昨日まで**:
> Fast mode は Claude Fable 5.2、Claude Opus 5.5、Claude Opus 5、Claude Opus 4.8 に、割増料金でかなり速い出力を提供します。**Claude Opus 5 と Claude Opus 4.8 の Fast mode は research preview です**

**今日から**:
> Fast mode は、割増料金で**出力のトークン毎秒を最大2.5倍**にします。**Claude Fable 5.2、Claude Opus 5.5、Claude Opus 5、Claude Opus 4.8 で使えます。** **Fast mode は Claude Opus 5 では research preview、Claude Opus 4.8 では deprecated（廃止予告）です**

**何が変わったか**: **Opus 4.8 の Fast mode が「research preview（試験提供）」という扱いから、「deprecated（廃止予告）」という扱いに、価格表の上でも変わりました。**

**これは新しい決定ではありません。** **11月1日のリリースノートに「2026年11月30日に削除する」と既に書かれていたもの**で、**価格表の表記がそれに追いついた**ということです。**削除まで18日です。**

**原さんへの関係**: **ありません。** 原さんは Opus 5 を使っていて、API の Fast mode は使っていません。

### 3. 日付が決まっているもの

| 日付 | 内容 | 残り |
|---|---|---|
| **2026-11-17** | **`coworkTabEnabled` を設定している利用者に警告が出始める**（**未確認**） | **5日** |
| 2026-11-24 | Claude Opus 4.5 の「これより前には停止しない」日 | 12日 |
| **2026-11-30** | **Claude Sonnet 4.5 が API から停止** | **18日** |
| **2026-11-30** | **Claude Opus 4.8 の Fast mode が削除**（削除後はエラー。標準速度にフォールバックしません） | **18日** |
| **2026-12-14** | **単独版 Claude Design が閉鎖** | **32日** |
| **2026-12-17** | **`coworkTabEnabled` が受け付けられる最終日**（**未確認**） | **35日** |

### 4. 日付のないもの（持ち越し）

- **API バージョン `2026-10-21`** では `temperature`・`top_p`・`top_k` が**全モデルで使えなくなります**（既定値を送っても 400 エラー）。SDK のライセンスが MIT から Apache 2.0 に変わりました
- **Claude Fable 5.2 / Mythos 5.2** に乗り換えるときの注意: **prefix check が全アカウントで強制**、**古い `computer_20251124` は 400 エラー**、**advisor tool は 5.2 系どうしのみ**、**30日間のデータ保持が必須**（ZDR では使えません）、**思考内容はアカウントに紐づく**
- **Fable 5.1 を選んでいた人は、Pro と Max では自動で 5.2 に移されます**（戻すには `/model claude-fable-5-1`）
- **Claude が書いた mod が、auto モードと bypass モードでは確認なしに有効化されます**（11月10日の 2.1.321）
- **「Ultra」プラン**（月額 API クレジット $200、Max は $100）。**開始日と Max との関係は、今日も書かれていません**（**18日目**）
- **IP 許可リスト**が beta で使えます（組織の管理者向け。**締め出しに注意**）
- **Claude が書いた文章に透かし**が入ります（対象は Claude Mythos 5・Opus 4.7・Sonnet 4.6）

**原さんの使用モデルは Claude Opus 5 で、価格は $5 / $25（100万トークンあたり）のまま変わっていません。**

---

## ③ 今日の変更（説明つき）

### 1. Dreams が Claude Fable 5.2 に対応しました

**Platform リリースノートの11月9日の節に、今日1件追加されました。**

> **Dreams**（research preview）が **Claude Fable 5.2** に対応しました

**「Dreams」とは**: **Anthropic が用意している「managed agents（預かり型のエージェント）」の1つ**です。**自分でサーバーを用意しなくても、Anthropic 側で動くエージェント**という仕組みです。**research preview（試験提供）**の段階です。

**これまでの経緯**（リリースノートに残っている記録です）:

- 以前: **Claude Opus 5** に対応
- その後: **Claude Opus 5.5、Claude Fable 5.1、Claude Sonnet 5.5** に対応
- **今日: Claude Fable 5.2 に対応**

**なお、これは「Dreams の対応モデルの完全な一覧」ではありません。** リリースノートは「追加された」という記録なので、**今どれが使えるかの全体像は、Dreams のドキュメントページを見ないと分かりません。** **そのページはこの環境から取得対象になっていないので、引き続き未確認です。**

**原さんへの関係**: **ありません。** API を自分で呼ぶ人向けの機能です。

### 2. モデル一覧に「全モデルの一覧表」ができました

**モデル概要のページが、22,973バイト → 29,196バイト（+6,223）と大きく増えました。** **構成が変わったためです。**

**これまで**: 「Compare models（モデルを比べる）」という節に、**最新4モデル（Fable 5.2・Opus 5.5・Sonnet 5.5・Haiku 5.5）の詳しい比較表**があり、その下に**「Legacy models（旧版。まだ使えます）」という名前の羅列が1行**だけありました。

**今日から**: **節の名前が「Latest models（最新のモデル）」に変わり**、その下に**「All models（すべてのモデル）」という新しい節と表**ができました。**旧版の羅列1行は、この表に置き換わりました。**

**新しい表には、全21モデルについて「文脈窓・最大出力・入力価格・出力価格」が並んでいます。**

| モデル | 文脈窓 | 最大出力 | 入力 | 出力 |
|---|---|---|---|---|
| Claude Fable 5.2 | 100万 | 12万8千 | $8 | $40 |
| Claude Opus 5.5 | 100万 | 12万8千 | $4 | $20 |
| Claude Sonnet 5.5 | 100万 | 12万8千 | $2 | $10 |
| Claude Haiku 5.5 | 100万 | 12万8千 | $0.10〜 | $0.50〜 |
| Claude Mythos 5.2（限定提供） | 100万 | 12万8千 | $8 | $40 |
| Claude Fable 5.1 | 100万 | 12万8千 | $10 | $50 |
| Claude Mythos 5.1（限定提供） | 100万 | 12万8千 | $10 | $50 |
| Claude Fable 5 | 100万 | 12万8千 | $10 | $50 |
| Claude Mythos 5（限定提供） | 100万 | 12万8千 | $10 | $50 |
| **Claude Opus 5**（原さんの使用モデル） | **100万** | **12万8千** | **$5** | **$25** |
| Claude Opus 4.8 | 100万 | 12万8千 | $5 | $25 |
| Claude Opus 4.7 | 100万 | 12万8千 | $5 | $25 |
| Claude Opus 4.6 | 100万 | 12万8千 | $5 | $25 |
| **Claude Opus 4.5** | **20万** | **6万4千** | $5 | $25 |
| Claude Opus 4.1（停止済み。Google managed と Bedrock を除く） | 20万 | 3万2千 | $15 | $75 |
| Claude Opus 4（停止済み。Google managed を除く） | 20万 | 3万2千 | $15 | $75 |
| Claude Sonnet 5 | 100万 | 12万8千 | $2 | $10 |
| Claude Sonnet 4.6 | 100万 | 12万8千 | $3 | $15 |
| **Claude Sonnet 4.5** | **20万** | **6万4千** | $3 | $15 |
| Claude Sonnet 4（停止済み。Google managed と Bedrock を除く） | 20万 | 6万4千 | $3 | $15 |
| **Claude Haiku 4.5** | **20万** | **6万4千** | $1 | $5 |

**この表で初めてはっきりしたこと**: **Opus 4.5・Sonnet 4.5・Haiku 4.5 の3つは、文脈窓が20万トークン**です（**今の世代の100万トークンの5分の1**）。**最大出力も6万4千で、今の世代の半分**です。**これまでのモデル概要には、この数字は最新4モデルぶんしか載っていませんでした。**

**表の下に、3つの注記が付きました**:

- **「MTok」**: 100万トークンのこと。「$5 / MTok」は「100万トークンあたり $5」
- **「限定提供」**: **Anthropic の審査プログラム（Cyber Verification Program など）で確認された組織だけが使えます。** 使いたい場合は、該当するプログラムに申し込んでください
- **「停止済み」**: **他のクラウドプラットフォームではまだ使える場合があります**

**あわせて、説明文から1文が消えました**: **「それぞれのモデルのページに、使えるプラットフォームが載っています」**という案内がなくなりました（**新しい表がその役割を引き継いだのかもしれませんが、理由は書かれていません**）。

### 3. Amazon Bedrock の呼び方が、全面的に変わりました

**Amazon Bedrock は、Amazon のクラウド経由で Claude を使う窓口**です。

**これまでは「モデルの世代で呼び分け」ていました**:

- 「Amazon Bedrock（**Opus 4.7 以降**）」
- 「Amazon Bedrock（**Opus 4.6 以前**）」

**今日からは「接続先の名前で呼び分け」になりました**:

- 「Amazon Bedrock（**mantle**）」= **`bedrock-mantle`**
- 「Amazon Bedrock（**runtime**）」= **`bedrock-runtime`**

**この変更は4つのソースに同時に入っています**: モデル廃止一覧、モデル概要、Platform ドキュメント目次、価格表。

**モデル概要の説明文も書き換わりました**:

**これまで**: 「Bedrock の Messages API のエンドポイントでの ID（**Opus 4.7 以降と Haiku 4.5**）。Bedrock の InvokeModel 経由でしか提供されないモデルは、そちらの ID を表示します」

**今日から**: 「Bedrock の **bedrock-mantle** のエンドポイントでの ID。**Bedrock が bedrock-runtime のエンドポイントでしか提供しないモデル**は、その推論プロファイル ID を表示します」

**そして、Claude Fable 5.2 の Bedrock の ID 自体が変わりました**:

- **昨日**: `anthropic.claude-fable-5-2`
- **今日**: **`global.anthropic.claude-fable-5-2`**（**先頭に `global.` が付きました**）

**さらに、11月9日のリリースノートの「どこで使えるか」の書き方も変わりました**:

- **昨日**: 「Claude API、Claude Platform on AWS、Claude Models on Google Cloud（Anthropic managed）で使えます。**Claude in Amazon Bedrock でも使えます。** Claude Models on Google Cloud（Google managed）でも使えます。Claude in Microsoft Foundry でも使えます」（**「〜でも使えます」が3回続く、やや雑な文でした**）
- **今日**: 「Claude API、**Amazon Bedrock（`bedrock-runtime`）**、Claude Platform on AWS、Claude Models on Google Cloud（Anthropic managed）、Claude Models on Google Cloud（Google managed）、Claude in Microsoft Foundry で使えます」（**1文にまとまり、Bedrock がどちらの接続先かが明記されました**）

**つまり**: **Fable 5.2 は Bedrock では `bedrock-runtime` のほう（これまで「Opus 4.6 以前」と呼ばれていたほう）で提供されている**、と書き換わりました。

**なぜこの呼び方に変えたのかは、どこにも書かれていません。** 推測はしません。

**原さんへの関係**: **ありません。** 原さんは Amazon のクラウド経由では Claude を使っていません。

### 4. キャッシュ料金の説明が、表になりました（金額は変わっていません）

**これまでは、1つの長い文の中に全モデルのキャッシュ料金が詰め込まれていました。** **今日から、表になりました。**

| モデル | キャッシュ読み出しの倍率 | 100万トークンあたり |
|---|---|---|
| Claude Fable 5.2 / Mythos 5.2 | 0.025倍 | $0.20 |
| Claude Fable 5.1 / Mythos 5.1 | 0.025倍 | $0.25 |
| Claude Opus 5.5 | 0.05倍 | $0.20 |
| Claude Sonnet 5.5 | 0.05倍 | $0.10 |
| **その他すべてのモデル** | **0.1倍** | 価格表の各モデルの欄を参照 |

**「キャッシュ」とは**: **同じ内容を何度も送るとき、2回目以降を安くする仕組み**です。**最初に保存するとき（書き込み）に割増がかかり、読み出すときが大幅に安くなります。**

**「元が取れるタイミング」も、箇条書きに整理されました**:

- **5分間の保存（書き込みは1.25倍）**: **1回読み出せば元が取れます**
- **1時間の保存（書き込みは2倍）**: **2回読み出せば元が取れます**

**上の表の中の「倍率」の表も簡略化され、「Cache read (hit)」の欄が「ほとんどのモデルで 0.1倍」という短い書き方になりました**（詳細は新しい表のほうに移りました）。

**金額は1つも変わっていません。** 価格表の `$` の出現回数を昨日と突き合わせて、**完全に一致することを確認しました。**

### 5. 「メッセージごとの effort（beta）」というページができました

**Platform のドキュメントが 900 → 901ページ（+1）。増えたのは1ページです。**

> **Per-message effort (beta)** — `https://platform.claude.com/docs/en/build-with-claude/effort-per-message.md`

**「effort」とは**: **Claude にどれくらい考えさせるかの段階**です（low / medium / high / xhigh / max）。**高くするほど、よく考えますが、遅くなり、トークンも多く使います。**

**これまでは、1回のやりとり全体で1つの effort を指定するものでした。** **新しいページの名前からすると、メッセージごとに変えられるようになるもの**と読めますが、**ページの中身は取得していないので、それ以上のことは書きません。** **ページが存在すること（HTTP 200 で返ること）は確認しました。**

**あわせて、これまでの「Effort」のページが「Overview（概要）」という表示名に変わりました**（URL は同じです）。**節が2ページ構成になったので、入口を「概要」に改名した形**です。

**原さんへの関係**: **ありません。** API を自分で呼ぶ人向けです。（原さんの環境の effort は high に設定されていますが、それは Claude Code の設定で、ここで言う beta の機能とは別です。）

### 6. Claude Code の各言語版が 228 → 203ページに。昨日の「What's New 消滅」が全言語に広がりました

**昨日、英語版の目次から「What's New（週刊まとめ）」の一覧25本（入口1本 + 週ごと24本）が丸ごと消えたことを報告しました。**

**今日、各言語版のページ数が 228 → 203 に減りました。差は25**です。**昨日消えた本数とぴったり一致します。**

**各言語版の説明文からも、「新機能」にあたる節名が消えました**:

- フランス語: Nouveautés が消えた
- ドイツ語: Neuigkeiten が消えた
- **日本語: 新機能 が消えた**（今日の表記は「はじめに, Claude Code で構築, プラグイン, 管理, 設定, リファレンス, Agent SDK, リソース」）
- 韓国語: 새로운 기능 が消えた
- ロシア語: Что нового が消えた
- ほか、イタリア語・スペイン語・中国語（簡体・繁体）・インドネシア語・ブラジルポルトガル語も同様

**ただし、ページ自体は今日も生きています。** **昨日と同じく、`whats-new/index.md` と `whats-new/2026-w37.md` に直接当たって、どちらも HTTP 200 で返ることを確認しました。**

**つまり**: **「What's New」という節が、ドキュメントの構成から外された**（目次にも載らず、ページ数にも数えられなくなった）**けれど、URL を直接叩けばまだ読める**、という状態です。

**なぜ外したのかは、どこにも書かれていません。** 推測はしません。

### 7. 「Claude SDK」が「Anthropic SDK」に呼び戻されました

**Platform ドキュメント目次の中で、2か所の名前が変わりました。**

- **「最新版の各 Claude Platform SDK と ant CLI は〜」→「最新版の各 Anthropic SDK と ant CLI は〜」**
- **「Get Claude SDK spans（Claude SDK のスパンを取得）」→「Get Anthropic SDK spans（Anthropic SDK のスパンを取得）」**（説明文も「Claude SDK で OpenTelemetry を設定」→「Anthropic SDK で OpenTelemetry を設定」）

**「SDK」とは**: **プログラムから Claude を呼ぶための、言語ごとの部品一式**です。

**何が起きたか**: **以前「Anthropic SDK」から「Claude SDK」に名前が変わっていたものが、今日「Anthropic SDK」に戻りました。** **理由はどこにも書かれていません。**

---

## ④ 一行で流すもの

**今日は「言い回しの整理」がたくさん入りました。中身が変わっていないものも、省かずに並べます。**

**ドキュメント目次の名前の変更**

- **「Versions」→「API versions」**（API のバージョンのページ。URL は同じ）

**モデル概要の文言**

- **キャッシュ読み出しの注記から、Mythos 5.2 と Mythos 5.1 の名前が消えました。** 今日の書き方は「2.5% on Claude Fable 5.2 and Claude Fable 5.1」です。**ところが価格表のほうの新しい表には、Mythos 5.2 と Mythos 5.1 が 0.025倍として載ったままです。** **2つの一次情報の書き方が食い違っています。** どちらが正しいかは書かれていないので、**判断しません。記録だけしておきます**
- 「それぞれのモデルのページに、使えるプラットフォームが載っています」という1文が削除されました

**リリースノートの過去の項目の書き直し**（**内容は変わっていません。読みやすさの手直しです**）

- **Fable 5.2 の「思考内容の引き継ぎ」の項目が、1つから2つに分けられました。** 「5.2 は他のモデルの思考を読める」と「他のモデルは 5.2 の思考を読めない」が、別々の項目になりました
- **Fable 5.1 の発表の項目**: 「Project Glasswing の参加者向けに Mythos 5.1 も」という部分が独立した文になり、**参照先が「What's new in Claude Fable 5.1」から「Claude Fable 5.1（概要ページ）」に変わりました**
- **Opus 5 の発表の項目**: 参照先が「What's new in Claude Opus 5」から「Claude Opus 5（概要ページ）」に変わりました
- **Opus 5 の「effort が xhigh / max のときは thinking を切れない」の項目**: 参照先が「What's new in Claude Opus 5」から「**Effort with thinking**」という別のページに変わりました
- **Sonnet 5 の発表の項目**: 参照先が「What's new in Claude Sonnet 5」から「Claude Sonnet 5（概要ページ）」に変わりました

**※ 上の4件はいずれも「What's new in 〜」というページへの案内が「概要ページ」などに差し替わっています。** **Claude Code 側で「What's New」が目次から外れたのと同じ時期に起きていますが、関係があるかは書かれていません。断定しません。**

**価格表の言い回しの整理**（**金額は変わっていません**）

- 「最新の価格は claude.com/pricing を**訪問してください**」→「〜**の Claude pricing のページを見てください**」
- Bedrock のエンドポイントの案内が、**「どちらの接続先を呼ぶかで分かれます」という書き方**に変わりました
- **CCU（Claude Consumption Unit）の説明**で、**「e.g.」→「for example」**、**「will be invoiced」→「is invoiced」**、**「claude.com/pricing#api」→「Claude pricing のページの API の節」**に変更（**AWS と Azure の2か所、どちらも同じ変更**）
- CCU の表の中の案内が「Claude API pricing」→「**Model pricing**」に変更（2か所）
- 「Bedrock pricing」→「**Amazon Bedrock** pricing」、「Bedrock」→「**Amazon Bedrock**」に統一
- 「tool use pricing」→「**tool use overview の中の** tool use pricing」（computer use と browser use の2か所）
- 「Vision pricing」→「**Resolution and token cost**」（2か所）
- computer use と browser use の**トークン数の説明文が、括弧書きをやめて2文に分割**（「約4,500トークン（Sonnet 5 では約4,590、他は約4,520）」→「約4,500トークン: Sonnet 5 では約4,590、他のモデルでは約4,520」）
- 「about 735 input tokens **per** tool definition」→「**for each** tool definition」
- 「Enterprise のお客様は**営業に連絡**してください」→「**営業にメール**してください」
- 「営業チームに sales@anthropic.com か Claude Console から連絡してください」→「**メールするか、Claude Console から営業に連絡してください**」（語順の入れ替え）
- 「Claude Console の platform.claude.com で」→「**Claude Console で**」（URL はリンクに）
- 「新規利用者は **a small amount of** free credits を受け取ります」→「新規利用者は **free credits** を受け取ります」（**「少額の」という言葉が消えました。金額はどちらにも書かれていません**）

**モデル廃止一覧**

- **Bedrock の2つのリンクのラベルが変わっただけ**です（「Amazon Bedrock」→「Amazon Bedrock（`bedrock-mantle`）」、「Amazon Bedrock（Opus 4.6 and earlier）」→「Amazon Bedrock（`bedrock-runtime`）」）。**表の中身（モデルの行・日付）は1行も変わっていません**（突き合わせて確認しました）

---

## ⑤ 📊 定点観測

| 項目 | 今日 | 前日 |
|---|---|---|
| Claude Code（npm） | **2.1.322**（変化なし） | 2.1.322 |
| CHANGELOG 最新 | **2.1.322**（変化なし） | 2.1.322 |
| npm と CHANGELOG | **一致** | 一致 |
| CHANGELOG の新規項目 | **0** | 1 |
| Platform リリースノートの新規項目 | **1**（**11月9日の節に追加**） | 1 |
| Platform リリースノートの先頭の日付 | **11月9日**（変化なし） | 11月9日 |
| Platform ドキュメントのページ数 | **901**（+1） | 900 |
| Claude Code ドキュメント（各言語版） | **203ページ**（-25） | 228 |
| 変更のあったソース | **6 / 8** | 5 / 8 |
| ソース取得 | **8 / 8 成功** | 8 / 8 成功 |

**取得サイズ**

| ソース | 今日 | 前日 | 差 |
|---|---|---|---|
| Claude Code CHANGELOG | 1,193,584 | 1,193,584 | **0** |
| Claude Code ドキュメント目次 | 58,034 | 58,181 | -147 |
| Platform リリースノート | 144,651 | 144,497 | +154 |
| Platform ドキュメント目次 | 100,027 | 99,918 | +109 |
| モデル概要 | 29,196 | 22,973 | **+6,223** |
| モデル廃止一覧 | 14,846 | 14,830 | +16 |
| 価格表 | 55,419 | 55,227 | +192 |
| npm のバージョン情報 | 371 | 371 | 0 |

**CHANGELOG と npm の情報は、バイト単位で昨日と完全に同一です。** **Claude Code は2日続けて 2.1.322 のまま**です。

モデル一覧（**今日の変更はありません。価格も停止日も昨日と同じです**）

| モデル | 状態 | 停止日 | 入力 / 出力（1Mトークンあたり） |
|---|---|---|---|
| claude-fable-5-2 / claude-mythos-5-2 | 現行 | 2027-11-09 以降 | $8 / $40（Fast mode $16 / $80） |
| claude-fable-5-1 / claude-mythos-5-1 | 現行 | 2027-09-01 以降 | $10 / $50 |
| claude-fable-5 / claude-mythos-5（透かしの対象） | 現行 | 2027-06-09 以降 | $10 / $50 |
| claude-mythos-preview | 廃止予告 | 未定 | — |
| claude-opus-5-5 | 現行 | 2027-09-22 以降 | $4 / $20 |
| **claude-opus-5**（原さんの使用モデル） | **現行** | 2027-07-24 以降 | **$5 / $25** |
| claude-opus-4-8 | 現行（**Fast mode は 2026-11-30 に削除。今日から価格表でも「廃止予告」表記**） | 2027-05-28 以降 | $5 / $25 |
| claude-opus-4-7（透かしの対象） | 現行（Fast mode は削除済み） | 2027-04-16 以降 | $5 / $25 |
| claude-opus-4-6 | 現行（Fast mode は削除済み） | 2027-02-05 以降 | $5 / $25 |
| claude-opus-4-5-20251101 | 現行 | 2026-11-24 以降 | $5 / $25 |
| claude-sonnet-5-5 | 現行 | 2027-09-28 以降 | $2 / $10 |
| claude-sonnet-5 | 現行 | 2027-06-30 以降 | $2 / $10 |
| claude-sonnet-4-6（透かしの対象） | 現行 | 2027-02-17 以降 | $3 / $15 |
| claude-sonnet-4-5-20250929 | 廃止予告 | **2026-11-30** | $3 / $15 |
| claude-haiku-5-5 | 現行 | 2027-10-07 以降 | $0.10 / $0.50（10万トークン超は $0.50 / $2.50） |
| claude-haiku-4-5-20251001 | 現行 | 2026-10-15 以降（過ぎました） | $1 / $5 |
| claude-haiku-3-5 | 停止済み（Google managed の Google Cloud を除く） | — | 価格表から削除済み |
| claude-opus-4-1 / 4, claude-sonnet-4, claude-3-7-sonnet, claude-3-haiku | 停止済み | — | Opus 4.1 と Sonnet 4 は価格表に残っています |

**価格は1つも変わっていません。** 価格表の `$` の出現回数を昨日と突き合わせて、**完全に一致することを確認しました**（増減ゼロ）。

**Claude Haiku 4.5 について**: 期限（10月15日）を過ぎて**28日目**です。**廃止予告は今日時点でも出ていません。**

**Claude Opus 4.8 の Fast mode について**: **今日、価格表の表記が「research preview」から「deprecated（廃止予告）」に変わりました。** **削除まで18日です。**

---

## ⑥ 🔗 出典

取得できた一次情報（**8/8 成功。6件に差分、2件は変更なし**）

- Claude Code CHANGELOG — **変更なし**（2.1.322 のまま）
- npm `@anthropic-ai/claude-code` 最新版情報 — **変更なし**（2.1.322）
- Claude Platform リリースノート — **1件追加**（Dreams が Fable 5.2 に対応。**11月9日の節に**）+ 過去の項目の書き直し5件
- Claude Platform ドキュメント目次 — **901ページ（+1）**。「Per-message effort (beta)」が新設、名前の変更4件
- Claude Code ドキュメント目次 — 各言語版が **228 → 203ページ**、説明文から「新機能」の節名が消滅
- モデル概要（`models-overview.md`）— **「All models」の表を新設（+6,223バイト）**、Bedrock の ID と説明を変更
- モデル廃止一覧（`model-deprecations.md`）— Bedrock のリンクのラベルのみ変更。**表の中身は1行も変わっていません**
- 価格表（`pricing.md`）— **Opus 4.8 の Fast mode を「廃止予告」に**、キャッシュ料金を表に、言い回しの整理多数。**金額は変更なし**

**自分で確認したこと**（一次情報。推測ではありません）

- **`whats-new/index.md` と `whats-new/2026-w37.md` が、今日も HTTP 200 で返ることを確認しました**（2日連続）
- **`effort-per-message.md` が HTTP 200 で返ることを確認しました**
- **価格表の `$` の出現回数が、昨日と完全に一致することを確認しました**
- **モデル廃止一覧の表の行が、1行も変わっていないことを確認しました**

補足（未確認・二次情報）

**WebSearch を2件行いました。**

**（1）Claude Cowork のリリースノート（11月分）** — **11月付のものは見つかりませんでした。** 一番新しいのは10月分です（未確認）:

- **「2026年10月6日以降、Pro と Max の新しい Cowork のタスクは、すべての画面でクラウドで動く。それより前に自分のパソコンで始めたタスクはローカルのまま」**
- 2026年9月16日: Cowork がすべての会話に入った
- 2026年8月25日: メモリがチャットと Cowork をまたいでクラウドで動くようになった
- 2026年7月7日: Cowork がデスクトップに加えて web とモバイルに広がった

**これは「Cowork のクラウド実行への移行」として持ち越していた項目に、部分的に答える内容です。** **ただし出どころは第三者の集約サイトなので、未確認です。** **検索結果自身が「公式のヘルプセンター（support.claude.com の記事 12138966）を確認するように」と述べています。** **その support.claude.com はこの環境からブロックされています。**

**（2）Claude Desktop の11月10日の変更** — **②に全文を書きました。** 検索結果は「Anthropic の公式ドキュメント（`claude.com/docs/third-party/claude-desktop/configuration-changelog`）にそう書かれている」と述べていますが、**そのページはこの環境からブロックされていて開けません。未確認です。** **検索結果自身が「結果の日付情報が今日と食い違っている（11月10日の項目が『124日前』『119日前』と出る）」と但し書きを付けています。**

**出典のページ**（二次情報。未確認）: [Configuration changelog（claude.com docs。**この環境からは開けません**）](https://claude.com/docs/third-party/claude-desktop/configuration-changelog)、[Unified Claude の解説（SmartScope）](https://smartscope.blog/en/blog/unified-claude-claude-desktop-changes-impact-cowork-disabled-2026/)、[Claude Desktop Cowork staat vanaf 10 november aan（nextenabler.com）](https://nextenabler.com/claude-desktop-cowork-10-november/)、[Anthropic merges chat and task work in Claude Desktop（superpowerdaily）](https://superpowerdaily.com/posts/anthropic-merges-chat-and-task-work-in-claude-desktop-s-third-party-deployments)、[Claude の変更履歴（gradually.ai）](https://www.gradually.ai/en/changelogs/claude/)

持ち越しの未確認分（**Claude Desktop の11月10日の変更の一次情報での裏取り**、**`coworkTabEnabled` の廃止日程（11月17日・12月17日）の裏取り**、**Claude Code の「What's New」が構成から外された理由**、**週刊まとめが Week 37 で止まっている理由**、**Bedrock の `mantle` / `runtime` という呼び分けに変えた理由**、**モデル概要と価格表で Mythos のキャッシュ料金の書き方が食い違っている件**、**Per-message effort の中身**、Security posture のリリースノートが11月5日の節に後から足された理由、Ultra プランがいつ始まったか・Max の $200 の段との関係（**18日目**）、Fable 5.2 が claude.ai とアプリで使えるのか、Dreams の対応モデルの完全な一覧、透かしの対象モデルとプラットフォームの完全な一覧、Text Completions のページが削除されたのか索引から外れただけなのか、Claude Haiku 3.5 だけが価格表から外れた理由、Claude for Government、Claude Frontier Academy の1億ドル、Claude Dashboards と Claude Motion の beta、Docs / Slides / Design の beta 終了と全プラン提供、Claude for Google Workspace、Project Glasswing の 129,000件、利用規約の更新、量子回路の研究、NIST 暗号のシード値の件、中間選挙への対応、Genesis Mission の1億5,000万ドル、Anthropic Public Benefit Fund、サソリの神経毒の研究、Claude が Anthropic のモデル研究開発の26%を主導、ART 酵素の先行性をめぐる争い、Claude Code projects のベータ、Claude for Small Business、Claude for Financial Advisors、Claude Design の移行の詳細、user profiles の料金とベータヘッダの詳細、第3四半期の決算と IPO の時期、Claude Tag の6月の立ち上げの詳細、Morning Brief の提供範囲、広告を入れない方針、プラグインのデモ用マーケットプレイスの扱い）は、今日も一次ソースに現れていません。**引き続き未確認**です。

---

過去のダイジェスト一覧は [INDEX.md](INDEX.md) を参照してください。
