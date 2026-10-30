const intro = document.querySelector('[data-site-intro]')
const documentRoot = document.documentElement
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

if (
  !intro ||
  documentRoot.dataset.brandIntro !== 'playing' ||
  reducedMotion.matches
) {
  intro?.remove()
  delete documentRoot.dataset.brandIntro
} else {
  let finishTimer

  const finishIntro = () => {
    clearTimeout(finishTimer)
    intro.remove()
    delete documentRoot.dataset.brandIntro
    reducedMotion.removeEventListener('change', onMotionPreferenceChange)
    document.removeEventListener('astro:before-swap', finishIntro)
  }

  const onMotionPreferenceChange = (event) => {
    if (event.matches) finishIntro()
  }

  finishTimer = window.setTimeout(finishIntro, 1500)
  reducedMotion.addEventListener('change', onMotionPreferenceChange)
  document.addEventListener('astro:before-swap', finishIntro, { once: true })
}
