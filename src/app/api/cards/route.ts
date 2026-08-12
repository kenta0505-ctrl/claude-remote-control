import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth-guard";
import { createCard, listCards } from "@/lib/db";
import { parseTags } from "@/lib/form";
import { CARD_TEXT_FIELDS, SORT_OPTIONS, type CardInput, type SortKey } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = await requireApiAuth();
  if (denied) return denied;

  const params = new URL(request.url).searchParams;
  const requestedSort = params.get("sort") ?? "";
  const sort: SortKey = SORT_OPTIONS.some((o) => o.value === requestedSort)
    ? (requestedSort as SortKey)
    : "updatedAt";

  const cards = listCards({
    query: params.get("q") ?? "",
    tag: params.get("tag") ?? "",
    sort,
  });
  return NextResponse.json({ cards });
}

export async function POST(request: Request) {
  const denied = await requireApiAuth();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON の解析に失敗しました。" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "オブジェクトを送信してください。" }, { status: 400 });
  }

  const source = body as Record<string, unknown>;
  const input = {} as CardInput;
  for (const field of CARD_TEXT_FIELDS) {
    const value = source[field];
    input[field] = typeof value === "string" ? value.trim() : "";
  }
  input.tags = Array.isArray(source.tags)
    ? parseTags(source.tags.filter((t): t is string => typeof t === "string").join(","))
    : typeof source.tags === "string"
      ? parseTags(source.tags)
      : [];

  // The API never accepts an image path from the client; upload goes through the UI.
  input.imagePath = "";

  if (!input.name) {
    return NextResponse.json({ error: "name は必須です。" }, { status: 400 });
  }

  const card = createCard(input);
  return NextResponse.json({ card }, { status: 201 });
}
