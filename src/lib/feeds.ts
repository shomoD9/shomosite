/*
 * This file pulls lightweight archive data from public Substack and YouTube feeds.
 * It lives on its own so network failures, XML parsing, and fallback behavior stay isolated from page composition.
 * The Work page and selected track pages call these helpers when they need live archive context.
 */

import { XMLParser } from "fast-xml-parser";

import type { FeedArchiveItem, FeedArchiveResult, FeedSource } from "@/lib/content-types";

type SubstackPayload = {
  rss?: {
    channel?: {
      item?: SubstackItem | SubstackItem[];
    };
  };
};

type SubstackItem = {
  guid?: string;
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
};

type YouTubePayload = {
  feed?: {
    entry?: YouTubeItem | YouTubeItem[];
  };
};

type YouTubeItem = {
  "yt:videoId"?: string;
  title?: string;
  published?: string;
  link?: { href?: string } | Array<{ href?: string }>;
  "media:group"?: {
    "media:description"?: string;
  };
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: ""
});

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(input: string, maxLength = 180): string {
  if (input.length <= maxLength) {
    return input;
  }

  return `${input.slice(0, maxLength - 3).trim()}...`;
}

function safeDate(input?: string): string {
  const parsed = input ? new Date(input) : new Date(0);
  return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString();
}

export function parseSubstackFeed(xml: string): FeedArchiveItem[] {
  const payload = parser.parse(xml) as SubstackPayload;
  const items = asArray(payload.rss?.channel?.item);

  return items
    .map((item, index) => ({
      id: item.guid || item.link || `substack-${index}`,
      title: item.title || "Untitled essay",
      medium: "essay" as const,
      url: item.link || "",
      summary: truncate(stripHtml(item.description || "No summary available.")),
      sourceLabel: "Substack",
      publishedAt: safeDate(item.pubDate)
    }))
    .filter((item) => Boolean(item.url))
    .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime());
}

export function parseYouTubeFeed(xml: string): FeedArchiveItem[] {
  const payload = parser.parse(xml) as YouTubePayload;
  const entries = asArray(payload.feed?.entry);

  return entries
    .map((entry, index) => {
      const videoId = entry["yt:videoId"] || `video-${index}`;
      const firstLink = asArray(entry.link).find((link) => Boolean(link?.href));

      return {
        id: videoId,
        title: entry.title || "Untitled video",
        medium: "video" as const,
        url: firstLink?.href || `https://www.youtube.com/watch?v=${videoId}`,
        summary: truncate(
          (entry["media:group"]?.["media:description"] || "No summary available.").replace(/\s+/g, " ").trim()
        ),
        sourceLabel: "YouTube",
        publishedAt: safeDate(entry.published)
      };
    })
    .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime());
}

export async function fetchFeedArchive(source: FeedSource): Promise<FeedArchiveResult> {
  // A missing feed URL should not break the page; it simply means we fall back to the canonical home link.
  if (!source.url) {
    return {
      items: [],
      error: source.fallbackMessage
    };
  }

  try {
    const response = await fetch(source.url, {
      headers: {
        Accept: "application/xml, text/xml;q=0.9, */*;q=0.8"
      },
      next: {
        revalidate: 86400,
        tags: [source.id]
      }
    });

    if (!response.ok) {
      throw new Error(`${source.id} responded with ${response.status}`);
    }

    const xml = await response.text();
    const items = source.id === "substack" ? parseSubstackFeed(xml) : parseYouTubeFeed(xml);

    return {
      items: items.slice(0, 6),
      error: items.length ? undefined : source.fallbackMessage
    };
  } catch {
    // The UI presents the fallback message instead of surfacing transport details to visitors.
    return {
      items: [],
      error: source.fallbackMessage
    };
  }
}
