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
    <article className="mx-auto max-w-3xl space-y-8 px-8 py-16 md:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <header className="space-y-4 border-b border-line pb-8">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-accent">Essay</p>
        <h1 className="font-heading text-[2.75rem] font-medium leading-[1.08] text-ink">{essay.title}</h1>
        <p className="font-mono text-[0.72rem] text-muted/60">{toDisplayDate(essay.publishedAt)}</p>
      </header>

      {essay.html ? (
        <RichText html={essay.html} />
      ) : (
        <div className="space-y-4 rounded-2xl border border-line bg-accentSoft p-6">
          <p className="text-base leading-relaxed text-muted">{essay.excerpt || essay.summary}</p>
          <p className="text-sm text-muted">This entry is excerpt-only in the feed.</p>
        </div>
      )}

      <a
        href={essay.canonicalUrl}
        target="_blank"
        rel="noreferrer"
        className="magnetic-btn inline-flex rounded-full border border-accent/40 px-6 py-3 text-[0.72rem] uppercase tracking-[0.15em] text-accent transition hover:border-accent hover:text-ink"
      >
        Read on Substack
      </a>
    </article>
  );
}
