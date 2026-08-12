/**
 * Fills the database with realistic demo cards so the app can be shown to
 * someone without typing entries in first. Safe to re-run: it refuses to touch
 * a database that already holds cards unless --reset is passed.
 *
 *   npm run seed
 *   npm run seed -- --reset
 */
import { countCards, createCard, deleteCard, listCards } from "../src/lib/db";
import type { CardInput } from "../src/lib/types";
import { EMPTY_CARD_INPUT } from "../src/lib/types";

const DEMO_CARDS: Partial<CardInput>[] = [
  {
    name: "山田 太郎",
    nameKana: "ヤマダ タロウ",
    company: "株式会社サンプル商事",
    department: "営業本部 第一営業部",
    jobTitle: "部長",
    email: "t.yamada@sample-shoji.example",
    phone: "03-1234-5678",
    mobile: "090-1111-2222",
    website: "https://sample-shoji.example",
    postalCode: "100-0005",
    address: "東京都千代田区丸の内1-1-1 サンプルビル 8F",
    tags: ["取引先", "展示会2026", "要フォロー"],
    metAt: "2026-08-01",
    notes: "展示会のブースで名刺交換。新システムの導入を検討中とのこと。\n来月あたまに提案資料を送る約束。",
  },
  {
    name: "佐藤 花子",
    nameKana: "サトウ ハナコ",
    company: "テック合同会社",
    department: "開発部",
    jobTitle: "CTO",
    email: "hanako.sato@tech-llc.example",
    mobile: "080-3333-4444",
    website: "https://tech-llc.example",
    address: "福岡県福岡市中央区天神2-2-2",
    tags: ["取引先", "技術相談"],
    metAt: "2026-07-15",
    notes: "共通の知人の紹介。API 連携について相談を受けている。",
  },
  {
    name: "鈴木 一郎",
    nameKana: "スズキ イチロウ",
    company: "鈴木デザイン事務所",
    jobTitle: "代表",
    email: "ichiro@suzuki-design.example",
    phone: "052-987-6543",
    website: "https://suzuki-design.example",
    postalCode: "460-0008",
    address: "愛知県名古屋市中区栄3-3-3",
    tags: ["外注先", "デザイン"],
    metAt: "2026-06-20",
    notes: "パンフレットのデザインをお願いした。対応が早い。",
  },
  {
    name: "田中 美咲",
    nameKana: "タナカ ミサキ",
    company: "みらい銀行",
    department: "法人営業部",
    jobTitle: "課長代理",
    email: "m.tanaka@mirai-bank.example",
    phone: "06-5555-0000",
    postalCode: "530-0001",
    address: "大阪府大阪市北区梅田4-4-4",
    tags: ["金融", "要フォロー"],
    metAt: "2026-08-05",
    notes: "融資の相談窓口。次回は決算書を持参する。",
  },
  {
    name: "高橋 健",
    nameKana: "タカハシ ケン",
    company: "株式会社ノースロジスティクス",
    department: "物流企画",
    jobTitle: "主任",
    email: "ken.takahashi@north-logi.example",
    phone: "011-222-3333",
    mobile: "070-5555-6666",
    fax: "011-222-3334",
    address: "北海道札幌市中央区北5条西5-5-5",
    tags: ["取引先", "展示会2026"],
    metAt: "2026-08-01",
    notes: "同じ展示会で。配送コストの相談ができそう。",
  },
  {
    name: "伊藤 彩",
    nameKana: "イトウ アヤ",
    company: "彩フードサービス株式会社",
    department: "商品開発",
    jobTitle: "マネージャー",
    email: "aya.ito@aya-food.example",
    mobile: "090-7777-8888",
    tags: ["見込み客"],
    metAt: "2026-05-30",
    notes: "セミナー会場で立ち話。まずは資料送付から。",
  },
  {
    name: "渡辺 三郎",
    nameKana: "ワタナベ サブロウ",
    company: "渡辺会計事務所",
    jobTitle: "税理士",
    email: "watanabe@wtnb-tax.example",
    phone: "045-123-4567",
    postalCode: "220-0011",
    address: "神奈川県横浜市西区高島2-6-6",
    tags: ["士業"],
    notes: "顧問税理士の紹介。交換日は記録し忘れ。",
  },
  {
    name: "小林 直樹",
    nameKana: "コバヤシ ナオキ",
    company: "グリーンエナジー株式会社",
    department: "経営企画室",
    jobTitle: "室長",
    email: "n.kobayashi@green-energy.example",
    phone: "03-9999-1111",
    website: "https://green-energy.example",
    address: "東京都港区虎ノ門1-7-7",
    tags: ["見込み客", "要フォロー"],
    metAt: "2026-07-28",
    notes: "紹介経由。来期の予算取りの話が出ている。",
  },
];

function main(): void {
  const reset = process.argv.includes("--reset");
  const existing = countCards();

  if (existing > 0 && !reset) {
    console.error(
      `既に ${existing} 件の名刺が登録されています。\n` +
        "既存データを消してデモデータを入れ直すには: npm run seed -- --reset",
    );
    process.exitCode = 1;
    return;
  }

  if (reset && existing > 0) {
    for (const card of listCards()) deleteCard(card.id);
    console.log(`既存の ${existing} 件を削除しました。`);
  }

  for (const card of DEMO_CARDS) {
    createCard({ ...EMPTY_CARD_INPUT, ...card });
  }

  console.log(`デモ用の名刺を ${DEMO_CARDS.length} 件登録しました。`);
  console.log("npm run dev で http://localhost:3000 を開いてください。");
}

main();
