import Link from "next/link";
import CardTile from "@/components/CardTile";
import SearchControls from "@/components/SearchControls";
import { countCards, listCards, listTags } from "@/lib/db";
import { SORT_OPTIONS, type SortKey } from "@/lib/types";

export const dynamic = "force-dynamic";

function readParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = readParam(params.q);
  const tag = readParam(params.tag);
  const requestedSort = readParam(params.sort);
  const sort: SortKey = SORT_OPTIONS.some((o) => o.value === requestedSort)
    ? (requestedSort as SortKey)
    : "updatedAt";

  const cards = listCards({ query, tag, sort });
  const tags = listTags();
  const total = countCards();
  const filtered = Boolean(query || tag);

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-xl font-bold">名刺一覧</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {filtered ? `${cards.length} 件 / 全 ${total} 件` : `${total} 件`}
        </p>
      </div>

      <SearchControls query={query} tag={tag} sort={sort} tags={tags} />

      {cards.length === 0 ? (
        <div className="surface rounded-xl px-6 py-14 text-center">
          <p className="font-semibold">
            {filtered ? "条件に一致する名刺はありません。" : "まだ名刺が登録されていません。"}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {filtered
              ? "検索語やタグを変えてお試しください。"
              : "受け取った名刺を登録すると、ここに一覧表示されます。"}
          </p>
          {!filtered && (
            <Link href="/cards/new" className="btn btn-primary mt-5">
              ＋ 最初の名刺を登録
            </Link>
          )}
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {cards.map((card) => (
            <li key={card.id}>
              <CardTile card={card} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
