/*
 * This file ingests YouTube Atom entries and maps them into the site's video model.
 * It is separated from page code so XML shape changes are isolated to one adapter boundary.
 * The videos route and homepage call this module through src/lib/content/index.ts.
 */

import { asArray, parseXml } from "@/lib/content/rss";
import { getSiteConfig } from "@/lib/site-config";
import type { VideoEntry } from "@/types/content";

type YouTubeFeed = {
  feed?: {
    entry?: YouTubeEntry | YouTubeEntry[];
  };
};

type YouTubeEntry = {
  "yt:videoId"?: string;
  title?: string;
  published?: string;
  link?: { href?: string } | Array<{ href?: string }>;
  "media:group"?: {
    "media:description"?: string;
    "media:thumbnail"?: { url?: string } | Array<{ url?: string }>;
  };
};

function extractVideoUrl(entry: YouTubeEntry, videoId: string): string {
  const links = asArray(entry.link);
  const first = links.find((link) => Boolean(link?.href));
  return first?.href || `https://www.youtube.com/watch?v=${videoId}`;
}

function normalizeSummary(raw?: string): string {
  if (!raw?.trim()) {
    return "No description available.";
  }

  const collapsed = raw.replace(/\s+/g, " ").trim();
  return collapsed.length > 190 ? `${collapsed.slice(0, 187)}...` : collapsed;
}

export function parseYouTubeFeed(xml: string): VideoEntry[] {
  const payload = parseXml<YouTubeFeed>(xml);
  const entries = asArray(payload.feed?.entry);

  return entries
    .map((entry, index) => {
      const videoId = entry["yt:videoId"] || `unknown-${index}`;
      const thumbnails = asArray(entry["media:group"]?.["media:thumbnail"]);

      return {
        id: videoId,
        source: "youtube",
        videoId,
        title: entry.title || "Untitled Video",
        summary: normalizeSummary(entry["media:group"]?.["media:description"]),
        publishedAt: entry.published || new Date(0).toISOString(),
        url: extractVideoUrl(entry, videoId),
        thumbnailUrl: thumbnails[0]?.url,
        tags: ["video"]
      } satisfies VideoEntry;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function fetchYouTubeVideos(): Promise<VideoEntry[]> {
  const { youtubeFeedUrl, youtubeChannelUrl } = getSiteConfig();

  const response = await fetch(youtubeFeedUrl, {
    headers: {
      Accept: "application/atom+xml, application/xml;q=0.9, */*;q=0.8"
    },
    next: {
      revalidate: 86400,
      tags: ["youtube-feed"]
    }
  });

  if (!response.ok) {
    throw new Error(`YouTube feed request failed with status ${response.status}`);
  }

  const xml = await response.text();
  const videos = parseYouTubeFeed(xml);

  if (!videos.length) {
    throw new Error("YouTube feed returned no entries");
  }

  return videos.map((video) => ({
    ...video,
    url: video.url || youtubeChannelUrl
  }));
}
