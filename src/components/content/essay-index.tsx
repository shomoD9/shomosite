"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticElement } from "@/components/ui/magnetic-element";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export function EssayIndex({ items }: { items: any[] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Staggered reveal for essay items on scroll
        gsap.from(".essay-item", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
            },
            y: 40,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out"
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} id="essays" className="relative w-full py-32 px-6 md:px-12 lg:px-24">
            {/* Background radial soft light for depth */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-screen" />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div>
                        <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-accent mb-4">
                            01 // The Archives
                        </h2>
                        <h3 className="text-5xl md:text-7xl font-heading font-medium italic text-light/90">
                            Intellectual
                            <br />
                            <span className="text-light">Expeditions.</span>
                        </h3>
                    </div>
                    <MagneticElement>
                        <Link href="/essays" className="group flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-light/60 hover:text-accent transition-colors">
                            <span>View All Context</span>
                            <div className="w-12 h-[1px] bg-light/30 group-hover:bg-accent group-hover:w-20 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"></div>
                        </Link>
                    </MagneticElement>
                </div>

                <div className="flex flex-col border-t border-dim">
                    {items.slice(0, 5).map((item, idx) => (
                        <a
                            key={idx}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="essay-item group relative flex flex-col md:flex-row md:items-center justify-between py-10 md:py-16 border-b border-dim transition-colors hover:bg-obsidian/30"
                        >
                            {/* Hover sweep background */}
                            <div className="absolute inset-0 w-full h-full bg-accent/5 scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] -z-10" />

                            <div className="flex items-start md:items-center gap-8 md:gap-16 w-full md:w-auto mb-6 md:mb-0">
                                <span className="font-mono text-xs md:text-sm text-dim group-hover:text-accent transition-colors">
                                    {(idx + 1).toString().padStart(2, '0')}
                                </span>
                                <h4 className="text-3xl md:text-5xl font-heading font-medium text-light/80 group-hover:text-light group-hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                                    {item.title}
                                </h4>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-12 w-full md:w-auto">
                                <span className="font-mono text-xs uppercase tracking-widest text-light/40 group-hover:text-light/80 transition-colors">
                                    {new Date(item.pubDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                </span>

                                {/* Arrow indicator */}
                                <div className="w-8 h-8 rounded-full border border-dim group-hover:border-accent flex items-center justify-center transition-colors overflow-hidden relative">
                                    <span className="absolute transform transition-transform duration-500 group-hover:translate-x-[150%] text-dim">↗</span>
                                    <span className="absolute transform -translate-x-[150%] transition-transform duration-500 group-hover:translate-x-0 text-accent">↗</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
