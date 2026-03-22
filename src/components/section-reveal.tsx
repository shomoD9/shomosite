"use client";

/*
 * This file gives sections a single restrained reveal as they enter the viewport.
 * It exists separately because motion should be intentional and reusable rather than improvised in every page file.
 * Home and inner-page sections wrap their major blocks with this component when a small entrance shift improves pacing.
 */

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";

import { cx } from "@/lib/classes";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
};

export function SectionReveal({
  children,
  className,
  as: Component = "div",
  delay = 0
}: SectionRevealProps): React.JSX.Element {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // When motion is reduced, we reveal immediately so access takes priority over staging.
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Component
      className={cx("reveal-block", className)}
      data-visible={visible ? "true" : "false"}
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Component>
  );
}
