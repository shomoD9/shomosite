/*
 * This file declares crawler directives and sitemap location for search engines.
 * It exists separately because robots policy is operational metadata rather than page content.
 * Next.js reads this route handler to emit the site's robots.txt response.
 */

import type { MetadataRoute } from "next";

import { getSiteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const { siteUrl } = getSiteConfig();

  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
