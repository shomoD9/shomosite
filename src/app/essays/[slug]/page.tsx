/*
 * This file renders individual mirrored essay pages with canonical attribution.
 * It is separated so essay-specific metadata and schema can be generated at the route boundary.
 * It pulls essay entries from src/lib/content and uses the shared rich-text renderer for article bodies.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RichText } from "@/components/rich-text";
import { toDisplayDate } from "@/lib/date";
import { getEssays } from "@/lib/content";
import { buildEssayJsonLd } from "@/lib/seo/json-ld";

type EssayDetailProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 86400;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const essays = await getEssays();
  return essays.map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({ params }: EssayDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const essays = await getEssays();
  const essay = essays.find((candidate) => candidate.slug === slug);

  if (!essay) {
    return {
      title: "Essay Not Found"
    };
  }

  return {
    title: essay.title,
    description: essay.summary,
    alternates: {
      canonical: essay.canonicalUrl
    },
    openGraph: {
      type: "article",
      title: essay.title,
      description: essay.summary,
      url: essay.canonicalUrl
    }
  };
}

export default async function EssayDetailPage({ params }: EssayDetailProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const essays = await getEssays();
  const essay = essays.find((candidate) => candidate.slug === slug);

  if (!essay) {
    notFound();
  }

  const articleJsonLd = buildEssayJsonLd(essay);

  return (
    <article className="mx-auto max-w-3xl space-y-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <header className="space-y-4 border-b border-line/90 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Essay</p>
        <h1 className="font-serif text-5xl leading-tight text-ink">{essay.title}</h1>
        <p className="text-sm uppercase tracking-[0.12em] text-muted">{toDisplayDate(essay.publishedAt)}</p>
      </header>

      {/* Some Substack feeds publish only excerpts, so we preserve continuity while routing to canonical source. */}
      {essay.html ? (
        <RichText html={essay.html} />
      ) : (
        <div className="space-y-4 rounded-2xl border border-line bg-white/70 p-6">
          <p className="text-base leading-relaxed text-muted">{essay.excerpt || essay.summary}</p>
          <p className="text-sm text-muted">This entry is excerpt-only in the feed.</p>
        </div>
      )}

      <a
        href={essay.canonicalUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex rounded-full border border-ink px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-accent hover:text-accent"
      >
        Read on Substack
      </a>
    </article>
  );
}
