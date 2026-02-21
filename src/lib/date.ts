/*
 * This file provides small date-formatting helpers used across cards, detail pages, and metadata.
 * It exists separately to keep presentational components free from repetitive locale formatting logic.
 * UI components call these functions whenever they need a consistent human-readable date.
 */

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric"
});

export function toDisplayDate(input: string): string {
  const parsed = new Date(input);

  // Invalid dates can happen when feeds are malformed, so we fail soft instead of crashing render.
  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return formatter.format(parsed);
}

export function toEpoch(input: string): number {
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}
