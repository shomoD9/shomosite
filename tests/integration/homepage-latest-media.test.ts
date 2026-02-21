/*
 * This file verifies the homepage-level aggregation behavior across media types.
 * It is separated because ranking/limit rules are product logic distinct from rendering markup.
 * The test imports buildLatestAcrossMedia from src/lib/content/aggregate.ts.
 */

import { buildLatestAcrossMedia } from "@/lib/content/aggregate";

describe("buildLatestAcrossMedia", () => {
  it("sorts across mediums by date and applies the requested limit", () => {
    const latest = buildLatestAcrossMedia({
      essays: [
        {
          id: "essay-a",
          source: "substack",
          slug: "essay-a",
          canonicalUrl: "https://example.com/essay-a",
          title: "Essay A",
          summary: "Essay summary",
          excerpt: "Essay summary",
          publishedAt: "2024-01-02T00:00:00.000Z",
          url: "https://example.com/essay-a",
          tags: []
        }
      ],
      videos: [
        {
          id: "video-b",
          source: "youtube",
          videoId: "video-b",
          title: "Video B",
          summary: "Video summary",
          publishedAt: "2024-01-03T00:00:00.000Z",
          url: "https://youtube.com/watch?v=video-b",
          tags: []
        }
      ],
      tools: [
        {
          id: "tool-c",
          source: "local",
          slug: "tool-c",
          title: "Tool C",
          summary: "Tool summary",
          publishedAt: "2024-01-01T00:00:00.000Z",
          url: "https://example.com/tool-c",
          tags: [],
          platform: "web",
          status: "active",
          repoUrl: "https://github.com/example/tool-c",
          bodyHtml: ""
        }
      ],
      limit: 2
    });

    // Cross-medium order should reflect recency, not source type.
    expect(latest).toHaveLength(2);
    expect(latest[0]?.medium).toBe("video");
    expect(latest[1]?.medium).toBe("essay");
  });
});
