<script setup>
defineProps({
  index: { type: String, required: true },
  label: { type: String, required: true },
  id: { type: String, default: '' },
})
</script>

<template>
  <header class="mb-14 lg:mb-20">
    <div class="mb-8 flex items-center gap-4" data-reveal>
      <span class="font-display text-lg italic text-accent-ink">{{ index }}</span>
      <span class="h-px w-10 bg-line" aria-hidden="true" />
      <span class="label">{{ label }}</span>
    </div>
    <h2 :id="id || undefined" class="display-caps text-balance text-[clamp(2.4rem,5.6vw,5rem)]" data-split="chars">
      <slot />
    </h2>
    <div v-if="$slots.intro" class="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted" data-reveal>
      <slot name="intro" />
    </div>
  </header>
</template>
