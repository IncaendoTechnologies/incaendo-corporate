// Realistic Earth and network animation for the Home hero globe
// (HomeHeroGlobe.astro).
//
// Earth: a WebGL fragment shader ray-casts an orthographic sphere and samples
// the Blue Marble texture with the same tilt and centre longitude as the SVG
// projection, so the network nodes sit exactly on their real locations. The
// ocean is recoloured to a light-theme blue. Procedural clouds are baked once
// into an equirectangular texture and drift by offsetting its longitude; the
// continents never move, so the network stays put.
//
// Network: small particles travel along the existing SVG arcs (positions come
// from getPointAtLength on those paths), with a short trail and a pulse on
// the node they arrive at.
//
// Reduced motion: the Earth is drawn once, statically, with no particles.
// Everything pauses while the globe is off-screen or the tab is hidden.

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  varying vec2 vPoint;
  void main() {
    vPoint = aPosition;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

const PRECISION = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif
  const float PI = 3.14159265;
`

// Rendered once into an equirectangular texture (x: longitude, y: latitude
// from the south pole). Noise is sampled on the sphere, so the map is seamless.
const CLOUD_SHADER = `${PRECISION}
  varying vec2 vPoint;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    return noise(p) * 0.52 + noise(p * 2.1) * 0.27 + noise(p * 4.3) * 0.14 + noise(p * 8.7) * 0.07;
  }

  void main() {
    vec2 uv = vPoint * 0.5 + 0.5;
    float lat = (uv.y - 0.5) * PI;
    float lon = uv.x * 2.0 * PI - PI;
    vec3 point = vec3(cos(lat) * sin(lon), sin(lat), cos(lat) * cos(lon));
    vec3 stretched = point * vec3(2.6, 4.4, 2.6);
    float base = smoothstep(0.56, 0.78, fbm(stretched + vec3(3.1, 0.7, 1.9)));
    float wisps = smoothstep(0.6, 0.82, fbm(stretched * 2.3 + vec3(0.4, 2.2, 5.1)));
    gl_FragColor = vec4(vec3(clamp(base * 0.62 + wisps * 0.28, 0.0, 0.75)), 1.0);
  }
`

const EARTH_SHADER = `${PRECISION}
  uniform sampler2D uEarth;
  uniform sampler2D uClouds;
  uniform float uTilt;
  uniform float uCenterLon;
  uniform float uDrift;
  uniform float uPixel;
  varying vec2 vPoint;

  void main() {
    float distanceSq = dot(vPoint, vPoint);
    if (distanceSq > 1.0) discard;
    float radius = sqrt(distanceSq);

    // View-space normal of the sphere at this pixel (y up, z toward viewer)
    vec3 normal = vec3(vPoint, sqrt(max(1.0 - distanceSq, 0.0)));

    // Undo the 22° tilt, then convert to latitude / longitude
    float ct = cos(uTilt);
    float st = sin(uTilt);
    vec3 geo = vec3(normal.x, normal.y * ct + normal.z * st, -normal.y * st + normal.z * ct);
    float lat = asin(clamp(geo.y, -1.0, 1.0));
    float lon = atan(geo.x, geo.z) + uCenterLon;
    vec3 texel = texture2D(uEarth, vec2(fract((lon + PI) / (2.0 * PI)), (PI * 0.5 - lat) / PI)).rgb;

    // The Blue Marble ocean is near-black navy; recolour it to a natural,
    // lighter blue while keeping the texture's subtle depth variation.
    float luminance = dot(texel, vec3(0.299, 0.587, 0.114));
    float ocean = smoothstep(0.03, 0.15, texel.b - max(texel.r, texel.g) * 0.7)
      * (1.0 - smoothstep(0.3, 0.5, luminance));
    float depth = clamp((texel.b - 0.14) * 3.2, 0.0, 1.0);
    vec3 oceanColor = mix(vec3(0.2, 0.47, 0.71), vec3(0.38, 0.65, 0.84), 0.3 + 0.45 * depth);
    vec3 landColor = pow(texel, vec3(0.82)) * 1.1;
    vec3 surface = mix(landColor, oceanColor, ocean);

    // Soft daylight from the upper left, kept bright for the light theme
    vec3 lightDirection = normalize(vec3(-0.5, 0.55, 0.68));
    float diffuse = max(dot(normal, lightDirection), 0.0);
    vec3 color = surface * (0.68 + 0.48 * diffuse);
    vec3 halfVector = normalize(lightDirection + vec3(0.0, 0.0, 1.0));
    color += vec3(0.85, 0.93, 1.0) * pow(max(dot(normal, halfVector), 0.0), 70.0) * ocean * 0.3;

    // Clouds drift eastward: sample the baked map at an earlier longitude
    float cloudLon = lon - uDrift;
    float cloudCover = texture2D(uClouds, vec2(fract((cloudLon + PI) / (2.0 * PI)), (lat + PI * 0.5) / PI)).r;
    color = mix(color, vec3(0.98, 0.99, 1.0), cloudCover * (0.55 + 0.45 * diffuse));

    // Light atmospheric haze toward the limb
    float fresnel = pow(1.0 - normal.z, 2.4);
    color = mix(color, vec3(0.74, 0.87, 0.98), fresnel * 0.6);

    // Anti-aliased edge, premultiplied alpha
    float alpha = 1.0 - smoothstep(1.0 - 1.6 * uPixel, 1.0, radius);
    gl_FragColor = vec4(color * alpha, alpha);
  }
`

function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || 'Earth shader failed')
  }
  return shader
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.src = src
    // Decode off the main thread so the texture upload doesn't stall a frame
    image.decode().then(() => resolve(image), reject)
  })
}

// Wait until the page has loaded so the texture never competes with the
// hero's own content.
function afterPageLoad() {
  return new Promise((resolve) => {
    const idle = () =>
      'requestIdleCallback' in window
        ? requestIdleCallback(resolve, { timeout: 1200 })
        : setTimeout(resolve, 200)
    if (document.readyState === 'complete') idle()
    else window.addEventListener('load', idle, { once: true })
  })
}

function createProgram(gl, fragmentSource) {
  const program = gl.createProgram()
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER))
  gl.attachShader(
    program,
    compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource),
  )
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || 'Earth program failed')
  }
  return program
}

// Clouds move ~0.7° of longitude per second
const CLOUD_DRIFT = 0.012

async function createEarth(canvas) {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
  })
  if (!gl) throw new Error('WebGL unavailable')

  const quad = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quad)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  )
  const useProgram = (program) => {
    gl.useProgram(program)
    const position = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  }

  // Bake the cloud map once
  const cloudProgram = createProgram(gl, CLOUD_SHADER)
  const clouds = gl.createTexture()
  gl.activeTexture(gl.TEXTURE1)
  gl.bindTexture(gl.TEXTURE_2D, clouds)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1024,
    512,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  const framebuffer = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    clouds,
    0,
  )
  useProgram(cloudProgram)
  gl.viewport(0, 0, 1024, 512)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.deleteFramebuffer(framebuffer)
  gl.deleteProgram(cloudProgram)

  const program = createProgram(gl, EARTH_SHADER)
  useProgram(program)
  const uniform = (name) => gl.getUniformLocation(program, name)
  const driftLocation = uniform('uDrift')
  const pixelLocation = uniform('uPixel')
  gl.uniform1f(
    uniform('uTilt'),
    (Number(canvas.dataset.earthTilt) * Math.PI) / 180,
  )
  gl.uniform1f(
    uniform('uCenterLon'),
    (Number(canvas.dataset.earthCenterLon) * Math.PI) / 180,
  )
  gl.uniform1i(uniform('uEarth'), 0)
  gl.uniform1i(uniform('uClouds'), 1)

  await afterPageLoad()
  const image = await loadImage(canvas.dataset.earthTexture)

  const texture = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR,
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.generateMipmap(gl.TEXTURE_2D)

  function resize() {
    const size = canvas.getBoundingClientRect().width
    const pixels = Math.max(
      1,
      Math.round(size * Math.min(window.devicePixelRatio || 1, 2)),
    )
    if (canvas.width === pixels) return false
    canvas.width = pixels
    canvas.height = pixels
    gl.uniform1f(pixelLocation, 2 / pixels)
    return true
  }

  function draw(seconds) {
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform1f(driftLocation, (seconds * CLOUD_DRIFT) % (Math.PI * 2))
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  resize()
  return { draw, resize }
}

const easeInOut = (t) => 0.5 - Math.cos(Math.PI * t) / 2
const random = (min, max) => min + Math.random() * (max - min)
const SVG_NS = 'http://www.w3.org/2000/svg'

function createNetwork(network) {
  const layer = network.querySelector('[data-globe-particles]')
  const pulse = (name) => {
    const ring = network.querySelector(
      `[data-node="${name}"] .hero-globe-node-pulse`,
    )
    ring?.animate(
      [
        { opacity: 0.9, transform: 'scale(1)' },
        { opacity: 0, transform: `scale(${name === 'hub' ? 2.2 : 3.4})` },
      ],
      { duration: 900, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
    )
  }

  const element = (tag, attributes) => {
    const node = document.createElementNS(SVG_NS, tag)
    Object.entries(attributes).forEach(([key, value]) =>
      node.setAttribute(key, value),
    )
    layer.append(node)
    return node
  }

  const routes = [...network.querySelectorAll('[data-arc-to]')].map((path) => {
    const length = path.getTotalLength()
    const d = path.getAttribute('d')
    // Two dashes of different lengths fake a trail that brightens toward
    // the head; the gap is longer than the path so each dash appears once.
    const longTrail = element('path', {
      d,
      'stroke-dasharray': `22 ${length + 22}`,
      class: 'is-long',
    })
    const shortTrail = element('path', {
      d,
      'stroke-dasharray': `9 ${length + 9}`,
    })
    const glow = element('circle', {
      r: '4.6',
      class: 'hero-globe-particle-glow',
    })
    const head = element('circle', {
      r: '2.1',
      class: 'hero-globe-particle-head',
    })
    return {
      path,
      length,
      to: path.dataset.arcTo,
      parts: [longTrail, shortTrail, glow, head],
      trails: [
        [longTrail, 22],
        [shortTrail, 9],
      ],
      glow,
      head,
      travelling: false,
      startAt: 0,
      duration: 0,
      outbound: true,
    }
  })

  function hide(route) {
    route.parts.forEach((part) => part.setAttribute('opacity', '0'))
  }

  function schedule(route, now, firstRun = false) {
    route.travelling = false
    route.startAt = now + (firstRun ? random(0, 2600) : random(900, 3400))
    route.duration = 1500 + route.length * random(9, 14)
    route.outbound = firstRun || Math.random() < 0.65
    hide(route)
  }

  function update(route, now) {
    if (now < route.startAt) return
    route.travelling = true
    const progress = Math.min((now - route.startAt) / route.duration, 1)
    const eased = easeInOut(progress)
    const along = route.outbound ? eased : 1 - eased
    const distance = along * route.length
    const point = route.path.getPointAtLength(distance)
    const fade = Math.min(progress / 0.08, (1 - progress) / 0.08, 1)

    route.head.setAttribute('cx', point.x)
    route.head.setAttribute('cy', point.y)
    route.glow.setAttribute('cx', point.x)
    route.glow.setAttribute('cy', point.y)
    route.trails.forEach(([trail, size]) => {
      // Trail sits behind the head in the direction of travel
      const start = route.outbound ? distance - size : distance
      trail.setAttribute('stroke-dashoffset', String(-start))
    })
    route.parts.forEach((part) => part.setAttribute('opacity', String(fade)))

    if (progress >= 1) {
      pulse(route.outbound ? route.to : 'hub')
      schedule(route, now)
    }
  }

  return {
    start(now) {
      routes.forEach((route) => schedule(route, now, true))
    },
    frame(now) {
      routes.forEach((route) => update(route, now))
    },
    clear() {
      routes.forEach(hide)
    },
  }
}

async function setupHeroEarth() {
  const panel = document.querySelector('[data-hero-stats]')
  const canvas = panel?.querySelector('.hero-globe-earth')
  const network = panel?.querySelector('[data-globe-network]')
  if (!panel || !canvas || !network || panel.dataset.earthStarted) return
  panel.dataset.earthStarted = 'true'

  let earth
  try {
    earth = await createEarth(canvas)
  } catch {
    // No WebGL or no texture: the dotted SVG globe remains as the visual
    panel.removeAttribute('data-earth-pending')
  }

  const particles = createNetwork(network)
  let visible = false
  let frame = 0
  let lastEarthDraw = -Infinity
  const startedAt = performance.now()

  if (earth) {
    earth.draw(0)
    panel.classList.add('is-earth-ready')
    panel.removeAttribute('data-earth-pending')
    new ResizeObserver(() => {
      if (earth.resize()) earth.draw((lastEarthDraw - startedAt) / 1000 || 0)
    }).observe(canvas)
  }

  const animating = () => visible && !document.hidden && !reducedMotion.matches

  function tick(now) {
    // Clouds move under 2px per second, so ~6 redraws a second is plenty
    if (earth && now - lastEarthDraw > 160) {
      earth.draw((now - startedAt) / 1000)
      lastEarthDraw = now
    }
    particles.frame(now)
    frame = requestAnimationFrame(tick)
  }

  function sync() {
    cancelAnimationFrame(frame)
    frame = 0
    if (animating()) {
      particles.start(performance.now())
      frame = requestAnimationFrame(tick)
    } else {
      particles.clear()
    }
  }

  new IntersectionObserver(([entry]) => {
    const wasVisible = visible
    visible = entry.isIntersecting
    if (visible !== wasVisible) sync()
  }).observe(panel)
  document.addEventListener('visibilitychange', sync)
  reducedMotion.addEventListener('change', sync)
}

setupHeroEarth()
document.addEventListener('astro:page-load', setupHeroEarth)
