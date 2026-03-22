/*
 * This file defines the named data contracts that the rest of the site passes around.
 * It is separate because content, routes, and feed adapters all need the same vocabulary.
 * The loaders in `src/lib/content.ts`, the feed layer in `src/lib/feeds.ts`, and the route files all import these types.
 */

export type TrackSlug = "prose" | "product" | "productivity";

export type ProofMedium = "essay" | "video" | "build" | "system" | "profile";

export type FeedKind = "rss" | "atom";

export type FeedSource = {
  id: "substack" | "youtube";
  label: string;
  medium: Extract<ProofMedium, "essay" | "video">;
  kind: FeedKind;
  url?: string;
  homeUrl: string;
  fallbackMessage: string;
};

export type SiteSettings = {
  name: string;
  title: string;
  description: string;
  siteUrl: string;
  email: string;
  githubUrl?: string;
  nav: Array<{
    label: string;
    href: string;
  }>;
  socialLinks: Array<{
    label: string;
    url?: string;
  }>;
  feedSources: FeedSource[];
};

export type HomePageContent = {
  title: string;
  summary: string;
  primaryCtaLabel: string;
  primaryCtaSubject: string;
  whoHeading: string;
  whatHeading: string;
  proofHeading: string;
  collaborationHeading: string;
  bodyHtml: string;
};

export type TrackPage = {
  slug: TrackSlug;
  title: string;
  eyebrow: string;
  summary: string;
  servicesHeading: string;
  audienceHeading: string;
  proofHeading: string;
  ctaLabel: string;
  ctaSubject: string;
  services: string[];
  audience: string[];
  principles: string[];
  bodyHtml: string;
};

export type CollaboratePage = {
  title: string;
  eyebrow: string;
  summary: string;
  ctaLabel: string;
  ctaSubject: string;
  supportNote: string;
  process: string[];
  fit: string[];
  notFit: string[];
  bodyHtml: string;
};

export type ProofItem = {
  id: string;
  title: string;
  medium: ProofMedium;
  tracks: TrackSlug[];
  url?: string;
  featured: boolean;
  hidden: boolean;
  metric?: string;
  sourceLabel: string;
  summary: string;
  publishedAt?: string;
};

export type FeedArchiveItem = {
  id: string;
  title: string;
  medium: Extract<ProofMedium, "essay" | "video">;
  url: string;
  summary: string;
  sourceLabel: string;
  publishedAt: string;
};

export type FeedArchiveResult = {
  items: FeedArchiveItem[];
  error?: string;
};
