import { onMounted, onBeforeUnmount } from 'vue'
import { gsap, motion } from './motion'

/**
 * Magnetic pull toward the pointer. Pure transforms (GPU-friendly), fine pointers only,
 * never on reduced motion. Keyboard focus is unaffected — the element never moves on focus.
 *   strength: how far the element follows (0–1)
 *   inner:    optional selector for a child that moves a little further (parallax feel)
 */
export function useMagneticHover(elRef, { strength = 0.3, inner } = {}) {
  let cleanup

  onMounted(() => {
    const el = elRef.value?.$el ?? elRef.value
    if (!el || !motion.finePointer || !motion.animate) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const child = inner ? el.querySelector(inner) : null
    const cxTo = child && gsap.quickTo(child, 'x', { duration: 0.6, ease: 'power3.out' })
    const cyTo = child && gsap.quickTo(child, 'y', { duration: 0.6, ease: 'power3.out' })

    const move = (e) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      xTo(dx * strength)
      yTo(dy * strength)
      cxTo?.(dx * strength * 0.5)
      cyTo?.(dy * strength * 0.5)
    }
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' })
      if (child) gsap.to(child, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' })
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    cleanup = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf([el, child].filter(Boolean))
    }
  })

  onBeforeUnmount(() => cleanup?.())
}
