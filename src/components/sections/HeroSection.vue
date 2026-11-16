<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { ArrowRight, ArrowUpRight, Play } from 'lucide-vue-next'
import BaseButton from '../ui/BaseButton.vue'
import ProfilePortrait from '../ProfilePortrait.vue'
import AvatarVideo from '../AvatarVideo.vue'
import { gsap, SplitText, appState, motion, fontsReady } from '@/composables/motion'
import { site } from '@/config/site'
import { experience } from '@/data/content'
import { useGreeting } from '@/composables/useGreeting'

const root = ref(null)
const avatar = ref(null)
const hasVideo = !!site.avatarVideo?.src
const watching = ref(false) // while the intro plays with sound, the copy steps back on small screens
function watchIntro() {
  if (avatar.value) avatar.value.watchIntro()
  else document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}
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
  gsap.set(q('.hero-visual'), { autoAlpha: 0, scale: 1.08 })
  gsap.set(q('.scroll-cue'), { autoAlpha: 0 })
  // photo-portrait fallback (when no avatar video is configured)
  gsap.set(q('.portrait-slat'), { yPercent: 0, autoAlpha: 1 })
  gsap.set(q('.portrait-outline, .portrait-badge, .portrait-label'), { autoAlpha: 0 })

  intro = gsap
    .timeline({ paused: true, defaults: { ease: 'expo.out', duration: 1.3 } })
    .to(q('.hero-bg'), { autoAlpha: 1, duration: 1.6 }, 0)
    .to(q('.hero-visual'), { autoAlpha: 1, scale: 1, duration: 2.2, ease: 'power3.out' }, 0)
    .to(q('.portrait-slat'), { yPercent: 101, duration: 1.2, ease: 'expo.inOut', stagger: { each: 0.08, from: 'center' } }, 0.75)
    .to(chars ? name.chars : name.lines, { yPercent: 0, rotate: 0, stagger: chars ? 0.035 : 0.12 }, 0.2)
    .to(q('.hero-fade'), { autoAlpha: 1, y: 0, stagger: 0.07 }, 0.5)
    .to(counter, { v: site.experienceYears, duration: 1.6, ease: 'power3.out', onUpdate: () => (years.value = String(Math.round(counter.v))) }, 0.9)
    .to(q('.portrait-outline, .portrait-badge'), { autoAlpha: 1, duration: 1.2 }, 1.2)
    .fromTo(q('.portrait-label'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 1 }, 1.4)
    .to(q('.scroll-cue'), { autoAlpha: 1, duration: 1.2 }, 1.5)
    .call(() => (typeReady = true))
  let typeReady = false

  // scroll: the avatar recedes slightly, background layers move at different speeds, copy lifts away
  const st = { trigger: el, start: 'top top', end: 'bottom top', scrub: true }
  gsap.to(q('.hero-visual-wrap'), { yPercent: 14, ease: 'none', scrollTrigger: st })
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
    class="dark-scope relative isolate flex min-h-[100svh] items-end overflow-hidden bg-abyss pb-16 pt-[calc(var(--nav-h)+36svh)] text-ink sm:pb-20 md:pt-[calc(var(--nav-h)+40svh)] lg:items-center lg:pb-16 lg:pt-[calc(var(--nav-h)+2rem)]"
    aria-labelledby="hero-title"
  >
    <!-- full-bleed avatar video (or the photo portrait when no video is configured) -->
    <div class="hero-visual-wrap absolute inset-x-0 top-0 -z-20 h-[100svh] lg:bottom-0 lg:h-auto">
      <div class="hero-visual absolute inset-0" :class="motion.animate ? 'invisible' : ''">
        <AvatarVideo v-if="hasVideo" ref="avatar" variant="background" @mode="(m) => (watching = m === 'watching')" />
        <div v-else class="container-site flex h-full items-center justify-end">
          <div class="hidden w-[min(26rem,40vw)] lg:block"><ProfilePortrait /></div>
        </div>
      </div>
    </div>

    <!-- readability: dark gradients (from the copy side, the top for the nav, the bottom into the page) -->
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/80 via-55% to-transparent lg:hidden" />
      <div class="absolute inset-0 hidden bg-gradient-to-r from-abyss/95 via-abyss/70 via-45% to-transparent lg:block" />
      <div class="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-abyss/70 to-transparent" />
      <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-abyss to-transparent" />
      <!-- blue / purple ambient light -->
      <div
        class="absolute inset-0 mix-blend-screen"
        style="
          background: radial-gradient(42rem 30rem at 82% 18%, rgb(var(--c-cyan) / 0.16), transparent 65%),
            radial-gradient(40rem 30rem at 8% 92%, rgb(var(--c-warm) / 0.2), transparent 65%);
        "
      />
    </div>

    <!-- subtle futuristic grid over the video -->
    <div class="hero-bg pointer-events-none absolute inset-0 -z-[5]" :class="motion.animate ? 'invisible opacity-0' : ''" aria-hidden="true">
      <div class="hero-grid bg-grid mask-radial absolute -inset-y-24 inset-x-0 opacity-30" />
    </div>

    <div class="container-site relative" :class="watching ? 'max-lg:pointer-events-none' : ''">
      <!-- copy, over the video -->
      <div
        class="hero-copy max-w-2xl transition-opacity duration-700 lg:max-w-[46%]"
        :class="watching ? 'max-lg:opacity-25' : ''"
      >
        <p
          v-if="site.availability?.show"
          class="hero-fade mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-bg/70 py-1.5 pl-3 pr-4 text-xs font-medium backdrop-blur"
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

        <h1 id="hero-title" class="hero-name display-caps text-[clamp(2.9rem,6vw,6.25rem)] [text-shadow:0_2px_30px_rgb(0_0_0/0.45)]">
          Pavan<br />
          <em class="text-accent-ink [text-shadow:0_0_36px_rgb(var(--c-accent)/0.45)]">Ramshetty</em>
        </h1>

        <p class="hero-fade mt-6 text-lg font-semibold tracking-tight sm:text-xl">
          {{ site.title }}
          <span class="mx-2 font-normal text-line" aria-hidden="true">/</span>
          <span class="font-medium text-muted">{{ site.subtitle }}</span>
        </p>
        <p class="hero-fade mt-3 max-w-2xl font-display text-2xl italic text-ink/80 sm:text-[1.75rem]">
          Building Digital Experiences with Frontend Engineering and AI.
        </p>

        <p class="hero-fade mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink/75 sm:text-[1.0625rem]">
          I build clean, responsive, accessible, and user-focused web experiences. Combining frontend engineering
          with AI-assisted development to create better digital products.
        </p>

        <div class="hero-fade mt-8 flex flex-wrap items-center gap-3">
          <BaseButton v-if="hasVideo" cursor="Watch" @click="watchIntro">
            <Play class="h-4 w-4" fill="currentColor" aria-hidden="true" />
            Watch My Intro
          </BaseButton>
          <BaseButton href="#projects" :variant="hasVideo ? 'outline' : 'primary'" cursor="Explore">
            View Projects
            <ArrowRight class="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />
          </BaseButton>
          <BaseButton href="#contact" variant="ghost">
            <span class="link-underline">Contact Me</span>
            <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
          </BaseButton>
        </div>

        <dl class="hero-fade mt-10 grid max-w-lg grid-cols-2 gap-6 border-t border-white/15 pt-5">
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
