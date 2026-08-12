import type { NextConfig } from "next";
import { MAX_IMAGE_BYTES } from "./src/lib/image-constants";

// Server Actions cap request bodies at 1MB by default, which would reject a
// card photo long before our own size check runs. Leave headroom above the
// image limit for the rest of the multipart form.
const BODY_SIZE_LIMIT: `${number}mb` = `${Math.ceil(MAX_IMAGE_BYTES / 1024 / 1024) + 2}mb`;

const nextConfig: NextConfig = {
  // node:sqlite is a built-in module; keep it out of the bundler's dependency graph.
  serverExternalPackages: ["node:sqlite"],
  experimental: {
    serverActions: { bodySizeLimit: BODY_SIZE_LIMIT },
  },
};

export default nextConfig;
