import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { parseCardForm, parseTags } from "../src/lib/form";
import { toCsv, toVCard, contentDisposition } from "../src/lib/export";
import type { Card } from "../src/lib/types";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
  return data;
}

const CARD: Card = {
  id: 1,
  name: "山田 太郎",
  nameKana: "ヤマダ タロウ",
  company: "株式会社サンプル",
  department: "営業部",
  jobTitle: "部長",
  email: "yamada@example.com",
  phone: "03-1234-5678",
  mobile: "",
  fax: "",
  website: "https://example.com",
  postalCode: "100-0001",
  address: "東京都千代田区1-1-1",
  tags: ["取引先", "展示会2026"],
  notes: "改行\nあり, カンマも",
  metAt: "2026-08-01",
  imagePath: "",
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-02T00:00:00.000Z",
};

describe("parseTags", () => {
  test("splits on commas, full-width commas, and spaces", () => {
    assert.deepEqual(parseTags("a, b、c d"), ["a", "b", "c", "d"]);
  });

  test("drops blanks and duplicates", () => {
    assert.deepEqual(parseTags("  a,,a ,  b "), ["a", "b"]);
    assert.deepEqual(parseTags(""), []);
  });
});

describe("parseCardForm", () => {
  test("accepts a minimal valid card", () => {
    const result = parseCardForm(form({ name: "山田 太郎" }));
    assert.equal(result.ok, true);
    assert.equal(result.input.name, "山田 太郎");
  });

  test("requires a name", () => {
    const result = parseCardForm(form({ company: "x" }));
    assert.equal(result.ok, false);
    assert.ok(result.ok === false && result.errors.includes("氏名は必須です。"));
  });

  test("rejects a malformed email but keeps what was typed", () => {
    const result = parseCardForm(form({ name: "a", email: "nope" }));
    assert.equal(result.ok, false);
    assert.equal(result.input.email, "nope");
  });

  test("rejects a malformed met date", () => {
    assert.equal(parseCardForm(form({ name: "a", metAt: "2026/08/01" })).ok, false);
    assert.equal(parseCardForm(form({ name: "a", metAt: "2026-08-01" })).ok, true);
  });

  test("adds a scheme to a bare website host", () => {
    assert.equal(parseCardForm(form({ name: "a", website: "example.com" })).input.website,
      "https://example.com");
    assert.equal(parseCardForm(form({ name: "a", website: "http://x.test" })).input.website,
      "http://x.test");
  });

  test("trims surrounding whitespace", () => {
    assert.equal(parseCardForm(form({ name: "  山田  " })).input.name, "山田");
  });
});

describe("CSV export", () => {
  test("starts with a BOM so Excel reads it as UTF-8", () => {
    assert.ok(toCsv([CARD]).startsWith("﻿"));
  });

  test("quotes embedded commas, quotes, and newlines", () => {
    const csv = toCsv([{ ...CARD, notes: 'a,b "c"\nd' }]);
    assert.ok(csv.includes('"a,b ""c""\nd"'));
  });

  test("neutralises cells a spreadsheet would run as a formula", () => {
    const csv = toCsv([{ ...CARD, name: "=SUM(A1:A2)" }]);
    assert.ok(csv.includes(`"'=SUM(A1:A2)"`));
  });

  test("joins tags into one cell", () => {
    assert.ok(toCsv([CARD]).includes('"取引先 展示会2026"'));
  });
});

describe("vCard export", () => {
  const vcf = toVCard(CARD);

  test("is a well-formed 3.0 card", () => {
    assert.ok(vcf.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n"));
    assert.ok(vcf.endsWith("END:VCARD\r\n"));
  });

  test("carries the fields a contacts app reads", () => {
    assert.ok(vcf.includes("FN:山田 太郎"));
    assert.ok(vcf.includes("ORG:株式会社サンプル;営業部"));
    assert.ok(vcf.includes("TITLE:部長"));
    assert.ok(vcf.includes("EMAIL;TYPE=WORK:yamada@example.com"));
    assert.ok(vcf.includes("TEL;TYPE=WORK,VOICE:03-1234-5678"));
    assert.ok(vcf.includes("CATEGORIES:取引先,展示会2026"));
  });

  test("escapes newlines and separators inside values", () => {
    assert.ok(vcf.includes("NOTE:改行\\nあり\\, カンマも"));
  });

  test("omits empty fields", () => {
    assert.ok(!vcf.includes("TYPE=CELL"));
  });
});

describe("contentDisposition", () => {
  test("provides both an ASCII fallback and a UTF-8 name", () => {
    const header = contentDisposition("名刺一覧.csv");
    assert.ok(header.includes('filename="____.csv"'));
    assert.ok(header.includes("filename*=UTF-8''%E5%90%8D%E5%88%BA%E4%B8%80%E8%A6%A7.csv"));
  });
});
