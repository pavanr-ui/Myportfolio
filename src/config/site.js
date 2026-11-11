/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — edit this file to personalise the site.
 * ─────────────────────────────────────────────────────────────
 *  Leave a value as an empty string ('') until you have a real one.
 *  Empty values are handled gracefully — nothing links to a dead URL.
 */
import profilePhoto from '@/assets/Mypic.jpg'

export const site = {
  name: 'Pavan Ramshetty',
  shortName: 'Pavan',
  initials: 'PR',
  title: 'Senior Frontend Developer',
  subtitle: 'AI-Assisted Developer',
  /** Single source of truth for the experience figure shown across the site. */
  experienceYears: 6,
  experience: '6+ years of experience',

  /**
   * Availability badge in the hero. This is a static, editable statement — not a live status.
   * Set `show: false` to hide it, or change the label to whatever is true for you right now.
   */
  availability: {
    show: true,
    label: 'Open to new opportunities',
  },

  /** Cinematic intro: plays once per browser session (never for reduced-motion users). */
  intro: { enabled: true },

  /** Profile photo — imported from src/assets so Vite fingerprints and optimises its URL. */
  photo: profilePhoto,
  photoWidth: 1023,
  photoHeight: 1537,
  photoAlt: 'Portrait of Pavan Ramshetty',
  /** Focal point inside the arch frame (CSS object-position). Tuned for a 2:3 portrait with the face in the upper-middle. */
  photoPosition: '50% 32%',

  /**
   * Resume: drop your PDF in /public (e.g. /public/resume.pdf) and set the path here.
   * While empty, resume buttons read "Request Resume" and scroll to the contact section.
   */
  resumeUrl: '/Pavan_Ramshetty_Senior_Frontend_Developer_Resume.pdf',

  contact: {
    /** e.g. 'hello@yourdomain.com' — enables the mailto link and the form's email fallback. */
    email: '',
    /** e.g. 'https://www.linkedin.com/in/your-handle' */
    linkedin: 'https://www.linkedin.com/in/pavan-ramshetty-5146a9112/',
    /** e.g. 'https://github.com/your-handle' */
    github: 'https://github.com/pavanr-ui',
  },

  /**
   * Optional form service endpoint (e.g. a Formspree / Getform URL that accepts JSON POST).
   * When empty, the contact form runs in clearly labelled demo mode
   * (or opens the visitor's mail app if `contact.email` is set).
   */
  formEndpoint: '',
}
