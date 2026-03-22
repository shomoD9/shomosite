/*
 * This file renders the home page's three-part handoff section with a sticky explanatory rail.
 * It lives separately because the section is both narrative structure and the main scroll-led composition move of the homepage.
 * The homepage passes in the track documents, and this component translates them into a calm, readable sequence.
 */

import Link from "next/link";

import type { TrackPage } from "@/lib/content-types";
import { SectionReveal } from "@/components/section-reveal";

type TrackRailProps = {
  tracks: TrackPage[];
};

export function TrackRail({ tracks }: TrackRailProps): React.JSX.Element {
  return (
    <section className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-graphite">What lives here</p>
        <h2 className="mt-4 max-w-md font-display text-4xl leading-tight text-ink">
          Productivity is the center of inquiry. Prose and product are the crafts through which the work becomes public.
        </h2>
        <p className="mt-4 max-w-md text-sm leading-7 text-graphite">
          The three names above are kept together because they belong to the same practice, even when they take different forms.
        </p>
      </div>

      <div className="border-t border-ink/10">
        {tracks.map((track, index) => (
          <SectionReveal className="border-b border-ink/10 py-8" delay={index * 80} key={track.slug}>
            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:gap-10">
              <div className="space-y-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-graphite">{track.eyebrow}</p>
                <h3 className="font-display text-3xl leading-tight text-ink">{track.title}</h3>
              </div>

              <div className="space-y-5">
                <p className="max-w-copy text-sm leading-7 text-graphite">{track.summary}</p>
                {/* The homepage introduces the public shape of the practice, so we stop at the summary instead of listing offers. */}
                <Link
                  className="inline-flex items-center gap-3 border-b border-ink/20 pb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:text-steel"
                  href={`/${track.slug}`}
                >
                  Read more
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
