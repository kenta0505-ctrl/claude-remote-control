import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  getAuthConfig,
  readBearerToken,
  verifyApiToken,
  verifySessionToken,
} from "@/lib/auth";

/**
 * Pre-filters unauthenticated traffic before any route renders. This is an
 * optimistic check only — the authoritative guard lives in lib/auth-guard.ts,
 * which every page, action and route handler calls.
 */
export function proxy(request: NextRequest) {
  const config = getAuthConfig();
  if (config.mode === "disabled") return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");

  if (config.mode === "misconfigured") {
    return isApi
      ? NextResponse.json({ error: config.reason }, { status: 503 })
      : NextResponse.next(); // /login renders the setup message.
  }

  if (pathname === "/login") return NextResponse.next();

  if (verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, config)) {
    return NextResponse.next();
  }

  if (isApi) {
    const bearer = readBearerToken(request.headers.get("authorization"));
    if (bearer && verifyApiToken(bearer, config)) return NextResponse.next();

    return NextResponse.json(
      { error: "認証が必要です。" },
      { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
    );
  }

  const login = new URL("/login", request.url);
  const target = `${pathname}${search}`;
  if (target !== "/") login.searchParams.set("next", target);
  return NextResponse.redirect(login);
}

export const config = {
  // Everything except Next's own static output and the app icon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
