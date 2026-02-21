/*
 * This file defines a shared fallback UI for unknown routes and missing dynamic entries.
 * It is separated so not-found language remains consistent regardless of which route failed.
 * Dynamic pages call notFound() and Next.js renders this component automatically.
 */

import Link from "next/link";

export default function NotFound(): React.JSX.Element {
  return (
    <section className="mx-auto max-w-3xl space-y-6 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Not Found</p>
      <h1 className="font-serif text-5xl text-ink">That page is not in the archive.</h1>
      <p className="text-lg text-muted">Try the homepage to continue through essays, videos, books, and tools.</p>
      <Link
        href="/"
        className="inline-flex rounded-full border border-ink px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-accent hover:text-accent"
      >
        Return Home
      </Link>
    </section>
  );
}
