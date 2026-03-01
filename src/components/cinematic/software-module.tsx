"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

const SOFTWARE = [
    { title: "Context Engine Protocol", status: "Operational", language: "TypeScript" },
    { title: "Quiet Planner Core", status: "Beta", language: "Rust" },
];

export function SoftwareModule(): React.JSX.Element {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            gsap.from(".software-item", {
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
        <section ref={containerRef} className="w-full bg-void py-16 px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-20 border-b border-ink pb-6">
                    <h2 className="font-sans text-sm md:text-base uppercase tracking-widest text-ash">
                        Proof of Work // Software
                    </h2>
                </div>

                <div className="flex flex-col gap-8">
                    {SOFTWARE.map((tool, i) => (
                        <Link
                            key={i}
                            href="#"
                            className="software-item group grid grid-cols-1 md:grid-cols-[160px_1fr] gap-8 md:gap-12 items-center border border-ink/40 p-8 transition-colors duration-500 hover:border-ash/80"
                        >
                            {/* Thumbnail Placeholder (Square terminal vibe) */}
                            <div className="relative aspect-square w-full bg-[#050505] overflow-hidden flex flex-col justify-between p-4 border border-ink/20 transition-transform duration-700 group-hover:scale-105">
                                <div className="w-2 h-2 rounded-full bg-ash/30 group-hover:bg-light transition-colors duration-500" />
                                <div className="font-mono text-[8px] text-ash/40 group-hover:text-ash/80 transition-colors uppercase break-words">
                                    &gt;_ init
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col justify-center">
                                <h3 className="font-sans text-3xl md:text-5xl text-light tracking-tight transition-all duration-700 group-hover:font-drama group-hover:text-pure group-hover:translate-x-4">
                                    {tool.title}
                                </h3>
                                <div className="mt-8 flex gap-6 font-mono text-[10px] uppercase tracking-widest text-ash transition-all duration-500 group-hover:text-light group-hover:translate-x-4">
                                    <span className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-light animate-pulse" />
                                        {tool.status}
                                    </span>
                                    <span>{tool.language}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
