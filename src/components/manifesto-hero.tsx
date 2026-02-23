/*
 * This file renders the homepage intro and primary identity statement.
 * It is separated because the intro is a product-level narrative unit reused as the site's opening gesture.
 * The home route imports it, and it consumes site config for any outbound links.
 */

export function ManifestoHero(): React.JSX.Element {
  return (
    <section className="animate-fade-up pb-10 pt-14 md:pt-20">
      <div className="max-w-3xl space-y-5">
        <h1 className="font-heading text-[2.75rem] font-medium leading-[1.08] text-ink md:text-[3.5rem]">
          Shomodip De
        </h1>
        <p className="max-w-2xl text-lg leading-[1.8] text-muted md:text-[1.18rem]">
          Builder, storyteller. I think about human capacity — what summons it,
          what sustains it, and what we can do to get closer to it.
          This site collects my work across essays, videos, books, and software.
        </p>
      </div>
      <hr className="separator mt-12" />
    </section>
  );
}
