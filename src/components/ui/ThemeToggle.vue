<script setup>
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-line text-ink transition-colors duration-300 hover:border-ink/40"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    :aria-pressed="isDark"
    @click="toggle"
  >
    <Transition
      mode="out-in"
      enter-active-class="transition duration-500 ease-expo"
      enter-from-class="translate-y-3 rotate-45 opacity-0"
      leave-active-class="transition duration-200"
      leave-to-class="-translate-y-3 opacity-0"
    >
      <Moon v-if="!isDark" key="moon" class="h-[1.05rem] w-[1.05rem]" stroke-width="1.6" aria-hidden="true" />
      <Sun v-else key="sun" class="h-[1.05rem] w-[1.05rem]" stroke-width="1.6" aria-hidden="true" />
    </Transition>
  </button>
</template>
