import { onMounted, onBeforeUnmount } from 'vue'
import { gsap, SplitText, motion, fontsReady } from './motion'

/**
 * Split an element's text and reveal it.
 *   type:   'chars' | 'words' | 'lines'
 *   scroll: true → plays when scrolled into view; false → returns a paused timeline (call play()).
 * Returns { play } so callers can sequence it (e.g. after the intro).
 */
export function useTextReveal(elRef, { type = 'chars', scroll = true, delay = 0, stagger } = {}) {
  let ctx
  let tl
  let pending = false

  onMounted(async () => {
    if (!motion.animate) return
    await fontsReady()
    const el = elRef.value
    if (!el) return
    const effective = type === 'chars' && motion.lite ? 'lines' : type
    ctx = gsap.context(() => {
      const split = SplitText.create(el, {
        type: effective === 'chars' ? 'lines,chars' : effective,
        mask: 'lines',
        linesClass: 'split-line',
      })
      const targets = split[effective]
      tl = gsap.timeline({
        paused: !scroll,
        delay,
        scrollTrigger: scroll ? { trigger: el, start: 'top 85%', once: true } : undefined,
      })
      tl.from(targets, {
        yPercent: 115,
        rotate: effective === 'chars' ? 8 : 0,
        duration: 1.2,
        stagger: stagger ?? (effective === 'chars' ? 0.03 : 0.1),
      })
      if (pending) tl.play()
    }, el)
  })

  onBeforeUnmount(() => ctx?.revert())

  return {
    play() {
      if (tl) tl.play()
      else pending = true
    },
  }
}
