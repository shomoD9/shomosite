/*
 * This file renders the index for curated book entries maintained in local MDX files.
 * It is its own route so book context and detail navigation remain independent from feed-based content.
 * The route reads parsed entries from src/lib/content and renders them with shared cards.
 */

import { ContentCard } from "@/components/content-card";
import { getBooks } from "@/lib/content";
import { buildSectionMetadata } from "@/lib/seo/metadata";

export const metadata = buildSectionMetadata({
  title: "Books",
  description: "Books and long-form publications curated locally with editorial context.",
  pathname: "/books"
});

export default async function BooksPage(): Promise<React.JSX.Element> {
  const books = await getBooks();

  return (
    <section className="space-y-8 py-10">
      <div className="max-w-3xl space-y-4">
        <h1 className="font-heading text-[2.75rem] font-medium leading-[1.08] text-ink">Books</h1>
        <p className="text-lg leading-[1.8] text-muted">
          Published and in progress.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {books.map((book) => (
          <ContentCard
            key={book.id}
            title={book.title}
            summary={book.summary}
            href={`/books/${book.slug}`}
            publishedAt={book.publishedAt}
            medium="book"
          />
        ))}
      </div>
    </section>
  );
}
