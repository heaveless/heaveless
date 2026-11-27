import { en } from './event.en'
import { es } from './event.es'

export type Lang = 'en' | 'es'
export type StepStatus = 'done' | 'next' | 'later'

export interface Supporter {
  name: string
  avatar?: string
  you?: boolean
}

export interface PlanStep {
  date: string
}

export interface EventCopy {
  meta: { title: string; description: string }
  city: string
  header: { home: string; sections: string; skip: string; label: string }
  nav: { plan: string; gifts: string; note: string; wall: string }
  hero: { eyebrow: string; headline: { lead: string; accent: string }; intro: string; seePlan: string }
  raised: { kicker: string; live: string; opensNote: string; closed: (date: string) => string; opensIn: (days: number) => string }
  countdown: {
    title: string
    days: string
    hours: string
    minutes: string
    seconds: string
    timer: (days: number, hours: number, minutes: number) => string
    done: string
  }
  plan: { kicker: string; title: string; intro: string; steps: { title: string; body: string }[] }
  gifts: { kicker: string; title: string; intro: string; items: { title: string; body: string }[] }
  note: { kicker: string; heading: string; paragraphs: string[] }
  wall: {
    kicker: string
    title: string
    intro: string
    empty: string
    loginTitle: string
    loginBody: string
    you: string
    onWall: string
    logOut: string
    signedIn: string
    authError: string
    authMissing: string
  }
  footer: {
    greeting: string
    sentence: (city: string) => string
    contact: string
    personal: string
    terms: string
    privacy: string
    home: string
  }
  status: Record<StepStatus, string>
  lang: { switchTo: string; target: string }
  give: { label: string; short: string }
}

export interface ChristmasEvent {
  deliveryDate: string
  donationOpensIso: string
  donationUrl: string
  raised: number
  contactEmail: string
  signature: string
  plan: PlanStep[]
  supporters: Supporter[]
}

export const christmasEvent: ChristmasEvent = {
  deliveryDate: '2026-12-24',
  donationOpensIso: '2026-12-01T09:00:00-05:00',
  donationUrl: '',
  raised: 0,
  contactEmail: 'hi@heaveless.com',
  signature: 'heaveless',
  plan: [{ date: '2026-11-20' }, { date: '2026-12-01' }, { date: '2026-12-20' }, { date: '2026-12-24' }],
  supporters: [],
}

export const eventCopy: Record<Lang, EventCopy> = { en, es }
