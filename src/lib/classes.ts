/*
 * This file provides the smallest possible class name combiner for our components.
 * It is separated so we do not need a whole dependency just to join optional class strings.
 * Shared UI components call it whenever conditional styling would otherwise get noisy.
 */

export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
