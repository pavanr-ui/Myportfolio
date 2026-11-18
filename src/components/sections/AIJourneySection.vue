<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { MessageSquareText, Sparkles, SquareTerminal, Code2, ShieldCheck, FlaskConical, BriefcaseBusiness } from 'lucide-vue-next'
import SectionHeading from '../ui/SectionHeading.vue'
import TiltCard from '../ui/TiltCard.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { ScrollTrigger, motion } from '@/composables/motion'
import { aiTools, aiPractices, aiWorkflow, aiBuilds, experience } from '@/data/content'

const AIWorkspace = defineAsyncComponent(() => import('../AIWorkspace.vue'))
const AITimeline = defineAsyncComponent(() => import('../AITimeline.vue'))

const icons = { MessageSquareText, Sparkles, SquareTerminal, Code2 }
const root = ref(null)
// sticky, scroll-driven workflow story on desktop; everything visible at once elsewhere
const story = motion.animate && window.matchMedia('(min-width: 1024px)').matches
const step = ref(story ? 0 : -1)

// Neural-network backdrop for the workflow story: 4 layers of nodes (prompt → model → review → code),
// deterministic positions, links between neighbouring layers. Signals travel along the links (CSS).
const net = (() => {
  const cols = [3, 5, 5, 3]
  const nodes = cols.flatMap((n, c) =>
    Array.from({ length: n }, (_, r) => ({ id: `${c}-${r}`, c, x: 90 + c * 273, y: 300 / (n + 1) * (r + 1) + (c % 2 ? 0 : 6) })),
  )
  const links = []
  nodes.forEach((a) =>
    nodes.forEach((b) => {
      if (b.c === a.c + 1 && (a.id.length + b.id.length + Number(a.id.slice(2)) * 3 + Number(b.id.slice(2))) % 3 !== 0)
        links.push({ a, b, d: `M${a.x} ${a.y} C ${a.x + 120} ${a.y}, ${b.x - 120} ${b.y}, ${b.x} ${b.y}`, k: links.length })
    }),
  )
  return { nodes, links }
})()

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

    <div class="container-site relative pt-20 sm:pt-24 lg:pt-28">
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
          class="glass glow-border group relative overflow-hidden rounded-2xl p-7 transition-transform duration-700 ease-expo hover:-translate-y-1.5"
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

      <div class="mt-24" data-reveal>
        <AITimeline />
      </div>

      <!-- learning vs professional — kept clearly separate -->
      <div class="mt-16 grid gap-3 sm:grid-cols-2" data-stagger="0.08">
        <div class="glass flex items-start gap-4 rounded-2xl p-5">
          <FlaskConical class="mt-0.5 h-5 w-5 shrink-0 text-warm" stroke-width="1.6" aria-hidden="true" />
          <p class="text-sm leading-relaxed text-muted">
            <span class="block font-semibold text-ink">Learning &amp; personal experiments</span>
            Prompt engineering, Claude Code, AI tools and AI agents — explored on my own time and in the builds below.
          </p>
        </div>
        <div class="glass flex items-start gap-4 rounded-2xl p-5">
          <BriefcaseBusiness class="mt-0.5 h-5 w-5 shrink-0 text-cyan" stroke-width="1.6" aria-hidden="true" />
          <p class="text-sm leading-relaxed text-muted">
            <span class="block font-semibold text-ink">Professional work</span>
            Frontend for AI Assistant features at {{ experience[0].company }} — part of my role as {{ experience[0].role }}.
          </p>
        </div>
      </div>

      <!-- real, completed AI-assisted builds -->
      <div class="mt-16">
        <p class="label mb-6" data-reveal>Completed AI-assisted builds</p>
        <ul class="grid gap-4 md:grid-cols-2" data-stagger="0.1">
          <TiltCard v-for="b in aiBuilds" :key="b.title" tag="li" :max="6">
            <article class="flex h-full flex-col p-7">
              <p class="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-warm">
                <FlaskConical class="h-3.5 w-3.5" aria-hidden="true" /> {{ b.kind }}
              </p>
              <h3 class="display mt-4 text-3xl">{{ b.title }}</h3>
              <p class="mt-3 flex-1 text-sm leading-relaxed text-muted">{{ b.text }}</p>
              <ul class="mt-6 flex flex-wrap gap-2" aria-label="Tools used">
                <li v-for="t in b.tools" :key="t" class="tag">{{ t }}</li>
              </ul>
            </article>
          </TiltCard>
        </ul>
      </div>
    </div>

    <!-- workflow story: sticky on desktop, scroll moves through the five steps -->
    <div class="ai-story relative mt-20 lg:mt-10" :class="story ? 'h-[220vh]' : ''">
      <div :class="story ? 'sticky top-0 flex h-screen items-center' : 'pb-8'">
        <!-- neural network backdrop: lights up further as the workflow advances -->
        <svg
          class="ai-net pointer-events-none absolute inset-x-0 top-1/2 -z-0 mx-auto h-[70%] w-full max-w-6xl -translate-y-1/2 motion-reduced:opacity-40"
          viewBox="0 0 1000 300"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ai-net-g" x1="0" x2="1">
              <stop offset="0" stop-color="rgb(var(--c-cyan))" />
              <stop offset="1" stop-color="rgb(var(--c-warm))" />
            </linearGradient>
          </defs>
          <g
            v-for="l in net.links"
            :key="l.k"
            class="transition-opacity duration-700"
            :style="{ opacity: step === -1 || l.a.c <= step ? 1 : 0.25 }"
          >
            <path :d="l.d" fill="none" stroke="url(#ai-net-g)" stroke-opacity="0.16" stroke-width="1" vector-effect="non-scaling-stroke" />
            <path
              :d="l.d"
              class="ai-signal css-loop"
              fill="none"
              stroke="url(#ai-net-g)"
              stroke-width="1.6"
              vector-effect="non-scaling-stroke"
              pathLength="100"
              :style="{ animationDelay: `${(l.k * 0.37) % 3}s`, animationDuration: `${2.6 + (l.k % 4) * 0.5}s` }"
            />
          </g>
          <circle
            v-for="n in net.nodes"
            :key="n.id"
            :cx="n.x"
            :cy="n.y"
            r="3"
            class="transition-[fill-opacity] duration-700"
            fill="rgb(var(--c-cyan))"
            :fill-opacity="step === -1 || n.c <= step ? 0.85 : 0.25"
          />
        </svg>
        <div class="container-site relative grid w-full items-center gap-12 lg:grid-cols-12">
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

    <div class="container-site relative pb-20 sm:pb-24 lg:pb-28">
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
.ai-net {
  opacity: 0.55;
  -webkit-mask-image: radial-gradient(ellipse at center, #000 35%, transparent 75%);
  mask-image: radial-gradient(ellipse at center, #000 35%, transparent 75%);
}
.ai-signal {
  stroke-dasharray: 6 94;
  stroke-dashoffset: 100;
  animation: ai-signal 3s linear infinite;
}
.motion-reduced .ai-signal,
.motion-lite .ai-signal {
  display: none;
}
@keyframes ai-signal {
  to { stroke-dashoffset: 0; }
}
.ai-glow {
  background: radial-gradient(22rem circle at var(--mx, 50%) var(--my, 50%), rgb(var(--c-accent) / 0.16), transparent 60%);
}
</style>
