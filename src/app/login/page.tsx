import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { getAuthConfig, safeRedirectPath } from "@/lib/auth";
import { hasSession } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";
export const metadata = { title: "ログイン | 名刺管理" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const config = getAuthConfig();
  if (config.mode === "disabled") redirect("/");

  const params = await searchParams;
  const rawNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const next = safeRedirectPath(rawNext);

  if (config.mode === "enabled" && (await hasSession())) redirect(next);

  return (
    <div className="mx-auto mt-10 max-w-sm">
      <div className="surface rounded-xl p-6">
        <h1 className="mb-1 text-lg font-bold">名刺管理</h1>
        <p className="mb-5 text-sm" style={{ color: "var(--muted)" }}>
          続けるにはパスワードを入力してください。
        </p>

        {config.mode === "misconfigured" ? (
          <div
            role="alert"
            className="space-y-2 rounded-lg px-3 py-3 text-sm"
            style={{
              background: "color-mix(in oklch, var(--danger) 12%, transparent)",
              color: "var(--danger)",
            }}
          >
            <p className="font-semibold">設定が未完了です</p>
            <p>{config.reason}</p>
            <p style={{ color: "var(--muted)" }}>
              <code>.env.local</code> に <code>MEISHI_PASSWORD</code> を設定して再起動してください。
            </p>
          </div>
        ) : (
          <LoginForm next={next} />
        )}
      </div>
    </div>
  );
}
