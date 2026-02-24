import Link from "next/link";
import { BookOpen, Code, FileText, Play } from "lucide-react";

import { LatestMedia } from "@/components/latest-media";
import { ManifestoHero } from "@/components/manifesto-hero";
import { buildLatestAcrossMedia } from "@/lib/content/aggregate";
import { getEssayFeed, getTools, getVideoFeed } from "@/lib/content";
import { buildPersonJsonLd } from "@/lib/seo/json-ld";
import { buildSectionMetadata } from "@/lib/seo/metadata";

export const revalidate = 86400;

export const metadata = buildSectionMetadata({
  title: "Home",
  description: "Essays, videos, books, and software by Shomodip De.",
  pathname: "/"
});

const browseItems = [
  { label: "Essays", href: "/essays", desc: "Long-form arguments on Substack", icon: FileText },
  { label: "Videos", href: "/videos", desc: "Commentary and visual essays on YouTube", icon: Play },
  { label: "Books", href: "/books", desc: "Published and in-progress works", icon: BookOpen },
  { label: "Tools", href: "/tools", desc: "Software for creative work", icon: Code }
];

export default async function HomePage(): Promise<React.JSX.Element> {
  const [essayFeed, videoFeed, tools] = await Promise.all([getEssayFeed(), getVideoFeed(), getTools()]);

  const latest = buildLatestAcrossMedia({
    essays: essayFeed.items,
    videos: videoFeed.items,
    tools,
    limit: 6
  });

  const manifestoJsonLd = buildPersonJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(manifestoJsonLd) }} />

      {/* "The Opening Shot" */}
      <ManifestoHero />

      {/* Recent work */}
      <LatestMedia items={latest} />

      {/* "The Manifesto" — full-width philosophy section */}
      <section className="relative overflow-hidden bg-[#08080b] px-8 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <p className="text-lg leading-relaxed text-muted md:text-xl">
            Most people consume content.
          </p>
          <p className="font-heading text-[2.5rem] font-medium leading-[1.12] text-ink md:text-[3.5rem]">
            I build{" "}
            <span className="italic text-accent">arguments.</span>
          </p>
          <p className="mx-auto max-w-xl text-base leading-[1.8] text-muted">
            Every essay is an experiment. Every video is a case study.
            Every tool is a hypothesis tested in code.
            The work is the argument — this site is the archive.
          </p>
        </div>
      </section>

      {/* Browse — the archive directory */}
      <section className="mx-auto w-full max-w-6xl px-8 py-20 md:px-12">
        <h2 className="font-heading text-3xl font-medium text-ink">Browse the Archive</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {browseItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card-surface group flex flex-col gap-4 rounded-2xl border border-line p-7"
            >
              <item.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
              <div>
                <p className="font-heading text-lg font-medium text-ink">{item.label}</p>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-muted">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
