/*
 * This file renders the site's manual public-work rows without turning them into generic card grids.
 * It exists separately because selected work appears on multiple pages and should keep the same editorial rhythm.
 * The homepage, inner pages, and Work page use it to present curated links with dates, metrics, and summaries.
 */

import Link from "next/link";

import type { ProofItem } from "@/lib/content-types";
import { formatEditorialDate } from "@/lib/date";

type ProofListProps = {
  items: ProofItem[];
  emptyMessage?: string;
};

export function ProofList({ items, emptyMessage }: ProofListProps): React.JSX.Element {
  if (!items.length) {
    return (
      <p className="max-w-copy text-sm leading-7 text-graphite">
        {emptyMessage || "More public work will appear here as it is published."}
      </p>
    );
  }

  return (
    <div className="border-t border-ink/10">
      {items.map((item) => {
        const publishedAt = formatEditorialDate(item.publishedAt);

        return (
          <Link
            className="group grid gap-4 border-b border-ink/10 py-5 transition-colors duration-300 hover:bg-ink/[0.02] md:grid-cols-[minmax(0,1fr)_auto]"
            href={item.url as string}
            key={item.id}
            rel="noreferrer"
            target="_blank"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-graphite">
                <span className="font-mono">{item.sourceLabel}</span>
                <span className="h-px w-5 bg-ink/10" />
                <span className="font-mono">{item.medium}</span>
              </div>
              <h3 className="max-w-copy font-display text-2xl leading-tight text-ink transition-transform duration-300 group-hover:translate-x-1">
                {item.title}
              </h3>
              <p className="max-w-copy text-sm leading-7 text-graphite">{item.summary}</p>
            </div>

            <div className="flex flex-col items-start justify-between gap-3 text-left md:items-end md:text-right">
              {/* Metrics are optional, so we only show them when the content file makes a concrete claim. */}
              {item.metric ? <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-steel">{item.metric}</span> : null}
              {publishedAt ? (
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-graphite">{publishedAt}</span>
              ) : null}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
