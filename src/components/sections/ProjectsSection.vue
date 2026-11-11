<script setup>
/**
 * Project gallery.
 *  - Desktop + full motion: a pinned, scrubbed horizontal gallery (native scrolling drives it —
 *    no wheel hijacking). Panels reveal with clip-path masks and character-split titles.
 *  - Everything else (mobile, lite, reduced): a stacked vertical gallery with mask reveals.
 */
import { ref, defineAsyncComponent } from 'vue'
import { ArrowRight, ArrowUpRight } from 'lucide-vue-next'
import ProjectCard from '../ProjectCard.vue'
import BaseButton from '../ui/BaseButton.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { gsap, SplitText, ScrollTrigger, motion } from '@/composables/motion'
import { useSound } from '@/composables/useSound'
import { projects } from '@/data/content'

const ProjectCaseStudy = defineAsyncComponent(() => import('../ProjectCaseStudy.vue'))

const horizontal = motion.full && window.matchMedia('(min-width: 1024px)').matches
const root = ref(null)
const track = ref(null)
const cards = ref([])
const active = ref(0)
const progress = ref(0)
const selected = ref(null)
const origin = ref(null)
const { play } = useSound()
const pad = (n) => String(n).padStart(2, '0')

function openProject({ project, from }) {
  origin.value = from
  selected.value = project
  play('open')
}
function navigate(dir) {
  const i = projects.findIndex((p) => p.id === selected.value.id)
  const next = projects[(i + dir + projects.length) % projects.length]
  selected.value = next
  origin.value = cards.value[projects.indexOf(next)]?.media ?? null
}
function closeProject() {
  selected.value = null
  play('close')
}

let pinST
useScrollReveal(root, (el) => {
  if (!horizontal) return
  const trackEl = track.value
  const distance = () => trackEl.scrollWidth - window.innerWidth

  const tween = gsap.to(trackEl, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: el.querySelector('.pj-pin'),
      pin: true,
      scrub: 0.8,
      start: 'top top',
      end: () => `+=${distance()}`,
      invalidateOnRefresh: true,
      refreshPriority: 1,
      anticipatePin: 1,
      onUpdate: (self) => (progress.value = self.progress),
    },
  })
  pinST = tween.scrollTrigger

  el.querySelectorAll('.pj').forEach((panel, i) => {
    const ca = { containerAnimation: tween, trigger: panel }
    gsap.fromTo(
      panel.querySelector('.pj-media'),
      { clipPath: 'inset(0% 0% 0% 100%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', ease: 'expo.inOut', duration: 1.4, scrollTrigger: { ...ca, start: 'left 88%', once: true } },
    )
    gsap.fromTo(
      panel.querySelector('.pj-img'),
      { xPercent: -8, scale: 1.15 },
      { xPercent: 8, scale: 1.05, ease: 'none', scrollTrigger: { ...ca, start: 'left right', end: 'right left', scrub: true } },
    )
    const title = SplitText.create(panel.querySelector('.pj-title'), { type: 'lines,chars', mask: 'lines', linesClass: 'split-line' })
    gsap.from(title.chars, { yPercent: 115, rotate: 6, stagger: 0.02, duration: 1.1, scrollTrigger: { ...ca, start: 'left 75%', once: true } })
    gsap.from(panel.querySelectorAll('.pj-meta'), { y: 24, autoAlpha: 0, stagger: 0.08, scrollTrigger: { ...ca, start: 'left 70%', once: true } })
    ScrollTrigger.create({ ...ca, start: 'left 55%', end: 'right 55%', onToggle: (s) => s.isActive && (active.value = i) })
  })

  // keyboard users: bring a focused panel into view by scrolling to its position on the track
  const onFocus = (e) => {
    const panel = e.target.closest('.pj-slide')
    if (!panel || !pinST) return
    const ratio = Math.min(1, Math.max(0, (panel.offsetLeft - window.innerWidth * 0.15) / distance()))
    window.scrollTo({ top: pinST.start + ratio * (pinST.end - pinST.start), behavior: 'auto' })
  }
  trackEl.addEventListener('focusin', onFocus)
  return () => trackEl.removeEventListener('focusin', onFocus)
})
</script>

<template>
  <section id="projects" ref="root" class="relative bg-bg" aria-labelledby="projects-title">
    <div class="pj-pin relative" :class="horizontal ? 'h-screen overflow-hidden' : ''">
      <div
        ref="track"
        class="flex"
        :class="horizontal ? 'h-full items-center gap-16 pb-12 pt-[var(--nav-h)] pl-[max(3rem,calc((100vw-84rem)/2+3rem))] pr-[12vw] will-change-transform' : 'container-site flex-col gap-24 py-24 sm:py-28'"
      >
        <!-- intro panel -->
        <header class="shrink-0" :class="horizontal ? 'w-[26rem] xl:w-[30rem]' : ''">
          <div class="mb-8 flex items-center gap-4" data-reveal>
            <span class="font-display text-lg italic text-accent-ink">04</span>
            <span class="h-px w-10 bg-line" aria-hidden="true" />
            <span class="label">Featured Work</span>
          </div>
          <h2 id="projects-title" class="display-caps text-[clamp(2.6rem,5vw,4.75rem)]" data-split="chars">
            Selected <em class="text-accent-ink">projects</em> &amp; focus areas
          </h2>
          <p class="mt-6 max-w-md leading-relaxed text-muted" data-reveal>
            The kinds of products I build day to day — from Vue.js applications and cross-platform apps to dashboards,
            AI Assistant experiences and my own AI developer journey.
          </p>
          <p v-if="horizontal" class="mt-10 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted" data-reveal>
            Scroll to explore <ArrowRight class="css-loop nudge h-4 w-4" aria-hidden="true" />
          </p>
        </header>

        <!-- project panels -->
        <div
          v-for="(p, i) in projects"
          :key="p.id"
          class="pj-slide shrink-0"
          :style="horizontal ? { width: p.featured ? 'min(78vw, calc((100svh - 16rem) * 2.7))' : 'min(48vw, calc((100svh - 28rem) * 1.6))' } : null"
        >
          <ProjectCard :ref="(c) => (cards[i] = c)" :project="p" :total="projects.length" :stacked="!horizontal" @open="openProject" />
        </div>

        <!-- closing panel -->
        <div class="flex shrink-0 flex-col justify-center" :class="horizontal ? 'w-[24rem]' : ''" data-reveal>
          <p class="display-caps text-4xl">More case studies <em class="text-accent-ink">soon</em>.</p>
          <p class="mt-4 max-w-sm text-muted">Detailed write-ups and screenshots are on the way. In the meantime, let’s talk.</p>
          <div class="mt-8">
            <BaseButton href="#contact" variant="outline">
              Let’s Connect <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- gallery HUD: counter + progress -->
      <div v-if="horizontal" class="pointer-events-none absolute inset-x-0 bottom-8" aria-hidden="true">
        <div class="container-site flex items-center gap-6">
          <span class="font-mono text-sm tabular-nums">
            <span class="relative inline-block h-[1.2em] w-[1.4em] overflow-hidden align-bottom">
              <Transition
                enter-active-class="transition duration-500 ease-expo"
                enter-from-class="translate-y-full"
                leave-active-class="absolute transition duration-500 ease-expo"
                leave-to-class="-translate-y-full"
              >
                <span :key="active" class="absolute inset-0">{{ pad(active + 1) }}</span>
              </Transition>
            </span>
            <span class="text-muted"> / {{ pad(projects.length) }}</span>
          </span>
          <span class="relative h-px flex-1 bg-line">
            <span class="absolute inset-y-0 left-0 w-full origin-left bg-ink" :style="{ transform: `scaleX(${progress})` }" />
          </span>
          <span class="max-w-[16rem] truncate text-xs text-muted">{{ projects[active].title }}</span>
        </div>
      </div>
    </div>

    <ProjectCaseStudy
      v-if="selected"
      :project="selected"
      :origin="origin"
      :index="projects.findIndex((p) => p.id === selected.id)"
      :total="projects.length"
      @prev="navigate(-1)"
      @next="navigate(1)"
      @close="closeProject"
    />
  </section>
</template>

<style scoped>
.nudge { animation: nudge 1.8s ease-in-out infinite; }
@keyframes nudge { 50% { transform: translateX(6px); } }
</style>
