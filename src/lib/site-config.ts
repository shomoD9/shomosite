/*
 * This file centralizes the public identity of the site: who it is, where it points, and which feeds it trusts.
 * It exists separately so route code can stay focused on rendering instead of rebuilding configuration over and over.
 * Metadata helpers, page routes, and the feed layer all read this module.
 */

import type { SiteSettings } from "@/lib/content-types";

const fallbackSettings: SiteSettings = {
  name: "Shomo",
  title: "Shomo",
  description: "An independent research practice centered on productivity, expressed through prose, products, and systems.",
  siteUrl: "https://shomo.com",
  email: "domoship09@gmail.com",
  githubUrl: "https://github.com/shomoD9/shomosite",
  nav: [
    { label: "Shomo", href: "/" },
    { label: "Prose", href: "/prose" },
    { label: "Product", href: "/product" },
    { label: "Productivity", href: "/productivity" },
    { label: "Work", href: "/work" },
    { label: "Working together", href: "/collaborate" }
  ],
  socialLinks: [
    { label: "Email", url: "mailto:domoship09@gmail.com" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/shomodip/" },
    { label: "Substack", url: "https://ds013.substack.com" },
    { label: "YouTube", url: "https://www.youtube.com/@armchairdescending" },
    { label: "GitHub", url: "https://github.com/shomoD9/shomosite" }
  ],
  feedSources: [
    {
      id: "substack",
      label: "Substack Archive",
      medium: "essay",
      kind: "rss",
      url: "https://ds013.substack.com/feed",
      homeUrl: "https://ds013.substack.com",
      fallbackMessage: "The Substack archive is temporarily unavailable. Use the direct Substack link instead."
    },
    {
      id: "youtube",
      label: "YouTube Archive",
      medium: "video",
      kind: "atom",
      url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCOAgAWQ15_AkatLTKaGl9QA",
      homeUrl: "https://www.youtube.com/@armchairdescending",
      fallbackMessage: "The YouTube archive is temporarily unavailable. Use the channel link instead."
    }
  ]
};

export function getSiteSettings(): SiteSettings {
  // We resolve environment overrides once here so the rest of the app can stay deterministic.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || fallbackSettings.siteUrl;
  const email = process.env.NEXT_PUBLIC_EMAIL || fallbackSettings.email;
  const linkedInUrl =
    process.env.NEXT_PUBLIC_LINKEDIN_URL || fallbackSettings.socialLinks.find((link) => link.label === "LinkedIn")?.url;
  const substackUrl =
    process.env.NEXT_PUBLIC_SUBSTACK_URL || fallbackSettings.socialLinks.find((link) => link.label === "Substack")?.url;
  const youtubeUrl =
    process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL ||
    fallbackSettings.socialLinks.find((link) => link.label === "YouTube")?.url;
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || fallbackSettings.githubUrl;

  return {
    ...fallbackSettings,
    siteUrl,
    email,
    githubUrl,
    socialLinks: [
      { label: "Email", url: `mailto:${email}` },
      { label: "LinkedIn", url: linkedInUrl },
      { label: "Substack", url: substackUrl },
      { label: "YouTube", url: youtubeUrl },
      { label: "GitHub", url: githubUrl }
    ],
    feedSources: [
      {
        ...fallbackSettings.feedSources[0],
        url: process.env.SUBSTACK_FEED_URL || fallbackSettings.feedSources[0].url,
        homeUrl: substackUrl || fallbackSettings.feedSources[0].homeUrl
      },
      {
        ...fallbackSettings.feedSources[1],
        url: process.env.YOUTUBE_FEED_URL || fallbackSettings.feedSources[1].url,
        homeUrl: youtubeUrl || fallbackSettings.feedSources[1].homeUrl
      }
    ]
  };
}
