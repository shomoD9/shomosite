"use client";

/*
 * This file renders the software/tools section with a restrained stagger reveal.
 * It exists as its own module so tool-specific layout and motion can evolve independently from other media sections.
 * It consumes ToolEntry data from the content layer and links users to route or canonical tool URLs.
 */

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { ToolEntry } from "@/types/content";

gsap.registerPlugin(ScrollTrigger);

type SoftwareIndexProps = {
  items: ToolEntry[];
};

export function SoftwareIndex({ items }: SoftwareIndexProps): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        return;
      }

      const rows = gsap.utils.toArray<HTMLElement>(".tool-row");
      if (!rows.length) {
        return;
      }

      // Short, weighted reveals keep the section energetic while preserving legibility.
      const revealTween = gsap.from(rows, {
        opacity: 0,
        y: 28,
        duration: 0.82,
        ease: "power2.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: section,
          start: "top 76%"
        }
      });

      return () => {
        revealTween.kill();
      };
    },
    { scope: sectionRef, dependencies: [items.length] }
  );

  return (
    <section ref={sectionRef} id="software" className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-accent">Builders</p>
            <h2 className="font-heading text-4xl italic leading-[0.92] text-light md:text-6xl">
              Rational machinery,
              <br />
              built with taste.
            </h2>
          </div>

          <Link
            href="/tools"
            className="inline-flex w-fit rounded-full border border-line px-5 py-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-light/80 transition-colors hover:border-accent/70 hover:text-accent"
          >
            Builder Archive
          </Link>
        </div>

        {items.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {items.slice(0, 6).map((tool, index) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="tool-row group rounded-[1.5rem] border border-line bg-[linear-gradient(180deg,rgba(16,23,46,0.72)_0%,rgba(10,14,28,0.9)_100%)] p-6 transition-transform duration-300 hover:-translate-y-[2px] hover:border-accent/52"
              >
                <p className="font-mono text-[0.54rem] uppercase tracking-[0.2em] text-accent">
                  Build {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-heading text-2xl leading-tight text-light">{tool.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{tool.summary}</p>
                <p className="mt-6 font-mono text-[0.54rem] uppercase tracking-[0.2em] text-light/68">Open Detail</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-line bg-white/[0.03] px-5 py-4 text-sm text-muted">
            Tool entries are unavailable right now. Placeholder state is active.
          </p>
        )}
      </div>
    </section>
  );
}
