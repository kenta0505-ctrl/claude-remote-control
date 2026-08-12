/* eslint-disable @next/next/no-img-element -- see CardTile */
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteCardButton from "@/components/DeleteCardButton";
import { requireSession } from "@/lib/auth-guard";
import { getCard } from "@/lib/db";
import { FIELD_LABELS, type Card } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params) {
  const card = getCard(Number((await params).id));
  return { title: card ? `${card.name} | 名刺管理` : "名刺管理" };
}

/** Contact rows render as links where the value is actionable. */
function contactHref(field: keyof Card, value: string): string | null {
  if (field === "email") return `mailto:${value}`;
  if (field === "phone" || field === "mobile") return `tel:${value.replace(/[^\d+]/g, "")}`;
  if (field === "website") return value;
  return null;
}

function Row({ field, value }: { field: keyof Card; value: string }) {
  const href = contactHref(field, value);
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5">
      <dt className="text-sm" style={{ color: "var(--muted)" }}>
        {FIELD_LABELS[field as keyof typeof FIELD_LABELS]}
      </dt>
      <dd className="text-sm break-words">
        {href ? (
          <a
            href={href}
            className="hover:underline"
            style={{ color: "var(--accent)" }}
            {...(field === "website" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export default async function CardDetailPage({ params }: Params) {
  const id = Number((await params).id);
  await requireSession(`/cards/${id}`);

  const card = Number.isInteger(id) ? getCard(id) : null;
  if (!card) notFound();

  const basicFields: (keyof Card)[] = ["nameKana", "company", "department", "jobTitle", "metAt"];
  const contactFields: (keyof Card)[] = [
    "email",
    "phone",
    "mobile",
    "fax",
    "website",
    "postalCode",
    "address",
  ];
  const shown = (fields: (keyof Card)[]) =>
    fields.filter((f) => typeof card[f] === "string" && card[f]);

  const basic = shown(basicFields);
  const contact = shown(contactFields);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/" className="text-sm hover:underline" style={{ color: "var(--muted)" }}>
            ← 一覧に戻る
          </Link>
          <h1 className="mt-1 text-2xl font-bold">{card.name}</h1>
          {(card.company || card.jobTitle) && (
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              {[card.company, card.department, card.jobTitle].filter(Boolean).join(" / ")}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <a href={`/api/cards/${card.id}/vcard`} className="btn" download>
            vCard
          </a>
          <Link href={`/cards/${card.id}/edit`} className="btn">
            編集
          </Link>
          <DeleteCardButton id={card.id} name={card.name} />
        </div>
      </div>

      {card.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {card.tags.map((tag) => (
            <li key={tag}>
              <Link
                href={`/?tag=${encodeURIComponent(tag)}`}
                className="inline-block rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {card.imagePath && (
        <div className="surface overflow-hidden rounded-xl p-3">
          <img
            src={card.imagePath}
            alt={`${card.name} の名刺画像`}
            className="mx-auto block max-h-[420px] w-auto max-w-full rounded-lg object-contain"
          />
        </div>
      )}

      {basic.length > 0 && (
        <section className="surface rounded-xl px-5 py-3">
          <h2 className="py-2 text-sm font-bold">基本情報</h2>
          <dl className="divide-y" style={{ borderColor: "var(--border)" }}>
            {basic.map((field) => (
              <Row key={field} field={field} value={card[field] as string} />
            ))}
          </dl>
        </section>
      )}

      {contact.length > 0 && (
        <section className="surface rounded-xl px-5 py-3">
          <h2 className="py-2 text-sm font-bold">連絡先</h2>
          <dl className="divide-y" style={{ borderColor: "var(--border)" }}>
            {contact.map((field) => (
              <Row key={field} field={field} value={card[field] as string} />
            ))}
          </dl>
        </section>
      )}

      {card.notes && (
        <section className="surface rounded-xl p-5">
          <h2 className="mb-2 text-sm font-bold">メモ</h2>
          <p className="text-sm whitespace-pre-wrap">{card.notes}</p>
        </section>
      )}

      <p className="text-xs" style={{ color: "var(--muted)" }}>
        登録: {new Date(card.createdAt).toLocaleString("ja-JP")} ／ 更新:{" "}
        {new Date(card.updatedAt).toLocaleString("ja-JP")}
      </p>
    </div>
  );
}
