"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

const INDEX_ITEMS = [
    { module: "Writings", title: "The Aesthetics of Compute", date: "2026", type: "Essay" },
    { module: "Theory", title: "Defending the Hero's Journey", date: "2026", type: "Essay" },
    { module: "System", title: "Context Engine Protocol", date: "v1.2", type: "Software" },
    { module: "Cinema", title: "Armchair Descending", date: "Film", type: "Video" },
];

export function MinimalIndex(): React.JSX.Element {
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Reveal list lines sequentially as they scroll into view
            gsap.from(".index-row", {
                scrollTrigger: {
                    trigger: listRef.current,
                    start: "top 80%",
                },
                opacity: 0,
                x: -40,
                duration: 1.2,
                stagger: 0.1,
                ease: "physics",
            });
        }, listRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="relative w-full bg-void py-48 px-6 overflow-hidden">
            <div className="mx-auto max-w-5xl">

                {/* Section Header */}
                <div className="mb-24 flex items-end justify-between border-b border-ink pb-8">
                    <h2 className="font-sans text-sm md:text-base uppercase tracking-widest text-ash">
                        System Index
                    </h2>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
                        Archive // Modules
                    </span>
                </div>

                {/* Index List (No Cards, Pure Rows) */}
                <ul ref={listRef} className="flex flex-col gap-y-1 border-t border-ink">
                    {INDEX_ITEMS.map((item, i) => (
                        <li
                            key={i}
                            className="index-row group relative border-b border-ink py-10 transition-colors duration-500 hover:border-ash/50 overflow-hidden"
                        >
                            <Link href="#" className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">

                                {/* Left side: Module tag + Title */}
                                <div className="flex items-center gap-8 md:gap-16">
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink transition-colors duration-500 group-hover:text-light">
                                        {item.module}
                                    </span>

                                    {/* The Typography collision on hover: transitions from strict Sans to loose Serif Italic */}
                                    <span className="font-sans text-3xl md:text-5xl lg:text-6xl text-light tracking-tight transition-all duration-700 group-hover:font-drama group-hover:tracking-normal group-hover:text-pure group-hover:translate-x-4">
                                        {item.title}
                                    </span>
                                </div>

                                {/* Right side: Meta */}
                                <div className="flex items-center gap-8 mt-4 md:mt-0 opacity-40 transition-opacity duration-500 group-hover:opacity-100">
                                    <span className="font-sans text-xs uppercase tracking-widest text-light">{item.type}</span>
                                    <span className="font-mono text-[10px] text-light">{item.date}</span>
                                </div>

                            </Link>

                            {/* Minimal magnetic hover fill effect (just a subtle gradient sweep, no heavy boxes) */}
                            <div className="absolute inset-0 z-0 -translate-x-[101%] bg-gradient-to-r from-ink/30 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-0" />
                        </li>
                    ))}
                </ul>

            </div>
        </section>
    );
}
