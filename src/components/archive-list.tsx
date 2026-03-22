/*
 * This file renders lightweight imported archive rows from public feeds.
 * It is separate because live feed items behave differently from manual proof: they can fail, disappear, or refresh.
 * The Work page and Prose page use it to show recent essays or videos without hardcoding them.
 */

import Link from "next/link";

import type { FeedArchiveItem } from "@/lib/content-types";
import { formatEditorialDate } from "@/lib/date";

type ArchiveListProps = {
  items: FeedArchiveItem[];
  fallbackMessage?: string;
  homeUrl: string;
  homeLabel: string;
};

export function ArchiveList({
  items,
  fallbackMessage,
  homeUrl,
  homeLabel
}: ArchiveListProps): React.JSX.Element {
  if (!items.length) {
    return (
      <div className="space-y-3">
        <p className="max-w-copy text-sm leading-7 text-graphite">{fallbackMessage}</p>
        <Link
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-steel transition-colors duration-300 hover:text-ink"
          href={homeUrl}
          rel="noreferrer"
          target="_blank"
        >
          {homeLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="border-t border-ink/10">
      {items.map((item) => (
        <Link
          className="group grid gap-3 border-b border-ink/10 py-4 transition-colors duration-300 hover:bg-ink/[0.02] md:grid-cols-[minmax(0,1fr)_auto]"
          href={item.url}
          key={item.id}
          rel="noreferrer"
          target="_blank"
        >
          <div className="space-y-1.5">
            <p className="font-display text-xl leading-tight text-ink transition-transform duration-300 group-hover:translate-x-1">
              {item.title}
            </p>
            <p className="max-w-copy text-sm leading-7 text-graphite">{item.summary}</p>
          </div>

          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-graphite">
            {formatEditorialDate(item.publishedAt)}
          </span>
        </Link>
      ))}
    </div>
  );
}
