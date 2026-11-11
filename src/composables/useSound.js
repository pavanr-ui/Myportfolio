import { ref } from 'vue'

/**
 * Very subtle interface sounds, synthesised with the Web Audio API (no audio files to download).
 * OFF by default; the visitor's choice is remembered.
 */
const enabled = ref(false)
try {
  enabled.value = localStorage.getItem('sound') === 'on'
} catch {}

let ctx

const tones = {
  // [startHz, endHz, durationSec, gain]
  click: [880, 660, 0.07, 0.035],
  open: [420, 840, 0.22, 0.03],
  close: [760, 380, 0.18, 0.025],
  toggle: [620, 930, 0.1, 0.03],
}

function play(name = 'click') {
  if (!enabled.value) return
  try {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)()
    const [f0, f1, dur, vol] = tones[name] || tones.click
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(f0, t)
    osc.frequency.exponentialRampToValueAtTime(f1, t + dur)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + dur + 0.02)
  } catch {}
}

function toggle() {
  enabled.value = !enabled.value
  try {
    localStorage.setItem('sound', enabled.value ? 'on' : 'off')
  } catch {}
  play('toggle')
}

export function useSound() {
  return { enabled, play, toggle }
}
