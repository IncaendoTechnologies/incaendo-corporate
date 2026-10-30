import gsap from 'gsap'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const contexts = new Set()
let revealObserver
let activeHero
let restoreHeroHeading
let restoreAIHeading
let restoreServicesHeading
let restoreReviewHeading
let restoreAwardsHeading
let restoreClientHeading

function animateElement(element, options = {}) {
  const context = gsap.context(() => {
    gsap.fromTo(
      element,
      { autoAlpha: 0, y: options.y ?? 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: options.duration ?? 0.7,
        ease: 'power3.out',
        delay: options.delay ?? 0,
        clearProps: options.clearProps ?? 'willChange',
      },
    )
  }, element)
  contexts.add(context)
}

function clearMotion() {
  revealObserver?.disconnect()
  revealObserver = undefined
  contexts.forEach((context) => context.revert())
  contexts.clear()
  restoreHeroHeading?.()
  restoreHeroHeading = undefined
  restoreAIHeading?.()
  restoreAIHeading = undefined
  restoreServicesHeading?.()
  restoreServicesHeading = undefined
  restoreReviewHeading?.()
  restoreReviewHeading = undefined
  restoreAwardsHeading?.()
  restoreAwardsHeading = undefined
  restoreClientHeading?.()
  restoreClientHeading = undefined
  activeHero = undefined
}

function splitHeadingIntoLines(heading) {
  const originalMarkup = heading.innerHTML
  const originalLabel = heading.getAttribute('aria-label')
  const originalText = heading.textContent.replace(/\s+/g, ' ').trim()
  const textWalker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT)
  const textNodes = []
  let textNode = textWalker.nextNode()

  while (textNode) {
    textNodes.push(textNode)
    textNode = textWalker.nextNode()
  }

  const words = []
  textNodes.forEach((node) => {
    const accent = node.parentElement.closest('span')
    const pattern = /[^\s]+/g
    let match = pattern.exec(node.textContent)

    while (match) {
      const range = document.createRange()
      range.setStart(node, match.index)
      range.setEnd(node, match.index + match[0].length)
      words.push({
        text: match[0],
        top: Math.round(range.getBoundingClientRect().top),
        accent: Boolean(accent),
        accentStart: Boolean(accent && match.index === 0),
      })
      match = pattern.exec(node.textContent)
    }
  })

  const lineMap = new Map()
  words.forEach((word) => {
    if (!lineMap.has(word.top)) lineMap.set(word.top, [])
    lineMap.get(word.top).push(word)
  })

  const lines = [...lineMap.values()].map((lineWords) => {
    const line = document.createElement('span')
    const inner = document.createElement('span')
    line.className = 'hero-title-line'
    inner.className = 'hero-title-line-inner'

    lineWords.forEach((word, index) => {
      if (index > 0) inner.append(document.createTextNode(' '))
      if (!word.accent) {
        inner.append(document.createTextNode(word.text))
        return
      }

      const accent = document.createElement('span')
      accent.className = word.accentStart
        ? 'hero-title-accent hero-title-accent-start'
        : 'hero-title-accent'
      accent.textContent = word.text
      inner.append(accent)
    })

    line.append(inner)
    return { line, inner }
  })

  heading.replaceChildren(...lines.map(({ line }) => line))
  heading.setAttribute('aria-label', originalText)

  return {
    lines: lines.map(({ inner }) => inner),
    restore() {
      heading.innerHTML = originalMarkup
      if (originalLabel === null) heading.removeAttribute('aria-label')
      else heading.setAttribute('aria-label', originalLabel)
    },
  }
}

function animateAIIntro(intro) {
  const eyebrow = intro.querySelector('.eyebrow')
  const heading = intro.querySelector('h2')
  const description = intro.querySelector('.section-intro')

  if (eyebrow) {
    animateElement(eyebrow, {
      y: 10,
      duration: 0.55,
      delay: 0.08,
      clearProps: 'transform,opacity,visibility',
    })
  }

  if (heading) {
    let splitHeading
    let restored = false
    const restore = () => {
      if (restored) return
      restored = true
      splitHeading?.restore()
      if (restoreAIHeading === restore) restoreAIHeading = undefined
    }

    try {
      splitHeading = splitHeadingIntoLines(heading)
      restoreAIHeading = restore
      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          onComplete: restore,
          onInterrupt: restore,
        })

        splitHeading.lines.forEach((line, index) => {
          timeline.fromTo(
            line,
            { autoAlpha: 0, yPercent: 105 },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.72,
              ease: 'power3.out',
            },
            index * 0.09,
          )
        })
      }, heading)
      contexts.add(context)
    } catch {
      restore()
    }
  }

  if (description) {
    animateElement(description, {
      y: 14,
      duration: 0.65,
      delay: 0.28,
      clearProps: 'transform,opacity,visibility',
    })
  }
}

function animateServicesIntro(intro) {
  const eyebrow = intro.querySelector('.eyebrow')
  const heading = intro.querySelector('h2')
  const description = intro.querySelector('.section-intro')
  const action = intro.querySelector('.text-link')

  if (eyebrow) {
    animateElement(eyebrow, {
      y: 10,
      duration: 0.5,
      delay: 0.04,
      clearProps: 'transform,opacity,visibility',
    })
  }

  if (heading) {
    let splitHeading
    let restored = false
    const restore = () => {
      if (restored) return
      restored = true
      splitHeading?.restore()
      if (restoreServicesHeading === restore) {
        restoreServicesHeading = undefined
      }
    }

    try {
      splitHeading = splitHeadingIntoLines(heading)
      restoreServicesHeading = restore
      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          onComplete: restore,
          onInterrupt: restore,
        })

        splitHeading.lines.forEach((line, index) => {
          timeline.fromTo(
            line,
            { autoAlpha: 0, yPercent: 105 },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.68,
              ease: 'power3.out',
            },
            0.14 + index * 0.08,
          )
        })
      }, heading)
      contexts.add(context)
    } catch {
      restore()
    }
  }

  if (description) {
    animateElement(description, {
      y: 14,
      duration: 0.58,
      delay: 0.38,
      clearProps: 'transform,opacity,visibility',
    })
  }

  if (action) {
    animateElement(action, {
      y: 10,
      duration: 0.5,
      delay: 0.54,
      clearProps: 'transform,opacity,visibility',
    })
  }
}

function animateReviewIntro(intro) {
  const eyebrow = intro.querySelector('.eyebrow')
  const heading = intro.querySelector('h2')
  const description = intro.querySelector('.review-intro-copy')

  if (eyebrow) {
    animateElement(eyebrow, {
      y: 10,
      duration: 0.5,
      delay: 0.02,
      clearProps: 'transform,opacity,visibility',
    })
  }

  if (heading) {
    let splitHeading
    let restored = false
    const restore = () => {
      if (restored) return
      restored = true
      splitHeading?.restore()
      if (restoreReviewHeading === restore) restoreReviewHeading = undefined
    }

    try {
      splitHeading = splitHeadingIntoLines(heading)
      restoreReviewHeading = restore
      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          onComplete: restore,
          onInterrupt: restore,
        })

        splitHeading.lines.forEach((line, index) => {
          timeline.fromTo(
            line,
            { autoAlpha: 0, yPercent: 105 },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.68,
              ease: 'power3.out',
            },
            0.1 + index * 0.08,
          )
        })
      }, heading)
      contexts.add(context)
    } catch {
      restore()
    }
  }

  if (description) {
    animateElement(description, {
      y: 14,
      duration: 0.58,
      delay: 0.34,
      clearProps: 'transform,opacity,visibility',
    })
  }
}

function animateAwardsIntro(intro) {
  const eyebrow = intro.querySelector('.eyebrow')
  const heading = intro.querySelector('h2')
  const description = intro.querySelector('.awards-intro-copy')

  if (eyebrow) {
    animateElement(eyebrow, {
      y: 10,
      duration: 0.5,
      delay: 0.02,
      clearProps: 'transform,opacity,visibility',
    })
  }

  if (heading) {
    let splitHeading
    let restored = false
    const restore = () => {
      if (restored) return
      restored = true
      splitHeading?.restore()
      if (restoreAwardsHeading === restore) restoreAwardsHeading = undefined
    }

    try {
      splitHeading = splitHeadingIntoLines(heading)
      restoreAwardsHeading = restore
      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          onComplete: restore,
          onInterrupt: restore,
        })

        splitHeading.lines.forEach((line, index) => {
          timeline.fromTo(
            line,
            { autoAlpha: 0, yPercent: 105 },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.68,
              ease: 'power3.out',
            },
            0.1 + index * 0.08,
          )
        })
      }, heading)
      contexts.add(context)
    } catch {
      restore()
    }
  }

  if (description) {
    animateElement(description, {
      y: 14,
      duration: 0.58,
      delay: 0.34,
      clearProps: 'transform,opacity,visibility',
    })
  }
}

function animateClientIntro(intro) {
  const eyebrow = intro.querySelector('.eyebrow')
  const heading = intro.querySelector('h2')
  const description = intro.querySelector('.section-intro')

  if (eyebrow) {
    animateElement(eyebrow, {
      y: 10,
      duration: 0.5,
      delay: 0.02,
      clearProps: 'transform,opacity,visibility',
    })
  }

  if (heading) {
    let splitHeading
    let restored = false
    const restore = () => {
      if (restored) return
      restored = true
      splitHeading?.restore()
      if (restoreClientHeading === restore) restoreClientHeading = undefined
    }

    try {
      splitHeading = splitHeadingIntoLines(heading)
      restoreClientHeading = restore
      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          onComplete: restore,
          onInterrupt: restore,
        })

        splitHeading.lines.forEach((line, index) => {
          timeline.fromTo(
            line,
            { autoAlpha: 0, yPercent: 105 },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.68,
              ease: 'power3.out',
            },
            0.1 + index * 0.08,
          )
        })
      }, heading)
      contexts.add(context)
    } catch {
      restore()
    }
  }

  if (description) {
    animateElement(description, {
      y: 14,
      duration: 0.58,
      delay: 0.34,
      clearProps: 'transform,opacity,visibility',
    })
  }
}

function animateAIVisual(visual) {
  try {
    const context = gsap.context(() => {
      gsap.fromTo(
        visual,
        { autoAlpha: 0, scale: 1.03 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.95,
          delay: 0.06,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility',
        },
      )
    }, visual)
    contexts.add(context)
  } catch {
    visual.style.removeProperty('opacity')
    visual.style.removeProperty('visibility')
    visual.style.removeProperty('transform')
  }
}

function setupMotion() {
  if (reducedMotion.matches) {
    clearMotion()
    document.documentElement.classList.remove('home-hero-motion')
    return
  }

  const hero = document.querySelector('.hero-section')
  if (hero && hero === activeHero) return

  clearMotion()
  document.documentElement.classList.remove('home-hero-motion')

  if (hero) {
    activeHero = hero
    const eyebrow = hero.querySelector('.hero-copy .eyebrow')
    const heading = hero.querySelector('.hero-copy h1')
    const description = hero.querySelector('.hero-description')
    const actions = hero.querySelector('.hero-actions')

    if (heading)
      animateElement(heading, {
        y: 14,
        duration: 0.68,
        delay: 0.12,
        clearProps: 'transform,opacity,visibility',
      })

    if (eyebrow)
      animateElement(eyebrow, {
        y: 10,
        duration: 0.55,
        delay: 0.08,
        clearProps: 'transform,opacity,visibility',
      })
    if (description)
      animateElement(description, {
        y: 14,
        duration: 0.65,
        delay: 0.28,
        clearProps: 'transform,opacity,visibility',
      })
    if (actions)
      animateElement(actions, {
        y: 12,
        duration: 0.6,
        delay: 0.4,
        clearProps: 'transform,opacity,visibility',
      })

    document.documentElement.classList.remove('home-hero-motion')
  }

  const elements = document.querySelectorAll('.reveal')
  if (!elements.length) return

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        if (entry.target.matches('[data-ai-intro-reveal]')) {
          animateAIIntro(entry.target)
        } else if (entry.target.matches('[data-ai-visual-reveal]')) {
          animateAIVisual(entry.target)
        } else if (entry.target.matches('[data-services-intro]')) {
          animateServicesIntro(entry.target)
        } else if (entry.target.matches('[data-review-intro]')) {
          animateReviewIntro(entry.target)
        } else if (entry.target.matches('[data-awards-intro]')) {
          animateAwardsIntro(entry.target)
        } else if (entry.target.matches('[data-client-intro]')) {
          animateClientIntro(entry.target)
        } else if (entry.target.matches('[data-reveal-stagger]')) {
          const isServiceGrid = entry.target.matches('.service-grid-home')
          const isAwardsGrid = entry.target.matches('.awards-grid')
          const isServicePageGrid = entry.target.matches(
            '.services-overview-grid, .delivery-steps, .saas-products',
          )
          const usesCardReveal =
            isServiceGrid || isAwardsGrid || isServicePageGrid
          entry.target
            .querySelectorAll('[data-reveal-item]')
            .forEach((item, index) => {
              animateElement(item, {
                y: usesCardReveal ? 24 : 12,
                duration: usesCardReveal ? 0.68 : 0.48,
                delay:
                  index * (usesCardReveal ? 0.12 : 0.055) +
                  (isAwardsGrid ? 0.72 : 0) +
                  (entry.target.hasAttribute('data-ai-stagger') ? 0.4 : 0),
                clearProps: usesCardReveal
                  ? 'transform,opacity,visibility'
                  : undefined,
              })
            })
        } else {
          animateElement(entry.target)
        }
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -45px 0px' },
  )

  elements.forEach((element) => revealObserver.observe(element))
}

setupMotion()
document.addEventListener('astro:page-load', setupMotion)
document.addEventListener('astro:before-swap', clearMotion)
window.addEventListener('pagehide', clearMotion, { once: true })
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    clearMotion()
    return
  }
  setupMotion()
})
