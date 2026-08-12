import { requireApiAuth } from "@/lib/auth-guard";
import { listCards } from "@/lib/db";
import { contentDisposition, toCsv, toVCard } from "@/lib/export";
import { SORT_OPTIONS, type SortKey } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Exports the current (optionally filtered) card set as CSV or vCard. */
export async function GET(request: Request) {
  const denied = await requireApiAuth();
  if (denied) return denied;

  const params = new URL(request.url).searchParams;
  const format = params.get("format") === "vcf" ? "vcf" : "csv";
  const requestedSort = params.get("sort") ?? "";
  const sort: SortKey = SORT_OPTIONS.some((o) => o.value === requestedSort)
    ? (requestedSort as SortKey)
    : "name";

  const cards = listCards({
    query: params.get("q") ?? "",
    tag: params.get("tag") ?? "",
    sort,
  });

  const stamp = new Date().toISOString().slice(0, 10);
  const body = format === "vcf" ? cards.map(toVCard).join("") : toCsv(cards);

  return new Response(body, {
    headers: {
      "Content-Type":
        format === "vcf" ? "text/vcard; charset=utf-8" : "text/csv; charset=utf-8",
      "Content-Disposition": contentDisposition(`名刺一覧_${stamp}.${format}`),
    },
  });
}
