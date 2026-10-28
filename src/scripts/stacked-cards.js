// Scroll-driven stacked cards, configured with data attributes:
//
//   [data-stack]                 tall track element; data-stack-pin holds the
//                                media query under which the deck is pinned
//   [data-stack-deck]            container the cards are stacked in
//   [data-stack-card]            one per card, in reading order
//   [data-stack-current]         optional: shows the active card number
//   [data-stack-progress]        optional: element scaled along x for progress
//
// While pinned, scroll position drives each card's rise from below the
// viewport; earlier cards shrink, dim, and peek out above the active one.
// Everything is derived from the current scroll position, so fast scrolling,
// reversing, resizing, and reloading mid-sequence all render correctly.
// Outside the pin query the cards stay in normal page flow.

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const smooth = (t) => t * t * (3 - 2 * t)

function setupStack(track) {
  if (track._cleanupStack) return

  const cards = [...track.querySelectorAll('[data-stack-card]')]
  const deck = track.querySelector('[data-stack-deck]')
  const sticky = track.firstElementChild
  const current = track.querySelector('[data-stack-current]')
  const progress = track.querySelector('[data-stack-progress]')
  const pinned = window.matchMedia(track.dataset.stackPin)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let activeIndex = -1
  let frame = 0
  let nearViewport = true

  function setActive(index) {
    if (index === activeIndex) return
    activeIndex = index
    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === index)
      // Only the active card is exposed while the deck is pinned.
      card.toggleAttribute('inert', pinned.matches && i !== index)
    })
    if (current) current.textContent = String(index + 1).padStart(2, '0')
  }

  function applyDepth(card, { y = 0, scale = 1, dim = 0, lift = 0 }) {
    card.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`
    card.style.setProperty('--dim', dim.toFixed(3))
    card.style.setProperty('--lift', lift.toFixed(3))
  }

  function update() {
    frame = 0
    if (!pinned.matches) return

    const viewport = window.innerHeight
    const distance = track.offsetHeight - viewport
    const scrolled = clamp(-track.getBoundingClientRect().top, 0, distance)
    // Short holds before the first move and after the last card settles.
    const lead = viewport * 0.06
    const tail = viewport * 0.3
    const span = Math.max(distance - lead - tail, 1)
    const units = clamp(
      ((scrolled - lead) / span) * (cards.length - 1),
      0,
      cards.length - 1,
    )
    // Rise distance from the deck's pinned position, so it is the same
    // before, during, and after the pin.
    const deckOffset =
      deck.getBoundingClientRect().top - sticky.getBoundingClientRect().top
    const startY = viewport - deckOffset + 24
    const rise = cards.map((_, i) => {
      if (i === 0) return 1
      const t = clamp(units - (i - 1), 0, 1)
      return reducedMotion.matches ? Math.round(t) : smooth(t)
    })

    cards.forEach((card, i) => {
      let covered = 0
      for (let j = i + 1; j < cards.length; j++) covered += rise[j]
      const depth = Math.min(covered, 3)
      card.style.visibility = rise[i] === 0 || covered >= 4 ? 'hidden' : ''
      card.style.opacity = String(clamp(3.6 - covered, 0, 1))
      applyDepth(card, {
        y: (1 - rise[i]) * startY - depth * 15,
        scale: 1 - depth * 0.04,
        dim: clamp(covered * 0.42, 0, 0.8),
        lift: (rise[i] === 1 ? 0.55 : 1) * (1 - Math.min(covered, 1)),
      })
    })

    setActive(rise.filter((value) => value >= 0.5).length - 1)
    if (progress) {
      progress.style.transform = `scaleX(${(units + 1) / cards.length})`
    }
  }

  function requestUpdate() {
    if (!frame && nearViewport) frame = requestAnimationFrame(update)
  }

  function onModeChange() {
    activeIndex = -1
    cards.forEach((card) => {
      card.style.removeProperty('transform')
      card.style.removeProperty('opacity')
      card.style.removeProperty('visibility')
      card.style.removeProperty('--dim')
      card.style.removeProperty('--lift')
      card.removeAttribute('inert')
    })
    setActive(0)
    requestUpdate()
  }

  // Skip scroll work entirely while the track is far from the viewport.
  const observer = new IntersectionObserver(
    ([entry]) => {
      nearViewport = entry.isIntersecting
      requestUpdate()
    },
    { rootMargin: '50% 0px' },
  )

  track.dataset.enhanced = ''
  setActive(0)
  update()
  observer.observe(track)
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
  pinned.addEventListener('change', onModeChange)
  reducedMotion.addEventListener('change', requestUpdate)

  track._cleanupStack = () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    window.removeEventListener('scroll', requestUpdate)
    window.removeEventListener('resize', requestUpdate)
    pinned.removeEventListener('change', onModeChange)
    reducedMotion.removeEventListener('change', requestUpdate)
    delete track.dataset.enhanced
    delete track._cleanupStack
  }
}

function setupStacks() {
  document.querySelectorAll('[data-stack]').forEach(setupStack)
}

function cleanupStacks() {
  document
    .querySelectorAll('[data-stack]')
    .forEach((track) => track._cleanupStack?.())
}

setupStacks()
document.addEventListener('astro:page-load', setupStacks)
document.addEventListener('astro:before-swap', cleanupStacks)
