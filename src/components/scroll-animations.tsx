"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
    children: ReactNode;
    className?: string;
    stagger?: number;
    /** If true, animate children individually. Otherwise animate the wrapper element. */
    staggerChildren?: boolean;
};

/**
 * Wraps children in a GSAP ScrollTrigger reveal animation.
 * Elements fade up from y: 30 with power3.out easing when they enter the viewport.
 */
export function ScrollReveal({ children, className, stagger = 0.15, staggerChildren = false }: RevealProps): React.JSX.Element {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            if (staggerChildren) {
                gsap.from(el.children, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                });
            } else {
                gsap.from(el, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                });
            }
        }, el);

        return () => ctx.revert();
    }, [stagger, staggerChildren]);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
}

/**
 * Hero-specific animation: staggered fade-up for each direct child.
 * Runs on mount, not scroll-triggered.
 */
type HeroAnimationProps = {
    children: ReactNode;
    className?: string;
};

export function HeroAnimation({ children, className }: HeroAnimationProps): React.JSX.Element {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.from(el.children, {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.12,
                ease: "power3.out",
                delay: 0.2
            });
        }, el);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
}
