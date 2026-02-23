/*
 * This file renders the closing site chrome with outbound identity links.
 * It exists separately so footer messaging can evolve independently from page-specific content.
 * The root layout imports this component and passes no props because it reads shared site config directly.
 */

import { createPrefilledEmailLink } from "@/lib/links";
import { getSiteConfig } from "@/lib/site-config";

export function SiteFooter(): React.JSX.Element {
  const { substackUrl, youtubeChannelUrl, linkedinUrl } = getSiteConfig();

  return (
    <footer className="border-t border-line bg-[#08080a]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="max-w-2xl font-heading text-lg italic leading-relaxed text-ink">
          Good ideas get better in conversation. If something here moves you, write to me.
        </p>
        <div className="flex gap-5 text-[0.82rem] text-muted" style={{ fontVariant: "small-caps" }}>
          <a href={substackUrl} target="_blank" rel="noreferrer" className="tracking-wide hover:text-accent">
            Substack
          </a>
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noreferrer"
            className="tracking-wide hover:text-accent"
          >
            YouTube
          </a>
          <a href={linkedinUrl} target="_blank" rel="noreferrer" className="tracking-wide hover:text-accent">
            LinkedIn
          </a>
          <a
            href={createPrefilledEmailLink("Footer link")}
            className="tracking-wide hover:text-accent"
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
