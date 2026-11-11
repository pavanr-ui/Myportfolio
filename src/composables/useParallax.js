import { onMounted, onBeforeUnmount } from 'vue'
import { gsap, motion } from './motion'

/**
 * Scrubbed vertical drift for every [data-parallax="amount"] inside `root`.
 * Must be called inside a gsap.context (useScrollReveal does this) so it is cleaned up.
 * Horizontal drift: data-parallax-x="amount".
 */
export function applyParallax(root) {
  if (!motion.animate) return
  root.querySelectorAll('[data-parallax], [data-parallax-x]').forEach((el) => {
    const y = parseFloat(el.dataset.parallax || 0)
    const x = parseFloat(el.dataset.parallaxX || 0)
    // lite mode keeps parallax but halves the distance
    const k = motion.lite ? 0.5 : 1
    gsap.fromTo(
      el,
      { yPercent: -y * 50 * k, xPercent: -x * 50 * k },
      {
        yPercent: y * 50 * k,
        xPercent: x * 50 * k,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  })
}

/** Standalone composable: parallax for a single element ref. */
export function useParallax(elRef, amount = 0.2) {
  let ctx
  onMounted(() => {
    if (!motion.animate || !elRef.value) return
    elRef.value.dataset.parallax = amount
    ctx = gsap.context(() => applyParallax(elRef.value.parentElement))
  })
  onBeforeUnmount(() => ctx?.revert())
}
