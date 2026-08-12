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

検索条件は URL に入るので、よく使う絞り込みはブックマークできます。
画面はライト / ダークテーマ、スマートフォン幅にも対応しています。

## 動かす

```bash
npm install
npm run dev          # http://localhost:3000
```

本番用:

```bash
npm run build
npm start
```

初回起動時に `data/cards.db`（SQLite）が自動生成されます。

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
  app/
    page.tsx                     一覧・検索・タグ絞り込み
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
    actions.ts                   Server Actions（登録・更新・削除）
    form.ts                      入力の検証・正規化
    upload.ts                    画像の保存・削除
    export.ts                    CSV / vCard 生成
tests/                           db・入力検証・書き出しのテスト
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

```bash
# 一覧（q / tag / sort で絞り込み）
curl 'http://localhost:3000/api/cards?q=山田&sort=name'

# 登録
curl -X POST http://localhost:3000/api/cards \
  -H 'Content-Type: application/json' \
  -d '{"name":"山田 太郎","company":"株式会社サンプル","email":"yamada@example.com","tags":["取引先"]}'

# 取得 / 更新（部分更新可）/ 削除
curl http://localhost:3000/api/cards/1
curl -X PUT http://localhost:3000/api/cards/1 -H 'Content-Type: application/json' -d '{"jobTitle":"部長"}'
curl -X DELETE http://localhost:3000/api/cards/1

# 書き出し
curl -o cards.csv 'http://localhost:3000/api/export?format=csv'
curl -o cards.vcf 'http://localhost:3000/api/export?format=vcf'
```

画像の登録・削除は画面から行ってください（API は画像パスを受け付けません）。

## 環境変数

| 変数 | 既定値 | 用途 |
| --- | --- | --- |
| `MEISHI_DB_PATH` | `data/cards.db` | SQLite ファイルの場所 |
| `MEISHI_UPLOAD_DIR` | `data/uploads` | 名刺画像の保存先 |

## 注意

認証機能はありません。個人・チーム内のローカル利用を想定しています。
インターネットに公開する場合は、前段に認証（リバースプロキシの Basic 認証など）を置いてください。

## 今後の拡張案

- 名刺画像からの OCR 自動入力（Claude API などの利用を想定し、`lib/form.ts` の
  `CardInput` にそのまま流し込める形にしてあります）
- CSV 取り込み
- 認証・複数ユーザー対応
