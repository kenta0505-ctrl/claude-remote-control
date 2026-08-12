import type { Card } from "./types";

const CSV_COLUMNS: { key: keyof Card; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "氏名" },
  { key: "nameKana", label: "フリガナ" },
  { key: "company", label: "会社名" },
  { key: "department", label: "部署" },
  { key: "jobTitle", label: "役職" },
  { key: "email", label: "メールアドレス" },
  { key: "phone", label: "電話番号" },
  { key: "mobile", label: "携帯番号" },
  { key: "fax", label: "FAX" },
  { key: "website", label: "Webサイト" },
  { key: "postalCode", label: "郵便番号" },
  { key: "address", label: "住所" },
  { key: "tags", label: "タグ" },
  { key: "notes", label: "メモ" },
  { key: "metAt", label: "交換日" },
  { key: "createdAt", label: "登録日時" },
  { key: "updatedAt", label: "更新日時" },
];

function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join(" ") : String(value ?? "");
  // Prefix cells that a spreadsheet would evaluate as a formula.
  const guarded = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${guarded.replace(/"/g, '""')}"`;
}

export function toCsv(cards: Card[]): string {
  const rows = [
    CSV_COLUMNS.map((c) => csvCell(c.label)).join(","),
    ...cards.map((card) => CSV_COLUMNS.map((c) => csvCell(card[c.key])).join(",")),
  ];
  // BOM so Excel opens the file as UTF-8 rather than mojibake.
  return `\uFEFF${rows.join("\r\n")}\r\n`;
}

function vcardEscape(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (c) => `\\${c}`);
}

export function toVCard(card: Card): string {
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  const push = (key: string, value: string) => {
    if (value) lines.push(`${key}:${vcardEscape(value)}`);
  };

  push("FN", card.name);
  // No reliable given/family split for Japanese names, so use the full name.
  lines.push(`N:${vcardEscape(card.name)};;;;`);
  if (card.nameKana) push("X-PHONETIC-FIRST-NAME", card.nameKana);
  if (card.company || card.department) {
    lines.push(`ORG:${vcardEscape(card.company)};${vcardEscape(card.department)}`);
  }
  push("TITLE", card.jobTitle);
  if (card.email) lines.push(`EMAIL;TYPE=WORK:${vcardEscape(card.email)}`);
  if (card.phone) lines.push(`TEL;TYPE=WORK,VOICE:${vcardEscape(card.phone)}`);
  if (card.mobile) lines.push(`TEL;TYPE=CELL:${vcardEscape(card.mobile)}`);
  if (card.fax) lines.push(`TEL;TYPE=WORK,FAX:${vcardEscape(card.fax)}`);
  push("URL", card.website);
  if (card.address || card.postalCode) {
    lines.push(
      `ADR;TYPE=WORK:;;${vcardEscape(card.address)};;;${vcardEscape(card.postalCode)};`,
    );
  }
  if (card.tags.length) lines.push(`CATEGORIES:${card.tags.map(vcardEscape).join(",")}`);
  push("NOTE", card.notes);

  lines.push("END:VCARD");
  return `${lines.join("\r\n")}\r\n`;
}

/** RFC 5987 filename so non-ASCII names survive the Content-Disposition header. */
export function contentDisposition(filename: string): string {
  const ascii = filename.replace(/[^\x20-\x7e]/g, "_");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}
