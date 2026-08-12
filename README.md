# 名刺管理アプリ

受け取った名刺を登録・検索・整理するための Web アプリです。Next.js のフルスタック構成で、
データは SQLite に保存します。**外部サービスや追加のデータベースサーバーは不要**で、
`npm install && npm run dev` だけで動きます。

## できること

| 機能 | 内容 |
| --- | --- |
| 登録 | 氏名・フリガナ・会社名・部署・役職・各種連絡先・住所・タグ・メモ・交換日を登録 |
| 名刺画像 | 名刺の写真を添付（JPEG / PNG / WebP / GIF / HEIC、8MB まで）。プレビュー・差し替え・削除に対応 |
| 検索 | 氏名・会社名・メール・電話・住所・タグ・メモを横断検索。スペース区切りで絞り込み（AND 検索） |
| タグ | 複数タグを付与し、一覧からワンクリックで絞り込み。使用件数つきで表示 |
| 並び替え | 更新順 / 登録順 / フリガナ順 / 会社名順 / 交換日順 |
| 書き出し | 一覧を CSV（Excel でそのまま開ける UTF-8 BOM 付き）、個別に vCard(.vcf) |
| REST API | `/api/cards` 以下で CRUD。他ツールからの連携用 |
| ログイン | パスワード 1 つで全体を保護。公開して複数端末から使えます |

検索条件は URL に入るので、よく使う絞り込みはブックマークできます。
画面はライト / ダークテーマ、スマートフォン幅にも対応しています。

## 動かす

```bash
npm install
npm run dev          # http://localhost:3000
```

本番用:

```bash
cp .env.example .env.local   # MEISHI_PASSWORD を設定
npm run build
npm start
```

初回起動時に `data/cards.db`（SQLite）が自動生成されます。

同じ Wi-Fi のスマホから使う場合は、起動時に表示される `Network: http://192.168.x.x:3000`
をスマホのブラウザで開いてください。

## ログイン

パスワード 1 つでアプリ全体を保護します（利用者ごとのアカウントはありません）。
`.env.local` に設定します。

```bash
MEISHI_PASSWORD=8文字以上のパスワード
```

| 状況 | 挙動 |
| --- | --- |
| `npm start`（本番）でパスワード未設定 | **一切データを返しません。**API は 503、画面は設定を促すメッセージ |
| `npm start` でパスワード設定済み | 未ログインはすべて `/login` にリダイレクト（API は 401） |
| `npm run dev` でパスワード未設定 | 認証なしで動作（ローカル開発用） |
| `npm run dev` でパスワード設定済み | 本番と同じく保護されます |

- ログイン状態はセッション Cookie（HttpOnly / SameSite=Lax、HTTPS 時は Secure）で保持し、
  既定 30 日で切れます。`MEISHI_SESSION_DAYS` で変更できます。
- パスワードを間違え続けると、その接続元を一時的にロックします（5 回で 60 秒、以降は延長）。
- ログアウトはヘッダーのボタンから。
- 設定できる環境変数は [`.env.example`](.env.example) にまとめてあります。

### 認証の効かせ方

`proxy.ts`（Next.js 16 で `middleware.ts` から改称）で未認証リクエストを
先に振り分けたうえで、**すべてのページ・Server Action・API ハンドラが個別に
`requireSession()` / `requireApiAuth()` を呼びます。**proxy の matcher の
書き漏れや Server Action への直接 POST では素通りできません。

### 注意

- パスワードは全端末で共有されます。誰がどの操作をしたかは記録されません。
- インターネットに公開する場合は **HTTPS 必須**です（Cookie もパスワードも平文で流れます）。
  Caddy や Nginx などのリバースプロキシで TLS 終端してください。

## 開発コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド |
| `npm start` | 本番サーバー |
| `npm test` | ユニットテスト（Node 標準テストランナー） |
| `npm run typecheck` | 型チェック |
| `npm run lint` | Lint |

## 構成

```
src/
  proxy.ts                       未認証リクエストの振り分け
  app/
    page.tsx                     一覧・検索・タグ絞り込み
    login/page.tsx               ログイン画面
    cards/new/page.tsx           登録フォーム
    cards/[id]/page.tsx          詳細
    cards/[id]/edit/page.tsx     編集フォーム
    api/cards/route.ts           GET 一覧 / POST 作成
    api/cards/[id]/route.ts      GET / PUT / DELETE
    api/cards/[id]/vcard/route.ts  vCard 書き出し
    api/export/route.ts          CSV / vCard 一括書き出し
    api/uploads/[filename]/route.ts  名刺画像の配信
  components/                    フォーム・一覧タイル・検索 UI
  lib/
    db.ts                        SQLite アクセス（node:sqlite）
    auth.ts                      設定読み取り・パスワード照合・セッション署名
    auth-guard.ts                requireSession / requireApiAuth（実際の関門）
    auth-actions.ts              ログイン・ログアウト（試行回数制限つき）
    actions.ts                   Server Actions（登録・更新・削除）
    form.ts                      入力の検証・正規化
    upload.ts                    画像の保存・削除
    export.ts                    CSV / vCard 生成
tests/                           db・入力検証・書き出し・認証のテスト
data/                            SQLite と画像の保存先（gitignore 済み）
```

### 設計上のポイント

- **DB は Node 22 標準の `node:sqlite`。** ORM もネイティブビルドも不要なので、
  `npm install` がネットワークやコンパイル環境に左右されません。
- **画像は `public/` ではなく `data/uploads/` に保存。** Next.js は `public/` を
  ビルド時にスナップショットするため、実行時に置いたファイルは配信されません。
  保存名は UUID に固定し、`/api/uploads/[filename]` から配信しています。
- **検索状態は URL に持つ。** 一覧はプレーンな GET フォームなので、
  JavaScript が無効でも検索できます。
- **入力検証はクライアントとサーバーの両方で実施。** 検証に失敗した場合は
  入力内容を保持したままエラーを表示します。

## REST API

API もログインで保護されます。`MEISHI_API_TOKEN` を設定すると、
`Authorization: Bearer <トークン>` でスクリプトからも呼び出せます。

```bash
TOKEN=$MEISHI_API_TOKEN
AUTH="Authorization: Bearer $TOKEN"

# 一覧（q / tag / sort で絞り込み）
curl -H "$AUTH" 'http://localhost:3000/api/cards?q=山田&sort=name'

# 登録
curl -X POST http://localhost:3000/api/cards -H "$AUTH" \
  -H 'Content-Type: application/json' \
  -d '{"name":"山田 太郎","company":"株式会社サンプル","email":"yamada@example.com","tags":["取引先"]}'

# 取得 / 更新（部分更新可）/ 削除
curl -H "$AUTH" http://localhost:3000/api/cards/1
curl -X PUT http://localhost:3000/api/cards/1 -H "$AUTH" -H 'Content-Type: application/json' -d '{"jobTitle":"部長"}'
curl -X DELETE http://localhost:3000/api/cards/1 -H "$AUTH"

# 書き出し
curl -H "$AUTH" -o cards.csv 'http://localhost:3000/api/export?format=csv'
curl -H "$AUTH" -o cards.vcf 'http://localhost:3000/api/export?format=vcf'
```

画像の登録・削除は画面から行ってください（API は画像パスを受け付けません）。

## 環境変数

| 変数 | 既定値 | 用途 |
| --- | --- | --- |
| `MEISHI_PASSWORD` | （なし） | ログインパスワード。本番では必須、8 文字以上 |
| `MEISHI_SESSION_SECRET` | パスワードから導出 | セッション Cookie の署名鍵。明示するとパスワード変更後もログインが維持されます |
| `MEISHI_API_TOKEN` | （なし） | 設定すると `Authorization: Bearer` で API を利用可能に |
| `MEISHI_SESSION_DAYS` | `30` | ログインの有効期間（日数） |
| `MEISHI_SECURE_COOKIE` | 自動判定 | `1` で Cookie に Secure を強制 |
| `MEISHI_DB_PATH` | `data/cards.db` | SQLite ファイルの場所 |
| `MEISHI_UPLOAD_DIR` | `data/uploads` | 名刺画像の保存先 |

## 注意

- SQLite ファイルと名刺画像をローカルディスクに保存するため、**Vercel などの
  サーバーレス環境では動きません**（登録したデータが消えます）。永続ディスクを
  持てる環境（VPS、Fly.io の Volume、Render のディスクなど）を使ってください。
- 公開する場合は HTTPS 必須です。上の「ログイン」の注意も参照してください。

## 今後の拡張案

- 名刺画像からの OCR 自動入力（Claude API などの利用を想定し、`lib/form.ts` の
  `CardInput` にそのまま流し込める形にしてあります）
- CSV 取り込み
- 利用者ごとのアカウント（現在はパスワード 1 つの共有方式）
