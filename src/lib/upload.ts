import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { EXTENSION_BY_MIME, MAX_IMAGE_BYTES } from "./image-constants";

/**
 * Uploads live outside `public/`, because Next.js snapshots that directory at
 * build time and would never serve a file written at runtime. They are handed
 * out by the /api/uploads/[filename] route instead.
 */
export const UPLOAD_DIR = process.env.MEISHI_UPLOAD_DIR ?? path.join(process.cwd(), "data", "uploads");

export const UPLOAD_URL_PREFIX = "/api/uploads/";

export class UploadError extends Error {}

/** Stored names are random UUIDs, so a hostile filename cannot escape UPLOAD_DIR. */
const STORED_NAME = /^[0-9a-f-]{36}\.[a-z]{3,4}$/;

export async function saveCardImage(file: File): Promise<string> {
  const extension = EXTENSION_BY_MIME[file.type];
  if (!extension) {
    throw new UploadError("対応していない画像形式です（JPEG / PNG / WebP / GIF / HEIC）。");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new UploadError(
      `画像サイズが大きすぎます（上限 ${Math.floor(MAX_IMAGE_BYTES / 1024 / 1024)}MB）。`,
    );
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${crypto.randomUUID()}${extension}`;
  await fs.writeFile(`${UPLOAD_DIR}/${filename}`, Buffer.from(await file.arrayBuffer()));
  return `${UPLOAD_URL_PREFIX}${filename}`;
}

/**
 * Resolves a request path segment to a file, or null if it is not one of ours.
 * STORED_NAME admits no separators or dots beyond the extension, so the joined
 * path always stays inside UPLOAD_DIR. Concatenated rather than path.join'd to
 * keep Next's build-time file tracer from widening its scan to the whole tree.
 */
export function resolveUpload(filename: string): string | null {
  return STORED_NAME.test(filename) ? `${UPLOAD_DIR}/${filename}` : null;
}

/** Best-effort removal; anything that did not come from saveCardImage is ignored. */
export async function deleteCardImage(imagePath: string): Promise<void> {
  if (!imagePath.startsWith(UPLOAD_URL_PREFIX)) return;

  const target = resolveUpload(imagePath.slice(UPLOAD_URL_PREFIX.length));
  if (target) await fs.rm(target, { force: true });
}
