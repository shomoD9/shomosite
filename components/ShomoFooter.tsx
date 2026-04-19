import { QuartzComponent as QuartzComponentType, QuartzComponentConstructor, QuartzComponentProps } from "../quartz/components/types"
import { FullSlug, pathToRoot, resolveRelative } from "../quartz/util/path"
import { version } from "../package.json"
import style from "./styles/shomoFooter.scss"

export default (() => {
  const ShomoFooter: QuartzComponentType = ({ displayClass, fileData }: QuartzComponentProps) => {
    const currentSlug = (fileData.slug ?? "index") as FullSlug
    const homeHref = pathToRoot(currentSlug)
    const designHref = resolveRelative(currentSlug, "docs/design" as FullSlug)
    const year = new Date().getFullYear()

    return (
      <footer class={`shomo-footer ${displayClass ?? ""}`}>
        <div class="shomo-footer__grid">
          <div class="shomo-footer__col shomo-footer__col--left">
            <p class="shomo-footer__colophon">
              Created with{" "}
              <a
                class="shomo-footer__mark"
                href="https://obsidian.md/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Obsidian
              </a>
              {" "}and{" "}
              <a
                class="shomo-footer__mark"
                href="https://quartz.jzhao.xyz/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Quartz v{version}
              </a>
              {" "}© {year}
            </p>
            <nav class="shomo-footer__links" aria-label="Site">
              <a class="shomo-footer__link" href={homeHref}>About</a>
              <span class="shomo-footer__dot" aria-hidden="true">·</span>
              <a class="shomo-footer__link" href={designHref}>Design</a>
            </nav>
          </div>

          <div class="shomo-footer__col shomo-footer__col--center">
            <p class="shomo-footer__colophon">Write to me at</p>
            <nav class="shomo-footer__links" aria-label="Contact">
              <a class="shomo-footer__link shomo-footer__link--email" href="mailto:letters@shomodip.com">
                letters@shomodip.com
              </a>
            </nav>
          </div>

          <div class="shomo-footer__col shomo-footer__col--right">
            <p class="shomo-footer__colophon">Follow me on</p>
            <nav class="shomo-footer__links" aria-label="Elsewhere">
              <a
                class="shomo-footer__link"
                href="https://x.com/hegemonopolist"
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
              <span class="shomo-footer__dot" aria-hidden="true">·</span>
              <a
                class="shomo-footer__link"
                href="https://www.youtube.com/@armchairdescending"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </a>
              <span class="shomo-footer__dot" aria-hidden="true">·</span>
              <a
                class="shomo-footer__link"
                href="https://armchairdescending.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Substack
              </a>
            </nav>
          </div>
        </div>
      </footer>
    )
  }

  ShomoFooter.css = style
  return ShomoFooter
}) satisfies QuartzComponentConstructor
