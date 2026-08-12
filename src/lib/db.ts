import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import type { Card, CardInput, SortKey } from "./types";
import { CARD_TEXT_FIELDS } from "./types";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = process.env.MEISHI_DB_PATH ?? path.join(DB_DIR, "cards.db");

type CardRow = {
  [K in (typeof CARD_TEXT_FIELDS)[number]]: string;
} & {
  id: number;
  tags: string;
  createdAt: string;
  updatedAt: string;
};

let db: DatabaseSync | null = null;

function connect(): DatabaseSync {
  if (db) return db;

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const conn = new DatabaseSync(DB_PATH);
  conn.exec("PRAGMA journal_mode = WAL");
  conn.exec("PRAGMA foreign_keys = ON");
  conn.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      nameKana    TEXT NOT NULL DEFAULT '',
      company     TEXT NOT NULL DEFAULT '',
      department  TEXT NOT NULL DEFAULT '',
      jobTitle    TEXT NOT NULL DEFAULT '',
      email       TEXT NOT NULL DEFAULT '',
      phone       TEXT NOT NULL DEFAULT '',
      mobile      TEXT NOT NULL DEFAULT '',
      fax         TEXT NOT NULL DEFAULT '',
      website     TEXT NOT NULL DEFAULT '',
      postalCode  TEXT NOT NULL DEFAULT '',
      address     TEXT NOT NULL DEFAULT '',
      tags        TEXT NOT NULL DEFAULT '',
      notes       TEXT NOT NULL DEFAULT '',
      metAt       TEXT NOT NULL DEFAULT '',
      imagePath   TEXT NOT NULL DEFAULT '',
      createdAt   TEXT NOT NULL,
      updatedAt   TEXT NOT NULL
    )
  `);
  conn.exec("CREATE INDEX IF NOT EXISTS idx_cards_company ON cards(company)");
  conn.exec("CREATE INDEX IF NOT EXISTS idx_cards_updatedAt ON cards(updatedAt)");

  db = conn;
  return conn;
}

/** Tags round-trip as a comma-joined string; empty entries are dropped. */
function serializeTags(tags: string[]): string {
  return [...new Set(tags.map((t) => t.trim()).filter(Boolean))].join(",");
}

function deserializeTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function toCard(row: CardRow): Card {
  return {
    ...row,
    tags: deserializeTags(row.tags),
  };
}

export type ListOptions = {
  query?: string;
  tag?: string;
  sort?: SortKey;
};

const SORT_CLAUSES: Record<SortKey, string> = {
  // Fall back to the name itself when no kana reading was entered.
  name: "CASE WHEN nameKana <> '' THEN nameKana ELSE name END COLLATE NOCASE ASC",
  company: "company = '' ASC, company COLLATE NOCASE ASC, name COLLATE NOCASE ASC",
  metAt: "metAt = '' ASC, metAt DESC, updatedAt DESC",
  createdAt: "createdAt DESC",
  updatedAt: "updatedAt DESC",
};

/** Columns a free-text query is matched against. */
const SEARCH_COLUMNS = [
  "name",
  "nameKana",
  "company",
  "department",
  "jobTitle",
  "email",
  "phone",
  "mobile",
  "address",
  "tags",
  "notes",
] as const;

export function listCards({ query = "", tag = "", sort = "updatedAt" }: ListOptions = {}): Card[] {
  const conn = connect();
  const where: string[] = [];
  const params: string[] = [];

  const trimmed = query.trim();
  if (trimmed) {
    // Every whitespace-separated term must match somewhere (AND across terms,
    // OR across columns), so "山田 営業" narrows instead of widening.
    for (const term of trimmed.split(/\s+/)) {
      where.push(`(${SEARCH_COLUMNS.map((c) => `${c} LIKE ? ESCAPE '\\'`).join(" OR ")})`);
      const like = `%${escapeLike(term)}%`;
      for (let i = 0; i < SEARCH_COLUMNS.length; i++) params.push(like);
    }
  }

  if (tag.trim()) {
    // tags is stored comma-joined, so match on a padded copy to avoid partial hits.
    where.push(`(',' || tags || ',') LIKE ? ESCAPE '\\'`);
    params.push(`%,${escapeLike(tag.trim())},%`);
  }

  const sql = [
    "SELECT * FROM cards",
    where.length ? `WHERE ${where.join(" AND ")}` : "",
    `ORDER BY ${SORT_CLAUSES[sort] ?? SORT_CLAUSES.updatedAt}`,
  ]
    .filter(Boolean)
    .join(" ");

  const rows = conn.prepare(sql).all(...params) as unknown as CardRow[];
  return rows.map(toCard);
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export function getCard(id: number): Card | null {
  const conn = connect();
  const row = conn.prepare("SELECT * FROM cards WHERE id = ?").get(id) as unknown as
    | CardRow
    | undefined;
  return row ? toCard(row) : null;
}

export function createCard(input: CardInput): Card {
  const conn = connect();
  const now = new Date().toISOString();
  const columns = [...CARD_TEXT_FIELDS, "tags", "createdAt", "updatedAt"];
  const values = [
    ...CARD_TEXT_FIELDS.map((f) => input[f] ?? ""),
    serializeTags(input.tags ?? []),
    now,
    now,
  ];

  const stmt = conn.prepare(
    `INSERT INTO cards (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
  );
  const { lastInsertRowid } = stmt.run(...values);
  return getCard(Number(lastInsertRowid))!;
}

export function updateCard(id: number, input: CardInput): Card | null {
  const conn = connect();
  if (!getCard(id)) return null;

  const columns = [...CARD_TEXT_FIELDS, "tags", "updatedAt"];
  const values = [
    ...CARD_TEXT_FIELDS.map((f) => input[f] ?? ""),
    serializeTags(input.tags ?? []),
    new Date().toISOString(),
  ];

  conn
    .prepare(`UPDATE cards SET ${columns.map((c) => `${c} = ?`).join(", ")} WHERE id = ?`)
    .run(...values, id);
  return getCard(id);
}

export function deleteCard(id: number): Card | null {
  const conn = connect();
  const existing = getCard(id);
  if (!existing) return null;
  conn.prepare("DELETE FROM cards WHERE id = ?").run(id);
  return existing;
}

/** All distinct tags in use, with how many cards carry each. */
export function listTags(): { tag: string; count: number }[] {
  const conn = connect();
  const rows = conn.prepare("SELECT tags FROM cards WHERE tags <> ''").all() as unknown as {
    tags: string;
  }[];

  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const tag of deserializeTags(row.tags)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "ja"));
}

export function countCards(): number {
  const conn = connect();
  const row = conn.prepare("SELECT COUNT(*) AS n FROM cards").get() as unknown as { n: number };
  return row.n;
}
