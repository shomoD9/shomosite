/*
 * This file declares the site's crawler rules from the same shared settings used by the rest of the app.
 * It exists separately because search engines expect a dedicated robots endpoint rather than inferring intent from page markup.
 * Next.js turns this module into `/robots.txt` at build time.
 */

import type { MetadataRoute } from "next";

import { getSiteSettings } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const settings = getSiteSettings();

  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${settings.siteUrl}/sitemap.xml`
  };
}
