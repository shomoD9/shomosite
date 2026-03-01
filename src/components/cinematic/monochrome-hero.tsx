"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function MonochromeHero(): React.JSX.Element {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Violent typographic reveal
            gsap.from(".hero-line", {
                yPercent: 120,
                opacity: 0,
                duration: 1.8,
                stagger: 0.15,
                ease: "custom-spring",
                delay: 0.2
            });

            // Micro-rotation for the central superposed cross
            gsap.to(".core-symbol", {
                rotation: 360,
                duration: 40,
                repeat: -1,
                ease: "none"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-void px-6"
        >
            {/* 
        The Core Symbol: The Superposed Cross 
        Placed precisely in the center, rotating slowly. 1px line weights.
      */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-20 mix-blend-difference">
                <svg
                    viewBox="0 0 100 100"
                    className="w-96 h-96 core-symbol"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                >
                    {/* The + */}
                    <line x1="50" y1="10" x2="50" y2="90" />
                    <line x1="10" y1="50" x2="90" y2="50" />
                    {/* The x */}
                    <line x1="20" y1="20" x2="80" y2="80" />
                    <line x1="80" y1="20" x2="20" y2="80" />
                </svg>
            </div>

            <div className="relative z-10 mx-auto w-full max-w-7xl flex flex-col items-center text-center mt-20">

                <div className="overflow-hidden pb-4">
                    <p className="hero-line font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-ash">
                        System Designation: Shomo
                    </p>
                </div>

                <h1 className="mt-8 flex flex-col items-center space-y-2 md:space-y-0">
                    <div className="overflow-hidden leading-none pb-4">
                        <span className="hero-line block font-sans text-5xl md:text-7xl lg:text-[8rem] font-bold tracking-tighter text-light">
                            Intellectual
                        </span>
                    </div>
                    <div className="overflow-hidden leading-none pt-2 pb-6">
                        <span className="hero-line block font-drama text-6xl md:text-8xl lg:text-[9rem] text-pure drop-shadow-2xl">
                            Capacity.
                        </span>
                    </div>
                </h1>

                <div className="overflow-hidden mt-6 max-w-lg">
                    <p className="hero-line font-sans text-sm md:text-base text-ash font-light tracking-wide leading-relaxed">
                        We actively oppose the Cult of Smallness. This is the bridge between pure, cold rationality and detached romanticism.
                    </p>
                </div>

            </div>

            {/* Scroll indicator - absolute bottom */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 overflow-hidden">
                <div className="hero-line w-[1px] h-16 bg-gradient-to-b from-ash to-void" />
            </div>
        </section>
    );
}
