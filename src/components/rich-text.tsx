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
      className="prose prose-neutral max-w-none prose-headings:font-serif prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
      // The HTML is sanitized in data adapters before reaching this component.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
