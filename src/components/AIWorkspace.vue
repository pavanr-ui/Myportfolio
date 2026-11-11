<script setup>
/**
 * Illustrative "digital workspace" for the AI section: a prompt panel that types,
 * a code panel, and a terminal — connected by motion lines to the AI tools.
 * `step` (0–4) follows the Prompt → Generate → Review → Refine → Verify workflow;
 * -1 shows everything at once (mobile / reduced motion).
 * All content is illustrative and labelled as such.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { motion } from '@/composables/motion'
import { aiPrompts, aiTools } from '@/data/content'

const props = defineProps({ step: { type: Number, default: -1 } })

const typed = ref(motion.animate ? '' : aiPrompts[0])
const root = ref(null)
const is = (...steps) => props.step === -1 || steps.includes(props.step)
const showReview = computed(() => props.step === -1 || props.step >= 2)
const showRefine = computed(() => props.step === -1 || props.step >= 3)
const verified = computed(() => props.step === -1 || props.step >= 4)

let timer
let visible = false
let p = 0
let c = 0
let pause = 0

function tick() {
  if (!visible) return
  const text = aiPrompts[p]
  if (pause > 0) {
    pause--
  } else if (c < text.length) {
    c++
    typed.value = text.slice(0, c)
    if (c === text.length) pause = 40
  } else {
    p = (p + 1) % aiPrompts.length
    c = 0
    typed.value = ''
  }
}

let io
onMounted(() => {
  if (!motion.animate) return
  io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(root.value)
  timer = setInterval(tick, 55)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  io?.disconnect()
})

const chips = [
  { pos: 'left-[2%] top-[4%]', i: 0 },
  { pos: 'right-[2%] top-[2%]', i: 1 },
  { pos: 'right-[0%] bottom-[30%]', i: 2 },
  { pos: 'left-[0%] bottom-[6%]', i: 3 },
]
</script>

<template>
  <div ref="root" class="relative sm:aspect-[4/3]" role="img" aria-label="Illustration of an AI-assisted development workspace: a prompt, generated code being reviewed, and a terminal confirming human verification.">
    <!-- connection lines (desktop) -->
    <svg viewBox="0 0 100 75" preserveAspectRatio="none" class="pointer-events-none absolute inset-0 hidden h-full w-full sm:block" aria-hidden="true">
      <path class="ws-flow css-loop" d="M12 7 C 20 12, 22 16, 26 20" fill="none" stroke="rgb(var(--c-accent) / 0.55)" stroke-width="0.25" stroke-dasharray="1 1.2" vector-effect="non-scaling-stroke" />
      <path class="ws-flow css-loop" d="M88 6 C 80 10, 74 14, 66 22" fill="none" stroke="rgb(var(--c-accent) / 0.55)" stroke-width="0.25" stroke-dasharray="1 1.2" vector-effect="non-scaling-stroke" />
      <path class="ws-flow css-loop" d="M90 50 C 84 52, 80 54, 74 56" fill="none" stroke="rgb(var(--c-accent) / 0.55)" stroke-width="0.25" stroke-dasharray="1 1.2" vector-effect="non-scaling-stroke" />
      <path class="ws-flow css-loop" d="M14 69 C 22 66, 26 62, 30 58" fill="none" stroke="rgb(var(--c-accent) / 0.55)" stroke-width="0.25" stroke-dasharray="1 1.2" vector-effect="non-scaling-stroke" />
      <path class="ws-flow css-loop" d="M40 27 C 44 33, 46 36, 50 40" fill="none" stroke="rgb(var(--c-accent) / 0.8)" stroke-width="0.3" stroke-dasharray="1.2 1.2" vector-effect="non-scaling-stroke" />
    </svg>

    <!-- tool chips -->
    <span
      v-for="ch in chips"
      :key="ch.i"
      class="ws-float css-loop absolute z-20 hidden items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[0.6875rem] text-ink sm:flex"
      :class="ch.pos"
      :style="{ animationDelay: `${ch.i * -1.4}s` }"
      aria-hidden="true"
    >
      <span class="h-1.5 w-1.5 rounded-full bg-accent" />{{ aiTools[ch.i].name }}
    </span>

    <!-- prompt panel -->
    <div
      class="ws-panel relative z-10 mb-4 rounded-xl border bg-surface p-4 shadow-2xl transition-all duration-700 ease-expo sm:absolute sm:left-[14%] sm:top-[14%] sm:mb-0 sm:w-[52%]"
      :class="is(0) ? 'border-accent/70 opacity-100' : 'border-line opacity-45 sm:scale-[0.97]'"
    >
      <p class="mb-3 flex items-center justify-between font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted">
        <span>Prompt</span><span class="text-accent-ink">illustrative</span>
      </p>
      <p class="min-h-[2.8em] font-mono text-[0.8125rem] leading-relaxed text-ink">
        <span class="text-accent-ink">❯ </span>{{ typed }}<span class="caret css-loop ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-accent" aria-hidden="true" />
      </p>
    </div>

    <!-- code panel -->
    <div
      class="ws-panel relative z-10 mb-4 rounded-xl border bg-abyss p-4 shadow-2xl transition-all duration-700 ease-expo sm:absolute sm:right-[8%] sm:top-[34%] sm:mb-0 sm:w-[56%]"
      :class="is(1, 2, 3) ? 'border-accent/70 opacity-100' : 'border-line opacity-45 sm:scale-[0.97]'"
    >
      <p class="mb-3 flex items-center gap-1.5" aria-hidden="true">
        <span class="h-2 w-2 rounded-full bg-paper/20" /><span class="h-2 w-2 rounded-full bg-paper/20" /><span class="h-2 w-2 rounded-full bg-steel" />
        <span class="ml-2 font-mono text-[0.625rem] text-paper/50">AccessibleModal.vue</span>
      </p>
      <pre class="overflow-hidden font-mono text-[0.6875rem] leading-[1.7] text-paper/85 sm:text-[0.75rem]"><span class="text-steel">&lt;script setup&gt;</span>
const open = <span class="text-steel">ref</span>(false)
<span v-if="showRefine" class="block bg-emerald-400/10 text-emerald-300">+ useFocusTrap(dialogRef)</span><span class="text-steel">&lt;/script&gt;</span>
<span class="text-steel">&lt;dialog</span> role="dialog"
  aria-labelledby="title"<span v-if="showReview" class="ml-3 rounded bg-steel/20 px-1.5 text-[0.625rem] text-steel">✓ a11y</span>
  @keydown.esc="close"<span v-if="showReview" class="ml-3 rounded bg-steel/20 px-1.5 text-[0.625rem] text-steel">reviewed</span>
<span class="text-steel">&gt;</span>…</pre>
    </div>

    <!-- terminal panel -->
    <div
      class="ws-panel relative z-10 rounded-xl border bg-surface p-4 shadow-2xl transition-all duration-700 ease-expo sm:absolute sm:bottom-[8%] sm:left-[20%] sm:w-[46%]"
      :class="is(4) ? 'border-accent/70 opacity-100' : 'border-line opacity-45 sm:scale-[0.97]'"
    >
      <p class="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted">Terminal</p>
      <p class="font-mono text-[0.75rem] leading-[1.8] text-muted">
        <span class="text-ink">$</span> review the generated changes<br />
        › reading every line…<br />
        <span :class="verified ? 'text-accent-ink' : 'opacity-0'" class="transition-opacity duration-500">✓ verified by a human before shipping</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.ws-flow { animation: flow 2.6s linear infinite; }
.ws-float { animation: float 7s ease-in-out infinite; }
.caret { animation: blink 1s steps(1) infinite; }
@keyframes flow { to { stroke-dashoffset: -4.4; } }
@keyframes float { 50% { transform: translateY(-8px); } }
@keyframes blink { 50% { opacity: 0; } }
</style>
