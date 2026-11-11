<script setup>
import { ref } from 'vue'
import SectionHeading from '../ui/SectionHeading.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { philosophy } from '@/data/content'

const root = ref(null)
useScrollReveal(root)
</script>

<template>
  <section id="philosophy" ref="root" class="section" aria-labelledby="philosophy-title">
    <div class="container-site">
      <SectionHeading id="philosophy-title" index="06" label="Development Philosophy">
        Principles I <em class="text-accent-ink">build</em> by.
      </SectionHeading>

      <ol class="border-t border-line" data-stagger="0.08">
        <li
          v-for="(p, i) in philosophy"
          :key="p.title"
          class="group grid gap-3 border-b border-line py-8 transition-colors duration-500 hover:bg-subtle/70 sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:px-4 lg:py-10"
        >
          <span class="font-display text-lg italic text-accent-ink sm:col-span-1">0{{ i + 1 }}</span>
          <h3
            class="display text-[clamp(1.9rem,3.6vw,3.25rem)] transition-transform duration-700 ease-expo group-hover:translate-x-2 sm:col-span-7"
          >
            {{ p.title }}
          </h3>
          <p class="text-pretty leading-relaxed text-muted sm:col-span-4">{{ p.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
