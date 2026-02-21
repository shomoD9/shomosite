/*
 * This file verifies Substack RSS parsing behavior for both full-content and excerpt-only posts.
 * It exists independently so feed normalization guarantees are enforced close to the adapter boundary.
 * The test imports parseSubstackFeed from src/lib/content/substack.ts and validates sorting and field mapping.
 */

import { parseSubstackFeed } from "@/lib/content/substack";

describe("parseSubstackFeed", () => {
  it("parses full-content and excerpt-only entries and sorts newest first", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
        <channel>
          <item>
            <guid>older</guid>
            <title>Older Essay</title>
            <link>https://example.substack.com/p/older-essay</link>
            <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
            <description><![CDATA[<p>Only excerpt</p>]]></description>
          </item>
          <item>
            <guid>newer</guid>
            <title>Newer Essay</title>
            <link>https://example.substack.com/p/newer-essay</link>
            <pubDate>Tue, 02 Jan 2024 00:00:00 GMT</pubDate>
            <description><![CDATA[<p>Summary text</p>]]></description>
            <content:encoded><![CDATA[<p><strong>Full essay body</strong></p>]]></content:encoded>
          </item>
        </channel>
      </rss>`;

    const entries = parseSubstackFeed(xml);

    // Sorting by publish date is important because homepage and essays index assume recency order.
    expect(entries[0]?.title).toBe("Newer Essay");
    expect(entries[0]?.slug).toBe("newer-essay");
    expect(entries[0]?.html).toContain("Full essay body");

    expect(entries[1]?.title).toBe("Older Essay");
    expect(entries[1]?.html).toBeUndefined();
    expect(entries[1]?.excerpt).toContain("Only excerpt");
  });
});
