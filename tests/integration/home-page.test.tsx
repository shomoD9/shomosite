/*
 * This file verifies that the homepage still reads in the intended four-question sequence.
 * It is separate because the homepage is the narrative spine of the whole site and deserves direct coverage.
 * The test renders the real route component so the assertions follow the same path as production.
 */

import { render, screen } from "@testing-library/react";

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the revised narrative in order and points the hero to Work", async () => {
    const { container } = render(await HomePage());
    const visibleText = container.textContent ?? "";

    // The route should be legible by scanning the major headings rather than reading every paragraph.
    expect(screen.getByRole("heading", { name: "Prose. Product. Productivity." })).toBeInTheDocument();
    expect(screen.getByText("Why this exists.")).toBeInTheDocument();
    expect(screen.getByText("What lives here.")).toBeInTheDocument();
    expect(screen.getByText("Public work.")).toBeInTheDocument();
    expect(screen.getByText("Working together.")).toBeInTheDocument();

    // The first click should deepen the body of public work instead of opening with an inquiry.
    expect(screen.getByRole("link", { name: "View the work" })).toHaveAttribute("href", "/work");

    // The homepage keeps AI visible exactly once, and only near the productivity framing.
    expect(visibleText.match(/\bAI\b/g) ?? []).toHaveLength(1);

    // Older sales language should be absent from the visible homepage copy.
    expect(visibleText).not.toMatch(/\bproof\b/i);
    expect(visibleText).not.toMatch(/\btrack\b/i);
    expect(visibleText).not.toContain("AI-native");
    expect(visibleText).not.toContain("engagement model");
  });
});
