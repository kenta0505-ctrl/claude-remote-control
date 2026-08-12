import type { Metadata } from "next";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { hasSession, isAuthEnabled } from "@/lib/auth-guard";
import "./globals.css";

export const metadata: Metadata = {
  title: "名刺管理",
  description: "受け取った名刺を登録・検索・整理するためのアプリ",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // With auth on, the header's actions only make sense once signed in — which
  // also keeps them off the login page without the layout knowing the route.
  const authEnabled = isAuthEnabled();
  const signedIn = authEnabled ? await hasSession() : true;

  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">
        <header
          className="sticky top-0 z-10 border-b backdrop-blur"
          style={{
            borderColor: "var(--border)",
            background: "color-mix(in oklch, var(--bg) 85%, transparent)",
          }}
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 text-base font-bold whitespace-nowrap"
            >
              <span
                aria-hidden
                className="grid h-7 w-7 place-items-center rounded-md text-sm"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                名
              </span>
              名刺管理
            </Link>
            {signedIn && (
              <nav className="flex items-center gap-2">
                <Link
                  href="/api/export?format=csv"
                  className="btn"
                  prefetch={false}
                  title="登録済みの名刺を CSV で書き出す"
                >
                  {/* One flex item, so .btn's gap does not open up inside the label. */}
                  <span>
                    CSV<span className="hidden sm:inline"> 書き出し</span>
                  </span>
                </Link>
                <Link href="/cards/new" className="btn btn-primary">
                  <span>
                    ＋<span className="hidden sm:inline"> 名刺を</span>登録
                  </span>
                </Link>
                {authEnabled && <LogoutButton />}
              </nav>
            )}
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
