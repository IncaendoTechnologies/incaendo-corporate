const heroVisual = document.querySelector('[data-hero-visual]')
const video = heroVisual?.querySelector('[data-hero-video]')
const still = heroVisual?.querySelector('.hero-art')
const videoSource = video?.dataset.videoSrc?.trim()
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

// Keep the PNG visible until a real, supported WebM loop is configured and playing.
if (
  heroVisual &&
  video &&
  still &&
  videoSource &&
  !reducedMotion.matches &&
  video.canPlayType('video/webm')
) {
  const showStill = () => {
    video.pause()
    video.hidden = true
    still.hidden = false
    heroVisual.classList.remove('is-video-active')
  }

  const showVideo = () => {
    still.hidden = true
    video.hidden = false
    heroVisual.classList.add('is-video-active')
  }

  video.addEventListener('playing', showVideo)
  video.addEventListener('error', showStill)
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) showStill()
  })

  video.hidden = false
  video.src = videoSource
  video.load()
  video.play().catch(showStill)
}
