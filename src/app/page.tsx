/*
 * This file is the homepage composition root.
 * We are assembling the pure monochromatic cinematic architecture here.
 */

import { MonochromeHero } from "@/components/cinematic/monochrome-hero";
import { EssaysModule } from "@/components/cinematic/essays-module";
import { VideosModule } from "@/components/cinematic/videos-module";
import { SoftwareModule } from "@/components/cinematic/software-module";
import { ParallaxManifesto } from "@/components/cinematic/parallax-manifesto";
import { buildPersonJsonLd } from "@/lib/seo/json-ld";
import { buildSectionMetadata } from "@/lib/seo/metadata";

export const revalidate = 86400;

export const metadata = buildSectionMetadata({
  title: "Home",
  description: "Intellectual food for the romantic soul.",
  pathname: "/"
});

export default function HomePage(): React.JSX.Element {
  const manifestoJsonLd = buildPersonJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(manifestoJsonLd) }} />

      {/* 
        The Pure Typographic Opening Sequence 
      */}
      <MonochromeHero />

      {/* 
        The Dedicated Content Modules
      */}
      <EssaysModule />
      <VideosModule />
      <SoftwareModule />

      {/* 
        The Deep Canvas GSAP Orchestration 
      */}
      <ParallaxManifesto />

      {/* 
        Ultra-minimal Footer
      */}
      <footer className="w-full bg-void py-12 px-6 border-t border-ink text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ash">
          shomo &copy; {new Date().getFullYear()} - System Operational
        </p>
      </footer>
    </>
  );
}
