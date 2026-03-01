"use client";

/*
 * This file renders the persistent top navigation used across the entire site.
 * It exists as its own component so route-level pages can stay content-focused while navigation behavior stays centralized.
 * It interacts with Next routing via next/link and uses GSAP ScrollTrigger to morph the nav shell on scroll.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const primaryLinks = [
  { href: "/essays", label: "Essays" },
  { href: "/videos", label: "Films" },
  { href: "/books", label: "Books" },
  { href: "/tools", label: "Builders" }
];

export function Navigation(): React.JSX.Element {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const element = navRef.current;
      if (!element) {
        return;
      }

      // The nav condenses as the page advances so large opening space does not cost persistent navigation clarity.
      const trigger = ScrollTrigger.create({
        start: 48,
        end: 99999,
        onUpdate: ({ scroll }) => {
          element.classList.toggle("site-nav--scrolled", scroll() > 48);
        }
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: navRef }
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-5 py-5 md:py-7">
      <nav
        ref={navRef}
        className="site-nav pointer-events-auto flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-3 md:px-6"
      >
        <Link href="/" className="group flex items-center gap-3 pr-2">
          {/* The symbol is the superposed cross from the brand brief: a plus and x sharing one center. */}
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-5 w-5 text-accent transition-transform duration-500 group-hover:rotate-45"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          >
            <path d="M12 3.5v17" />
            <path d="M3.5 12h17" />
            <path d="M5.4 5.4l13.2 13.2" />
            <path d="M18.6 5.4L5.4 18.6" />
          </svg>
          <span className="font-heading text-xl italic tracking-tight text-light md:text-[1.45rem]">Shomo</span>
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {primaryLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-[0.62rem] uppercase tracking-[0.22em] transition-colors ${
                  isActive ? "text-accent" : "text-light/74 hover:text-light"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/#contact"
          className="rounded-full border border-accent/55 px-4 py-2 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent hover:text-[#1a1108]"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
