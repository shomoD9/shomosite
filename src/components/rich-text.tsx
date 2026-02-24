/*
 * This file renders trusted, pre-sanitized HTML blocks from feeds and local content.
 * It exists separately so dangerous markup boundaries are explicit and tightly controlled in one component.
 * Essay, book, and tool detail pages pass processed HTML into this renderer.
 */

type RichTextProps = {
  html: string;
};

export function RichText({ html }: RichTextProps): React.JSX.Element {
  return (
    <div
      className="prose prose-dropcap prose-invert max-w-none prose-headings:font-heading prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-ink prose-p:text-[1.06rem] prose-p:leading-[1.78] prose-p:text-muted prose-strong:text-ink prose-li:text-muted prose-li:leading-[1.78] prose-blockquote:border-l-2 prose-blockquote:border-accent/25 prose-blockquote:bg-transparent prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-ink prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-hr:border-line"
      // The HTML is sanitized in data adapters before reaching this component.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
