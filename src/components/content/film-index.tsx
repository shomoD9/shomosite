"use client";

/*
 * This file renders the film/video section with scroll-linked horizontal movement.
 * It exists separately because this section has specialized timeline behavior that should not leak into unrelated content modules.
 * It consumes VideoEntry records from the content layer and uses GSAP ScrollTrigger to pin and scrub the track.
 */

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { VideoEntry } from "@/types/content";

gsap.registerPlugin(ScrollTrigger);

type FilmIndexProps = {
  items: VideoEntry[];
};

export function FilmIndex({ items }: FilmIndexProps): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;

      if (!section || !track) {
        return;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const desktopOnly = window.matchMedia("(min-width: 1024px)").matches;

      if (reduceMotion || !desktopOnly) {
        return;
      }

      const travelDistance = Math.max(track.scrollWidth - section.clientWidth + 48, 0);
      if (!travelDistance) {
        return;
      }

      // Pinning here turns the section into a cinematic sequence where horizontal travel maps to vertical intent.
      const horizontalTween = gsap.to(track, {
        x: -travelDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${travelDistance + window.innerHeight * 0.62}`,
          scrub: 1.05,
          pin: true,
          anticipatePin: 1
        }
      });

      const cards = gsap.utils.toArray<HTMLElement>(".film-card");
      const revealTween = gsap.from(cards, {
        opacity: 0,
        y: 34,
        duration: 0.72,
        stagger: 0.09,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 74%"
        }
      });

      return () => {
        revealTween.kill();
        horizontalTween.scrollTrigger?.kill();
        horizontalTween.kill();
      };
    },
    { scope: sectionRef, dependencies: [items.length] }
  );

  return (
    <section ref={sectionRef} id="films" className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-accent">Films</p>
            <h2 className="font-heading text-4xl italic leading-[0.92] text-light md:text-6xl">
              Visual essays as
              <br />
              long-range signal.
            </h2>
          </div>

          <Link
            href="/videos"
            className="inline-flex w-fit rounded-full border border-line px-5 py-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-light/80 transition-colors hover:border-accent/70 hover:text-accent"
          >
            Film Archive
          </Link>
        </div>

        {items.length ? (
          <div className="overflow-hidden">
            <div ref={trackRef} className="flex gap-6 lg:gap-8">
              {items.slice(0, 6).map((video, index) => (
                <a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="film-card group relative min-w-[86vw] overflow-hidden rounded-[1.7rem] border border-line bg-[linear-gradient(160deg,rgba(20,27,54,0.72)_0%,rgba(8,12,24,0.9)_100%)] p-3 sm:min-w-[72vw] lg:min-w-[35rem]"
                >
                  <div className="relative aspect-video overflow-hidden rounded-[1.2rem] border border-line/80">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-[1300ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                      style={{
                        backgroundImage: `url('${
                          video.thumbnailUrl ||
                          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop"
                        }')`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                  </div>

                  {/* Metadata is intentionally sparse so cards read as cinematic plates rather than dashboard tiles. */}
                  <div className="space-y-3 px-1 pb-2 pt-4">
                    <p className="font-mono text-[0.54rem] uppercase tracking-[0.2em] text-accent">
                      Signal {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-heading text-2xl leading-tight text-light">{video.title}</h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted">{video.summary}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <p className="rounded-2xl border border-line bg-white/[0.03] px-5 py-4 text-sm text-muted">
            Video feed is empty right now. Placeholder state is active.
          </p>
        )}
      </div>
    </section>
  );
}
