"use client";

import Image from "next/image";
import Link from "next/link";
import { HeroAnimation } from "@/components/scroll-animations";

export function ManifestoHero(): React.JSX.Element {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden">
      {/* Full-bleed background image */}
      <Image
        src="/hero-abyss.png"
        alt="A spiral staircase descending into warm light"
        fill
        priority
        className="object-cover"
        style={{ objectPosition: "center 35%" }}
      />

      {/* Heavy gradient overlay — fades image into the void at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to bottom, rgba(12,12,16,0.2) 0%, rgba(12,12,16,0.1) 30%, rgba(12,12,16,0.6) 60%, rgba(12,12,16,0.97) 85%, rgba(12,12,16,1) 100%),
            linear-gradient(to right, rgba(12,12,16,0.6) 0%, transparent 25%, transparent 75%, rgba(12,12,16,0.6) 100%)
          `
        }}
      />

      {/* Content pushed to bottom-left */}
      <HeroAnimation className="relative z-10 mx-auto w-full max-w-6xl space-y-5 px-8 pb-20 md:px-12 md:pb-28">
        <p
          className="font-mono text-[0.72rem] uppercase tracking-[0.25em] text-accent"
        >
          Builder &nbsp;· &nbsp;Storyteller
        </p>
        <h1 className="max-w-3xl font-heading text-[3.5rem] font-medium leading-[1.05] text-ink md:text-[5rem]">
          <span className="block">Capacity is the</span>
          <span className="block font-heading italic text-accent">question.</span>
        </h1>
        <p className="max-w-xl text-lg leading-[1.75] text-muted/90 md:text-[1.15rem]">
          I think about human capacity — what summons it, what sustains it,
          and what we can do to get closer to it.
        </p>
        <div className="pt-3">
          <Link
            href="#recent"
            className="magnetic-btn slide-bg-btn inline-flex rounded-full border border-accent/50 px-7 py-3 text-[0.72rem] uppercase tracking-[0.15em] text-accent"
          >
            Explore the Archive
          </Link>
        </div>
      </HeroAnimation>
    </section>
  );
}
