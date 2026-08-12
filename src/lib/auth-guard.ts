import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  getAuthConfig,
  readBearerToken,
  verifyApiToken,
  verifySessionToken,
} from "./auth";

/**
 * The real gate. `proxy.ts` only pre-filters requests; every page, action and
 * route handler that touches card data calls in here, so a missed matcher or a
 * direct Server Action POST can never reach the store unauthenticated.
 */
export async function requireSession(currentPath?: string): Promise<void> {
  const config = getAuthConfig();
  if (config.mode === "disabled") return;
  if (config.mode === "misconfigured") redirect("/login");

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (verifySessionToken(token, config)) return;

  const next = currentPath && currentPath !== "/" ? `?next=${encodeURIComponent(currentPath)}` : "";
  redirect(`/login${next}`);
}

/** True when the caller holds a valid session cookie. */
export async function hasSession(): Promise<boolean> {
  const config = getAuthConfig();
  if (config.mode !== "enabled") return false;
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value, config);
}

/** Whether the login/logout affordances should be shown at all. */
export function isAuthEnabled(): boolean {
  return getAuthConfig().mode === "enabled";
}

/**
 * Guard for route handlers. Accepts a session cookie, or a bearer token when
 * MEISHI_API_TOKEN is configured, so scripted API access stays possible.
 * Returns a 401 response to hand straight back, or null when authorized.
 */
export async function requireApiAuth(): Promise<NextResponse | null> {
  const config = getAuthConfig();
  if (config.mode === "disabled") return null;
  if (config.mode === "misconfigured") {
    return NextResponse.json({ error: config.reason }, { status: 503 });
  }

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (verifySessionToken(token, config)) return null;

  const bearer = readBearerToken((await headers()).get("authorization"));
  if (bearer && verifyApiToken(bearer, config)) return null;

  return NextResponse.json(
    { error: "認証が必要です。" },
    { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
  );
}
