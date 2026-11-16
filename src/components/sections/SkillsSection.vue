<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import {
  MessageSquareText,
  Sparkles,
  SquareTerminal,
  Code2,
  MonitorSmartphone,
  Accessibility,
  Layers,
  Wand2,
} from 'lucide-vue-next'
import SectionHeading from '../ui/SectionHeading.vue'
import SkillGlyph from '../SkillGlyph.vue'
import TiltCard from '../ui/TiltCard.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { skills, skillCategories } from '@/data/content'

// The orbital map is loaded lazily and only on tablet/desktop widths;
// phones get the readable category cards below.
const showOrbit = window.matchMedia('(min-width: 768px)').matches
const SkillsOrbit = showOrbit ? defineAsyncComponent(() => import('../SkillsOrbit.vue')) : null

const icons = { MessageSquareText, Sparkles, SquareTerminal, Code2, MonitorSmartphone, Accessibility, Layers, Wand2 }

const root = ref(null)
const filter = ref('all')
const filters = computed(() => [
  { id: 'all', title: 'All', count: skillCategories.reduce((n, c) => n + c.items.length, 0) },
  ...skillCategories.map((c) => ({ id: c.id, title: c.title, count: c.items.length })),
])
const visible = computed(() => (filter.value === 'all' ? skillCategories : skillCategories.filter((c) => c.id === filter.value)))
// grid columns follow the category size so short categories don't leave holes
const cols = (n) => (n === 5 ? 'sm:grid-cols-2 lg:grid-cols-6' : n >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2')
// 5 items → a balanced 3 + 2 on desktop; an odd last card spans the row on tablet
const span = (n, i) =>
  [n === 5 ? (i < 3 ? 'lg:col-span-2' : 'lg:col-span-3') : '', n % 2 === 1 && i === n - 1 ? 'sm:col-span-2' : ''].join(' ')

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

      <!-- category switcher -->
      <div class="mb-12 flex flex-wrap gap-2" role="group" aria-label="Show skill category" data-reveal>
        <button
          v-for="f in filters"
          :key="f.id"
          type="button"
          class="rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-300"
          :class="filter === f.id ? 'border-ink bg-ink text-bg' : 'border-line text-muted hover:border-ink/40 hover:text-ink'"
          :aria-pressed="filter === f.id"
          @click="filter = f.id"
        >
          {{ f.title }} <span class="ml-1 tabular-nums opacity-60">{{ f.count }}</span>
        </button>
      </div>

      <!-- category-based layout -->
      <div class="space-y-16">
        <section
          v-for="(cat, ci) in visible"
          :key="cat.id"
          class="grid gap-8 lg:grid-cols-12 lg:gap-10"
          :aria-labelledby="`skills-cat-${cat.id}`"
        >
          <header class="lg:col-span-3" data-reveal>
            <p class="font-display text-lg italic text-accent-ink">
              {{ String(skillCategories.indexOf(cat) + 1).padStart(2, '0') }}
            </p>
            <h3 :id="`skills-cat-${cat.id}`" class="display-caps mt-2 text-4xl">{{ cat.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-muted">{{ cat.blurb }}</p>
            <span class="mt-4 block h-px w-16 bg-gradient-to-r from-cyan via-accent to-warm" aria-hidden="true" />
          </header>

          <ul class="grid grid-cols-1 gap-4 lg:col-span-9" :class="cols(cat.items.length)" data-stagger="0.07">
            <TiltCard v-for="(s, si) in cat.items" :key="s.name" tag="li" :max="10" :class="span(cat.items.length, si)">
              <div class="flex h-full min-h-[11.5rem] flex-col justify-between p-6">
                <div class="flex items-start justify-between">
                  <component
                    :is="icons[s.icon]"
                    v-if="s.icon"
                    class="h-10 w-10 text-muted transition-[color,transform] duration-700 ease-expo group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:text-cyan"
                    stroke-width="1.3"
                    aria-hidden="true"
                  />
                  <SkillGlyph
                    v-else
                    :name="s.name"
                    class="text-muted transition-[color,transform] duration-700 ease-expo group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:text-cyan"
                  />
                  <span class="label text-[0.5625rem]">{{ cat.title }}</span>
                </div>
                <div>
                  <h4 class="display mt-6 text-[2rem] leading-tight transition-transform duration-700 ease-expo group-hover:-translate-y-1 sm:text-4xl">
                    {{ s.name }}
                  </h4>
                  <p class="mt-2 text-sm leading-relaxed text-muted">{{ s.note }}</p>
                </div>
              </div>
            </TiltCard>
          </ul>
        </section>
      </div>
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
