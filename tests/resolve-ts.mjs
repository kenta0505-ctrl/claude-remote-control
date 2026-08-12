import { registerHooks } from "node:module";

/**
 * The app's sources use extensionless relative imports, which the bundler
 * resolves but Node's ESM loader does not. This hook fills in `.ts` (and
 * `/index.ts`) so `node --test` can run the same files directly.
 */
registerHooks({
  resolve(specifier, context, nextResolve) {
    const relative = specifier.startsWith("./") || specifier.startsWith("../");
    const hasExtension = /\.[cm]?[jt]sx?$/.test(specifier);
    if (!relative || hasExtension) return nextResolve(specifier, context);

    for (const candidate of [`${specifier}.ts`, `${specifier}.tsx`, `${specifier}/index.ts`]) {
      try {
        return nextResolve(candidate, context);
      } catch {
        // try the next candidate
      }
    }
    return nextResolve(specifier, context);
  },
});
