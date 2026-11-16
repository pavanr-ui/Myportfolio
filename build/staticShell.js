/**
 * Vite plugin: pre-renders a static, semantic version of the portfolio into <div id="app">.
 *
 * Why: link previewers (WhatsApp, Slack, Teams, LinkedIn…), search snippets, dashboard
 * previews and other no-JavaScript readers only see the initial HTML. Without this,
 * they show nothing but the <noscript> line. With it, they see the real content.
 *
 * For normal visitors nothing changes: Vue replaces the contents of #app when it mounts,
 * and an inline `html.js` flag hides this shell until then (no flash of unstyled content).
 *
 * All content comes from the same sources the app uses (src/data/content.js and the
 * simple string values in src/config/site.js) — nothing is duplicated by hand except
 * the hero introduction sentence below, which mirrors HeroSection.vue.
 */
import { readFileSync } from 'node:fs'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** site.js imports an image, so it can't be imported in Node — read its plain string values instead. */
function readSite() {
  const src = readFileSync(resolve(root, 'src/config/site.js'), 'utf8')
  const str = (key) => src.match(new RegExp(`\\b${key}:\\s*'([^']*)'`))?.[1] ?? ''
  const num = (key) => Number(src.match(new RegExp(`\\b${key}:\\s*(\\d+)`))?.[1] ?? 0)
  return {
    name: str('name'),
    title: str('title'),
    subtitle: str('subtitle'),
    years: num('experienceYears'),
    resumeUrl: str('resumeUrl'),
    email: str('email'),
    linkedin: str('linkedin'),
    github: str('github'),
  }
}

// mirrors the hero introduction in src/components/sections/HeroSection.vue
const HERO_INTRO =
  'I build clean, responsive, accessible, and user-focused web experiences. Combining frontend engineering with AI-assisted development to create better digital products.'

async function renderShell() {
  const site = readSite()
  const content = await import(pathToFileURL(resolve(root, 'src/data/content.js')).href + `?t=${Date.now()}`)
  const { experience = [], skillCategories = [], projects = [], aiBuilds = [] } = content

  const links = [
    site.resumeUrl && `<li><a href="${esc(site.resumeUrl)}" download>Download résumé</a></li>`,
    site.email && `<li><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>`,
    site.linkedin && `<li><a href="${esc(site.linkedin)}" rel="noopener noreferrer">LinkedIn</a></li>`,
    site.github && `<li><a href="${esc(site.github)}" rel="noopener noreferrer">GitHub</a></li>`,
  ]
    .filter(Boolean)
    .join('')

  const jobs = experience
    .map(
      (j) => `<article>
        <h3>${esc(j.role)} · ${esc(j.company)}</h3>
        <p><small>${esc(j.period)}${j.type ? ` · ${esc(j.type)}` : ''}</small></p>
        <p>${esc(j.summary)}</p>
        <ul>${(j.highlights || []).map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      </article>`,
    )
    .join('')

  const skills = skillCategories
    .map((c) => `<li><strong>${esc(c.title)}:</strong> ${c.items.map((i) => esc(i.name)).join(', ')}</li>`)
    .join('')

  const work = projects
    .map(
      (p) => `<article>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.description)}</p>
        ${p.contribution ? `<p><em>My contribution:</em> ${esc(p.contribution)}</p>` : ''}
        <p><small>${(p.tags || []).map(esc).join(' · ')}</small></p>
      </article>`,
    )
    .join('')

  const builds = aiBuilds.map((b) => `<li><strong>${esc(b.title)}</strong> — ${esc(b.text)}</li>`).join('')

  return `<div class="static-shell">
    <header>
      <p>Senior Frontend Developer portfolio</p>
      <h1>${esc(site.name)}</h1>
      <p><strong>${esc(site.title)}</strong> / ${esc(site.subtitle)}</p>
      <p>${esc(HERO_INTRO)}</p>
      ${site.years ? `<p>${site.years}+ years of experience</p>` : ''}
      <ul class="static-links">${links}</ul>
    </header>
    <section><h2>Experience</h2>${jobs}</section>
    <section><h2>Skills</h2><ul>${skills}</ul></section>
    <section><h2>Projects</h2>${work}</section>
    ${builds ? `<section><h2>AI-assisted builds</h2><ul>${builds}</ul></section>` : ''}
    <section><h2>Contact</h2><ul class="static-links">${links}</ul></section>
  </div>`
}

export default function staticShell() {
  return {
    name: 'portfolio-static-shell',
    async transformIndexHtml(html) {
      const shell = await renderShell()
      return html.replace('<div id="app"></div>', `<div id="app">${shell}</div>`)
    },
  }
}
