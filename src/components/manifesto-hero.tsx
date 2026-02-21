/*
 * This file renders the homepage manifesto and primary conversion actions.
 * It is separated because the hero is a product-level narrative unit reused as the site's thesis statement.
 * The home route imports it, and it consumes link utilities and site config for CTAs.
 */

import { createPrefilledEmailLink } from "@/lib/links";
import { getSiteConfig } from "@/lib/site-config";

export function ManifestoHero(): React.JSX.Element {
  const { substackUrl } = getSiteConfig();

  return (
    <section className="animate-fade-up border-b border-line/80 pb-14 pt-12 md:pt-16">
      <div className="max-w-3xl space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Author Manifesto</p>
        <h1 className="font-serif text-5xl leading-[1.05] text-ink md:text-6xl">
          I make writing, video, books, and software speak to each other.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          This site is my canonical workspace: a single place where essays, video commentary,
          published books, and open tools can be read as one long argument about how we build and
          live with better systems.
        </p>
        {/* Dual CTAs balance audience growth with direct conversation, which matches the site's purpose. */}
        <div className="flex flex-wrap gap-4 pt-2">
          <a
            href={substackUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-accent"
          >
            Subscribe on Substack
          </a>
          <a
            href={createPrefilledEmailLink("Homepage hero")}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-accent hover:text-accent"
          >
            Start a Conversation
          </a>
        </div>
      </div>
    </section>
  );
}
