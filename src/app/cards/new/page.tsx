import Link from "next/link";
import CardForm from "@/components/CardForm";
import { createCardAction } from "@/lib/actions";

export const metadata = { title: "名刺を登録 | 名刺管理" };

export default function NewCardPage() {
  return (
    <div className="space-y-5">
      <div>
        <Link href="/" className="text-sm hover:underline" style={{ color: "var(--muted)" }}>
          ← 一覧に戻る
        </Link>
        <h1 className="mt-1 text-xl font-bold">名刺を登録</h1>
      </div>
      <CardForm action={createCardAction} submitLabel="登録する" />
    </div>
  );
}
