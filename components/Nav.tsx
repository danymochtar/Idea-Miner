"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "📝 Buat Konten" },
  { href: "/logo", label: "🎨 Logo Maker" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="bg-saku-950">
      <div className="mx-auto flex max-w-6xl gap-1 px-4 sm:px-6">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`border-b-2 px-3 py-3 text-sm font-medium transition ${
                active
                  ? "border-amber-brand text-amber-brand"
                  : "border-transparent text-saku-100/70 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
