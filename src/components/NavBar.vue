<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import ThemeToggle from './ui/ThemeToggle.vue'
import SoundToggle from './ui/SoundToggle.vue'
import ResumeButton from './ui/ResumeButton.vue'
import { navItems } from '@/data/content'
import { site } from '@/config/site'
import { prefersReducedMotion } from '@/composables/motion'

const scrolled = ref(false)
const progress = ref(0)
const active = ref('home')
const open = ref(false)

let raf = 0
let sections = []

function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const y = window.scrollY
    const max = document.documentElement.scrollHeight - window.innerHeight
    scrolled.value = y > 24
    progress.value = max > 0 ? Math.min(1, y / max) : 0

    // active section = the last one whose top has passed 40% of the viewport
    const line = window.innerHeight * 0.4
    let current = navItems[0].id
    for (const el of sections) if (el.getBoundingClientRect().top <= line) current = el.id
    if (y >= max - 2) current = navItems[navItems.length - 1].id
    active.value = current
  })
}

function close() {
  open.value = false
  document.documentElement.style.overflow = ''
}

/** Mobile menu: release the scroll lock first, then scroll to the section. */
function go(e, id) {
  e.preventDefault()
  close()
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
  })
}

function onKey(e) {
  if (e.key === 'Escape') close()
}

watch(open, (v) => {
  document.documentElement.style.overflow = v ? 'hidden' : ''
})

onMounted(() => {
  sections = navItems.map(({ id }) => document.getElementById(id)).filter(Boolean)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500"
    :class="
      scrolled || open
        ? 'border-b border-line/70 bg-bg/80 backdrop-blur-xl backdrop-saturate-150'
        : 'border-b border-transparent bg-transparent'
    "
  >
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
      >Skip to content</a
    >

    <nav class="container-site flex h-[var(--nav-h)] items-center justify-between gap-6" aria-label="Primary">
      <a href="#home" class="group flex items-baseline gap-2" aria-label="Pavan Ramshetty — back to top" @click="close">
        <span class="font-display text-[1.65rem] italic leading-none">{{ site.initials.toLowerCase() }}</span>
        <span class="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-500 group-hover:scale-150" />
        <span class="hidden text-sm font-semibold tracking-wide sm:inline">{{ site.name }}</span>
      </a>

      <ul class="hidden items-center gap-1 lg:flex">
        <li v-for="item in navItems" :key="item.id">
          <a
            :href="`#${item.id}`"
            class="relative block px-3 py-2 text-[0.8125rem] font-medium transition-colors duration-300"
            :class="active === item.id ? 'text-ink' : 'text-muted hover:text-ink'"
            :aria-current="active === item.id ? 'true' : undefined"
          >
            {{ item.label }}
            <span
              class="absolute inset-x-3 -bottom-0.5 h-px origin-left bg-ink transition-transform duration-500 ease-expo"
              :class="active === item.id ? 'scale-x-100' : 'scale-x-0'"
              aria-hidden="true"
            />
          </a>
        </li>
      </ul>

      <div class="flex items-center gap-2 sm:gap-3">
        <SoundToggle />
        <ThemeToggle />
        <div class="hidden sm:block"><ResumeButton size="sm" variant="primary" short /></div>
        <button
          type="button"
          class="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden"
          :aria-expanded="open"
          aria-controls="mobile-menu"
          :aria-label="open ? 'Close menu' : 'Open menu'"
          @click="open = !open"
        >
          <X v-if="open" class="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
          <Menu v-else class="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
        </button>
      </div>
    </nav>

    <!-- scroll progress indicator -->
    <div class="absolute inset-x-0 bottom-0 h-px" aria-hidden="true">
      <div class="h-full origin-left bg-accent" :style="{ transform: `scaleX(${progress})` }" />
    </div>

    <!-- mobile menu -->
    <Transition
      enter-active-class="transition duration-500 ease-expo"
      enter-from-class="opacity-0 -translate-y-4"
      leave-active-class="transition duration-300"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="open"
        id="mobile-menu"
        class="h-[calc(100dvh-var(--nav-h))] overflow-y-auto border-t border-line bg-bg lg:hidden"
      >
        <ul class="container-site flex flex-col py-6">
          <li v-for="(item, i) in navItems" :key="item.id" class="border-b border-line">
            <a
              :href="`#${item.id}`"
              class="flex items-baseline justify-between py-4"
              :aria-current="active === item.id ? 'true' : undefined"
              @click="go($event, item.id)"
            >
              <span class="display text-4xl" :class="active === item.id ? 'italic text-accent-ink' : ''">{{
                item.label
              }}</span>
              <span class="text-xs text-muted">0{{ i + 1 }}</span>
            </a>
          </li>
        </ul>
        <div class="container-site pb-10" @click="close"><ResumeButton variant="primary" /></div>
      </div>
    </Transition>
  </header>
</template>
