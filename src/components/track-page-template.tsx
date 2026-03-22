/*
 * This file provides the shared structure for the three main inner pages.
 * It exists separately because Prose, Product, and Productivity differ in content but not in the underlying narrative rhythm.
 * The route files pass page-specific content and proof into this template instead of repeating the same scaffolding.
 */

import Link from "next/link";
import type { ReactNode } from "react";

import type { ProofItem, TrackPage } from "@/lib/content-types";
import { ProofList } from "@/components/proof-list";
import { RichText } from "@/components/rich-text";
import { SectionReveal } from "@/components/section-reveal";

type TrackPageTemplateProps = {
  page: TrackPage;
  proofItems: ProofItem[];
  ctaHref: string;
  children?: ReactNode;
};

export function TrackPageTemplate({
  page,
  proofItems,
  ctaHref,
  children
}: TrackPageTemplateProps): React.JSX.Element {
  return (
    <main className="page-frame">
      <SectionReveal>
        <section className="border-b border-ink/10 pb-12 pt-8 lg:pb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-graphite">{page.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl text-balance font-display text-[clamp(3rem,8vw,6rem)] leading-[0.94] text-ink">
            {page.title}
          </h1>
          <p className="mt-6 max-w-copy text-lg leading-8 text-graphite">{page.summary}</p>
        </section>
      </SectionReveal>

      <SectionReveal className="section-grid" delay={80}>
        <section>
          <p className="section-label">Why it exists</p>
          <RichText className="rich-text mt-6 max-w-copy text-base leading-8 text-ink" html={page.bodyHtml} />
        </section>

        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="section-label">{page.servicesHeading}</p>
            <ul className="mt-6 space-y-3">
              {page.services.map((service) => (
                <li className="border-b border-ink/10 pb-3 text-sm leading-7 text-graphite" key={service}>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="section-label">{page.audienceHeading}</p>
            <ul className="mt-6 space-y-3">
              {page.audience.map((entry) => (
                <li className="border-b border-ink/10 pb-3 text-sm leading-7 text-graphite" key={entry}>
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal className="section-grid" delay={140}>
        <section className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <p className="section-label">Working ideas</p>
            <p className="max-w-sm text-sm leading-7 text-graphite">
              These are the questions and standards shaping the work collected here.
            </p>
          </div>

          <ul className="space-y-3">
            {page.principles.map((principle) => (
              <li className="border-b border-ink/10 pb-3 text-sm leading-7 text-graphite" key={principle}>
                {principle}
              </li>
            ))}
          </ul>
        </section>
      </SectionReveal>

      <SectionReveal className="section-grid" delay={200}>
        <section>
          <p className="section-label">{page.proofHeading}</p>
          <div className="mt-6">
            <ProofList items={proofItems} />
          </div>
        </section>
      </SectionReveal>

      {children}

      <SectionReveal className="section-grid border-b border-ink/10" delay={240}>
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <p className="section-label">Write</p>
            <p className="max-w-copy text-sm leading-7 text-graphite">If this area overlaps with your work, write to me.</p>
          </div>

          <Link
            className="inline-flex items-center gap-3 border-b border-ink/30 pb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:text-steel"
            href={ctaHref}
          >
            {page.ctaLabel}
            <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </SectionReveal>
    </main>
  );
}
