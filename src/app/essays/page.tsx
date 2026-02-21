/*
 * This file renders the essay index sourced from the Substack feed adapter.
 * It exists as its own route to give long-form writing a dedicated browsing surface.
 * It imports feed data from src/lib/content and card presentation from src/components.
 */

import { ContentCard } from "@/components/content-card";
import { getEssayFeed } from "@/lib/content";
import { getSiteConfig } from "@/lib/site-config";
import { buildSectionMetadata } from "@/lib/seo/metadata";

export const revalidate = 86400;

export const metadata = buildSectionMetadata({
  title: "Essays",
  description: "Mirror of recent Substack essays with canonical links to original publications.",
  pathname: "/essays"
});

export default async function EssaysPage(): Promise<React.JSX.Element> {
  const essays = await getEssayFeed();
  const { substackUrl } = getSiteConfig();

  return (
    <section className="space-y-8 py-10">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Essays</p>
        <h1 className="font-serif text-5xl leading-tight text-ink">Writing in motion</h1>
        <p className="text-lg leading-relaxed text-muted">
          Essays are mirrored here for continuity, with the original publication preserved on Substack.
        </p>
      </div>

      {/* Feed status messaging keeps stale-data behavior transparent without interrupting reading flow. */}
      {essays.status === "cache" ? (
        <p className="rounded-2xl border border-accentSoft bg-accentSoft/35 px-4 py-3 text-sm text-ink">
          Showing the most recent cached essays while Substack is temporarily unreachable.
        </p>
      ) : null}

      {essays.status === "empty" ? (
        <p className="rounded-2xl border border-line bg-white/70 px-4 py-4 text-sm text-muted">
          Substack is currently unavailable. You can still read directly on{" "}
          <a className="text-accent hover:underline" href={substackUrl} target="_blank" rel="noreferrer">
            Substack
          </a>
          .
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {essays.items.map((essay) => (
          <ContentCard
            key={essay.id}
            title={essay.title}
            summary={essay.summary}
            href={`/essays/${essay.slug}`}
            publishedAt={essay.publishedAt}
            medium="essay"
          />
        ))}
      </div>
    </section>
  );
}
