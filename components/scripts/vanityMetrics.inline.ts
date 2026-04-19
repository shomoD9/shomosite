/*
This script restores the homepage Reach Report count-up animation using the
pre-rendered build snapshot already in the DOM. It does not fetch data; it only
animates the rendered totals when the section becomes visible.
*/

const fmt = new Intl.NumberFormat("en-US")
const DURATION = 1100

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function parseNumber(value: string): number | null {
  const digits = value.replace(/[^0-9]/g, "")
  return digits.length > 0 ? Number.parseInt(digits, 10) : null
}

document.addEventListener("nav", () => {
  const section = document.querySelector<HTMLElement>(".vanity-metrics")
  if (!section) return

  const shouldReduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches
  if (shouldReduceMotion) {
    return
  }

  const entries = [...section.querySelectorAll<HTMLElement>(".vanity-metrics__num")]
    .map((element) => {
      const target = parseNumber(element.textContent ?? "")
      if (target === null) {
        return null
      }

      return { element, target }
    })
    .filter((entry): entry is { element: HTMLElement; target: number } => entry !== null)

  if (entries.length === 0) return

  let destroyed = false
  let animated = false

  entries.forEach((entry) => {
    entry.element.textContent = fmt.format(0)
  })

  function renderProgress(progress: number) {
    const eased = easeOutCubic(progress)

    entries.forEach((entry) => {
      entry.element.textContent = fmt.format(Math.round(entry.target * eased))
    })
  }

  function renderFinalState() {
    entries.forEach((entry) => {
      entry.element.textContent = fmt.format(entry.target)
    })
  }

  function startAnimation() {
    if (destroyed || animated) {
      return
    }

    animated = true
    const startTime = performance.now()

    function tick(now: number) {
      if (destroyed) return

      const elapsed = now - startTime
      const progress = Math.min(elapsed / DURATION, 1)
      renderProgress(progress)

      if (progress < 1) {
        requestAnimationFrame(tick)
        return
      }

      renderFinalState()
    }

    requestAnimationFrame(tick)
  }

  const observer = new IntersectionObserver(
    (observerEntries) => {
      if (!(observerEntries[0]?.isIntersecting ?? false)) {
        return
      }

      observer.disconnect()
      startAnimation()
    },
    { threshold: 0.35 },
  )

  observer.observe(section)
  window.addCleanup(() => {
    destroyed = true
    observer.disconnect()
  })
})
