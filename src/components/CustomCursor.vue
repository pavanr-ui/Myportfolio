<script setup>
/**
 * Desktop-only custom cursor: a precise dot, a trailing ring that grows over interactive
 * elements and shows contextual labels (data-cursor="View"), plus a faint spotlight.
 * - Mounted only for fine pointers and when motion is allowed (see App.vue).
 * - pointer-events: none everywhere → never interferes with clicks.
 * - Moves with transforms via gsap.quickTo; no idle animation loop.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap, motion } from '@/composables/motion'

const dot = ref(null)
const ring = ref(null)
const spot = ref(null)
const label = ref('')
const state = ref('default') // default | link | label | text | hidden

const INTERACTIVE = 'a, button, [role="button"], summary, label[for], [data-cursor]'
const TEXT = 'input, textarea, select, [contenteditable]'

let cleanup

onMounted(() => {
  document.documentElement.classList.add('has-cursor')
  const opts = { duration: 0.18, ease: 'power3.out' }
  const dx = gsap.quickTo(dot.value, 'x', opts)
  const dy = gsap.quickTo(dot.value, 'y', opts)
  const rx = gsap.quickTo(ring.value, 'x', { duration: 0.55, ease: 'power3.out' })
  const ry = gsap.quickTo(ring.value, 'y', { duration: 0.55, ease: 'power3.out' })
  const sx = spot.value && gsap.quickTo(spot.value, 'x', { duration: 1.2, ease: 'power3.out' })
  const sy = spot.value && gsap.quickTo(spot.value, 'y', { duration: 1.2, ease: 'power3.out' })
  let visible = false

  const move = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return
    if (!visible) {
      visible = true
      gsap.set([dot.value, ring.value, spot.value].filter(Boolean), { x: e.clientX, y: e.clientY })
      gsap.to([dot.value, ring.value], { autoAlpha: 1, duration: 0.3 })
    }
    dx(e.clientX)
    dy(e.clientY)
    rx(e.clientX)
    ry(e.clientY)
    sx?.(e.clientX)
    sy?.(e.clientY)
  }

  const over = (e) => {
    const t = e.target
    if (!(t instanceof Element)) return
    if (t.closest(TEXT)) {
      state.value = 'text'
      return
    }
    const hit = t.closest(INTERACTIVE)
    if (!hit) {
      state.value = 'default'
      label.value = ''
      return
    }
    const l = hit.closest('[data-cursor]')?.dataset.cursor
    label.value = l || ''
    state.value = l ? 'label' : 'link'
  }

  const leaveWindow = () => {
    visible = false
    gsap.to([dot.value, ring.value], { autoAlpha: 0, duration: 0.3 })
  }
  const down = () => gsap.to(ring.value, { scale: 0.85, duration: 0.2 })
  const up = () => gsap.to(ring.value, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' })

  window.addEventListener('pointermove', move, { passive: true })
  document.addEventListener('pointerover', over, { passive: true })
  document.documentElement.addEventListener('pointerleave', leaveWindow)
  window.addEventListener('pointerdown', down, { passive: true })
  window.addEventListener('pointerup', up, { passive: true })

  cleanup = () => {
    document.documentElement.classList.remove('has-cursor')
    window.removeEventListener('pointermove', move)
    document.removeEventListener('pointerover', over)
    document.documentElement.removeEventListener('pointerleave', leaveWindow)
    window.removeEventListener('pointerdown', down)
    window.removeEventListener('pointerup', up)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-[300]" aria-hidden="true">
    <!-- soft spotlight (full mode only) -->
    <div
      v-if="motion.full"
      ref="spot"
      class="absolute left-0 top-0 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style="background: radial-gradient(circle, rgb(var(--c-accent) / 0.07), transparent 65%)"
    />
    <!-- trailing ring -->
    <div ref="ring" class="invisible absolute left-0 top-0 opacity-0" :class="state === 'label' ? '' : 'mix-blend-difference'">
      <div
        class="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition-[width,height,background-color,border-color,opacity] duration-500 ease-expo"
        :class="{
          'h-9 w-9 border-white/50': state === 'default',
          'h-14 w-14 border-white bg-white/10': state === 'link',
          'h-20 w-20 border-transparent bg-steel': state === 'label',
          'h-9 w-9 border-transparent opacity-0': state === 'text',
        }"
      >
        <span
          class="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-navy transition-opacity duration-300"
          :class="state === 'label' ? 'opacity-100' : 'opacity-0'"
          >{{ label }}</span
        >
      </div>
    </div>
    <!-- precise dot -->
    <div ref="dot" class="invisible absolute left-0 top-0 opacity-0 mix-blend-difference">
      <div
        class="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-opacity duration-300"
        :class="state === 'label' || state === 'text' ? 'opacity-0' : ''"
      />
    </div>
  </div>
</template>
