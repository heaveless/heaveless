import type { EventCopy } from './event'

export const en: EventCopy = {
  meta: {
    title: 'Christmas 2026 / One night, a name each',
    description:
      'A personal Christmas campaign in Arequipa. One gift with a name on the tag and a full table for each family, bought, wrapped and delivered by hand on Christmas Eve 2026.',
  },
  city: 'Arequipa, Peru',
  header: {
    home: 'Christmas 2026, event home',
    sections: 'Event sections',
    skip: 'Skip to content',
    label: 'Christmas 2026',
  },
  nav: { plan: 'The plan', gifts: 'The gifts', note: 'The note', wall: 'The wall' },
  hero: {
    eyebrow: 'Christmas Eve 2026',
    headline: { lead: 'One night,', accent: 'a name each.' },
    intro:
      'On December 24, in Arequipa, the kids on the list get a wrapped gift with their name on the tag and a full table for the night.',
    seePlan: 'See the plan',
  },
  raised: {
    kicker: 'Raised so far',
    live: 'Updated by hand as the donations arrive.',
    opensNote: 'The list is already written.',
    closed: date => `Donations open ${date}.`,
    opensIn: days => (days === 1 ? 'Opens tomorrow' : `Opens in ${days} days`),
  },
  countdown: {
    title: 'Countdown to the 24th',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    timer: (days, hours, minutes) => `Christmas Eve is in ${days} days, ${hours} hours and ${minutes} minutes.`,
    done: 'It is Christmas Eve.',
  },
  plan: {
    kicker: 'The plan',
    title: 'Four dates, one night.',
    intro: 'What happens, when it happens, and what goes public afterwards.',
    steps: [
      {
        title: 'The list is written down',
        body: 'I write it myself before anything is bought. There is no organization behind it, and the donations decide how far down it reaches.',
      },
      {
        title: 'The box opens',
        body: 'Donations open in soles. Every gift is written down the same day, so the list and the money always match.',
      },
      {
        title: 'Wrap day',
        body: 'Everything the donations reach is bought, wrapped, tagged with a name and counted one last time.',
      },
      {
        title: 'The handover',
        body: 'Everything is delivered in person on Christmas Eve. Photos and receipts go up here within two days.',
      },
    ],
  },
  gifts: {
    kicker: 'What a gift becomes',
    title: 'Three things, packed together.',
    intro: 'One campaign, three parts. Nothing is bought without a name on the tag.',
    items: [
      {
        title: 'A present with a name',
        body: 'One gift per child, picked for their age, wrapped and tagged with their own name. Nothing generic and nothing shared.',
      },
      {
        title: 'A table for the family',
        body: 'A basket with everything for a Christmas dinner, sized for the whole family and not just the kids.',
      },
      {
        title: 'The night itself',
        body: 'One evening to hand everything over in person, with the family at the table.',
      },
    ],
  },
  note: {
    kicker: 'A note from me',
    heading: 'Why the names.',
    paragraphs: [
      'Growing up I thought Christmas was about the box. It was not. It was the second someone realized the box had their name on it.',
      'This year the list is open ended. It starts with families in Arequipa that I pick myself, and what we raise decides how far down it I get.',
      'Every receipt ends up on this page, not as decoration but as a record. If you give, you will be able to check exactly where the money went.',
      'If you read only one line, let it be this one: thank you for being here. The rest is just dates.',
    ],
  },
  wall: {
    kicker: 'The wall',
    title: 'Who is in.',
    intro: 'Everyone who joins before December 24 gets a name here. No amounts and no ranking.',
    empty: 'The wall opens with the first name.',
    loginTitle: 'Add your name',
    loginBody: 'Log in with TikTok and your display name and photo join the wall. Nothing is posted to TikTok.',
    you: 'You',
    onWall: 'On the wall',
    logOut: 'Log out',
    signedIn: 'Signed in',
    authError: 'TikTok login failed. Try again.',
    authMissing: 'TikTok login is not configured yet.',
  },
  footer: {
    greeting: 'Merry Christmas',
    sentence: city =>
      `One evening in ${city}, with as many gifts and tables as the donations reach.`,
    contact: 'Write to me at',
    personal: 'A personal campaign',
    terms: 'Terms',
    privacy: 'Privacy',
    home: 'heaveless',
  },
  status: { done: 'Done', next: 'Next', later: 'Still to come' },
  lang: { switchTo: 'Switch to Spanish', target: 'Español' },
  give: { label: 'Fund a Christmas', short: 'Give' },
}
