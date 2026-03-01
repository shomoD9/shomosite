/*
 * This file renders the essay section on the homepage using Substack-native previews.
 * It exists as a dedicated section component so the homepage route can stay a high-level composer of mediums.
 * It consumes feed status and essay entries, and delegates embed rendering to src/components/content/substack-embed-grid.tsx.
 */

import Link from "next/link";

import { SubstackEmbedGrid } from "@/components/content/substack-embed-grid";
import type { EssayEntry, FeedStatus } from "@/types/content";

type EssayIndexProps = {
  items: EssayEntry[];
  status: FeedStatus;
};

export function EssayIndex({ items, status }: EssayIndexProps): React.JSX.Element {
  return (
    <section id="essays" className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-accent">Essays</p>
            <h2 className="font-heading text-4xl italic leading-[0.92] text-light md:text-6xl">
              Long-form arguments,
              <br />
              directly embedded from source.
            </h2>
          </div>

          <Link
            href="/essays"
            className="inline-flex w-fit rounded-full border border-line px-5 py-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-light/80 transition-colors hover:border-accent/70 hover:text-accent"
          >
            Essay Library
          </Link>
        </div>

        {/* Feed state remains visible so users understand whether they are seeing live or cached snapshots. */}
        {status === "cache" ? (
          <p className="rounded-2xl border border-accent/35 bg-accentSoft px-5 py-4 text-sm text-light/90">
            Live feed is temporarily unreachable. Showing the latest successful Substack snapshot.
          </p>
        ) : null}

        {items.length ? (
          <SubstackEmbedGrid items={items} limit={4} scriptId="substack-embed-home" />
        ) : (
          <p className="rounded-2xl border border-line bg-white/[0.03] px-5 py-4 text-sm text-muted">
            No essay entries are available right now. Placeholder fallback is active.
          </p>
        )}
      </div>
    </section>
  );
}
