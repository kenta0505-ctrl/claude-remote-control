/* eslint-disable @next/next/no-img-element -- images are served by our own
   route at unknown dimensions; next/image would only add a layout constraint. */
import Link from "next/link";
import type { Card } from "@/lib/types";

function initials(name: string): string {
  return name.trim().slice(0, 1) || "?";
}

export default function CardTile({ card }: { card: Card }) {
  const affiliation = [card.company, card.department, card.jobTitle].filter(Boolean).join(" / ");

  return (
    <Link
      href={`/cards/${card.id}`}
      className="surface flex h-full gap-4 rounded-xl p-4 transition-colors hover:border-[var(--accent)]"
    >
      {card.imagePath ? (
        <img
          src={card.imagePath}
          alt=""
          loading="lazy"
          className="h-15 w-24 shrink-0 rounded-md border object-cover"
          style={{ borderColor: "var(--border)" }}
        />
      ) : (
        <span
          aria-hidden
          className="grid h-15 w-24 shrink-0 place-items-center rounded-md text-xl font-bold"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {initials(card.name)}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate font-bold">{card.name}</p>
        {affiliation && (
          <p className="mt-0.5 truncate text-sm" style={{ color: "var(--muted)" }}>
            {affiliation}
          </p>
        )}
        <div className="mt-1 space-y-0.5 text-xs" style={{ color: "var(--muted)" }}>
          {card.email && <p className="truncate">{card.email}</p>}
          {(card.phone || card.mobile) && <p className="truncate">{card.phone || card.mobile}</p>}
        </div>
        {card.tags.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1">
            {card.tags.map((tag) => (
              <li
                key={tag}
                className="rounded px-1.5 py-0.5 text-[11px] font-medium"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
