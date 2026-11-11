<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ArrowUp } from 'lucide-vue-next'
import { site } from '@/config/site'
import { navItems } from '@/data/content'
import { motion, setMotionPreference } from '@/composables/motion'

const year = new Date().getFullYear()

// back-to-top: ring shows page progress; smooth scroll unless reduced motion
const progress = ref(0)
let raf = 0
const onScroll = () => {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const max = document.documentElement.scrollHeight - window.innerHeight
    progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0
  })
}
function toTop(e) {
  e.preventDefault()
  window.scrollTo({ top: 0, behavior: motion.reduced ? 'auto' : 'smooth' })
  document.getElementById('main')?.focus({ preventScroll: true })
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
const C = 2 * Math.PI * 20
</script>

<template>
  <footer class="border-t border-line">
    <div class="container-site py-14">
      <div class="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="display text-[clamp(2.5rem,6vw,4.5rem)]">
            {{ site.shortName }}<span class="text-accent">.</span>
          </p>
          <nav class="mt-6" aria-label="Footer">
            <ul class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <li v-for="item in navItems" :key="item.id">
                <a :href="`#${item.id}`" class="link-underline hover:text-ink">{{ item.label }}</a>
              </li>
            </ul>
          </nav>
        </div>
        <a
          href="#home"
          class="group inline-flex items-center gap-3 self-start text-sm font-semibold md:self-auto"
          aria-label="Back to top"
          data-cursor="Top"
          @click="toTop"
        >
          Back to top
          <span class="relative grid h-12 w-12 place-items-center transition-transform duration-500 ease-expo group-hover:-translate-y-1">
            <svg viewBox="0 0 44 44" class="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="22" cy="22" r="20" fill="none" stroke="rgb(var(--c-line))" stroke-width="1.5" />
              <circle
                cx="22" cy="22" r="20" fill="none" stroke="rgb(var(--c-accent))" stroke-width="1.5" stroke-linecap="round"
                :stroke-dasharray="C" :stroke-dashoffset="C * (1 - progress)"
              />
            </svg>
            <span class="grid h-9 w-9 place-items-center rounded-full transition-colors duration-500 group-hover:bg-ink group-hover:text-bg">
              <ArrowUp class="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5" aria-hidden="true" />
            </span>
          </span>
        </a>
      </div>

      <div class="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p>Designed &amp; Built by {{ site.name }}. <span class="hidden lg:inline">Press <kbd class="rounded border border-line px-1.5 font-mono">?</kbd> for shortcuts.</span></p>
        <!-- simplified animation mode (auto-enabled on low-powered devices) -->
        <p v-if="!motion.reduced">
          <button
            type="button"
            class="link-underline hover:text-ink"
            :aria-pressed="motion.lite"
            @click="setMotionPreference(motion.lite ? 'full' : 'lite')"
          >
            Simplified motion: {{ motion.lite ? 'On' : 'Off' }}
          </button>
        </p>
        <p v-else>Reduced motion is on (system setting)</p>
        <p>© {{ year }}. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>
