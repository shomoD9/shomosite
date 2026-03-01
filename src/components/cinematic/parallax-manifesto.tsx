"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ParallaxManifesto(): React.JSX.Element {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Massive text fading up from pure darkness as you scroll
            gsap.fromTo(
                ".manifesto-text",
                { y: 150, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 75%",
                        end: "center center",
                        scrub: true,
                    }
                }
            );

            // Slower parallax for the trailing text
            gsap.fromTo(
                ".manifesto-sub",
                { y: 200, opacity: 0 },
                {
                    y: 0,
                    opacity: 0.6,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 60%",
                        end: "bottom 80%",
                        scrub: 1.5,
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative flex min-h-[120dvh] w-full flex-col items-center justify-center overflow-hidden bg-void px-6 z-20"
        >
            <div className="relative mx-auto max-w-6xl text-center">

                <h2 className="manifesto-text font-drama text-5xl leading-[1.1] text-light md:text-7xl lg:text-[7rem] tracking-tight">
                    Most builders focus on <br />
                    <span className="font-sans italic tracking-tighter text-pure">the machinery.</span>
                </h2>

                <h2 className="manifesto-text mt-12 font-drama text-5xl leading-[1.1] text-light md:text-7xl lg:text-[7rem] tracking-tight">
                    We focus on <span className="font-sans italic font-bold tracking-tighter text-pure">the soul</span> <br />
                    inside the code.
                </h2>

                <p className="manifesto-sub mt-24 max-w-2xl mx-auto font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-light leading-loose text-center">
                    Building bespoke digital instruments for the romantic rationalist. Zero templates. Zero presets. Just unapologetic physics.
                </p>
            </div>

            {/* Decorative center line anchoring the bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-t from-ash to-transparent opacity-30" />
        </section>
    );
}
