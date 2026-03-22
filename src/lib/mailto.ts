/*
 * This file builds consistent email call-to-action links for the whole site.
 * It exists separately so copy can choose intent while encoding rules stay in one place.
 * Page routes and shared components call this helper whenever a CTA should open the user's mail client.
 */

export function buildMailtoHref(email: string, subject: string, body?: string): string {
  const search = new URLSearchParams({
    subject
  });

  // We only attach a body when a page wants to give the inquiry a useful starting shape.
  if (body) {
    search.set("body", body);
  }

  return `mailto:${email}?${search.toString()}`;
}
