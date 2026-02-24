"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { getSiteConfig } from "@/lib/site-config";

const navItems = [
  { label: "Essays", href: "/essays" },
  { label: "Videos", href: "/videos" },
  { label: "Books", href: "/books" },
  { label: "Tools", href: "/tools" }
];

export function SiteHeader(): React.JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${scrolled
          ? "w-[min(92vw,700px)] rounded-full border border-line/60 bg-paper/70 px-6 py-3 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "w-[min(92vw,900px)] rounded-full bg-transparent px-8 py-5"
        }`}
    >
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="font-heading text-xl tracking-tight text-ink transition-colors hover:text-accent"
        >
          Shomodip De
        </Link>
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="lift-link text-[0.82rem] text-muted"
              style={{ fontVariant: "small-caps" }}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://ds013.substack.com"
            target="_blank"
            rel="noreferrer"
            className="magnetic-btn slide-bg-btn rounded-full border border-accent/40 px-5 py-2 text-[0.72rem] tracking-wider text-accent"
            style={{ fontVariant: "small-caps" }}
          >
            Subscribe
          </a>
        </nav>
      </div>
    </header>
  );
}
