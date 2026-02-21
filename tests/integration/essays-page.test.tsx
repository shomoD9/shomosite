/*
 * This file checks that the essays route can render both live and failed-feed states.
 * It is separate so route-level resilience behavior is validated without browser-level complexity.
 * The test imports the server component page and mocks the content facade.
 */

import { render, screen } from "@testing-library/react";

import EssaysPage from "@/app/essays/page";
import { getEssayFeed } from "@/lib/content";

vi.mock("@/lib/content", () => ({
  getEssayFeed: vi.fn()
}));

const mockedGetEssayFeed = vi.mocked(getEssayFeed);

describe("EssaysPage", () => {
  beforeEach(() => {
    // Each test sets its own feed state, so we clear previous mocks to avoid accidental coupling.
    vi.clearAllMocks();
  });

  it("renders essay cards when feed data is available", async () => {
    mockedGetEssayFeed.mockResolvedValue({
      status: "live",
      items: [
        {
          id: "essay-1",
          source: "substack",
          slug: "essay-1",
          canonicalUrl: "https://example.com/essay-1",
          title: "Essay One",
          summary: "Summary",
          excerpt: "Summary",
          publishedAt: "2024-01-01T00:00:00.000Z",
          url: "https://example.com/essay-1",
          tags: []
        }
      ]
    });

    render(await EssaysPage());
    expect(screen.getByText("Essay One")).toBeInTheDocument();
  });

  it("renders fallback copy when feed is unavailable", async () => {
    mockedGetEssayFeed.mockResolvedValue({
      status: "empty",
      items: []
    });

    render(await EssaysPage());
    // We verify the resilience path so feed failures do not collapse the page.
    expect(screen.getByText(/Substack is currently unavailable/i)).toBeInTheDocument();
  });
});
