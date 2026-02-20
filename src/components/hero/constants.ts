import type { OrbitNode } from './types'

export const TWO_PI           = Math.PI * 2
export const ORBIT_SPEED      = 0.008
export const NODE_COUNT       = 5
export const ORBIT_STEP       = TWO_PI / NODE_COUNT
export const MOBILE_MARGIN    = 12
export const NODE_ORBIT_RATIO = 0.078 / 0.28
export const STAR_COUNT       = 180

export const NODES: OrbitNode[] = [
  { langs: ['Forum',   'フォーラム', 'Foro',      '论坛'], route: '/foro'    },
  { langs: ['World',   'ワールド',   'Mundo',     '世界'], route: '/world'   },
  { langs: ['History', 'ヒストリー', 'Historia',  '历史'], route: '/history' },
  { langs: ['Works',   'ワークス',   'Trabajos',  '作品'], route: '/works'   },
  { langs: ['Contact', 'コンタクト', 'Contacto',  '联系'], route: '/contact' },
]

// 0=EN → Orbitron, 1=JA → Noto Sans JP, 2=ES → Orbitron, 3=ZH → Noto Sans SC
export const FONTS = [
  `bold {sz}px 'Orbitron', sans-serif`,
  `bold {sz}px 'Noto Sans JP', sans-serif`,
  `bold {sz}px 'Orbitron', sans-serif`,
  `bold {sz}px 'Noto Sans SC', sans-serif`,
]
