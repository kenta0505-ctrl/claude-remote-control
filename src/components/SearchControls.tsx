import Link from "next/link";
import { SORT_OPTIONS, type SortKey } from "@/lib/types";

type Props = {
  query: string;
  tag: string;
  sort: SortKey;
  tags: { tag: string; count: number }[];
};

/**
 * A plain GET form: search state lives in the URL, so results are linkable and
 * the page keeps working without client-side JavaScript.
 */
export default function SearchControls({ query, tag, sort, tags }: Props) {
  return (
    <div className="space-y-3">
      <form method="get" action="/" className="flex flex-wrap items-center gap-2">
        {tag && <input type="hidden" name="tag" value={tag} />}
        <input
          className="field-input w-auto min-w-64 flex-1"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="氏名・会社名・メール・メモなどで検索"
          aria-label="名刺を検索"
        />
        <select className="field-input w-auto" name="sort" defaultValue={sort} aria-label="並び順">
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          検索
        </button>
        {(query || tag) && (
          <Link href="/" className="btn">
            クリア
          </Link>
        )}
      </form>

      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {tags.map((entry) => {
            const active = entry.tag === tag;
            const params = new URLSearchParams();
            if (query) params.set("q", query);
            if (sort !== "updatedAt") params.set("sort", sort);
            if (!active) params.set("tag", entry.tag);
            const href = params.size ? `/?${params}` : "/";

            return (
              <li key={entry.tag}>
                <Link
                  href={href}
                  className="inline-block rounded-full border px-2.5 py-1 text-xs font-medium"
                  style={
                    active
                      ? {
                          background: "var(--accent)",
                          borderColor: "var(--accent)",
                          color: "var(--surface)",
                        }
                      : { borderColor: "var(--border)", color: "var(--muted)" }
                  }
                >
                  {entry.tag}
                  <span className="ml-1 opacity-70">{entry.count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
