import { ContentCard } from "@/components/content-card";
import { getEssayFeed } from "@/lib/content";
import { getSiteConfig } from "@/lib/site-config";
import { buildSectionMetadata } from "@/lib/seo/metadata";

export const revalidate = 86400;

export const metadata = buildSectionMetadata({
  title: "Essays",
  description: "Mirror of recent Substack essays with canonical links to original publications.",
  pathname: "/essays"
});

export default async function EssaysPage(): Promise<React.JSX.Element> {
  const essays = await getEssayFeed();
  const { substackUrl } = getSiteConfig();

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-8 py-16 md:px-12">
      <div className="max-w-3xl space-y-4">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-accent">Archive</p>
        <h1 className="font-heading text-[2.75rem] font-medium leading-[1.08] text-ink">Essays</h1>
        <p className="text-lg leading-[1.8] text-muted">
          Mirrored from Substack. Originals preserved there.
        </p>
      </div>

      {essays.status === "cache" ? (
        <p className="rounded-2xl border border-accent/20 bg-accentSoft px-5 py-4 text-sm text-ink">
          Showing the most recent cached essays while Substack is temporarily unreachable.
        </p>
      ) : null}

      {essays.status === "empty" ? (
        <p className="rounded-2xl border border-line bg-accentSoft px-5 py-4 text-sm text-muted">
          Substack is currently unavailable. You can still read directly on{" "}
          <a className="text-accent hover:underline" href={substackUrl} target="_blank" rel="noreferrer">
            Substack
          </a>
          .
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {essays.items.map((essay) => (
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
    </section>
  );
}
