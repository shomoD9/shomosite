/*
 * This file provides a reusable card primitive for entries across all media sections.
 * It lives in its own file so visual consistency and interaction behavior stay aligned across routes.
 * Home and section pages pass content metadata into this component for rendering.
 */

import Link from "next/link";

import { toDisplayDate } from "@/lib/date";

type CardMedium = "essay" | "video" | "book" | "tool";

type ContentCardProps = {
  title: string;
  summary: string;
  href: string;
  publishedAt: string;
  medium: CardMedium;
  external?: boolean;
};

const mediumLabels: Record<CardMedium, string> = {
  essay: "Essay",
  video: "Video",
  book: "Book",
  tool: "Tool"
};

export function ContentCard(props: ContentCardProps): React.JSX.Element {
  const anchorClassName =
    "group flex h-full flex-col rounded-3xl border border-line/90 bg-white/80 p-6 shadow-card transition hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg";

  const header = (
    <>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {mediumLabels[props.medium]}
      </span>
      <h3 className="pt-3 font-serif text-2xl leading-tight text-ink transition group-hover:text-accent">
        {props.title}
      </h3>
      <p className="pt-3 text-sm leading-relaxed text-muted">{props.summary}</p>
      <p className="mt-auto pt-6 text-xs uppercase tracking-[0.14em] text-muted">
        {toDisplayDate(props.publishedAt)}
      </p>
    </>
  );

  // We branch between internal and external navigation so cards can represent both local and remote detail pages.
  if (props.external) {
    return (
      <a href={props.href} className={anchorClassName} target="_blank" rel="noreferrer">
        {header}
      </a>
    );
  }

  return (
    <Link href={props.href} className={anchorClassName}>
      {header}
    </Link>
  );
}
