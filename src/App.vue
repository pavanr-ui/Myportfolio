<script setup>
import { onMounted, onBeforeUnmount, watch, defineAsyncComponent } from 'vue'
import CinematicIntro from './components/CinematicIntro.vue'
import NavBar from './components/NavBar.vue'
import SiteFooter from './components/SiteFooter.vue'
import HeroSection from './components/sections/HeroSection.vue'
import AboutSection from './components/sections/AboutSection.vue'
import ExperienceSection from './components/sections/ExperienceSection.vue'
import SkillsSection from './components/sections/SkillsSection.vue'
import ProjectsSection from './components/sections/ProjectsSection.vue'
import AIJourneySection from './components/sections/AIJourneySection.vue'
import PhilosophySection from './components/sections/PhilosophySection.vue'
import ContactSection from './components/sections/ContactSection.vue'
import { ScrollTrigger, appState, motion, queueRefresh } from './composables/motion'

// Custom cursor: desktop fine pointers only, never with reduced motion — and loaded lazily.
const CustomCursor =
  motion.finePointer && motion.animate ? defineAsyncComponent(() => import('./components/CustomCursor.vue')) : null

// Recalculate trigger positions once fonts, images and the intro have settled
const onLoad = () => queueRefresh()
onMounted(() => {
  window.addEventListener('load', onLoad, { once: true })
  queueRefresh()
})
onBeforeUnmount(() => window.removeEventListener('load', onLoad))
watch(
  () => appState.ready,
  () => requestAnimationFrame(() => ScrollTrigger.refresh()),
)
</script>

<template>
  <CinematicIntro />
  <component :is="CustomCursor" v-if="CustomCursor" />
  <NavBar />
  <main id="main">
    <HeroSection />
    <AboutSection />
    <ExperienceSection />
    <SkillsSection />
    <ProjectsSection />
    <AIJourneySection />
    <PhilosophySection />
    <ContactSection />
  </main>
  <SiteFooter />
</template>
