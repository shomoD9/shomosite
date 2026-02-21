/*
 * This file composes multiple content streams into homepage-ready slices.
 * It exists separately because cross-medium ranking and limiting is product logic, not route boilerplate.
 * The home route imports these utilities to build the "Latest Across Media" section.
 */

import { toEpoch } from "@/lib/date";
import type { EssayEntry, LatestEntry, ToolEntry, VideoEntry } from "@/types/content";

export function buildLatestAcrossMedia(options: {
  essays: EssayEntry[];
  videos: VideoEntry[];
  tools: ToolEntry[];
  limit?: number;
}): LatestEntry[] {
  const merged: LatestEntry[] = [
    ...options.essays.map((essay) => ({
      id: `essay-${essay.id}`,
      medium: "essay" as const,
      title: essay.title,
      summary: essay.summary,
      publishedAt: essay.publishedAt,
      href: `/essays/${essay.slug}`
    })),
    ...options.videos.map((video) => ({
      id: `video-${video.id}`,
      medium: "video" as const,
      title: video.title,
      summary: video.summary,
      publishedAt: video.publishedAt,
      href: video.url
    })),
    ...options.tools.map((tool) => ({
      id: `tool-${tool.id}`,
      medium: "tool" as const,
      title: tool.title,
      summary: tool.summary,
      publishedAt: tool.publishedAt,
      href: `/tools/${tool.slug}`
    }))
  ];

  // We rank everything by recency so the homepage reflects current activity rather than medium priority.
  const sorted = merged.sort((a, b) => toEpoch(b.publishedAt) - toEpoch(a.publishedAt));
  return sorted.slice(0, options.limit ?? 6);
}
