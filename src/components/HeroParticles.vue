<script setup>
/**
 * Lightweight constellation particles for the hero (2D canvas, no libraries).
 * - Loaded lazily and only in full-motion mode.
 * - Particle count scales with area; DPR capped; loop pauses off-screen and in hidden tabs.
 * - Colours follow the active theme.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvas = ref(null)
let raf = 0
let running = false
let cleanup

onMounted(() => {
  const cv = canvas.value
  const ctx = cv.getContext('2d')
  const host = cv.parentElement
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  let w = 0
  let h = 0
  let pts = []
  let rgb = '128,149,181'
  const mouse = { x: -9999, y: -9999 }
  const LINK = 130

  const readColor = () => {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--c-accent').trim()
    if (v) rgb = v.split(/\s+/).join(',')
  }

  const resize = () => {
    w = host.clientWidth
    h = host.clientHeight
    cv.width = w * dpr
    cv.height = h * dpr
    cv.style.width = `${w}px`
    cv.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const n = Math.min(64, Math.round((w * h) / 22000))
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.3 + 0.5,
    }))
  }

  const frame = () => {
    if (!running) return
    ctx.clearRect(0, 0, w, h)
    for (const p of pts) {
      // gentle repel from pointer
      const mx = p.x - mouse.x
      const my = p.y - mouse.y
      const md = mx * mx + my * my
      if (md < 14000) {
        p.vx += (mx / 4000) * 0.6
        p.vy += (my / 4000) * 0.6
      }
      p.vx *= 0.985
      p.vy *= 0.985
      p.vx += (Math.random() - 0.5) * 0.008
      p.vy += (Math.random() - 0.5) * 0.008
      p.x += p.vx
      p.y += p.vy
      if (p.x < -10) p.x = w + 10
      if (p.x > w + 10) p.x = -10
      if (p.y < -10) p.y = h + 10
      if (p.y > h + 10) p.y = -10
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${rgb},0.55)`
      ctx.fill()
    }
    ctx.lineWidth = 0.6
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i]
        const b = pts[j]
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d < LINK) {
          ctx.strokeStyle = `rgba(${rgb},${(1 - d / LINK) * 0.22})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
    }
    raf = requestAnimationFrame(frame)
  }

  const start = () => {
    if (running || document.hidden) return
    running = true
    raf = requestAnimationFrame(frame)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }

  const onMove = (e) => {
    const r = cv.getBoundingClientRect()
    mouse.x = e.clientX - r.left
    mouse.y = e.clientY - r.top
  }
  const onLeave = () => {
    mouse.x = mouse.y = -9999
  }
  const onVis = () => (document.hidden ? stop() : visible && start())

  let visible = false
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    visible ? start() : stop()
  })
  const themeObs = new MutationObserver(readColor)
  const ro = new ResizeObserver(resize)

  readColor()
  resize()
  io.observe(cv)
  ro.observe(host)
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  host.addEventListener('pointermove', onMove, { passive: true })
  host.addEventListener('pointerleave', onLeave)
  document.addEventListener('visibilitychange', onVis)

  cleanup = () => {
    stop()
    io.disconnect()
    ro.disconnect()
    themeObs.disconnect()
    host.removeEventListener('pointermove', onMove)
    host.removeEventListener('pointerleave', onLeave)
    document.removeEventListener('visibilitychange', onVis)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <canvas ref="canvas" class="pointer-events-none absolute inset-0" aria-hidden="true" />
</template>
