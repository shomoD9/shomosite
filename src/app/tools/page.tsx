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
    <section className="mx-auto max-w-6xl space-y-8 px-8 py-16 md:px-12">
      <div className="max-w-3xl space-y-4">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-accent">Archive</p>
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
