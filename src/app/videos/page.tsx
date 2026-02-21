/*
 * This file renders the video index sourced from YouTube feed data.
 * It exists separately to give commentary videos a dedicated discovery surface.
 * It relies on the video feed adapter and shared card component for consistent presentation.
 */

import { ContentCard } from "@/components/content-card";
import { getVideoFeed } from "@/lib/content";
import { getSiteConfig } from "@/lib/site-config";
import { buildSectionMetadata } from "@/lib/seo/metadata";

export const revalidate = 86400;

export const metadata = buildSectionMetadata({
  title: "Videos",
  description: "Recent video essays and commentary mirrored from YouTube feed metadata.",
  pathname: "/videos"
});

export default async function VideosPage(): Promise<React.JSX.Element> {
  const videos = await getVideoFeed();
  const { youtubeChannelUrl } = getSiteConfig();

  return (
    <section className="space-y-8 py-10">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Videos</p>
        <h1 className="font-serif text-5xl leading-tight text-ink">Commentary in long form</h1>
        <p className="text-lg leading-relaxed text-muted">
          Video essays, commentary, and visual arguments, indexed here with links to watch on YouTube.
        </p>
      </div>

      {videos.status === "cache" ? (
        <p className="rounded-2xl border border-accentSoft bg-accentSoft/35 px-4 py-3 text-sm text-ink">
          Showing cached video entries while YouTube feed is temporarily unreachable.
        </p>
      ) : null}

      {videos.status === "empty" ? (
        <p className="rounded-2xl border border-line bg-white/70 px-4 py-4 text-sm text-muted">
          YouTube feed is currently unavailable. You can still browse videos on{" "}
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            the channel page
          </a>
          .
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {videos.items.map((video) => (
          <ContentCard
            key={video.id}
            title={video.title}
            summary={video.summary}
            href={video.url}
            publishedAt={video.publishedAt}
            medium="video"
            external
          />
        ))}
      </div>
    </section>
  );
}
