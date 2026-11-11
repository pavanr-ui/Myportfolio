/**
 * Core motion setup shared by every animation composable.
 *
 * Motion modes
 *  - 'reduced' : the visitor asked the OS for reduced motion → no GSAP animation at all.
 *  - 'lite'    : low-powered device / data saver / user choice → simple reveals only
 *                (no particles, no 3D tilt, no pinned horizontal gallery, no orbit spin).
 *  - 'full'    : the complete cinematic experience.
 */
import { reactive } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)
gsap.defaults({ ease: 'expo.out', duration: 1.1 })
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText }

const mq = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches

function readPref() {
  try {
    return localStorage.getItem('motion')
  } catch {
    return null
  }
}

function detectLowPower() {
  const n = navigator
  if (n.connection?.saveData) return true
  if (n.hardwareConcurrency && n.hardwareConcurrency <= 4) return true
  if (n.deviceMemory && n.deviceMemory <= 4) return true
  return false
}

const reducedSystem = mq('(prefers-reduced-motion: reduce)')
const pref = readPref() // 'lite' | 'full' | null
const autoLite = detectLowPower()
const mode = reducedSystem ? 'reduced' : pref === 'lite' ? 'lite' : pref === 'full' ? 'full' : autoLite ? 'lite' : 'full'

/** Static for the lifetime of the page (changing the preference reloads). */
export const motion = Object.freeze({
  mode,
  reduced: mode === 'reduced',
  lite: mode === 'lite',
  full: mode === 'full',
  animate: mode !== 'reduced',
  autoLite,
  finePointer: mq('(hover: hover) and (pointer: fine)'),
  desktop: mq('(min-width: 1024px)'),
})

if (typeof document !== 'undefined') {
  document.documentElement.classList.add(`motion-${mode}`)
}

/** Persist a preference ('lite' | 'full') and reload so every animation re-initialises cleanly. */
export function setMotionPreference(value) {
  try {
    localStorage.setItem('motion', value)
  } catch {}
  window.location.reload()
}

export function prefersReducedMotion() {
  return motion.reduced
}

/** Shared app state — `ready` flips when the intro hands over to the hero. */
export const appState = reactive({ ready: false, introPlayed: false })

/** Wait for web fonts so text splitting measures the final typography. */
export function fontsReady() {
  return Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 2500))])
}

/** Debounced global refresh — sections call this once their triggers exist. */
let refreshTimer
export function queueRefresh() {
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => {
    ScrollTrigger.sort()
    ScrollTrigger.refresh()
  }, 120)
}

if (import.meta.env.DEV) window.__gsap = { gsap, ScrollTrigger, motion } // debugging aid (dev only)
