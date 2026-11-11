<script setup>
import { ref } from 'vue'
import { Check } from 'lucide-vue-next'
import SectionHeading from '../ui/SectionHeading.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { gsap } from '@/composables/motion'
import { experience } from '@/data/content'
import { site } from '@/config/site'

const root = ref(null)

// tenure, computed from the real start date in content data (e.g. "2 yrs 1 mo")
function tenure(start) {
  const [y, m] = start.split('-').map(Number)
  const now = new Date()
  let months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m)
  months = Math.max(0, months)
  const yrs = Math.floor(months / 12)
  const mo = months % 12
  return [yrs && `${yrs} yr${yrs > 1 ? 's' : ''}`, mo && `${mo} mo`].filter(Boolean).join(' ') || 'Just started'
}
const today = new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })

// Timeline spine draws as you scroll through the section
useScrollReveal(root, (el) => {
  const st = { trigger: el.querySelector('.tl'), start: 'top 70%', end: 'bottom 55%', scrub: true }
  gsap.fromTo(el.querySelector('.tl-spine'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: st })
  // glowing head that travels down the spine with scroll progress
  gsap.fromTo(el.querySelector('.tl-head'), { top: '0%' }, { top: '100%', ease: 'none', scrollTrigger: st })
})
</script>

<template>
  <section id="experience" ref="root" class="section overflow-hidden bg-subtle/60" aria-labelledby="experience-title">
    <!-- background year layer -->
    <p
      class="display-caps text-outline pointer-events-none absolute -right-6 top-1/3 select-none text-[clamp(9rem,26vw,24rem)]"
      data-parallax="0.35"
      aria-hidden="true"
    >
      2024
    </p>
    <div class="container-site relative">
      <SectionHeading id="experience-title" index="02" label="Experience">
        Where I’m <em class="text-accent-ink">building</em> now.
      </SectionHeading>

      <ol class="tl relative ml-1.5 sm:ml-0">
        <!-- spine -->
        <span class="absolute bottom-0 left-0 top-2 w-px bg-line sm:left-[13.5rem]" aria-hidden="true" />
        <span
          class="tl-spine absolute bottom-0 left-0 top-2 w-px origin-top bg-accent sm:left-[13.5rem]"
          aria-hidden="true"
        />
        <span class="absolute bottom-0 left-0 top-2 w-px sm:left-[13.5rem]" aria-hidden="true">
          <span
            class="tl-head absolute left-0 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_6px_rgb(var(--c-accent)/0.18),0_0_24px_4px_rgb(var(--c-accent)/0.45)] motion-reduced:hidden"
          />
        </span>

        <li
          v-for="job in experience"
          :key="job.company"
          class="relative grid gap-6 pb-16 pl-10 sm:grid-cols-[13.5rem_1fr] sm:gap-0 sm:pl-0"
        >
          <!-- node -->
          <span
            class="absolute left-0 top-2 grid h-3 w-3 -translate-x-1/2 place-items-center sm:left-[13.5rem]"
            aria-hidden="true"
          >
            <span v-if="job.current" class="absolute h-3 w-3 animate-ping rounded-full bg-accent/50" />
            <span class="relative h-3 w-3 rounded-full border-2 border-bg bg-accent ring-1 ring-accent" />
          </span>

          <div class="sm:pr-12 sm:text-right" data-reveal>
            <p class="label">{{ job.period }}</p>
            <p v-if="job.current" class="mt-3 inline-flex items-center gap-2 text-xs font-medium text-accent-ink">
              <span class="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /> Current role
            </p>
          </div>

          <article
            class="rounded-2xl border border-line bg-bg p-7 shadow-[0_1px_0_rgb(var(--c-line))] transition-shadow duration-700 hover:shadow-[0_30px_60px_-30px_rgb(var(--c-ink)/0.18)] sm:ml-12 sm:p-10"
            data-reveal="mask"
          >
            <header class="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
              <div>
                <h3 class="display-caps text-4xl sm:text-6xl" data-split="chars">{{ job.company }}</h3>
                <p class="mt-3 text-base font-semibold">{{ job.role }}</p>
              </div>
              <span class="tag">{{ job.type }}</span>
            </header>

            <p class="mt-6 max-w-2xl leading-relaxed text-muted">{{ job.summary }}</p>

            <!-- milestones: start → today, with tenure -->
            <div class="mt-8 rounded-2xl border border-line bg-subtle/60 p-5" data-reveal>
              <div class="flex items-center justify-between font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted">
                <span>Oct 2024 · Joined</span>
                <span class="text-accent-ink">{{ tenure(job.start) }}</span>
                <span>{{ today }} · Today</span>
              </div>
              <div class="relative mt-4 h-px bg-line">
                <span class="absolute inset-y-0 left-0 w-full origin-left bg-accent" data-line aria-hidden="true" />
                <span class="absolute -top-[5px] left-0 h-[11px] w-[11px] rounded-full border-2 border-accent bg-bg" aria-hidden="true" />
                <span class="absolute -top-[5px] right-0 h-[11px] w-[11px] rounded-full bg-accent shadow-[0_0_0_5px_rgb(var(--c-accent)/0.2)]" aria-hidden="true" />
              </div>
              <p class="sr-only">Joined in October 2024, {{ tenure(job.start) }} in the role so far.</p>
            </div>

            <ul class="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2" data-stagger="0.06">
              <li v-for="h in job.highlights" :key="h" class="flex items-start gap-3 text-[0.9375rem]">
                <Check class="mt-1 h-4 w-4 shrink-0 text-accent-ink" stroke-width="2" aria-hidden="true" />
                {{ h }}
              </li>
            </ul>

            <ul class="mt-8 flex flex-wrap gap-2" aria-label="Technologies">
              <li v-for="t in job.stack" :key="t" class="tag">{{ t }}</li>
            </ul>
          </article>
        </li>

        <!-- earlier career marker — no invented details -->
        <li class="relative grid gap-4 pl-10 sm:grid-cols-[13.5rem_1fr] sm:gap-0 sm:pl-0">
          <span
            class="absolute left-0 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-muted/60 bg-bg sm:left-[13.5rem]"
            aria-hidden="true"
          />
          <p class="label sm:pr-12 sm:text-right" data-reveal>Before 2024</p>
          <p class="text-muted sm:ml-12" data-reveal>
            <span class="font-display text-2xl italic text-ink">{{ site.experienceYears }}+ years of experience overall</span>
            <span class="mt-1 block text-sm">The full career history is available in my résumé.</span>
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>
