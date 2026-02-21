/*
 * This file validates YouTube Atom feed normalization into the internal video model.
 * It is separate so XML quirks can be tested without coupling to route rendering.
 * The test imports parseYouTubeFeed from src/lib/content/youtube.ts.
 */

import { parseYouTubeFeed } from "@/lib/content/youtube";

describe("parseYouTubeFeed", () => {
  it("maps feed entries and keeps newest videos first", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/">
        <entry>
          <yt:videoId>older-video</yt:videoId>
          <title>Older Video</title>
          <published>2024-01-01T00:00:00+00:00</published>
          <link href="https://www.youtube.com/watch?v=older-video" />
          <media:group>
            <media:description>Older description</media:description>
            <media:thumbnail url="https://img.youtube.com/vi/older-video/hqdefault.jpg" />
          </media:group>
        </entry>
        <entry>
          <yt:videoId>new-video</yt:videoId>
          <title>New Video</title>
          <published>2024-01-02T00:00:00+00:00</published>
          <link href="https://www.youtube.com/watch?v=new-video" />
          <media:group>
            <media:description>New description</media:description>
            <media:thumbnail url="https://img.youtube.com/vi/new-video/hqdefault.jpg" />
          </media:group>
        </entry>
      </feed>`;

    const entries = parseYouTubeFeed(xml);

    expect(entries[0]?.title).toBe("New Video");
    expect(entries[0]?.videoId).toBe("new-video");
    expect(entries[0]?.thumbnailUrl).toContain("new-video");
    expect(entries[1]?.title).toBe("Older Video");
  });
});
