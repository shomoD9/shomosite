/*
This client script hydrates prose sidenotes into right-margin notes on desktop.
It exists separately because the source markdown only knows about local
`[[notes/...]]` links, while the rendered page needs positioned note cards that
track those references in the reading gutter. It talks to the staged sidenote
fragments, to the prose article content, and to the margin-note rail placeholder.
*/

const parser = new DOMParser()
const DESKTOP_MARGIN_NOTES_MIN_WIDTH = 1080
const NOTE_GAP = 18
const LAYOUT_DEBOUNCE_MS = 80

let resizeTimer: number | null = null
let renderGeneration = 0
let articleResizeObserver: ResizeObserver | null = null

type LoadedMarginNote = {
  body: string
}

function truncateForTitle(text: string, maxWords = 8, edgeWords = 3): string {
  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords) {
    return text.trim()
  }
  return `${words.slice(0, edgeWords).join(" ")} \u2026 ${words.slice(-edgeWords).join(" ")}`
}

const loadedNotes = new Map<string, LoadedMarginNote>()

function clearScheduledLayout() {
  if (resizeTimer !== null) {
    window.clearTimeout(resizeTimer)
    resizeTimer = null
  }
}

function nextAnimationFrame(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve())
  })
}

async function waitForStableLayout() {
  // Fonts and Quartz SPA navigation can both move link boxes after `nav` fires,
  // so note geometry is read only after font readiness and two paint cycles.
  await document.fonts?.ready.catch(() => undefined)
  await nextAnimationFrame()
  await nextAnimationFrame()
}

function getFirstLineRect(link: HTMLAnchorElement): DOMRect | null {
  // A multi-word sidenote link can wrap across lines. The product contract is
  // to attach the card to the first rendered line, not the whole link box.
  for (const rect of link.getClientRects()) {
    if (rect.width > 0 && rect.height > 0) {
      return rect
    }
  }

  const fallbackRect = link.getBoundingClientRect()
  if (fallbackRect.width > 0 && fallbackRect.height > 0) {
    return fallbackRect
  }

  return null
}

async function loadMarginNote(previewPath: string): Promise<LoadedMarginNote | null> {
  if (loadedNotes.has(previewPath)) {
    return loadedNotes.get(previewPath) ?? null
  }

  const response = await fetch(previewPath).catch(() => null)
  if (!response || !response.ok) {
    return null
  }

  const html = parser.parseFromString(await response.text(), "text/html")
  const fragment = html.querySelector(".sidenote-fragment, .popover-hint")
  if (!fragment) {
    return null
  }

  const loaded = { body: fragment.outerHTML }
  loadedNotes.set(previewPath, loaded)
  return loaded
}

async function renderMarginNotes() {
  // Every layout pass owns a generation number. If navigation, resize, or a
  // later observer pass starts while this one is fetching, this pass exits
  // before it can paint stale note positions into the new page geometry.
  const generation = ++renderGeneration
  const rail = document.querySelector(".shomo-margin-notes[data-margin-notes='prose']") as HTMLElement | null
  const canvas = rail?.querySelector(".shomo-margin-notes__canvas") as HTMLElement | null

  if (!rail || !canvas) {
    return
  }

  // Popup previews take over on smaller screens, so the desktop rail should stay empty there.
  if (window.innerWidth <= DESKTOP_MARGIN_NOTES_MIN_WIDTH) {
    canvas.replaceChildren()
    canvas.style.height = ""
    return
  }

  const article = document.querySelector(".center > article.popover-hint") as HTMLElement | null
  if (!article) {
    canvas.replaceChildren()
    canvas.style.height = ""
    return
  }

  const sidenoteLinks = [
    ...article.querySelectorAll("a.sidenote-ref[data-preview]"),
  ] as HTMLAnchorElement[]
  sidenoteLinks.forEach((link) => {
    delete link.dataset.marginNoteIndex
  })

  if (sidenoteLinks.length === 0) {
    canvas.replaceChildren()
    canvas.style.height = `${Math.max(article.offsetHeight, 320)}px`
    return
  }

  // Phase 1: fetch all note content before touching any positions.
  const fetchResults = await Promise.all(
    sidenoteLinks.map(async (link) => {
      const previewPath = link.dataset.preview
      if (!previewPath) {
        return null
      }
      return loadMarginNote(previewPath)
    }),
  )

  if (generation !== renderGeneration) {
    return
  }

  await waitForStableLayout()

  if (generation !== renderGeneration) {
    return
  }

  if (window.innerWidth <= DESKTOP_MARGIN_NOTES_MIN_WIDTH) {
    canvas.replaceChildren()
    canvas.style.height = ""
    return
  }

  if (!article.isConnected || !canvas.isConnected) {
    return
  }

  // Phase 2: record each link's document-absolute first-line position. These
  // numbers are independent of the canvas, so any reflow that moves the
  // canvas between here and paint-time can be absorbed by re-measuring the
  // canvas just-in-time in Phase 3 instead of trusting a stale offset.
  const scrollY = window.scrollY

  type NoteEntry = { index: number; link: HTMLAnchorElement; loaded: LoadedMarginNote; linkDocTop: number }
  const noteCards: NoteEntry[] = []
  for (let i = 0; i < sidenoteLinks.length; i++) {
    const loaded = fetchResults[i]
    if (!loaded) {
      continue
    }
    const link = sidenoteLinks[i]
    if (!link.isConnected) {
      continue
    }

    const linkRect = getFirstLineRect(link)
    if (!linkRect) {
      continue
    }

    noteCards.push({
      index: i,
      link,
      loaded,
      linkDocTop: linkRect.top + scrollY,
    })
  }

  if (noteCards.length === 0) {
    canvas.replaceChildren()
    canvas.style.height = `${Math.max(article.offsetHeight, 320)}px`
    return
  }

  // Phase 3: render cards and position them. The canvas's document position
  // is read now, after any layout changes caused by replacing children, so
  // each note's `top` is computed against the canvas as it actually sits.
  canvas.replaceChildren()
  const canvasDocTop = canvas.getBoundingClientRect().top + window.scrollY

  let previousBottom = 0
  for (const note of noteCards) {
    const card = document.createElement("div")
    card.className = "shomo-margin-note"
    card.dataset.marginNoteIndex = String(note.index + 1)
    note.link.dataset.marginNoteIndex = String(note.index + 1)
    card.innerHTML = note.loaded.body

    const linkText = note.link.textContent?.trim()
    if (linkText) {
      const titleEl = card.querySelector(".sidenote-fragment__header h2")
      if (titleEl) {
        titleEl.textContent = `\u201C${truncateForTitle(linkText)}\u201D`
      }
    }

    canvas.appendChild(card)

    // Exact anchoring wins until it would collide with the prior note; then
    // the later note moves down only enough to keep the margin readable.
    const desiredTop = Math.max(0, note.linkDocTop - canvasDocTop)
    const top = Math.max(desiredTop, previousBottom + NOTE_GAP)
    card.style.top = `${top}px`
    previousBottom = top + card.offsetHeight
  }

  const articleDocTop = article.getBoundingClientRect().top + scrollY
  const articleOffsetTop = articleDocTop - canvasDocTop
  canvas.style.height = `${Math.max(article.offsetHeight + articleOffsetTop, previousBottom + NOTE_GAP + 6)}px`
}

function scheduleMarginNoteLayout() {
  clearScheduledLayout()
  resizeTimer = window.setTimeout(() => {
    void renderMarginNotes()
  }, LAYOUT_DEBOUNCE_MS)
}

function observeArticleLayout() {
  articleResizeObserver?.disconnect()
  articleResizeObserver = null

  if (window.innerWidth <= DESKTOP_MARGIN_NOTES_MIN_WIDTH) {
    return
  }

  const article = document.querySelector(".center > article.popover-hint") as HTMLElement | null
  if (!article) {
    return
  }

  // The article is the thing whose text reflow changes note anchors. Observing
  // the margin canvas would create a loop because rendering cards changes it.
  articleResizeObserver = new ResizeObserver(() => {
    scheduleMarginNoteLayout()
  })
  articleResizeObserver.observe(article)
}

function scheduleObservedMarginNotes() {
  observeArticleLayout()
  scheduleMarginNoteLayout()
}

document.addEventListener("nav", () => {
  scheduleObservedMarginNotes()
  window.addEventListener("resize", scheduleObservedMarginNotes)
  window.addCleanup(() => {
    window.removeEventListener("resize", scheduleObservedMarginNotes)
    articleResizeObserver?.disconnect()
    articleResizeObserver = null
    clearScheduledLayout()
    renderGeneration++
  })
})
