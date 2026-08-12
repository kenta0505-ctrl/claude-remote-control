import test, { after, before, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// The store resolves its file at import time, so point it at a scratch DB first.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "meishi-test-"));
process.env.MEISHI_DB_PATH = path.join(tmpDir, "test.db");

const { createCard, deleteCard, getCard, listCards, listTags, countCards, updateCard } =
  await import("../src/lib/db");
const { EMPTY_CARD_INPUT } = await import("../src/lib/types");

after(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

function make(overrides: Partial<typeof EMPTY_CARD_INPUT> = {}) {
  return createCard({ ...EMPTY_CARD_INPUT, name: "名無し", ...overrides });
}

describe("card store", () => {
  before(() => {
    make({
      name: "山田 太郎",
      nameKana: "ヤマダ タロウ",
      company: "株式会社サンプル",
      department: "営業部",
      email: "yamada@example.com",
      tags: ["取引先", "展示会2026"],
      metAt: "2026-08-01",
    });
    make({
      name: "佐藤 花子",
      nameKana: "サトウ ハナコ",
      company: "テック合同会社",
      tags: ["取引先"],
      metAt: "2026-07-15",
    });
    make({ name: "無所属 三郎", nameKana: "ムショゾク サブロウ", notes: "紹介経由で面識あり" });
  });

  test("stores and reads back every field", () => {
    const created = make({
      name: "検証 四郎",
      jobTitle: "CTO",
      tags: ["a", "b"],
      notes: "メモ",
    });
    const fetched = getCard(created.id);
    assert.equal(fetched?.name, "検証 四郎");
    assert.equal(fetched?.jobTitle, "CTO");
    assert.deepEqual(fetched?.tags, ["a", "b"]);
    deleteCard(created.id);
  });

  test("free-text search spans several columns", () => {
    assert.equal(listCards({ query: "サンプル" }).length, 1);
    assert.equal(listCards({ query: "yamada@example.com" }).length, 1);
    assert.equal(listCards({ query: "紹介経由" }).length, 1);
  });

  test("multiple terms narrow the result instead of widening it", () => {
    assert.equal(listCards({ query: "山田 営業" }).length, 1);
    assert.equal(listCards({ query: "山田 テック" }).length, 0);
  });

  test("LIKE wildcards in a query are treated literally", () => {
    assert.equal(listCards({ query: "%" }).length, 0);
    assert.equal(listCards({ query: "_" }).length, 0);
  });

  test("tag filter matches whole tags only", () => {
    assert.equal(listCards({ tag: "取引先" }).length, 2);
    assert.equal(listCards({ tag: "取引" }).length, 0);
    assert.equal(listCards({ tag: "展示会2026" }).length, 1);
  });

  test("tags are deduplicated and blanks dropped", () => {
    const card = make({ name: "重複 太郎", tags: ["x", "x", " ", "y"] });
    assert.deepEqual(getCard(card.id)?.tags, ["x", "y"]);
    deleteCard(card.id);
  });

  test("kana sort falls back to the name when no reading is stored", () => {
    const noKana = make({ name: "あああ" });
    const order = listCards({ sort: "name" }).map((c) => c.name);
    assert.equal(order[0], "あああ");
    deleteCard(noKana.id);
  });

  test("cards without a met date sort last", () => {
    const order = listCards({ sort: "metAt" }).map((c) => c.metAt);
    assert.deepEqual(order.slice(0, 2), ["2026-08-01", "2026-07-15"]);
    assert.equal(order.at(-1), "");
  });

  test("update rewrites fields and bumps updatedAt", async () => {
    const card = make({ name: "更新 前", tags: ["old"] });
    await new Promise((r) => setTimeout(r, 5));
    const updated = updateCard(card.id, { ...EMPTY_CARD_INPUT, name: "更新 後", tags: ["new"] });
    assert.equal(updated?.name, "更新 後");
    assert.deepEqual(updated?.tags, ["new"]);
    assert.equal(updated?.createdAt, card.createdAt);
    assert.ok(updated!.updatedAt > card.updatedAt);
    deleteCard(card.id);
  });

  test("missing ids are reported rather than invented", () => {
    assert.equal(getCard(999_999), null);
    assert.equal(updateCard(999_999, EMPTY_CARD_INPUT), null);
    assert.equal(deleteCard(999_999), null);
  });

  test("delete removes exactly one card", () => {
    const before = countCards();
    const card = make({ name: "削除 対象" });
    assert.equal(countCards(), before + 1);
    assert.equal(deleteCard(card.id)?.name, "削除 対象");
    assert.equal(countCards(), before);
  });

  test("tag list counts usage", () => {
    const tags = Object.fromEntries(listTags().map((t) => [t.tag, t.count]));
    assert.equal(tags["取引先"], 2);
    assert.equal(tags["展示会2026"], 1);
  });
});
