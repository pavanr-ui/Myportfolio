<script setup>
/**
 * Orbital skills map — core technologies on the inner orbit, AI tools on the outer orbit,
 * connected to a central core by animated lines.
 *  - Rotation is pure CSS (compositor-only); it pauses on hover/focus, off-screen,
 *    and is switched off entirely in lite / reduced motion.
 *  - Every node is a real <button>: hover, focus or tap reveals its details in a live region.
 *  - Subtle 3D perspective that follows the pointer (full motion only).
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { gsap, motion } from '@/composables/motion'
import { skills, aiTools } from '@/data/content'

const INNER = 30 // radius in % of the container width (cqw)
const OUTER = 45

const inner = skills.map((s, i) => ({
  key: s.name,
  name: s.name,
  kind: 'Core technology',
  group: s.group,
  text: s.note,
  angle: (360 / skills.length) * i - 90,
}))
const outer = aiTools.map((t, i) => ({
  key: t.name,
  name: t.name,
  kind: 'AI tool',
  group: 'Learning & experimenting',
  text: t.use,
  angle: (360 / aiTools.length) * i - 45,
}))

const active = ref(null)
const inView = ref(true)
const paused = computed(() => !!active.value || !inView.value)
const current = computed(() => [...inner, ...outer].find((n) => n.key === active.value))

const root = ref(null)
const stage = ref(null)
const rad = (d) => (d * Math.PI) / 180
const endpoint = (angle, r) => ({ x: 50 + r * Math.cos(rad(angle)), y: 50 + r * Math.sin(rad(angle)) })

let cleanup

onMounted(() => {
  const io = new IntersectionObserver(([e]) => (inView.value = e.isIntersecting))
  io.observe(root.value)
  let off = () => {}
  if (motion.full && motion.finePointer) {
    const rx = gsap.quickTo(stage.value, 'rotationX', { duration: 1.2, ease: 'power3.out' })
    const ry = gsap.quickTo(stage.value, 'rotationY', { duration: 1.2, ease: 'power3.out' })
    const move = (e) => {
      const r = root.value.getBoundingClientRect()
      ry(((e.clientX - r.left) / r.width - 0.5) * 14)
      rx(-((e.clientY - r.top) / r.height - 0.5) * 14)
    }
    const leave = () => {
      rx(0)
      ry(0)
    }
    root.value.addEventListener('pointermove', move, { passive: true })
    root.value.addEventListener('pointerleave', leave)
    off = () => {
      root.value?.removeEventListener('pointermove', move)
      root.value?.removeEventListener('pointerleave', leave)
    }
  }
  cleanup = () => {
    io.disconnect()
    off()
  }
})
onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div class="grid items-center gap-12 lg:grid-cols-12">
    <!-- orbit -->
    <div ref="root" class="orbit relative mx-auto aspect-square w-full max-w-[40rem] lg:col-span-7" :class="{ paused }" style="perspective: 1200px; container-type: inline-size">
      <div ref="stage" class="absolute inset-0" style="transform-style: preserve-3d">
        <!-- orbit paths -->
        <svg viewBox="0 0 100 100" class="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="50" cy="50" :r="INNER" fill="none" stroke="rgb(var(--c-line))" stroke-width="0.25" stroke-dasharray="0.6 1.2" />
          <circle cx="50" cy="50" :r="OUTER" fill="none" stroke="rgb(var(--c-line))" stroke-width="0.25" />
          <circle cx="50" cy="50" r="16" fill="none" stroke="rgb(var(--c-accent) / 0.25)" stroke-width="0.2" />
        </svg>

        <!-- inner ring: core technologies -->
        <div class="orbit-ring css-loop absolute inset-0" style="--dur: 90s">
          <svg viewBox="0 0 100 100" class="absolute inset-0 h-full w-full" aria-hidden="true">
            <line
              v-for="n in inner"
              :key="'l' + n.key"
              x1="50" y1="50" :x2="endpoint(n.angle, INNER).x" :y2="endpoint(n.angle, INNER).y"
              class="flow css-loop"
              :stroke="active === n.key ? 'rgb(var(--c-accent))' : 'rgb(var(--c-accent) / 0.35)'"
              :stroke-width="active === n.key ? 0.45 : 0.22"
              stroke-dasharray="1 1.4"
            />
          </svg>
          <div
            v-for="n in inner"
            :key="n.key"
            class="absolute left-1/2 top-1/2"
            :style="{ transform: `rotate(${n.angle}deg) translateX(${INNER}cqw)` }"
          >
            <div class="counter css-loop" style="--dur: 90s">
              <button
                type="button"
                class="node absolute whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-semibold shadow-sm transition-[background-color,border-color,color,box-shadow] duration-300"
                :class="active === n.key ? 'border-accent bg-ink text-bg shadow-[0_0_0_6px_rgb(var(--c-accent)/0.18)]' : 'border-line bg-bg text-ink hover:border-accent'"
                :style="{ transform: `translate(-50%, -50%) rotate(${-n.angle}deg)` }"
                :aria-describedby="'orbit-info'"
                data-cursor="Info"
                @mouseenter="active = n.key"
                @mouseleave="active = null"
                @focus="active = n.key"
                @blur="active = null"
                @click="active = n.key"
              >
                {{ n.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- outer ring: AI tools (counter-direction) -->
        <div class="orbit-ring orbit-rev css-loop absolute inset-0" style="--dur: 140s">
          <svg viewBox="0 0 100 100" class="absolute inset-0 h-full w-full" aria-hidden="true">
            <line
              v-for="n in outer"
              :key="'l' + n.key"
              x1="50" y1="50" :x2="endpoint(n.angle, OUTER).x" :y2="endpoint(n.angle, OUTER).y"
              class="flow css-loop"
              :stroke="active === n.key ? 'rgb(var(--c-accent))' : 'rgb(var(--c-accent) / 0.2)'"
              :stroke-width="active === n.key ? 0.45 : 0.18"
              stroke-dasharray="0.6 2"
            />
          </svg>
          <div
            v-for="n in outer"
            :key="n.key"
            class="absolute left-1/2 top-1/2"
            :style="{ transform: `rotate(${n.angle}deg) translateX(${OUTER}cqw)` }"
          >
            <div class="counter counter-rev css-loop" style="--dur: 140s">
              <button
                type="button"
                class="node absolute flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-[0.75rem] shadow-sm transition-[background-color,border-color,color,box-shadow] duration-300"
                :class="active === n.key ? 'border-accent bg-accent text-navy shadow-[0_0_0_6px_rgb(var(--c-accent)/0.2)]' : 'border-ink/80 bg-ink text-bg hover:bg-accent-ink'"
                :style="{ transform: `translate(-50%, -50%) rotate(${-n.angle}deg)` }"
                :aria-describedby="'orbit-info'"
                data-cursor="Info"
                @mouseenter="active = n.key"
                @mouseleave="active = null"
                @focus="active = n.key"
                @blur="active = null"
                @click="active = n.key"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />{{ n.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- core -->
        <div class="absolute left-1/2 top-1/2 grid h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-bg" style="transform: translate(-50%, -50%) translateZ(40px)">
          <span class="pulse css-loop absolute inset-0 rounded-full border border-accent/50" aria-hidden="true" />
          <span class="text-center">
            <span class="block font-display text-[clamp(1.6rem,4cqw,2.4rem)] italic leading-none">pr</span>
            <span class="mt-1 block text-[0.5625rem] font-semibold uppercase tracking-[0.2em] text-bg/70">Frontend · AI</span>
          </span>
        </div>
      </div>
    </div>

    <!-- details panel -->
    <div class="lg:col-span-5">
      <div id="orbit-info" class="min-h-[13rem] rounded-2xl border border-line bg-bg/70 p-8 backdrop-blur" aria-live="polite">
        <template v-if="current">
          <p class="label">{{ current.kind }} · {{ current.group }}</p>
          <p class="display-caps mt-4 text-5xl">{{ current.name }}</p>
          <p class="mt-4 leading-relaxed text-muted">{{ current.text }}</p>
        </template>
        <template v-else>
          <p class="label">Explore the map</p>
          <p class="mt-4 font-display text-3xl italic leading-snug">Hover, tap or focus a technology to see how I use it.</p>
        </template>
      </div>
      <dl class="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div class="flex items-center gap-3">
          <span class="h-3 w-3 rounded-full border border-line bg-bg" aria-hidden="true" />
          <dt class="text-muted">Inner orbit</dt>
          <dd class="font-semibold">Core technologies</dd>
        </div>
        <div class="flex items-center gap-3">
          <span class="h-3 w-3 rounded-full bg-ink" aria-hidden="true" />
          <dt class="text-muted">Outer orbit</dt>
          <dd class="font-semibold">AI tools</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<style scoped>
.orbit-ring { animation: spin var(--dur) linear infinite; }
.orbit-rev { animation-direction: reverse; }
.counter { animation: spin var(--dur) linear infinite reverse; }
.counter-rev { animation-direction: normal; }
.flow { animation: flow 2.4s linear infinite; }
.pulse { animation: pulse 3.2s ease-out infinite; }
.orbit.paused .orbit-ring,
.orbit.paused .counter,
.orbit.paused .flow {
  animation-play-state: paused;
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes flow { to { stroke-dashoffset: -4.8; } }
@keyframes pulse {
  from { transform: scale(1); opacity: 0.8; }
  to { transform: scale(1.6); opacity: 0; }
}
</style>
