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
    <header className="sticky top-0 z-30 border-b border-line bg-[#0a0a0c]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="font-heading text-2xl tracking-tight text-ink transition hover:text-accent">
          Shomodip De
        </Link>
        <nav aria-label="Primary" className="hidden gap-7 text-[0.84rem] text-muted md:flex" style={{ fontVariant: "small-caps" }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="tracking-wide transition hover:text-accent">
              {item.label}
            </Link>
          ))}
        </nav>
        {/* The subscribe CTA is always visible so recurring audience growth stays a top-level action. */}
        <a
          href={substackUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-[#2a2a2e] px-4 py-2 text-[0.72rem] tracking-[0.1em] text-muted transition hover:border-accent hover:text-accent"
          style={{ fontVariant: "small-caps" }}
        >
          Subscribe
        </a>
      </div>
    </header>
  );
}
