/*
 * This file renders the closing band of the site with lightweight contact and social exits.
 * It exists separately because the ending tone should remain coherent across every public route.
 * The root layout places it after page content, and it reads from the shared site settings.
 */

import Link from "next/link";

import type { SiteSettings } from "@/lib/content-types";
import { SiteMark } from "@/components/site-mark";

type SiteFooterProps = {
  settings: SiteSettings;
};

export function SiteFooter({ settings }: SiteFooterProps): React.JSX.Element {
  const liveLinks = settings.socialLinks.filter((link) => Boolean(link.url));

  return (
    <footer className="border-t border-ink/10 px-6 py-10 lg:px-12">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-3 text-ink">
            <SiteMark className="h-5 w-5" />
            <span className="font-display text-lg">Shomo</span>
          </div>
          <p className="max-w-md text-sm leading-7 text-graphite">
            An independent research practice centered on productivity, expressed through prose, products, and systems.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {/* We only surface links that are live so the footer stays precise instead of aspirational. */}
          {liveLinks.map((link) => (
            <Link
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-graphite transition-colors duration-300 hover:text-ink"
              href={link.url as string}
              key={link.label}
              rel={link.url?.startsWith("mailto:") ? undefined : "noreferrer"}
              target={link.url?.startsWith("mailto:") ? undefined : "_blank"}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
