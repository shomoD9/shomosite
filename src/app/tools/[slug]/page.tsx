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
    <article className="mx-auto max-w-3xl space-y-8 px-8 py-16 md:px-12">
      <header className="space-y-4 border-b border-line pb-8">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-accent">Tool</p>
        <h1 className="font-heading text-[2.75rem] font-medium leading-[1.08] text-ink">{tool.title}</h1>
        <p className="font-mono text-[0.72rem] text-muted/60">{toDisplayDate(tool.publishedAt)}</p>
      </header>
      <RichText html={tool.bodyHtml} />
      <div className="flex flex-wrap gap-3">
        <a
          href={tool.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="magnetic-btn rounded-full border border-line px-6 py-3 text-[0.72rem] uppercase tracking-[0.15em] text-muted transition hover:border-accent hover:text-accent"
        >
          GitHub
        </a>
        {tool.liveUrl ? (
          <a
            href={tool.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="magnetic-btn slide-bg-btn rounded-full border border-accent/40 px-6 py-3 text-[0.72rem] uppercase tracking-[0.15em] text-accent"
          >
            Open App
          </a>
        ) : null}
        {tool.chromeStoreUrl ? (
          <a
            href={tool.chromeStoreUrl}
            target="_blank"
            rel="noreferrer"
            className="magnetic-btn rounded-full border border-line px-6 py-3 text-[0.72rem] uppercase tracking-[0.15em] text-muted transition hover:border-accent hover:text-accent"
          >
            Chrome Web Store
          </a>
        ) : null}
      </div>
    </article>
  );
}
