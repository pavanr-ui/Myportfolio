<script setup>
/**
 * Large project panel used by the gallery (horizontal on desktop, stacked on mobile).
 * Hooks for the gallery's animations: .pj-media (mask reveal), .pj-img (inner zoom),
 * .pj-title (character reveal), .pj-meta (fade).
 */
import { ref, computed } from 'vue'
import { ArrowUpRight, Github } from 'lucide-vue-next'
import ProjectVisual from './ProjectVisual.vue'
import { useTilt } from '@/composables/useTilt'

const props = defineProps({
  project: { type: Object, required: true },
  total: { type: Number, default: 5 },
  stacked: { type: Boolean, default: true },
})
const emit = defineEmits(['open'])
// featured project in the horizontal gallery: visual and story side by side
const wide = computed(() => props.project.featured && !props.stacked)
const media = ref(null)
useTilt(media, { max: 4 })

const open = () => emit('open', { project: props.project, from: media.value })
defineExpose({ media })
</script>

<template>
  <article class="pj group relative" :class="wide ? 'grid grid-cols-[1.45fr_1fr] items-center gap-12' : ''">
    <!-- visual: click is a mouse convenience; the "View details" button is the accessible control -->
    <div
      ref="media"
      class="pj-media relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-subtle"
      data-cursor="View"
      :data-reveal="stacked ? 'mask' : undefined"
      @click="open"
    >
      <div class="pj-img absolute inset-0 transition-transform duration-[1.4s] ease-expo group-hover:scale-[1.035]">
        <img
          v-if="project.image"
          :src="project.image"
          :alt="`${project.title} — screenshot`"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover"
        />
        <ProjectVisual v-else :variant="project.visual" />
      </div>
      <span class="absolute left-5 top-5 flex items-center gap-2">
        <span class="rounded-full bg-bg/85 px-3 py-1 font-mono text-xs font-semibold backdrop-blur">
          {{ project.index }} / {{ String(total).padStart(2, '0') }}
        </span>
        <span v-if="project.featured" class="rounded-full bg-warm px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bg">
          Featured
        </span>
      </span>
      <!-- glare that follows the pointer (fed by useTilt) -->
      <div
        class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style="background: radial-gradient(28rem circle at var(--gx, 50%) var(--gy, 0%), rgb(255 255 255 / 0.12), transparent 60%)"
        aria-hidden="true"
      />
      <span
        v-if="!project.image"
        class="absolute bottom-5 right-5 rounded-full bg-bg/85 px-3 py-1 text-[0.6875rem] text-muted backdrop-blur"
      >
        Preview illustration
      </span>
    </div>

    <div :class="wide ? 'grid gap-6' : 'mt-7 grid gap-5 md:grid-cols-[1fr_auto] md:items-end'">
      <div>
        <h3 class="pj-title display-caps text-[clamp(2rem,3.6vw,3.25rem)]" :data-split="stacked ? 'chars' : undefined">
          {{ project.title }}
        </h3>
        <p class="pj-meta mt-3 max-w-xl leading-relaxed text-muted" :data-reveal="stacked ? '' : undefined">
          {{ project.description }}
        </p>
        <p
          v-if="project.contribution"
          class="pj-meta mt-4 max-w-xl border-l-2 border-warm/70 pl-4 text-sm leading-relaxed"
          :class="project.featured ? '' : 'line-clamp-3'"
          :data-reveal="stacked ? '' : undefined"
        >
          <span class="label mb-1 block text-warm">My contribution</span>
          {{ project.contribution }}
        </p>
        <ul class="pj-meta mt-5 flex flex-wrap gap-2" aria-label="Technologies">
          <li v-for="t in project.tags" :key="t" class="tag group-hover:border-ink/25">{{ t }}</li>
        </ul>
      </div>
      <div class="pj-meta flex flex-wrap items-center gap-5">
        <button
          type="button"
          class="group/btn inline-flex items-center gap-3 text-sm font-semibold"
          :aria-label="`View details: ${project.title}`"
          data-cursor="Open"
          @click="open"
        >
          <span class="link-underline">View Details</span>
          <span
            class="grid h-11 w-11 place-items-center rounded-full border border-line transition-all duration-500 ease-expo group-hover/btn:rotate-45 group-hover/btn:border-ink group-hover/btn:bg-ink group-hover/btn:text-bg group-focus-visible/btn:bg-ink group-focus-visible/btn:text-bg"
          >
            <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
          </span>
        </button>
        <a
          v-if="project.github"
          :href="project.github"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
        >
          <Github class="h-4 w-4" aria-hidden="true" /> GitHub
        </a>
      </div>
    </div>
  </article>
</template>
