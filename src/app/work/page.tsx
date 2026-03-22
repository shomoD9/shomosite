/*
 * This file renders the Work page, where public material is grouped by medium rather than by page.
 * It is separate because this page is the bridge between the site's framing and the actual body of published work.
 * The route loads curated items from local content files and supplements essays and videos with live feed archives.
 */

import { ArchiveList } from "@/components/archive-list";
import { ProofList } from "@/components/proof-list";
import { SectionReveal } from "@/components/section-reveal";
import { getFeaturedProofItems, getVisibleProofItems, loadProofItems } from "@/lib/content";
import { fetchFeedArchive } from "@/lib/feeds";
import { buildMailtoHref } from "@/lib/mailto";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-config";

const settings = getSiteSettings();

export const metadata = buildMetadata(settings, {
  title: "Work",
  description: "Selected essays, videos, builds, and systems from the practice.",
  pathname: "/work"
});

export default async function WorkPage(): Promise<React.JSX.Element> {
  const proofItems = getVisibleProofItems(await loadProofItems());
  const featuredProof = getFeaturedProofItems(proofItems);
  const essayProof = featuredProof.filter((item) => item.medium === "essay");
  const videoProof = featuredProof.filter((item) => item.medium === "video");
  const buildProof = proofItems.filter((item) => item.medium === "build" || item.medium === "system");
  const [substackArchive, youtubeArchive] = await Promise.all([
    fetchFeedArchive(settings.feedSources[0]),
    fetchFeedArchive(settings.feedSources[1])
  ]);

  return (
    <main className="page-frame">
      <SectionReveal>
        <section className="border-b border-ink/10 pb-12 pt-8 lg:pb-16">
          <p className="section-label">Work</p>
          <h1 className="mt-5 max-w-4xl text-balance font-display text-[clamp(3rem,8vw,6rem)] leading-[0.94] text-ink">
            Essays, videos, builds, and systems.
          </h1>
          <p className="mt-6 max-w-copy text-lg leading-8 text-graphite">
            This is where the practice becomes visible in public, grouped by medium.
          </p>
        </section>
      </SectionReveal>

      <SectionReveal className="section-grid" delay={80}>
        <section className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="section-label">Essays</p>
            <ProofList items={essayProof} />
            <div className="pt-4">
              <ArchiveList
                fallbackMessage={substackArchive.error}
                homeLabel="Open Substack"
                homeUrl={settings.feedSources[0].homeUrl}
                items={substackArchive.items}
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="section-label">Videos</p>
            <ProofList items={videoProof} />
            <div className="pt-4">
              <ArchiveList
                fallbackMessage={youtubeArchive.error}
                homeLabel="Open YouTube"
                homeUrl={settings.feedSources[1].homeUrl}
                items={youtubeArchive.items}
              />
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal className="section-grid border-b border-ink/10" delay={140}>
        <section className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <p className="section-label">Builds &amp; systems</p>
            <p className="max-w-sm text-sm leading-7 text-graphite">
              Some systems work stays private, so the public selection here is intentionally spare.
            </p>
          </div>

          <div className="space-y-8">
            <ProofList items={buildProof} />
            <a
              className="inline-flex items-center gap-3 border-b border-ink/30 pb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:text-steel"
              href={buildMailtoHref(
                settings.email,
                "Question about related work",
                "Context:\n\nWhat piece of work here overlaps with what you are trying to do?"
              )}
            >
              Write to me about related work
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </SectionReveal>
    </main>
  );
}
