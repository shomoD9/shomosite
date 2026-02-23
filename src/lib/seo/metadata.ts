/*
 * This file builds reusable metadata helpers for all public pages.
 * It is isolated so title/description/canonical logic stays consistent and centrally editable.
 * Route files call these helpers when exporting Next.js Metadata and dynamic metadata generators.
 */

import type { Metadata } from "next";

import { getSiteConfig } from "@/lib/site-config";

const baseDescription =
  "Builder, storyteller. Essays, videos, books, and software by Shomodip De.";

export function buildBaseMetadata(): Metadata {
  const { siteUrl } = getSiteConfig();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Shomodip De",
      template: "%s — Shomodip De"
    },
    description: baseDescription,
    openGraph: {
      type: "website",
      title: "Shomodip De",
      description: baseDescription,
      url: siteUrl,
      siteName: "Shomodip De"
    },
    twitter: {
      card: "summary_large_image",
      title: "Shomodip De",
      description: baseDescription
    }
  };
}

export function buildSectionMetadata(options: {
  title: string;
  description: string;
  pathname: string;
}): Metadata {
  const { siteUrl } = getSiteConfig();
  const url = `${siteUrl}${options.pathname}`;

  return {
    title: options.title,
    description: options.description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: `${options.title} — Shomodip De`,
      description: options.description,
      url
    },
    twitter: {
      title: `${options.title} — Shomodip De`,
      description: options.description
    }
  };
}
