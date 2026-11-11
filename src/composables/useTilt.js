import { onMounted, onBeforeUnmount } from 'vue'
import { gsap, motion } from './motion'

/**
 * 3D tilt that follows the pointer, plus glare coordinates exposed as CSS variables
 * (--gx / --gy in px) so a child can render a light reflection.
 * Full motion + mouse only. Transforms only → GPU friendly.
 */
export function useTilt(elRef, { max = 8, perspective = 1000 } = {}) {
  let cleanup
  onMounted(() => {
    const el = elRef.value?.$el ?? elRef.value
    if (!el || !motion.full || !motion.finePointer) return
    gsap.set(el, { transformPerspective: perspective })
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'power3.out' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      ry((px - 0.5) * max * 2)
      rx(-(py - 0.5) * max * 2)
      el.style.setProperty('--gx', `${e.clientX - r.left}px`)
      el.style.setProperty('--gy', `${e.clientY - r.top}px`)
    }
    const leave = () => {
      rx(0)
      ry(0)
    }
    el.addEventListener('pointermove', move, { passive: true })
    el.addEventListener('pointerleave', leave)
    cleanup = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(el)
    }
  })
  onBeforeUnmount(() => cleanup?.())
}
