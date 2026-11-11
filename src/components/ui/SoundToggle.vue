<script setup>
import { Volume2, VolumeX } from 'lucide-vue-next'
import { useSound } from '@/composables/useSound'
import { ref } from 'vue'
import { useMagneticHover } from '@/composables/useMagneticHover'

const btn = ref(null)
useMagneticHover(btn, { strength: 0.35 })

const { enabled, toggle } = useSound()
</script>

<template>
  <button
    ref="btn"
    type="button"
    class="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-ink/40"
    :aria-label="enabled ? 'Turn interface sounds off' : 'Turn interface sounds on'"
    :aria-pressed="enabled"
    :title="enabled ? 'Sound on' : 'Sound off'"
    @click="toggle"
  >
    <Volume2 v-if="enabled" class="h-[1.05rem] w-[1.05rem]" stroke-width="1.6" aria-hidden="true" />
    <VolumeX v-else class="h-[1.05rem] w-[1.05rem] text-muted" stroke-width="1.6" aria-hidden="true" />
  </button>
</template>
