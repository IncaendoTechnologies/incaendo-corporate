/**
 * Drag, swipe and trackpad control for CSS marquees (reusable).
 *
 * The marquee keeps its own CSS animation. When the visitor drags it with the
 * mouse, swipes it on a touch screen or scrolls it sideways on a trackpad, the
 * animation is moved along with the gesture. On release it keeps gliding with
 * the gesture's speed and gradually eases back to the normal CSS speed.
 *
 * Markup hooks:
 *   [data-marquee-drag]           the visible window (overflow: hidden)
 *     data-direction="left|right" direction of the CSS animation (default left)
 *   [data-marquee-track]          the element that runs the CSS animation
 *
 * The track must hold two identical copies of its items, and its keyframes
 * must move it by 50% of its width per cycle (the usual seamless marquee).
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const DRAG_THRESHOLD = 6 // px moved before a press counts as a drag
const FRICTION = 0.95 // glide speed kept per 16 ms frame
const MIN_VELOCITY = 0.02 // px/ms; below this the glide stops
const MAX_VELOCITY = 5 // px/ms; caps very fast flicks

function initMarqueeDrag(viewport) {
  if (viewport.dataset.marqueeDragReady) return
  const track = viewport.querySelector('[data-marquee-track]')
  if (!track) return
  viewport.dataset.marqueeDragReady = 'true'

  // Moving the pointer this way (in px) pushes the marquee forward.
  const forwardSign = viewport.dataset.direction === 'right' ? 1 : -1

  let pointerId = null
  let startX = 0
  let startY = 0
  let lastX = 0
  let lastTime = 0
  let dragging = false
  let velocity = 0
  let glideFrame = 0
  let suppressClick = false

  const getAnimation = () => track.getAnimations()[0]

  // Move the CSS animation by a horizontal pointer distance in px.
  function moveBy(px) {
    const animation = getAnimation()
    const cycleWidth = track.scrollWidth / 2
    if (!animation || !cycleWidth) return
    const duration = Number(animation.effect.getComputedTiming().duration)
    if (!duration) return

    let time =
      Number(animation.currentTime ?? 0) +
      px * forwardSign * (duration / cycleWidth)
    // Never go before the first cycle, or the animation would stop applying.
    if (time < duration)
      time += duration * Math.ceil((duration - time) / duration)
    animation.currentTime = time
  }

  function stopGlide() {
    cancelAnimationFrame(glideFrame)
    glideFrame = 0
  }

  function glide() {
    stopGlide()
    let previous = performance.now()
    const step = (now) => {
      const elapsed = Math.min(now - previous, 64)
      previous = now
      moveBy(velocity * elapsed)
      velocity *= Math.pow(FRICTION, elapsed / 16)
      if (Math.abs(velocity) > MIN_VELOCITY) {
        glideFrame = requestAnimationFrame(step)
      } else {
        glideFrame = 0
      }
    }
    glideFrame = requestAnimationFrame(step)
  }

  viewport.addEventListener('pointerdown', (event) => {
    if (reducedMotion.matches) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    stopGlide()
    pointerId = event.pointerId
    startX = lastX = event.clientX
    startY = event.clientY
    lastTime = event.timeStamp
    dragging = false
    velocity = 0
  })

  viewport.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointerId) return
    const totalX = event.clientX - startX
    const totalY = event.clientY - startY

    if (!dragging) {
      if (
        Math.abs(totalY) > DRAG_THRESHOLD &&
        Math.abs(totalY) > Math.abs(totalX)
      ) {
        pointerId = null // vertical gesture: leave it to page scrolling
        return
      }
      if (Math.abs(totalX) < DRAG_THRESHOLD) return
      dragging = true
      // A press focuses focusable cards; :focus-within would then keep the
      // marquee paused after the drag, so drop that focus.
      if (viewport.contains(document.activeElement)) {
        document.activeElement.blur()
      }
      viewport.setPointerCapture(event.pointerId)
      viewport.classList.add('is-marquee-dragging')
    }

    const dx = event.clientX - lastX
    const dt = Math.max(event.timeStamp - lastTime, 1)
    moveBy(dx)
    const current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, dx / dt))
    velocity = velocity * 0.2 + current * 0.8
    lastX = event.clientX
    lastTime = event.timeStamp
  })

  function endDrag(event) {
    if (event.pointerId !== pointerId) return
    pointerId = null
    if (!dragging) return
    dragging = false
    suppressClick = true
    viewport.classList.remove('is-marquee-dragging')
    // A pause before release means the visitor stopped: no glide.
    if (event.timeStamp - lastTime > 100) velocity = 0
    if (Math.abs(velocity) > MIN_VELOCITY) glide()
  }

  viewport.addEventListener('pointerup', endDrag)
  viewport.addEventListener('pointercancel', endDrag)

  // A drag must not also click a link or card inside the marquee.
  viewport.addEventListener(
    'click',
    (event) => {
      if (!suppressClick) return
      suppressClick = false
      event.preventDefault()
      event.stopPropagation()
    },
    true,
  )

  // Stop the browser's native image/link drag ghost.
  viewport.addEventListener('dragstart', (event) => event.preventDefault())

  // Sideways trackpad scroll (or Shift + wheel). Vertical wheel still scrolls the page.
  viewport.addEventListener(
    'wheel',
    (event) => {
      if (reducedMotion.matches) return
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
      event.preventDefault()
      stopGlide()
      const lineHeight = event.deltaMode === 1 ? 16 : 1
      moveBy(-event.deltaX * lineHeight)
    },
    { passive: false },
  )
}

function initAllMarquees() {
  document.querySelectorAll('[data-marquee-drag]').forEach(initMarqueeDrag)
}

initAllMarquees()
document.addEventListener('astro:page-load', initAllMarquees)
