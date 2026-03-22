/*
 * This file renders the poster-like opening viewport of the site.
 * It exists separately because the first screen has a different job from every downstream section: identity before detail.
 * The homepage imports it as the topmost section and passes the central promise plus the primary next click.
 */

import Link from "next/link";

type HomeHeroProps = {
  title: string;
  summary: string;
  ctaLabel: string;
  ctaHref: string;
};

export function HomeHero({ title, summary, ctaLabel, ctaHref }: HomeHeroProps): React.JSX.Element {
  return (
    <section className="flex min-h-[calc(100svh-5.5rem)] flex-col justify-end border-b border-ink/10 pb-16 pt-32 lg:pb-24">
      <div className="space-y-6">
        <p className="animate-fade-up font-mono text-[11px] uppercase tracking-[0.22em] text-graphite">Shomo</p>
        <h1 className="animate-fade-up text-balance font-display text-[clamp(3.5rem,12vw,9rem)] leading-[0.92] text-ink [animation-delay:90ms]">
          {title}
        </h1>
        <p className="animate-fade-up max-w-copy text-lg leading-8 text-graphite [animation-delay:180ms]">{summary}</p>
      </div>

      <div className="mt-12 animate-fade-up [animation-delay:260ms]">
        <Link
          className="inline-flex items-center gap-3 border-b border-ink/30 pb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:text-steel"
          href={ctaHref}
        >
          <span>{ctaLabel}</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
