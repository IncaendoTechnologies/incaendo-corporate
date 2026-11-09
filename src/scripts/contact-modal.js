function initContactModal() {
  const overlay = document.querySelector('[data-contact-modal]')
  const triggers = document.querySelectorAll('[data-open-contact-modal]')
  if (!overlay || !triggers.length) return
  if (overlay.dataset.initialized === 'true') return
  overlay.dataset.initialized = 'true'

  const dialog = overlay.querySelector('.contact-modal-dialog')
  const closeButtons = overlay.querySelectorAll('[data-modal-close]')
  let lastFocused = null

  const getFocusable = () =>
    Array.from(
      dialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    )

  const onKeydown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeModal()
      return
    }

    if (event.key === 'Tab') {
      const focusable = getFocusable()
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  const openModal = () => {
    lastFocused = document.activeElement
    overlay.classList.add('is-open')
    document.body.classList.add('modal-open')
    document.addEventListener('keydown', onKeydown)

    const focusable = getFocusable()
    ;(focusable[0] || dialog).focus()
  }

  const closeModal = () => {
    overlay.classList.remove('is-open')
    document.body.classList.remove('modal-open')
    document.removeEventListener('keydown', onKeydown)

    if (lastFocused instanceof HTMLElement) lastFocused.focus()
    lastFocused = null
  }

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal()
  })

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal)
  })

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault()
      openModal()
    })
  })
}

initContactModal()
document.addEventListener('astro:page-load', initContactModal)
