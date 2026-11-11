/** @type {import('tailwindcss').Config} */
const c = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: c('bg'),
        surface: c('surface'),
        subtle: c('subtle'),
        line: c('line'),
        ink: c('ink'),
        muted: c('muted'),
        accent: c('accent'),
        'accent-ink': c('accent-ink'),
        navy: '#101828',
        paper: '#F8F7F4',
        mist: '#E7E7E4',
        steel: '#8095B5',
        graphite: '#20242C',
        charcoal: '#1A1E26',
        abyss: '#0A101C',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Cascadia Code', 'Consolas', 'Menlo', 'monospace'],
      },
      maxWidth: { site: '84rem' },
      letterSpacing: { label: '0.22em' },
      transitionTimingFunction: { expo: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    },
  },
  plugins: [
    // .motion-reduced / .motion-lite are set on <html> by src/composables/motion.js
    ({ addVariant }) => {
      addVariant('motion-reduced', '.motion-reduced &')
      addVariant('motion-lite', '.motion-lite &')
    },
  ],
}
