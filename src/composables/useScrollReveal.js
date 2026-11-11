import { onMounted, onBeforeUnmount } from 'vue'
import { gsap, SplitText, motion, fontsReady, queueRefresh } from './motion'
import { applyParallax } from './useParallax'

/**
 * Declarative scroll animations for everything inside `rootRef`:
 *
 *  [data-split]            heading reveals line by line from a mask
 *  [data-split="chars"]    …character by character (lines in lite mode)
 *  [data-reveal]           fades + rises in
 *  [data-reveal="mask"]    clip-path wipe from the bottom
 *  [data-reveal="mask-x"]  clip-path wipe from the left
 *  [data-stagger="0.1"]    direct children enter in sequence
 *  [data-line] / ="y"      hairline draws horizontally / vertically
 *  [data-count="8"]        number counts up from 0
 *  [data-parallax="0.2"]   drifts while scrolling (scrubbed)
 *
 * All tweens live in one gsap.context scoped to the section and are reverted on unmount,
 * so ScrollTriggers are never duplicated or leaked. Nothing runs for reduced motion —
 * content is simply visible.
 *
 * `extra(root, ctx)` lets a section add bespoke animations inside the same context.
 */
export function useScrollReveal(rootRef, extra) {
  let ctx
  let alive = true

  onMounted(async () => {
    if (!motion.animate) return
    await fontsReady()
    const root = rootRef.value
    if (!alive || !root) return

    ctx = gsap.context(() => {
      const shown = { y: 0, autoAlpha: 1, clearProps: 'transform,opacity,visibility' }
      const st = (trigger, start = 'top 86%') => ({ trigger, start, once: true })

      root.querySelectorAll('[data-split]').forEach((el) => {
        const chars = el.dataset.split === 'chars' && motion.full
        const split = SplitText.create(el, {
          type: chars ? 'lines,chars' : 'lines',
          mask: 'lines',
          linesClass: 'split-line',
        })
        gsap.from(chars ? split.chars : split.lines, {
          yPercent: 115,
          rotate: chars ? 6 : 0,
          duration: chars ? 1.1 : 1.25,
          stagger: chars ? 0.014 : 0.09,
          scrollTrigger: st(el),
        })
      })

      root.querySelectorAll('[data-reveal]').forEach((el) => {
        const kind = el.dataset.reveal
        const delay = parseFloat(el.dataset.delay || 0)
        if (kind === 'mask' || kind === 'mask-x') {
          gsap.fromTo(
            el,
            { clipPath: kind === 'mask' ? 'inset(100% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.4,
              ease: 'expo.inOut',
              delay,
              clearProps: 'clipPath',
              scrollTrigger: st(el, 'top 85%'),
            },
          )
        } else {
          gsap.fromTo(el, { y: 36, autoAlpha: 0 }, { ...shown, delay, scrollTrigger: st(el, 'top 88%') })
        }
      })

      root.querySelectorAll('[data-stagger]').forEach((el) => {
        gsap.fromTo(
          el.children,
          { y: 44, autoAlpha: 0 },
          { ...shown, stagger: parseFloat(el.dataset.stagger || 0.1), scrollTrigger: st(el, 'top 85%') },
        )
      })

      root.querySelectorAll('[data-line]').forEach((el) => {
        const vertical = el.dataset.line === 'y'
        gsap.from(el, {
          [vertical ? 'scaleY' : 'scaleX']: 0,
          transformOrigin: vertical ? 'center top' : 'left center',
          duration: 1.6,
          ease: 'expo.inOut',
          scrollTrigger: st(el, 'top 92%'),
        })
      })

      root.querySelectorAll('[data-count]').forEach((el) => {
        const end = parseFloat(el.dataset.count)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: end,
          duration: 1.8,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = Math.round(obj.v)),
          scrollTrigger: st(el, 'top 90%'),
        })
      })

      applyParallax(root)
      extra?.(root)
    }, root)

    queueRefresh()
  })

  onBeforeUnmount(() => {
    alive = false
    ctx?.revert()
  })
}

/** Backwards-compatible name used by the original sections. */
export const useSectionMotion = useScrollReveal
