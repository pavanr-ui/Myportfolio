<script setup>
/**
 * Page background.
 *  - Full motion + WebGL + dark theme → lazy-loads Three.js and renders the 3D scene
 *    (src/scene/createScene.js) on one fixed, transparent canvas behind the content.
 *  - Otherwise (reduced motion, simplified motion, data saver, no WebGL, light theme)
 *    → a static CSS gradient background. No 3D code is downloaded at all.
 * Rendering pauses when the tab is hidden; everything is disposed on unmount.
 */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { motion, appState } from '@/composables/motion'
import { useTheme } from '@/composables/useTheme'

const canvas = ref(null)
const active = ref(false)
const { isDark } = useTheme()

function webglSupported() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const capable = motion.full && !navigator.connection?.saveData && webglSupported()
let api
let cleanup = () => {}

function sync() {
  const on = !!api && isDark.value && !document.hidden
  active.value = !!api && isDark.value
  document.documentElement.classList.toggle('has-3d', active.value)
  on ? api.start() : api?.stop()
}

async function boot() {
  if (!capable || api) return
  const { createScene } = await import('@/scene/createScene.js')
  const mobile = window.innerWidth < 768
  api = createScene(canvas.value, { mobile })

  // keep the hero rings centred on the avatar video
  const anchor = () => {
    const el = document.querySelector('.avatar-frame') || document.querySelector('.hero-visual')
    if (!el) return
    const r = el.getBoundingClientRect()
    api.setHeroAnchor({ x: r.left + r.width / 2, y: r.top + window.scrollY + r.height / 2, width: r.width })
  }
  const onResize = () => {
    api.resize(window.innerWidth, window.innerHeight)
    anchor()
  }
  let raf = 0
  const onScroll = () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      api.setScroll(max > 0 ? window.scrollY / max : 0)
    })
  }
  const onPointer = (e) => api.setPointer(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5)

  onResize()
  onScroll()
  const settle = setTimeout(anchor, 2000) // after the hero entrance (the avatar scales in) has finished
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  if (motion.finePointer) window.addEventListener('pointermove', onPointer, { passive: true })
  document.addEventListener('visibilitychange', sync)
  cleanup = () => {
    clearTimeout(settle)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('pointermove', onPointer)
    document.removeEventListener('visibilitychange', sync)
    cancelAnimationFrame(raf)
  }
  sync()
}

onMounted(() => {
  if (!capable) return
  // load after the hero has started, when the browser is idle → never competes with first paint
  const go = () => (window.requestIdleCallback ? requestIdleCallback(boot, { timeout: 2500 }) : setTimeout(boot, 600))
  if (appState.ready) go()
  else watch(() => appState.ready, (r) => r && go(), { once: true })
})
watch(isDark, () => api && sync())

onBeforeUnmount(() => {
  cleanup()
  api?.dispose()
  api = null
  document.documentElement.classList.remove('has-3d')
})
</script>

<template>
  <div class="pointer-events-none fixed inset-0 -z-[1]" aria-hidden="true">
    <!-- static fallback — always present underneath, fades out when 3D takes over -->
    <div class="static-bg absolute inset-0 transition-opacity duration-1000" :class="active ? 'opacity-0' : 'opacity-100'" />
    <canvas
      v-if="capable"
      ref="canvas"
      class="absolute inset-0 h-full w-full transition-opacity duration-1000"
      :class="active ? 'opacity-100' : 'opacity-0'"
    />
  </div>
</template>
