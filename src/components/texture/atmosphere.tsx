"use client";

/*
 * This file renders the animated atmospheric light fields that sit behind all pages.
 * It exists separately so global depth behavior is isolated from route content and can be tuned without touching page layouts.
 * The component is mounted by src/app/layout.tsx and uses GSAP to animate large radial layers with slow drift.
 */

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Atmosphere(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        return;
      }

      // We animate each orb on a separate loop so depth feels organic instead of mechanically synchronized.
      const orbs = gsap.utils.toArray<HTMLElement>(".atmo-orb");
      const animations = orbs.flatMap((orb, index) => {
        const drift = gsap.to(orb, {
          x: index % 2 === 0 ? "+=140" : "-=170",
          y: index % 2 === 0 ? "-=120" : "+=110",
          duration: 34 + index * 8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        });

        const breathe = gsap.to(orb, {
          opacity: 0.16 + index * 0.03,
          scale: 1.08 + index * 0.04,
          duration: 18 + index * 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        });

        return [drift, breathe];
      });

      return () => {
        animations.forEach((animation) => animation.kill());
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      <div className="atmo-orb absolute -left-36 top-[-8%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(181,136,74,0.36)_0%,rgba(181,136,74,0)_72%)] blur-[90px]" />
      <div className="atmo-orb absolute right-[-15%] top-[22%] h-[48rem] w-[48rem] rounded-full bg-[radial-gradient(circle,rgba(57,79,125,0.32)_0%,rgba(57,79,125,0)_74%)] blur-[100px]" />
      <div className="atmo-orb absolute left-[22%] top-[58%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(131,98,145,0.24)_0%,rgba(131,98,145,0)_72%)] blur-[88px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(4,4,8,0.58)_72%,rgba(2,2,6,0.9)_100%)]" />
    </div>
  );
}
