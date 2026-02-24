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
    "group card-surface flex h-full flex-col rounded-2xl border border-line p-7";

  const header = (
    <>
      <span
        className="font-mono text-[0.68rem] uppercase tracking-[0.15em] text-accent"
      >
        {mediumLabels[props.medium]}
      </span>
      <h3 className="pt-3 font-heading text-xl font-medium leading-snug text-ink">
        {props.title}
      </h3>
      <p className="pt-3 text-[0.84rem] leading-relaxed text-muted">{props.summary}</p>
      <p className="mt-auto pt-6 font-mono text-[0.68rem] text-muted/60">
        {toDisplayDate(props.publishedAt)}
      </p>
    </>
  );

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
