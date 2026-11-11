<script setup>
import { Download, ArrowDownRight } from 'lucide-vue-next'
import BaseButton from './BaseButton.vue'
import { site } from '@/config/site'

defineProps({
  variant: { type: String, default: 'outline' },
  size: { type: String, default: 'md' },
  short: { type: Boolean, default: false },
})
</script>

<template>
  <!-- Real file configured → download. Otherwise → honest "request" path to the contact section. -->
  <BaseButton v-if="site.resumeUrl" :href="site.resumeUrl" download :variant="variant" :size="size">
    <Download class="h-4 w-4" aria-hidden="true" />
    {{ short ? 'Resume' : 'Download Resume' }}
  </BaseButton>
  <BaseButton v-else href="#contact" :variant="variant" :size="size" title="Résumé available on request">
    <ArrowDownRight class="h-4 w-4" aria-hidden="true" />
    {{ short ? 'Resume' : 'Request Resume' }}
  </BaseButton>
</template>
