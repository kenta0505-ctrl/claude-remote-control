import { requireApiAuth } from "@/lib/auth-guard";
import { getCard } from "@/lib/db";
import { contentDisposition, toVCard } from "@/lib/export";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await requireApiAuth();
  if (denied) return denied;

  const id = Number((await context.params).id);
  const card = Number.isInteger(id) ? getCard(id) : null;
  if (!card) return new Response("Not Found", { status: 404 });

  return new Response(toVCard(card), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": contentDisposition(`${card.name}.vcf`),
    },
  });
}
