/*
 * This file renders individual book detail pages from local MDX source.
 * It is separate because book pages have richer body content and outbound reading links.
 * It uses book entries from src/lib/content and rich text rendering from src/components.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RichText } from "@/components/rich-text";
import { toDisplayDate } from "@/lib/date";
import { getBooks } from "@/lib/content";

type BookDetailProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const books = await getBooks();
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: BookDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const books = await getBooks();
  const book = books.find((candidate) => candidate.slug === slug);

  if (!book) {
    return { title: "Book Not Found" };
  }

  return {
    title: book.title,
    description: book.summary,
    alternates: {
      canonical: `/books/${book.slug}`
    }
  };
}

export default async function BookDetailPage({ params }: BookDetailProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const books = await getBooks();
  const book = books.find((candidate) => candidate.slug === slug);

  if (!book) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl space-y-8 px-8 py-16 md:px-12">
      <header className="space-y-4 border-b border-line pb-8">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-accent">Book</p>
        <h1 className="font-heading text-[2.75rem] font-medium leading-[1.08] text-ink">{book.title}</h1>
        <p className="font-mono text-[0.72rem] text-muted/60">{toDisplayDate(book.publishedAt)}</p>
      </header>
      <RichText html={book.bodyHtml} />
      <div className="flex flex-wrap gap-3">
        <a
          href={book.links.primary}
          target="_blank"
          rel="noreferrer"
          className="magnetic-btn slide-bg-btn rounded-full border border-accent/40 px-6 py-3 text-[0.72rem] uppercase tracking-[0.15em] text-accent"
        >
          Primary Link
        </a>
        {book.links.secondary ? (
          <a
            href={book.links.secondary}
            target="_blank"
            rel="noreferrer"
            className="magnetic-btn rounded-full border border-line px-6 py-3 text-[0.72rem] uppercase tracking-[0.15em] text-muted transition hover:border-accent hover:text-accent"
          >
            Secondary Link
          </a>
        ) : null}
      </div>
    </article>
  );
}
