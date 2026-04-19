/*
This file is the custom list-page renderer for Shomosite's main folders. It
exists separately because `/prose`, `/product`, and `/docs` are not generic
directory dumps: each one needs a different organizing principle while still
falling back to Quartz's default folder behavior elsewhere. It talks to Quartz's
folder page machinery, to the rendered body tree for folder index notes, and to
the local site-data helpers that group notes by topic or product cluster.
*/

import { Root } from "hast"
import DefaultFolderContent from "../quartz/components/pages/FolderContent"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../quartz/components/types"
import { htmlToJsx } from "../quartz/util/jsx"
import { resolveRelative } from "../quartz/util/path"
import { concatenateResources } from "../quartz/util/resources"
import style from "./styles/shomoFolderContent.scss"
import { getDocsPages, getProductClusters, getProseTopicGroups, getSummary, getTitle } from "./siteData"

function renderIntro(props: QuartzComponentProps) {
  const { tree, fileData } = props

  if ((tree as Root).children.length === 0) {
    return fileData.description ? <p>{fileData.description}</p> : null
  }

  return htmlToJsx(fileData.filePath!, tree)
}

function renderEntry(
  props: QuartzComponentProps,
  page: NonNullable<QuartzComponentProps["allFiles"]>[number],
) {
  return (
    <article class="folder-entry">
      <h3>
        <a href={resolveRelative(props.fileData.slug!, page.slug!)} class="internal">
          {getTitle(page)}
        </a>
      </h3>
      {getSummary(page) && <p>{getSummary(page)}</p>}
    </article>
  )
}

export default (() => {
  const Fallback = DefaultFolderContent({})

  const ShomoFolderContent: QuartzComponent = (props: QuartzComponentProps) => {
    if (props.fileData.slug === "prose/index") {
      const groups = getProseTopicGroups(props.allFiles)

      return (
        <div class="shomo-folder prose-folder">
          <article class="folder-intro">{renderIntro(props)}</article>
          <div class="topic-groups">
            {groups.map((group) => (
              <section class="topic-group">
                <h2>{group.topic}</h2>
                <div class="topic-group-grid">
                  {group.pages.map((page) => renderEntry(props, page))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )
    }

    if (props.fileData.slug === "product/index") {
      const clusters = getProductClusters(props.allFiles)

      return (
        <div class="shomo-folder product-folder">
          <article class="folder-intro">{renderIntro(props)}</article>
          <div class="product-clusters">
            {clusters.map((cluster) => (
              <section class="product-cluster">
                {renderEntry(props, cluster.root)}
                {cluster.docs.length > 0 && (
                  <ul class="product-doc-list">
                    {cluster.docs.map((page) => (
                      <li>
                        <a href={resolveRelative(props.fileData.slug!, page.slug!)} class="internal">
                          {getTitle(page)}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      )
    }

    if (props.fileData.slug === "docs/index") {
      const docsPages = getDocsPages(props.allFiles)

      return (
        <div class="shomo-folder docs-folder">
          <article class="folder-intro">
            <p>
              These are the public documentation notes that explain how Shomosite is built and how
              its public writing system is intended to behave.
            </p>
          </article>
          <div class="docs-grid">{docsPages.map((page) => renderEntry(props, page))}</div>
        </div>
      )
    }

    // Any other folder should keep Quartz's normal behavior so source-shaped navigation stays intact.
    return <Fallback {...props} />
  }

  ShomoFolderContent.css = concatenateResources(Fallback.css ?? "", style)
  return ShomoFolderContent
}) satisfies QuartzComponentConstructor
