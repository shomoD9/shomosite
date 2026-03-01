"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

const ESSAYS = [
    { title: "The Aesthetics of Compute", date: "April 2026", readTime: "8 min" },
    { title: "Defending the Hero's Journey", date: "March 2026", readTime: "12 min" },
    { title: "On Romantic Rationalism", date: "January 2026", readTime: "15 min" },
];

export function EssaysModule(): React.JSX.Element {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            gsap.from(".essay-item", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                },
                y: 60,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "custom-spring",
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full bg-void py-32 px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-20 border-b border-ink pb-6">
                    <h2 className="font-sans text-sm md:text-base uppercase tracking-widest text-ash">
                        Writings // Essays
                    </h2>
                </div>

                <div className="flex flex-col gap-16">
                    {ESSAYS.map((essay, i) => (
                        <Link
                            key={i}
                            href="#"
                            className="essay-item group grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 items-center"
                        >
                            {/* Thumbnail Placeholder (Portrait aspect for reading) */}
                            <div className="relative aspect-[3/4] w-full max-w-[280px] bg-ink/20 overflow-hidden border border-ink/40 transition-colors duration-500 group-hover:border-ash">
                                <div className="absolute inset-0 bg-gradient-to-tr from-void to-transparent opacity-80" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-30 transition-opacity duration-700">
                                    <span className="font-serif italic text-6xl text-light">E{i + 1}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col justify-center">
                                <h3 className="font-sans text-4xl md:text-5xl lg:text-7xl text-light tracking-tight transition-all duration-700 group-hover:font-drama group-hover:text-pure group-hover:translate-x-4">
                                    {essay.title}
                                </h3>
                                <div className="mt-8 flex gap-6 font-mono text-[10px] uppercase tracking-widest text-ash transition-all duration-500 group-hover:text-light group-hover:translate-x-4">
                                    <span>{essay.date}</span>
                                    <span>{essay.readTime}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
