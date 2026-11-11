<script setup>
import { ArrowUp } from 'lucide-vue-next'
import { site } from '@/config/site'
import { navItems } from '@/data/content'
import { motion, setMotionPreference } from '@/composables/motion'

const year = new Date().getFullYear()
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
        >
          Back to top
          <span
            class="grid h-11 w-11 place-items-center rounded-full border border-line transition-all duration-500 ease-expo group-hover:-translate-y-1 group-hover:border-ink group-hover:bg-ink group-hover:text-bg"
          >
            <ArrowUp class="h-4 w-4" aria-hidden="true" />
          </span>
        </a>
      </div>

      <div class="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p>Designed &amp; Built by {{ site.name }}.</p>
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
