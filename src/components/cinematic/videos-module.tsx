"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

const VIDEOS = [
    { title: "Armchair Descending: Episode 001", duration: "18:24" },
    { title: "The Context Engine Visualized", duration: "24:10" },
];

export function VideosModule(): React.JSX.Element {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            gsap.from(".video-item", {
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
                        Cinema // Videos
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {VIDEOS.map((video, i) => (
                        <Link
                            key={i}
                            href="#"
                            className="video-item group flex flex-col gap-6"
                        >
                            {/* Thumbnail Placeholder (16:9 aspect for video) */}
                            <div className="relative w-full aspect-video bg-ink/10 border border-ink/30 overflow-hidden transition-all duration-700 group-hover:border-ash group-hover:scale-[1.02]">
                                {/* Simulated film grain and play button */}
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-12 w-12 rounded-full border border-ash/50 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:border-light">
                                        <svg className="w-4 h-4 text-light ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <h3 className="font-sans text-2xl md:text-3xl text-light tracking-tight transition-all duration-700 group-hover:font-drama group-hover:text-pure group-hover:translate-x-2">
                                    {video.title}
                                </h3>
                                <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-ash transition-all duration-500 group-hover:text-light group-hover:translate-x-2">
                                    Duration // {video.duration}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
