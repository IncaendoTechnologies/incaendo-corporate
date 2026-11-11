/**
 * Site-wide scroll entrance motion.
 *
 * Markup hooks (unchanged from the previous system):
 *   .reveal                      a block that enters as one coordinated group
 *   [data-reveal-stagger]        a grid/list whose items enter in sequence
 *   [data-reveal-item]           an item of a stagger group (optional; direct
 *                                children are used when no items are marked)
 *   [data-reveal-role="…"]       optional override: heading | text | visual |
 *                                card | block | stage. On a .reveal block it
 *                                also makes the block ONE unit: its inner
 *                                elements are never split or animated.
 *                                `stage` = visual entrance without scale, for
 *                                containers whose scripts measure their own
 *                                size (canvas, diagrams), so geometry stays exact.
 *   [data-entrance-exclude]      opt a subtree out of this system (use it on
 *                                anything with its own entrance or scroll-
 *                                driven animation)
 *
 * Each block is split into "units" (eyebrow, heading, copy, visual, card…).
 * Units are observed individually; units that come into view together are
 * queued in document order with a short stagger, so heading → copy → visual
 * and card rows sequence naturally without per-section code.
 *
 * Animation uses the Web Animations API on the individual `translate`,
 * `scale` and `opacity` properties with a single "from" keyframe. That
 * composes with components' own `transform` hover/tilt effects and always
 * settles on each element's own computed style, leaving no inline styles.
 *
 * Pre-hiding happens before first paint via the inline boot script
 * (EntranceMotionBoot.astro) + motion.css, which avoids the flash where
 * content painted, vanished and then faded back in.
 */

const root = document.documentElement
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

// Subtrees owned by other animation systems (AI sections run their own
// choreography and must never be touched here).
const EXCLUDE = '[data-entrance-exclude], [data-ai-experience], .ai-reveal'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const STAGGER_MS = 90
// Never hold a unit more than this far behind "now", so fast scrolling and
// large grids don't leave readable content waiting.
const MAX_QUEUE_MS = 540
// The first-visit brand intro overlay starts fading out at ~1.1s.
const BRAND_INTRO_HOLD_MS = 1100

const ROLES = {
  heading: { y: 26, duration: 950 },
  text: { y: 16, duration: 800 },
  visual: { y: 22, scale: 0.97, duration: 1100 },
  card: { y: 26, duration: 850 },
  block: { y: 20, duration: 900 },
  stage: { y: 22, duration: 1100 },
}

const VISUAL =
  'img, picture, video, svg, canvas, iframe, figure, [class*="visual"], [class*="photo"], [class*="image"], [class*="preview"], [class*="graphic"]'
const SELF_CONTAINED =
  'details, form, [class*="marquee"], [class*="carousel"], [class*="slider"]'
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'LINK', 'META'])

let observer
let lastStart = 0
let holdUntil = 0
const running = new Set()
// Units last seen below the viewport. Only these can be "jumped over"; a
// unit that first appears above the viewport (e.g. a paginated card shown
// before the page scrolls back up to it) must still animate when reached.
const seenBelow = new WeakSet()

function roleOf(element, fallback) {
  const explicit = element.dataset.revealRole
  if (explicit && ROLES[explicit]) return explicit
  if (/^H[1-3]$/.test(element.tagName)) return 'heading'
  // a wrapper that only holds a heading (e.g. <div><h2>…</h2></div>)
  if (
    element.children.length === 1 &&
    /^H[1-3]$/.test(element.firstElementChild.tagName)
  ) {
    return 'heading'
  }
  if (element.matches(VISUAL)) return 'visual'
  return fallback
}

// A wrapper with its own visible surface (card, panel) must enter as one
// piece; otherwise its empty box would show before its contents.
function hasSurface(element) {
  const style = getComputedStyle(element)
  return (
    (style.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
      style.backgroundColor !== 'transparent') ||
    style.backgroundImage !== 'none' ||
    style.boxShadow !== 'none' ||
    parseFloat(style.borderTopWidth) > 0 ||
    parseFloat(style.borderBottomWidth) > 0 ||
    parseFloat(style.borderLeftWidth) > 0
  )
}

// Unwrap one level of plain grouping wrappers (e.g. <div><p.eyebrow><h2></div>)
// so an intro's eyebrow, heading and copy can sequence individually.
function expand(children) {
  return children.flatMap((child) => {
    const isGroup =
      (child.tagName === 'DIV' ||
        child.tagName === 'HEADER' ||
        child.tagName === 'HGROUP') &&
      !child.matches(VISUAL) &&
      !hasSurface(child) &&
      child.querySelector(':scope > h1, :scope > h2, :scope > h3') &&
      child.children.length >= 2 &&
      child.children.length <= 4
    return isGroup ? [...child.children] : [child]
  })
}

function unitsOf(block) {
  // An explicit role marks a self-contained unit (e.g. an animated visual
  // whose internals must stay untouched): animate only the container.
  if (block.dataset.revealRole) return [[block, roleOf(block, 'block')]]

  if (block.matches(SELF_CONTAINED) || block.querySelector(':scope > form')) {
    return [[block, roleOf(block, 'block')]]
  }

  if (block.hasAttribute('data-reveal-stagger') || block.matches('ol, ul')) {
    let items = [...block.querySelectorAll('[data-reveal-item]')].filter(
      (item) =>
        item.parentElement.closest('[data-reveal-stagger], .reveal') === block,
    )
    if (!items.length) items = [...block.children]
    return items
      .filter((item) => !SKIP_TAGS.has(item.tagName))
      .map((item) => [
        item,
        roleOf(
          item,
          item.matches('article, li, a, [class*="card"]') ? 'card' : 'text',
        ),
      ])
  }

  const children = expand([...block.children]).filter(
    (child) => !SKIP_TAGS.has(child.tagName),
  )
  if (children.length >= 2 && children.length <= 8 && !hasSurface(block)) {
    return children.map((child) => [child, roleOf(child, 'text')])
  }

  return [[block, roleOf(block, 'block')]]
}

function showInstantly(unit) {
  unit.dataset.motion = 'in'
}

function animateUnit(unit) {
  const role = ROLES[unit.dataset.motionRole] ?? ROLES.block
  const now = performance.now()
  const earliest = Math.max(now, holdUntil)
  const start = Math.min(
    Math.max(earliest, lastStart + STAGGER_MS),
    earliest + MAX_QUEUE_MS,
  )
  lastStart = start

  // offset 0 makes this the start keyframe; the end is the element's own
  // computed style (a lone keyframe would otherwise default to offset 1).
  const from = { offset: 0, opacity: 0, translate: `0 ${role.y}px` }
  if (role.scale) from.scale = role.scale

  // Lift the CSS pre-hide and start the animation in the same task; the
  // "backwards" fill keeps the unit at its start state during the delay.
  unit.dataset.motion = 'in'
  const animation = unit.animate([from], {
    duration: role.duration,
    delay: start - now,
    easing: EASE,
    fill: 'backwards',
  })
  running.add(animation)
  animation.finished.catch(() => {}).finally(() => running.delete(animation))
}

const documentOrder = (a, b) =>
  a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1

function onIntersect(entries) {
  const entering = []
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entering.push(entry.target)
    } else if (entry.boundingClientRect.top > 0) {
      seenBelow.add(entry.target)
    } else if (
      entry.boundingClientRect.bottom <= 0 &&
      (entry.boundingClientRect.width || entry.boundingClientRect.height)
    ) {
      // (Zero-size units are display:none, e.g. paginated or filtered cards;
      // they stay observed and animate when they are shown.)
      // Already scrolled past (restored scroll after refresh, anchor jumps):
      // show it without making the user scroll back to "unlock" it.
      observer.unobserve(entry.target)
      showInstantly(entry.target)
    }
  })

  entering.sort(documentOrder).forEach((unit) => {
    observer.unobserve(unit)
    animateUnit(unit)
  })
}

// Scroll sweep (rAF-throttled) for cases IntersectionObserver cannot see:
// - Fast jumps (smooth scroll restoration after Ctrl+R, flings, End key,
//   long anchor jumps) can carry a unit from below the viewport to above it
//   without an intersecting frame, so no callback ever fires. Show those
//   immediately; they are off-screen, so there is nothing to animate.
// - At the very bottom of a page, content below the trigger line can never
//   cross it; animate whatever is still pending in the viewport.
let sweepQueued = false
function onScroll() {
  if (sweepQueued || !observer) return
  sweepQueued = true
  requestAnimationFrame(() => {
    sweepQueued = false
    if (!observer) return
    const atBottom =
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 2
    const reachedBottom = []
    document.querySelectorAll('[data-motion="pending"]').forEach((unit) => {
      const rect = unit.getBoundingClientRect()
      // skip display:none units (zero-size), e.g. paginated cards
      if (!rect.width && !rect.height) return
      if (rect.top >= window.innerHeight) {
        seenBelow.add(unit)
      } else if (rect.bottom <= 0 && seenBelow.has(unit)) {
        observer.unobserve(unit)
        showInstantly(unit)
      } else if (atBottom && rect.top < window.innerHeight) {
        reachedBottom.push(unit)
      }
    })
    reachedBottom.sort(documentOrder).forEach((unit) => {
      observer.unobserve(unit)
      animateUnit(unit)
    })
  })
}

function revealEverything() {
  window.removeEventListener('scroll', onScroll)
  observer?.disconnect()
  observer = undefined
  running.forEach((animation) => animation.finish())
  document
    .querySelectorAll('[data-motion="pending"]')
    .forEach((unit) => showInstantly(unit))
  delete root.dataset.entrance
}

function setup() {
  // Only run when the boot script pre-hid content (motion allowed, failsafe
  // not yet triggered).
  if (root.dataset.entrance !== 'pending') return
  if (reducedMotion.matches || !('animate' in Element.prototype)) {
    revealEverything()
    return
  }

  if (root.dataset.brandIntro === 'playing') holdUntil = BRAND_INTRO_HOLD_MS

  const units = []
  document
    .querySelectorAll('.reveal, [data-reveal-stagger]')
    .forEach((block) => {
      if (block.closest(EXCLUDE)) return
      // A block nested in an already registered unit enters with that unit.
      if (block.parentElement?.closest('[data-motion]')) return
      unitsOf(block).forEach(([unit, role]) => {
        if (unit.dataset.motion) return
        unit.dataset.motion = 'pending'
        unit.dataset.motionRole = role
        units.push(unit)
      })
    })

  // Swap block-level pre-hide for unit-level pre-hide in the same task, so
  // nothing paints in between.
  root.dataset.entrance = 'active'

  observer = new IntersectionObserver(onIntersect, {
    threshold: 0,
    rootMargin: '0px 0px -8% 0px',
  })
  units.forEach((unit) => observer.observe(unit))
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

setup()

reducedMotion.addEventListener('change', (event) => {
  if (event.matches) revealEverything()
})
