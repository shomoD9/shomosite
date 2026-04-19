/*
This script drives the Vanity Metrics dashboard on the homepage. It counts up
each metric from zero to its data-target value once, triggered by an
IntersectionObserver when the section is 60% visible. Respects prefers-reduced-motion.
*/

const fmt = new Intl.NumberFormat()
const DURATION = 1100

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

document.addEventListener("nav", () => {
  const section = document.querySelector<HTMLElement>(".vanity-metrics")
  if (!section) return

  const nums = [...section.querySelectorAll<HTMLElement>(".vanity-metrics__num")]
  const targets = nums.map((el) => parseInt(el.dataset.target ?? "0", 10))

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nums.forEach((el, i) => {
      el.textContent = fmt.format(targets[i])
    })
    return
  }

  let animated = false

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting || animated) return
      animated = true
      observer.disconnect()

      const startTime = performance.now()

      function tick(now: number) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / DURATION, 1)
        const eased = easeOutCubic(progress)

        nums.forEach((el, i) => {
          el.textContent = fmt.format(Math.round(targets[i] * eased))
        })

        if (progress < 1) requestAnimationFrame(tick)
      }

      requestAnimationFrame(tick)
    },
    { threshold: 0.6 },
  )

  observer.observe(section)

  window.addCleanup(() => observer.disconnect())
})
