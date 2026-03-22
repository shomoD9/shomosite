/*
 * This file formats timestamps into the restrained editorial labels used across proof sections.
 * It exists separately so date presentation stays consistent even when data arrives from different sources.
 * Proof lists and archive sections import this helper when they render published work.
 */

export function formatEditorialDate(input?: string): string | null {
  if (!input) {
    return null;
  }

  const parsed = new Date(input);

  // Invalid feed dates should disappear quietly instead of printing broken labels into the interface.
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(parsed);
}
