"use client";

import { useFormStatus } from "react-dom";
import { deleteCardAction } from "@/lib/actions";

function SubmitButton({ name }: { name: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn btn-danger"
      disabled={pending}
      onClick={(event) => {
        if (!confirm(`「${name}」の名刺を削除します。よろしいですか？`)) {
          event.preventDefault();
        }
      }}
    >
      {pending ? "削除中…" : "削除"}
    </button>
  );
}

export default function DeleteCardButton({ id, name }: { id: number; name: string }) {
  return (
    <form action={deleteCardAction}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton name={name} />
    </form>
  );
}
