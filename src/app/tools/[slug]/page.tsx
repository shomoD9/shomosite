/*
 * This file renders individual tool detail pages from local MDX definitions.
 * It is separated because tool pages need richer outbound-link affordances and lifecycle context.
 * It consumes parsed tool entries and shared rich-text rendering utilities.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RichText } from "@/components/rich-text";
import { toDisplayDate } from "@/lib/date";
import { getTools } from "@/lib/content";

type ToolDetailProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const tools = await getTools();
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const tools = await getTools();
  const tool = tools.find((candidate) => candidate.slug === slug);

  if (!tool) {
    return { title: "Tool Not Found" };
  }

  return {
    title: tool.title,
    description: tool.summary,
    alternates: {
      canonical: `/tools/${tool.slug}`
    }
  };
}

export default async function ToolDetailPage({ params }: ToolDetailProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const tools = await getTools();
  const tool = tools.find((candidate) => candidate.slug === slug);

  if (!tool) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl space-y-8 py-10">
      <header className="space-y-4 border-b border-line/90 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Tool</p>
        <h1 className="font-serif text-5xl leading-tight text-ink">{tool.title}</h1>
        <p className="text-sm uppercase tracking-[0.12em] text-muted">{toDisplayDate(tool.publishedAt)}</p>
      </header>
      <RichText html={tool.bodyHtml} />
      <div className="flex flex-wrap gap-3">
        <a
          href={tool.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-ink px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-accent hover:text-accent"
        >
          GitHub
        </a>
        {tool.liveUrl ? (
          <a
            href={tool.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-ink px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-paper transition hover:bg-accent"
          >
            Open App
          </a>
        ) : null}
        {tool.chromeStoreUrl ? (
          <a
            href={tool.chromeStoreUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ink px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-accent hover:text-accent"
          >
            Chrome Web Store
          </a>
        ) : null}
      </div>
    </article>
  );
}
