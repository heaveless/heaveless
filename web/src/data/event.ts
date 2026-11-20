export type UpdateStatus = 'done' | 'next' | 'upcoming'

export interface EventUpdate {
  date: string
  title: string
  body: string
  status: UpdateStatus
}

export interface EventSupporter {
  name: string
  avatar?: string
  you?: boolean
}

export const christmasEvent = {
  name: 'Christmas 2026',
  eyebrow: 'Event 01 / Navidad',
  title: 'A Christmas for every kid.',
  intro: 'This Christmas, gifts and food baskets for children in low-income communities. Follow the plan and the people making it happen.',
  goal: 5000,
  raised: 0,
  spent: 0,
  currency: 'S/',
  children: 60,
  families: 25,
  donationUrl: '',
  donationOpens: 'December 1, 2026',
  deliveryDate: '2026-12-24',
  updated: 'November 20, 2026',
  updates: [
    { date: 'Nov 20, 2026', title: 'Campaign announced', body: 'The campaign and the timeline are published.', status: 'done' },
    { date: 'Dec 1, 2026', title: 'Donations open', body: 'The donation channel opens in soles.', status: 'next' },
    { date: 'Dec 20, 2026', title: 'Shopping and wrapping', body: 'Gifts and baskets are bought, wrapped and counted.', status: 'upcoming' },
    { date: 'Dec 24, 2026', title: 'Delivery day', body: 'Everything is delivered and the receipts are posted.', status: 'upcoming' },
  ] as EventUpdate[],
  supporters: [] as EventSupporter[],
}
