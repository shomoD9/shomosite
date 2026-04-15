/*
This client script turns internal-link previews into draggable reading windows.
It exists separately because previews are part of the site's reading model, not
just decoration: the script fetches previewable content, chooses sensible
placement, supports pin/maximize behavior, and falls back to a centered sheet on
touch layouts. It talks to Quartz's internal-link markup, to emitted HTML pages
and staged sidenote fragments, and to the shared popover stylesheet.

Recursive stacking: multiple hover popovers can be open simultaneously in a
parent-child chain (gwern-style). A child popover keeps its ancestors alive;
leaving a child closes it while the parent stays open.
*/

import { normalizeRelativeURLs } from "../../util/path"
import { fetchCanonical } from "./util"

const parser = new DOMParser()
type Point = { x: number; y: number }
const previewCache = new Map<string, PreviewPayload>()
const pinnedPopovers = new Map<string, HTMLElement>()
const popoverStates = new WeakMap<HTMLElement, PopoverState>()
const linkSpawnPoints = new WeakMap<HTMLAnchorElement, Point>()
const linkSpawnTimers = new WeakMap<HTMLAnchorElement, number>()
const svgNamespace = "http://www.w3.org/2000/svg"

const hoverStack: HTMLElement[] = []
let activeHoverWindow: HTMLElement | null = null
let modalPopover: HTMLElement | null = null
let hoverFadeTimer: number | null = null
let emphasisTimer: number | null = null
let zIndexCounter = 1200

const POPUP_TRIGGER_DELAY = 650
const POPUP_FADE_DELAY = 180
const POPUP_FADE_DURATION = 250

type PreviewPayload = {
  key: string
  title: string
  contentType: string
  bodyHTML?: string
  mediaSrc?: string
  linkHref: string | null
}

type PopoverState = {
  key: string
  trigger: HTMLAnchorElement
  spawnPoint: Point | null
  hash: string
  pinned: boolean
  maximized: boolean
  collapsed: boolean
  modal: boolean
  parentPopover: HTMLElement | null
  restoreBox?: { left: number; top: number; width: number; height: number }
}

function canHoverPreview() {
  return window.innerWidth > 1080 && window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

function isTouchPreviewLayout() {
  return !canHoverPreview()
}

function usesDesktopMarginNotes(link: HTMLAnchorElement) {
  return (
    link.dataset.sidenote === "true" &&
    window.innerWidth > 1080 &&
    Boolean(document.querySelector(".shomo-margin-notes[data-margin-notes='prose']"))
  )
}

function getPreviewTarget(link: HTMLAnchorElement) {
  const previewTarget = link.dataset.preview
  const targetUrl = previewTarget ? new URL(previewTarget, window.location.href) : new URL(link.href)
  const hash = decodeURIComponent(targetUrl.hash)
  targetUrl.hash = ""
  targetUrl.search = ""

  return { targetUrl, hash }
}

function getPreviewKey(targetUrl: URL) {
  return targetUrl.pathname.replace(/\/$/, "") || "/"
}

function setSpawnPoint(link: HTMLAnchorElement, x: number, y: number) {
  linkSpawnPoints.set(link, { x, y })
}

function getSpawnPoint(link: HTMLAnchorElement): Point {
  const stored = linkSpawnPoints.get(link)
  if (stored) {
    return stored
  }

  const rect = link.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }
}

function clearSpawnTimer(link: HTMLAnchorElement) {
  const timer = linkSpawnTimers.get(link)
  if (timer !== undefined) {
    window.clearTimeout(timer)
    linkSpawnTimers.delete(link)
  }
}

function isPreviewTriggerActive(link: HTMLAnchorElement) {
  return link.matches(":hover") || document.activeElement === link
}

function schedulePreviewSpawn(link: HTMLAnchorElement) {
  clearSpawnTimer(link)

  const timer = window.setTimeout(() => {
    linkSpawnTimers.delete(link)
    if (!link.isConnected || !isPreviewTriggerActive(link) || !canHoverPreview()) {
      return
    }

    void openPreview(link, { modal: false })
  }, POPUP_TRIGGER_DELAY)

  linkSpawnTimers.set(link, timer)
}

function cancelScheduledClear() {
  if (hoverFadeTimer !== null) {
    window.clearTimeout(hoverFadeTimer)
    hoverFadeTimer = null
  }
}

function scheduleHoverClear() {
  cancelScheduledClear()

  hoverFadeTimer = window.setTimeout(() => {
    let keepUpTo = -1
    for (let i = 0; i < hoverStack.length; i++) {
      const win = getPopoverWindow(hoverStack[i])
      if (win && win === activeHoverWindow) {
        keepUpTo = i
      }
    }
    fadeHoverStackFrom(keepUpTo + 1)
  }, POPUP_FADE_DELAY)
}

function getHeaderOffset() {
  const nav = document.querySelector(".shomo-top-nav") as HTMLElement | null
  const navBottom = nav?.getBoundingClientRect().bottom ?? 0
  return Math.max(20, navBottom + 18)
}

function clamp(value: number, min: number, max: number) {
  if (max <= min) {
    return min
  }

  return Math.min(Math.max(value, min), max)
}

function getPopoverWindow(popover: HTMLElement) {
  return popover.querySelector(".popover-window") as HTMLElement | null
}

function getDefaultPopoverMetrics(popover: HTMLElement) {
  const previewKind = getPopoverWindow(popover)?.dataset.previewKind
  if (previewKind === "document" || previewKind === "media") {
    return { width: 736, height: 528 }
  }

  return { width: 640, height: 464 }
}

function distanceToRectSquared(point: Point, rect: DOMRect) {
  const dx =
    point.x < rect.left ? rect.left - point.x : point.x > rect.right ? point.x - rect.right : 0
  const dy =
    point.y < rect.top ? rect.top - point.y : point.y > rect.bottom ? point.y - rect.bottom : 0
  return dx * dx + dy * dy
}

function getHoveredLinkRect(link: HTMLAnchorElement, spawnPoint: Point) {
  const rects = [...link.getClientRects()]
  if (rects.length === 0) {
    return link.getBoundingClientRect()
  }

  const exactRect = rects.find(
    (rect) =>
      spawnPoint.x >= rect.left &&
      spawnPoint.x <= rect.right &&
      spawnPoint.y >= rect.top &&
      spawnPoint.y <= rect.bottom,
  )

  if (exactRect) {
    return exactRect
  }

  return rects.reduce((best, rect) =>
    distanceToRectSquared(spawnPoint, rect) < distanceToRectSquared(spawnPoint, best) ? rect : best,
  )
}

function getRectOverlapArea(
  a: { left: number; top: number; right: number; bottom: number },
  b: { left: number; top: number; right: number; bottom: number },
) {
  const horizontal = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
  const vertical = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
  return horizontal * vertical
}

function bringToFront(popover: HTMLElement) {
  const windowElement = getPopoverWindow(popover)
  if (!windowElement) {
    return
  }

  zIndexCounter += 1
  windowElement.style.zIndex = String(zIndexCounter)
}

function setPopoverBox(
  popover: HTMLElement,
  { left, top, width, height }: { left: number; top: number; width?: number; height?: number },
) {
  const windowElement = getPopoverWindow(popover)
  if (!windowElement) {
    return
  }

  if (width) {
    windowElement.style.width = `${Math.round(width)}px`
  } else {
    windowElement.style.removeProperty("width")
  }

  if (height) {
    windowElement.style.height = `${Math.round(height)}px`
  } else {
    windowElement.style.removeProperty("height")
  }

  windowElement.style.left = `${Math.round(left)}px`
  windowElement.style.top = `${Math.round(top)}px`
}

function chooseAnchoredBox(
  link: HTMLAnchorElement,
  popover: HTMLElement,
  parentPopover?: HTMLElement | null,
  spawnPoint?: Point | null,
) {
  const windowElement = getPopoverWindow(popover)
  if (!windowElement) {
    return null
  }

  const pointer = spawnPoint ?? getSpawnPoint(link)
  const linkRect = getHoveredLinkRect(link, pointer)
  const parentWindow = parentPopover ? getPopoverWindow(parentPopover) : null
  const parentRect = parentWindow?.getBoundingClientRect() ?? null
  const defaults = getDefaultPopoverMetrics(popover)
  const width = windowElement.offsetWidth || defaults.width
  const height = windowElement.offsetHeight || defaults.height
  const safeTop = getHeaderOffset()
  const horizontalPadding = 18
  const verticalPadding = 24
  const safeRight = window.innerWidth - horizontalPadding
  const safeBottom = window.innerHeight - verticalPadding
  const maxLeft = Math.max(horizontalPadding, safeRight - width)
  const maxTop = Math.max(safeTop, safeBottom - height)
  const clampedPoint = {
    x: clamp(pointer.x, linkRect.left, linkRect.right),
    y: clamp(pointer.y, linkRect.top, linkRect.bottom),
  }
  const preferredTop = clamp(
    clampedPoint.y - (clampedPoint.y / Math.max(window.innerHeight, 1)) * height,
    safeTop,
    maxTop,
  )

  const candidates = [
    {
      kind: "right",
      left: linkRect.right + 18,
      top: preferredTop,
      penalty: 0,
    },
    {
      kind: "left",
      left: linkRect.left - width - 18,
      top: preferredTop,
      penalty: 14,
    },
    {
      kind: "below",
      left: clampedPoint.x - width / 2,
      top: linkRect.bottom + 16,
      penalty: 220,
    },
    {
      kind: "center",
      left: clampedPoint.x - width / 2,
      top: safeTop + Math.max(22, (safeBottom - safeTop - height) / 2),
      penalty: 420,
    },
  ]

  const bestCandidate = candidates.reduce((best, candidate) => {
    const clampedLeft = clamp(candidate.left, horizontalPadding, maxLeft)
    const clampedTop = clamp(candidate.top, safeTop, maxTop)
    const overflow =
      Math.max(0, horizontalPadding - candidate.left) +
      Math.max(0, candidate.left + width - safeRight) +
      Math.max(0, safeTop - candidate.top) +
      Math.max(0, candidate.top + height - safeBottom)
    const overlap = parentRect
      ? getRectOverlapArea(
          {
            left: clampedLeft,
            top: clampedTop,
            right: clampedLeft + width,
            bottom: clampedTop + height,
          },
          parentRect,
        )
      : 0
    const score = candidate.penalty + overflow * 120 + overlap / 120

    if (!best || score < best.score) {
      return { ...candidate, left: clampedLeft, top: clampedTop, score }
    }

    return best
  }, null as (typeof candidates)[number] & { score: number } | null)

  if (!bestCandidate) {
    return null
  }

  return {
    left: bestCandidate.left,
    top: bestCandidate.top,
  }
}

function applyAnchoredPlacement(popover: HTMLElement) {
  const state = popoverStates.get(popover)
  if (!state) {
    return
  }

  const box = chooseAnchoredBox(state.trigger, popover, state.parentPopover, state.spawnPoint)
  if (!box) {
    return
  }

  setPopoverBox(popover, box)
}

function applyCenteredPlacement(popover: HTMLElement) {
  const windowElement = getPopoverWindow(popover)
  if (!windowElement) {
    return
  }

  const defaults = getDefaultPopoverMetrics(popover)
  const width = Math.min(windowElement.offsetWidth || defaults.width, window.innerWidth - 24)
  const height = Math.min(
    windowElement.offsetHeight || defaults.height,
    window.innerHeight - getHeaderOffset() - 24,
  )
  const left = Math.max(12, (window.innerWidth - width) / 2)
  const top = Math.max(getHeaderOffset(), (window.innerHeight - height) / 2)

  setPopoverBox(popover, { left, top, width, height })
}

function applyMaximizedPlacement(popover: HTMLElement) {
  const previewKind = getPopoverWindow(popover)?.dataset.previewKind
  const maxWidth = Math.min(previewKind === "text" ? 1040 : 1160, window.innerWidth - 40)
  const maxHeight = Math.min(
    window.innerHeight - getHeaderOffset() - 28,
    Math.round(window.innerHeight * (previewKind === "text" ? 0.82 : 0.86)),
  )
  const left = Math.max(20, (window.innerWidth - maxWidth) / 2)
  const top = Math.max(getHeaderOffset(), (window.innerHeight - maxHeight) / 2)

  setPopoverBox(popover, { left, top, width: maxWidth, height: maxHeight })
}

function reflowPopover(popover: HTMLElement) {
  const state = popoverStates.get(popover)
  if (!state) {
    return
  }

  if (state.modal) {
    applyCenteredPlacement(popover)
    return
  }

  if (state.maximized) {
    applyMaximizedPlacement(popover)
    return
  }

  if (!state.pinned) {
    applyAnchoredPlacement(popover)
    return
  }

  const windowElement = getPopoverWindow(popover)
  if (!windowElement) {
    return
  }

  const rect = windowElement.getBoundingClientRect()
  const safeTop = getHeaderOffset()
  const left = clamp(rect.left, 18, Math.max(18, window.innerWidth - rect.width - 18))
  const top = clamp(rect.top, safeTop, Math.max(safeTop, window.innerHeight - rect.height - 18))
  setPopoverBox(popover, { left, top, width: rect.width, height: rect.height })
}

function reflowOpenPopovers() {
  for (const popover of hoverStack) {
    reflowPopover(popover)
  }

  if (modalPopover) {
    reflowPopover(modalPopover)
  }

  pinnedPopovers.forEach((popover) => {
    reflowPopover(popover)
  })
}

function setPinned(popover: HTMLElement, pinned: boolean) {
  const state = popoverStates.get(popover)
  if (!state) {
    return
  }

  state.pinned = pinned
  popover.classList.toggle("is-pinned", pinned)

  if (pinned) {
    pinnedPopovers.set(state.key, popover)
    const stackIndex = hoverStack.indexOf(popover)
    if (stackIndex !== -1) {
      hoverStack.splice(stackIndex, 1)
    }
    bringToFront(popover)
    return
  }

  pinnedPopovers.delete(state.key)
  if (!state.modal) {
    hoverStack.push(popover)
    scheduleHoverClear()
  }
}

function setMaximized(popover: HTMLElement, maximized: boolean) {
  const state = popoverStates.get(popover)
  const windowElement = getPopoverWindow(popover)
  if (!state || !windowElement || state.modal) {
    return
  }

  if (maximized) {
    const rect = windowElement.getBoundingClientRect()
    state.restoreBox = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    state.maximized = true
    popover.classList.add("is-maximized")
    setPinned(popover, true)
    applyMaximizedPlacement(popover)
    return
  }

  state.maximized = false
  popover.classList.remove("is-maximized")

  if (state.restoreBox) {
    setPopoverBox(popover, state.restoreBox)
  } else {
    applyAnchoredPlacement(popover)
  }
}

function removePopoverImmediate(popover: HTMLElement) {
  const windowElement = getPopoverWindow(popover)
  const state = popoverStates.get(popover)
  if (state) {
    pinnedPopovers.delete(state.key)
    popoverStates.delete(popover)
  }
  const stackIndex = hoverStack.indexOf(popover)
  if (stackIndex !== -1) {
    hoverStack.splice(stackIndex, 1)
  }
  if (modalPopover === popover) {
    modalPopover = null
  }
  if (windowElement && activeHoverWindow === windowElement) {
    activeHoverWindow = null
  }
  popover.remove()
}

function fadeOutPopover(popover: HTMLElement) {
  if (popover.classList.contains("popover-fading")) {
    return
  }
  popover.classList.add("popover-fading")
  window.setTimeout(() => {
    removePopoverImmediate(popover)
  }, POPUP_FADE_DURATION)
}

function closePopover(popover: HTMLElement, { animate = false }: { animate?: boolean } = {}) {
  const state = popoverStates.get(popover)
  if (!state) {
    popover.remove()
    return
  }

  if (animate && !state.pinned && !state.modal) {
    fadeOutPopover(popover)
    return
  }

  removePopoverImmediate(popover)
}

function fadeHoverStackFrom(index: number) {
  const toClose = hoverStack.splice(index)
  for (let i = toClose.length - 1; i >= 0; i--) {
    const popover = toClose[i]
    const state = popoverStates.get(popover)
    if (state?.pinned || state?.modal) {
      continue
    }
    fadeOutPopover(popover)
  }
}

function closeHoverStackFrom(index: number) {
  const toClose = hoverStack.splice(index)
  for (let i = toClose.length - 1; i >= 0; i--) {
    const popover = toClose[i]
    const state = popoverStates.get(popover)
    if (state?.pinned || state?.modal) {
      continue
    }
    removePopoverImmediate(popover)
  }
}

function getHoverChain(popover: HTMLElement) {
  const chain: HTMLElement[] = []
  let current: HTMLElement | null = popover

  while (current) {
    const state = popoverStates.get(current)
    if (!state?.modal && !state?.pinned) {
      chain.unshift(current)
    }
    current = state?.parentPopover ?? null
  }

  return chain
}

function syncHoverStackToPopover(popover: HTMLElement) {
  const keep = new Set(getHoverChain(popover))
  const stale = hoverStack.filter((item) => !keep.has(item))
  const nextStack = hoverStack.filter((item) => keep.has(item))

  hoverStack.splice(0, hoverStack.length, ...nextStack)

  for (let i = stale.length - 1; i >= 0; i--) {
    closePopover(stale[i], { animate: true })
  }
}

function closeAllPopovers() {
  closeHoverStackFrom(0)

  if (modalPopover) {
    removePopoverImmediate(modalPopover)
  }

  ;[...pinnedPopovers.values()].forEach((popover) => {
    removePopoverImmediate(popover)
  })
}

function clearMarginNoteEmphasis() {
  if (emphasisTimer !== null) {
    window.clearTimeout(emphasisTimer)
    emphasisTimer = null
  }

  document.querySelectorAll(".shomo-margin-note.is-emphasized").forEach((note) => {
    note.classList.remove("is-emphasized")
  })
}

function highlightMarginNote(link: HTMLAnchorElement) {
  const noteIndex = link.dataset.marginNoteIndex
  if (!noteIndex) {
    return
  }

  const card = document.querySelector(
    `.shomo-margin-note[data-margin-note-index="${noteIndex}"]`,
  ) as HTMLElement | null
  if (!card) {
    return
  }

  clearMarginNoteEmphasis()
  card.classList.add("is-emphasized")
  card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })

  emphasisTimer = window.setTimeout(() => {
    card.classList.remove("is-emphasized")
  }, 1200)
}

function fallbackTitle(link: HTMLAnchorElement, targetUrl: URL) {
  const linkText = link.textContent?.trim()
  if (linkText) {
    return linkText
  }

  const segment = targetUrl.pathname.split("/").filter(Boolean).at(-1)
  return segment ? decodeURIComponent(segment) : "Preview"
}

function namespaceIds(html: Document) {
  html.querySelectorAll("[id]").forEach((element) => {
    element.id = `popover-internal-${element.id}`
  })

  html.querySelectorAll("a[href^='#']").forEach((link) => {
    const href = link.getAttribute("href")
    if (!href || href === "#") {
      return
    }

    link.setAttribute("href", `#popover-internal-${href.slice(1)}`)
  })
}

function collectPreviewBody(html: Document) {
  const wrapper = document.createElement("div")
  const headerHint = html.querySelector(".page-header .popover-hint")
  const articleHint = html.querySelector(".center > article.popover-hint, article.popover-hint")
  const folderHint = html.querySelector(".shomo-folder")
  const sidenoteHint = html.querySelector(".sidenote-fragment")

  if (headerHint) {
    ;[...headerHint.children].forEach((child) => {
      wrapper.appendChild(document.importNode(child, true))
    })
  }

  const contentNode = sidenoteHint ?? articleHint ?? folderHint
  if (contentNode) {
    wrapper.appendChild(document.importNode(contentNode, true))
  }

  if (!contentNode && !headerHint) {
    const previewNodes = [...html.getElementsByClassName("popover-hint")]
    previewNodes.forEach((node) => wrapper.appendChild(document.importNode(node, true)))
  }

  return wrapper.innerHTML.trim()
}

async function loadPreview(link: HTMLAnchorElement) {
  const { targetUrl } = getPreviewTarget(link)
  const key = getPreviewKey(targetUrl)

  if (previewCache.has(key)) {
    return previewCache.get(key) ?? null
  }

  const response = await fetchCanonical(targetUrl).catch((error) => {
    console.error(error)
    return null
  })

  if (!response) {
    return null
  }

  const [contentType = "text/html"] = (response.headers.get("Content-Type") ?? "text/html").split(";")
  const [contentTypeCategory, typeInfo] = contentType.split("/")
  let payload: PreviewPayload | null = null

  switch (contentTypeCategory) {
    case "image":
      payload = {
        key,
        title: fallbackTitle(link, targetUrl),
        contentType,
        mediaSrc: targetUrl.toString(),
        linkHref: link.dataset.sidenote === "true" ? null : link.href,
      }
      break
    case "application":
      if (typeInfo === "pdf") {
        payload = {
          key,
          title: fallbackTitle(link, targetUrl),
          contentType,
          mediaSrc: targetUrl.toString(),
          linkHref: link.dataset.sidenote === "true" ? null : link.href,
        }
      }
      break
    default: {
      const html = parser.parseFromString(await response.text(), "text/html")
      normalizeRelativeURLs(html, targetUrl)
      namespaceIds(html)

      const title =
        html.querySelector(".sidenote-fragment__header h2")?.textContent?.trim() ??
        html.querySelector(".article-title h1")?.textContent?.trim() ??
        html.querySelector("h1")?.textContent?.trim() ??
        fallbackTitle(link, targetUrl)

      const bodyHTML = collectPreviewBody(html)
      if (!bodyHTML) {
        return null
      }

      payload = {
        key,
        title,
        contentType,
        bodyHTML,
        linkHref: link.dataset.sidenote === "true" ? null : link.href,
      }
      break
    }
  }

  if (!payload) {
    return null
  }

  previewCache.set(key, payload)
  return payload
}

function isWikipediaLink(link: HTMLAnchorElement): boolean {
  try {
    const url = new URL(link.href)
    return url.hostname.endsWith(".wikipedia.org") && url.pathname.startsWith("/wiki/")
  } catch {
    return false
  }
}

function getWikipediaInfo(link: HTMLAnchorElement) {
  const url = new URL(link.href)
  const lang = url.hostname.split(".")[0]
  const title = decodeURIComponent(url.pathname.replace("/wiki/", ""))
  return { lang, title, url }
}

function absolutizeWikipediaURLs(el: Element | Document, destination: string | URL) {
  el.querySelectorAll("[href]").forEach((item) => {
    const href = item.getAttribute("href")
    if (!href || href.startsWith("#")) {
      return
    }

    item.setAttribute("href", new URL(href, destination).toString())
  })

  el.querySelectorAll("[src]").forEach((item) => {
    const src = item.getAttribute("src")
    if (!src) {
      return
    }

    item.setAttribute("src", new URL(src, destination).toString())
  })
}

function extractWikipediaLeadHTML(html: Document) {
  const wrapper = document.createElement("div")
  const paragraphs = [
    ...html.querySelectorAll("body > section p, section p, .mw-parser-output > p, body p"),
  ].filter((paragraph) => {
    const text = paragraph.textContent?.trim() ?? ""
    return text.length > 40 && !paragraph.closest("table, figure, style, script")
  })

  for (const paragraph of paragraphs.slice(0, 2)) {
    wrapper.appendChild(document.importNode(paragraph, true))
  }

  wrapper.querySelectorAll("sup, .mw-editsection").forEach((node) => node.remove())
  return wrapper.innerHTML.trim()
}

async function loadWikipediaPreview(link: HTMLAnchorElement): Promise<PreviewPayload | null> {
  const { lang, title, url } = getWikipediaInfo(link)
  const canonicalKey = `${url.origin}${url.pathname}`.replace(/\/$/, "")

  if (previewCache.has(canonicalKey)) {
    return previewCache.get(canonicalKey) ?? null
  }

  const apiUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  const articleHtmlUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title)}`
  const [response, articleHtmlResponse] = await Promise.all([
    fetch(apiUrl, {
      headers: { Accept: "application/json; charset=utf-8" },
    }).catch(() => null),
    fetch(articleHtmlUrl, {
      headers: { Accept: "text/html; charset=utf-8" },
    }).catch(() => null),
  ])

  if (!response || !response.ok) {
    return null
  }

  const data = await response.json().catch(() => null)
  if (!data || !data.extract_html) {
    return null
  }

  const canonicalHref = data.content_urls?.desktop?.page ?? url.href
  let leadHTML = ""
  if (articleHtmlResponse?.ok) {
    const articleHtml = parser.parseFromString(await articleHtmlResponse.text(), "text/html")
    normalizeRelativeURLs(articleHtml, new URL(canonicalHref))
    absolutizeWikipediaURLs(articleHtml, canonicalHref)
    leadHTML = extractWikipediaLeadHTML(articleHtml)
  }

  if (!leadHTML) {
    const html = parser.parseFromString(data.extract_html, "text/html")
    normalizeRelativeURLs(html, new URL(canonicalHref))
    absolutizeWikipediaURLs(html, canonicalHref)
    leadHTML = html.body.innerHTML
  }

  let bodyHTML = ""
  if (data.thumbnail?.source) {
    bodyHTML += `<div style="float:right;margin:0 0 0.8rem 1rem;max-width:200px"><img src="${data.thumbnail.source}" alt="${data.title}" style="width:100%;height:auto;display:block" /></div>`
  }
  bodyHTML += leadHTML

  const payload: PreviewPayload = {
    key: canonicalKey,
    title: data.title ?? title,
    contentType: "text/html",
    bodyHTML,
    linkHref: canonicalHref,
  }

  previewCache.set(canonicalKey, payload)
  return payload
}

function scrollPreviewToHash(popover: HTMLElement, hash: string) {
  if (!hash) {
    return
  }

  const inner = popover.querySelector(".popover-inner") as HTMLElement | null
  const target = inner?.querySelector(`#popover-internal-${hash.slice(1)}`) as HTMLElement | null
  if (!inner || !target) {
    return
  }

  inner.scroll({ top: Math.max(0, target.offsetTop - 18), behavior: "instant" })
}

function startDrag(popover: HTMLElement, event: MouseEvent) {
  const state = popoverStates.get(popover)
  const windowElement = getPopoverWindow(popover)
  if (!state || !windowElement || state.modal || state.maximized) {
    return
  }

  const dragWindow = windowElement

  if (!state.pinned) {
    setPinned(popover, true)
  }

  const rect = dragWindow.getBoundingClientRect()
  const offsetX = event.clientX - rect.left
  const offsetY = event.clientY - rect.top

  function handleMove(moveEvent: MouseEvent) {
    const width = dragWindow.offsetWidth
    const height = dragWindow.offsetHeight
    const left = clamp(moveEvent.clientX - offsetX, 18, Math.max(18, window.innerWidth - width - 18))
    const top = clamp(
      moveEvent.clientY - offsetY,
      getHeaderOffset(),
      Math.max(getHeaderOffset(), window.innerHeight - height - 18),
    )

    setPopoverBox(popover, { left, top, width, height })
  }

  function stopDrag() {
    document.removeEventListener("mousemove", handleMove)
    document.removeEventListener("mouseup", stopDrag)
  }

  bringToFront(popover)
  document.addEventListener("mousemove", handleMove)
  document.addEventListener("mouseup", stopDrag)
}

function createPopoverIcon(kind: "pin" | "maximize" | "restore" | "close") {
  const svg = document.createElementNS(svgNamespace, "svg")
  svg.setAttribute("viewBox", "0 0 16 16")
  svg.setAttribute("aria-hidden", "true")

  const addPath = (d: string) => {
    const path = document.createElementNS(svgNamespace, "path")
    path.setAttribute("d", d)
    svg.appendChild(path)
  }

  switch (kind) {
    case "pin":
      addPath("M4 3h8")
      addPath("M8 3v5")
      addPath("M5 8l3 2 3-2")
      addPath("M8 10v3")
      break
    case "maximize":
      addPath("M3 3h10v10H3z")
      break
    case "restore":
      addPath("M5 3h8v8")
      addPath("M3 5h8v8H3z")
      break
    case "close":
      addPath("M4 4l8 8")
      addPath("M12 4l-8 8")
      break
  }

  return svg
}

function setButtonIcon(button: HTMLButtonElement, kind: "pin" | "maximize" | "restore" | "close") {
  button.replaceChildren(createPopoverIcon(kind))
}

function setCollapsed(popover: HTMLElement, collapsed: boolean) {
  const state = popoverStates.get(popover)
  if (!state) {
    return
  }
  state.collapsed = collapsed
  popover.classList.toggle("is-collapsed", collapsed)
}

function buildPopover(
  payload: PreviewPayload,
  trigger: HTMLAnchorElement,
  spawnPoint: Point | null,
  hash: string,
  modal: boolean,
  parentPopover: HTMLElement | null,
) {
  const popover = document.createElement("div")
  popover.className = modal ? "popover is-modal active-popover" : "popover active-popover"

  const windowElement = document.createElement("section")
  windowElement.className = "popover-window"
  windowElement.dataset.previewKind =
    payload.contentType.startsWith("image/")
      ? "media"
      : payload.contentType.includes("pdf")
        ? "document"
        : "text"

  const chrome = document.createElement("div")
  chrome.className = "popover-chrome"

  const title = payload.linkHref
    ? Object.assign(document.createElement("a"), {
        className: "popover-title",
        href: payload.linkHref,
        textContent: payload.title,
      })
    : Object.assign(document.createElement("span"), {
        className: "popover-title",
        textContent: payload.title,
      })

  const actions = document.createElement("div")
  actions.className = "popover-actions"

  const closeButton = document.createElement("button")
  closeButton.type = "button"
  closeButton.className = "popover-action popover-action--close"
  closeButton.setAttribute("aria-label", "Close preview")
  setButtonIcon(closeButton, "close")

  const maximizeButton = document.createElement("button")
  maximizeButton.type = "button"
  maximizeButton.className = "popover-action popover-action--maximize"
  maximizeButton.setAttribute("aria-label", "Maximize preview")
  setButtonIcon(maximizeButton, "maximize")

  const pinButton = document.createElement("button")
  pinButton.type = "button"
  pinButton.className = "popover-action popover-action--pin"
  pinButton.setAttribute("aria-label", "Pin preview")
  setButtonIcon(pinButton, "pin")

  actions.append(closeButton, maximizeButton, pinButton)
  chrome.append(actions, title)

  const inner = document.createElement("div")
  inner.className = "popover-inner"
  inner.dataset.contentType = payload.contentType

  if (payload.contentType.startsWith("image/") && payload.mediaSrc) {
    const img = document.createElement("img")
    img.src = payload.mediaSrc
    img.alt = payload.title
    inner.appendChild(img)
  } else if (payload.contentType.includes("pdf") && payload.mediaSrc) {
    const iframe = document.createElement("iframe")
    iframe.src = payload.mediaSrc
    inner.appendChild(iframe)
  } else if (payload.bodyHTML) {
    inner.innerHTML = payload.bodyHTML
  }

  windowElement.append(chrome, inner)
  popover.appendChild(windowElement)
  document.body.appendChild(popover)

  const state: PopoverState = {
    key: payload.key,
    trigger,
    spawnPoint,
    hash,
    pinned: false,
    maximized: false,
    collapsed: false,
    modal,
    parentPopover,
  }

  popoverStates.set(popover, state)
  bringToFront(popover)

  if (modal) {
    modalPopover = popover
  } else {
    hoverStack.push(popover)
  }

  pinButton.addEventListener("click", (event) => {
    event.preventDefault()
    event.stopPropagation()
    setPinned(popover, !state.pinned)
    pinButton.setAttribute("aria-label", state.pinned ? "Unpin preview" : "Pin preview")
  })

  maximizeButton.addEventListener("click", (event) => {
    event.preventDefault()
    event.stopPropagation()
    setMaximized(popover, !state.maximized)
    maximizeButton.setAttribute("aria-label", state.maximized ? "Restore preview" : "Maximize preview")
    setButtonIcon(maximizeButton, state.maximized ? "restore" : "maximize")
  })

  closeButton.addEventListener("click", (event) => {
    event.preventDefault()
    event.stopPropagation()
    const idx = hoverStack.indexOf(popover)
    if (idx !== -1) {
      closeHoverStackFrom(idx)
    } else {
      closePopover(popover)
    }
  })

  chrome.addEventListener("mousedown", (event) => {
    const target = event.target as HTMLElement | null
    if (target?.closest("button, a")) {
      return
    }

    startDrag(popover, event)
  })

  chrome.addEventListener("dblclick", (event) => {
    const target = event.target as HTMLElement | null
    if (target?.closest("button, a")) {
      return
    }
    setCollapsed(popover, !state.collapsed)
  })

  windowElement.addEventListener("mouseenter", () => {
    activeHoverWindow = windowElement
    cancelScheduledClear()
  })

  windowElement.addEventListener("mouseleave", () => {
    if (activeHoverWindow === windowElement) {
      activeHoverWindow = null
    }
    if (!state.pinned && !state.modal) {
      scheduleHoverClear()
    }
  })

  windowElement.addEventListener("mousedown", () => bringToFront(popover))

  if (modal) {
    popover.addEventListener("click", (event) => {
      if (event.target === popover) {
        closePopover(popover)
      }
    })
  }

  if (modal) {
    pinButton.hidden = true
    maximizeButton.hidden = true
    applyCenteredPlacement(popover)
  } else {
    applyAnchoredPlacement(popover)
    window.requestAnimationFrame(() => {
      const currentState = popoverStates.get(popover)
      if (currentState && !currentState.pinned && !currentState.modal && !currentState.maximized) {
        applyAnchoredPlacement(popover)
      }
    })
  }

  attachPopoverListeners(inner)
  scrollPreviewToHash(popover, hash)
  return popover
}

function attachPopoverListeners(container: HTMLElement | Document) {
  const internalLinks = [...container.querySelectorAll("a.internal")] as HTMLAnchorElement[]
  const wikiLinks = ([...container.querySelectorAll("a[href]")] as HTMLAnchorElement[]).filter(
    (a) => !a.classList.contains("internal") && isWikipediaLink(a),
  )
  for (const link of [...internalLinks, ...wikiLinks]) {
    link.addEventListener("mouseenter", handlePointerEnter)
    link.addEventListener("mousemove", handlePointerMove)
    link.addEventListener("mouseleave", handlePointerLeave)
    link.addEventListener("focus", handleFocus)
    link.addEventListener("click", handleClick)
  }
}

async function openPreview(link: HTMLAnchorElement, { modal }: { modal: boolean }) {
  const isWiki = isWikipediaLink(link)
  const payload = isWiki ? await loadWikipediaPreview(link) : await loadPreview(link)
  if (!payload) {
    return
  }

  const hash = isWiki ? "" : getPreviewTarget(link).hash
  const spawnPoint = modal ? null : getSpawnPoint(link)
  const parentPopover = modal ? null : (link.closest(".popover") as HTMLElement | null)
  const pinnedPopover = pinnedPopovers.get(payload.key)
  if (pinnedPopover) {
    const state = popoverStates.get(pinnedPopover)
    if (state) {
      state.hash = hash
      state.trigger = link
      state.spawnPoint = spawnPoint
      state.parentPopover = parentPopover
    }

    bringToFront(pinnedPopover)
    if (!state?.modal && !state?.maximized) {
      applyAnchoredPlacement(pinnedPopover)
    }
    scrollPreviewToHash(pinnedPopover, hash)
    return
  }

  if (modal && modalPopover) {
    closePopover(modalPopover)
  }

  const popover = buildPopover(payload, link, spawnPoint, hash, modal, parentPopover)
  if (!modal) {
    syncHoverStackToPopover(popover)
  }
}

function handlePointerEnter(this: HTMLAnchorElement, event: MouseEvent) {
  if (this.dataset.noPopover === "true" || usesDesktopMarginNotes(this) || !canHoverPreview()) {
    return
  }

  setSpawnPoint(this, event.clientX, event.clientY)
  cancelScheduledClear()
  schedulePreviewSpawn(this)
}

function handlePointerMove(this: HTMLAnchorElement, event: MouseEvent) {
  if (this.dataset.noPopover === "true" || usesDesktopMarginNotes(this) || !canHoverPreview()) {
    return
  }

  setSpawnPoint(this, event.clientX, event.clientY)
}

function handlePointerLeave(this: HTMLAnchorElement) {
  if (this.dataset.noPopover === "true" || usesDesktopMarginNotes(this) || !canHoverPreview()) {
    return
  }

  clearSpawnTimer(this)
  scheduleHoverClear()
}

function handleFocus(this: HTMLAnchorElement) {
  if (this.dataset.noPopover === "true" || usesDesktopMarginNotes(this) || isTouchPreviewLayout()) {
    return
  }

  const rect = this.getBoundingClientRect()
  setSpawnPoint(this, rect.left + rect.width / 2, rect.top + rect.height / 2)
  clearSpawnTimer(this)
  cancelScheduledClear()
  void openPreview(this, { modal: false })
}

function handleClick(this: HTMLAnchorElement, event: MouseEvent) {
  if (this.dataset.noPopover === "true") {
    return
  }

  clearSpawnTimer(this)

  if (usesDesktopMarginNotes(this)) {
    event.preventDefault()
    highlightMarginNote(this)
    return
  }

  if (isWikipediaLink(this)) {
    if (isTouchPreviewLayout()) {
      event.preventDefault()
      cancelScheduledClear()
      void openPreview(this, { modal: true })
    }
    return
  }

  if (this.dataset.sidenote === "true" || isTouchPreviewLayout()) {
    event.preventDefault()
    cancelScheduledClear()
    void openPreview(this, { modal: isTouchPreviewLayout() })
  }
}

document.addEventListener("click", (event) => {
  const target = event.target as Node | null
  const targetElement =
    target instanceof Element ? target : (target?.parentElement as Element | null | undefined)

  if (targetElement?.closest(".popover-window, a.internal")) {
    return
  }

  const anchorEl = targetElement?.closest("a[href]") as HTMLAnchorElement | null
  if (anchorEl && isWikipediaLink(anchorEl)) {
    return
  }

  if (hoverStack.length > 0) {
    closeHoverStackFrom(0)
  }
})

document.addEventListener("keydown", (event) => {
  if (!event.key.startsWith("Esc")) {
    return
  }

  if (modalPopover) {
    closePopover(modalPopover)
    return
  }

  if (hoverStack.length > 0) {
    const topmost = hoverStack[hoverStack.length - 1]
    const idx = hoverStack.indexOf(topmost)
    if (idx !== -1) {
      closeHoverStackFrom(idx)
    }
  }
})

window.addEventListener("resize", () => {
  clearMarginNoteEmphasis()
  reflowOpenPopovers()
})

document.addEventListener("nav", () => {
  cancelScheduledClear()
  clearMarginNoteEmphasis()
  closeAllPopovers()

  attachPopoverListeners(document)
  const internalLinks = [...document.querySelectorAll("a.internal")] as HTMLAnchorElement[]
  const wikiLinks = ([...document.querySelectorAll("a[href]")] as HTMLAnchorElement[]).filter(
    (a) => !a.classList.contains("internal") && isWikipediaLink(a),
  )
  for (const link of [...internalLinks, ...wikiLinks]) {
    window.addCleanup(() => {
      clearSpawnTimer(link)
      link.removeEventListener("mouseenter", handlePointerEnter)
      link.removeEventListener("mousemove", handlePointerMove)
      link.removeEventListener("mouseleave", handlePointerLeave)
      link.removeEventListener("focus", handleFocus)
      link.removeEventListener("click", handleClick)
    })
  }
})
