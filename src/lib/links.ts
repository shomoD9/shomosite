/*
 * This file creates consistent outbound links and call-to-action URLs.
 * It is isolated so contact behavior can change once here without touching route components.
 * The hero, footer, and section CTAs all depend on the utilities exported from this module.
 */

import { getSiteConfig } from "@/lib/site-config";

export function createPrefilledEmailLink(context?: string): string {
  const { primaryEmail } = getSiteConfig();
  const subject = "Connection from your website";

  // We prefill context to improve incoming message quality without forcing a rigid form.
  const bodyLines = [
    "Hi Shomo,",
    "",
    "I found your work and wanted to reach out.",
    "",
    context ? `Context: ${context}` : "Context:",
    "",
    "Best,",
    ""
  ];

  const params = new URLSearchParams({
    subject,
    body: bodyLines.join("\n")
  });

  return `mailto:${primaryEmail}?${params.toString()}`;
}
