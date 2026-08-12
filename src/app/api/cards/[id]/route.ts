import { NextResponse } from "next/server";
import { deleteCard, getCard, updateCard } from "@/lib/db";
import { parseTags } from "@/lib/form";
import { deleteCardImage } from "@/lib/upload";
import { CARD_TEXT_FIELDS, type CardInput } from "@/lib/types";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

async function readId(context: Context): Promise<number | null> {
  const id = Number((await context.params).id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

const NOT_FOUND = NextResponse.json({ error: "名刺が見つかりません。" }, { status: 404 });

export async function GET(_request: Request, context: Context) {
  const id = await readId(context);
  const card = id ? getCard(id) : null;
  return card ? NextResponse.json({ card }) : NOT_FOUND;
}

export async function PUT(request: Request, context: Context) {
  const id = await readId(context);
  const existing = id ? getCard(id) : null;
  if (!existing || !id) return NOT_FOUND;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON の解析に失敗しました。" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "オブジェクトを送信してください。" }, { status: 400 });
  }

  // Partial update: fields absent from the body keep their stored value.
  const source = body as Record<string, unknown>;
  const input = {} as CardInput;
  for (const field of CARD_TEXT_FIELDS) {
    const value = source[field];
    input[field] = typeof value === "string" ? value.trim() : existing[field];
  }
  input.tags = Array.isArray(source.tags)
    ? parseTags(source.tags.filter((t): t is string => typeof t === "string").join(","))
    : typeof source.tags === "string"
      ? parseTags(source.tags)
      : existing.tags;

  // Image ownership stays with the upload handler.
  input.imagePath = existing.imagePath;

  if (!input.name) {
    return NextResponse.json({ error: "name は必須です。" }, { status: 400 });
  }

  const card = updateCard(id, input);
  return card ? NextResponse.json({ card }) : NOT_FOUND;
}

export async function DELETE(_request: Request, context: Context) {
  const id = await readId(context);
  const deleted = id ? deleteCard(id) : null;
  if (!deleted) return NOT_FOUND;

  if (deleted.imagePath) await deleteCardImage(deleted.imagePath);
  return NextResponse.json({ card: deleted });
}
