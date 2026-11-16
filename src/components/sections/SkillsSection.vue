<script setup>
import { ref, defineAsyncComponent } from 'vue'
import SectionHeading from '../ui/SectionHeading.vue'
import SkillGlyph from '../SkillGlyph.vue'
import TiltCard from '../ui/TiltCard.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { skills, skillGroups } from '@/data/content'

// The orbital map is loaded lazily and only on tablet/desktop widths;
// phones get the readable index below.
const showOrbit = window.matchMedia('(min-width: 768px)').matches
const SkillsOrbit = showOrbit ? defineAsyncComponent(() => import('../SkillsOrbit.vue')) : null

const root = ref(null)
const filter = ref('All')
const matches = (s) => filter.value === 'All' || s.group === filter.value
const count = (g) => (g === 'All' ? skills.length : skills.filter((s) => s.group === g).length)


useScrollReveal(root)
</script>

<template>
  <section id="skills" ref="root" class="section overflow-hidden" aria-labelledby="skills-title">
    <div class="container-site">
      <SectionHeading id="skills-title" index="03" label="Technical Skills">
        The <em class="text-accent-ink">toolkit</em> I build with.
        <template #intro>
          A focused set of technologies I use to ship responsive, accessible interfaces — from the foundations of the
          web to Vue-powered application frameworks.
        </template>
      </SectionHeading>

      <!-- interactive orbital map (tablet / desktop) -->
      <div v-if="SkillsOrbit" class="mb-28 min-h-[30rem]" data-reveal>
        <component :is="SkillsOrbit" />
      </div>

      <p class="label mb-6" data-reveal>Skills index</p>
      <!-- category grouping -->
      <div class="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter skills by category" data-reveal>
        <button
          v-for="g in skillGroups"
          :key="g"
          type="button"
          class="rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-300"
          :class="filter === g ? 'border-ink bg-ink text-bg' : 'border-line text-muted hover:border-ink/40 hover:text-ink'"
          :aria-pressed="filter === g"
          @click="filter = g"
        >
          {{ g }} <span class="ml-1 tabular-nums opacity-60">{{ count(g) }}</span>
        </button>
      </div>

      <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" data-stagger="0.07">
        <TiltCard
          v-for="(s, i) in skills"
          :key="s.name"
          tag="li"
          :max="10"
          class="transition-opacity duration-500"
          :class="matches(s) ? 'opacity-100' : 'opacity-30'"
          :aria-hidden="matches(s) ? undefined : 'true'"
        >
          <div class="flex min-h-[15rem] flex-col justify-between p-7">
            <div class="flex items-start justify-between">
              <span class="font-display text-lg italic text-accent-ink">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="label text-[0.625rem]">{{ s.group }}</span>
            </div>
            <SkillGlyph
              :name="s.name"
              class="mt-6 text-muted transition-[color,transform] duration-700 ease-expo group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:text-cyan"
            />
            <div>
              <h3 class="display text-[2.75rem] transition-transform duration-700 ease-expo group-hover:-translate-y-1 sm:text-5xl">
                {{ s.name }}
              </h3>
              <p class="mt-3 text-sm leading-relaxed text-muted">{{ s.note }}</p>
            </div>
          </div>
        </TiltCard>
        <!-- closing tile completes the grid at lg (7 skills + 1) -->
        <li class="glass hidden flex-col justify-end rounded-2xl p-7 lg:flex" aria-hidden="true">
          <p class="font-display text-2xl italic leading-snug text-muted">…and always learning the next one.</p>
        </li>
      </ul>
    </div>

    <!-- slow marquee of skill names -->
    <div class="mt-24 select-none border-y border-line py-6" aria-hidden="true">
      <div class="marquee css-loop flex w-max whitespace-nowrap">
        <template v-for="n in 2" :key="n">
          <span v-for="s in skills" :key="s.name + n" class="display flex items-center gap-12 pr-12 text-5xl text-ink/80 sm:text-6xl">
            {{ s.name }} <span class="text-2xl text-accent">✦</span>
          </span>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee {
  animation: marquee 40s linear infinite;
}
.marquee:hover {
  animation-play-state: paused;
}
@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}
</style>
