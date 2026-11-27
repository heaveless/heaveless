import { christmasEvent as event, eventCopy, type Lang } from '../../data/event'

const locale = (lang: Lang) => (lang === 'es' ? 'es-PE' : 'en-US')
const LIMA = 'America/Lima' // the IANA zone for all of Peru, Arequipa included

/** Today in Lima as YYYY-MM-DD, so the plan cannot follow the build date. */
export const limaToday = () =>
  new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: LIMA,
  }).format(new Date())

/** The next date gets the lime dot; everything before it is done. */
export const nextPlanIndex = (dates: string[], today = limaToday()) =>
  dates.findIndex(date => date >= today)

/**
 * There is no reminder button and no mailto CTA: while donations are closed the
 * page says the date and offers the email as contact, nothing else. The moment
 * `donationUrl` exists, the primary action becomes the real checkout.
 */
export const donationOpen = event.donationUrl !== ''
export const giveHref = event.donationUrl
export const giveLabel = (lang: Lang) => eventCopy[lang].give.label
/** Short form for the sticky header, where the label must stay on one line. */
export const giveShortLabel = (lang: Lang) => eventCopy[lang].give.short
export const giveLinkProps = donationOpen ? { target: '_blank', rel: 'noreferrer' } : {}

export const contactHref = `mailto:${event.contactEmail}`

export const deliveryLabel = (lang: Lang) =>
  new Date(`${event.deliveryDate}T12:00:00-05:00`).toLocaleDateString(locale(lang), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: LIMA,
  })

/**
 * The raised amount is the loudest number on the page, so the symbol and the
 * digits come back apart: the symbol shrinks, the figure does not. The sol sign
 * is the same in both languages, and the digits follow the language.
 */
export function money(lang: Lang, value: number) {
  return {
    symbol: 'S/',
    amount: new Intl.NumberFormat(locale(lang), { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value),
  }
}

/** Whole days until donations open, counted in Lima so the badge never lies. */
export const daysUntilOpening = (today = limaToday()) => {
  const opening = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: LIMA,
  }).format(new Date(event.donationOpensIso))
  return Math.round((Date.parse(opening) - Date.parse(today)) / 86_400_000)
}

/** The opening date as one label, for the line under the figure. */
export const donationOpensLabel = (lang: Lang) =>
  new Date(event.donationOpensIso).toLocaleDateString(locale(lang), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: LIMA,
  })

/** Plan beats are printed as month and day, never as a countdown. */
export const planDateLabel = (date: string, lang: Lang) =>
  new Date(`${date}T12:00:00-05:00`).toLocaleDateString(locale(lang), {
    day: 'numeric',
    month: 'long',
    timeZone: LIMA,
  })
