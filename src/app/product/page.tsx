/*
 * This file renders the Product page, where product thinking appears as a public line of work rather than a landing-page offer.
 * It exists separately because product material has its own audience and archive even though it shares the overall site shell.
 * The route loads the product document and the selected items tagged for product work.
 */

import { TrackPageTemplate } from "@/components/track-page-template";
import { getTrackProofItems, loadProofItems, loadTrackPage } from "@/lib/content";
import { buildMailtoHref } from "@/lib/mailto";
import { buildMetadata, buildServiceJsonLd } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-config";

const settings = getSiteSettings();

export const metadata = buildMetadata(settings, {
  title: "Product",
  description: "Product thinking, positioning, and conceptual work made public through essays, builds, and decisions.",
  pathname: "/product"
});

export default async function ProductPage(): Promise<React.JSX.Element> {
  const [page, proofItems] = await Promise.all([loadTrackPage("product"), loadProofItems()]);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildServiceJsonLd(settings, {
              name: "Product",
              description: page.summary,
              pathname: "/product"
            })
          )
        }}
        type="application/ld+json"
      />

      <TrackPageTemplate
        ctaHref={buildMailtoHref(
          settings.email,
          page.ctaSubject,
          "Context:\n\nWhat are you building?\n\nWhat feels unclear about the market, positioning, or product shape?"
        )}
        page={page}
        proofItems={getTrackProofItems(proofItems, "product")}
      />
    </>
  );
}
