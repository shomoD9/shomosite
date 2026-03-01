/*
 * This file renders the global footer with outbound identity links and direct contact affordances.
 * It exists separately so communication endpoints stay consistent regardless of which route is currently active.
 * It reads canonical URLs from src/lib/site-config.ts and builds an email action through src/lib/links.ts.
 */

import { createPrefilledEmailLink } from "@/lib/links";
import { getSiteConfig } from "@/lib/site-config";

export function SiteFooter(): React.JSX.Element {
  const { substackUrl, youtubeChannelUrl, linkedinUrl } = getSiteConfig();

  return (
    <footer id="contact" className="relative z-10 mt-28 border-t border-line px-6 pb-14 pt-16 md:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-accent">Contact</p>
          <p className="font-heading text-3xl italic leading-[1.12] text-light md:text-4xl">
            Built as a digital instrument for people who think in long arcs.
          </p>
          <p className="max-w-lg text-sm leading-relaxed text-muted">
            Placeholder copy for now. If anything in the archive resonates, send a note.
          </p>
        </div>

        {/* External profile links are compact so the closing section stays calm and minimal. */}
        <div className="flex flex-col items-start gap-5 md:items-end">
          <div className="flex flex-wrap gap-5 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-light/72">
            <a className="lift-link" href={substackUrl} target="_blank" rel="noreferrer">
              Substack
            </a>
            <a className="lift-link" href={youtubeChannelUrl} target="_blank" rel="noreferrer">
              YouTube
            </a>
            <a className="lift-link" href={linkedinUrl} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a
              className="lift-link"
              href={createPrefilledEmailLink("Footer CTA")}
              target="_blank"
              rel="noreferrer"
            >
              Email
            </a>
          </div>

          <div className="flex items-center gap-2">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-accent" />
            <span className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-muted/85">Studio Signal Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
