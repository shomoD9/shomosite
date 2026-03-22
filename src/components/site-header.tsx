"use client";

/*
 * This file renders the persistent navigation shell for the public site.
 * It is separated from individual pages because orientation needs to remain stable as visitors move between tracks.
 * The root layout mounts this component, and it reads the current pathname to softly indicate the active section.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { SiteSettings } from "@/lib/content-types";
import { cx } from "@/lib/classes";
import { SiteMark } from "@/components/site-mark";

type SiteHeaderProps = {
  settings: SiteSettings;
};

export function SiteHeader({ settings }: SiteHeaderProps): React.JSX.Element {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-bone/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-5 px-6 py-4 lg:px-12">
        <Link className="group inline-flex items-center gap-3 text-ink" href="/">
          <SiteMark className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
          <span className="font-display text-lg tracking-[0.08em]">Shomo</span>
        </Link>

        <nav aria-label="Primary" className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2">
          {settings.nav.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cx(
                  "border-b border-transparent pb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-graphite transition-colors duration-300 hover:border-ink/25 hover:text-ink",
                  isActive && "border-ink/25 text-ink"
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
