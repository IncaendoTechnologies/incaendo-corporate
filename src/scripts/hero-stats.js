// Count-up for the Home hero statistics ([data-hero-stats]).
//
// The markup already holds the final values, so nothing changes without
// JavaScript or under reduced motion. Otherwise each [data-count-to] number
// counts up from 0 once, staggered, the first time the panel enters the
// viewport. Until then an inline script in the hero component keeps the
// numbers hidden via [data-stats-pending], so no value is shown early.

const DURATION = 1050
const STAGGER = 100
const START_DELAY = 100

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const easeOutCubic = (t) => 1 - (1 - t) ** 3

function countUp(counter, startAt) {
  const target = Number(counter.dataset.countTo)

  const tick = (now) => {
    const progress = Math.min(Math.max((now - startAt) / DURATION, 0), 1)
    counter.textContent = String(Math.round(target * easeOutCubic(progress)))
    if (progress < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

function setupHeroStats() {
  const panel = document.querySelector('[data-hero-stats]')
  if (!panel || panel.dataset.statsReady) return
  panel.dataset.statsReady = 'true'

  if (reducedMotion.matches || !('IntersectionObserver' in window)) return

  const counters = [...panel.querySelectorAll('[data-count-to]')]

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      observer.disconnect()

      counters.forEach((counter) => {
        counter.textContent = '0'
      })
      panel.removeAttribute('data-stats-pending')

      const startAt = performance.now() + START_DELAY
      counters.forEach((counter, index) =>
        countUp(counter, startAt + index * STAGGER),
      )
    },
    { threshold: 0.35 },
  )

  observer.observe(panel)
}

setupHeroStats()
document.addEventListener('astro:page-load', setupHeroStats)
