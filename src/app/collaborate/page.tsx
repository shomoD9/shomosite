/*
 * This file renders the working-together page, where the site explains how private work happens around the public practice.
 * It is separate because this operational note should stay editable without being buried in the homepage.
 * The route loads one local content document and translates it into a calm public working note.
 */

import Link from "next/link";

import { RichText } from "@/components/rich-text";
import { SectionReveal } from "@/components/section-reveal";
import { loadCollaboratePage } from "@/lib/content";
import { buildMailtoHref } from "@/lib/mailto";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-config";

const settings = getSiteSettings();

export const metadata = buildMetadata(settings, {
  title: "Working together",
  description: "A short note on fit, scope, and how private work happens around the public practice.",
  pathname: "/collaborate"
});

export default async function CollaboratePage(): Promise<React.JSX.Element> {
  const page = await loadCollaboratePage();
  const ctaHref = buildMailtoHref(
    settings.email,
    page.ctaSubject,
    "Context:\n\nWhat are you working on?\n\nWhat outcome would make this engagement worthwhile?"
  );

  return (
    <main className="page-frame">
      <SectionReveal>
        <section className="border-b border-ink/10 pb-12 pt-8 lg:pb-16">
          <p className="section-label">{page.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl text-balance font-display text-[clamp(3rem,8vw,6rem)] leading-[0.94] text-ink">
            {page.title}
          </h1>
          <p className="mt-6 max-w-copy text-lg leading-8 text-graphite">{page.summary}</p>
        </section>
      </SectionReveal>

      <SectionReveal className="section-grid" delay={80}>
        <section className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <p className="section-label">Working note</p>
          </div>
          <RichText className="rich-text max-w-copy text-base leading-8 text-ink" html={page.bodyHtml} />
        </section>
      </SectionReveal>

      <SectionReveal className="section-grid" delay={120}>
        <section className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <p className="section-label">How it usually goes</p>
          </div>
          <ol className="border-t border-ink/10">
            {page.process.map((step, index) => (
              <li className="grid gap-3 border-b border-ink/10 py-4 md:grid-cols-[auto_minmax(0,1fr)]" key={step}>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-steel">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-sm leading-7 text-graphite">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </SectionReveal>

      <SectionReveal className="section-grid" delay={160}>
        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="section-label">Good fit</p>
            <ul className="mt-6 space-y-3 border-t border-ink/10">
              {page.fit.map((entry) => (
                <li className="border-b border-ink/10 py-4 text-sm leading-7 text-graphite" key={entry}>
                  {entry}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="section-label">Not a fit</p>
            <ul className="mt-6 space-y-3 border-t border-ink/10">
              {page.notFit.map((entry) => (
                <li className="border-b border-ink/10 py-4 text-sm leading-7 text-graphite" key={entry}>
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal className="section-grid border-b border-ink/10" delay={200}>
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <p className="section-label">Write</p>
            <p className="max-w-copy text-sm leading-7 text-graphite">{page.supportNote}</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link
              className="inline-flex items-center gap-3 border-b border-ink/30 pb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:text-steel"
              href={ctaHref}
            >
              {page.ctaLabel}
              <span aria-hidden="true">↗</span>
            </Link>
            <Link
              className="inline-flex items-center gap-3 border-b border-ink/20 pb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-graphite transition-colors duration-300 hover:text-ink"
              href="/work"
            >
              Return to the work
            </Link>
          </div>
        </section>
      </SectionReveal>
    </main>
  );
}
