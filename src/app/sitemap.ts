/*
 * This file publishes the canonical list of public routes for crawlers.
 * It is separated from page code so discoverability stays synchronized with the route surface in one place.
 * Next.js turns this module into `/sitemap.xml`.
 */

import type { MetadataRoute } from "next";

import { getSiteSettings } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const settings = getSiteSettings();
  const routes = ["/", "/prose", "/product", "/productivity", "/work", "/collaborate"];

  return routes.map((pathname) => ({
    url: new URL(pathname, settings.siteUrl).toString(),
    changeFrequency: "weekly",
    priority: pathname === "/" ? 1 : 0.7
  }));
}
