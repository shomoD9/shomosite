/*
 * This file generates structured data payloads for search engines and rich previews.
 * It exists separately so schema logic remains explicit and reusable across routes.
 * Home and essay detail routes import these helpers to emit Person and Article schema blocks.
 */

import { getSiteConfig } from "@/lib/site-config";
import type { EssayEntry } from "@/types/content";

export function buildPersonJsonLd(): Record<string, unknown> {
  const config = getSiteConfig();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Shomo",
    url: config.siteUrl,
    // We include all major identity surfaces so search engines can reconcile authorship across platforms.
    sameAs: [config.substackUrl, config.youtubeChannelUrl, config.linkedinUrl],
    jobTitle: "Writer and Product Tinkerer",
    description:
      "Writer, video essayist, and product tinkerer publishing essays, books, commentary, and software tools."
  };
}

export function buildEssayJsonLd(essay: EssayEntry): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: essay.title,
    datePublished: essay.publishedAt,
    description: essay.summary,
    url: essay.canonicalUrl,
    mainEntityOfPage: essay.canonicalUrl,
    author: {
      "@type": "Person",
      name: "Shomo"
    },
    publisher: {
      "@type": "Organization",
      name: "Substack"
    }
  };
}
