import { HeroSection } from "@/components/hero/hero-section";
import { EssayIndex } from "@/components/content/essay-index";
import { FilmIndex } from "@/components/content/film-index";
import { SoftwareIndex } from "@/components/content/software-index";
import { getEssayFeed, getTools, getVideoFeed } from "@/lib/content";
import { buildPersonJsonLd } from "@/lib/seo/json-ld";
import { buildSectionMetadata } from "@/lib/seo/metadata";

export const revalidate = 86400;

export const metadata = buildSectionMetadata({
  title: "Home",
  description: "Intellectual depth meets vast romantic worlds.",
  pathname: "/"
});

export default async function HomePage(): Promise<React.JSX.Element> {
  const [essayFeed, videoFeed, tools] = await Promise.all([getEssayFeed(), getVideoFeed(), getTools()]);

  const manifestoJsonLd = buildPersonJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(manifestoJsonLd) }} />

      {/* The Hook: Aristocratic Vastness & Infinite Depth */}
      <HeroSection />

      {/* The Archives: Surgical Data against Dramatic Headers */}
      <EssayIndex items={essayFeed.items} />

      {/* Module: Films / Broadcasts */}
      <FilmIndex items={videoFeed.items} />

      {/* Module: Software / Builders */}
      <SoftwareIndex items={tools} />
    </>
  );
}
