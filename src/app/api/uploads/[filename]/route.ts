import fs from "node:fs/promises";
import path from "node:path";
import { requireApiAuth } from "@/lib/auth-guard";
import { resolveUpload } from "@/lib/upload";

export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".heif": "image/heif",
};

/** Serves stored card images. Names are UUIDs, so the response is immutable. */
export async function GET(_request: Request, context: { params: Promise<{ filename: string }> }) {
  const denied = await requireApiAuth();
  if (denied) return denied;

  const { filename } = await context.params;
  const target = resolveUpload(filename);
  if (!target) return new Response("Not Found", { status: 404 });

  let file: Buffer;
  try {
    file = await fs.readFile(target);
  } catch {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": CONTENT_TYPES[path.extname(filename)] ?? "application/octet-stream",
      "Content-Length": String(file.byteLength),
      "Cache-Control": "private, max-age=31536000, immutable",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
