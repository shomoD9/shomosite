/*
 * This file implements the homepage manifesto and cross-medium overview.
 * It lives separately because the homepage orchestrates multiple streams into one editorial entry point.
 * It imports content adapters, aggregation logic, and presentational components for its composed narrative.
 */

import Link from "next/link";

import { ContentCard } from "@/components/content-card";
import { LatestMedia } from "@/components/latest-media";
import { ManifestoHero } from "@/components/manifesto-hero";
import { buildLatestAcrossMedia } from "@/lib/content/aggregate";
import { getEssayFeed, getTools, getVideoFeed } from "@/lib/content";
import { buildPersonJsonLd } from "@/lib/seo/json-ld";
import { buildSectionMetadata } from "@/lib/seo/metadata";

export const revalidate = 86400;

export const metadata = buildSectionMetadata({
  title: "Home",
  description:
    "A canonical home for essays, video commentary, books, and software tools by Shomo.",
  pathname: "/"
});

export default async function HomePage(): Promise<React.JSX.Element> {
  // We load all streams in parallel because homepage value depends on cross-medium recency.
  const [essayFeed, videoFeed, tools] = await Promise.all([getEssayFeed(), getVideoFeed(), getTools()]);

  const latest = buildLatestAcrossMedia({
    essays: essayFeed.items,
    videos: videoFeed.items,
    tools,
    limit: 6
  });

  const manifestoJsonLd = buildPersonJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(manifestoJsonLd) }} />
      <ManifestoHero />
      <LatestMedia items={latest} />

      <section className="space-y-12 pt-16">
        <div className="space-y-5 border-t border-line/80 pt-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-3xl text-ink">Essays</h2>
            <Link href="/essays" className="text-sm uppercase tracking-[0.14em] text-accent hover:underline">
              View all essays
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {essayFeed.items.slice(0, 3).map((essay) => (
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
        </div>

        <div className="space-y-5 border-t border-line/80 pt-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-3xl text-ink">Videos</h2>
            <Link href="/videos" className="text-sm uppercase tracking-[0.14em] text-accent hover:underline">
              View all videos
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {videoFeed.items.slice(0, 3).map((video) => (
              <ContentCard
                key={video.id}
                title={video.title}
                summary={video.summary}
                href={video.url}
                publishedAt={video.publishedAt}
                medium="video"
                external
              />
            ))}
          </div>
        </div>

        <div className="space-y-5 border-t border-line/80 pt-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-3xl text-ink">Tools</h2>
            <Link href="/tools" className="text-sm uppercase tracking-[0.14em] text-accent hover:underline">
              View all tools
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tools.slice(0, 3).map((tool) => (
              <ContentCard
                key={tool.id}
                title={tool.title}
                summary={tool.summary}
                href={`/tools/${tool.slug}`}
                publishedAt={tool.publishedAt}
                medium="tool"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
