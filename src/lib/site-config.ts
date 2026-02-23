/*
 * This file centralizes all runtime configuration that shapes links, metadata, and feed ingestion.
 * It is separate so environment handling is explicit and validated in one place rather than scattered.
 * Content adapters, SEO helpers, and route files read from this module for consistent behavior.
 */

type SiteConfig = {
  siteUrl: string;
  plausibleDomain?: string;
  substackUrl: string;
  substackFeedUrl: string;
  linkedinUrl: string;
  youtubeChannelUrl: string;
  youtubeFeedUrl: string;
  primaryEmail: string;
};

const fallbackConfig: SiteConfig = {
  siteUrl: "https://example.com",
  plausibleDomain: undefined,
  substackUrl: "https://ds013.substack.com",
  substackFeedUrl: "https://ds013.substack.com/feed",
  linkedinUrl: "https://www.linkedin.com/in/shomodip/",
  youtubeChannelUrl: "https://www.youtube.com/@armchairdescending",
  youtubeFeedUrl: "https://www.youtube.com/feeds/videos.xml?channel_id=UCOAgAWQ15_AkatLTKaGl9QA",
  primaryEmail: "domoship09@gmail.com"
};

export function getSiteConfig(): SiteConfig {
  // We normalize environment values once so the rest of the app can stay deterministic.
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || fallbackConfig.siteUrl,
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || fallbackConfig.plausibleDomain,
    substackUrl: process.env.NEXT_PUBLIC_SUBSTACK_URL || fallbackConfig.substackUrl,
    substackFeedUrl: process.env.SUBSTACK_FEED_URL || fallbackConfig.substackFeedUrl,
    linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || fallbackConfig.linkedinUrl,
    youtubeChannelUrl:
      process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL || fallbackConfig.youtubeChannelUrl,
    youtubeFeedUrl: process.env.YOUTUBE_FEED_URL || fallbackConfig.youtubeFeedUrl,
    primaryEmail: process.env.NEXT_PUBLIC_EMAIL || fallbackConfig.primaryEmail
  };
}
