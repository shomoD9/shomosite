/*
 * This file renders the Productivity page, where the practice's research center becomes explicit.
 * It is separate because this page speaks to systems, workflows, and tool use rather than language or product shape alone.
 * The route loads the local track document plus any public proof currently available for productivity work.
 */

import { TrackPageTemplate } from "@/components/track-page-template";
import { getTrackProofItems, loadProofItems, loadTrackPage } from "@/lib/content";
import { buildMailtoHref } from "@/lib/mailto";
import { buildMetadata, buildServiceJsonLd } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-config";

const settings = getSiteSettings();

export const metadata = buildMetadata(settings, {
  title: "Productivity",
  description: "Systems, workflows, and practical AI use in the service of calmer, clearer work.",
  pathname: "/productivity"
});

export default async function ProductivityPage(): Promise<React.JSX.Element> {
  const [page, proofItems] = await Promise.all([loadTrackPage("productivity"), loadProofItems()]);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildServiceJsonLd(settings, {
              name: "Productivity",
              description: page.summary,
              pathname: "/productivity"
            })
          )
        }}
        type="application/ld+json"
      />

      <TrackPageTemplate
        ctaHref={buildMailtoHref(
          settings.email,
          page.ctaSubject,
          "Context:\n\nWhich part of the workflow is breaking?\n\nWhat would better leverage actually change for you?"
        )}
        page={page}
        proofItems={getTrackProofItems(proofItems, "productivity")}
      />
    </>
  );
}
