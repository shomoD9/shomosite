/*
 * This file composes the homepage, which introduces the practice, the three named areas of work, the public archive, and the collaboration note in sequence.
 * It is separate because the home page is the site's central argument and needs to orchestrate multiple content sources together.
 * The route loads local content, curated proof, and shared settings before rendering the public landing experience.
 */

import Link from "next/link";

import { HomeHero } from "@/components/home-hero";
import { ProofList } from "@/components/proof-list";
import { RichText } from "@/components/rich-text";
import { SectionReveal } from "@/components/section-reveal";
import { TrackRail } from "@/components/track-rail";
import { getFeaturedProofItems, loadCollaboratePage, loadHomePage, loadProofItems, loadTrackPage } from "@/lib/content";
import { buildMailtoHref } from "@/lib/mailto";
import { buildMetadata, buildPersonJsonLd } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-config";

const settings = getSiteSettings();

export const metadata = buildMetadata(settings, {
  title: "Prose. Product. Productivity.",
  description: settings.description,
  pathname: "/"
});

export default async function HomePage(): Promise<React.JSX.Element> {
  const [home, collaborate, proofItems, prose, product, productivity] = await Promise.all([
    loadHomePage(),
    loadCollaboratePage(),
    loadProofItems(),
    loadTrackPage("prose"),
    loadTrackPage("product"),
    loadTrackPage("productivity")
  ]);

  const featuredProof = getFeaturedProofItems(proofItems)
    .filter((item) => item.medium !== "profile")
    .slice(0, 4);

  return (
    <main className="page-frame">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPersonJsonLd(settings))
        }}
        type="application/ld+json"
      />

      <HomeHero ctaHref="/work" ctaLabel={home.primaryCtaLabel} summary={home.summary} title={home.title} />

      <SectionReveal className="section-grid" delay={80}>
        <section className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <p className="section-label">{home.whoHeading}</p>
            <h2 className="max-w-sm font-display text-4xl leading-tight text-ink">
              An independent research practice centered on productivity.
            </h2>
          </div>
          <RichText className="rich-text max-w-copy text-base leading-8 text-ink" html={home.bodyHtml} />
        </section>
      </SectionReveal>

      <SectionReveal className="section-grid" delay={120}>
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="section-label">{home.whatHeading}</p>
            <h2 className="max-w-3xl font-display text-4xl leading-tight text-ink">
              Prose and product are the crafts. Productivity is the question underneath.
            </h2>
          </div>
          <TrackRail tracks={[prose, product, productivity]} />
        </div>
      </SectionReveal>

      <SectionReveal className="section-grid" delay={160}>
        <section className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <p className="section-label">{home.proofHeading}</p>
            <h2 className="max-w-sm font-display text-4xl leading-tight text-ink">Selected public work.</h2>
            <p className="max-w-sm text-sm leading-7 text-graphite">
              The site stays selective on purpose. The aim is to show what the practice becomes in public, not to build a wall of claims around it.
            </p>
          </div>
          <ProofList items={featuredProof} />
        </section>
      </SectionReveal>

      <SectionReveal className="section-grid border-b border-ink/10" delay={220}>
        <section className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <p className="section-label">{home.collaborationHeading}</p>
            <h2 className="max-w-sm font-display text-4xl leading-tight text-ink">Private work can grow out of the public work.</h2>
          </div>

          <div className="space-y-6">
            <p className="max-w-copy text-sm leading-7 text-graphite">{collaborate.summary}</p>
            <ol className="space-y-3">
              {/* The homepage keeps only a short version of the rhythm so the page stays document-first. */}
              {collaborate.process.slice(0, 4).map((step, index) => (
                <li className="border-b border-ink/10 pb-3 text-sm leading-7 text-graphite" key={step}>
                  <span className="mr-3 font-mono text-[11px] uppercase tracking-[0.18em] text-steel">{String(index + 1).padStart(2, "0")}</span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-6 pt-2">
              <Link
                className="inline-flex items-center gap-3 border-b border-ink/30 pb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:text-steel"
                href={buildMailtoHref(settings.email, collaborate.ctaSubject, "Context:\n\nWhat feels worth discussing?\n\nWhy now?")}
              >
                {collaborate.ctaLabel}
                <span aria-hidden="true">↗</span>
              </Link>
              <Link
                className="inline-flex items-center gap-3 border-b border-ink/20 pb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-graphite transition-colors duration-300 hover:text-ink"
                href="/collaborate"
              >
                Read about working together
              </Link>
            </div>
          </div>
        </section>
      </SectionReveal>
    </main>
  );
}
