<script setup>
import { computed, ref } from 'vue'
import { useMagneticHover } from '@/composables/useMagneticHover'
import { useSound } from '@/composables/useSound'

const props = defineProps({
  href: { type: String, default: '' },
  variant: { type: String, default: 'primary' }, // primary | outline | ghost | light
  size: { type: String, default: 'md' }, // sm | md
  download: { type: Boolean, default: false },
  external: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
  magnetic: { type: Boolean, default: true },
  cursor: { type: String, default: '' }, // contextual custom-cursor label
})

const el = ref(null)
const { play } = useSound()
if (props.magnetic) useMagneticHover(el, { strength: 0.28, inner: '.btn-label' })

const tag = computed(() => (props.href ? 'a' : 'button'))

const classes = computed(() => [
  'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-wide will-change-transform',
  'transition-[color,background-color,border-color] duration-500 ease-expo active:scale-[0.97]',
  'disabled:pointer-events-none disabled:opacity-50',
  props.size === 'sm' ? 'h-10 px-5 text-[0.8125rem]' : 'h-12 px-7 text-sm',
  {
    primary: 'bg-ink text-bg',
    outline: 'border border-ink/25 text-ink hover:border-ink',
    ghost: 'text-ink hover:text-accent-ink',
    light: 'bg-paper text-navy',
  }[props.variant],
])
</script>

<template>
  <component
    :is="tag"
    ref="el"
    :href="href || undefined"
    :type="tag === 'button' ? type : undefined"
    :download="download || undefined"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :data-cursor="cursor || undefined"
    :class="classes"
    @click="play('click')"
  >
    <!-- sliding fill on hover -->
    <span
      v-if="variant !== 'ghost'"
      aria-hidden="true"
      class="absolute inset-0 translate-y-[101%] rounded-full transition-transform duration-500 ease-expo group-hover:translate-y-0 group-focus-visible:translate-y-0"
      :class="variant === 'primary' ? 'bg-accent-ink' : variant === 'light' ? 'bg-steel' : 'bg-ink'"
    />
    <span
      class="btn-label relative z-10 inline-flex items-center gap-2 transition-colors duration-500"
      :class="variant === 'outline' ? 'group-hover:text-bg group-focus-visible:text-bg' : ''"
    >
      <slot />
    </span>
  </component>
</template>
