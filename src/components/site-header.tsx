/*
 * This file renders the global navigation shell shown on every page.
 * It is separated so routing structure and top-level calls to action stay consistent across routes.
 * The layout in src/app/layout.tsx imports this component, and it links users into each medium section.
 */

import Link from "next/link";

import { getSiteConfig } from "@/lib/site-config";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Essays", href: "/essays" },
  { label: "Videos", href: "/videos" },
  { label: "Books", href: "/books" },
  { label: "Tools", href: "/tools" }
];

export function SiteHeader(): React.JSX.Element {
  const { substackUrl } = getSiteConfig();

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="font-serif text-xl tracking-tight text-ink transition hover:text-accent">
          Shomo
        </Link>
        <nav aria-label="Primary" className="hidden gap-6 text-sm text-muted md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        {/* The subscribe CTA is always visible so recurring audience growth stays a top-level action. */}
        <a
          href={substackUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-accent hover:text-accent"
        >
          Subscribe
        </a>
      </div>
    </header>
  );
}
