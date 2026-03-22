/*
 * This file verifies that the Work page degrades gracefully when feed imports fail.
 * It exists separately because the hybrid proof model depends on manual proof still showing up even when remote archives do not.
 * The test renders the real Work route with failing fetch calls and checks the public fallback behavior.
 */

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import WorkPage from "@/app/work/page";

describe("WorkPage", () => {
  it("shows selected public work and fallback messages when feed imports fail", async () => {
    // We deliberately reject both feed calls so the test exercises the fallback path instead of the happy path.
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const { container } = render(await WorkPage());
    const visibleText = container.textContent ?? "";

    expect(screen.getByRole("heading", { name: "Essays, videos, builds, and systems." })).toBeInTheDocument();
    expect(visibleText).toContain("This is where the practice becomes visible in public, grouped by medium.");
    expect(screen.getByText("The Substack archive is temporarily unavailable. Use the direct Substack link instead.")).toBeInTheDocument();
    expect(screen.getByText("The YouTube archive is temporarily unavailable. Use the channel link instead.")).toBeInTheDocument();
    expect(screen.getByText("shomosite")).toBeInTheDocument();
    expect(screen.queryByText("Private systems lab")).not.toBeInTheDocument();
    expect(visibleText).not.toMatch(/\bproof\b/i);

    vi.unstubAllGlobals();
  });
});
