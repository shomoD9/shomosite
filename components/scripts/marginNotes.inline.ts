/*
This client script hydrates prose sidenotes into right-margin notes on desktop.
It exists separately because the source markdown only knows about local
`[[notes/...]]` links, while the rendered page needs positioned note cards that
track those references in the reading gutter. It talks to the staged sidenote
fragments, to the prose article content, and to the margin-note rail placeholder.
*/

const parser = new DOMParser()
let resizeTimer: number | null = null

type LoadedMarginNote = {
  body: string
}

const loadedNotes = new Map<string, LoadedMarginNote>()

function clearScheduledLayout() {
  if (resizeTimer !== null) {
    window.clearTimeout(resizeTimer)
    resizeTimer = null
  }
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
  const rail = document.querySelector(".shomo-margin-notes[data-margin-notes='prose']") as HTMLElement | null
  const canvas = rail?.querySelector(".shomo-margin-notes__canvas") as HTMLElement | null

  if (!rail || !canvas) {
    return
  }

  // Popup previews take over on smaller screens, so the desktop rail should stay empty there.
  if (window.innerWidth <= 1080) {
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

  const articleRect = article.getBoundingClientRect()
  const canvasRect = canvas.getBoundingClientRect()
  const articleOffsetTop = articleRect.top - canvasRect.top
  const notes = await Promise.all(
    sidenoteLinks.map(async (link, index) => {
      const previewPath = link.dataset.preview
      if (!previewPath) {
        return null
      }

      const loaded = await loadMarginNote(previewPath)
      if (!loaded) {
        return null
      }

      return {
        index,
        link,
        loaded,
        // Each note tries to align with its source phrase inside the shared center/right row.
        desiredTop: articleOffsetTop + (link.getBoundingClientRect().top - articleRect.top) - 10,
      }
    }),
  )

  const noteCards = notes.filter((note): note is NonNullable<typeof note> => Boolean(note))
  if (noteCards.length === 0) {
    canvas.replaceChildren()
    canvas.style.height = `${Math.max(article.offsetHeight, 320)}px`
    return
  }

  canvas.replaceChildren()
  canvas.style.height = `${Math.max(article.offsetHeight + articleOffsetTop, 320)}px`

  let previousBottom = 0
  for (const note of noteCards) {
    const card = document.createElement("div")
    card.className = "shomo-margin-note"
    card.dataset.marginNoteIndex = String(note.index + 1)
    note.link.dataset.marginNoteIndex = String(note.index + 1)
    card.innerHTML = note.loaded.body
    canvas.appendChild(card)

    const top = Math.max(note.desiredTop, previousBottom + 18)
    card.style.top = `${top}px`
    previousBottom = top + card.offsetHeight
  }

  canvas.style.height = `${Math.max(article.offsetHeight + articleOffsetTop, previousBottom + 24)}px`
}

function scheduleMarginNoteLayout() {
  clearScheduledLayout()
  resizeTimer = window.setTimeout(() => {
    void renderMarginNotes()
  }, 80)
}

document.addEventListener("nav", () => {
  void renderMarginNotes()
  window.addEventListener("resize", scheduleMarginNoteLayout)
  window.addCleanup(() => window.removeEventListener("resize", scheduleMarginNoteLayout))
})
