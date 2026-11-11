<script setup>
/**
 * Polished, theme-aware placeholder artwork for project cards.
 * Replace with real screenshots by setting `image` on a project in src/data/content.js.
 */
defineProps({ variant: { type: String, required: true } })
</script>

<template>
  <svg viewBox="0 0 640 480" class="h-full w-full" role="presentation" aria-hidden="true">
    <defs>
      <pattern :id="`dots-${variant}`" width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill="rgb(var(--c-accent) / 0.35)" />
      </pattern>
    </defs>
    <rect width="640" height="480" :fill="`url(#dots-${variant})`" />

    <!-- 01 · Browser window with component layout -->
    <g v-if="variant === 'browser'" class="pv-float">
      <rect x="80" y="70" width="480" height="340" rx="14" fill="rgb(var(--c-bg))" stroke="rgb(var(--c-line))" />
      <rect x="80" y="70" width="480" height="38" rx="14" fill="rgb(var(--c-subtle))" />
      <circle cx="104" cy="89" r="5" fill="rgb(var(--c-line))" />
      <circle cx="122" cy="89" r="5" fill="rgb(var(--c-line))" />
      <circle cx="140" cy="89" r="5" fill="rgb(var(--c-accent))" />
      <rect x="200" y="81" width="240" height="16" rx="8" fill="rgb(var(--c-bg))" />
      <rect x="110" y="134" width="190" height="18" rx="4" fill="rgb(var(--c-ink) / 0.85)" />
      <rect x="110" y="162" width="150" height="10" rx="5" fill="rgb(var(--c-muted) / 0.4)" />
      <rect x="110" y="180" width="170" height="10" rx="5" fill="rgb(var(--c-muted) / 0.4)" />
      <rect x="110" y="208" width="88" height="28" rx="14" fill="rgb(var(--c-accent))" />
      <rect x="330" y="128" width="200" height="120" rx="10" fill="rgb(var(--c-accent) / 0.18)" stroke="rgb(var(--c-accent) / 0.5)" />
      <path d="M350 228 l40-44 30 30 22-20 68 34" fill="none" stroke="rgb(var(--c-accent))" stroke-width="2" />
      <g v-for="i in 3" :key="i">
        <rect :x="110 + (i - 1) * 145" y="272" width="130" height="110" rx="10" fill="rgb(var(--c-subtle))" stroke="rgb(var(--c-line))" />
        <rect :x="124 + (i - 1) * 145" y="288" width="34" height="34" rx="8" fill="rgb(var(--c-accent) / 0.35)" />
        <rect :x="124 + (i - 1) * 145" y="336" width="90" height="8" rx="4" fill="rgb(var(--c-ink) / 0.6)" />
        <rect :x="124 + (i - 1) * 145" y="352" width="70" height="8" rx="4" fill="rgb(var(--c-muted) / 0.35)" />
      </g>
    </g>

    <!-- 02 · Two mobile app screens -->
    <g v-else-if="variant === 'mobile'">
      <g class="pv-float">
        <rect x="170" y="60" width="170" height="360" rx="28" fill="rgb(var(--c-ink))" />
        <rect x="179" y="69" width="152" height="342" rx="21" fill="rgb(var(--c-bg))" />
        <rect x="230" y="78" width="50" height="8" rx="4" fill="rgb(var(--c-ink))" />
        <rect x="195" y="104" width="90" height="12" rx="6" fill="rgb(var(--c-ink) / 0.8)" />
        <rect x="195" y="130" width="120" height="80" rx="12" fill="rgb(var(--c-accent) / 0.3)" />
        <g v-for="i in 4" :key="i">
          <circle cx="207" :cy="216 + i * 34" r="10" fill="rgb(var(--c-subtle))" stroke="rgb(var(--c-line))" />
          <rect x="224" :y="210 + i * 34" width="80" height="6" rx="3" fill="rgb(var(--c-ink) / 0.6)" />
          <rect x="224" :y="220 + i * 34" width="54" height="5" rx="2.5" fill="rgb(var(--c-muted) / 0.35)" />
        </g>
        <rect x="179" y="368" width="152" height="43" rx="0" fill="rgb(var(--c-subtle))" />
        <circle v-for="i in 4" :key="'t' + i" :cx="190 + i * 26" cy="389" r="5" :fill="i === 1 ? 'rgb(var(--c-accent))' : 'rgb(var(--c-line))'" />
      </g>
      <g class="pv-float-alt">
        <rect x="320" y="100" width="150" height="316" rx="26" fill="rgb(var(--c-surface))" stroke="rgb(var(--c-line))" />
        <rect x="336" y="130" width="70" height="10" rx="5" fill="rgb(var(--c-ink) / 0.8)" />
        <rect x="336" y="156" width="118" height="44" rx="10" fill="rgb(var(--c-subtle))" />
        <rect x="336" y="210" width="118" height="44" rx="10" fill="rgb(var(--c-subtle))" />
        <rect x="336" y="264" width="118" height="44" rx="10" fill="rgb(var(--c-accent) / 0.25)" />
        <rect x="336" y="352" width="118" height="32" rx="16" fill="rgb(var(--c-ink))" />
      </g>
    </g>

    <!-- 03 · Dashboard -->
    <g v-else-if="variant === 'dashboard'" class="pv-float">
      <rect x="60" y="60" width="520" height="360" rx="14" fill="rgb(var(--c-bg))" stroke="rgb(var(--c-line))" />
      <rect x="60" y="60" width="100" height="360" rx="14" fill="rgb(var(--c-subtle))" />
      <rect v-for="i in 5" :key="'n' + i" x="78" :y="70 + i * 30" width="64" height="8" rx="4" :fill="i === 1 ? 'rgb(var(--c-accent))' : 'rgb(var(--c-line))'" />
      <g v-for="i in 3" :key="'k' + i">
        <rect :x="180 + (i - 1) * 132" y="84" width="118" height="70" rx="10" fill="rgb(var(--c-subtle))" />
        <rect :x="194 + (i - 1) * 132" y="100" width="40" height="7" rx="3.5" fill="rgb(var(--c-muted) / 0.4)" />
        <rect :x="194 + (i - 1) * 132" y="118" width="64" height="16" rx="4" fill="rgb(var(--c-ink) / 0.8)" />
      </g>
      <rect x="180" y="172" width="250" height="226" rx="10" fill="rgb(var(--c-subtle))" />
      <rect
        v-for="(h, i) in [70, 110, 90, 150, 120, 170, 140]"
        :key="'b' + i"
        class="pv-bar"
        :style="{ animationDelay: `${i * 0.12}s` }"
        :x="198 + i * 32"
        :y="378 - h"
        width="18"
        :height="h"
        rx="4"
        :fill="i === 5 ? 'rgb(var(--c-accent))' : 'rgb(var(--c-accent) / 0.35)'"
      />
      <rect x="446" y="172" width="114" height="226" rx="10" fill="rgb(var(--c-subtle))" />
      <circle cx="503" cy="240" r="38" fill="none" stroke="rgb(var(--c-line))" stroke-width="12" />
      <circle cx="503" cy="240" r="38" fill="none" stroke="rgb(var(--c-accent))" stroke-width="12" stroke-dasharray="160 240" transform="rotate(-90 503 240)" />
      <rect v-for="i in 3" :key="'l' + i" x="464" :y="300 + i * 22" width="78" height="7" rx="3.5" fill="rgb(var(--c-muted) / 0.35)" />
    </g>

    <!-- 05 · AI developer journey: prompt → terminal → verified -->
    <g v-else-if="variant === 'journey'">
      <g class="pv-float">
        <rect x="70" y="70" width="330" height="250" rx="14" fill="rgb(var(--c-ink))" />
        <circle v-for="i in 3" :key="'j' + i" :cx="80 + i * 14" cy="90" r="4" :fill="i === 3 ? 'rgb(var(--c-accent))' : 'rgb(var(--c-bg) / 0.25)'" />
        <text x="94" y="134" font-family="ui-monospace, monospace" font-size="14" fill="rgb(var(--c-accent))">❯</text>
        <text x="112" y="134" font-family="ui-monospace, monospace" font-size="14" fill="rgb(var(--c-bg))">prompt: build accessible modal</text>
        <rect x="94" y="152" width="220" height="8" rx="4" fill="rgb(var(--c-bg) / 0.35)" />
        <rect x="94" y="170" width="180" height="8" rx="4" fill="rgb(var(--c-bg) / 0.25)" />
        <rect x="94" y="188" width="240" height="8" rx="4" fill="rgb(var(--c-bg) / 0.25)" />
        <text x="94" y="232" font-family="ui-monospace, monospace" font-size="13" fill="rgb(var(--c-bg) / 0.6)">› reviewing generated code…</text>
        <text x="94" y="260" font-family="ui-monospace, monospace" font-size="13" fill="rgb(var(--c-accent))">✓ verified by a human</text>
        <rect class="pv-typing" x="276" y="250" width="8" height="14" fill="rgb(var(--c-accent))" />
      </g>
      <g class="pv-float-alt">
        <rect x="360" y="170" width="210" height="190" rx="14" fill="rgb(var(--c-bg))" stroke="rgb(var(--c-line))" />
        <text x="380" y="202" font-family="ui-monospace, monospace" font-size="11" fill="rgb(var(--c-muted))">tools explored</text>
        <g v-for="(t, i) in ['ChatGPT', 'Claude', 'Claude Code', 'Copilot']" :key="t">
          <circle cx="388" :cy="226 + i * 32" r="5" fill="rgb(var(--c-accent))" />
          <text x="402" :y="231 + i * 32" font-family="Georgia, serif" font-size="16" fill="rgb(var(--c-ink))">{{ t }}</text>
        </g>
      </g>
    </g>

    <!-- 04 · AI assistant chat -->
    <g v-else class="pv-float">
      <rect x="120" y="50" width="400" height="380" rx="18" fill="rgb(var(--c-bg))" stroke="rgb(var(--c-line))" />
      <circle cx="152" cy="84" r="12" fill="rgb(var(--c-accent))" />
      <path d="M152 77 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="rgb(var(--c-bg))" />
      <rect x="174" y="78" width="90" height="10" rx="5" fill="rgb(var(--c-ink) / 0.8)" />
      <line x1="120" y1="112" x2="520" y2="112" stroke="rgb(var(--c-line))" />
      <rect x="290" y="134" width="200" height="40" rx="16" fill="rgb(var(--c-ink))" />
      <rect x="306" y="150" width="140" height="8" rx="4" fill="rgb(var(--c-bg) / 0.7)" />
      <rect x="150" y="192" width="250" height="78" rx="16" fill="rgb(var(--c-subtle))" />
      <rect x="166" y="208" width="200" height="8" rx="4" fill="rgb(var(--c-ink) / 0.55)" />
      <rect x="166" y="226" width="170" height="8" rx="4" fill="rgb(var(--c-ink) / 0.4)" />
      <rect x="166" y="244" width="120" height="8" rx="4" fill="rgb(var(--c-ink) / 0.3)" />
      <rect x="330" y="290" width="160" height="40" rx="16" fill="rgb(var(--c-ink))" />
      <rect x="150" y="348" width="96" height="34" rx="16" fill="rgb(var(--c-subtle))" />
      <circle v-for="i in 3" :key="'d' + i" class="pv-typing" :style="{ animationDelay: `${i * 0.18}s` }" :cx="174 + i * 14" cy="365" r="4" fill="rgb(var(--c-accent))" />
      <rect x="140" y="396" width="360" height="22" rx="11" fill="rgb(var(--c-subtle))" stroke="rgb(var(--c-line))" />
    </g>
  </svg>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .pv-float { animation: float 7s ease-in-out infinite; }
  .pv-float-alt { animation: float 7s ease-in-out -3.5s infinite; }
  .pv-bar { transform-box: fill-box; transform-origin: bottom; animation: grow 3.6s ease-in-out infinite alternate; }
  .pv-typing { animation: blink 1.2s ease-in-out infinite; }
}
@keyframes float { 50% { transform: translateY(-8px); } }
@keyframes grow { from { transform: scaleY(0.75); } to { transform: scaleY(1); } }
@keyframes blink { 50% { opacity: 0.25; } }
</style>
