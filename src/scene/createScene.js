/**
 * Page-wide 3D background (Three.js). One renderer, one transparent canvas behind the content.
 *
 *  - GPU particles: positions drift in the vertex shader → no per-frame CPU work per particle
 *  - Floating wireframe geometry spread along the page (the camera travels down with scroll)
 *  - Moving floor grid fading into fog
 *  - Hero: holographic rings + floating technology labels around the avatar
 *  - Contact: a glowing knot that comes into view at the end of the page
 *  - Pointer parallax on the camera
 *
 * Materials are unlit (MeshBasic / Line / Points with additive blending): no lights, no shadows.
 * Everything created here is disposed in `dispose()`.
 */
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  ShaderMaterial,
  AdditiveBlending,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  IcosahedronGeometry,
  OctahedronGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  DodecahedronGeometry,
  GridHelper,
  FogExp2,
  CanvasTexture,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Clock,
  MathUtils,
} from 'three'

const CYAN = new Color('#22d3ee')
const BLUE = new Color('#3b82f6')
const PURPLE = new Color('#8b5cf6')
const NAVY = new Color('#060a18')
const TRAVEL = 44 // world units the camera travels from top to bottom of the page

function makeLabelTexture(text) {
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  const font = '600 44px Manrope, system-ui, sans-serif'
  ctx.font = font
  const w = Math.ceil(ctx.measureText(text).width) + 96
  c.width = w
  c.height = 104
  const g = c.getContext('2d')
  const r = 52
  g.beginPath()
  g.roundRect(4, 4, w - 8, 96, r)
  g.fillStyle = 'rgba(14, 21, 42, 0.72)'
  g.fill()
  const grad = g.createLinearGradient(0, 0, w, 0)
  grad.addColorStop(0, '#22d3ee')
  grad.addColorStop(1, '#8b5cf6')
  g.lineWidth = 3
  g.strokeStyle = grad
  g.stroke()
  g.fillStyle = '#22d3ee'
  g.beginPath()
  g.arc(40, 52, 8, 0, Math.PI * 2)
  g.fill()
  g.font = font
  g.fillStyle = '#ecf1ff'
  g.textBaseline = 'middle'
  g.fillText(text, 62, 54)
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 4
  return { tex, aspect: w / 104 }
}

export function createScene(canvas, { mobile = false } = {}) {
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5)
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: dpr < 1.5, powerPreference: 'high-performance' })
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  scene.fog = new FogExp2(NAVY, 0.045)
  const camera = new PerspectiveCamera(45, 1, 0.1, 120)
  camera.position.set(0, 0, 10)

  // ── particles ──────────────────────────────────────────────
  const count = mobile ? 650 : 1500
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const seed = new Float32Array(count)
  const palette = [CYAN, BLUE, PURPLE]
  for (let i = 0; i < count; i++) {
    pos[i * 3] = MathUtils.randFloatSpread(44)
    pos[i * 3 + 1] = MathUtils.randFloat(-TRAVEL - 10, 10)
    pos[i * 3 + 2] = MathUtils.randFloat(-22, 4)
    const c = palette[i % 3]
    col.set([c.r, c.g, c.b], i * 3)
    seed[i] = Math.random()
  }
  const pGeo = new BufferGeometry()
  pGeo.setAttribute('position', new Float32BufferAttribute(pos, 3))
  pGeo.setAttribute('aColor', new Float32BufferAttribute(col, 3))
  pGeo.setAttribute('aSeed', new Float32BufferAttribute(seed, 1))
  const pMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixel: { value: dpr } },
    vertexShader: /* glsl */ `
      attribute vec3 aColor; attribute float aSeed;
      uniform float uTime; uniform float uPixel;
      varying vec3 vColor; varying float vAlpha;
      void main() {
        vec3 p = position;
        p.x += sin(uTime * 0.15 + aSeed * 40.0) * 0.6;
        p.y += cos(uTime * 0.12 + aSeed * 25.0) * 0.5;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float size = mix(1.4, 3.6, aSeed);
        gl_PointSize = size * uPixel * (14.0 / -mv.z);
        vColor = aColor;
        vAlpha = 0.35 + 0.45 * (0.5 + 0.5 * sin(uTime * 1.2 + aSeed * 60.0));
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vColor; varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor, a * vAlpha);
      }`,
  })
  const particles = new Points(pGeo, pMat)
  scene.add(particles)

  // ── floating geometric objects along the page ─────────────
  const floaters = []
  const shapes = [
    { geo: new IcosahedronGeometry(1.4, 1), color: CYAN, at: [-15, -9, -11] },
    { geo: new OctahedronGeometry(1.1, 0), color: PURPLE, at: [15, -15, -10] },
    { geo: new TorusGeometry(1.2, 0.35, 12, 40), color: BLUE, at: [-15.5, -21, -11] },
    { geo: new DodecahedronGeometry(1.2, 0), color: CYAN, at: [15.5, -27, -10] },
    { geo: new IcosahedronGeometry(1.0, 0), color: PURPLE, at: [-14.5, -33, -9] },
    { geo: new OctahedronGeometry(0.9, 0), color: BLUE, at: [14.5, -38, -8] },
  ]
  for (const s of shapes) {
    const wire = new Mesh(s.geo, new MeshBasicMaterial({ color: s.color, wireframe: true, transparent: true, opacity: 0.22, blending: AdditiveBlending, depthWrite: false }))
    const core = new Mesh(s.geo, new MeshBasicMaterial({ color: s.color, transparent: true, opacity: 0.06, blending: AdditiveBlending, depthWrite: false }))
    const g = new Group()
    g.add(wire, core)
    g.position.set(...s.at)
    g.userData = { base: g.position.y, speed: 0.15 + Math.random() * 0.2, phase: Math.random() * 6 }
    scene.add(g)
    floaters.push(g)
  }

  // ── floor grid ─────────────────────────────────────────────
  const grid = new GridHelper(140, 70, CYAN, BLUE)
  grid.material.transparent = true
  grid.material.opacity = 0.16
  grid.material.depthWrite = false
  scene.add(grid)

  // ── hero: holographic rings + floating technology labels ──
  const hero = new Group()
  const ringMats = []
  ;[
    [3.2, CYAN, 0.55],
    [3.9, BLUE, 0.4],
    [4.6, PURPLE, 0.5],
  ].forEach(([r, c, o], i) => {
    const m = new MeshBasicMaterial({ color: c, transparent: true, opacity: o, blending: AdditiveBlending, depthWrite: false })
    ringMats.push(m)
    const ring = new Mesh(new TorusGeometry(r, 0.012 + i * 0.004, 8, 160), m)
    ring.rotation.set(1.1 + i * 0.25, i * 0.4, 0)
    ring.userData.spin = (i % 2 ? -1 : 1) * (0.12 + i * 0.05)
    hero.add(ring)
  })
  const labels = mobile ? [] : ['Vue.js', 'JavaScript', 'Ionic', 'Quasar', 'AI']
  const sprites = labels.map((text, i) => {
    const { tex, aspect } = makeLabelTexture(text)
    const sp = new Sprite(new SpriteMaterial({ map: tex, transparent: true, depthWrite: false }))
    const h = 0.42
    sp.scale.set(h * aspect, h, 1)
    sp.userData = { angle: (i / labels.length) * Math.PI * 2, radius: 4.9, bob: Math.random() * 6 }
    hero.add(sp)
    return sp
  })
  scene.add(hero)

  // ── contact: glowing knot at the end of the journey ───────
  const contact = new Group()
  const knotGeo = new TorusKnotGeometry(1.6, 0.42, 160, 18)
  contact.add(new Mesh(knotGeo, new MeshBasicMaterial({ color: PURPLE, wireframe: true, transparent: true, opacity: 0.32, blending: AdditiveBlending, depthWrite: false })))
  contact.add(new Mesh(knotGeo, new MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.07, blending: AdditiveBlending, depthWrite: false })))
  contact.position.set(6, -TRAVEL, -4)
  scene.add(contact)

  // ── state & layout ─────────────────────────────────────────
  const state = { scroll: 0, camY: 0, px: 0, py: 0, tx: 0, ty: 0, running: false, raf: 0, w: 1, h: 1, anchor: null }
  const HERO_Z = -1.5

  /** Convert a viewport rect (as measured at scroll 0) into the hero group's world position/scale. */
  function placeHero() {
    const a = state.anchor
    const dist = camera.position.z - HERO_Z
    const halfH = Math.tan(MathUtils.degToRad(camera.fov / 2)) * dist
    const halfW = halfH * camera.aspect
    if (!a) return hero.position.set(halfW * 0.5, 0, HERO_Z)
    const x = ((a.x / state.w) * 2 - 1) * halfW
    const y = -((a.y / state.h) * 2 - 1) * halfH
    hero.position.set(x, y, HERO_Z)
    const worldWidth = (a.width / state.w) * 2 * halfW
    hero.scale.setScalar(MathUtils.clamp(worldWidth / 2 / 3.6, 0.45, 1.3))
  }
  const clock = new Clock()

  function layout(w, h) {
    state.w = w
    state.h = h
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    const halfW = Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect
    contact.position.x = w >= 1024 ? halfW * 0.55 : 0
    placeHero()
  }

  function frame() {
    if (!state.running) return
    const t = clock.getElapsedTime()
    pMat.uniforms.uTime.value = t

    // camera follows scroll (eased) and pointer (parallax)
    const targetY = -state.scroll * TRAVEL
    state.camY += (targetY - state.camY) * 0.08
    state.px += (state.tx - state.px) * 0.05
    state.py += (state.ty - state.py) * 0.05
    camera.position.set(state.px * 0.9, state.camY - state.py * 0.6, 10)
    camera.lookAt(state.px * 0.3, state.camY, 0)

    grid.position.set(0, state.camY - 6.5, (t * 0.8) % 2)

    for (const f of floaters) {
      f.rotation.x = t * f.userData.speed
      f.rotation.y = t * f.userData.speed * 0.8
      f.position.y = f.userData.base + Math.sin(t * 0.6 + f.userData.phase) * 0.35
    }

    // hero group fades as you leave the hero
    const heroFade = MathUtils.clamp(1 - state.scroll * 6, 0, 1)
    hero.visible = heroFade > 0.01
    hero.children.forEach((c) => {
      if (c.userData.spin) {
        c.rotation.z += c.userData.spin * 0.01
        c.material.opacity = (c.material.userData.base ??= c.material.opacity) * heroFade
      }
    })
    sprites.forEach((sp) => {
      const a = sp.userData.angle + t * 0.12
      sp.position.set(Math.cos(a) * sp.userData.radius, Math.sin(a * 1.3) * 1.6 + Math.sin(t + sp.userData.bob) * 0.15, Math.sin(a) * 1.2)
      sp.material.opacity = heroFade
    })

    contact.rotation.x = t * 0.18
    contact.rotation.y = t * 0.24

    renderer.render(scene, camera)
    state.raf = requestAnimationFrame(frame)
  }

  return {
    resize: layout,
    /** Rect of the avatar in viewport px, measured as if scrolled to the top: { x, y, width } (centre). */
    setHeroAnchor(a) {
      state.anchor = a
      placeHero()
    },
    setScroll(p) {
      state.scroll = MathUtils.clamp(p, 0, 1)
    },
    setPointer(nx, ny) {
      state.tx = nx
      state.ty = ny
    },
    start() {
      if (state.running) return
      state.running = true
      clock.start()
      state.raf = requestAnimationFrame(frame)
    },
    stop() {
      state.running = false
      cancelAnimationFrame(state.raf)
    },
    dispose() {
      this.stop()
      scene.traverse((o) => {
        o.geometry?.dispose()
        const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []
        mats.forEach((m) => {
          m.map?.dispose()
          m.dispose()
        })
      })
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
