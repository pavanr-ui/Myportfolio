<script setup>
import { ref } from 'vue'
import AboutVisual from '../AboutVisual.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { gsap, SplitText } from '@/composables/motion'
import { aboutBlocks } from '@/data/content'

const root = ref(null)

useScrollReveal(root, (el) => {
  // the statement inks in word by word, tied to scroll progress (no hijacking — native scroll)
  const statement = el.querySelector('.about-statement')
  const split = SplitText.create(statement, { type: 'words' })
  gsap.fromTo(
    split.words,
    { opacity: 0.1 },
    {
      opacity: 1,
      ease: 'none',
      stagger: 0.08,
      scrollTrigger: {
        trigger: el.querySelector('.about-story'),
        start: 'top 65%',
        end: window.matchMedia('(min-width: 1024px)').matches ? 'bottom bottom' : 'bottom 55%',
        scrub: true,
      },
    },
  )
})
</script>

<template>
  <section id="about" ref="root" class="section overflow-clip" aria-labelledby="about-title">
    <!-- background typography layer -->
    <p
      class="display-caps text-outline pointer-events-none absolute -left-4 top-10 select-none whitespace-nowrap text-[clamp(8rem,22vw,20rem)]"
      data-parallax-x="0.25"
      aria-hidden="true"
    >
      About
    </p>

    <div class="container-site relative">
      <div class="mb-12 flex items-center gap-4" data-reveal>
        <span class="font-display text-lg italic text-accent-ink">01</span>
        <span class="h-px w-10 bg-line" aria-hidden="true" />
        <h2 id="about-title" class="label">About</h2>
      </div>

      <!-- sticky storytelling statement (desktop); normal flow on small screens -->
      <div class="about-story relative lg:-mt-24 lg:h-[200vh]">
        <div class="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
          <p class="about-statement display-caps max-w-6xl text-balance text-[clamp(2.4rem,6.2vw,6.25rem)] leading-[0.98]">
            I create digital experiences that feel <em class="text-accent-ink">simple</em>,
            <em class="text-accent-ink">fast</em> and <em class="text-accent-ink">intuitive</em>.
          </p>
        </div>
      </div>

      <!-- journey -->
      <div class="mt-20 grid gap-12 lg:mt-10 lg:grid-cols-12 lg:gap-10">
        <div class="lg:col-span-4" data-reveal>
          <p class="font-display text-[clamp(5rem,10vw,8.5rem)] leading-none">
            <span data-count="8">8</span><span class="text-accent">+</span>
          </p>
          <p class="label mt-3">Years in IT</p>
        </div>
        <div class="space-y-6 text-[1.0625rem] leading-relaxed text-muted lg:col-span-7 lg:col-start-6" data-stagger="0.12">
          <p>
            With <strong class="font-semibold text-ink">8+ years in IT</strong>, I now work as a
            <strong class="font-semibold text-ink">Frontend Developer at AlertDriving</strong> — building Vue.js,
            Ionic and Quasar applications, interactive dashboards, reusable UI components, responsive interfaces,
            accessibility improvements and AI Assistant features.
          </p>
          <p>
            I care about clean architecture and reusable components: interfaces built from well-scoped pieces that
            stay easy to understand as a product grows. Responsive layouts, accessibility and performance are part of
            how I build from the start — not a final checklist.
          </p>
          <p>
            I’m also learning and experimenting with AI-assisted development. I use modern AI tools to accelerate
            development, then review the generated code, improve the solution and keep quality high.
          </p>
        </div>
      </div>

      <!-- three storytelling blocks -->
      <div class="mt-24 lg:mt-36">
        <article v-for="b in aboutBlocks" :key="b.index" class="relative py-14 lg:py-20">
          <span class="absolute inset-x-0 top-0 h-px bg-line" data-line aria-hidden="true" />
          <div class="grid items-center gap-10 lg:grid-cols-12">
            <div class="lg:col-span-6">
              <p class="mb-6 flex items-center gap-4" data-reveal>
                <span class="font-display text-5xl italic text-accent-ink">{{ b.index }}</span>
                <span class="h-px w-12 bg-accent/60" aria-hidden="true" />
              </p>
              <h3 class="display-caps text-[clamp(2.2rem,4.6vw,4rem)]" data-split="chars">{{ b.title }}</h3>
              <p class="mt-6 max-w-xl leading-relaxed text-muted" data-reveal>{{ b.text }}</p>
              <ul class="mt-7 flex flex-wrap gap-2" data-stagger="0.06">
                <li v-for="p in b.points" :key="p" class="tag">{{ p }}</li>
              </ul>
            </div>
            <div class="lg:col-span-5 lg:col-start-8">
              <div class="aspect-[3/2] overflow-hidden rounded-2xl border border-line" data-reveal="mask">
                <div class="h-full w-full scale-110" data-parallax="0.12">
                  <AboutVisual :variant="b.visual" />
                </div>
              </div>
            </div>
          </div>
        </article>
        <span class="block h-px bg-line" data-line aria-hidden="true" />
      </div>
    </div>
  </section>
</template>
