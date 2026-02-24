import { ContentCard } from "@/components/content-card";
import type { LatestEntry } from "@/types/content";

type LatestMediaProps = {
  items: LatestEntry[];
};

export function LatestMedia({ items }: LatestMediaProps): React.JSX.Element {
  return (
    <section id="recent" className="mx-auto w-full max-w-6xl space-y-8 px-8 py-20 md:px-12">
      <div className="flex items-end justify-between gap-6">
        <h2 className="font-heading text-3xl font-medium text-ink">Recent</h2>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted/60">
          Latest across media
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ContentCard
            key={item.id}
            title={item.title}
            summary={item.summary}
            href={item.href}
            publishedAt={item.publishedAt}
            medium={item.medium}
            external={item.medium === "video"}
          />
        ))}
      </div>
      <hr className="separator mt-10" />
    </section>
  );
}
