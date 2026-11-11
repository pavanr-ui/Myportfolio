import { ref, onMounted, onBeforeUnmount } from 'vue'

/** Time-of-day greeting from the visitor's own clock (refreshes every few minutes). */
function compute(d = new Date()) {
  const h = d.getHours()
  if (h >= 5 && h < 12) return { text: 'Good morning', period: 'morning' }
  if (h >= 12 && h < 17) return { text: 'Good afternoon', period: 'afternoon' }
  if (h >= 17 && h < 22) return { text: 'Good evening', period: 'evening' }
  return { text: 'Working late? Welcome', period: 'night' }
}

export function useGreeting() {
  const greeting = ref(compute())
  let t
  onMounted(() => {
    t = setInterval(() => (greeting.value = compute()), 5 * 60 * 1000)
  })
  onBeforeUnmount(() => clearInterval(t))
  return greeting
}
