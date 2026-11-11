import { ref } from 'vue'
import { prefersReducedMotion } from './motion'

const isDark = ref(document.documentElement.classList.contains('dark'))

function apply(dark) {
  isDark.value = dark
  document.documentElement.classList.toggle('dark', dark)
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  } catch {}
}

/**
 * Toggle theme. Uses the View Transitions API for a soft circular reveal
 * from the toggle button when available, otherwise a short colour cross-fade.
 */
function toggle(event) {
  const next = !isDark.value

  if (prefersReducedMotion()) return apply(next)

  if (!document.startViewTransition) {
    const root = document.documentElement
    root.classList.add('theme-fade')
    apply(next)
    window.setTimeout(() => root.classList.remove('theme-fade'), 550)
    return
  }

  const x = event?.clientX ?? window.innerWidth - 40
  const y = event?.clientY ?? 40
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  const vt = document.startViewTransition(() => apply(next))
  vt.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 700, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
    )
  })
}

export function useTheme() {
  return { isDark, toggle }
}
