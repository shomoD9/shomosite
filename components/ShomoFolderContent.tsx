/*
This file renders Shomosite's public archive and catalog indexes. It owns the
topic-led Prose map, the chronological All Writing view, individual topic
archives, and the combined Product catalog with type and lifecycle filters.
*/

import { Root } from "hast"
import { Date, getDate } from "../quartz/components/Date"
import DefaultFolderContent from "../quartz/components/pages/FolderContent"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../quartz/components/types"
import { htmlToJsx } from "../quartz/util/jsx"
import { FullSlug, resolveRelative } from "../quartz/util/path"
import { concatenateResources } from "../quartz/util/resources"
// @ts-ignore The inline script is bundled by Quartz and runs after SPA navigation.
import filterScript from "./scripts/productFilters.inline"
import style from "./styles/shomoFolderContent.scss"
import {
  PROSE_TOPICS,
  formatMetadataLabel,
  getItemStatus,
  getItemType,
  getProductClusters,
  getProsePages,
  getProsePagesForTopic,
  getSummary,
  getTitle,
  getTopic,
} from "./siteData"

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
      {page.dates && (
        <p class="folder-entry-date">
          <Date date={getDate(props.cfg, page)!} locale={props.cfg.locale} />
        </p>
      )}
    </article>
  )
}

function renderEmpty(message: string) {
  return <p class="archive-empty">{message}</p>
}

function ProseEntries({
  props,
  pages,
  emptyMessage,
}: {
  props: QuartzComponentProps
  pages: QuartzComponentProps["allFiles"]
  emptyMessage: string
}) {
  if (pages.length === 0) {
    return renderEmpty(emptyMessage)
  }

  return <div class="topic-group-grid">{pages.map((page) => renderEntry(props, page))}</div>
}

export default (() => {
  const Fallback = DefaultFolderContent({})

  const ShomoFolderContent: QuartzComponent = (props: QuartzComponentProps) => {
    if (props.fileData.slug === "prose/index") {
      return (
        <div class="shomo-folder prose-folder">
          <article class="folder-intro">{renderIntro(props)}</article>
          <p class="archive-utility-link">
            <a class="internal" href={resolveRelative(props.fileData.slug!, "prose/all/index" as FullSlug)}>
              Browse all writing by original publication date
            </a>
          </p>
          <div class="topic-groups">
            {PROSE_TOPICS.map((topic) => {
              const pages = getProsePagesForTopic(props.allFiles, topic.slug)
              return (
                <section class="topic-group">
                  <h2>
                    <a
                      class="internal"
                      href={resolveRelative(props.fileData.slug!, `prose/topics/${topic.slug}/index` as FullSlug)}
                    >
                      {topic.label}
                    </a>
                  </h2>
                  <p class="topic-description">{topic.description}</p>
                  <p class="topic-count">{pages.length} {pages.length === 1 ? "piece" : "pieces"}</p>
                </section>
              )
            })}
          </div>
        </div>
      )
    }

    if (props.fileData.slug === "prose/all/index") {
      const pages = getProsePages(props.allFiles)
      return (
        <div class="shomo-folder prose-folder">
          <article class="folder-intro">{renderIntro(props)}</article>
          <ProseEntries
            props={props}
            pages={pages}
            emptyMessage="The writing archive is starting fresh. New supplied pieces will appear here."
          />
        </div>
      )
    }

    const topicMatch = props.fileData.slug?.match(/^prose\/topics\/([^/]+)\/index$/)
    if (topicMatch) {
      const topic = getTopic(topicMatch[1])
      const pages = getProsePagesForTopic(props.allFiles, topicMatch[1])
      return (
        <div class="shomo-folder prose-folder">
          <article class="folder-intro">{renderIntro(props)}</article>
          <ProseEntries
            props={props}
            pages={pages}
            emptyMessage={`No writing has been added to ${topic?.label ?? "this topic"} yet.`}
          />
        </div>
      )
    }

    if (props.fileData.slug === "product/index") {
      const clusters = getProductClusters(props.allFiles)

      return (
        <div class="shomo-folder product-folder">
          <article class="folder-intro">{renderIntro(props)}</article>
          <div class="product-filters" aria-label="Product catalog filters">
            <div class="product-filter-group" role="group" aria-label="Filter by type">
              <span>Type</span>
              {["all", "product", "skill"].map((value) => (
                <button
                  type="button"
                  class={value === "all" ? "is-active" : ""}
                  data-product-filter="type"
                  data-filter-value={value}
                  aria-pressed={value === "all" ? "true" : "false"}
                >
                  {formatMetadataLabel(value)}
                </button>
              ))}
            </div>
            <div class="product-filter-group" role="group" aria-label="Filter by status">
              <span>Status</span>
              {["all", "active", "in-development", "experiment", "archived"].map((value) => (
                <button
                  type="button"
                  class={value === "all" ? "is-active" : ""}
                  data-product-filter="status"
                  data-filter-value={value}
                  aria-pressed={value === "all" ? "true" : "false"}
                >
                  {formatMetadataLabel(value)}
                </button>
              ))}
            </div>
          </div>
          <p class="product-filter-count" aria-live="polite">
            {clusters.length} {clusters.length === 1 ? "entry" : "entries"}
          </p>
          {clusters.length === 0 ? (
            renderEmpty("The product and skill catalog is starting fresh.")
          ) : (
            <div class="product-clusters">
              {clusters.map((cluster) => {
                const itemType = getItemType(cluster.root)
                const status = getItemStatus(cluster.root)
                return (
                  <section
                    class="product-cluster"
                    data-product-type={itemType}
                    data-product-status={status}
                  >
                    <p class="product-cluster-meta">
                      {formatMetadataLabel(itemType)} · {formatMetadataLabel(status)}
                    </p>
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
                )
              })}
            </div>
          )}
        </div>
      )
    }

    return <Fallback {...props} />
  }

  ShomoFolderContent.css = concatenateResources(Fallback.css ?? "", style)
  ShomoFolderContent.afterDOMLoaded = filterScript
  return ShomoFolderContent
}) satisfies QuartzComponentConstructor
