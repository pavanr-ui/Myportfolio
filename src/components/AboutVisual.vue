<script setup>
/** Small, theme-aware editorial illustrations for the About storytelling blocks. */
defineProps({ variant: { type: String, required: true } })
</script>

<template>
  <svg viewBox="0 0 480 320" class="h-full w-full" aria-hidden="true">
    <rect width="480" height="320" fill="rgb(var(--c-subtle))" />
    <g opacity="0.5">
      <path v-for="i in 9" :key="'v' + i" :d="`M${i * 48} 0V320`" stroke="rgb(var(--c-line))" />
      <path v-for="i in 6" :key="'h' + i" :d="`M0 ${i * 48}H480`" stroke="rgb(var(--c-line))" />
    </g>

    <!-- 01 · code editor -->
    <g v-if="variant === 'code'">
      <rect x="70" y="50" width="340" height="220" rx="12" fill="rgb(var(--c-bg))" stroke="rgb(var(--c-line))" />
      <rect x="70" y="50" width="340" height="30" rx="12" fill="rgb(var(--c-surface))" />
      <circle v-for="i in 3" :key="i" :cx="80 + i * 14" cy="65" r="4" :fill="i === 3 ? 'rgb(var(--c-accent))' : 'rgb(var(--c-line))'" />
      <text x="94" y="112" font-family="ui-monospace, monospace" font-size="13" fill="rgb(var(--c-accent-ink))">&lt;template&gt;</text>
      <text x="114" y="136" font-family="ui-monospace, monospace" font-size="13" fill="rgb(var(--c-ink) / 0.8)">&lt;BaseButton variant="primary"&gt;</text>
      <text x="134" y="160" font-family="ui-monospace, monospace" font-size="13" fill="rgb(var(--c-muted))">Explore my work</text>
      <text x="114" y="184" font-family="ui-monospace, monospace" font-size="13" fill="rgb(var(--c-ink) / 0.8)">&lt;/BaseButton&gt;</text>
      <text x="94" y="208" font-family="ui-monospace, monospace" font-size="13" fill="rgb(var(--c-accent-ink))">&lt;/template&gt;</text>
      <rect class="av-blink css-loop" x="232" y="149" width="2" height="15" fill="rgb(var(--c-accent))" />
      <g class="av-float css-loop">
        <rect x="300" y="200" width="140" height="80" rx="10" fill="rgb(var(--c-ink))" />
        <text x="318" y="230" font-family="ui-monospace, monospace" font-size="11" fill="rgb(var(--c-bg) / 0.7)">reusable</text>
        <text x="318" y="252" font-family="Georgia, serif" font-style="italic" font-size="20" fill="rgb(var(--c-bg))">components</text>
      </g>
    </g>

    <!-- 02 · responsive layouts + accessibility -->
    <g v-else-if="variant === 'layout'">
      <rect x="50" y="60" width="230" height="160" rx="10" fill="rgb(var(--c-bg))" stroke="rgb(var(--c-line))" />
      <rect x="66" y="78" width="110" height="12" rx="6" fill="rgb(var(--c-ink) / 0.75)" />
      <rect x="66" y="100" width="198" height="60" rx="8" fill="rgb(var(--c-accent) / 0.25)" />
      <rect v-for="i in 3" :key="i" :x="66 + (i - 1) * 68" y="172" width="58" height="32" rx="6" fill="rgb(var(--c-subtle))" />
      <rect x="296" y="90" width="96" height="140" rx="10" fill="rgb(var(--c-bg))" stroke="rgb(var(--c-line))" />
      <rect x="306" y="104" width="60" height="8" rx="4" fill="rgb(var(--c-ink) / 0.7)" />
      <rect x="306" y="120" width="76" height="40" rx="6" fill="rgb(var(--c-accent) / 0.25)" />
      <rect x="306" y="168" width="76" height="16" rx="4" fill="rgb(var(--c-subtle))" />
      <rect x="306" y="190" width="76" height="16" rx="4" fill="rgb(var(--c-subtle))" />
      <rect x="406" y="120" width="44" height="86" rx="9" fill="rgb(var(--c-ink))" />
      <rect x="412" y="134" width="32" height="20" rx="4" fill="rgb(var(--c-accent))" />
      <g class="av-float css-loop">
        <circle cx="96" cy="250" r="28" fill="rgb(var(--c-ink))" />
        <circle cx="96" cy="238" r="4" fill="rgb(var(--c-bg))" />
        <path d="M80 246h32M96 246v14M96 260l-8 10M96 260l8 10" stroke="rgb(var(--c-bg))" stroke-width="3" stroke-linecap="round" fill="none" />
      </g>
    </g>

    <!-- 03 · AI-assisted flow with human verification -->
    <g v-else>
      <path class="av-dash css-loop" d="M110 160 C170 90, 230 90, 240 160 S330 230, 370 160" fill="none" stroke="rgb(var(--c-accent))" stroke-width="1.5" stroke-dasharray="5 7" />
      <g>
        <circle cx="110" cy="160" r="34" fill="rgb(var(--c-bg))" stroke="rgb(var(--c-line))" />
        <text x="110" y="166" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgb(var(--c-ink))">prompt</text>
      </g>
      <g>
        <circle cx="240" cy="160" r="40" fill="rgb(var(--c-ink))" />
        <path d="M240 140 l5 14 14 5 -14 5 -5 14 -5 -14 -14 -5 14 -5z" fill="rgb(var(--c-bg))" />
      </g>
      <g class="av-float css-loop">
        <circle cx="370" cy="160" r="34" fill="rgb(var(--c-accent))" />
        <path d="M356 160 l10 10 18 -20" stroke="rgb(var(--c-bg))" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <text x="240" y="240" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="18" fill="rgb(var(--c-muted))">AI drafts · human verifies</text>
    </g>
  </svg>
</template>

<style scoped>
.av-float { animation: float 6s ease-in-out infinite; }
.av-blink { animation: blink 1.1s steps(1) infinite; }
.av-dash { animation: dash 3s linear infinite; }
@keyframes float { 50% { transform: translateY(-8px); } }
@keyframes blink { 50% { opacity: 0; } }
@keyframes dash { to { stroke-dashoffset: -48; } }
</style>
