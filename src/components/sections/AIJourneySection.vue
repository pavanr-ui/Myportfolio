<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { MessageSquareText, Sparkles, SquareTerminal, Code2, ShieldCheck } from 'lucide-vue-next'
import SectionHeading from '../ui/SectionHeading.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { ScrollTrigger, motion } from '@/composables/motion'
import { aiTools, aiPractices, aiWorkflow } from '@/data/content'

const AIWorkspace = defineAsyncComponent(() => import('../AIWorkspace.vue'))

const icons = { MessageSquareText, Sparkles, SquareTerminal, Code2 }
const root = ref(null)
// sticky, scroll-driven workflow story on desktop; everything visible at once elsewhere
const story = motion.animate && window.matchMedia('(min-width: 1024px)').matches
const step = ref(story ? 0 : -1)

// Spotlight that follows the pointer inside each tool card
function spot(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}

useScrollReveal(root, (el) => {
  if (!story) return
  ScrollTrigger.create({
    trigger: el.querySelector('.ai-story'),
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      step.value = Math.min(aiWorkflow.length - 1, Math.floor(self.progress * aiWorkflow.length))
    },
  })
})
</script>

<template>
  <section id="ai-journey" ref="root" class="dark-scope relative overflow-clip bg-bg text-ink" aria-labelledby="ai-title">
    <div class="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-60" aria-hidden="true" />
    <div
      class="pointer-events-none absolute inset-0"
      style="background: radial-gradient(60rem 30rem at 85% 0%, rgb(var(--c-accent) / 0.12), transparent 60%)"
      aria-hidden="true"
    />

    <div class="container-site relative pt-24 sm:pt-28 lg:pt-36">
      <SectionHeading id="ai-title" index="05" label="AI Journey">
        Exploring what’s <em class="text-accent-ink">next</em>.
        <template #intro>
          I’m actively learning and experimenting with AI-assisted development — code generation, code review, prompt
          engineering and AI-powered workflows. AI helps me improve frontend productivity; careful human review keeps
          the result correct.
        </template>
      </SectionHeading>

      <ul class="flex flex-wrap gap-2" aria-label="Areas I'm exploring" data-stagger="0.06">
        <li v-for="p in aiPractices" :key="p" class="tag border-line text-ink/80">{{ p }}</li>
      </ul>

      <ul class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-stagger="0.1">
        <li
          v-for="tool in aiTools"
          :key="tool.name"
          class="group relative overflow-hidden rounded-2xl border border-line bg-surface/60 p-7 transition-[border-color,transform] duration-700 ease-expo hover:-translate-y-1.5 hover:border-accent/60"
          @pointermove="spot"
        >
          <div class="ai-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
          <div class="relative">
            <span class="mb-10 grid h-12 w-12 place-items-center rounded-xl border border-line text-accent-ink transition-colors duration-500 group-hover:border-accent/60">
              <component :is="icons[tool.icon]" class="h-5 w-5" stroke-width="1.5" aria-hidden="true" />
            </span>
            <h3 class="display text-3xl">{{ tool.name }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-muted">{{ tool.use }}</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- workflow story: sticky on desktop, scroll moves through the five steps -->
    <div class="ai-story relative mt-20 lg:mt-10" :class="story ? 'h-[300vh]' : ''">
      <div :class="story ? 'sticky top-0 flex h-screen items-center' : 'pb-8'">
        <div class="container-site grid w-full items-center gap-12 lg:grid-cols-12">
          <div class="lg:col-span-4">
            <p class="label mb-8" data-reveal>How I work with AI</p>
            <ol class="space-y-6" :data-stagger="story ? undefined : '0.1'">
              <li
                v-for="(w, i) in aiWorkflow"
                :key="w.step"
                class="relative border-l pl-6 transition-[opacity,border-color] duration-500"
                :class="step === -1 || step === i ? 'border-accent opacity-100' : 'border-line opacity-35'"
                :aria-current="step === i ? 'step' : undefined"
              >
                <p class="font-display text-sm italic text-accent-ink">0{{ i + 1 }}</p>
                <h3 class="mt-1 text-lg font-semibold">{{ w.step }}</h3>
                <p class="mt-1 text-sm leading-relaxed text-muted">{{ w.text }}</p>
              </li>
            </ol>
          </div>
          <div class="lg:col-span-8" data-reveal>
            <component :is="AIWorkspace" :step="step" />
          </div>
        </div>
      </div>
    </div>

    <div class="container-site relative pb-24 sm:pb-28 lg:pb-36">
      <p class="flex max-w-2xl items-start gap-3 border-t border-line pt-8 text-sm leading-relaxed text-muted" data-reveal>
        <ShieldCheck class="mt-0.5 h-5 w-5 shrink-0 text-accent-ink" stroke-width="1.5" aria-hidden="true" />
        <span>
          This is an ongoing learning journey. I treat AI as a capable assistant — every suggestion is reviewed,
          tested and owned by me before it ships.
        </span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.ai-glow {
  background: radial-gradient(22rem circle at var(--mx, 50%) var(--my, 50%), rgb(var(--c-accent) / 0.16), transparent 60%);
}
</style>
