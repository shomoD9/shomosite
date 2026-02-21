/*
 * This file renders the closing site chrome with outbound identity links.
 * It exists separately so footer messaging can evolve independently from page-specific content.
 * The root layout imports this component and passes no props because it reads shared site config directly.
 */

import { createPrefilledEmailLink } from "@/lib/links";
import { getSiteConfig } from "@/lib/site-config";

export function SiteFooter(): React.JSX.Element {
  const { substackUrl, youtubeChannelUrl } = getSiteConfig();

  return (
    <footer className="border-t border-line/90 bg-[#efebe2]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="max-w-2xl font-serif text-lg leading-relaxed text-ink">
          A quiet archive for essays, commentary, books, and tools. Built to keep the work connected.
        </p>
        <div className="flex gap-4 text-sm text-muted">
          <a href={substackUrl} target="_blank" rel="noreferrer" className="hover:text-ink">
            Substack
          </a>
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            YouTube
          </a>
          <a
            href={createPrefilledEmailLink("Footer link")}
            className="hover:text-ink"
            target="_blank"
            rel="noreferrer"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
