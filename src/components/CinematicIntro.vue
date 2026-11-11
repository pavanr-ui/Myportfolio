<script setup>
/**
 * Cinematic opening: dark stage → drawing grid → name letter by letter → light sweep →
 * role lines → curtain wipe into the hero.
 * - Plays once per browser session (sessionStorage), never for reduced motion.
 * - "Skip intro" button and the Esc key jump straight to the hand-over.
 * - A safety timeout guarantees the page is never held behind the intro.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap, motion, appState, fontsReady } from '@/composables/motion'
import { site } from '@/config/site'

const KEY = 'intro-seen'
const seen = (() => {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
})()

const shouldPlay = site.intro?.enabled !== false && motion.animate && !seen
const visible = ref(shouldPlay)
const root = ref(null)
const count = ref('000')
const words = site.name.toUpperCase().split(' ')
const year = new Date().getFullYear()

let tl
let safety

function handOver() {
  appState.ready = true
}
function finish() {
  handOver()
  visible.value = false
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onKey)
  clearTimeout(safety)
}
function skip() {
  if (!tl) return finish()
  if (tl.time() < tl.labels.exit) tl.seek('exit')
  tl.timeScale(1.6)
}
function onKey(e) {
  if (e.key === 'Escape') skip()
}

onMounted(async () => {
  if (!shouldPlay) {
    appState.ready = true
    return
  }
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {}
  appState.introPlayed = true
  document.documentElement.style.overflow = 'hidden'
  window.addEventListener('keydown', onKey)
  safety = setTimeout(finish, 8000)

  await fontsReady()
  const el = root.value
  if (!el) return
  const q = (s) => el.querySelectorAll(s)
  const counter = { v: 0 }
  const lite = motion.lite

  tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: finish })
  tl.fromTo(q('.in-grid'), { autoAlpha: 0, scale: 1.15 }, { autoAlpha: 1, scale: 1, duration: 1.6, ease: 'power3.out' }, 0)
    .to(counter, {
      v: 100,
      duration: lite ? 1.4 : 2.4,
      ease: 'power2.inOut',
      onUpdate: () => (count.value = String(Math.round(counter.v)).padStart(3, '0')),
    }, 0.1)
    .from(q('.in-corner'), { autoAlpha: 0, y: 10, stagger: 0.08, duration: 0.8 }, 0.15)
    .from(q('.in-rule'), { scaleX: 0, duration: 1.2, ease: 'expo.inOut', stagger: 0.1 }, 0.2)
    .from(q('.in-char'), { yPercent: 115, duration: 1, stagger: lite ? 0.02 : 0.045 }, 0.35)
    .fromTo(q('.in-sweep'), { xPercent: -150 }, { xPercent: 450, duration: 1.2, ease: 'power2.inOut' }, lite ? 0.8 : 1.15)
    .from(q('.in-role'), { autoAlpha: 0, y: 14, letterSpacing: '0.7em', stagger: 0.14, duration: 1.2 }, lite ? 0.9 : 1.45)
    .addLabel('exit', lite ? 1.9 : 2.75)
    .to(q('.in-content'), { autoAlpha: 0, y: -30, duration: 0.6, ease: 'power2.in' }, 'exit')
    .to(q('.in-grid'), { autoAlpha: 0, duration: 0.6 }, 'exit')
    .call(handOver, null, 'exit+=0.35')
    .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.05, ease: 'expo.inOut' }, 'exit+=0.3')
})

onBeforeUnmount(() => {
  tl?.kill()
  clearTimeout(safety)
  window.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div
    v-if="visible"
    ref="root"
    class="fixed inset-0 z-[150] overflow-hidden bg-abyss text-paper"
    style="clip-path: inset(0% 0% 0% 0%)"
  >
    <p class="sr-only" role="status">Loading the portfolio of {{ site.name }}</p>

    <!-- animated grid -->
    <div
      class="in-grid mask-radial absolute inset-0"
      aria-hidden="true"
      style="
        background-image: linear-gradient(rgb(248 247 244 / 0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgb(248 247 244 / 0.06) 1px, transparent 1px);
        background-size: 72px 72px;
        background-position: center;
      "
    />

    <!-- corners -->
    <div class="in-content pointer-events-none absolute inset-0" aria-hidden="true">
      <span class="in-corner absolute left-6 top-6 font-mono text-[0.6875rem] tracking-[0.2em] text-paper/50 sm:left-10 sm:top-8">
        PR — PORTFOLIO
      </span>
      <span class="in-corner absolute right-6 top-6 font-mono text-[0.6875rem] tracking-[0.2em] text-paper/50 sm:right-10 sm:top-8">
        {{ year }}
      </span>
      <span class="in-corner absolute bottom-7 right-6 font-mono text-sm tabular-nums tracking-[0.2em] text-steel sm:right-10 sm:bottom-9">
        {{ count }}
      </span>

      <!-- centre stage -->
      <div class="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <span class="in-rule mb-8 block h-px w-24 bg-steel/70" />
        <div class="relative overflow-hidden px-2">
          <h2 class="display-caps text-[clamp(2.6rem,9vw,7.5rem)] leading-[0.95]">
            <span v-for="(w, wi) in words" :key="wi" class="inline-block whitespace-nowrap">
              <span class="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span v-for="(ch, ci) in w" :key="ci" class="in-char inline-block">{{ ch }}</span>
              </span>
              <span v-if="wi < words.length - 1" class="inline-block w-[0.28em]" />
            </span>
          </h2>
          <!-- horizontal light sweep -->
          <span
            class="in-sweep pointer-events-none absolute inset-y-0 left-0 w-1/4 -skew-x-12"
            style="background: linear-gradient(90deg, transparent, rgb(248 247 244 / 0.22), transparent)"
          />
        </div>
        <span class="in-rule mt-8 block h-px w-full max-w-md origin-center bg-paper/15" />
        <div class="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
          <span class="in-role font-sans text-[0.75rem] font-semibold tracking-[0.42em] text-paper/80">FRONTEND DEVELOPER</span>
          <span class="in-role hidden h-1 w-1 rounded-full bg-steel sm:block" />
          <span class="in-role font-sans text-[0.75rem] font-semibold tracking-[0.42em] text-steel">AI-ASSISTED DEVELOPMENT</span>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="absolute bottom-6 left-6 rounded-full border border-paper/20 px-4 py-2 font-mono text-[0.6875rem] tracking-[0.2em] text-paper/70 transition-colors hover:border-paper/60 hover:text-paper focus-visible:outline-steel sm:bottom-8 sm:left-10"
      @click="skip"
    >
      SKIP INTRO <span aria-hidden="true">→</span>
    </button>
  </div>
</template>
