/*
 * This file defines the shared language for every content surface in the site.
 * It exists separately so routes, adapters, and components can agree on one ontology without duplicating shape logic.
 * Content adapters in src/lib/content produce these types, and UI layers in src/app and src/components consume them.
 */

export type FeedStatus = "live" | "cache" | "empty";

export interface BaseEntry {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  url: string;
  tags: string[];
}

export interface EssayEntry extends BaseEntry {
  source: "substack";
  slug: string;
  canonicalUrl: string;
  html?: string;
  excerpt?: string;
}

export interface VideoEntry extends BaseEntry {
  source: "youtube";
  videoId: string;
  thumbnailUrl?: string;
  duration?: string;
}

export interface BookEntry extends BaseEntry {
  source: "local";
  slug: string;
  author: string;
  cover?: string;
  status: "published" | "in-progress";
  links: {
    primary: string;
    secondary?: string;
  };
  bodyHtml: string;
}

export interface ToolEntry extends BaseEntry {
  source: "local";
  slug: string;
  platform: "web" | "chrome" | "desktop" | "mixed";
  status: "active" | "archived" | "experimental";
  repoUrl: string;
  liveUrl?: string;
  chromeStoreUrl?: string;
  bodyHtml: string;
}

export interface FeedResult<T> {
  items: T[];
  status: FeedStatus;
  error?: string;
}

export interface LatestEntry {
  id: string;
  medium: "essay" | "video" | "tool";
  title: string;
  summary: string;
  publishedAt: string;
  href: string;
}
