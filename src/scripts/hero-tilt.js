const visual = document.querySelector('[data-hero-visual]')
const artwork = visual?.querySelector('.hero-art')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

if (visual && artwork && !reducedMotion.matches) {
  let frame = 0
  let pointerX = 0
  let pointerY = 0

  const resetTilt = () => {
    cancelAnimationFrame(frame)
    frame = 0
    artwork.style.setProperty('--hero-tilt-x', '0deg')
    artwork.style.setProperty('--hero-tilt-y', '0deg')
  }

  visual.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || reducedMotion.matches) return

    pointerX = event.clientX
    pointerY = event.clientY
    if (frame) return

    frame = requestAnimationFrame(() => {
      frame = 0
      const bounds = visual.getBoundingClientRect()
      const horizontal = (pointerX - bounds.left) / bounds.width - 0.5
      const vertical = (pointerY - bounds.top) / bounds.height - 0.5
      const tiltY = Math.max(-2.5, Math.min(2.5, horizontal * 5))
      const tiltX = Math.max(-2.5, Math.min(2.5, vertical * -5))

      artwork.style.setProperty('--hero-tilt-x', `${tiltX}deg`)
      artwork.style.setProperty('--hero-tilt-y', `${tiltY}deg`)
    })
  })

  visual.addEventListener('pointerleave', resetTilt)
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) resetTilt()
  })
}
