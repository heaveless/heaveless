export interface OrbitNode {
  langs: [string, string, string, string]  // [en, ja, es, zh]
  route: string
}

export interface Star {
  x: number
  y: number
  size: number
  phase: number
  speed: number
}

export interface Layout {
  orbitR: number
  nodeR: number
  botSz: number
  isMobile: boolean
}
