<script setup>
/**
 * Interactive digital profile card: tilts in 3D with a light glare, and flips to show
 * what I'm working with and learning. The flip is a real button (keyboard + screen readers).
 * Only facts from site config / content data are shown.
 */
import { ref } from 'vue'
import { RotateCw, Linkedin, Github, Download } from 'lucide-vue-next'
import { useTilt } from '@/composables/useTilt'
import { useSound } from '@/composables/useSound'
import { site } from '@/config/site'
import { experience, skills, aiTools } from '@/data/content'

const card = ref(null)
const flipped = ref(false)
const { play } = useSound()
const job = experience[0]
useTilt(card, { max: 7 })

function flip() {
  flipped.value = !flipped.value
  play('toggle')
}
</script>

<template>
  <div class="relative mx-auto w-full max-w-sm">
    <div ref="card" class="group relative aspect-[3/4] w-full will-change-transform" style="transform-style: preserve-3d">
      <div
        class="absolute inset-0 transition-transform duration-[900ms] ease-expo motion-reduced:duration-0"
        :style="{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }"
      >
        <!-- front -->
        <div
          class="absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.5)]"
          style="backface-visibility: hidden"
          :aria-hidden="flipped"
        >
          <div class="flex items-start justify-between">
            <span class="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted">Digital ID · {{ site.initials }}</span>
            <span class="h-2 w-2 rounded-full bg-warm" aria-hidden="true" />
          </div>
          <div class="mt-6 flex items-center gap-4">
            <img
              :src="site.photo"
              :alt="site.photoAlt"
              width="72"
              height="72"
              loading="lazy"
              decoding="async"
              class="h-[4.5rem] w-[4.5rem] rounded-2xl object-cover"
              :style="{ objectPosition: site.photoPosition }"
            />
            <div>
              <p class="display-caps text-3xl leading-none">{{ site.name }}</p>
              <p class="mt-2 text-sm text-muted">{{ site.title }}</p>
            </div>
          </div>
          <dl class="mt-auto grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm">
            <div>
              <dt class="label text-[0.625rem]">Experience</dt>
              <dd class="mt-1 font-display text-2xl">{{ site.experienceYears }}+ yrs</dd>
            </div>
            <div>
              <dt class="label text-[0.625rem]">Currently</dt>
              <dd class="mt-1 leading-snug">{{ job.role }}<br /><span class="text-muted">{{ job.company }}</span></dd>
            </div>
          </dl>
          <div class="mt-5 flex items-center gap-2">
            <a v-if="site.contact.linkedin" :href="site.contact.linkedin" target="_blank" rel="noopener noreferrer" class="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-ink" aria-label="LinkedIn profile">
              <Linkedin class="h-4 w-4" aria-hidden="true" />
            </a>
            <a v-if="site.contact.github" :href="site.contact.github" target="_blank" rel="noopener noreferrer" class="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-ink" aria-label="GitHub profile">
              <Github class="h-4 w-4" aria-hidden="true" />
            </a>
            <a v-if="site.resumeUrl" :href="site.resumeUrl" download class="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-ink" aria-label="Download résumé">
              <Download class="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <!-- glare -->
          <div
            class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style="background: radial-gradient(18rem circle at var(--gx, 50%) var(--gy, 0%), rgb(255 255 255 / 0.10), transparent 60%)"
            aria-hidden="true"
          />
        </div>

        <!-- back -->
        <div
          class="absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-line bg-ink p-6 text-bg"
          style="backface-visibility: hidden; transform: rotateY(180deg)"
          :aria-hidden="!flipped"
        >
          <span class="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-bg/60">Stack &amp; learning</span>
          <p class="label mt-6 text-bg/60">Builds with</p>
          <ul class="mt-3 flex flex-wrap gap-1.5">
            <li v-for="s in skills" :key="s.name" class="rounded-full border border-bg/20 px-2.5 py-1 text-xs">{{ s.name }}</li>
          </ul>
          <p class="label mt-6 text-bg/60">Learning with</p>
          <ul class="mt-3 flex flex-wrap gap-1.5">
            <li v-for="t in aiTools" :key="t.name" class="rounded-full bg-bg/10 px-2.5 py-1 font-mono text-[0.6875rem]">{{ t.name }}</li>
          </ul>
          <p class="mt-auto font-display text-xl italic leading-snug text-bg/80">“AI-assisted productivity, human-verified.”</p>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="mx-auto mt-5 flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold transition-colors hover:border-ink"
      :aria-pressed="flipped"
      data-cursor="Flip"
      @click="flip"
    >
      <RotateCw class="h-3.5 w-3.5 transition-transform duration-500" :class="flipped ? 'rotate-180' : ''" aria-hidden="true" />
      {{ flipped ? 'Show profile' : 'Flip card — stack & learning' }}
    </button>
  </div>
</template>
