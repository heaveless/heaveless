import { christmasEvent as event, eventCopy, type Lang } from '../../data/event'

const locale = (lang: Lang) => (lang === 'es' ? 'es-PE' : 'en-US')
const LIMA = 'America/Lima'

export const limaToday = () =>
  new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: LIMA,
  }).format(new Date())

export const nextPlanIndex = (dates: string[], today = limaToday()) =>
  dates.findIndex(date => date >= today)

export const donationOpen = event.donationUrl !== ''
export const giveHref = event.donationUrl
export const giveLabel = (lang: Lang) => eventCopy[lang].give.label
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

export function money(lang: Lang, value: number) {
  return {
    symbol: 'S/',
    amount: new Intl.NumberFormat(locale(lang), { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value),
  }
}

export const daysUntilOpening = (today = limaToday()) => {
  const opening = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: LIMA,
  }).format(new Date(event.donationOpensIso))
  return Math.round((Date.parse(opening) - Date.parse(today)) / 86_400_000)
}

export const donationOpensLabel = (lang: Lang) =>
  new Date(event.donationOpensIso).toLocaleDateString(locale(lang), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: LIMA,
  })

export const planDateLabel = (date: string, lang: Lang) =>
  new Date(`${date}T12:00:00-05:00`).toLocaleDateString(locale(lang), {
    day: 'numeric',
    month: 'long',
    timeZone: LIMA,
  })
