/*
 * This file validates homepage rendering with both populated and empty external streams.
 * It is separated so the composition layer can be tested without browser-level dependencies.
 * The test mocks content loaders used by src/app/page.tsx.
 */

import { render, screen } from "@testing-library/react";

import HomePage from "@/app/page";
import { getEssayFeed, getTools, getVideoFeed } from "@/lib/content";

vi.mock("@/lib/content", () => ({
  getEssayFeed: vi.fn(),
  getVideoFeed: vi.fn(),
  getTools: vi.fn()
}));

const mockedGetEssayFeed = vi.mocked(getEssayFeed);
const mockedGetVideoFeed = vi.mocked(getVideoFeed);
const mockedGetTools = vi.mocked(getTools);

describe("HomePage", () => {
  beforeEach(() => {
    // We reset all loaders so each test defines its own data shape explicitly.
    vi.clearAllMocks();
  });

  it("renders latest cards when data exists", async () => {
    mockedGetEssayFeed.mockResolvedValue({
      status: "live",
      items: [
        {
          id: "essay-1",
          source: "substack",
          slug: "essay-1",
          canonicalUrl: "https://example.com/essay-1",
          title: "Essay One",
          summary: "Essay summary",
          excerpt: "Essay summary",
          publishedAt: "2024-01-03T00:00:00.000Z",
          url: "https://example.com/essay-1",
          tags: []
        }
      ]
    });

    mockedGetVideoFeed.mockResolvedValue({
      status: "live",
      items: [
        {
          id: "video-1",
          source: "youtube",
          videoId: "video-1",
          title: "Video One",
          summary: "Video summary",
          publishedAt: "2024-01-02T00:00:00.000Z",
          url: "https://youtube.com/watch?v=video-1",
          tags: []
        }
      ]
    });

    mockedGetTools.mockResolvedValue([
      {
        id: "tool-1",
        source: "local",
        slug: "tool-1",
        title: "Tool One",
        summary: "Tool summary",
        publishedAt: "2024-01-01T00:00:00.000Z",
        url: "https://example.com/tool-1",
        tags: [],
        platform: "web",
        status: "active",
        repoUrl: "https://github.com/example/tool-1",
        bodyHtml: ""
      }
    ]);

    render(await HomePage());
    expect(screen.getByText("Recent")).toBeInTheDocument();
    // The essay appears in both the latest strip and essay preview, so we assert presence across both regions.
    expect(screen.getAllByText("Essay One").length).toBeGreaterThan(0);
  });

  it("still renders manifesto when external streams are empty", async () => {
    mockedGetEssayFeed.mockResolvedValue({ status: "empty", items: [] });
    mockedGetVideoFeed.mockResolvedValue({ status: "empty", items: [] });
    mockedGetTools.mockResolvedValue([]);

    render(await HomePage());
    // This assertion protects the core narrative shell even if feeds fail hard.
    expect(
      screen.getByText(/Shomodip De/i)
    ).toBeInTheDocument();
  });
});
