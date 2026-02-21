/*
 * This file is the public data-access facade consumed by route files.
 * It exists so pages import one stable contract while adapter internals can evolve independently.
 * Route modules call these functions directly to load feed-backed and local content streams.
 */

import { withLastSuccessfulCache } from "@/lib/content/cache-store";
import { getBooks as loadBooks, getTools as loadTools } from "@/lib/content/mdx";
import { fetchSubstackEssays } from "@/lib/content/substack";
import { fetchYouTubeVideos } from "@/lib/content/youtube";
import type { EssayEntry, FeedResult, VideoEntry } from "@/types/content";

export async function getEssayFeed(): Promise<FeedResult<EssayEntry>> {
  return withLastSuccessfulCache("substack-essays", fetchSubstackEssays);
}

export async function getVideoFeed(): Promise<FeedResult<VideoEntry>> {
  return withLastSuccessfulCache("youtube-videos", fetchYouTubeVideos);
}

export async function getEssays(): Promise<EssayEntry[]> {
  const result = await getEssayFeed();
  return result.items;
}

export async function getVideos(): Promise<VideoEntry[]> {
  const result = await getVideoFeed();
  return result.items;
}

export { loadBooks as getBooks, loadTools as getTools };
