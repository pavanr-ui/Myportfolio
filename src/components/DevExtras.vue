<script setup>
/**
 * Keyboard navigation + a small easter egg, in one place.
 *  1–7   jump to Home … Contact
 *  t     toggle light / dark theme
 *  ?     open this shortcuts panel (native <dialog>: focus trap + Esc built in)
 *  "vue" typed anywhere → Blueprint mode: outlines the page's component structure,
 *        a nod to how the site is built. Type it again (or press Esc) to exit.
 * Shortcuts never fire while typing in a form field or with modifier keys held.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { X } from 'lucide-vue-next'
import { navItems } from '@/data/content'
import { useTheme } from '@/composables/useTheme'
import { useSound } from '@/composables/useSound'
import { motion } from '@/composables/motion'

const dialog = ref(null)
const toast = ref('')
const blueprint = ref(false)
const { toggle: toggleTheme } = useTheme()
const { play } = useSound()
let buffer = ''
let toastTimer

const shortcuts = [
  ...navItems.map((n, i) => ({ keys: String(i + 1), label: `Go to ${n.label}` })),
  { keys: 't', label: 'Toggle light / dark theme' },
  { keys: '?', label: 'Show these shortcuts' },
  { keys: 'Esc', label: 'Close dialogs · exit Blueprint mode' },
]

function say(msg) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 3200)
}

function setBlueprint(on) {
  blueprint.value = on
  document.documentElement.classList.toggle('blueprint', on)
  play('toggle')
  say(on ? 'Blueprint mode on — you’re seeing the component structure. Type “vue” again to exit.' : 'Blueprint mode off.')
}

function isTyping(t) {
  return t instanceof Element && !!t.closest('input, textarea, select, [contenteditable="true"]')
}

function onKey(e) {
  if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return
  if (e.key === 'Escape' && blueprint.value) return setBlueprint(false)
  const otherDialog = document.querySelector('dialog[open]:not(.kbd-help)')
  if (otherDialog) return

  // easter egg buffer
  if (/^[a-z]$/i.test(e.key)) {
    buffer = (buffer + e.key.toLowerCase()).slice(-3)
    if (buffer === 'vue') {
      buffer = ''
      return setBlueprint(!blueprint.value)
    }
  }
  if (dialog.value?.open) return

  if (e.key === '?') {
    e.preventDefault()
    document.documentElement.classList.add('cursor-native')
    dialog.value.showModal()
    play('open')
  } else if (e.key === 't') {
    toggleTheme()
  } else if (/^[1-9]$/.test(e.key)) {
    const item = navItems[Number(e.key) - 1]
    const el = item && document.getElementById(item.id)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: motion.reduced ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(null, '', `#${item.id}`)
  }
}

function onClose() {
  if (!document.querySelector('dialog.case-study[open]')) document.documentElement.classList.remove('cursor-native')
}

function onBackdrop(e) {
  if (e.target === dialog.value) dialog.value.close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  clearTimeout(toastTimer)
  document.documentElement.classList.remove('blueprint')
})
</script>

<template>
  <dialog
    ref="dialog"
    class="kbd-help m-auto w-[min(26rem,calc(100%-2rem))] rounded-3xl border border-line bg-bg p-0 text-ink"
    aria-labelledby="kbd-title"
    @click="onBackdrop"
    @close="onClose"
  >
    <div class="p-7">
      <div class="mb-6 flex items-center justify-between">
        <h2 id="kbd-title" class="display-caps text-3xl">Shortcuts</h2>
        <button type="button" class="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-ink" aria-label="Close shortcuts" @click="dialog.close()">
          <X class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <dl class="divide-y divide-line">
        <div v-for="s in shortcuts" :key="s.keys" class="flex items-center justify-between py-2.5 text-sm">
          <dt class="text-muted">{{ s.label }}</dt>
          <dd><kbd class="rounded-md border border-line bg-subtle px-2 py-0.5 font-mono text-xs">{{ s.keys }}</kbd></dd>
        </div>
      </dl>
      <p class="mt-6 text-xs text-muted">Psst — there’s a hidden mode for developers. It’s only three letters.</p>
    </div>
  </dialog>

  <!-- toast -->
  <Transition
    enter-active-class="transition duration-500 ease-expo"
    enter-from-class="translate-y-4 opacity-0"
    leave-active-class="transition duration-300"
    leave-to-class="translate-y-2 opacity-0"
  >
    <p
      v-if="toast"
      class="fixed bottom-6 left-1/2 z-[260] max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-full border border-line bg-ink px-5 py-2.5 text-center text-xs font-medium text-bg shadow-xl"
      role="status"
      aria-live="polite"
    >
      {{ toast }}
    </p>
  </Transition>
</template>

<style scoped>
.kbd-help::backdrop {
  background: rgb(8 9 11 / 0.6);
  backdrop-filter: blur(6px);
}
</style>
