// Interactive particle field for the AI page hero.
//
// Idle: a dense cloud of particles drifts around the centre, and the "AI"
// letters themselves are built from particles. The letter shapes are sampled
// from the heading font, turned into a rounded relief (a distance field gives
// each point a height and surface normal) and lit, so the letters read as
// volumetric forms that sway gently in 3D inside the cloud.
// Open: clicking AI fades the particles out completely and stops the
// animation; the statistics then fade in around the circle (CSS handles the
// sequencing via [data-state]). Clicking AI again reverses this.

const TAU = Math.PI * 2
// Must cover the canvas fade-out in the CSS before the animation is paused.
const FADE_MS = 450
// Fallback if the heading font never reports as loaded.
const FONT_TIMEOUT_MS = 1500

const rgb = (r, g, b) => [r / 255, g / 255, b / 255]

// Surrounding field: navy, blue-grey, brand red-orange and a warm orange.
const FIELD_COLORS = [
  rgb(16, 27, 45),
  rgb(84, 123, 157),
  rgb(201, 84, 43),
  rgb(232, 133, 64),
]
const FIELD_WEIGHTS = [0.56, 0.2, 0.14, 0.1]

// Letter materials, from deep shadow to lit face, plus a specular tint.
// A is warm orange, I is dark navy; each carries speckles of the other.
const MATERIALS = [
  {
    ramp: [
      rgb(96, 32, 12),
      rgb(168, 65, 33),
      rgb(210, 92, 40),
      rgb(238, 132, 60),
      rgb(252, 178, 110),
    ],
    spec: rgb(255, 238, 220),
    speck: rgb(16, 27, 45),
  },
  {
    ramp: [
      rgb(2, 4, 9),
      rgb(8, 13, 24),
      rgb(16, 27, 45),
      rgb(32, 50, 76),
      rgb(58, 82, 112),
    ],
    spec: rgb(214, 226, 240),
    speck: rgb(240, 128, 52),
  },
]
const SHADOW_COLOR = rgb(16, 27, 45)

// Key light from the upper left, in front of the letters.
const LIGHT = normalize3(-0.5, -0.62, 0.6)
const HALF = normalize3(LIGHT[0], LIGHT[1], LIGHT[2] + 1)

function normalize3(x, y, z) {
  const l = Math.hypot(x, y, z) || 1
  return [x / l, y / l, z / l]
}

function gaussian() {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v)
}

// --- Glyph sampling --------------------------------------------------------
//
// Draws each letter to an offscreen canvas, runs a chamfer distance transform
// over the mask and builds a rounded "pillow" height from it: zero at the
// outline, full at the middle of each stroke. The height gradient gives a
// normal for lighting. Coordinates are in raster pixels, centred on the word.

function sampleGlyphs(fontFamily) {
  const fontSize = 320
  const font = `800 ${fontSize}px ${fontFamily}`
  const probe = document.createElement('canvas').getContext('2d')
  probe.font = font
  const mA = probe.measureText('A')
  const mI = probe.measureText('I')
  const ascent = Math.ceil(
    Math.max(mA.actualBoundingBoxAscent, mI.actualBoundingBoxAscent),
  )
  const capH = ascent
  const gap = capH * 0.13
  const pad = 6
  const aLeft = mA.actualBoundingBoxLeft
  const aWidth = aLeft + mA.actualBoundingBoxRight
  const iWidth = mI.actualBoundingBoxLeft + mI.actualBoundingBoxRight
  const w = Math.ceil(aWidth + gap + iWidth) + pad * 2
  const h = capH + pad * 2

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.font = font
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#f00'
  ctx.fillText('A', pad + aLeft, pad + ascent)
  ctx.fillStyle = '#00f'
  ctx.fillText('I', pad + aWidth + gap + mI.actualBoundingBoxLeft, pad + ascent)
  const pixels = ctx.getImageData(0, 0, w, h).data

  // Letter id per pixel: 0 = A, 1 = I, 255 = outside.
  const size = w * h
  const letter = new Uint8Array(size).fill(255)
  const dist = new Float32Array(size)
  const BIG = 1e6
  for (let p = 0, o = 0; p < size; p++, o += 4) {
    const a = pixels[o + 3]
    if (a < 128) continue
    letter[p] = pixels[o] > pixels[o + 2] ? 0 : 1
    dist[p] = BIG
  }

  // Two-pass chamfer (3-4) distance to the nearest outside pixel.
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x
      if (!dist[p]) continue
      let d = dist[p]
      if (x > 0) d = Math.min(d, dist[p - 1] + 3)
      if (y > 0) {
        d = Math.min(d, dist[p - w] + 3)
        if (x > 0) d = Math.min(d, dist[p - w - 1] + 4)
        if (x < w - 1) d = Math.min(d, dist[p - w + 1] + 4)
      }
      dist[p] = d
    }
  }
  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const p = y * w + x
      if (!dist[p]) continue
      let d = dist[p]
      if (x < w - 1) d = Math.min(d, dist[p + 1] + 3)
      if (y < h - 1) {
        d = Math.min(d, dist[p + w] + 3)
        if (x < w - 1) d = Math.min(d, dist[p + w + 1] + 4)
        if (x > 0) d = Math.min(d, dist[p + w - 1] + 4)
      }
      dist[p] = d
    }
  }

  let maxD = 0
  for (let p = 0; p < size; p++) {
    dist[p] /= 3
    if (dist[p] > maxD) maxD = dist[p]
  }

  // Rounded relief: a quarter circle across the stroke, flattening a little
  // at the centre so wide junctions do not bulge.
  const R = maxD * 0.92
  const raw = new Float32Array(size)
  for (let p = 0; p < size; p++) {
    if (letter[p] === 255) continue
    const d = Math.min(dist[p], R)
    raw[p] = Math.sqrt(R * R - (R - d) * (R - d))
  }
  // One box blur smooths the chamfer steps before taking gradients.
  const height = new Float32Array(size)
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x
      if (letter[p] === 255) continue
      let s = 0
      for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) s += raw[p + j * w + i]
      }
      height[p] = s / 9
    }
  }

  const inside = []
  const rim = []
  let minX = w
  let maxX = 0
  for (let p = 0; p < size; p++) {
    if (letter[p] === 255) continue
    inside.push(p)
    if (dist[p] <= 1.7) rim.push(p)
    const x = p % w
    if (x < minX) minX = x
    if (x > maxX) maxX = x
  }

  return {
    w,
    h,
    capH,
    R,
    cx: (minX + maxX + 1) / 2,
    cy: pad + capH / 2,
    letter,
    dist,
    height,
    inside: Uint32Array.from(inside),
    rim: Uint32Array.from(rim),
  }
}

// Picks a point on the glyph raster and returns its relief and normal.
function glyphPoint(glyph, list, out) {
  const { w, height, letter } = glyph
  const p = list[Math.floor(Math.random() * list.length)]
  const x = p % w
  const y = (p - x) / w
  const hz = height[p]
  // Central differences; outside neighbours count as zero height.
  const gx = (height[p + 1] - height[p - 1]) / 2
  const gy = (height[p + w] - height[p - w]) / 2
  const n = normalize3(-gx, -gy, 1)
  out.x = x + Math.random() - glyph.cx
  out.y = y + Math.random() - glyph.cy
  out.z = hz
  out.nx = n[0]
  out.ny = n[1]
  out.nz = n[2]
  out.letter = letter[p]
  out.edge = glyph.dist[p] <= 1.7
}

function setupParticleHero(root) {
  if (root.dataset.particlesReady) return
  root.dataset.particlesReady = 'true'

  const stage = root.querySelector('[data-particles-stage]')
  const canvas = root.querySelector('canvas')
  const renderer = createRenderer(canvas)
  const core = root.querySelector('[data-particles-core]')
  const label = core.querySelector('b')
  const stats = root.querySelector('[data-particles-stats]')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  let width = 0
  let height = 0
  let dpr = 1
  let cx = 0
  let cy = 0
  let span = 0
  let count = 0
  // Index ranges: soft shadow, then the field, then the letters (drawn last).
  let shadowEnd = 0
  let fieldEnd = 0
  let px, py, vx, vy, angle, homeR, spin, size, alpha, color, phase, stiff
  let soft
  // Letter particles: relief position, normal and material, in glyph pixels.
  let lx, ly, lz, nx, ny, nz, mat, speck, dither
  let glyph = null
  let glyphScale = 1
  let assembled = false
  let open = false
  let time = 0
  let lastFrame = 0
  let frame = 0
  let pauseTimer = 0
  let visible = true
  let pointer = null
  let disposed = false

  // Slow 3D sway of the letters; shared by every letter particle per frame.
  const pose = { cosY: 1, sinY: 0, cosX: 1, sinX: 0, persp: 0 }

  function allocate() {
    // Density scales with area; fewer particles on small or low-power devices.
    const cores = navigator.hardwareConcurrency || 4
    const budget = cores <= 4 ? 0.65 : 1
    const fieldCount = Math.round(
      Math.min(Math.max((width * height) / 22, 4200), 15000) * budget,
    )

    // Letter cap height as a share of the field, matching the core's role
    // as the centre of the composition.
    glyphScale = (span * 0.38) / glyph.capH
    const letterArea = glyph.inside.length * glyphScale * glyphScale
    const letterCount = Math.round(
      Math.min(Math.max(letterArea * 0.62, 3600), 17000) * budget,
    )
    const shadowCount = Math.round(letterCount * 0.07)

    shadowEnd = shadowCount
    fieldEnd = shadowCount + fieldCount
    count = fieldEnd + letterCount

    px = new Float32Array(count)
    py = new Float32Array(count)
    vx = new Float32Array(count)
    vy = new Float32Array(count)
    angle = new Float32Array(count)
    homeR = new Float32Array(count)
    spin = new Float32Array(count)
    size = new Float32Array(count)
    alpha = new Float32Array(count)
    color = new Float32Array(count * 3)
    phase = new Float32Array(count)
    stiff = new Float32Array(count)
    soft = new Uint8Array(count)
    lx = new Float32Array(count)
    ly = new Float32Array(count)
    lz = new Float32Array(count)
    nx = new Float32Array(count)
    ny = new Float32Array(count)
    nz = new Float32Array(count)
    mat = new Uint8Array(count)
    speck = new Uint8Array(count)
    dither = new Float32Array(count)

    // Particles scale with the field so small screens keep the same texture.
    const scale = Math.min(Math.max(span / 600, 0.75), 1.15)
    const pt = {}

    // Soft contact shadow under the letters, offset down and to the right.
    for (let i = 0; i < shadowEnd; i++) {
      glyphPoint(glyph, glyph.inside, pt)
      lx[i] = pt.x + glyph.capH * 0.045
      ly[i] = pt.y + glyph.capH * 0.075
      lz[i] = 0
      size[i] = (16 + Math.random() * 14) * scale
      alpha[i] = 0.05 + Math.random() * 0.03
      soft[i] = 1
      setColor(i, SHADOW_COLOR)
      phase[i] = Math.random() * TAU
      stiff[i] = 10
    }

    // The surrounding cloud.
    const inner = span * 0.05
    const outer = span * 0.49
    for (let i = shadowEnd; i < fieldEnd; i++) {
      // Mostly even areal density with soft clustering; the rest lie on a
      // projected sphere shell, which thickens the rim so the cloud reads
      // as a volume rather than a flat disc.
      let t
      if (Math.random() < 0.35) {
        const u = Math.random()
        t = Math.sqrt(1 - u * u)
      } else {
        do {
          t = Math.sqrt(Math.random())
        } while (Math.random() > 0.7 + 0.3 * Math.sin(t * 9 + i * 0.37))
      }
      homeR[i] = inner + (outer - inner) * t
      angle[i] =
        Math.random() < 0.32
          ? Math.floor(Math.random() * 3) * (TAU / 3) +
            t * 2.6 +
            gaussian() * 0.3
          : Math.random() * TAU

      // A clear mix of small, medium and occasional large particles; larger
      // ones read as nearer, so they are more opaque and move faster.
      const pick = Math.random()
      const depth =
        pick < 0.5
          ? Math.random() * 0.35
          : pick < 0.88
            ? 0.35 + Math.random() * 0.4
            : 0.75 + Math.random() * 0.25
      size[i] = (1.1 + depth * 3.2) * scale
      alpha[i] = Math.min(0.32 + depth * 0.62, 0.95) * (t > 0.88 ? 0.75 : 1)
      spin[i] = (0.04 + depth * 0.07) * (1.25 - t * 0.6)
      let hue = Math.random()
      let tone = 0
      while (tone < FIELD_WEIGHTS.length - 1 && hue > FIELD_WEIGHTS[tone]) {
        hue -= FIELD_WEIGHTS[tone]
        tone++
      }
      setColor(i, FIELD_COLORS[tone])
      phase[i] = Math.random() * TAU
      stiff[i] = 4.5 + Math.random() * 6.5
    }

    // The letters: mostly even coverage, with extra particles tracing the
    // outlines (including the A's counter) so the shapes stay crisp.
    const letters = []
    for (let n = 0; n < letterCount; n++) {
      glyphPoint(glyph, Math.random() < 0.22 ? glyph.rim : glyph.inside, pt)
      letters.push({ ...pt })
    }
    // Back to front, so the lit crest of each stroke draws on top.
    letters.sort((a, b) => a.z - b.z)
    for (let n = 0; n < letterCount; n++) {
      const i = fieldEnd + n
      const q = letters[n]
      lx[i] = q.x
      ly[i] = q.y
      lz[i] = q.z
      nx[i] = q.nx
      ny[i] = q.ny
      nz[i] = q.nz
      mat[i] = q.letter
      speck[i] = Math.random() < (q.letter === 0 ? 0.075 : 0.06) ? 1 : 0
      const relief = q.z / glyph.R
      const grain = Math.random()
      size[i] =
        (speck[i] ? 2.2 + grain * 2 : 1.6 + grain * grain * 2.3) *
        (0.85 + relief * 0.3) *
        scale
      alpha[i] = q.edge ? 0.8 + grain * 0.15 : 0.88 + grain * 0.12
      dither[i] = (Math.random() - 0.5) * 0.16
      phase[i] = Math.random() * TAU
      stiff[i] = 16 + Math.random() * 8
    }

    updatePose()
    shadeLetters()
    for (let i = 0; i < count; i++) {
      target(i, scratch)
      px[i] = scratch.x
      py[i] = scratch.y
    }

    // First appearance: the letter particles gather out of the cloud.
    if (!assembled && !reducedMotion.matches) {
      for (let i = fieldEnd; i < count; i++) {
        const r = span * 0.46 * Math.sqrt(Math.random())
        const a = Math.random() * TAU
        px[i] = cx + Math.cos(a) * r
        py[i] = cy + Math.sin(a) * r
      }
    }
    assembled = true
  }

  function setColor(i, c) {
    color[i * 3] = c[0]
    color[i * 3 + 1] = c[1]
    color[i * 3 + 2] = c[2]
  }

  function measure() {
    const rect = stage.getBoundingClientRect()
    if (!rect.width || !rect.height) return false
    const resized =
      Math.round(rect.width) !== width || Math.round(rect.height) !== height
    width = Math.round(rect.width)
    height = Math.round(rect.height)
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    renderer.resize(width, height, dpr)
    cx = width / 2
    cy = height / 2
    span = Math.min(width, height)
    if (resized || !count) allocate()
    return true
  }

  function updatePose() {
    // Two slow, incommensurate sways: never repeats exactly, never jumps.
    const yaw = 0.15 * Math.sin(time * 0.42) + 0.05 * Math.sin(time * 0.23 + 1)
    const pitch = 0.07 * Math.sin(time * 0.31 + 0.6)
    pose.cosY = Math.cos(yaw)
    pose.sinY = Math.sin(yaw)
    pose.cosX = Math.cos(pitch)
    pose.sinX = Math.sin(pitch)
    pose.persp = 1 / (glyph.capH * 3.2)
  }

  // Where particle i wants to be now.
  function target(i, out) {
    if (i < shadowEnd || i >= fieldEnd) {
      // Rotate the relief point, then project with gentle perspective.
      const x1 = lx[i] * pose.cosY + lz[i] * pose.sinY
      const z1 = -lx[i] * pose.sinY + lz[i] * pose.cosY
      const y2 = ly[i] * pose.cosX - z1 * pose.sinX
      const z2 = ly[i] * pose.sinX + z1 * pose.cosX
      const k = glyphScale / (1 - z2 * pose.persp)
      const wobble = i < shadowEnd ? 1.5 : 0.55
      out.x = cx + x1 * k + Math.sin(time * 0.9 + phase[i]) * wobble
      out.y = cy + y2 * k + Math.cos(time * 0.8 + phase[i] * 2) * wobble
      return
    }
    const r = homeR[i] + Math.sin(time * 0.8 + phase[i]) * 4
    out.x =
      cx + Math.cos(angle[i]) * r + Math.sin(time * 0.6 + phase[i] * 2) * 1.8
    out.y = cy + Math.sin(angle[i]) * r + Math.cos(time * 0.7 + phase[i]) * 1.8
  }

  // Lights each letter particle from its rotated normal. Colours blend
  // continuously along the material ramp, so nothing pops between frames.
  function shadeLetters() {
    const { cosY, sinY, cosX, sinX } = pose
    for (let i = fieldEnd; i < count; i++) {
      const m = MATERIALS[mat[i]]
      if (speck[i]) {
        setColor(i, m.speck)
        continue
      }
      const x1 = nx[i] * cosY + nz[i] * sinY
      const z1 = -nx[i] * sinY + nz[i] * cosY
      const y2 = ny[i] * cosX - z1 * sinX
      const z2 = ny[i] * sinX + z1 * cosX
      const diffuse = Math.max(x1 * LIGHT[0] + y2 * LIGHT[1] + z2 * LIGHT[2], 0)
      let spec = Math.max(x1 * HALF[0] + y2 * HALF[1] + z2 * HALF[2], 0)
      spec *= spec
      spec *= spec
      spec *= spec
      spec *= spec // ^16
      const lum = Math.min(Math.max(0.1 + diffuse * 0.88 + dither[i], 0), 1)
      const ramp = m.ramp
      const f = lum * (ramp.length - 1)
      const k = Math.min(Math.floor(f), ramp.length - 2)
      const t = f - k
      const a = ramp[k]
      const b = ramp[k + 1]
      const s = Math.min(spec * 0.7, 0.7)
      const o = i * 3
      color[o] = (a[0] + (b[0] - a[0]) * t) * (1 - s) + m.spec[0] * s
      color[o + 1] = (a[1] + (b[1] - a[1]) * t) * (1 - s) + m.spec[1] * s
      color[o + 2] = (a[2] + (b[2] - a[2]) * t) * (1 - s) + m.spec[2] * s
    }
  }

  const scratch = { x: 0, y: 0 }

  function step(dt) {
    time += dt
    updatePose()
    shadeLetters()
    const damping = Math.exp(-dt * 5.4)

    for (let i = 0; i < count; i++) {
      const field = i >= shadowEnd && i < fieldEnd
      if (field) angle[i] += dt * spin[i]
      target(i, scratch)
      let ax = (scratch.x - px[i]) * stiff[i]
      let ay = (scratch.y - py[i]) * stiff[i]

      // Keep the sampled glyph and its contact shadow protected; only the
      // surrounding field reacts to the cursor.
      if (pointer && field) {
        const dx = px[i] - pointer.x
        const dy = py[i] - pointer.y
        const d2 = dx * dx + dy * dy
        if (d2 < 6400 && d2 > 1) {
          const push = (1 - d2 / 6400) * 900
          const d = Math.sqrt(d2)
          ax += (dx / d) * push
          ay += (dy / d) * push
        }
      }

      vx[i] = (vx[i] + ax * dt) * damping
      vy[i] = (vy[i] + ay * dt) * damping
      px[i] += vx[i] * dt
      py[i] += vy[i] * dt
    }
  }

  // Reduced motion: place every particle at its target in one pass.
  function settle() {
    updatePose()
    shadeLetters()
    for (let i = 0; i < count; i++) {
      target(i, scratch)
      px[i] = scratch.x
      py[i] = scratch.y
      vx[i] = 0
      vy[i] = 0
    }
  }

  function draw() {
    renderer.draw({ count, px, py, size, color, shade: alpha, soft })
  }

  function loop(now) {
    frame = 0
    const dt = Math.min((now - (lastFrame || now)) / 1000, 0.05)
    lastFrame = now
    step(dt)
    draw()
    schedule()
  }

  // The loop only runs while the cloud is showing (or fading out).
  function schedule() {
    if (
      frame ||
      !count ||
      reducedMotion.matches ||
      !visible ||
      document.hidden ||
      (open && !pauseTimer)
    )
      return
    frame = requestAnimationFrame(loop)
  }

  function stop() {
    cancelAnimationFrame(frame)
    frame = 0
    lastFrame = 0
  }

  function renderStill() {
    if (!reducedMotion.matches || !count) return
    settle()
    draw()
  }

  // --- Interaction ---------------------------------------------------------

  function setOpen(next) {
    open = next
    root.dataset.state = open ? 'open' : 'idle'
    core.setAttribute('aria-expanded', String(open))
    core.setAttribute(
      'aria-label',
      open ? 'AI: show the particle view' : 'AI: show key figures',
    )
    stats.inert = !open
    clearTimeout(pauseTimer)
    pauseTimer = 0
    if (open) {
      // Keep animating while the canvas fades out, then pause entirely.
      pauseTimer = setTimeout(() => {
        pauseTimer = 0
        stop()
      }, FADE_MS)
    }
    renderStill()
    schedule()
  }

  function onCoreClick() {
    setOpen(!open)
  }

  function onKeydown(event) {
    if (event.key !== 'Escape' || !open) return
    setOpen(false)
    core.focus()
  }

  function onPointerMove(event) {
    if (event.pointerType !== 'mouse') return
    const rect = stage.getBoundingClientRect()
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  function onPointerLeave() {
    pointer = null
  }

  function onVisibility() {
    if (document.hidden) stop()
    else schedule()
  }

  function onMotionChange() {
    stop()
    if (reducedMotion.matches) renderStill()
    else schedule()
  }

  const resizeObserver = new ResizeObserver(() => {
    if (!glyph || !measure()) return
    if (reducedMotion.matches) renderStill()
    else if (!frame) draw()
  })
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) schedule()
    else stop()
  })

  function onContextLost(event) {
    event.preventDefault()
    stop()
  }

  function onContextRestored() {
    renderer.restore()
    renderer.resize(width, height, dpr)
    if (reducedMotion.matches) renderStill()
    else schedule()
  }

  canvas.addEventListener('webglcontextlost', onContextLost)
  canvas.addEventListener('webglcontextrestored', onContextRestored)
  core.addEventListener('click', onCoreClick)
  root.addEventListener('keydown', onKeydown)
  stage.addEventListener('pointermove', onPointerMove)
  stage.addEventListener('pointerleave', onPointerLeave)
  document.addEventListener('visibilitychange', onVisibility)
  reducedMotion.addEventListener('change', onMotionChange)
  resizeObserver.observe(stage)
  intersectionObserver.observe(stage)

  setOpen(false)

  // The letters are sampled from the heading face, so wait for it (briefly)
  // rather than tracing a fallback font and then morphing.
  const fontFamily = getComputedStyle(label).fontFamily
  const fontReady = document.fonts
    ? document.fonts.load(`800 100px ${fontFamily}`, 'AI').catch(() => {})
    : Promise.resolve()
  Promise.race([
    fontReady,
    new Promise((resolve) => setTimeout(resolve, FONT_TIMEOUT_MS)),
  ]).then(() => {
    if (disposed) return
    glyph = sampleGlyphs(fontFamily)
    if (measure()) {
      if (reducedMotion.matches) renderStill()
      else draw()
      schedule()
    }
    root.classList.add('is-ready')
  })

  root._cleanupParticles = () => {
    disposed = true
    stop()
    clearTimeout(pauseTimer)
    renderer.dispose()
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    canvas.removeEventListener('webglcontextlost', onContextLost)
    canvas.removeEventListener('webglcontextrestored', onContextRestored)
    core.removeEventListener('click', onCoreClick)
    root.removeEventListener('keydown', onKeydown)
    stage.removeEventListener('pointermove', onPointerMove)
    stage.removeEventListener('pointerleave', onPointerLeave)
    document.removeEventListener('visibilitychange', onVisibility)
    reducedMotion.removeEventListener('change', onMotionChange)
    root.classList.remove('is-ready')
    delete root.dataset.particlesReady
    delete root._cleanupParticles
  }
}

// --- Renderers -------------------------------------------------------------
//
// WebGL draws every particle as a point sprite in a single call, in index
// order (shadow, field, letters). The Canvas 2D fallback batches particles
// into one path per quantised colour and opacity level. Both receive the
// same per-frame particle data.

const VERTEX_SHADER = `
attribute vec2 a_position;
attribute float a_size;
attribute vec4 a_color;
attribute float a_soft;
uniform vec2 u_resolution;
uniform float u_dpr;
varying vec4 v_color;
varying float v_soft;
void main() {
  vec2 clip = a_position / u_resolution * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = a_size * u_dpr;
  v_color = a_color;
  v_soft = a_soft;
}
`

const FRAGMENT_SHADER = `
precision mediump float;
varying vec4 v_color;
varying float v_soft;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float edge = v_soft > 0.5 ? pow(max(1.0 - d, 0.0), 2.0) : smoothstep(1.0, 0.72, d);
  float a = v_color.a * edge;
  gl_FragColor = vec4(v_color.rgb * a, a);
}
`

const STRIDE = 8 // x, y, size, r, g, b, a, soft

function createWebGLRenderer(canvas) {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: true,
  })
  if (!gl) return null

  let program
  let buffer
  let data = new Float32Array(0)
  let loc = {}

  function compile(type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader))
    }
    return shader
  }

  function init() {
    program = gl.createProgram()
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SHADER))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program))
    }
    gl.useProgram(program)
    buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    loc = {
      position: gl.getAttribLocation(program, 'a_position'),
      size: gl.getAttribLocation(program, 'a_size'),
      color: gl.getAttribLocation(program, 'a_color'),
      soft: gl.getAttribLocation(program, 'a_soft'),
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      dpr: gl.getUniformLocation(program, 'u_dpr'),
    }
    const bytes = Float32Array.BYTES_PER_ELEMENT
    const attrib = (index, size, offset) => {
      gl.enableVertexAttribArray(index)
      gl.vertexAttribPointer(
        index,
        size,
        gl.FLOAT,
        false,
        STRIDE * bytes,
        offset * bytes,
      )
    }
    attrib(loc.position, 2, 0)
    attrib(loc.size, 1, 2)
    attrib(loc.color, 4, 3)
    attrib(loc.soft, 1, 7)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  }

  try {
    init()
  } catch {
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return null
  }

  return {
    resize(width, height, dpr) {
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      if (gl.isContextLost()) return
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(loc.resolution, width, height)
      gl.uniform1f(loc.dpr, dpr)
    },
    draw({ count, px, py, size, color, shade, soft }) {
      if (gl.isContextLost()) return
      if (data.length < count * STRIDE) data = new Float32Array(count * STRIDE)
      let o = 0
      for (let i = 0; i < count; i++, o += STRIDE) {
        data[o] = px[i]
        data[o + 1] = py[i]
        data[o + 2] = size[i]
        data[o + 3] = color[i * 3]
        data[o + 4] = color[i * 3 + 1]
        data[o + 5] = color[i * 3 + 2]
        data[o + 6] = !soft[i] && shade[i] < 0.06 ? 0 : shade[i]
        data[o + 7] = soft[i]
      }
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, o), gl.DYNAMIC_DRAW)
      gl.drawArrays(gl.POINTS, 0, count)
    },
    restore() {
      init()
    },
    dispose() {
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}

function createCanvasRenderer(canvas) {
  const ctx = canvas.getContext('2d')
  const levels = [0.22, 0.38, 0.54, 0.7, 0.88]
  // Colours are quantised to 3 bits per channel for batching.
  const BUCKETS = 512 * levels.length
  const SKIP = 0xffff
  let width = 0
  let height = 0
  let dpr = 1
  let key = new Uint16Array(0)
  let order = new Uint32Array(0)

  return {
    resize(w, h, ratio) {
      width = w
      height = h
      dpr = ratio
      canvas.width = Math.round(w * ratio)
      canvas.height = Math.round(h * ratio)
    },
    draw({ count, px, py, size, color, shade, soft }) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      // Bucket by colour and opacity level, then fill one path per bucket.
      // Draw order follows the buckets, not particle order, and the soft
      // shadow is skipped: an acceptable approximation for the fallback.
      if (key.length < count) {
        key = new Uint16Array(count)
        order = new Uint32Array(count)
      }
      const buckets = new Uint32Array(BUCKETS + 1)
      for (let i = 0; i < count; i++) {
        const a = shade[i]
        if (soft[i] || a < 0.08) {
          key[i] = SKIP
          continue
        }
        let level = 0
        while (
          level < levels.length - 1 &&
          a > (levels[level] + levels[level + 1]) / 2
        )
          level++
        const o = i * 3
        const c =
          ((color[o] * 7.99) << 6) |
          ((color[o + 1] * 7.99) << 3) |
          (color[o + 2] * 7.99)
        key[i] = c * levels.length + level
        buckets[key[i] + 1]++
      }
      for (let k = 1; k < buckets.length; k++) buckets[k] += buckets[k - 1]
      const starts = buckets.slice()
      for (let i = 0; i < count; i++) {
        if (key[i] !== SKIP) order[starts[key[i]]++] = i
      }
      for (let k = 0; k < BUCKETS; k++) {
        if (buckets[k] === buckets[k + 1]) continue
        const c = Math.floor(k / levels.length)
        const r = Math.round((((c >> 6) & 7) + 0.5) * 32)
        const g = Math.round((((c >> 3) & 7) + 0.5) * 32)
        const b = Math.round(((c & 7) + 0.5) * 32)
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.globalAlpha = levels[k % levels.length]
        ctx.beginPath()
        for (let n = buckets[k]; n < buckets[k + 1]; n++) {
          const i = order[n]
          const s = size[i]
          if (s < 2.2) {
            ctx.rect(px[i] - s / 2, py[i] - s / 2, s, s)
          } else {
            ctx.moveTo(px[i] + s / 2, py[i])
            ctx.arc(px[i], py[i], s / 2, 0, TAU)
          }
        }
        ctx.fill()
      }
      ctx.globalAlpha = 1
    },
    restore() {},
    dispose() {},
  }
}

function createRenderer(canvas) {
  return createWebGLRenderer(canvas) || createCanvasRenderer(canvas)
}

function setupParticleHeroes() {
  document
    .querySelectorAll('[data-ai-particles]')
    .forEach((root) => setupParticleHero(root))
}

function cleanupParticleHeroes() {
  document
    .querySelectorAll('[data-ai-particles]')
    .forEach((root) => root._cleanupParticles?.())
}

setupParticleHeroes()
document.addEventListener('astro:page-load', setupParticleHeroes)
document.addEventListener('astro:before-swap', cleanupParticleHeroes)
