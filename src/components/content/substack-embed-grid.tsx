/*
 * This file renders Substack-native post previews for essay collections.
 * It exists as a shared component so both homepage and essays routes can use the exact same embed contract.
 * It consumes EssayEntry objects from src/types/content.ts and bootstraps Substack's official embed script.
 */

import Script from "next/script";

import type { EssayEntry } from "@/types/content";

type SubstackEmbedGridProps = {
  items: EssayEntry[];
  limit?: number;
  scriptId?: string;
  columnsClassName?: string;
};

export function SubstackEmbedGrid({
  items,
  limit,
  scriptId = "substack-embed-script",
  columnsClassName = "grid gap-5 lg:grid-cols-2"
}: SubstackEmbedGridProps): React.JSX.Element {
  const visibleItems = typeof limit === "number" ? items.slice(0, limit) : items;

  return (
    <>
      {/* We load Substack's own renderer so previews stay faithful to their canonical design system. */}
      <Script id={scriptId} src="https://substackapi.com/embeds.js" strategy="afterInteractive" />

      <div className={columnsClassName}>
        {visibleItems.map((essay, index) => (
          <article key={essay.id} className="substack-shell space-y-4">
            <div className="flex items-center justify-between border-b border-line/80 pb-3">
              <span className="font-mono text-[0.56rem] uppercase tracking-[0.22em] text-accent">
                Essay {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[0.54rem] uppercase tracking-[0.18em] text-muted">Substack preview</span>
            </div>

            {/* The data-post-url is the key hook used by Substack's script to replace this shell with its live embed. */}
            <div className="substack-post-embed" data-post-url={essay.canonicalUrl}>
              <p lang="en">{essay.title}</p>
              <p>{essay.summary}</p>
              <a href={essay.canonicalUrl} data-post-link>
                Read on Substack
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
