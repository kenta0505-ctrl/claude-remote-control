# ローカル環境で `/chrome`（Claude in Chrome）を使えるようにする

`/chrome` は **お使いのPC上で動く Claude Code CLI** が、**同じPCのChrome**に入れた
拡張機能と通信して動く機能です。ブラウザとの通信には「ネイティブメッセージング
ホスト」というローカル専用の仕組みを使うため、クラウド（リモート）セッションから
手元のChromeには到達できません。だから web / リモートのセッションでは `/chrome` が
出てこないのが正常な挙動です。手元のPCで下記を設定してください。

（リモートセッション内でブラウザを動かしたい場合は、このリポジトリの
`bin/claude-chrome.mjs` を使ってください → [README](../README.md)）

## 1. 前提条件

| 項目 | 条件 |
| --- | --- |
| ブラウザ | Google Chrome / Microsoft Edge（Brave・Arc・Vivaldi・Opera などChromium系も可） |
| 拡張機能 | Claude in Chrome **1.0.36 以上** |
| Claude Code | インストール済み・最新版（`claude --version` で確認） |
| プラン | Anthropic直契約の Pro / Max / Team / Enterprise |
| 認証 | `/login` でのサインインが必須 |
| OS | WSL（Windows Subsystem for Linux）は非対応 |

注意点:

- **APIキーや `claude setup-token` の長期トークンで認証している場合は使えません。**
  拡張機能がその認証方式に対応していないため、`--chrome` を付けても Claude Code 側で
  Chrome連携がオフのままになります。
- Amazon Bedrock / Google Cloud Vertex / Microsoft Foundry 経由のみで使っている場合も
  対象外です。別途 claude.ai のアカウントが必要になります。

## 2. 拡張機能を入れる

Chrome ウェブストアの「Claude」拡張機能をインストールします:
<https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn>

## 3. Chrome連携つきで Claude Code を起動する

```bash
claude --chrome
```

初回だけ、連携の説明ダイアログが出ます。Enter で進めてください。
このとき Claude Code が「ネイティブメッセージングホスト」の設定ファイルを書き込みます。
**Chrome は起動時にこのファイルを読む**ので、初回に拡張機能が検出されない場合は
**Chromeを再起動**してからもう一度試してください。

## 4. 動作確認

Claude Code の中で:

```
/chrome
```

- `Status: Enabled` かつ `Extension: Installed` になっていれば成功です。
- 複数のブラウザが接続されている場合は `Select browser…` で選べます
  （Claude Code v2.1.154 以降）。

試しにこう頼んでみてください:

```
code.claude.com/docs を開いて、検索ボックスに "hooks" と入力して、
出てきた結果を教えて
```

## 5. 毎回 `--chrome` を付けたくない場合

`/chrome` を実行して **「Enabled by default」** を選ぶと、次回以降フラグなしで有効に
なります。ただしブラウザツールが常に読み込まれるぶん**コンテキスト消費が増える**ので、
気になる場合はオフに戻して必要なときだけ `--chrome` を付ける運用がおすすめです。

VS Code 拡張版では、Chrome拡張が入っていれば常に使えるためフラグは不要です。

## 6. できること

- ページを開く / クリック / フォーム入力 / スクロール
- **ログイン済みのセッションをそのまま利用**（Gmail・Notion・社内ステージング環境など）
- コンソールのエラーやDOMの状態を読んで、そのままコードを修正
- スクリーンショット保存、操作のGIF録画
- ローカルのファイルをアップロードフォームに添付（Claude Code v2.1.211 以降、
  合計10MBまで。ハードリンクが複数あるファイル＝`node_modules` 内などは拒否されます）

ログイン画面やCAPTCHAに当たると、Claude はそこで停止して手動対応を求めてきます。

### サイトごとの権限

どのサイトを閲覧・クリック・入力してよいかは **Chrome拡張機能側の設定**で管理します。
Claude Code はその設定を引き継ぎます。

### プランモードでの挙動

プランモードでは、読み取り専用の操作（`read_page`, `get_page_text`, `find`,
コンソール・ネットワークの読み取り、スクリーンショット）は確認なしで実行され、
状態を変える操作（クリック・入力・遷移・タブ操作・GIF録画）は都度承認を求められます。

## 7. うまくいかないとき

### 拡張機能が検出されない

1. `chrome://extensions` で拡張機能が**インストール済みかつ有効**か確認
2. `claude --version` で Claude Code が最新か確認
3. Chrome が起動しているか確認
4. `/chrome` →「Reconnect extension」を実行
5. それでもダメなら **Chrome と Claude Code の両方を再起動**

ネイティブメッセージングホストの設定ファイルの場所（Chromeの場合）:

| OS | パス |
| --- | --- |
| macOS | `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.anthropic.claude_code_browser_extension.json` |
| Linux | `~/.config/google-chrome/NativeMessagingHosts/com.anthropic.claude_code_browser_extension.json` |
| Windows | レジストリ `HKCU\Software\Google\Chrome\NativeMessagingHosts\` |

Edge の場合は `Google/Chrome` の部分が `Microsoft Edge` に、他のChromium系ブラウザも
それぞれの設定ディレクトリ配下の同名ファイルを読みます。

### ブラウザが反応しない

1. `alert` / `confirm` / `prompt` のダイアログが出ていないか確認（出ているとイベントが
   ブロックされます）。手動で閉じてから続行を指示してください。
2. 新しいタブを作らせてやり直す
3. `chrome://extensions` で拡張機能を一度無効→有効にする

### 長時間のセッションで切れる

拡張機能のサービスワーカーがアイドル状態になると接続が切れます。
`/chrome` →「Reconnect extension」で再接続してください。

### よくあるエラー

| エラー | 原因 | 対処 |
| --- | --- | --- |
| Browser extension is not connected | ネイティブホストが拡張機能に到達できない | Chrome と Claude Code を再起動し `/chrome` で再接続 |
| `/chrome` で Extension: Not detected | 拡張機能が未インストール／無効 | `chrome://extensions` で有効化 |
| No tab available | タブ準備前に操作した | 新しいタブを作らせて再試行 |
| Receiving end does not exist | サービスワーカーがアイドル | `/chrome` →「Reconnect extension」 |

### Windows 固有

- `EADDRINUSE`（名前付きパイプの競合）: 他の Claude Code セッションを閉じて再起動
- ネイティブホストの起動時クラッシュ: Claude Code を再インストールして設定を再生成
- セットアップ用ページが開かない: Claude Code を更新（v2.1.211 未満の既知の問題）

## 参考

- [Use Claude Code with Chrome — Claude Code Docs](https://code.claude.com/docs/en/chrome)
- [Get started with Claude in Chrome — Anthropic Help Center](https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome)
