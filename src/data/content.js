export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'ai-journey', label: 'AI Journey' },
  { id: 'contact', label: 'Contact' },
]

export const experience = [
  {
    company: 'AlertDriving',
    role: 'Frontend Developer',
    type: 'Contract',
    period: 'October 2024 — Present',
    start: '2024-10',
    current: true,
    summary:
      'Building and maintaining modern frontend applications — from Vue.js interfaces and Ionic / Quasar app experiences to dashboards and AI Assistant features.',
    highlights: [
      'Vue.js application development',
      'Ionic and Quasar applications',
      'Dashboard development',
      'Reusable components',
      'Responsive UI implementation',
      'Accessibility improvements',
      'AI Assistant features',
      'AI-assisted development experimentation',
    ],
    stack: ['Vue.js', 'Ionic', 'Quasar', 'JavaScript', 'HTML5', 'CSS3'],
  },
]

/** Displayed in this exact order. `group` drives the category filter. */
export const skills = [
  { name: 'HTML5', group: 'Foundations', note: 'Semantic, accessible document structure.' },
  { name: 'CSS3', group: 'Foundations', note: 'Responsive layouts, systems and motion.' },
  { name: 'jQuery', group: 'Libraries & Frameworks', note: 'DOM scripting and established interfaces.' },
  { name: 'Vue.js', group: 'Libraries & Frameworks', note: 'Component-driven, reactive applications.' },
  { name: 'JavaScript', group: 'Foundations', note: 'The language behind every interaction.' },
  { name: 'Ionic', group: 'App Frameworks', note: 'Cross-platform application experiences.' },
  { name: 'Quasar', group: 'App Frameworks', note: 'Vue-powered UI across platforms.' },
]

export const skillGroups = ['All', 'Foundations', 'Libraries & Frameworks', 'App Frameworks']

export const aiTools = [
  {
    name: 'ChatGPT',
    icon: 'MessageSquareText',
    use: 'Exploring ideas, explaining concepts and drafting first approaches to problems.',
  },
  {
    name: 'Claude',
    icon: 'Sparkles',
    use: 'Reasoning through solutions, reviewing code and refining written content.',
  },
  {
    name: 'Claude Code',
    icon: 'SquareTerminal',
    use: 'Experimenting with agentic, in-editor workflows across a codebase.',
  },
  {
    name: 'GitHub Copilot',
    icon: 'Code2',
    use: 'Inline suggestions that speed up routine code while I stay in flow.',
  },
]

export const aiPractices = ['Code generation', 'Code review', 'Prompt engineering', 'AI-powered workflows']

export const aiWorkflow = [
  { step: 'Prompt', text: 'Frame the problem with clear context and constraints.' },
  { step: 'Generate', text: 'Let AI propose a first draft or a few options.' },
  { step: 'Review', text: 'Read every line — correctness, readability, accessibility.' },
  { step: 'Refine', text: 'Adapt it to the codebase, its conventions and real users.' },
  { step: 'Verify', text: 'Test and validate. A human signs off — always.' },
]

/**
 * Projects. Add a real `image` (e.g. '/images/projects/vue.jpg'), `url` and `github`
 * when available — the matching buttons only appear for values that exist.
 */
export const projects = [
  {
    id: 'vue-apps',
    index: '01',
    title: 'Vue.js Web Applications',
    description: 'Modern responsive interfaces, reusable components, and frontend functionality.',
    details:
      'Single-page applications built with Vue.js, organised around reusable, well-scoped components and responsive layouts that work from mobile to large desktop screens.',
    focus: ['Reusable component design', 'Responsive layouts', 'Frontend functionality'],
    tags: ['Vue.js', 'JavaScript', 'HTML5', 'CSS3'],
    visual: 'browser',
    image: '',
    url: '',
    github: '',
  },
  {
    id: 'ionic-quasar',
    index: '02',
    title: 'Ionic & Quasar Applications',
    description: 'Responsive application experiences and reusable UI components.',
    details:
      'Application experiences built with Ionic and Quasar on top of Vue, focused on consistent, reusable UI components and layouts that adapt across devices.',
    focus: ['Cross-device experiences', 'Reusable UI components', 'Consistent design patterns'],
    tags: ['Ionic', 'Quasar', 'Vue.js'],
    visual: 'mobile',
    image: '',
    url: '',
    github: '',
  },
  {
    id: 'dashboards',
    index: '03',
    title: 'Interactive Dashboards',
    description: 'Data-driven dashboards, interactive UI elements, and responsive layouts.',
    details:
      'Dashboards that turn data into clear, scannable views — with interactive UI elements and responsive layouts that keep information readable on any screen.',
    focus: ['Data-driven views', 'Interactive UI elements', 'Responsive layouts'],
    tags: ['Vue.js', 'JavaScript', 'CSS3'],
    visual: 'dashboard',
    image: '',
    url: '',
    github: '',
  },
  {
    id: 'ai-assistant',
    index: '04',
    title: 'AI Assistant Features',
    description: 'Exploring AI-powered assistant experiences and AI-assisted frontend workflows.',
    details:
      'Frontend work on AI Assistant features — conversational interfaces designed to feel clear and trustworthy — alongside exploring AI-assisted workflows in day-to-day development.',
    focus: ['Conversational UI', 'Assistant experiences', 'AI-assisted workflows'],
    tags: ['Vue.js', 'JavaScript', 'AI Assistant'],
    visual: 'assistant',
    image: '',
    url: '',
    github: '',
  },
  {
    id: 'ai-journey',
    index: '05',
    title: 'My AI Developer Journey',
    description: 'Learning and experimenting with AI-assisted development to improve frontend productivity.',
    details:
      'An ongoing, personal exploration of AI-assisted development — writing better prompts, generating first drafts, reviewing AI-suggested code and building workflows where every change is still verified by a human.',
    focus: ['Prompt engineering', 'Code generation & review', 'AI-powered workflows', 'Human verification'],
    tags: ['ChatGPT', 'Claude', 'Claude Code', 'GitHub Copilot'],
    visual: 'journey',
    image: '',
    url: '',
    github: '',
  },
]

/** About — three storytelling blocks */
export const aboutBlocks = [
  {
    index: '01',
    title: 'Frontend Engineering',
    text: 'Vue.js, Ionic and Quasar applications built on clean architecture and reusable components — interfaces made from well-scoped pieces that stay easy to read, test and extend.',
    points: ['Vue.js applications', 'Reusable components', 'Clean architecture'],
    visual: 'code',
  },
  {
    index: '02',
    title: 'User Experience',
    text: 'Responsive layouts, accessibility and performance treated as part of the build — not a final checklist. Every decision starts with the person on the other side of the screen.',
    points: ['Responsive UI', 'Accessibility', 'Performance'],
    visual: 'layout',
  },
  {
    index: '03',
    title: 'AI-Assisted Development',
    text: 'Learning and experimenting with modern AI tools to accelerate development — then reviewing the generated code, improving the solution and keeping quality high.',
    points: ['Code generation', 'Code review', 'Human verification'],
    visual: 'ai',
  },
]

/** Floating labels around the hero portrait */
export const heroLabels = ['<Vue.js />', 'Ionic · Quasar', 'a11y ✓', 'AI-assisted', 'Responsive']

/** Prompts cycled in the AI workspace illustration (illustrative examples) */
export const aiPrompts = [
  'Create an accessible Vue 3 modal with a focus trap',
  'Review this component for accessibility issues',
  'Refactor this logic into a reusable composable',
]

export const philosophy = [
  { title: 'Clean and maintainable code', text: 'Code is read far more often than it is written. I write for the next developer.' },
  { title: 'User-first design', text: 'Every decision starts with the person on the other side of the screen.' },
  { title: 'Responsive by default', text: 'Layouts are designed for every screen from the very first line of CSS.' },
  { title: 'Accessibility matters', text: 'Semantic markup, keyboard support and contrast are not optional extras.' },
  { title: 'Continuous learning', text: 'The web keeps moving — staying curious is part of the job.' },
  { title: 'AI-assisted productivity, human-verified', text: 'AI accelerates the work. Careful review keeps it correct.' },
]
