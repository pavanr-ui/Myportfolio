<script setup>
/**
 * Section progress rail (desktop): one marker per chapter, the active one stretched,
 * a fill line showing reading progress, and labels on hover/focus. Real links → keyboard friendly.
 * Hidden on the hero and on smaller screens (the nav's progress bar covers those).
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const chapters = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'ai-journey', label: 'AI Journey' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'contact', label: 'Contact' },
]

const active = ref('')
const progress = ref(0)
const visible = ref(false)
let els = []
let raf = 0

function update() {
  raf = 0
  const line = window.innerHeight * 0.45
  let current = ''
  for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id
  active.value = current
  visible.value = !!current
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0
}
const onScroll = () => {
  if (!raf) raf = requestAnimationFrame(update)
}

onMounted(() => {
  els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean)
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <nav
    class="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-500 xl:block"
    :class="visible ? 'opacity-100' : 'pointer-events-none opacity-0'"
    aria-label="Section progress"
  >
    <div class="relative rounded-full border border-line bg-bg/70 px-2 py-4 backdrop-blur-md">
      <!-- reading progress -->
      <span class="absolute bottom-4 left-1/2 top-4 w-px -translate-x-1/2 bg-line" aria-hidden="true" />
      <span
        class="absolute left-1/2 top-4 w-px -translate-x-1/2 bg-accent"
        :style="{ height: `calc((100% - 2rem) * ${progress})` }"
        aria-hidden="true"
      />
      <ol class="relative flex flex-col items-center gap-4">
        <li v-for="(c, i) in chapters" :key="c.id" class="group relative flex items-center">
          <a
            :href="`#${c.id}`"
            class="grid h-5 w-5 place-items-center"
            :aria-current="active === c.id ? 'true' : undefined"
            :aria-label="`${String(i + 1).padStart(2, '0')} ${c.label}`"
          >
            <span
              class="block w-1.5 rounded-full transition-all duration-500 ease-expo"
              :class="active === c.id ? 'h-5 bg-ink' : 'h-1.5 bg-muted/60 group-hover:bg-ink'"
            />
          </a>
          <span
            class="pointer-events-none absolute right-8 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-bg opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
            :class="active === c.id ? 'translate-x-0' : 'translate-x-1'"
            aria-hidden="true"
          >
            {{ String(i + 1).padStart(2, '0') }} · {{ c.label }}
          </span>
        </li>
      </ol>
    </div>
  </nav>
</template>
