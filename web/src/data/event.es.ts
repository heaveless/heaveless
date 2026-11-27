import type { EventCopy } from './event'

export const es: EventCopy = {
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
