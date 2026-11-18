<script setup>
/**
 * Interactive 3D skills sphere (Three.js, lazy-loaded with this component).
 *  - Every skill from content data sits on a sphere (Fibonacci distribution), coloured by category
 *  - Drag to rotate (with inertia); it auto-rotates slowly when idle
 *  - Hover a skill → it grows and a caption shows its note; click → the category cards below are filtered
 *  - Renders only while on screen; everything is disposed on unmount
 * Decorative for pointer users — the same skills are listed as accessible cards below.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Group,
  Mesh,
  MeshBasicMaterial,
  IcosahedronGeometry,
  TorusGeometry,
  Sprite,
  SpriteMaterial,
  CanvasTexture,
  SRGBColorSpace,
  AdditiveBlending,
  Raycaster,
  Vector2,
  Vector3,
} from 'three'
import { skillCategories } from '@/data/content'

const emit = defineEmits(['select'])
const host = ref(null)
const canvas = ref(null)
const hovered = ref(null)

const COLORS = { frontend: '#22d3ee', frameworks: '#3b82f6', 'ai-tools': '#a855f7', development: '#38bdf8' }
const skills = skillCategories.flatMap((c) => c.items.map((i) => ({ ...i, cat: c.id, catTitle: c.title })))

function labelTexture(text, color) {
  const c = document.createElement('canvas')
  const g = c.getContext('2d')
  const font = '600 46px Manrope, system-ui, sans-serif'
  g.font = font
  const w = Math.ceil(g.measureText(text).width) + 100
  c.width = w
  c.height = 108
  const x = c.getContext('2d')
  x.beginPath()
  x.roundRect(4, 4, w - 8, 100, 50)
  x.fillStyle = 'rgba(10, 16, 36, 0.78)'
  x.fill()
  x.lineWidth = 3
  x.strokeStyle = color
  x.stroke()
  x.fillStyle = color
  x.beginPath()
  x.arc(42, 54, 9, 0, Math.PI * 2)
  x.fill()
  x.font = font
  x.fillStyle = '#ecf1ff'
  x.textBaseline = 'middle'
  x.fillText(text, 66, 56)
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 4
  return { tex, aspect: w / 108 }
}

let cleanup = () => {}

onMounted(() => {
  const el = canvas.value
  const box = host.value
  const renderer = new WebGLRenderer({ canvas: el, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5))
  renderer.setClearColor(0x000000, 0)
  const scene = new Scene()
  const camera = new PerspectiveCamera(40, 1, 0.1, 50)
  camera.position.set(0, 0, 11)

  const world = new Group()
  scene.add(world)

  // faint core + orbit rings
  const shell = new Mesh(
    new IcosahedronGeometry(2.9, 2),
    new MeshBasicMaterial({ color: '#3b82f6', wireframe: true, transparent: true, opacity: 0.09, blending: AdditiveBlending, depthWrite: false }),
  )
  const core = new Mesh(
    new IcosahedronGeometry(0.9, 1),
    new MeshBasicMaterial({ color: '#22d3ee', wireframe: true, transparent: true, opacity: 0.35, blending: AdditiveBlending, depthWrite: false }),
  )
  world.add(shell, core)
  const rings = [0, 1, 2].map((i) => {
    const r = new Mesh(
      new TorusGeometry(3.45, 0.008, 6, 180),
      new MeshBasicMaterial({ color: ['#22d3ee', '#8b5cf6', '#3b82f6'][i], transparent: true, opacity: 0.35, blending: AdditiveBlending, depthWrite: false }),
    )
    r.rotation.set(Math.PI / 2 + i * 0.6, i * 0.9, 0)
    scene.add(r)
    return r
  })

  // skills on a Fibonacci sphere
  const R = 3.45
  const golden = Math.PI * (3 - Math.sqrt(5))
  const sprites = skills.map((s, i) => {
    const y = 1 - (i / (skills.length - 1)) * 2
    const rad = Math.sqrt(1 - y * y)
    const th = golden * i
    const { tex, aspect } = labelTexture(s.name, COLORS[s.cat] || '#22d3ee')
    const sp = new Sprite(new SpriteMaterial({ map: tex, transparent: true, depthWrite: false }))
    const h = 0.5
    sp.scale.set(h * aspect, h, 1)
    sp.position.set(Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R)
    sp.userData = { skill: s, base: sp.scale.clone(), k: 0 }
    world.add(sp)
    return sp
  })

  // interaction
  const st = { rx: 0.25, ry: 0, vx: 0, vy: 0.0025, drag: false, lx: 0, ly: 0, moved: 0, inView: false, raf: 0, px: -9, py: -9 }
  const ray = new Raycaster()
  const ndc = new Vector2()
  const tmp = new Vector3()

  const rect = () => el.getBoundingClientRect()
  const down = (e) => {
    st.drag = true
    st.moved = 0
    st.lx = e.clientX
    st.ly = e.clientY
    el.setPointerCapture?.(e.pointerId)
  }
  const move = (e) => {
    const r = rect()
    st.px = ((e.clientX - r.left) / r.width) * 2 - 1
    st.py = -((e.clientY - r.top) / r.height) * 2 + 1
    if (!st.drag) return
    const dx = e.clientX - st.lx
    const dy = e.clientY - st.ly
    st.moved += Math.abs(dx) + Math.abs(dy)
    st.vy = dx * 0.0009
    st.vx = dy * 0.0009
    st.ry += dx * 0.006
    st.rx += dy * 0.006
    st.lx = e.clientX
    st.ly = e.clientY
  }
  const up = () => {
    if (st.drag && st.moved < 6 && hovered.value) emit('select', hovered.value.cat)
    st.drag = false
  }
  const leave = () => {
    st.px = st.py = -9
    st.drag = false
  }
  el.addEventListener('pointerdown', down)
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerup', up)
  el.addEventListener('pointerleave', leave)

  function resize() {
    const w = box.clientWidth
    const h = box.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.position.z = w < 640 ? 13.5 : 11
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(box)
  resize()

  function frame(t) {
    if (!st.inView) return
    if (!st.drag) {
      st.vy += (0.0025 - st.vy) * 0.02
      st.vx *= 0.95
      st.ry += st.vy
      st.rx += st.vx
      st.rx += (0.25 - st.rx) * 0.01
    }
    world.rotation.set(st.rx, st.ry, 0)
    core.rotation.y = -t * 0.0004
    rings.forEach((r, i) => (r.rotation.z += 0.0008 * (i % 2 ? -1 : 1)))

    // hover
    let hit = null
    if (st.px > -2) {
      ndc.set(st.px, st.py)
      ray.setFromCamera(ndc, camera)
      hit = ray.intersectObjects(sprites, false)[0]?.object || null
    }
    if ((hit?.userData.skill || null) !== hovered.value) hovered.value = hit?.userData.skill || null
    el.style.cursor = st.drag ? 'grabbing' : hit ? 'pointer' : 'grab'

    for (const sp of sprites) {
      sp.getWorldPosition(tmp)
      const front = (tmp.z / R + 1) / 2 // 0 back … 1 front
      sp.userData.k += ((sp === hit ? 1 : 0) - sp.userData.k) * 0.15
      const s = 0.72 + front * 0.38 + sp.userData.k * 0.35
      sp.scale.set(sp.userData.base.x * s, sp.userData.base.y * s, 1)
      sp.material.opacity = 0.25 + front * 0.75
      sp.renderOrder = Math.round(front * 100)
    }
    renderer.render(scene, camera)
    st.raf = requestAnimationFrame(frame)
  }

  const io = new IntersectionObserver(([e]) => {
    st.inView = e.isIntersecting
    cancelAnimationFrame(st.raf)
    if (st.inView) st.raf = requestAnimationFrame(frame)
  })
  io.observe(box)

  cleanup = () => {
    st.inView = false
    cancelAnimationFrame(st.raf)
    io.disconnect()
    ro.disconnect()
    el.removeEventListener('pointerdown', down)
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerup', up)
    el.removeEventListener('pointerleave', leave)
    scene.traverse((o) => {
      o.geometry?.dispose()
      if (o.material) {
        o.material.map?.dispose()
        o.material.dispose()
      }
    })
    renderer.dispose()
    renderer.forceContextLoss()
  }
})

onBeforeUnmount(() => cleanup())
</script>

<template>
  <div ref="host" class="relative h-[34rem] w-full select-none" aria-hidden="true">
    <canvas ref="canvas" class="h-full w-full touch-none" />
    <!-- caption for the hovered skill -->
    <div class="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
      <Transition
        mode="out-in"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        leave-active-class="transition duration-150"
        leave-to-class="opacity-0"
      >
        <p v-if="hovered" :key="hovered.name" class="glass rounded-full px-5 py-2 text-center text-sm">
          <span class="font-semibold text-ink">{{ hovered.name }}</span>
          <span class="mx-2 text-muted">·</span>
          <span class="text-muted">{{ hovered.note }}</span>
          <span class="ml-2 text-xs text-accent-ink">click to filter {{ hovered.catTitle }}</span>
        </p>
        <p v-else class="label text-[0.625rem] opacity-70">Drag to rotate · hover a skill</p>
      </Transition>
    </div>
  </div>
</template>
