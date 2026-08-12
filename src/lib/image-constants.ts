/**
 * Shared by the upload handler (server) and the file picker (client), so this
 * module must stay free of Node built-ins.
 */
export const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/heic": ".heic",
  "image/heif": ".heif",
};

export const ACCEPTED_IMAGE_TYPES = Object.keys(EXTENSION_BY_MIME);

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
