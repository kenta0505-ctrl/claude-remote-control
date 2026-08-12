import Link from "next/link";
import { notFound } from "next/navigation";
import CardForm from "@/components/CardForm";
import { updateCardAction } from "@/lib/actions";
import { getCard } from "@/lib/db";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params) {
  const card = getCard(Number((await params).id));
  return { title: card ? `${card.name} を編集 | 名刺管理` : "名刺管理" };
}

export default async function EditCardPage({ params }: Params) {
  const id = Number((await params).id);
  const card = Number.isInteger(id) ? getCard(id) : null;
  if (!card) notFound();

  return (
    <div className="space-y-5">
      <div>
        <Link
          href={`/cards/${card.id}`}
          className="text-sm hover:underline"
          style={{ color: "var(--muted)" }}
        >
          ← 詳細に戻る
        </Link>
        <h1 className="mt-1 text-xl font-bold">{card.name} を編集</h1>
      </div>
      <CardForm action={updateCardAction} card={card} submitLabel="保存する" />
    </div>
  );
}
