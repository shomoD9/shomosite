import Link from "next/link";

export default function NotFound(): React.JSX.Element {
  return (
    <section className="mx-auto max-w-3xl space-y-6 px-8 py-32 text-center md:px-12">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-accent">Not Found</p>
      <h1 className="font-heading text-[2.75rem] font-medium text-ink">That page is not in the archive.</h1>
      <p className="text-lg text-muted">Try the homepage to continue through essays, videos, books, and tools.</p>
      <Link
        href="/"
        className="magnetic-btn inline-flex rounded-full border border-accent/40 px-7 py-3 text-[0.72rem] uppercase tracking-[0.15em] text-accent transition hover:border-accent hover:text-ink"
      >
        Return Home
      </Link>
    </section>
  );
}
