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
    "group flex h-full flex-col rounded-lg border border-line bg-[#0c0c0e] p-6 transition hover:border-accent/30 hover:bg-[#101012]";

  const header = (
    <>
      <span
        className="text-[0.72rem] tracking-[0.12em] text-accent"
        style={{ fontVariant: "small-caps" }}
      >
        {mediumLabels[props.medium]}
      </span>
      <h3 className="pt-3 font-heading text-xl font-medium leading-snug text-ink">
        {props.title}
      </h3>
      <p className="pt-3 text-[0.84rem] leading-relaxed text-muted">{props.summary}</p>
      <p className="mt-auto pt-6 text-[0.72rem] tabular-nums text-muted/80">
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
