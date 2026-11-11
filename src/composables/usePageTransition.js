import { gsap, motion } from './motion'

const rectInset = (r) =>
  `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px round 18px)`
const FULL = 'inset(0px 0px 0px 0px round 0px)'

/**
 * Cinematic "page" transition for full-screen views (e.g. project case studies):
 * the view expands out of the element that opened it, and collapses back into it.
 */
export function usePageTransition() {
  function enter(el, fromEl) {
    if (!motion.animate || !el) return Promise.resolve()
    const from = fromEl?.getBoundingClientRect()
    const tl = gsap.timeline()
    if (from && motion.full) {
      tl.fromTo(el, { clipPath: rectInset(from) }, { clipPath: FULL, duration: 1.05, ease: 'expo.inOut' })
    } else {
      tl.fromTo(el, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6 })
    }
    tl.from(el.querySelectorAll('[data-pt]'), { y: 40, autoAlpha: 0, stagger: 0.06, duration: 0.9 }, '-=0.35')
    return tl.then()
  }

  function leave(el, toEl) {
    if (!motion.animate || !el) return Promise.resolve()
    const to = toEl?.getBoundingClientRect()
    const inView = to && to.bottom > 0 && to.top < window.innerHeight
    const tween =
      inView && motion.full
        ? gsap.to(el, { clipPath: rectInset(to), duration: 0.85, ease: 'expo.inOut' })
        : gsap.to(el, { autoAlpha: 0, y: 20, duration: 0.4, ease: 'power2.in' })
    return tween.then(() => gsap.set(el, { clearProps: 'all' }))
  }

  return { enter, leave }
}
