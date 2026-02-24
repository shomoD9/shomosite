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
    <section className="mx-auto max-w-6xl space-y-8 px-8 py-16 md:px-12">
      <div className="max-w-3xl space-y-4">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-accent">Archive</p>
        <h1 className="font-heading text-[2.75rem] font-medium leading-[1.08] text-ink">Videos</h1>
        <p className="text-lg leading-[1.8] text-muted">
          Video essays and commentary. Hosted on YouTube.
        </p>
      </div>

      {videos.status === "cache" ? (
        <p className="rounded-2xl border border-accent/20 bg-accentSoft px-5 py-4 text-sm text-ink">
          Showing cached video entries while YouTube feed is temporarily unreachable.
        </p>
      ) : null}

      {videos.status === "empty" ? (
        <p className="rounded-2xl border border-line bg-accentSoft px-5 py-4 text-sm text-muted">
          YouTube feed is currently unavailable. You can still browse videos on{" "}
          <a href={youtubeChannelUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
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
