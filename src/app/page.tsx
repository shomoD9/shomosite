/*
 * This file implements the homepage intro and recent work overview.
 * It lives separately because the homepage orchestrates multiple streams into one editorial entry point.
 * It imports content adapters, aggregation logic, and presentational components for its composed narrative.
 */

import Link from "next/link";

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
    "Essays, videos, books, and software by Shomodip De.",
  pathname: "/"
});

const browseLinks = [
  { label: "Essays", href: "/essays" },
  { label: "Videos", href: "/videos" },
  { label: "Books", href: "/books" },
  { label: "Tools", href: "/tools" }
];

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

      <section className="space-y-4 pt-2 pb-8">
        <h2 className="font-heading text-2xl font-medium text-ink">Browse</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {browseLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.92rem] text-muted transition hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
