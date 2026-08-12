"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/auth-actions";
import { EMPTY_LOGIN_STATE } from "@/lib/auth-state";

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, EMPTY_LOGIN_STATE);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      {state.error && (
        <p
          role="alert"
          className="rounded-lg px-3 py-2 text-sm"
          style={{
            background: "color-mix(in oklch, var(--danger) 12%, transparent)",
            color: "var(--danger)",
          }}
        >
          {state.error}
        </p>
      )}

      <div>
        <label className="field-label" htmlFor="password">
          パスワード
        </label>
        <input
          className="field-input"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={pending}>
        {pending ? "確認中…" : "ログイン"}
      </button>
    </form>
  );
}
