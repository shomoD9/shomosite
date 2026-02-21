/*
 * This file verifies prefilled email link generation used by contact CTAs.
 * It exists independently to lock down encoding behavior and avoid subtle URL regressions.
 * The test imports createPrefilledEmailLink from src/lib/links.ts.
 */

import { createPrefilledEmailLink } from "@/lib/links";

describe("createPrefilledEmailLink", () => {
  it("creates a mailto URL with subject and body context", () => {
    const mailto = createPrefilledEmailLink("Homepage hero");
    const query = mailto.split("?")[1] || "";
    const params = new URLSearchParams(query);

    expect(mailto.startsWith("mailto:")).toBe(true);
    expect(mailto).toContain("subject=Connection+from+your+website");
    // We assert the decoded payload so this test stays stable across equivalent URL encoding styles.
    expect(params.get("body")).toContain("Context: Homepage hero");
  });
});
