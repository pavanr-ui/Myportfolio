<script setup>
/**
 * Hero avatar video.
 *  Ambient mode : muted · looped · inline. Starts only when on screen (and after the intro),
 *                 pauses when scrolled away. Poster shows instantly → no layout shift.
 *  Watch mode   : "Watch My Intro" restarts it with sound, captions and full controls;
 *                 when it ends it returns to ambient mode.
 * Reduced motion / data saver / low-power: no autoplay — poster + play button instead.
 */
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Play, Pause, RotateCcw, Volume2, VolumeX, Captions, Maximize2, X } from 'lucide-vue-next'
import { motion, appState } from '@/composables/motion'
import { useSound } from '@/composables/useSound'
import { site } from '@/config/site'

const cfg = site.avatarVideo
const root = ref(null)
const video = ref(null)
const mode = ref('ambient') // ambient | watching
const playing = ref(false)
const muted = ref(true)
const captionsOn = ref(true)
const progress = ref(0)
const duration = ref(0)
const inView = ref(false)
const { play: sound } = useSound()

const saveData = typeof navigator !== 'undefined' && navigator.connection?.saveData
const ambientAllowed = motion.full && !saveData
const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`
const timeLabel = computed(() => `${fmt(progress.value * duration.value)} / ${fmt(duration.value)}`)

function setCaptions(on) {
  const track = video.value?.textTracks?.[0]
  if (track) track.mode = on ? 'showing' : 'hidden'
}

async function safePlay() {
  try {
    await video.value.play()
  } catch {
    playing.value = false
  }
}

function startAmbient() {
  const v = video.value
  if (!v || mode.value !== 'ambient' || !ambientAllowed) return
  v.muted = true
  v.loop = true
  if (v.preload !== 'auto') v.preload = 'auto'
  safePlay()
}

/** Public: restart with sound, captions and controls. */
async function watchIntro() {
  const v = video.value
  if (!v) return
  sound('open')
  mode.value = 'watching'
  v.loop = false
  v.muted = false
  muted.value = false
  v.currentTime = 0
  setCaptions(captionsOn.value)
  if (root.value) {
    const r = root.value.getBoundingClientRect()
    if (r.top < 0 || r.bottom > window.innerHeight) {
      root.value.scrollIntoView({ behavior: motion.reduced ? 'auto' : 'smooth', block: 'center' })
    }
  }
  await safePlay()
  await nextTick()
  root.value?.querySelector('[data-first-control]')?.focus({ preventScroll: true })
}

function exitWatch() {
  const v = video.value
  mode.value = 'ambient'
  setCaptions(false)
  if (!v) return
  v.muted = true
  muted.value = true
  if (ambientAllowed && inView.value) startAmbient()
  else v.pause()
}

function togglePlay() {
  const v = video.value
  if (!v) return
  if (v.paused) {
    if (mode.value === 'ambient' && !ambientAllowed) return watchIntro()
    safePlay()
  } else v.pause()
}
function toggleMute() {
  video.value.muted = !video.value.muted
  muted.value = video.value.muted
}
function toggleCaptions() {
  captionsOn.value = !captionsOn.value
  setCaptions(captionsOn.value)
}
function restart() {
  video.value.currentTime = 0
  safePlay()
}
function seek(e) {
  const v = video.value
  if (v && duration.value) v.currentTime = (Number(e.target.value) / 1000) * duration.value
}
function fullscreen() {
  const el = root.value
  if (document.fullscreenElement) document.exitFullscreen()
  else el?.requestFullscreen?.()
}

function onTime() {
  const v = video.value
  if (v?.duration) progress.value = v.currentTime / v.duration
}
function onEnded() {
  if (mode.value === 'watching') exitWatch()
}

let io
onMounted(() => {
  const v = video.value
  setCaptions(false)
  io = new IntersectionObserver(
    ([e]) => {
      inView.value = e.isIntersecting
      if (!e.isIntersecting) v.pause()
      else if (mode.value === 'ambient' && appState.ready) startAmbient()
    },
    { threshold: 0.3 },
  )
  io.observe(root.value)
})
watch(
  () => appState.ready,
  (r) => r && inView.value && startAmbient(),
)
onBeforeUnmount(() => {
  io?.disconnect()
  video.value?.pause()
})

defineExpose({ watchIntro })
</script>

<template>
  <figure ref="root" class="avatar-frame relative isolate mx-auto w-full" :class="mode === 'watching' ? 'is-watching' : ''">
    <!-- soft blue/purple glow around the avatar -->
    <div class="avatar-glow pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] opacity-80 blur-2xl" aria-hidden="true" />
    <div class="avatar-ring css-loop pointer-events-none absolute -inset-px rounded-[1.7rem]" aria-hidden="true" />

    <div class="relative overflow-hidden rounded-[1.6rem] bg-abyss shadow-[0_40px_120px_-40px_rgb(var(--c-accent)/0.55)]">
      <!-- 16:9 box matching the video → the avatar is never cropped, and there is no layout shift -->
      <video
        ref="video"
        class="block aspect-video h-auto w-full object-cover"
        :width="cfg.width"
        :height="cfg.height"
        :poster="cfg.poster"
        muted
        loop
        playsinline
        preload="none"
        disablepictureinpicture
        :aria-label="`${cfg.label}: Pavan introducing himself`"
        @play="playing = true"
        @pause="playing = false"
        @timeupdate="onTime"
        @loadedmetadata="duration = video.duration"
        @ended="onEnded"
      >
        <source :src="cfg.src" type="video/mp4" />
        <track kind="captions" srclang="en" label="English" :src="cfg.captions" />
      </video>

      <!-- label: honest about what this is -->
      <span class="absolute left-2.5 top-2.5 rounded-full bg-black/45 px-2 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.14em] text-white/80 backdrop-blur sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-[0.625rem]">
        {{ cfg.label }}
      </span>

      <!-- ambient overlay: watch button -->
      <button
        v-if="mode === 'ambient'"
        type="button"
        class="group absolute inset-0 grid place-items-end justify-start p-2.5 text-left sm:p-5"
        data-cursor="Watch"
        aria-label="Watch my intro with sound"
        @click="watchIntro"
      >
        <span class="flex items-center gap-2 rounded-full bg-black/45 py-1.5 pl-1.5 pr-3 text-xs font-semibold text-white backdrop-blur transition-colors duration-300 group-hover:bg-black/65 sm:gap-3 sm:py-2 sm:pl-2 sm:pr-4 sm:text-sm">
          <span class="grid h-7 w-7 place-items-center rounded-full bg-white text-abyss transition-transform duration-500 group-hover:scale-110 sm:h-9 sm:w-9">
            <Play class="h-4 w-4 translate-x-px" fill="currentColor" aria-hidden="true" />
          </span>
          <span class="hidden sm:inline">Watch my intro ·</span> 0:14
        </span>
      </button>

      <!-- watch-mode controls -->
      <div
        v-else
        class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-4 pb-3 pt-10 text-white"
        role="group"
        aria-label="Video controls"
      >
        <input
          type="range"
          min="0"
          max="1000"
          :value="Math.round(progress * 1000)"
          class="avatar-seek mb-2 w-full"
          aria-label="Seek"
          :aria-valuetext="timeLabel"
          @input="seek"
        />
        <div class="flex items-center gap-1">
          <button type="button" class="ctrl" data-first-control :aria-label="playing ? 'Pause' : 'Play'" @click="togglePlay">
            <Pause v-if="playing" class="h-4 w-4" aria-hidden="true" />
            <Play v-else class="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" class="ctrl" aria-label="Restart" @click="restart"><RotateCcw class="h-4 w-4" aria-hidden="true" /></button>
          <button type="button" class="ctrl" :aria-label="muted ? 'Unmute' : 'Mute'" :aria-pressed="muted" @click="toggleMute">
            <VolumeX v-if="muted" class="h-4 w-4" aria-hidden="true" />
            <Volume2 v-else class="h-4 w-4" aria-hidden="true" />
          </button>
          <span class="ml-2 font-mono text-[0.6875rem] tabular-nums text-white/80">{{ timeLabel }}</span>
          <span class="flex-1" />
          <button type="button" class="ctrl" :aria-pressed="captionsOn" aria-label="Captions" @click="toggleCaptions">
            <Captions class="h-4 w-4" :class="captionsOn ? '' : 'opacity-50'" aria-hidden="true" />
          </button>
          <button type="button" class="ctrl" aria-label="Full screen" @click="fullscreen"><Maximize2 class="h-4 w-4" aria-hidden="true" /></button>
          <button type="button" class="ctrl" aria-label="Close intro and return to preview" @click="exitWatch"><X class="h-4 w-4" aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.avatar-glow {
  background: radial-gradient(60% 60% at 30% 30%, rgb(var(--c-cyan) / 0.35), transparent 70%),
    radial-gradient(60% 60% at 75% 70%, rgb(var(--c-warm) / 0.35), transparent 70%);
}
.avatar-ring {
  padding: 1px;
  background: conic-gradient(from var(--a, 0deg), rgb(var(--c-cyan) / 0.9), rgb(var(--c-accent) / 0.2),
      rgb(var(--c-warm) / 0.9), rgb(var(--c-accent) / 0.2), rgb(var(--c-cyan) / 0.9));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  animation: spin-ring 9s linear infinite;
}
@property --a {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
@keyframes spin-ring {
  to { --a: 360deg; }
}
.ctrl {
  display: grid;
  height: 2.25rem;
  width: 2.25rem;
  place-items: center;
  border-radius: 9999px;
  transition: background-color 0.2s;
}
.ctrl:hover { background: rgb(255 255 255 / 0.15); }
.ctrl:focus-visible { outline: 2px solid rgb(var(--c-cyan)); outline-offset: 1px; }
.avatar-seek {
  height: 4px;
  accent-color: rgb(var(--c-cyan));
  cursor: pointer;
}
video::cue {
  background: rgb(0 0 0 / 0.6);
  font-size: 0.95rem;
}
.avatar-frame:fullscreen { display: grid; place-items: center; background: #000; }
</style>
