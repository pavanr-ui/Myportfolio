<script setup>
import { ref, reactive, computed } from 'vue'
import { Mail, Linkedin, Github, ArrowUpRight, Send, Info, CheckCircle2, Copy, Check } from 'lucide-vue-next'
import BaseButton from '../ui/BaseButton.vue'
import ResumeButton from '../ui/ResumeButton.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { site } from '@/config/site'

const root = ref(null)
useScrollReveal(root)

const { email, linkedin, github } = site.contact
const channels = [
  { label: 'Email', icon: Mail, href: email ? `mailto:${email}` : '', value: email },
  { label: 'LinkedIn', icon: Linkedin, href: linkedin, value: linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') },
  { label: 'GitHub', icon: Github, href: github, value: github.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') },
]

// copy-email interaction with an announced confirmation
const copied = ref(false)
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email)
  } catch {
    const t = Object.assign(document.createElement('textarea'), { value: email })
    document.body.appendChild(t)
    t.select()
    document.execCommand('copy')
    t.remove()
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 2200)
}

/** endpoint → real submission · email only → opens mail app · neither → demo */
const mode = computed(() => (site.formEndpoint ? 'live' : email ? 'mailto' : 'demo'))

const form = reactive({ name: '', email: '', message: '' })
const errors = reactive({})
const status = ref('idle') // idle | sending | sent | error
const statusMsg = ref('')

function validate() {
  errors.name = form.name.trim() ? '' : 'Please enter your name.'
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Please enter a valid email address.'
  errors.message = form.message.trim().length >= 10 ? '' : 'Please write a message (at least 10 characters).'
  return !errors.name && !errors.email && !errors.message
}

async function submit() {
  if (!validate()) {
    status.value = 'idle'
    return
  }
  status.value = 'sending'

  try {
    if (mode.value === 'live') {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(String(res.status))
      statusMsg.value = 'Thank you — your message has been sent. I’ll be in touch soon.'
    } else if (mode.value === 'mailto') {
      const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`)
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
      statusMsg.value = 'Your email app should open with the message ready to send.'
    } else {
      await new Promise((r) => setTimeout(r, 700))
      statusMsg.value = 'Demo mode: the form works, but no message was sent — a form service is not configured yet.'
    }
    status.value = 'sent'
    if (mode.value !== 'mailto') Object.assign(form, { name: '', email: '', message: '' })
  } catch {
    status.value = 'error'
    statusMsg.value = 'Something went wrong while sending. Please try again in a moment.'
  }
}

const field =
  'peer w-full border-0 border-b border-line bg-transparent px-0 pb-3 pt-6 text-base text-ink placeholder-transparent transition-colors duration-300 focus:border-ink focus:outline-none focus:ring-0'
const floatLabel =
  'pointer-events-none absolute left-0 top-6 text-base text-muted transition-all duration-300 peer-focus:top-0 peer-focus:text-xs peer-focus:text-accent-ink peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs'
</script>

<template>
  <section
    id="contact"
    ref="root"
    class="dark-scope relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-bg py-28 text-ink lg:py-36"
    aria-labelledby="contact-title"
  >
    <!-- animated background typography (drifts with scroll) -->
    <div class="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
      <div class="absolute inset-0 bg-grid mask-radial opacity-50" />
      <p class="display-caps text-outline absolute -left-[10%] top-[6%] whitespace-nowrap text-[clamp(7rem,18vw,17rem)]" data-parallax-x="0.35">
        Let’s build · Let’s build · Let’s build ·
      </p>
      <p class="display-caps text-outline absolute -right-[10%] bottom-[4%] whitespace-nowrap text-[clamp(7rem,18vw,17rem)]" data-parallax-x="-0.35">
        Something meaningful · Something meaningful ·
      </p>
    </div>

    <div class="container-site relative">
      <div class="mb-10 flex items-center gap-4" data-reveal>
        <span class="font-display text-lg italic text-accent-ink">07</span>
        <span class="h-px w-10 bg-line" aria-hidden="true" />
        <span class="label">Contact</span>
      </div>
      <h2 id="contact-title" class="display-caps max-w-6xl text-[clamp(2.8rem,8vw,8rem)]" data-split="chars">
        Let’s Build Something<br />
        <em class="text-accent-ink">Meaningful.</em>
      </h2>
      <p class="mb-16 mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted lg:mb-24" data-reveal>
        I’m always interested in connecting with developers, teams, and opportunities to build meaningful digital
        experiences.
      </p>

      <!-- animated email link (only when an address is configured) -->
      <a
        v-if="email"
        :href="`mailto:${email}`"
        class="email-link group mb-16 inline-flex max-w-full items-center gap-4 lg:mb-24"
        data-cursor="Write"
        data-reveal
      >
        <span class="relative block overflow-hidden">
          <span class="block break-all font-display text-[clamp(1.8rem,5vw,4.5rem)] leading-tight transition-transform duration-700 ease-expo group-hover:-translate-y-full">{{ email }}</span>
          <span class="absolute inset-0 block translate-y-full break-all font-display text-[clamp(1.8rem,5vw,4.5rem)] italic leading-tight text-accent-ink transition-transform duration-700 ease-expo group-hover:translate-y-0" aria-hidden="true">{{ email }}</span>
          <span class="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-expo group-hover:scale-x-100" aria-hidden="true" />
        </span>
        <ArrowUpRight class="h-8 w-8 shrink-0 transition-transform duration-700 ease-expo group-hover:rotate-45" aria-hidden="true" />
      </a>

      <!-- primary CTAs (magnetic) — only for channels that really exist -->
      <div class="mb-16 flex flex-wrap items-center gap-3 lg:mb-24" data-reveal>
        <BaseButton v-if="email" :href="`mailto:${email}`" cursor="Write">
          <Mail class="h-4 w-4" aria-hidden="true" /> Email me
        </BaseButton>
        <BaseButton v-if="email" variant="outline" :aria-label="copied ? 'Email address copied' : 'Copy email address'" @click="copyEmail">
          <Check v-if="copied" class="h-4 w-4" aria-hidden="true" />
          <Copy v-else class="h-4 w-4" aria-hidden="true" />
          {{ copied ? 'Copied!' : 'Copy email' }}
        </BaseButton>
        <BaseButton v-if="linkedin" :href="linkedin" external :variant="email ? 'outline' : 'primary'" cursor="Open">
          <Linkedin class="h-4 w-4" aria-hidden="true" /> Connect on LinkedIn
        </BaseButton>
        <BaseButton v-if="github" :href="github" external variant="outline" cursor="Open">
          <Github class="h-4 w-4" aria-hidden="true" /> See my GitHub
        </BaseButton>
        <span class="sr-only" role="status" aria-live="polite">{{ copied ? 'Email address copied to clipboard' : '' }}</span>
      </div>

      <div class="grid gap-16 lg:grid-cols-12 lg:gap-12">
        <!-- channels -->
        <div class="lg:col-span-5">
          <ul class="border-t border-line" data-stagger="0.08">
            <li v-for="c in channels" :key="c.label" class="border-b border-line">
              <a
                v-if="c.href"
                :href="c.href"
                :target="c.label === 'Email' ? undefined : '_blank'"
                :rel="c.label === 'Email' ? undefined : 'noopener noreferrer'"
                class="group flex items-center justify-between gap-4 py-6"
              >
                <span class="flex items-center gap-4">
                  <component :is="c.icon" class="h-5 w-5 text-accent-ink" stroke-width="1.5" aria-hidden="true" />
                  <span>
                    <span class="label block">{{ c.label }}</span>
                    <span class="mt-1 block break-all font-medium">{{ c.value }}</span>
                  </span>
                </span>
                <ArrowUpRight
                  class="h-5 w-5 shrink-0 transition-transform duration-500 ease-expo group-hover:-translate-y-1 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
              <!-- not configured yet: shown, but never a dead link -->
              <div v-else class="flex items-center gap-4 py-6">
                <component :is="c.icon" class="h-5 w-5 text-muted/60" stroke-width="1.5" aria-hidden="true" />
                <span>
                  <span class="label block">{{ c.label }}</span>
                  <span class="mt-1 block text-muted">Coming soon</span>
                </span>
              </div>
            </li>
          </ul>

          <div class="mt-10" data-reveal>
            <p class="mb-4 text-sm text-muted">Prefer the full picture?</p>
            <ResumeButton v-if="site.resumeUrl" variant="primary" />
            <p v-else class="text-sm text-muted">
              My résumé is available on request — just send a message using the form.
            </p>
          </div>
        </div>

        <!-- form -->
        <div class="lg:col-span-7" data-reveal>
          <form
            class="rounded-3xl border border-line bg-bg p-7 sm:p-10"
            novalidate
            aria-describedby="form-mode"
            @submit.prevent="submit"
          >
            <p
              v-if="mode !== 'live'"
              id="form-mode"
              class="mb-8 flex items-start gap-3 rounded-xl bg-subtle px-4 py-3 text-xs leading-relaxed text-muted"
            >
              <Info class="mt-px h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
              <span v-if="mode === 'demo'">
                <strong class="font-semibold text-ink">Demo form.</strong> No form service is connected yet, so
                messages are not delivered.
              </span>
              <span v-else>Submitting opens your email app with the message pre-filled.</span>
            </p>
            <span v-else id="form-mode" class="sr-only">Messages are sent directly.</span>

            <div class="grid gap-8 sm:grid-cols-2">
              <div class="relative">
                <input
                  id="cf-name"
                  v-model="form.name"
                  type="text"
                  name="name"
                  autocomplete="name"
                  placeholder="Your name"
                  :class="field"
                  :aria-invalid="!!errors.name"
                  :aria-describedby="errors.name ? 'cf-name-err' : undefined"
                />
                <label for="cf-name" :class="floatLabel">Your name</label>
                <p v-if="errors.name" id="cf-name-err" class="mt-2 text-xs text-red-300">{{ errors.name }}</p>
              </div>
              <div class="relative">
                <input
                  id="cf-email"
                  v-model="form.email"
                  type="email"
                  name="email"
                  autocomplete="email"
                  placeholder="Email address"
                  :class="field"
                  :aria-invalid="!!errors.email"
                  :aria-describedby="errors.email ? 'cf-email-err' : undefined"
                />
                <label for="cf-email" :class="floatLabel">Email address</label>
                <p v-if="errors.email" id="cf-email-err" class="mt-2 text-xs text-red-300">{{ errors.email }}</p>
              </div>
              <div class="relative sm:col-span-2">
                <textarea
                  id="cf-message"
                  v-model="form.message"
                  name="message"
                  rows="5"
                  placeholder="Tell me about your project or opportunity"
                  :class="[field, 'resize-none']"
                  :aria-invalid="!!errors.message"
                  :aria-describedby="errors.message ? 'cf-message-err' : undefined"
                />
                <label for="cf-message" :class="floatLabel">Tell me about your project or opportunity</label>
                <p v-if="errors.message" id="cf-message-err" class="mt-2 text-xs text-red-300">
                  {{ errors.message }}
                </p>
              </div>
            </div>

            <div class="mt-10 flex flex-wrap items-center justify-between gap-6">
              <BaseButton type="submit" :disabled="status === 'sending'">
                {{ status === 'sending' ? 'Sending…' : 'Send Message' }}
                <Send class="h-4 w-4" aria-hidden="true" />
              </BaseButton>
              <p
                class="flex min-h-[1.5rem] max-w-sm items-start gap-2 text-sm"
                :class="status === 'error' ? 'text-red-300' : 'text-muted'"
                role="status"
                aria-live="polite"
              >
                <CheckCircle2 v-if="status === 'sent'" class="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                <span v-if="status === 'sent' || status === 'error'">{{ statusMsg }}</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
