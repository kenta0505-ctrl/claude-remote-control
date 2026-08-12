"use client";

/* eslint-disable @next/next/no-img-element -- see CardTile */
import Link from "next/link";
import { useActionState, useState } from "react";
import { EMPTY_FORM_STATE, type FormState } from "@/lib/form-state";
import { EMPTY_CARD_INPUT, FIELD_LABELS, type Card, type CardInput } from "@/lib/types";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/image-constants";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  card?: Card;
  submitLabel: string;
};

type TextFieldProps = {
  name: keyof CardInput;
  defaultValue: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
};

function TextField({ name, defaultValue, type = "text", ...rest }: TextFieldProps) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {FIELD_LABELS[name]}
        {rest.required && (
          <span style={{ color: "var(--danger)" }} aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      <input
        className="field-input"
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        {...rest}
      />
    </div>
  );
}

export default function CardForm({ action, card, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, EMPTY_FORM_STATE);

  // A rejected submission echoes its values back; otherwise start from the card.
  const initial: CardInput = state.values ?? card ?? EMPTY_CARD_INPUT;
  const existingImage = state.values?.imagePath ?? card?.imagePath ?? "";

  const [removeImage, setRemoveImage] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  function onPickImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
    if (file) setRemoveImage(false);
  }

  return (
    <form action={formAction} className="space-y-6">
      {card && <input type="hidden" name="id" value={card.id} />}
      <input type="hidden" name="imagePath" value={existingImage} />
      <input type="hidden" name="removeImage" value={removeImage ? "1" : "0"} />

      {state.errors.length > 0 && (
        <div
          role="alert"
          className="rounded-lg px-4 py-3 text-sm"
          style={{
            background: "color-mix(in oklch, var(--danger) 12%, transparent)",
            color: "var(--danger)",
          }}
        >
          <ul className="list-inside list-disc space-y-1">
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <section className="surface rounded-xl p-5">
        <h2 className="mb-4 text-sm font-bold">基本情報</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="name" defaultValue={initial.name} required autoFocus />
          <TextField name="nameKana" defaultValue={initial.nameKana} placeholder="ヤマダ タロウ" />
          <TextField name="company" defaultValue={initial.company} />
          <TextField name="department" defaultValue={initial.department} />
          <TextField name="jobTitle" defaultValue={initial.jobTitle} placeholder="営業部長" />
          <TextField name="metAt" defaultValue={initial.metAt} type="date" />
        </div>
      </section>

      <section className="surface rounded-xl p-5">
        <h2 className="mb-4 text-sm font-bold">連絡先</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="email" defaultValue={initial.email} type="email" />
          <TextField name="phone" defaultValue={initial.phone} type="tel" />
          <TextField name="mobile" defaultValue={initial.mobile} type="tel" />
          <TextField name="fax" defaultValue={initial.fax} type="tel" />
          <TextField name="website" defaultValue={initial.website} placeholder="example.com" />
          <TextField name="postalCode" defaultValue={initial.postalCode} placeholder="100-0001" />
          <div className="sm:col-span-2">
            <TextField name="address" defaultValue={initial.address} />
          </div>
        </div>
      </section>

      <section className="surface rounded-xl p-5">
        <h2 className="mb-4 text-sm font-bold">整理・メモ</h2>
        <div className="space-y-4">
          <div>
            <label className="field-label" htmlFor="tags">
              {FIELD_LABELS.tags}
            </label>
            <input
              className="field-input"
              id="tags"
              name="tags"
              defaultValue={initial.tags.join(", ")}
              placeholder="展示会2026, 取引先, 要フォロー"
            />
            <p className="mt-1.5 text-xs" style={{ color: "var(--muted)" }}>
              カンマまたはスペース区切りで複数指定できます。
            </p>
          </div>
          <div>
            <label className="field-label" htmlFor="notes">
              {FIELD_LABELS.notes}
            </label>
            <textarea
              className="field-input"
              id="notes"
              name="notes"
              rows={4}
              defaultValue={initial.notes}
              placeholder="どこで会ったか、話した内容、次のアクションなど"
            />
          </div>
        </div>
      </section>

      <section className="surface rounded-xl p-5">
        <h2 className="mb-4 text-sm font-bold">{FIELD_LABELS.imagePath}</h2>
        {existingImage && !removeImage && !preview && (
          <div className="mb-4 flex items-start gap-4">
            <img
              src={existingImage}
              alt="登録済みの名刺画像"
              className="max-h-40 rounded-lg border object-contain"
              style={{ borderColor: "var(--border)" }}
            />
            <button type="button" className="btn btn-danger" onClick={() => setRemoveImage(true)}>
              画像を削除
            </button>
          </div>
        )}
        {removeImage && (
          <p className="mb-4 text-sm" style={{ color: "var(--danger)" }}>
            保存すると画像が削除されます。
            <button
              type="button"
              className="ml-2 underline"
              onClick={() => setRemoveImage(false)}
            >
              取り消す
            </button>
          </p>
        )}
        {preview && (
          <img
            src={preview}
            alt="選択した名刺画像のプレビュー"
            className="mb-4 max-h-40 rounded-lg border object-contain"
            style={{ borderColor: "var(--border)" }}
          />
        )}
        <input
          className="field-input"
          type="file"
          name="image"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          onChange={onPickImage}
        />
        <p className="mt-1.5 text-xs" style={{ color: "var(--muted)" }}>
          JPEG / PNG / WebP / GIF / HEIC、8MB まで。
        </p>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "保存中…" : submitLabel}
        </button>
        <Link href={card ? `/cards/${card.id}` : "/"} className="btn">
          キャンセル
        </Link>
      </div>
    </form>
  );
}
