/*
 * This file converts Markdown-style prose in our local content files into renderable HTML.
 * It is isolated so filesystem parsing and HTML generation do not become tangled together.
 * The content loader in `src/lib/content.ts` uses this helper before handing page copy to React components.
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export async function renderMarkdown(markdown: string): Promise<string> {
  // We keep the prose pipeline intentionally small because the site needs rich paragraphs, not a full CMS engine.
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
