"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticElement } from "@/components/ui/magnetic-element";

gsap.registerPlugin(ScrollTrigger);

export function FilmIndex({ items }: { items: any[] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Reveal animation
        gsap.from(".film-card", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            },
            y: 60,
            opacity: 0,
            duration: 1.5,
            stagger: 0.15,
            ease: "power3.out"
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} id="films" className="relative w-full py-32 px-6 md:px-12 lg:px-24 bg-void">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div>
                        <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-accent mb-4">
                            02 // Visual Broadcasts
                        </h2>
                        <h3 className="text-5xl md:text-7xl font-heading font-medium italic text-light/90">
                            The Moving
                            <br />
                            <span className="text-light">Signal.</span>
                        </h3>
                    </div>
                    <MagneticElement>
                        <a href="/videos" className="group flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-light/60 hover:text-accent transition-colors">
                            <span>All Broadcasts</span>
                            <div className="w-12 h-[1px] bg-light/30 group-hover:bg-accent group-hover:w-20 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"></div>
                        </a>
                    </MagneticElement>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    {items.slice(0, 4).map((item, idx) => (
                        <a
                            key={idx}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="film-card group relative flex flex-col gap-6"
                        >
                            {/* Thumbnail Container */}
                            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-obsidian border border-dim group-hover:border-accent/40 transition-colors duration-500">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                    style={{
                                        backgroundImage: `url('${item.thumbnailUrl || 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?q=80&w=2564&auto=format&fit=crop'}')`,
                                        filter: "grayscale(30%) contrast(110%)"
                                    }}
                                />
                                <div className="absolute inset-0 bg-void/30 group-hover:bg-void/10 transition-colors duration-500 mix-blend-multiply" />

                                {/* Play Button Indicator */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-void/80 backdrop-blur-sm border border-light/10 flex items-center justify-center scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-light border-b-[6px] border-b-transparent ml-1"></div>
                                </div>
                            </div>

                            {/* Meta Data */}
                            <div className="flex flex-col gap-3 pr-8">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-xs text-accent">ID--{(idx + 1).toString().padStart(3, '0')}</span>
                                    <span className="w-4 h-[1px] bg-dim"></span>
                                    <span className="font-mono text-xs uppercase tracking-widest text-light/40">
                                        {new Date(item.pubDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                                    </span>
                                </div>
                                <h4 className="text-2xl md:text-3xl font-heading font-medium text-light/90 group-hover:text-accent transition-colors duration-500 line-clamp-2">
                                    {item.title}
                                </h4>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
