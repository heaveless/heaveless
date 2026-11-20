export type Route = '/' | '/live' | '/works' | '/contact' | '/terms' | '/privacy'

export interface NavigationItem {
  label: string
  route: Route
  index: string
}

export const navigation: NavigationItem[] = [
  { label: 'Live', route: '/live', index: '01' },
  { label: 'Works', route: '/works', index: '02' },
  { label: 'Contact', route: '/contact', index: '03' },
]

export const pageCopy = {
  '/live': { eyebrow: 'On air', title: 'Live', subtitle: 'Streaming on TikTok. Support the stream and see who keeps it alive.', accent: '01' },
  '/works': { eyebrow: 'Selected work', title: 'Works', subtitle: 'Companies, products and platforms I have worked with.', accent: '02' },
  '/contact': { eyebrow: 'Open channel', title: 'Contact', subtitle: 'For collaborations, ideas and good conversations.', accent: '03' },
  '/terms': { eyebrow: 'Legal', title: 'Terms', subtitle: 'The rules for using this site and supporting the stream.', accent: '04' },
  '/privacy': { eyebrow: 'Legal', title: 'Privacy', subtitle: 'What we collect, why, and how to get rid of it.', accent: '05' },
} as const

export const projects = [
  { slug: 'metrica-global', name: 'Metrica Global', description: 'Technology consulting and digital transformation.', context: 'A global IT services company working across consulting, AI, staff augmentation, tailored solutions and managed services.', scope: 'IT consulting', category: 'Company', href: 'https://www.metrica-global.com/pe/' },
  { slug: 'culqi', name: 'Culqi', description: 'Payments for online and physical commerce.', context: 'A Peruvian payments platform offering online checkout, POS, payment links and tools for managing a business.', scope: 'Fintech / payments', category: 'Company', href: 'https://culqi.com/' },
  { slug: 'tekton-labs', name: 'Tekton Labs', description: 'AI-native software development and delivery.', context: 'A software development company focused on agile solution delivery, embedded talent and managed IT operations.', scope: 'Software development', category: 'Company', href: 'https://www.tektonlabs.com/' },
  { slug: 'sky-airline', name: 'SKY Airline', description: 'Airline and travel operations.', context: 'A passenger airline operating flights across South America and the systems that support the travel experience.', scope: 'Aviation / travel', category: 'Company', href: 'https://www.skyairline.com/' },
  { slug: 'fourthwall', name: 'Fourthwall', description: 'Commerce infrastructure for creators.', context: 'A platform where creators can launch branded shops, sell products and digital goods, and build memberships.', scope: 'Creator commerce', category: 'Company', href: 'https://fourthwall.com/' },
  { slug: 'shopify', name: 'Shopify', description: 'Commerce platform for businesses of every size.', context: 'An all-in-one commerce platform for storefronts, checkout, payments, inventory, analytics and in-person selling.', scope: 'Commerce platform', category: 'Company', href: 'https://www.shopify.com/' },
]

export const organizations = [
  { name: 'Eternal Dreamers', handle: '@eternaldreamers', slug: 'eternaldreamers', href: 'https://github.com/eternaldreamers' },
  { name: '2DevsCrew', handle: '@2DevsCrew', slug: '2DevsCrew', href: 'https://github.com/2DevsCrew' },
  { name: 'cqqlab', handle: '@cqqlab', slug: 'cqqlab', href: 'https://github.com/cqqlab' },
  { name: 'scirats', handle: '@scirats', slug: 'scirats', href: 'https://github.com/scirats' },
  { name: 'nokoala', handle: '@nokoala', slug: 'nokoala', href: 'https://github.com/nokoala' },
  { name: 'bareworks', handle: '@bareworks', slug: 'bareworks', href: 'https://github.com/bareworks' },
]

export const contactLinks = [
  { label: 'Email', value: 'hi@heaveless.com', href: 'mailto:hi@heaveless.com' },
]
