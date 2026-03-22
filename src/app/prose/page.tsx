/*
 * This file renders the Prose page, where writing is framed as one public craft inside the broader practice.
 * It is separate because this page combines the shared inner-page template with writing-specific archive material from external feeds.
 * The route loads local track copy, curated proof, and live writing/video archives before handing them to the template.
 */

import { ArchiveList } from "@/components/archive-list";
import { SectionReveal } from "@/components/section-reveal";
import { TrackPageTemplate } from "@/components/track-page-template";
import { getTrackProofItems, loadProofItems, loadTrackPage } from "@/lib/content";
import { fetchFeedArchive } from "@/lib/feeds";
import { buildMailtoHref } from "@/lib/mailto";
import { buildMetadata, buildServiceJsonLd } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-config";

const settings = getSiteSettings();

export const metadata = buildMetadata(settings, {
  title: "Prose",
  description: "Published writing and language work from an independent research practice.",
  pathname: "/prose"
});

export default async function ProsePage(): Promise<React.JSX.Element> {
  const [page, proofItems] = await Promise.all([loadTrackPage("prose"), loadProofItems()]);
  const proseProof = getTrackProofItems(proofItems, "prose");
  const [substackArchive, youtubeArchive] = await Promise.all([
    fetchFeedArchive(settings.feedSources[0]),
    fetchFeedArchive(settings.feedSources[1])
  ]);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildServiceJsonLd(settings, {
              name: "Prose",
              description: page.summary,
              pathname: "/prose"
            })
          )
        }}
        type="application/ld+json"
      />

      <TrackPageTemplate
        ctaHref={buildMailtoHref(settings.email, page.ctaSubject, "Context:\n\nWhat needs language right now?\n\nWhere is the voice breaking down?")}
        page={page}
        proofItems={proseProof}
      >
        <SectionReveal className="section-grid" delay={220}>
          <section className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="section-label">Recent essays</p>
              <ArchiveList
                fallbackMessage={substackArchive.error}
                homeLabel="Visit Substack"
                homeUrl={settings.feedSources[0].homeUrl}
                items={substackArchive.items}
              />
            </div>

            <div className="space-y-4">
              <p className="section-label">Selected videos</p>
              <ArchiveList
                fallbackMessage={youtubeArchive.error}
                homeLabel="Visit the channel"
                homeUrl={settings.feedSources[1].homeUrl}
                items={youtubeArchive.items}
              />
            </div>
          </section>
        </SectionReveal>
      </TrackPageTemplate>
    </>
  );
}
