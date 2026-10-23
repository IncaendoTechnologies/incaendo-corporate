const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const cards = document.querySelectorAll('[data-service-tilt]')

function resetTilt(card) {
  card.style.removeProperty('--service-tilt-x')
  card.style.removeProperty('--service-tilt-y')
}

function handlePointerMove(event) {
  if (event.pointerType !== 'mouse' || reducedMotion.matches) return

  const card = event.currentTarget
  const bounds = card.getBoundingClientRect()
  const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5
  const vertical = (event.clientY - bounds.top) / bounds.height - 0.5
  const tiltX = Math.max(-3, Math.min(3, vertical * -6))
  const tiltY = Math.max(-3, Math.min(3, horizontal * 6))

  card.style.setProperty('--service-tilt-x', `${tiltX}deg`)
  card.style.setProperty('--service-tilt-y', `${tiltY}deg`)
}

cards.forEach((card) => {
  card.addEventListener('pointermove', handlePointerMove)
  card.addEventListener('pointerleave', () => resetTilt(card))
})

reducedMotion.addEventListener('change', (event) => {
  if (event.matches) cards.forEach(resetTilt)
})
