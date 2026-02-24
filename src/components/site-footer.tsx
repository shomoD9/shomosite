import { createPrefilledEmailLink } from "@/lib/links";
import { getSiteConfig } from "@/lib/site-config";

export function SiteFooter(): React.JSX.Element {
  const { substackUrl, youtubeChannelUrl, linkedinUrl } = getSiteConfig();

  return (
    <footer className="mt-20 rounded-t-3xl bg-[#08080b] px-8 py-14 md:px-12">
      <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-[1fr_auto]">
        {/* Left: Brand + tagline */}
        <div className="space-y-4">
          <p className="font-heading text-2xl font-medium tracking-tight text-ink">
            Shomodip De
          </p>
          <p className="max-w-md font-heading text-lg italic leading-relaxed text-muted">
            Good ideas get better in conversation.
            If something here moves you, write to me.
          </p>
        </div>

        {/* Right: Links + status */}
        <div className="flex flex-col gap-8 md:items-end">
          <div className="flex flex-wrap gap-6 text-[0.82rem]" style={{ fontVariant: "small-caps" }}>
            <a href={substackUrl} target="_blank" rel="noreferrer" className="lift-link text-muted tracking-wide">
              Substack
            </a>
            <a href={youtubeChannelUrl} target="_blank" rel="noreferrer" className="lift-link text-muted tracking-wide">
              YouTube
            </a>
            <a href={linkedinUrl} target="_blank" rel="noreferrer" className="lift-link text-muted tracking-wide">
              LinkedIn
            </a>
            <a href={createPrefilledEmailLink("Footer link")} target="_blank" rel="noreferrer" className="lift-link text-muted tracking-wide">
              Email
            </a>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted/50">
              All systems nominal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
