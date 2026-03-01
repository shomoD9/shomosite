/*
 * This file renders the dedicated essays archive route.
 * It exists separately from the homepage section so archive-specific messaging and feed-state handling can evolve independently.
 * It reads Substack-derived entries from the content facade and renders native Substack link previews through the shared embed component.
 */

import { SubstackEmbedGrid } from "@/components/content/substack-embed-grid";
import { getEssayFeed } from "@/lib/content";
import { getSiteConfig } from "@/lib/site-config";
import { buildSectionMetadata } from "@/lib/seo/metadata";

export const revalidate = 86400;

export const metadata = buildSectionMetadata({
  title: "Essays",
  description: "Substack-native essay previews mirrored inside a high-contrast minimalist archive route.",
  pathname: "/essays"
});

export default async function EssaysPage(): Promise<React.JSX.Element> {
  const essays = await getEssayFeed();
  const { substackUrl } = getSiteConfig();

  return (
    <section className="px-6 pb-24 pt-28 md:px-12 md:pb-32 md:pt-36">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-11">
        <header className="max-w-3xl space-y-4">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-accent">Archive</p>
          <h1 className="font-heading text-5xl italic leading-[0.92] text-light md:text-7xl">Essays</h1>
          <p className="text-base leading-relaxed text-muted md:text-lg">
            Placeholder copy. This library uses Substack’s own preview renderer so each entry mirrors source context.
          </p>
        </header>

        {essays.status === "cache" ? (
          <p className="rounded-2xl border border-accent/35 bg-accentSoft px-5 py-4 text-sm text-light/90">
            Live feed is temporarily unreachable. Showing the latest successful cached Substack snapshot.
          </p>
        ) : null}

        {essays.status === "empty" ? (
          <p className="rounded-2xl border border-line bg-white/[0.03] px-5 py-4 text-sm text-muted">
            Substack is temporarily unreachable. Read directly on{" "}
            <a className="text-accent hover:underline" href={substackUrl} target="_blank" rel="noreferrer">
              Substack
            </a>
            .
          </p>
        ) : null}

        {/* We intentionally let Substack own preview visuals so the archive stays canonically faithful. */}
        {essays.items.length ? (
          <SubstackEmbedGrid
            items={essays.items}
            scriptId="substack-embed-archive"
            columnsClassName="grid gap-5 md:grid-cols-2"
          />
        ) : null}
      </div>
    </section>
  );
}
