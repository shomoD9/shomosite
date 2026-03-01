"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function PrimitiveNav(): React.JSX.Element {
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Simple fade in on load
        gsap.fromTo(
            navRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.5 }
        );
    }, []);

    return (
        <div
            ref={navRef}
            className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between p-6 mix-blend-difference pointer-events-none"
        >
            <div className="pointer-events-auto">
                <Link href="/" className="font-sans text-xs font-bold tracking-[0.2em] text-light uppercase magnetic-text hover:opacity-70">
                    Shomo
                </Link>
            </div>

            <nav className="pointer-events-auto flex items-center gap-8">
                <Link href="/protocol" className="font-mono text-[10px] tracking-widest text-light uppercase lift-link">
                    Protocol
                </Link>
                <Link href="/essays" className="font-mono text-[10px] tracking-widest text-light uppercase lift-link">
                    Essays
                </Link>
            </nav>
        </div>
    );
}
