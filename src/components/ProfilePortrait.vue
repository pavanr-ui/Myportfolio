<script setup>
/**
 * Hero portrait. The photo itself is never filtered or altered — only framed, masked and lit.
 *  - Slatted mask reveal + clip-path (driven by the hero intro timeline via class hooks)
 *  - Subtle 3D depth: layers sit at different Z depths and tilt with the pointer
 *  - Interactive spotlight that follows the pointer across the photo
 *  - Floating technical labels
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap, motion } from '@/composables/motion'
import { site } from '@/config/site'
import { heroLabels } from '@/data/content'

const failed = ref(!site.photo)
const isDev = import.meta.env.DEV
const ring = 'VUE.JS · IONIC · QUASAR · AI-ASSISTED · FRONTEND · '
const root = ref(null)
const stage = ref(null)
const frame = ref(null)

// label placement around the arch (percent offsets) and depth
const spots = [
  { cls: '-left-4 top-[14%] sm:-left-10', z: 90 },
  { cls: '-right-3 top-[34%] sm:-right-8', z: 120 },
  { cls: '-left-3 top-[60%] hidden sm:flex sm:-left-14', z: 70 },
  { cls: '-right-2 bottom-[18%] sm:-right-12', z: 100 },
  { cls: 'right-[18%] -top-3 hidden sm:flex', z: 60 },
]

let cleanup

onMounted(() => {
  if (!motion.full || !motion.finePointer) return
  const host = root.value.closest('section') || root.value
  const rx = gsap.quickTo(stage.value, 'rotationX', { duration: 1.2, ease: 'power3.out' })
  const ry = gsap.quickTo(stage.value, 'rotationY', { duration: 1.2, ease: 'power3.out' })

  const move = (e) => {
    const nx = e.clientX / window.innerWidth - 0.5
    const ny = e.clientY / window.innerHeight - 0.5
    ry(nx * 10)
    rx(-ny * 7)
    const r = frame.value.getBoundingClientRect()
    frame.value.style.setProperty('--sx', `${e.clientX - r.left}px`)
    frame.value.style.setProperty('--sy', `${e.clientY - r.top}px`)
  }
  const leave = () => {
    rx(0)
    ry(0)
    frame.value.style.setProperty('--sx', '50%')
    frame.value.style.setProperty('--sy', '30%')
  }
  host.addEventListener('pointermove', move, { passive: true })
  host.addEventListener('pointerleave', leave)
  cleanup = () => {
    host.removeEventListener('pointermove', move)
    host.removeEventListener('pointerleave', leave)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <figure ref="root" class="portrait relative mx-auto w-full max-w-[24rem] sm:max-w-[26rem] lg:max-w-none" style="perspective: 1400px">
    <div ref="stage" class="relative" style="transform-style: preserve-3d">
      <!-- offset hairline arch, set back in depth -->
      <div
        class="portrait-outline pointer-events-none absolute inset-0 rounded-t-full border border-accent/50"
        style="transform: translate3d(1.25rem, 1.25rem, -60px)"
        aria-hidden="true"
      />

      <!-- the frame: clip-path animated on reveal -->
      <div
        ref="frame"
        class="portrait-frame relative aspect-[4/5] overflow-hidden rounded-t-full bg-subtle shadow-[0_40px_80px_-40px_rgb(16_24_40/0.45)]"
        style="--sx: 50%; --sy: 30%"
      >
        <img
          v-if="!failed"
          :src="site.photo"
          :alt="site.photoAlt"
          :width="site.photoWidth || 1200"
          :height="site.photoHeight || 1500"
          fetchpriority="high"
          decoding="async"
          class="portrait-img absolute inset-0 h-full w-full scale-[1.12] object-cover"
          :style="{ objectPosition: site.photoPosition || '50% 30%' }"
          @error="failed = true"
        />
        <!-- graceful fallback until a photo is supplied -->
        <div v-else class="portrait-img absolute inset-0 grid scale-[1.12] place-items-center" role="img" :aria-label="site.photoAlt">
          <div class="absolute inset-0 bg-gradient-to-b from-subtle to-line/60" />
          <div class="relative text-center">
            <span class="display block text-[clamp(6rem,14vw,10rem)] italic text-accent-ink/70">{{ site.initials.toLowerCase() }}</span>
            <span v-if="isDev" class="label mt-4 block px-8 normal-case tracking-normal">
              Add your photo in <code>src/assets</code> and set it in <code>src/config/site.js</code>
            </span>
          </div>
        </div>

        <!-- interactive spotlight (light only — the photo is untouched) -->
        <div
          class="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style="background: radial-gradient(26rem circle at var(--sx) var(--sy), rgb(255 255 255 / 0.35), transparent 60%)"
          aria-hidden="true"
        />
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" aria-hidden="true" />

        <!-- cinematic slats (start off-frame; the hero intro drops them in and lifts them away) -->
        <div class="pointer-events-none absolute inset-0 flex" aria-hidden="true">
          <span v-for="i in 5" :key="i" class="portrait-slat invisible h-full flex-1 bg-abyss" />
        </div>
      </div>

      <!-- floating technical labels at different depths -->
      <span
        v-for="(l, i) in heroLabels"
        :key="l"
        class="portrait-label pointer-events-none absolute z-10 flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-bg/85 px-3 py-1.5 font-mono text-[0.6875rem] text-ink shadow-sm backdrop-blur"
        :class="spots[i]?.cls"
        :style="{ transform: `translateZ(${spots[i]?.z || 60}px)` }"
        aria-hidden="true"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-accent" />{{ l }}
      </span>

      <!-- rotating ring badge -->
      <div
        class="portrait-badge absolute -bottom-8 -left-4 grid h-28 w-28 place-items-center rounded-full border border-line bg-bg/90 backdrop-blur sm:-left-10 sm:h-32 sm:w-32"
        style="transform: translateZ(80px)"
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" class="spin-slow css-loop absolute inset-0 h-full w-full p-2 text-ink">
          <defs><path id="ring-path" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
          <text font-size="8.4" letter-spacing="1.6" fill="currentColor" font-family="Manrope, sans-serif" font-weight="600">
            <textPath href="#ring-path">{{ ring }}</textPath>
          </text>
        </svg>
        <span class="font-display text-2xl italic text-accent-ink">{{ site.experienceYears }}+</span>
      </div>
    </div>

    <figcaption class="mt-12 flex items-center justify-end gap-3 text-xs text-muted sm:mt-6">
      <span class="h-px w-8 bg-line" aria-hidden="true" />
      {{ site.name }} — {{ site.title }}
    </figcaption>
  </figure>
</template>

<style scoped>
.spin-slow {
  animation: spin 22s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
