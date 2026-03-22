/*
 * This file verifies that the inner public routes render from local content without needing route-specific hardcoding.
 * It exists separately because the track pages and collaboration page should be easy to trust after future content edits.
 * The suites render the actual route modules and check only the public headings that define their purpose.
 */

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import CollaboratePage, { metadata as collaborateMetadata } from "@/app/collaborate/page";
import ProductPage, { metadata as productMetadata } from "@/app/product/page";
import ProductivityPage, { metadata as productivityMetadata } from "@/app/productivity/page";
import ProsePage, { metadata as proseMetadata } from "@/app/prose/page";

function successfulFeedResponse(xml: string): Response {
  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml" }
  });
}

describe("inner routes", () => {
  beforeEach(() => {
    const substackXml = `
      <rss>
        <channel>
          <item>
            <guid>essay-1</guid>
            <title>Essay one</title>
            <link>https://example.com/essay-one</link>
            <pubDate>Wed, 01 Jan 2025 10:00:00 GMT</pubDate>
            <description><![CDATA[<p>Essay summary</p>]]></description>
          </item>
        </channel>
      </rss>
    `;
    const youtubeXml = `
      <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015">
        <entry>
          <yt:videoId>video-1</yt:videoId>
          <title>Video one</title>
          <published>2025-01-01T10:00:00Z</published>
          <link href="https://www.youtube.com/watch?v=video-1" />
          <media:group xmlns:media="http://search.yahoo.com/mrss/">
            <media:description>Video summary</media:description>
          </media:group>
        </entry>
      </feed>
    `;

    // The Prose page hits both feeds, so we provide deterministic responses before rendering it.
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(successfulFeedResponse(substackXml))
        .mockResolvedValueOnce(successfulFeedResponse(youtubeXml))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the prose, product, productivity, and collaborate routes", async () => {
    render(await ProsePage());
    expect(screen.getByRole("heading", { name: "Prose" })).toBeInTheDocument();

    render(await ProductPage());
    expect(screen.getByRole("heading", { name: "Product" })).toBeInTheDocument();

    render(await ProductivityPage());
    expect(screen.getByRole("heading", { name: "Productivity" })).toBeInTheDocument();

    render(await CollaboratePage());
    expect(screen.getByRole("heading", { name: "Working together" })).toBeInTheDocument();
  });

  it("keeps AI language out of Prose and Product while allowing it in Productivity", async () => {
    const proseView = render(await ProsePage());
    const proseText = proseView.container.textContent ?? "";
    proseView.unmount();

    const productView = render(await ProductPage());
    const productText = productView.container.textContent ?? "";
    productView.unmount();

    const productivityView = render(await ProductivityPage());
    const productivityText = productivityView.container.textContent ?? "";
    productivityView.unmount();

    // Prose and Product should stay clean of AI signaling in both rendered copy and metadata.
    expect(proseText).not.toMatch(/\bAI\b/);
    expect(String(proseMetadata.description)).not.toMatch(/\bAI\b/i);
    expect(productText).not.toMatch(/\bAI\b/);
    expect(String(productMetadata.description)).not.toMatch(/\bAI\b/i);

    // Productivity is the one page where AI is named directly and matter-of-factly.
    expect(productivityText).toMatch(/\bAI\b/);
    expect(String(productivityMetadata.description)).toMatch(/\bAI\b/i);

    // The softer public label should carry through to metadata as well.
    expect(String(collaborateMetadata.title)).toContain("Working together");
  });
});
