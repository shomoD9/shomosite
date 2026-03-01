"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export function MagneticElement({ children }: { children: React.ReactElement }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Use quickTo for performant tracking
        const xTo = gsap.quickTo(container, "x", { duration: 0.7, ease: "power3.out" });
        const yTo = gsap.quickTo(container, "y", { duration: 0.7, ease: "power3.out" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = container.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            // Calculate distance from center (damped)
            const x = (clientX - centerX) * 0.2;
            const y = (clientY - centerY) * 0.2;

            xTo(x);
            yTo(y);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative inline-flex items-center justify-center cursor-pointer">
            {children}
        </div>
    );
}
