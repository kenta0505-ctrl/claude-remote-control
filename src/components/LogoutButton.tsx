import { logoutAction } from "@/lib/auth-actions";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="btn" title="ログアウト">
        <span>ログアウト</span>
      </button>
    </form>
  );
}
