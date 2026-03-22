/*
 * This file builds metadata and structured data from the site's shared configuration.
 * It is separate so search-facing identity stays synchronized across routes instead of being hand-written repeatedly.
 * The layout and page files import these helpers when declaring metadata or JSON-LD.
 */

import type { Metadata } from "next";

import type { SiteSettings } from "@/lib/content-types";

type MetadataInput = {
  title: string;
  description: string;
  pathname: string;
};

export function buildMetadata(settings: SiteSettings, input: MetadataInput): Metadata {
  const absoluteUrl = new URL(input.pathname, settings.siteUrl).toString();

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: absoluteUrl
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: absoluteUrl,
      siteName: settings.name,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description
    }
  };
}

export function buildPersonJsonLd(settings: SiteSettings): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.name,
    url: settings.siteUrl,
    email: settings.email,
    jobTitle: "Independent researcher, writer, and builder",
    sameAs: settings.socialLinks
      .map((link) => link.url)
      .filter((url): url is string => typeof url === "string" && !url.startsWith("mailto:"))
  };
}

export function buildServiceJsonLd(
  settings: SiteSettings,
  input: { name: string; description: string; pathname: string }
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    provider: {
      "@type": "Person",
      name: settings.name,
      url: settings.siteUrl
    },
    areaServed: "Worldwide",
    url: new URL(input.pathname, settings.siteUrl).toString()
  };
}
