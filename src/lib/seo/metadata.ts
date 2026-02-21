/*
 * This file builds reusable metadata helpers for all public pages.
 * It is isolated so title/description/canonical logic stays consistent and centrally editable.
 * Route files call these helpers when exporting Next.js Metadata and dynamic metadata generators.
 */

import type { Metadata } from "next";

import { getSiteConfig } from "@/lib/site-config";

const baseDescription =
  "Writer, video essayist, and product tinkerer building a calm home for essays, commentary, books, and software.";

export function buildBaseMetadata(): Metadata {
  const { siteUrl } = getSiteConfig();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Shomo | Essays, Videos, Books, and Tools",
      template: "%s | Shomo"
    },
    description: baseDescription,
    openGraph: {
      type: "website",
      title: "Shomo | Essays, Videos, Books, and Tools",
      description: baseDescription,
      url: siteUrl,
      siteName: "Shomo"
    },
    twitter: {
      card: "summary_large_image",
      title: "Shomo | Essays, Videos, Books, and Tools",
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
      title: `${options.title} | Shomo`,
      description: options.description,
      url
    },
    twitter: {
      title: `${options.title} | Shomo`,
      description: options.description
    }
  };
}
