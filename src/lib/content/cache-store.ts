/*
 * This file provides a lightweight in-memory fallback cache for external feeds.
 * It is separate so resilience behavior is explicit and reusable across multiple adapters.
 * Feed adapters call this helper to preserve last successful payloads when upstream services fail.
 */

import type { FeedResult } from "@/types/content";

type CacheRecord<T> = {
  items: T[];
  lastUpdatedAt: string;
};

const memoryCache = new Map<string, CacheRecord<unknown>>();

export async function withLastSuccessfulCache<T>(
  key: string,
  loader: () => Promise<T[]>
): Promise<FeedResult<T>> {
  try {
    // The live fetch path refreshes cache so stale data is replaced as soon as upstream recovers.
    const items = await loader();
    memoryCache.set(key, { items, lastUpdatedAt: new Date().toISOString() });

    return {
      items,
      status: "live"
    };
  } catch (error) {
    const cached = memoryCache.get(key) as CacheRecord<T> | undefined;

    if (cached) {
      return {
        items: cached.items,
        status: "cache",
        error: error instanceof Error ? error.message : "Feed request failed"
      };
    }

    return {
      items: [],
      status: "empty",
      error: error instanceof Error ? error.message : "Feed request failed"
    };
  }
}
