import { motion } from './motion'

/**
 * Press feedback: a soft ripple that expands from the exact press point.
 * Pure CSS animation on a transient span; removed when finished. Skipped for reduced motion.
 * Usage: @pointerdown="ripple"
 */
export function ripple(e) {
  if (motion.reduced) return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const size = Math.max(r.width, r.height) * 2.2
  const dot = document.createElement('span')
  dot.className = 'ripple-dot'
  dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${
    e.clientY - r.top - size / 2
  }px`
  el.appendChild(dot)
  dot.addEventListener('animationend', () => dot.remove(), { once: true })
}
