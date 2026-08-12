"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "./auth-guard";
import { createCard, deleteCard, getCard, updateCard } from "./db";
import { parseCardForm } from "./form";
import { UploadError, deleteCardImage, saveCardImage } from "./upload";
import type { CardInput } from "./types";
import type { FormState } from "./form-state";

/**
 * Resolves the image for a submission: a newly uploaded file wins, otherwise
 * the caller may clear the image, otherwise the existing one is kept.
 * Returns the image no longer referenced so it can be cleaned up after commit.
 */
async function resolveImage(
  formData: FormData,
  input: CardInput,
): Promise<{ imagePath: string; orphaned: string }> {
  const previous = input.imagePath;
  const file = formData.get("image");
  const removeRequested = formData.get("removeImage") === "1";

  if (file instanceof File && file.size > 0) {
    const imagePath = await saveCardImage(file);
    return { imagePath, orphaned: previous };
  }
  if (removeRequested) {
    return { imagePath: "", orphaned: previous };
  }
  return { imagePath: previous, orphaned: "" };
}

export async function createCardAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const parsed = parseCardForm(formData);
  if (!parsed.ok) return { errors: parsed.errors, values: parsed.input };

  let imagePath = "";
  try {
    ({ imagePath } = await resolveImage(formData, parsed.input));
  } catch (error) {
    if (error instanceof UploadError) {
      return { errors: [error.message], values: parsed.input };
    }
    throw error;
  }

  const card = createCard({ ...parsed.input, imagePath });
  revalidatePath("/");
  redirect(`/cards/${card.id}`);
}

export async function updateCardAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return { errors: ["更新対象の名刺が見つかりません。"], values: null };
  }

  const parsed = parseCardForm(formData);
  if (!parsed.ok) return { errors: parsed.errors, values: parsed.input };

  let imagePath = "";
  let orphaned = "";
  try {
    ({ imagePath, orphaned } = await resolveImage(formData, parsed.input));
  } catch (error) {
    if (error instanceof UploadError) {
      return { errors: [error.message], values: parsed.input };
    }
    throw error;
  }

  const updated = updateCard(id, { ...parsed.input, imagePath });
  if (!updated) return { errors: ["更新対象の名刺が見つかりません。"], values: parsed.input };

  if (orphaned && orphaned !== imagePath) await deleteCardImage(orphaned);

  revalidatePath("/");
  revalidatePath(`/cards/${id}`);
  redirect(`/cards/${id}`);
}

export async function deleteCardAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) redirect("/");

  const existing = getCard(id);
  if (existing) {
    deleteCard(id);
    if (existing.imagePath) await deleteCardImage(existing.imagePath);
  }

  revalidatePath("/");
  redirect("/");
}
