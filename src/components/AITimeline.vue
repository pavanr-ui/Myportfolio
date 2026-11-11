<script setup>
/**
 * Interactive AI journey timeline. The connecting line draws as you scroll and each node
 * lights up when the line reaches it. Nodes are buttons: hover, focus or tap shows details.
 * Horizontal on desktop, vertical on small screens. Content is honest: learning stages.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { gsap, motion, fontsReady, queueRefresh } from '@/composables/motion'
import { aiJourney } from '@/data/content'

const root = ref(null)
const reached = ref(motion.animate ? -1 : aiJourney.length - 1)
const selected = ref(0)
const current = computed(() => aiJourney[selected.value])
let ctx

onMounted(async () => {
  if (!motion.animate) return
  await fontsReady()
  const el = root.value
  if (!el) return
  ctx = gsap.context(() => {
    const desktop = window.matchMedia('(min-width: 1024px)').matches
    gsap.fromTo(
      el.querySelector('.tl-fill'),
      { [desktop ? 'scaleX' : 'scaleY']: 0 },
      {
        [desktop ? 'scaleX' : 'scaleY']: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          end: desktop ? 'bottom 55%' : 'bottom 70%',
          scrub: true,
          onUpdate: (self) => {
            const r = Math.floor(self.progress * aiJourney.length - 0.0001)
            if (r !== reached.value) {
              reached.value = Math.max(-1, r)
              if (r >= 0) selected.value = r
            }
          },
        },
      },
    )
  }, el)
  queueRefresh() // this component loads lazily: re-measure triggers further down the page
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <div ref="root" class="relative">
    <p class="label mb-10">My AI developer journey</p>

    <div class="relative">
      <!-- connecting line: horizontal (lg) / vertical (mobile) -->
      <span class="absolute left-[7px] top-2 bottom-2 w-px bg-line lg:left-0 lg:right-0 lg:top-[7px] lg:bottom-auto lg:h-px lg:w-auto" aria-hidden="true" />
      <span
        class="tl-fill absolute left-[7px] top-2 bottom-2 w-px origin-top bg-accent lg:left-0 lg:right-0 lg:top-[7px] lg:bottom-auto lg:h-px lg:w-auto lg:origin-left"
        aria-hidden="true"
      />

      <ol class="relative grid gap-8 lg:grid-cols-5 lg:gap-6">
        <li v-for="(n, i) in aiJourney" :key="n.title" class="relative pl-9 lg:pl-0">
          <button
            type="button"
            class="group w-full text-left"
            :aria-pressed="selected === i"
            :aria-describedby="'ai-node-detail'"
            data-cursor="Read"
            @mouseenter="selected = i"
            @focus="selected = i"
            @click="selected = i"
          >
            <span
              class="absolute left-0 top-0 grid h-[15px] w-[15px] place-items-center rounded-full border-2 transition-all duration-500 lg:static lg:mb-6 lg:block"
              :class="
                i <= reached
                  ? 'border-accent bg-accent shadow-[0_0_0_6px_rgb(var(--c-accent)/0.18)]'
                  : 'border-line bg-bg'
              "
              aria-hidden="true"
            />
            <span class="font-mono text-[0.625rem] uppercase tracking-[0.2em]" :class="selected === i ? 'text-warm' : 'text-muted'">
              0{{ i + 1 }} · {{ n.status }}
            </span>
            <span
              class="mt-2 block text-lg font-semibold leading-snug transition-colors duration-300"
              :class="selected === i ? 'text-ink' : 'text-ink/60 group-hover:text-ink'"
            >
              {{ n.title }}
            </span>
            <!-- inline detail on small screens -->
            <span class="mt-2 block text-sm leading-relaxed text-muted lg:hidden">{{ n.text }}</span>
          </button>
        </li>
      </ol>
    </div>

    <!-- detail panel (desktop) -->
    <div id="ai-node-detail" class="mt-10 hidden min-h-[7rem] rounded-2xl border border-line bg-surface/60 p-7 lg:block" aria-live="polite">
      <p class="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-warm">{{ current.status }}</p>
      <p class="mt-2 font-display text-3xl">{{ current.title }}</p>
      <p class="mt-2 max-w-3xl leading-relaxed text-muted">{{ current.text }}</p>
    </div>
  </div>
</template>
