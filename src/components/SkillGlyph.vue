<script setup>
/**
 * Abstract line glyph for each skill (not brand logos). Paths use pathLength="1" so a
 * single CSS rule can "draw" them; the parent card adds .group, and hover re-draws the lines.
 */
defineProps({ name: { type: String, required: true } })
</script>

<template>
  <svg viewBox="0 0 48 48" class="glyph h-11 w-11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <template v-if="name === 'HTML5'">
      <path pathLength="1" d="M16 14 6 24l10 10" />
      <path pathLength="1" d="M32 14l10 10-10 10" />
      <path pathLength="1" d="M27 10l-6 28" />
    </template>
    <template v-else-if="name === 'CSS3'">
      <rect pathLength="1" x="6" y="8" width="22" height="16" rx="3" />
      <rect pathLength="1" x="13" y="16" width="22" height="16" rx="3" />
      <rect pathLength="1" x="20" y="24" width="22" height="16" rx="3" />
    </template>
    <template v-else-if="name === 'jQuery'">
      <path pathLength="1" d="M31 15c-2-3-13-4-13 2.5S31 22 31 28s-11 7-14 3" />
      <path pathLength="1" d="M24 8v32" />
    </template>
    <template v-else-if="name === 'JavaScript'">
      <path pathLength="1" d="M17 9c-5 0-5 4-5 7.5S10 24 7 24c3 0 5 3.5 5 7.5S12 39 17 39" />
      <path pathLength="1" d="M31 9c5 0 5 4 5 7.5S38 24 41 24c-3 0-5 3.5-5 7.5S36 39 31 39" />
      <circle pathLength="1" cx="24" cy="24" r="2.5" />
    </template>
    <template v-else-if="name === 'Vue.js'">
      <path pathLength="1" d="M5 10l19 30 19-30" />
      <path pathLength="1" d="M14 10l10 16 10-16" />
    </template>
    <template v-else-if="name === 'Ionic'">
      <rect pathLength="1" x="14" y="5" width="20" height="38" rx="4" />
      <circle pathLength="1" cx="24" cy="23" r="4" />
      <circle pathLength="1" cx="24" cy="23" r="9" stroke-dasharray="2 3" />
    </template>
    <template v-else>
      <ellipse pathLength="1" cx="24" cy="24" rx="19" ry="8" transform="rotate(-25 24 24)" />
      <path pathLength="1" d="M24 16l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
      <circle pathLength="1" cx="40" cy="15" r="2" />
    </template>
  </svg>
</template>

<style scoped>
.glyph :is(path, rect, circle, ellipse):not([stroke-dasharray]) {
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
}
:global(.group:hover) .glyph :is(path, rect, circle, ellipse):not([stroke-dasharray]),
:global(.group:focus-within) .glyph :is(path, rect, circle, ellipse):not([stroke-dasharray]) {
  animation: draw 1.1s cubic-bezier(0.65, 0, 0.35, 1) both;
}
@keyframes draw {
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
}
</style>
