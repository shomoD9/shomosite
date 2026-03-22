/*
 * This file renders the HTML that comes out of the local Markdown content pipeline.
 * It is separate so typographic treatment for long-form copy stays centralized instead of duplicated per page.
 * Page routes and templates use it whenever prose from `content/` needs to appear on screen.
 */

type RichTextProps = {
  html: string;
  className?: string;
};

export function RichText({ html, className }: RichTextProps): React.JSX.Element | null {
  if (!html) {
    return null;
  }

  return (
    <div
      className={className}
      // The Markdown loader already owns the conversion step, so this component only applies presentation.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
