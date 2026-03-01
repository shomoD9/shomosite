"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticElement } from "@/components/ui/magnetic-element";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export function Navigation() {
    const navRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!navRef.current) return;

        // Morph the navbar on scroll
        ScrollTrigger.create({
            start: "top -100px",
            end: 99999,
            toggleClass: {
                targets: navRef.current,
                className: "nav-scrolled"
            }
        });
    }, { scope: navRef });

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4 pointer-events-none">
            <nav
                ref={navRef}
                className="pointer-events-auto flex items-center justify-between rounded-full bg-void/0 px-8 py-3 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] border border-transparent backdrop-blur-none"
                style={{ width: "min(100%, 800px)" }}
            >
                <style jsx>{`
          .nav-scrolled {
            background-color: rgba(3, 3, 5, 0.7) !important;
            backdrop-filter: blur(12px) !important;
            border-color: rgba(201, 168, 76, 0.1) !important;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
        `}</style>

                <MagneticElement>
                    <Link href="/" className="text-light font-heading text-2xl tracking-tighter hover:text-accent transition-colors">
                        Shomo
                    </Link>
                </MagneticElement>

                <div className="hidden md:flex items-center space-x-8 font-mono text-sm tracking-widest text-light/70 uppercase">
                    <MagneticElement><Link href="#essays" className="hover:text-accent transition-colors">Essays</Link></MagneticElement>
                    <MagneticElement><Link href="#films" className="hover:text-accent transition-colors">Films</Link></MagneticElement>
                    <MagneticElement><Link href="#software" className="hover:text-accent transition-colors">Software</Link></MagneticElement>
                </div>

                <MagneticElement>
                    <Link href="#connect" className="relative overflow-hidden rounded-full bg-accent px-5 py-2 text-sm font-semibold tracking-wide text-void transition-colors hover:text-light group">
                        <span className="relative z-10 transition-colors duration-300">Connect</span>
                        <div className="absolute inset-0 z-0 bg-void translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"></div>
                    </Link>
                </MagneticElement>
            </nav>
        </div>
    );
}
