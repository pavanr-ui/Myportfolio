<script setup>
/**
 * Glass card with 3D hover tilt, pointer glare and a cyan→purple glow border.
 * Tilt runs only for full motion + mouse (useTilt); the glow/glass work everywhere.
 */
import { ref } from 'vue'
import { useTilt } from '@/composables/useTilt'

const props = defineProps({
  tag: { type: String, default: 'div' },
  max: { type: Number, default: 8 },
})
const el = ref(null)
useTilt(el, { max: props.max })
</script>

<template>
  <component :is="tag" ref="el" class="glass glow-border group relative overflow-hidden rounded-2xl will-change-transform">
    <div
      class="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style="background: radial-gradient(18rem circle at var(--gx, 50%) var(--gy, 0%), rgb(var(--c-accent) / 0.16), transparent 60%)"
      aria-hidden="true"
    />
    <div class="relative z-[2] h-full">
      <slot />
    </div>
  </component>
</template>
