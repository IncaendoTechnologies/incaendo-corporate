// Lightweight, dependency-free toast notifications.
//
// Two persistent live regions are created once, up front, so screen readers
// reliably announce toasts added later: a polite `status` region for success
// and an assertive `alert` region for errors.

import '../styles/toast.css'

const ICONS = {
  success:
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 12.5 4 4 8-9"/></svg>',
  error:
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 6.5v7M12 17.5v.01"/></svg>',
}

const DEFAULT_DURATION = { success: 3000, error: 3000 }
const EXIT_MS = 220

let regions = null

function getRegions() {
  if (regions && document.body.contains(regions.root)) return regions

  const root = document.createElement('div')
  root.className = 'site-toasts'

  const status = document.createElement('div')
  status.setAttribute('role', 'status')
  status.setAttribute('aria-live', 'polite')

  const alert = document.createElement('div')
  alert.setAttribute('role', 'alert')

  status.className = alert.className = 'site-toasts-region'
  root.append(status, alert)
  document.body.append(root)
  regions = { root, status, alert }
  return regions
}

/**
 * Shows a toast and returns a function that dismisses it.
 * @param {{ type?: 'success' | 'error', title: string, description?: string, duration?: number }} options
 */
export function showToast({
  type = 'success',
  title,
  description = '',
  duration,
}) {
  const region = getRegions()[type === 'error' ? 'alert' : 'status']

  const toast = document.createElement('div')
  toast.className = `site-toast site-toast-${type}`

  const icon = document.createElement('span')
  icon.className = 'site-toast-icon'
  icon.innerHTML = ICONS[type] ?? ICONS.success

  const body = document.createElement('div')
  body.className = 'site-toast-body'
  const titleEl = document.createElement('p')
  titleEl.className = 'site-toast-title'
  titleEl.textContent = title
  body.append(titleEl)
  if (description) {
    const descEl = document.createElement('p')
    descEl.className = 'site-toast-description'
    descEl.textContent = description
    body.append(descEl)
  }

  const close = document.createElement('button')
  close.type = 'button'
  close.className = 'site-toast-close'
  close.setAttribute('aria-label', 'Dismiss notification')
  close.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18"/></svg>'

  toast.append(icon, body, close)

  let timer = 0
  let removed = false
  const dismiss = () => {
    if (removed) return
    removed = true
    window.clearTimeout(timer)
    toast.classList.remove('is-visible')
    window.setTimeout(() => toast.remove(), EXIT_MS)
  }

  // Fixed lifetime (no hover pause) so callers can rely on its length.
  close.addEventListener('click', dismiss)

  region.append(toast)
  // Next frame so the entrance transition runs.
  window.requestAnimationFrame(() => toast.classList.add('is-visible'))
  timer = window.setTimeout(dismiss, duration ?? DEFAULT_DURATION[type] ?? 3000)

  return dismiss
}
