function initContactModal() {
  const overlay = document.querySelector('[data-contact-modal]')
  if (!overlay) return
  if (overlay.dataset.initialized === 'true') return
  overlay.dataset.initialized = 'true'

  const dialog = overlay.querySelector('.contact-modal-dialog')
  const closeButtons = overlay.querySelectorAll('[data-modal-close]')
  let lastFocused = null
  // True while the modal's contact form has a request in flight; blocks
  // every dismissal path (close button, backdrop, Escape).
  let submitting = false

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
    if (submitting) return
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

  // Events dispatched by ContactForm.astro (they bubble from the form).
  const setSubmitting = (value) => {
    submitting = value
    closeButtons.forEach((button) => {
      button.disabled = value
    })
  }
  overlay.addEventListener('contact-form:pending', () => setSubmitting(true))
  overlay.addEventListener('contact-form:settled', () => setSubmitting(false))
  // After a confirmed success and its 3s toast, close and return the visitor
  // to the page they were on. On failure the modal stays open.
  overlay.addEventListener('contact-form:complete', (event) => {
    if (event.detail?.success && overlay.classList.contains('is-open')) {
      closeModal()
    }
  })

  // One listener for the whole page: every [data-open-contact-modal] element
  // and every link to the /contact page opens the popup instead of navigating.
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return
    // Ctrl/Cmd/Shift-click keeps the browser's "open in new tab/window".
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const trigger = event.target.closest?.('[data-open-contact-modal], a[href]')
    if (!trigger || !isContactTrigger(trigger)) return
    event.preventDefault()
    openModal()
  })
}

function isContactTrigger(element) {
  // The contact page is the main page with the form: no popup there at all,
  // its links work normally (e.g. #project-inquiry scrolls to the form).
  if (window.location.pathname.replace(/\/+$/, '') === '/contact') return false
  if (element.hasAttribute('data-open-contact-modal')) return true
  // Header navigation goes to the main contact page, not the popup.
  if (element.hasAttribute('data-contact-page-link')) return false
  if (element.tagName !== 'A' || element.hasAttribute('download')) return false
  const url = new URL(element.href, window.location.href)
  return (
    url.origin === window.location.origin &&
    url.pathname.replace(/\/+$/, '') === '/contact'
  )
}

initContactModal()
document.addEventListener('astro:page-load', initContactModal)
