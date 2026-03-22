/*
 * This file verifies that the feed parsers turn XML into the normalized archive items the UI expects.
 * It is separate because parser correctness is easier to reason about in isolation than through page renders.
 * Vitest runs these assertions against the pure functions exported from `src/lib/feeds.ts`.
 */

import { parseSubstackFeed, parseYouTubeFeed } from "@/lib/feeds";

describe("feed parsers", () => {
  it("normalizes and sorts Substack RSS items", () => {
    const xml = `
      <rss>
        <channel>
          <item>
            <guid>older</guid>
            <title>Older essay</title>
            <link>https://example.substack.com/p/older</link>
            <pubDate>Wed, 01 Jan 2025 10:00:00 GMT</pubDate>
            <description><![CDATA[<p>Older summary</p>]]></description>
          </item>
          <item>
            <guid>newer</guid>
            <title>Newer essay</title>
            <link>https://example.substack.com/p/newer</link>
            <pubDate>Thu, 02 Jan 2025 10:00:00 GMT</pubDate>
            <description><![CDATA[<p>Newer summary</p>]]></description>
          </item>
        </channel>
      </rss>
    `;

    const items = parseSubstackFeed(xml);

    expect(items).toHaveLength(2);
    expect(items[0].title).toBe("Newer essay");
    expect(items[0].summary).toContain("Newer summary");
  });

  it("normalizes and sorts YouTube Atom entries", () => {
    const xml = `
      <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015">
        <entry>
          <yt:videoId>older-video</yt:videoId>
          <title>Older video</title>
          <published>2025-01-01T10:00:00Z</published>
          <link href="https://www.youtube.com/watch?v=older-video" />
          <media:group xmlns:media="http://search.yahoo.com/mrss/">
            <media:description>Older description</media:description>
          </media:group>
        </entry>
        <entry>
          <yt:videoId>new-video</yt:videoId>
          <title>Newer video</title>
          <published>2025-01-02T10:00:00Z</published>
          <link href="https://www.youtube.com/watch?v=new-video" />
          <media:group xmlns:media="http://search.yahoo.com/mrss/">
            <media:description>Newer description</media:description>
          </media:group>
        </entry>
      </feed>
    `;

    const items = parseYouTubeFeed(xml);

    expect(items).toHaveLength(2);
    expect(items[0].title).toBe("Newer video");
    expect(items[0].url).toContain("new-video");
  });
});
