import type { CardInput } from "./types";
import { CARD_TEXT_FIELDS } from "./types";

export type ParseResult =
  | { ok: true; input: CardInput }
  | { ok: false; errors: string[]; input: CardInput };

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function parseTags(raw: string): string[] {
  return [
    ...new Set(
      raw
        // Accept commas, full-width commas, and whitespace as separators.
        .split(/[,、\s]+/)
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ];
}

/**
 * Reads a card out of a submitted form. `imagePath` is carried through from the
 * hidden field so an edit that does not re-upload keeps its existing image.
 */
export function parseCardForm(formData: FormData): ParseResult {
  const input = { tags: parseTags(text(formData, "tags")) } as CardInput;
  for (const field of CARD_TEXT_FIELDS) {
    input[field] = text(formData, field);
  }

  const errors: string[] = [];
  if (!input.name) errors.push("氏名は必須です。");
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.push("メールアドレスの形式が正しくありません。");
  }
  if (input.metAt && !/^\d{4}-\d{2}-\d{2}$/.test(input.metAt)) {
    errors.push("交換日は YYYY-MM-DD 形式で入力してください。");
  }
  if (input.website && !/^https?:\/\//i.test(input.website)) {
    // Tolerate "example.com" rather than rejecting it.
    input.website = `https://${input.website}`;
  }

  return errors.length ? { ok: false, errors, input } : { ok: true, input };
}
