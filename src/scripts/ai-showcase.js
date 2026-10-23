const showcase = document.querySelector('[data-ai-showcase]')

if (showcase) {
  const options = [...document.querySelectorAll('[data-ai-capability]')]
  const visuals = [...showcase.querySelectorAll('[data-ai-visual]')]
  const indexLabel = showcase.querySelector('[data-ai-index]')
  const captionKicker = showcase.querySelector('[data-ai-caption-kicker]')
  const caption = showcase.querySelector('[data-ai-caption]')
  const captionPanel = showcase.querySelector('.ai-showcase-caption')
  const section = showcase.closest('#ai-highlight')
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  )
  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)')

  function animateCounter(el) {
    const target = Number(el.dataset.aiCounter)
    const suffix = el.classList.contains('diagram-counter-pct') ? '%' : ''
    if (!Number.isFinite(target)) return

    if (prefersReducedMotion.matches) {
      el.textContent = `${target}${suffix}`
      return
    }

    const duration = 900
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      el.textContent = `${Math.round(target * eased)}${suffix}`
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }

  function runCounters(visual) {
    visual
      .querySelectorAll('[data-ai-counter]')
      .forEach((el) => animateCounter(el))
  }

  function selectOption(option) {
    if (option.getAttribute('aria-pressed') === 'true') return

    options.forEach((item) => {
      item.setAttribute('aria-pressed', String(item === option))
    })

    const selected = option.dataset.aiCapability
    visuals.forEach((visual) => {
      const isSelected = visual.dataset.aiVisual === selected
      visual.classList.toggle('is-active', isSelected)
      visual.setAttribute('aria-hidden', String(!isSelected))
      if (isSelected) runCounters(visual)
    })

    const number = option.querySelector('.ai-capability-number').textContent
    const title = option.querySelector('.ai-capability-title').textContent
    indexLabel.textContent = `${number} / 05`
    captionKicker.textContent = `${number} / ${title}`
    caption.textContent = option.dataset.aiCaption
    captionPanel.classList.remove('is-changing')
    void captionPanel.offsetWidth
    captionPanel.classList.add('is-changing')
    showcase.dataset.active = selected
  }

  captionPanel.addEventListener('animationend', (event) => {
    if (event.animationName === 'ai-caption-change') {
      captionPanel.classList.remove('is-changing')
    }
  })

  options.forEach((option) => {
    option.addEventListener('click', () => selectOption(option))
    option.addEventListener('keydown', (event) => {
      const currentIndex = options.indexOf(option)
      let nextIndex

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % options.length
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + options.length) % options.length
      } else if (event.key === 'Home') {
        nextIndex = 0
      } else if (event.key === 'End') {
        nextIndex = options.length - 1
      }

      if (nextIndex !== undefined) {
        event.preventDefault()
        options[nextIndex].focus()
        selectOption(options[nextIndex])
      }
    })
  })

  if (canTilt.matches && !prefersReducedMotion.matches) {
    showcase.addEventListener('pointermove', (event) => {
      if (prefersReducedMotion.matches) return
      const bounds = showcase.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - 0.5
      const y = (event.clientY - bounds.top) / bounds.height - 0.5
      showcase.style.setProperty('--ai-tilt-x', `${y * -1.3}deg`)
      showcase.style.setProperty('--ai-tilt-y', `${x * 1.3}deg`)
    })
    showcase.addEventListener('pointerleave', () => {
      showcase.style.setProperty('--ai-tilt-x', '0deg')
      showcase.style.setProperty('--ai-tilt-y', '0deg')
    })
    prefersReducedMotion.addEventListener('change', (event) => {
      if (!event.matches) return
      showcase.style.setProperty('--ai-tilt-x', '0deg')
      showcase.style.setProperty('--ai-tilt-y', '0deg')
    })
  }

  const initiallyActive = visuals.find((visual) =>
    visual.classList.contains('is-active'),
  )
  if (initiallyActive) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          runCounters(initiallyActive)
          observer.disconnect()
        })
      },
      { threshold: 0.3 },
    )
    revealObserver.observe(showcase)
  }
}
