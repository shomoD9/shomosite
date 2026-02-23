/*
 * This file renders the index for curated software tools stored in local MDX files.
 * It exists separately because product/tool discovery has different intent than essays and videos.
 * The route uses local content adapters and shared cards for consistent browsing.
 */

import { ContentCard } from "@/components/content-card";
import { getTools } from "@/lib/content";
import { buildSectionMetadata } from "@/lib/seo/metadata";

export const metadata = buildSectionMetadata({
  title: "Tools",
  description: "Open and personal software projects with links to repo, web app, and store listings.",
  pathname: "/tools"
});

export default async function ToolsPage(): Promise<React.JSX.Element> {
  const tools = await getTools();

  return (
    <section className="space-y-8 py-10">
      <div className="max-w-3xl space-y-4">
        <h1 className="font-heading text-[2.75rem] font-medium leading-[1.08] text-ink">Tools</h1>
        <p className="text-lg leading-[1.8] text-muted">
          Software I built, mostly for creative work.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <ContentCard
            key={tool.id}
            title={tool.title}
            summary={tool.summary}
            href={`/tools/${tool.slug}`}
            publishedAt={tool.publishedAt}
            medium="tool"
          />
        ))}
      </div>
    </section>
  );
}
