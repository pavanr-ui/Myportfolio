# Pavan Ramshetty — Portfolio

Vue 3 · Vite · Tailwind CSS · GSAP (ScrollTrigger + SplitText) · Lucide icons

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Personalise (no code changes needed)

| What | Where |
| --- | --- |
| Profile photo | `src/assets/Mypic.jpg`, imported in `src/config/site.js` (replace the file to update it). Adjust the framing with `photoPosition` in `src/config/site.js`. Until then a monogram frame is shown. |
| Availability badge | `availability` in `src/config/site.js` — a static, editable label (`show: false` hides it). |
| Intro | `intro.enabled` in `src/config/site.js`. Plays once per browser session; never for reduced motion; Skip button + Esc. |
| Résumé | Put the PDF in `public/` (e.g. `public/resume.pdf`) and set `resumeUrl: '/resume.pdf'` in `src/config/site.js`. Until then resume buttons read **Request Resume** and go to Contact. |
| Email / LinkedIn / GitHub | `contact` in `src/config/site.js`. Empty values show "Coming soon" and never link anywhere. |
| Contact form | Set `formEndpoint` (e.g. a Formspree URL) for real delivery. With only `email` set, the form opens the visitor's mail app. With neither, it runs in a clearly labelled **demo** mode. |
| Projects | `src/data/content.js` — add `image`, `url`, `github` per project; buttons appear only for values that exist. |
| Experience figure | `experienceYears` in `src/config/site.js` — used everywhere the site mentions years. |
| Skills, experience, AI tools, AI journey, project contributions | `src/data/content.js` |

## Interactions & extras

- Keyboard: `1`–`7` jump to sections, `t` toggles theme, `?` shows all shortcuts.
- Easter egg: type `vue` anywhere to toggle **Blueprint mode**, which outlines the page's section/component structure.
- Section progress rail (desktop ≥ 1280px), gliding nav indicator, magnetic buttons with press ripples,
  3D tilt cards with glare, a flip-able digital profile card, and a time-of-day greeting in the hero.

## Structure

```
src/
  config/site.js          personal details & links
  data/content.js         all section content
  composables/motion.js   GSAP setup + declarative scroll animations (data-reveal, data-stagger, data-split, data-parallax, data-line)
  composables/useTheme.js dark/light theme with View Transitions reveal
  components/
    CinematicIntro.vue, CustomCursor.vue, NavBar.vue, SiteFooter.vue
    ProfilePortrait.vue, HeroParticles.vue, AboutVisual.vue, SkillsOrbit.vue, AIWorkspace.vue
    ProjectCard.vue, ProjectCaseStudy.vue, ProjectVisual.vue
    ui/        BaseButton (magnetic), ResumeButton, SectionHeading, ThemeToggle, SoundToggle
    sections/  Hero, About, Experience, Skills, Projects, AIJourney, Philosophy, Contact
```

## Motion system

`src/composables/motion.js` picks one of three modes once per page load:

- **full**: the complete experience (intro, particles, 3D tilt, custom cursor, pinned horizontal gallery, orbit spin).
- **lite**: auto-enabled on low-powered devices or Data Saver, or toggled via "Simplified motion" in the footer. Simple reveals only.
- **reduced**: the OS "reduce motion" setting. No animation; all content visible.

Reusable composables: `useScrollReveal` (declarative `data-*` animations), `useTextReveal`, `useParallax`,
`useMagneticHover`, `usePageTransition`, `useSound` (interface sounds, off by default). All GSAP work runs inside
`gsap.context()` and is reverted on unmount, so ScrollTriggers never leak or duplicate.

Heavy pieces are lazy-loaded: custom cursor, hero particles, skills orbit, AI workspace and case studies.
