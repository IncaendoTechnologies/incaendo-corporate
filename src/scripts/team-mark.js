// Teams hero: lets the "iN" mark in TeamHeroMark.astro be dragged round.
//
// The steady 360 degree turn itself is a CSS animation (tc-turn), so the
// browser runs it on the compositor without any per-frame JavaScript. This
// script only takes over while the mark is being dragged, then hands the
// turn back to CSS from wherever the drag left it. It also pauses the
// animation while the mark is off screen.

const TURN_SECONDS = 14

const angleOf = (element) => {
  const transform = getComputedStyle(element).transform
  if (!transform || transform === 'none') return 0
  // The z axis of rotateY(a) is (sin a, 0, cos a); the mirroring scaleX
  // used past edge-on leaves it untouched.
  const matrix = new DOMMatrix(transform)
  return (Math.atan2(matrix.m31, matrix.m33) * 180) / Math.PI
}

const poseFor = (angle) => {
  const turn = ((angle % 360) + 360) % 360
  // Past edge-on the object is mirrored, so it reads "iN" from behind too.
  const behind = turn > 90 && turn < 270
  return {
    turn,
    transform: `rotateY(${turn.toFixed(2)}deg) scaleX(${behind ? -1 : 1})`,
    shadow: 0.5 + 0.5 * Math.abs(Math.cos((turn * Math.PI) / 180)),
  }
}

for (const root of document.querySelectorAll('[data-team-mark]')) {
  const mark = root.querySelector('[data-team-mark-object]')
  const grip = mark?.parentElement
  const shadow = root.querySelector('.tc-shadow')
  if (!mark || !grip) continue

  let dragging = false
  let angle = 0
  let lastX = 0

  const show = () => {
    const pose = poseFor(angle)
    mark.style.transform = pose.transform
    if (shadow) shadow.style.scale = `${pose.shadow.toFixed(3)} 1`
    return pose
  }

  grip.addEventListener('pointerdown', (event) => {
    angle = angleOf(mark)
    dragging = true
    lastX = event.clientX
    root.dataset.dragging = ''
    show()
    grip.setPointerCapture(event.pointerId)
  })
  grip.addEventListener('pointermove', (event) => {
    if (!dragging) return
    angle += (event.clientX - lastX) * 0.6
    lastX = event.clientX
    show()
  })
  const release = () => {
    if (!dragging) return
    dragging = false
    const { turn } = poseFor(angle)
    // Restart the CSS turn from this angle.
    root.style.setProperty(
      '--tc-turn-delay',
      `${(-(turn / 360) * TURN_SECONDS).toFixed(3)}s`,
    )
    mark.style.transform = ''
    if (shadow) shadow.style.scale = ''
    delete root.dataset.dragging
  }
  grip.addEventListener('pointerup', release)
  grip.addEventListener('pointercancel', release)

  // No need to animate what nobody can see.
  new IntersectionObserver(([entry]) => {
    root.toggleAttribute('data-offscreen', !entry.isIntersecting)
  }).observe(root)
}
