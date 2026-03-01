"use client";

/*
 * This file renders the homepage hero and drives its kinematic behavior.
 * It exists separately because the hero combines scroll orchestration, pointer dampening, and deep layered composition that would overwhelm route code.
 * It talks to GSAP ScrollTrigger for timeline control and exports one section consumed by src/app/page.tsx.
 */

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const chamberRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const copyFloatRef = useRef<HTMLDivElement>(null);
  const hazeFloatRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const chamber = chamberRef.current;
      const copy = copyRef.current;
      const haze = hazeRef.current;

      if (!section || !chamber || !copy || !haze) {
        return;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lines = gsap.utils.toArray<HTMLElement>(".hero-line");

      if (!lines.length) {
        return;
      }

      // Intro animates type and metadata in one breath so the opening frame feels authored, not abrupt.
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(lines, { yPercent: 110, opacity: 0, duration: 1.2, stagger: 0.08 })
        .from(".hero-meta", { y: 18, opacity: 0, duration: 0.7 }, "-=0.78")
        .from(".hero-cta", { y: 18, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.58");

      if (reduceMotion) {
        return () => {
          intro.kill();
        };
      }

      // Scroll scrub lets the hero unfold as a spatial narrative instead of a static banner.
      const depthTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1
        }
      });

      depthTimeline
        .to(chamber, { scale: 1.05, yPercent: -6, ease: "none" }, 0)
        .to(copy, { yPercent: -24, opacity: 0.56, ease: "none" }, 0)
        .to(haze, { scale: 1.25, opacity: 0.32, ease: "none" }, 0);

      return () => {
        intro.kill();
        depthTimeline.kill();
      };
    },
    { scope: sectionRef }
  );

  useEffect(() => {
    const copyFloatLayer = copyFloatRef.current;
    const hazeFloatLayer = hazeFloatRef.current;

    if (!copyFloatLayer || !hazeFloatLayer) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    if (reduceMotion || !finePointer) {
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;

    const step = () => {
      // This damped interpolation gives interactions physical drag without heavy spring libraries.
      currentX += (targetX - currentX) * 0.11;
      currentY += (targetY - currentY) * 0.11;

      copyFloatLayer.style.transform = `translate3d(${currentX * -24}px, ${currentY * -17}px, 0)`;
      hazeFloatLayer.style.transform = `translate3d(${currentX * 30}px, ${currentY * 21}px, 0)`;

      rafId = window.requestAnimationFrame(step);
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
    };

    rafId = window.requestAnimationFrame(step);
    window.addEventListener("pointermove", onPointerMove);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-shell px-6 pt-24 md:px-12 md:pt-28">
      <div className="hero-pin flex items-center pb-20">
        <div
          ref={chamberRef}
          className="relative mx-auto flex w-full max-w-6xl items-end overflow-hidden rounded-[2.25rem] border border-line/80 bg-[linear-gradient(170deg,rgba(20,27,53,0.78)_0%,rgba(8,11,22,0.86)_55%,rgba(5,7,14,0.96)_100%)] px-7 py-10 md:min-h-[83svh] md:px-12 md:py-12"
        >
          <div ref={hazeRef} className="absolute inset-0 opacity-75">
            <div
              ref={hazeFloatRef}
              className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(207,172,116,0.34),transparent_46%),radial-gradient(circle_at_83%_78%,rgba(95,118,181,0.34),transparent_52%),linear-gradient(140deg,rgba(17,26,52,0.76)_0%,rgba(8,12,24,0.84)_60%,rgba(5,8,14,0.92)_100%)]"
            />
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(5,6,12,0.64)_76%,rgba(4,4,8,0.92)_100%)]" />

          {/* These thin rails add architectural direction so the hero feels like a chamber rather than a plain card. */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(236,221,196,0.06)_42%,rgba(236,221,196,0.07)_58%,transparent_100%)]" />

          <div ref={copyRef} className="relative z-10 w-full">
            <div ref={copyFloatRef} className="max-w-4xl">
              <p className="signal-line hero-meta mb-5 inline-block font-mono text-[0.58rem] uppercase tracking-[0.28em] text-accent">
                In pursuit of wonder
              </p>

              <h1 className="font-heading text-[2.5rem] leading-[0.9] text-light sm:text-[3.4rem] md:text-[5.5rem]">
                <span className="hero-line block overflow-hidden">Intellectual food</span>
                <span className="hero-line block overflow-hidden italic text-ink">for the romantic soul.</span>
              </h1>

              <div className="hero-meta mt-7 max-w-2xl space-y-3 text-sm leading-relaxed text-muted md:text-base">
                <p>Placeholder copy for now. A wide, slow interface for dreamy builders and exacting thinkers.</p>
                <p className="font-mono text-[0.59rem] uppercase tracking-[0.2em] text-light/72">
                  Context engineering / essays / films / software
                </p>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/essays"
                  className="hero-cta rounded-full border border-accent/70 bg-accent px-6 py-3 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[#1a1108] transition-transform duration-300 hover:-translate-y-[2px]"
                >
                  Enter Essays
                </Link>
                <Link
                  href="/videos"
                  className="hero-cta rounded-full border border-light/30 px-6 py-3 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-light/86 transition-colors duration-300 hover:border-light/56 hover:text-light"
                >
                  Watch Films
                </Link>
              </div>
            </div>

            <div className="orbital-divider hero-meta mt-14 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-line/80 bg-white/[0.03] p-4">
                <p className="font-mono text-[0.52rem] uppercase tracking-[0.22em] text-accent">Mode</p>
                <p className="mt-2 font-heading text-xl italic text-light">Mythic + Precise</p>
              </div>
              <div className="rounded-xl border border-line/80 bg-white/[0.03] p-4">
                <p className="font-mono text-[0.52rem] uppercase tracking-[0.22em] text-accent">Scale</p>
                <p className="mt-2 font-heading text-xl italic text-light">Civilizational</p>
              </div>
              <div className="rounded-xl border border-line/80 bg-white/[0.03] p-4">
                <p className="font-mono text-[0.52rem] uppercase tracking-[0.22em] text-accent">Practice</p>
                <p className="mt-2 font-heading text-xl italic text-light">Build + Reflect</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
