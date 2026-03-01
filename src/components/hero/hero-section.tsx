"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MagneticElement } from "@/components/ui/magnetic-element";

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            tl.from(".hero-line-1", {
                y: 80,
                opacity: 0,
                duration: 1.5,
                rotationZ: 2,
                transformOrigin: "left bottom",
            })
                .from(".hero-line-2", {
                    y: 80,
                    opacity: 0,
                    duration: 1.5,
                    rotationZ: 1,
                    transformOrigin: "left bottom",
                }, "-=1.2")
                .from(".hero-subtitle", {
                    y: 20,
                    opacity: 0,
                    duration: 1.2,
                }, "-=1.0")
                .from(".hero-cta", {
                    y: 20,
                    opacity: 0,
                    duration: 1.2,
                }, "-=1.0")
                .from(".hero-image", {
                    scale: 1.05,
                    opacity: 0,
                    duration: 2,
                    ease: "power2.out"
                }, 0);
        }, containerRef);

        return () => ctx.revert();
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative h-[100dvh] w-full flex items-end pb-32 pl-[10%] pr-[5%] overflow-hidden">
            {/* Background Image & Gradient overlay */}
            <div className="hero-image absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop')", // Dark marble architectural shadow
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-void via-void/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-5xl">
                <div className="mb-6 overflow-hidden">
                    <h1 className="hero-line-1 text-4xl md:text-5xl lg:text-7xl font-sans font-bold tracking-tighter text-light/90 uppercase">
                        Intellectual depth meets
                    </h1>
                </div>

                <div className="mb-8 overflow-hidden">
                    <h2 className="hero-line-2 text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] font-heading font-medium italic text-light/100 tracking-tight">
                        Vast romantic <span className="text-accent">worlds.</span>
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row items-baseline gap-8 mt-12">
                    <p className="hero-subtitle font-mono text-sm tracking-widest text-light/60 max-w-sm leading-relaxed uppercase">
                        Context Engineering for the Romantic Rationalist
                    </p>

                    <div className="hero-cta opacity-0">
                        <MagneticElement>
                            <button className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-accent/30 bg-void px-8 py-4 transition-all duration-500 hover:border-accent">
                                <span className="relative z-10 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors group-hover:text-void">
                                    Explore Archives
                                </span>
                                <span className="relative z-10 flex h-2 w-2 items-center justify-center">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent group-hover:bg-void transition-colors"></span>
                                </span>
                                <div className="absolute inset-0 z-0 translate-y-[101%] bg-accent transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-y-0 text-void"></div>
                            </button>
                        </MagneticElement>
                    </div>
                </div>
            </div>
        </section>
    );
}
