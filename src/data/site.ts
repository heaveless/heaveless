export type Route = '/' | '/foro' | '/world' | '/history' | '/works' | '/contact'

export interface NavigationItem {
  label: string
  route: Route
  index: string
}

export const navigation: NavigationItem[] = [
  { label: 'Forum', route: '/foro', index: '01' },
  { label: 'World', route: '/world', index: '02' },
  { label: 'History', route: '/history', index: '03' },
  { label: 'Works', route: '/works', index: '04' },
  { label: 'Contact', route: '/contact', index: '05' },
]

export const pageCopy = {
  '/foro': { eyebrow: 'Community', title: 'Forum', subtitle: 'A quiet place for useful conversations.', accent: '01' },
  '/world': { eyebrow: 'Field notes', title: 'World', subtitle: 'Places that changed the way I look at things.', accent: '02' },
  '/history': { eyebrow: 'Archive', title: 'History', subtitle: 'A short record of things worth keeping.', accent: '03' },
  '/works': { eyebrow: 'Selected work', title: 'Works', subtitle: 'Experiments, products and things shipped.', accent: '04' },
  '/contact': { eyebrow: 'Open channel', title: 'Contact', subtitle: 'For collaborations, ideas and good conversations.', accent: '05' },
} as const

export const posts = [
  { user: 'nova_x', time: '2h ago', title: 'Anyone else building with Preact?', replies: 12 },
  { user: 'driftcode', time: '5h ago', title: 'Show your setup: desk and dev environment thread', replies: 34 },
  { user: 'zyph', time: '1d ago', title: 'Best resources for learning canvas animations?', replies: 8 },
  { user: 'lmnop', time: '2d ago', title: 'Dark mode systems: CSS variables or Tailwind?', replies: 21 },
  { user: 'vector_77', time: '3d ago', title: 'Minimal portfolio inspiration: post yours', replies: 57 },
]

export const places = [
  { name: 'Tokyo', description: 'Neon streets and quiet temples.' },
  { name: 'Reykjavik', description: 'Aurora skies and hot springs.' },
  { name: 'Medellín', description: 'Eternal spring and a rising city.' },
  { name: 'Tbilisi', description: 'Ancient wine and modern energy.' },
  { name: 'Chiang Mai', description: 'Mountains, monks and mangoes.' },
]

export const timeline = [
  { year: '2024', event: 'Started building personal projects in public.' },
  { year: '2023', event: 'Went deep into generative art and canvas rendering.' },
  { year: '2022', event: 'First open source contribution merged.' },
  { year: '2021', event: 'Shipped a web app used by real people.' },
  { year: '2020', event: 'Wrote the first line of JavaScript.' },
]

export const projects = [
  { name: 'Orbit UI', description: 'Interactive navigation system built with Preact and TypeScript.', status: 'Live' },
  { name: 'Glyph', description: 'A minimalist markdown editor with live preview and dark mode.', status: 'In progress' },
  { name: 'Pulsar', description: 'Realtime generative art where p5.js meets procedural noise.', status: 'Live' },
  { name: 'Recall', description: 'A spaced repetition app built with Preact and local storage.', status: 'Live' },
]

export const contactLinks = [
  { label: 'GitHub', value: '@heaveless', href: 'https://github.com/heaveless' },
  { label: 'X', value: '@heaveless', href: 'https://x.com/heaveless' },
  { label: 'Email', value: 'hi@heaveless.dev', href: 'mailto:hi@heaveless.dev' },
]
