/*
 * This file renders the homepage's cross-medium recency strip.
 * It is separated because this section has specific aggregation semantics different from single-medium pages.
 * The home route passes normalized latest entries into this component.
 */

import { ContentCard } from "@/components/content-card";
import type { LatestEntry } from "@/types/content";

type LatestMediaProps = {
  items: LatestEntry[];
};

export function LatestMedia({ items }: LatestMediaProps): React.JSX.Element {
  return (
    <section className="animate-fade-up space-y-6 pt-2 pb-4">
      <h2 className="font-heading text-2xl font-medium text-ink">Recent</h2>
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
      <hr className="separator mt-8" />
    </section>
  );
}
