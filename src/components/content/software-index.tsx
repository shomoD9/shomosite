"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticElement } from "@/components/ui/magnetic-element";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export function SoftwareIndex({ items }: { items: any[] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        gsap.from(".software-row", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
            },
            x: -30,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power2.out"
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} id="software" className="relative w-full py-32 px-6 md:px-12 lg:px-24 border-t border-dim">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32">
                {/* Sticky Header Side */}
                <div className="lg:w-1/3 flex flex-col">
                    <div className="sticky top-40">
                        <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-accent mb-4">
                            03 // The Foundry
                        </h2>
                        <h3 className="text-5xl md:text-6xl font-heading font-medium italic text-light/90 mb-8">
                            Code as
                            <br />
                            <span className="text-light">Architecture.</span>
                        </h3>
                        <p className="font-mono text-sm text-light/50 leading-relaxed mb-12 max-w-sm">
                            Tools, applications, and structural systems built for the modern rationalist and creative engineer.
                        </p>
                        <MagneticElement>
                            <Link href="/tools" className="group inline-flex border border-dim hover:border-accent rounded-full px-6 py-3 items-center gap-4 text-xs font-mono uppercase tracking-widest text-light/60 hover:text-accent transition-colors bg-obsidian">
                                <span>View Repository</span>
                                <span className="text-accent transform group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </MagneticElement>
                    </div>
                </div>

                {/* List Side */}
                <div className="lg:w-2/3 flex flex-col gap-6">
                    {items.slice(0, 6).map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.link || '#'}
                            className="software-row group relative flex flex-col md:flex-row md:items-center justify-between p-8 md:p-10 bg-obsidian/50 border border-dim rounded-[2rem] hover:bg-obsidian hover:border-accent/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                        >
                            <div className="flex flex-col gap-4 mb-6 md:mb-0">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-accent opacity-50 group-hover:opacity-100 group-hover:shadow-[0_0_10px_rgba(201,168,76,0.6)] transition-all"></span>
                                    <h4 className="text-2xl font-heading font-medium text-light group-hover:text-accent transition-colors">
                                        {item.name}
                                    </h4>
                                </div>
                                <p className="font-mono text-xs text-light/50 max-w-md leading-relaxed group-hover:text-light/70 transition-colors">
                                    {item.description}
                                </p>
                            </div>

                            <div className="flex bg-void px-4 py-2 border border-dim rounded-full font-mono text-[10px] uppercase tracking-widest text-light/40 group-hover:border-accent/30 group-hover:text-accent transition-colors">
                                Execute
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
