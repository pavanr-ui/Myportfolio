<script setup>
/**
 * Full-screen project case study.
 * Native <dialog> gives focus trapping, Esc handling and an inert background.
 * It expands out of the project visual that opened it (usePageTransition) and collapses back.
 */
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { X, ArrowLeft, ArrowRight, ArrowUpRight, Github } from 'lucide-vue-next'
import ProjectVisual from './ProjectVisual.vue'
import { gsap, motion } from '@/composables/motion'
import { usePageTransition } from '@/composables/usePageTransition'

const props = defineProps({
  project: { type: Object, required: true },
  origin: { type: Object, default: null },
  index: { type: Number, default: 0 },
  total: { type: Number, default: 5 },
})
const emit = defineEmits(['close', 'prev', 'next'])

const dialog = ref(null)
const shown = ref(props.project)
const { enter, leave } = usePageTransition()
const pad = (n) => String(n).padStart(2, '0')
let closing = false

onMounted(async () => {
  document.documentElement.style.overflow = 'hidden'
  document.documentElement.classList.add('cursor-native')
  dialog.value.showModal()
  await enter(dialog.value, props.origin)
})

async function close() {
  if (closing) return
  closing = true
  await leave(dialog.value, props.origin)
  dialog.value?.close()
  emit('close')
}

function onCancel(e) {
  e.preventDefault() // run the exit transition instead of closing instantly
  close()
}

// swapping between case studies: quick content cross-fade
watch(
  () => props.project,
  async (p) => {
    const body = dialog.value.querySelector('.cs-body')
    if (motion.animate) await gsap.to(body, { autoAlpha: 0, y: 20, duration: 0.3, ease: 'power2.in' })
    shown.value = p
    dialog.value.scrollTop = 0
    await nextTick()
    if (motion.animate) gsap.fromTo(body, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7, clearProps: 'all' })
  },
)

onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
  document.documentElement.classList.remove('cursor-native')
})
</script>

<template>
  <dialog
    ref="dialog"
    class="case-study fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-y-auto overscroll-contain bg-bg p-0 text-ink"
    :aria-labelledby="`cs-title-${shown.id}`"
    @cancel="onCancel"
  >
    <!-- top bar -->
    <div class="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div class="container-site flex h-[var(--nav-h)] items-center justify-between">
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Case study <span class="text-ink">{{ pad(index + 1) }}</span> / {{ pad(total) }}
        </p>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-ink"
          data-cursor="Close"
          autofocus
          @click="close"
        >
          Close <X class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>

    <article class="cs-body">
      <!-- title block -->
      <header class="container-site pb-14 pt-16 lg:pt-24">
        <p class="label mb-6" data-pt>Project {{ shown.index }}</p>
        <h2 :id="`cs-title-${shown.id}`" class="display-caps max-w-5xl text-[clamp(2.8rem,8vw,7.5rem)]" data-pt>
          {{ shown.title }}
        </h2>
        <p class="mt-8 max-w-2xl text-lg leading-relaxed text-muted" data-pt>{{ shown.description }}</p>
        <ul class="mt-8 flex flex-wrap gap-2" data-pt>
          <li v-for="t in shown.tags" :key="t" class="tag">{{ t }}</li>
        </ul>
      </header>

      <!-- full-width visual -->
      <div class="container-site" data-pt>
        <div class="relative aspect-[16/9] overflow-hidden rounded-3xl border border-line bg-subtle">
          <img v-if="shown.image" :src="shown.image" :alt="`${shown.title} — screenshot`" class="h-full w-full object-cover" />
          <ProjectVisual v-else :variant="shown.visual" />
          <span v-if="!shown.image" class="absolute bottom-5 right-5 rounded-full bg-bg/85 px-3 py-1 text-xs text-muted backdrop-blur">
            Preview illustration
          </span>
        </div>
      </div>

      <!-- details -->
      <div class="container-site grid gap-14 py-20 lg:grid-cols-12">
        <div class="lg:col-span-6" data-pt>
          <p class="label mb-4">Overview</p>
          <p class="text-lg leading-relaxed">{{ shown.details }}</p>
          <div v-if="shown.contribution" class="mt-8 border-l-2 border-warm pl-5">
            <p class="label mb-2 text-warm">My contribution</p>
            <p class="leading-relaxed text-muted">{{ shown.contribution }}</p>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <a
              v-if="shown.url"
              :href="shown.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-bg"
            >
              Visit live project <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              v-if="shown.github"
              :href="shown.github"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex h-11 items-center gap-2 rounded-full border border-line px-6 text-sm font-semibold"
            >
              <Github class="h-4 w-4" aria-hidden="true" /> GitHub
            </a>
          </div>
          <p v-if="!shown.url && !shown.image" class="mt-8 rounded-xl border border-dashed border-line p-4 text-sm text-muted">
            Screenshots and a detailed case study for this work are coming soon — the visuals shown here are illustrative.
          </p>
        </div>
        <div class="lg:col-span-3 lg:col-start-8" data-pt>
          <p class="label mb-4">Focus</p>
          <ul class="space-y-3">
            <li v-for="f in shown.focus" :key="f" class="flex gap-3">
              <span class="mt-2.5 h-px w-4 shrink-0 bg-accent" aria-hidden="true" />{{ f }}
            </li>
          </ul>
        </div>
        <div class="lg:col-span-2" data-pt>
          <p class="label mb-4">Technologies</p>
          <ul class="space-y-2 text-muted">
            <li v-for="t in shown.tags" :key="t">{{ t }}</li>
          </ul>
        </div>
      </div>

      <!-- prev / next -->
      <nav class="border-t border-line" aria-label="More case studies">
        <div class="container-site grid sm:grid-cols-2">
          <button
            type="button"
            class="group flex items-center gap-4 py-10 text-left sm:border-r sm:border-line sm:pr-8"
            @click="emit('prev')"
          >
            <ArrowLeft class="h-5 w-5 shrink-0 transition-transform duration-500 group-hover:-translate-x-1" aria-hidden="true" />
            <span>
              <span class="label block">Previous</span>
              <span class="mt-1 block font-display text-2xl">Previous project</span>
            </span>
          </button>
          <button
            type="button"
            class="group flex items-center justify-end gap-4 py-10 text-right sm:pl-8"
            data-cursor="Next"
            @click="emit('next')"
          >
            <span>
              <span class="label block">Next</span>
              <span class="mt-1 block font-display text-2xl">Next project</span>
            </span>
            <ArrowRight class="h-5 w-5 shrink-0 transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </article>
  </dialog>
</template>

<style scoped>
.case-study::backdrop {
  background: transparent;
}
</style>
