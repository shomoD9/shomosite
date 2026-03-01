"use client";

import Image from "next/image";
import Link from "next/link";
import { HeroAnimation } from "@/components/scroll-animations";

export function ManifestoHero(): React.JSX.Element {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden">
      {/* Full-bleed dark forest hero */}
      <Image
        src="/hero-forest.png"
        alt="A dark forest path disappearing into fog with a distant amber light"
        fill
        priority
        className="object-cover"
        style={{ objectPosition: "center 40%" }}
      />

      {/* Cold gradient overlay — the forest fades into the void */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to bottom, rgba(9,12,18,0.15) 0%, rgba(9,12,18,0.05) 25%, rgba(9,12,18,0.5) 55%, rgba(9,12,18,0.97) 82%, rgba(9,12,18,1) 100%),
            linear-gradient(to right, rgba(9,12,18,0.6) 0%, transparent 25%, transparent 75%, rgba(9,12,18,0.6) 100%)
          `
        }}
      />

      {/* Content — bottom-left, the signal from the deep */}
      <HeroAnimation className="relative z-10 mx-auto w-full max-w-6xl space-y-5 px-8 pb-20 md:px-12 md:pb-28">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.25em] text-accent">
          Builder &nbsp;· &nbsp;Storyteller
        </p>
        <h1 className="max-w-3xl font-heading text-[3.5rem] font-medium leading-[1.05] text-ink md:text-[5rem]">
          <span className="block">Understanding the </span>
          <span className="block font-heading italic text-accent">human limit.</span>
        </h1>
        <p className="max-w-xl text-lg leading-[1.75] text-muted md:text-[1.15rem]">
          I think about human capacity — what summons it, what sustains it,
          and what we can do to get closer to it.
        </p>
        <div className="pt-3">
          <Link
            href="#recent"
            className="magnetic-btn slide-bg-btn inline-flex rounded-full border border-accent/50 px-7 py-3 text-[0.72rem] uppercase tracking-[0.15em] text-accent"
          >
            See What I Found
          </Link>
        </div>
      </HeroAnimation>
    </section>
  );
}
