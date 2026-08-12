"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  createSessionToken,
  getAuthConfig,
  safeRedirectPath,
  verifyPassword,
} from "./auth";
import type { LoginState } from "./auth-state";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

/**
 * Failed-attempt throttle. In-memory and therefore per-process: enough to blunt
 * online guessing on a single-instance deployment, not a distributed limiter.
 */
const attempts = new Map<string, { count: number; blockedUntil: number }>();

async function clientKey(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "unknown";
}

function checkThrottle(key: string, now: number): number {
  const entry = attempts.get(key);
  if (!entry || entry.blockedUntil <= now) return 0;
  return Math.ceil((entry.blockedUntil - now) / 1000);
}

function recordFailure(key: string, now: number): void {
  const entry = attempts.get(key) ?? { count: 0, blockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    // Back off further the longer the guessing continues.
    entry.blockedUntil = now + LOCKOUT_MS * (entry.count - MAX_ATTEMPTS + 1);
  }
  attempts.set(key, entry);
}

/** Only mark the cookie Secure over HTTPS, or a plain-HTTP LAN setup breaks. */
async function isSecureRequest(): Promise<boolean> {
  const headerList = await headers();
  const proto = headerList.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (proto) return proto === "https";
  return process.env.MEISHI_SECURE_COOKIE === "1";
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const config = getAuthConfig();
  if (config.mode === "misconfigured") return { error: config.reason };
  if (config.mode === "disabled") redirect("/");

  const key = await clientKey();
  const now = Date.now();

  const waitSeconds = checkThrottle(key, now);
  if (waitSeconds > 0) {
    return { error: `試行回数が多すぎます。${waitSeconds} 秒後にもう一度お試しください。` };
  }

  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password, config)) {
    recordFailure(key, now);
    return { error: "パスワードが違います。" };
  }

  attempts.delete(key);
  (await cookies()).set(SESSION_COOKIE, createSessionToken(config), {
    httpOnly: true,
    sameSite: "lax",
    secure: await isSecureRequest(),
    path: "/",
    maxAge: config.maxAgeSeconds,
  });

  redirect(safeRedirectPath(String(formData.get("next") ?? "/")));
}

export async function logoutAction(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
