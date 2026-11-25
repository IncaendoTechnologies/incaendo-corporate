/**
 * AI practical-path roadmap (AIPracticalPath.astro): keeps the step list and
 * the architecture panel in sync, and lets visitors change the step by
 * swiping (touch), dragging (mouse), trackpad swipe or the arrow buttons.
 */
import './home-ai-experience.js'

function setupPracticalCardSync() {
  const cards = Array.from(
    document.querySelectorAll('.ai-overview-card[data-target-step]'),
  ).filter((el) => el instanceof HTMLElement)
  if (!cards.length) return

  const updateActiveCard = (activeId) => {
    if (!activeId) return
    cards.forEach((card) => {
      if (card instanceof HTMLElement) {
        const isMatch = card.getAttribute('data-target-step') === activeId
        card.classList.toggle('is-active', isMatch)
        card.setAttribute('aria-pressed', isMatch ? 'true' : 'false')
      }
    })
  }

  const scrollToFitSection = () => {
    const cardsWrap = document.querySelector('.ai-practical-overview')
    const demoCard = document.querySelector('.ai-workflow-demo')
    if (
      !(cardsWrap instanceof HTMLElement) ||
      !(demoCard instanceof HTMLElement)
    )
      return

    const cardsRect = cardsWrap.getBoundingClientRect()
    const demoRect = demoCard.getBoundingClientRect()
    const vh = window.innerHeight

    // Check if both cards and demo are already comfortably framed
    const isCardsTopVisible = cardsRect.top >= 5 && cardsRect.top <= 80
    const isDemoBottomVisible =
      demoRect.bottom <= vh - 10 && demoRect.bottom >= vh * 0.6
    if (isCardsTopVisible && isDemoBottomVisible) {
      return
    }

    // Frame the interactive cards and the full visual layout together
    const blockTop = cardsRect.top + window.scrollY
    const blockBottom = demoRect.bottom + window.scrollY
    const blockHeight = blockBottom - blockTop

    let targetScrollY
    if (blockHeight <= vh - 20) {
      // Position cards near the top with a subtle margin so the entire visual demo card fits fully below
      const topGap = Math.min(20, Math.max(10, (vh - blockHeight) * 0.2))
      targetScrollY = blockTop - topGap
    } else if (window.matchMedia('(max-width: 640px)').matches) {
      // Phones: bring the top of the architecture panel into view so the
      // change the visitor just asked for is what they see.
      targetScrollY = demoRect.top + window.scrollY - 12
    } else {
      // If vertical viewport is tighter, ensure the bottom of the visual demo card is fully visible
      targetScrollY = blockBottom - vh + 16
    }

    window.scrollTo({
      top: Math.max(0, Math.round(targetScrollY)),
      behavior: 'smooth',
    })
  }

  cards.forEach((card) => {
    if (card instanceof HTMLElement) {
      const activate = () => {
        const stepId = card.getAttribute('data-target-step')
        if (!stepId) return
        const input = document.getElementById(`workflow-${stepId}`)
        if (input instanceof HTMLInputElement && !input.checked) {
          input.checked = true
          input.dispatchEvent(new Event('change', { bubbles: true }))
        }
        updateActiveCard(stepId)
        scrollToFitSection()
      }
      card.addEventListener('click', activate)
      card.addEventListener('keydown', (e) => {
        if (e instanceof KeyboardEvent) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            activate()
          }
        }
      })
    }
  })

  const radios = Array.from(
    document.querySelectorAll('input[name="ai-workflow-step"]'),
  ).filter((el) => el instanceof HTMLInputElement)
  radios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      if (e.target instanceof HTMLInputElement && e.target.checked) {
        updateActiveCard(e.target.value)
      }
    })
  })

  const checked = document.querySelector(
    'input[name="ai-workflow-step"]:checked',
  )
  if (checked instanceof HTMLInputElement) {
    updateActiveCard(checked.value)
  }
}

// Swipe (touch) or drag (mouse) the architecture panel sideways, or use
// the arrow buttons, to move to the previous or next step without
// scrolling back up to the step list.
function setupWorkflowSwipe() {
  const demo = document.querySelector('[data-workflow-demo]')
  if (!(demo instanceof HTMLElement) || demo.dataset.swipeReady) return
  demo.dataset.swipeReady = 'true'
  const stage = demo.querySelector('.ai-state-stage')
  const radios = Array.from(
    document.querySelectorAll('input[name="ai-workflow-step"]'),
  ).filter((el) => el instanceof HTMLInputElement)
  const prevButton = demo.querySelector('[data-step-prev]')
  const nextButton = demo.querySelector('[data-step-next]')
  if (!(stage instanceof HTMLElement) || !radios.length) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const currentIndex = () =>
    Math.max(
      0,
      radios.findIndex((r) => r.checked),
    )
  const activeCard = () => stage.querySelector('.ai-state-card.is-active')

  const updateArrows = () => {
    const index = currentIndex()
    if (prevButton instanceof HTMLButtonElement)
      prevButton.disabled = index === 0
    if (nextButton instanceof HTMLButtonElement)
      nextButton.disabled = index === radios.length - 1
  }

  // direction: 1 = next, -1 = previous
  const goTo = (index, direction) => {
    const radio = radios[index]
    if (!radio || radio.checked) return false
    radio.checked = true
    radio.dispatchEvent(new Event('change', { bubbles: true }))
    const card = activeCard()
    if (card instanceof HTMLElement && !reducedMotion.matches) {
      card.animate(
        [
          { opacity: 0, translate: `${direction * 48}px 0` },
          { opacity: 1, translate: '0 0' },
        ],
        { duration: 320, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      )
    }
    return true
  }

  prevButton?.addEventListener('click', () => goTo(currentIndex() - 1, -1))
  nextButton?.addEventListener('click', () => goTo(currentIndex() + 1, 1))
  radios.forEach((radio) => radio.addEventListener('change', updateArrows))
  updateArrows()

  /** @type {number | null} */
  let pointerId = null
  let startX = 0
  let startY = 0
  let startTime = 0
  let dragging = false
  let suppressClick = false

  const setOffset = (px) => {
    const card = activeCard()
    if (!(card instanceof HTMLElement)) return
    card.style.translate = px ? `${px}px 0` : ''
    card.style.opacity = px
      ? String(Math.max(0.35, 1 - Math.abs(px) / 400))
      : ''
  }

  demo.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if (event.target instanceof Element && event.target.closest('button'))
      return
    pointerId = event.pointerId
    startX = event.clientX
    startY = event.clientY
    startTime = event.timeStamp
    dragging = false
  })

  demo.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointerId) return
    const dx = event.clientX - startX
    const dy = event.clientY - startY
    if (!dragging) {
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
        pointerId = null // vertical: let the page scroll
        return
      }
      if (Math.abs(dx) < 8) return
      dragging = true
      demo.setPointerCapture(event.pointerId)
      demo.classList.add('is-swiping')
    }
    // Resist at the first and last step.
    const index = currentIndex()
    const atEdge =
      (dx > 0 && index === 0) || (dx < 0 && index === radios.length - 1)
    setOffset(atEdge ? dx * 0.25 : dx * 0.6)
  })

  const endSwipe = (event) => {
    if (event.pointerId !== pointerId) return
    pointerId = null
    if (!dragging) return
    dragging = false
    suppressClick = true
    demo.classList.remove('is-swiping')
    const dx = event.clientX - startX
    const fast = Math.abs(dx) / Math.max(event.timeStamp - startTime, 1) > 0.5
    const card = activeCard()
    const offset = card instanceof HTMLElement ? card.style.translate : ''
    setOffset(0)
    const direction = dx < 0 ? 1 : -1
    const changed =
      (Math.abs(dx) > 60 || (fast && Math.abs(dx) > 25)) &&
      goTo(currentIndex() + direction, direction)
    // Not enough to change step: ease the card back into place.
    if (
      !changed &&
      offset &&
      card instanceof HTMLElement &&
      !reducedMotion.matches
    ) {
      card.animate([{ translate: offset }, { translate: '0 0' }], {
        duration: 260,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      })
    }
  }
  demo.addEventListener('pointerup', endSwipe)
  demo.addEventListener('pointercancel', endSwipe)
  demo.addEventListener(
    'click',
    (event) => {
      if (!suppressClick) return
      suppressClick = false
      event.preventDefault()
      event.stopPropagation()
    },
    true,
  )
  demo.addEventListener('dragstart', (event) => event.preventDefault())

  // Trackpad: a sideways two-finger swipe (or Shift + wheel) changes the
  // step once per gesture. Vertical wheel still scrolls the page.
  let wheelTotal = 0
  let wheelLocked = false
  let wheelTimer = 0
  demo.addEventListener(
    'wheel',
    (event) => {
      const dx = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX
      if (Math.abs(dx) <= Math.abs(event.shiftKey ? 0 : event.deltaY)) return
      event.preventDefault()
      clearTimeout(wheelTimer)
      // The gesture ends after a short pause; then another one can count.
      wheelTimer = window.setTimeout(() => {
        wheelTotal = 0
        wheelLocked = false
      }, 180)
      if (wheelLocked) return
      wheelTotal += dx
      if (Math.abs(wheelTotal) > 60) {
        const direction = wheelTotal > 0 ? 1 : -1
        goTo(currentIndex() + direction, direction)
        wheelLocked = true
      }
    },
    { passive: false },
  )
}

setupPracticalCardSync()
setupWorkflowSwipe()
document.addEventListener('astro:page-load', () => {
  setupPracticalCardSync()
  setupWorkflowSwipe()
})
