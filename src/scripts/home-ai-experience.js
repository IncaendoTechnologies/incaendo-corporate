const mounted = new Set()

// Shared by the homepage AI section and the AI page's practical-path section;
// each [data-ai-experience] root is set up independently.
function setupAiExperience(root) {
  if (root.dataset.aiReady) return
  root.dataset.aiReady = 'true'

  const workflow = root.querySelector('.ai-workflow-layout')
  if (workflow) {
    const controls = [
      ...root.querySelectorAll('input[name="ai-workflow-step"]'),
    ]
    const stateCards = [...root.querySelectorAll('[data-flow-state]')]
    const counter = root.querySelector('[data-step-count]')
    const progress = root.querySelector('[data-step-progress]')
    function selectStep(step, index) {
      workflow.dataset.activeStep = step
      stateCards.forEach((card) => {
        card.classList.toggle('is-active', card.dataset.flowState === step)
      })
      if (counter)
        counter.innerHTML = `${String(index + 1).padStart(2, '0')} <b>/</b> 05`
      if (progress)
        progress.style.transform = `scaleX(${(index + 1) / controls.length})`
    }

    controls.forEach((control, index) => {
      control.addEventListener('change', () => {
        if (control.checked) selectStep(control.value, index)
      })
    })

    const initialIndex = Math.max(
      0,
      controls.findIndex((control) => control.checked),
    )
    selectStep(controls[initialIndex]?.value ?? 'understand', initialIndex)
  }

  // Looping diagram animations pause while the section is off screen.
  const observer = new IntersectionObserver(
    ([entry]) => {
      root.dataset.aiPaused = String(!entry.isIntersecting)
    },
    { threshold: 0.05 },
  )
  observer.observe(root)

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      })
    },
    { threshold: 0.08 },
  )
  root
    .querySelectorAll('.ai-reveal')
    .forEach((element) => revealObserver.observe(element))
  root.dataset.motionReady = 'true'

  const dispose = () => {
    observer.disconnect()
    revealObserver.disconnect()
    delete root.dataset.aiReady
    delete root.dataset.motionReady
    delete root.dataset.aiPaused
    mounted.delete(dispose)
  }

  document.addEventListener('astro:before-swap', dispose, { once: true })
  window.addEventListener('pagehide', dispose, { once: true })
  mounted.add(dispose)
}

function setupAll() {
  document.querySelectorAll('[data-ai-experience]').forEach(setupAiExperience)
}

function cleanup() {
  mounted.forEach((dispose) => dispose())
  mounted.clear()
}

setupAll()
document.addEventListener('astro:page-load', setupAll)
document.addEventListener('astro:before-swap', cleanup)
