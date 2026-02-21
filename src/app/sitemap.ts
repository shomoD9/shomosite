/*
 * This file generates sitemap entries so crawlers can discover all public routes.
 * It is isolated because URL inventory belongs to platform concerns, not view components.
 * Search engines request this route and receive the generated URL list.
 */

import type { MetadataRoute } from "next";

import { getBooks, getEssays, getTools } from "@/lib/content";
import { getSiteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = getSiteConfig();
  const [essays, books, tools] = await Promise.all([getEssays(), getBooks(), getTools()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${siteUrl}/essays`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${siteUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8
    },
    {
      url: `${siteUrl}/books`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7
    },
    {
      url: `${siteUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7
    }
  ];

  // Detail entries are added dynamically so the sitemap evolves with content updates.
  const dynamicEssays = essays.map((essay) => ({
    url: `${siteUrl}/essays/${essay.slug}`,
    lastModified: new Date(essay.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6
  }));

  const dynamicBooks = books.map((book) => ({
    url: `${siteUrl}/books/${book.slug}`,
    lastModified: new Date(book.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5
  }));

  const dynamicTools = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool.slug}`,
    lastModified: new Date(tool.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5
  }));

  return [...staticRoutes, ...dynamicEssays, ...dynamicBooks, ...dynamicTools];
}
