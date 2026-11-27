export type Lang = 'en' | 'es'
export type StepStatus = 'done' | 'next' | 'later'

export interface Supporter {
  name: string
  avatar?: string
  you?: boolean
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
  footer: { greeting: string; sentence: (city: string) => string; contact: string; personal: string; terms: string; privacy: string; home: string }
  status: Record<StepStatus, string>
  lang: { switchTo: string; target: string }
  give: { label: string; short: string }
}

/**
 * Locale-neutral facts and the two copies of the letter. There is no fixed
 * number of kids or families and there is no goal: the donations decide how far
 * down the list the evening reaches. Nothing here is projected or invented.
 */
export const christmasEvent = {
  deliveryDate: '2026-12-24',
  donationOpensIso: '2026-12-01T09:00:00-05:00',
  donationUrl: '',
  raised: 0,
  contactEmail: 'hi@heaveless.com',
  signature: 'heaveless',
  // The dot state is derived from today in Lima, never stored, so the plan
  // cannot go stale after a date has passed.
  plan: [
    { date: '2026-11-20' },
    { date: '2026-12-01' },
    { date: '2026-12-20' },
    { date: '2026-12-24' },
  ] as { date: string }[],
  supporters: [] as Supporter[],
}

const en: EventCopy = {
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

const es: EventCopy = {
  meta: {
    title: 'Navidad 2026 / Una noche, cada nombre',
    description:
      'Una campaña personal de Navidad en Arequipa. Un regalo con su nombre en la etiqueta y una mesa completa para cada familia, comprado, envuelto y entregado a mano en Nochebuena 2026.',
  },
  city: 'Arequipa, Perú',
  header: {
    home: 'Navidad 2026, inicio del evento',
    sections: 'Secciones del evento',
    skip: 'Ir al contenido',
    label: 'Navidad 2026',
  },
  nav: { plan: 'El plan', gifts: 'Los regalos', note: 'La nota', wall: 'El muro' },
  hero: {
    eyebrow: 'Nochebuena 2026',
    headline: { lead: 'Una noche,', accent: 'cada nombre.' },
    intro:
      'El 24 de diciembre, en Arequipa, los niños de la lista reciben un regalo envuelto con su nombre en la etiqueta y una mesa completa para esa noche.',
    seePlan: 'Ver el plan',
  },
  raised: {
    kicker: 'Recaudado hasta hoy',
    live: 'Actualizado a mano a medida que llegan las donaciones.',
    opensNote: 'La lista ya está escrita.',
    closed: date => `Las donaciones abren el ${date}.`,
    opensIn: days => (days === 1 ? 'Abre mañana' : `Abre en ${days} días`),
  },
  countdown: {
    title: 'Cuenta regresiva al 24',
    days: 'Días',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    timer: (days, hours, minutes) => `Falta para Nochebuena: ${days} días, ${hours} horas y ${minutes} minutos.`,
    done: 'Es Nochebuena.',
  },
  plan: {
    kicker: 'El plan',
    title: 'Cuatro fechas, una noche.',
    intro: 'Qué pasa, cuándo pasa y qué se publica después.',
    steps: [
      {
        title: 'La lista se escribe',
        body: 'La escribo yo antes de comprar nada. Detrás no hay ninguna organización, y las donaciones deciden hasta dónde llega.',
      },
      {
        title: 'Se abre la caja',
        body: 'Las donaciones abren en soles. Cada regalo se anota el mismo día, así la lista y el dinero siempre coinciden.',
      },
      {
        title: 'Día de envolver',
        body: 'Todo lo que alcancen las donaciones se compra, se envuelve, se etiqueta con un nombre y se cuenta por última vez.',
      },
      {
        title: 'La entrega',
        body: 'Todo se entrega en persona en Nochebuena. Las fotos y los comprobantes suben aquí en los dos días siguientes.',
      },
    ],
  },
  gifts: {
    kicker: 'En qué se convierte un regalo',
    title: 'Tres cosas, en un solo paquete.',
    intro: 'Una campaña, tres partes. Nada se compra sin un nombre en la etiqueta.',
    items: [
      {
        title: 'Un regalo con nombre',
        body: 'Un regalo por niño, elegido para su edad, envuelto y etiquetado con su propio nombre. Nada genérico y nada compartido.',
      },
      {
        title: 'Una mesa para la familia',
        body: 'Una canasta con todo para una cena de Navidad, del tamaño de la familia entera y no solo de los niños.',
      },
      {
        title: 'La noche misma',
        body: 'Una noche para entregarlo todo en persona, con la familia en la mesa.',
      },
    ],
  },
  note: {
    kicker: 'Una nota mía',
    heading: 'Por qué los nombres.',
    paragraphs: [
      'De niño pensaba que la Navidad era la caja. No lo era. Era el segundo en que alguien se daba cuenta de que la caja tenía su nombre.',
      'Este año la lista está abierta. Empieza con familias de Arequipa que elijo yo, y lo que reunamos decide hasta dónde bajo en ella.',
      'Cada comprobante termina en esta página, no como decoración sino como un registro. Si aportas, vas a poder ver exactamente a dónde fue el dinero.',
      'Si vas a leer una sola línea, que sea esta: gracias por estar aquí. El resto son solo fechas.',
    ],
  },
  wall: {
    kicker: 'El muro',
    title: 'Quiénes están.',
    intro: 'Quien se sume antes del 24 de diciembre tiene su nombre aquí. Sin montos y sin ranking.',
    empty: 'El muro se abre con el primer nombre.',
    loginTitle: 'Suma tu nombre',
    loginBody: 'Entra con TikTok y tu nombre y tu foto se suman al muro. No se publica nada en TikTok.',
    you: 'Tú',
    onWall: 'En el muro',
    logOut: 'Salir',
    signedIn: 'Con sesión',
    authError: 'El inicio de sesión con TikTok falló. Inténtalo de nuevo.',
    authMissing: 'El inicio de sesión con TikTok aún no está configurado.',
  },
  footer: {
    greeting: 'Feliz Navidad',
    sentence: city =>
      `Una noche en ${city}, con todos los regalos y mesas que alcancen las donaciones.`,
    contact: 'Escríbeme a',
    personal: 'Una campaña personal',
    terms: 'Términos',
    privacy: 'Privacidad',
    home: 'heaveless',
  },
  status: { done: 'Hecho', next: 'Siguiente', later: 'Aún por venir' },
  lang: { switchTo: 'Cambiar a inglés', target: 'English' },
  give: { label: 'Aporta a una Navidad', short: 'Aporta' },
}

export const eventCopy: Record<Lang, EventCopy> = { en, es }
