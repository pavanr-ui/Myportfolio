<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineAsyncComponent } from 'vue'
import { ArrowRight, ArrowUpRight } from 'lucide-vue-next'
import BaseButton from '../ui/BaseButton.vue'
import ResumeButton from '../ui/ResumeButton.vue'
import ProfilePortrait from '../ProfilePortrait.vue'
import { gsap, SplitText, appState, motion, fontsReady } from '@/composables/motion'
import { site } from '@/config/site'
import { experience } from '@/data/content'
import { useGreeting } from '@/composables/useGreeting'

// heavy-ish visual, only fetched for full-motion visitors
const HeroParticles = motion.full ? defineAsyncComponent(() => import('../HeroParticles.vue')) : null

const root = ref(null)
const years = ref(String(site.experienceYears))
const current = experience[0]
const greeting = useGreeting()
let ctx
let intro
let alive = true

function setup(el) {
  const q = (s) => el.querySelectorAll(s)
  const chars = motion.full
  const name = SplitText.create(el.querySelector('.hero-name'), {
    type: chars ? 'lines,chars' : 'lines',
    mask: 'lines',
    linesClass: 'split-line',
  })
  const counter = { v: 0 }
  years.value = '0'

  // hidden start states — the intro curtain (or nothing yet painted) covers these
  gsap.set(chars ? name.chars : name.lines, { yPercent: 115, rotate: chars ? 8 : 0 })
  gsap.set(q('.hero-fade'), { autoAlpha: 0, y: 24 })
  gsap.set(q('.portrait-frame'), { clipPath: 'inset(100% 0% 0% 0%)' })
  gsap.set(q('.portrait-img'), { scale: 1.4 })
  gsap.set(q('.portrait-slat'), { yPercent: 0, autoAlpha: 1 })
  gsap.set(q('.portrait-outline, .portrait-badge, .portrait-label, .hero-deco, .scroll-cue'), { autoAlpha: 0 })

  intro = gsap
    .timeline({ paused: true, defaults: { ease: 'expo.out', duration: 1.3 } })
    .to(q('.hero-bg'), { autoAlpha: 1, duration: 1.6 }, 0)
    .to(q('.portrait-frame'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }, 0)
    .to(q('.portrait-slat'), { yPercent: 101, duration: 1.2, ease: 'expo.inOut', stagger: { each: 0.08, from: 'center' } }, 0.75)
    .to(q('.portrait-img'), { scale: 1.12, duration: 2.4 }, 0.6)
    .to(chars ? name.chars : name.lines, { yPercent: 0, rotate: 0, stagger: chars ? 0.035 : 0.12 }, 0.2)
    .to(q('.hero-fade'), { autoAlpha: 1, y: 0, stagger: 0.07 }, 0.5)
    .to(counter, { v: site.experienceYears, duration: 1.6, ease: 'power3.out', onUpdate: () => (years.value = String(Math.round(counter.v))) }, 0.9)
    .to(q('.portrait-outline'), { autoAlpha: 1, duration: 1.2 }, 1.2)
    .to(q('.portrait-badge'), { autoAlpha: 1, duration: 1 }, 1.35)
    .fromTo(q('.portrait-label'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 1 }, 1.4)
    .to(q('.hero-deco, .scroll-cue'), { autoAlpha: 1, stagger: 0.06, duration: 1.2 }, 1.5)
    .call(() => (typeReady = true))
  let typeReady = false

  // gentle floating for decorative marks and technical labels
  if (motion.full) {
    q('.portrait-label, .hero-deco').forEach((d, i) => {
      gsap.to(d, { y: i % 2 ? 10 : -10, duration: 3.5 + (i % 3), ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2 + i * 0.2 })
    })
  }

  // scroll: photo drifts inside the frame, background layers move at different speeds, copy lifts away
  const st = { trigger: el, start: 'top top', end: 'bottom top', scrub: true }
  gsap.to(q('.portrait-img'), { yPercent: 8, ease: 'none', scrollTrigger: st })
  gsap.to(q('.hero-grid'), { yPercent: 18, ease: 'none', scrollTrigger: st })
  gsap.to(q('.hero-copy'), { y: -70, autoAlpha: 0.2, ease: 'none', scrollTrigger: { ...st, start: 'center center' } })

  // pointer parallax on decorative layers (full motion, desktop)
  if (motion.full && motion.finePointer) {
    const layers = [...q('[data-depth]')].map((l) => ({
      d: parseFloat(l.dataset.depth),
      x: gsap.quickTo(l, 'x', { duration: 1.4, ease: 'power3.out' }),
      y: gsap.quickTo(l, 'y', { duration: 1.4, ease: 'power3.out' }),
    }))
    // interactive typography: letters of the name lift and lean toward the pointer
    const letters = chars
      ? name.chars.map((c) => ({
          el: c,
          y: gsap.quickTo(c, 'y', { duration: 0.6, ease: 'power3.out' }),
          r: gsap.quickTo(c, 'rotation', { duration: 0.6, ease: 'power3.out' }),
        }))
      : []
    let raf = 0
    const shapeType = (e) => {
      raf = 0
      if (!typeReady) return
      letters.forEach((l) => {
        const b = l.el.getBoundingClientRect()
        const dx = e.clientX - (b.left + b.width / 2)
        const dy = e.clientY - (b.top + b.height / 2)
        const f = Math.max(0, 1 - Math.hypot(dx, dy) / 220)
        l.y(-f * 16)
        l.r(f * (dx > 0 ? -4 : 4))
      })
    }
    const move = (e) => {
      const nx = e.clientX / innerWidth - 0.5
      const ny = e.clientY / innerHeight - 0.5
      layers.forEach((l) => {
        l.x(nx * l.d)
        l.y(ny * l.d)
      })
      if (!raf && letters.length) raf = requestAnimationFrame(() => shapeType(e))
    }
    el.addEventListener('pointermove', move, { passive: true })
    return () => el.removeEventListener('pointermove', move)
  }
}

onMounted(async () => {
  if (!motion.animate) return
  await fontsReady()
  if (!alive || !root.value) return
  // a function returned from the context callback runs on revert (removes listeners)
  ctx = gsap.context(() => setup(root.value), root.value)
  if (appState.ready) intro?.play()
})

watch(
  () => appState.ready,
  (r) => r && intro?.play(),
)

onBeforeUnmount(() => {
  alive = false
  ctx?.revert()
})
</script>

<template>
  <section
    id="home"
    ref="root"
    class="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-[calc(var(--nav-h)+2.5rem)] lg:pb-20"
    aria-labelledby="hero-title"
  >
    <!-- background layers -->
    <div class="hero-bg pointer-events-none absolute inset-0" :class="motion.animate ? 'invisible opacity-0' : ''" aria-hidden="true">
      <div class="hero-grid bg-grid mask-radial absolute -inset-y-24 inset-x-0" />
      <component :is="HeroParticles" v-if="HeroParticles" />
    </div>
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div data-depth="24" class="hero-deco absolute -bottom-56 -right-48 h-[36rem] w-[36rem] rounded-full border border-line" />
      <div data-depth="-30" class="hero-deco absolute left-[46%] top-[18%] hidden text-2xl font-light text-accent lg:block">+</div>
      <div data-depth="40" class="hero-deco absolute bottom-[22%] left-[38%] hidden h-2 w-2 rounded-full bg-accent/70 lg:block" />
    </div>

    <div class="container-site relative grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
      <!-- copy -->
      <div class="hero-copy lg:col-span-7">
        <p
          v-if="site.availability?.show"
          class="hero-fade mb-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-bg/70 py-1.5 pl-3 pr-4 text-xs font-medium backdrop-blur"
        >
          <span class="relative flex h-2 w-2" aria-hidden="true">
            <span class="css-loop absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {{ site.availability.label }}
        </p>

        <p class="hero-fade label mb-5 flex flex-wrap items-center gap-3">
          <span class="h-px w-8 bg-accent" aria-hidden="true" />
          <span class="text-warm">{{ greeting.text }}</span>
          <span class="text-line" aria-hidden="true">·</span>
          The digital identity of
        </p>

        <h1 id="hero-title" class="hero-name display-caps text-[clamp(3.1rem,8.6vw,8.25rem)]">
          Pavan<br />
          <em class="text-accent-ink">Ramshetty</em>
        </h1>

        <p class="hero-fade mt-8 text-lg font-semibold tracking-tight sm:text-xl">
          {{ site.title }}
          <span class="mx-2 font-normal text-line" aria-hidden="true">/</span>
          <span class="font-medium text-muted">{{ site.subtitle }}</span>
        </p>
        <p class="hero-fade mt-3 max-w-2xl font-display text-2xl italic text-ink/80 sm:text-[1.75rem]">
          Building Digital Experiences with Frontend Engineering and AI.
        </p>

        <p class="hero-fade mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-[1.0625rem]">
          I build clean, responsive, accessible, and user-focused web experiences. Combining frontend engineering
          with AI-assisted development to create better digital products.
        </p>

        <div class="hero-fade mt-10 flex flex-wrap items-center gap-3">
          <BaseButton href="#projects" cursor="Explore">
            Explore My Work
            <ArrowRight class="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />
          </BaseButton>
          <ResumeButton />
          <BaseButton href="#contact" variant="ghost">
            <span class="link-underline">Let’s Connect</span>
            <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
          </BaseButton>
        </div>

        <dl class="hero-fade mt-12 grid max-w-lg grid-cols-2 gap-6 border-t border-line pt-6">
          <div>
            <dt class="label">Experience</dt>
            <dd class="mt-2 font-display text-3xl">
              <span class="tabular-nums">{{ years }}</span>+ <span class="font-sans text-base text-muted">years of experience</span>
            </dd>
          </div>
          <div>
            <dt class="label">Currently</dt>
            <dd class="mt-2 text-sm leading-snug">
              {{ current.role }}<br />
              <span class="text-muted">at {{ current.company }}</span>
            </dd>
          </div>
        </dl>
      </div>

      <!-- portrait -->
      <div class="lg:col-span-5 lg:pl-6">
        <ProfilePortrait />
      </div>
    </div>

    <!-- scroll indicator -->
    <a
      href="#about"
      class="scroll-cue group absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      aria-label="Scroll to About section"
    >
      <span class="label text-[0.625rem]">Scroll</span>
      <span class="relative block h-14 w-px overflow-hidden bg-line">
        <span class="scroll-dot css-loop absolute left-0 top-0 h-5 w-px bg-ink" />
      </span>
    </a>
  </section>
</template>

<style scoped>
.scroll-dot {
  animation: drip 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}
@keyframes drip {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(300%); }
}
</style>
