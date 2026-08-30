/*
This client script applies the Product catalog's type and lifecycle filters. It
reinitializes after Quartz navigation, keeps filter state local to the current
catalog page, and reports the visible result count to assistive technology.
*/

document.addEventListener("nav", () => {
  const catalog = document.querySelector<HTMLElement>(".product-folder")
  if (!catalog) {
    return
  }

  const filters = [...catalog.querySelectorAll<HTMLButtonElement>("[data-product-filter]")]
  const entries = [...catalog.querySelectorAll<HTMLElement>(".product-cluster")]
  const count = catalog.querySelector<HTMLElement>(".product-filter-count")
  const selected = { type: "all", status: "all" }

  function applyFilters() {
    let visible = 0

    for (const entry of entries) {
      const matchesType = selected.type === "all" || entry.dataset.productType === selected.type
      const matchesStatus = selected.status === "all" || entry.dataset.productStatus === selected.status
      entry.hidden = !(matchesType && matchesStatus)
      if (!entry.hidden) {
        visible += 1
      }
    }

    if (count) {
      count.textContent = `${visible} ${visible === 1 ? "entry" : "entries"}`
    }
  }

  for (const filter of filters) {
    filter.addEventListener("click", () => {
      const group = filter.dataset.productFilter as "type" | "status" | undefined
      const value = filter.dataset.filterValue
      if (!group || !value) {
        return
      }

      selected[group] = value
      for (const peer of filters.filter((candidate) => candidate.dataset.productFilter === group)) {
        const active = peer === filter
        peer.classList.toggle("is-active", active)
        peer.setAttribute("aria-pressed", String(active))
      }
      applyFilters()
    })
  }

  applyFilters()
})
