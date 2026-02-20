import { MOBILE_MARGIN, NODE_ORBIT_RATIO, NODE_COUNT, ORBIT_STEP } from '../constants'
import type { Layout } from '../types'

const MOBILE_ROBOT_MARGIN = 24

export function computeLayout(canvasWidth: number, canvasHeight: number): Layout {
  const mobile = canvasWidth < canvasHeight
  const orbitR = mobile
    ? (canvasWidth - MOBILE_MARGIN * 2) / 2 / (1 + NODE_ORBIT_RATIO)
    : Math.min(canvasWidth, canvasHeight) * 0.28
  const botSz = mobile
    ? Math.min(canvasWidth, canvasHeight) - MOBILE_ROBOT_MARGIN * 2
    : orbitR * (0.46 / 0.28)
  return {
    orbitR,
    nodeR:    orbitR * NODE_ORBIT_RATIO,
    botSz,
    isMobile: mobile,
  }
}

export function nodeAngle(index: number, globalAngle: number): number {
  return globalAngle + ORBIT_STEP * index
}

export function hitIndex(
  mx: number, my: number,
  cx: number, cy: number,
  layout: Layout,
  globalAngle: number,
): number {
  const { orbitR, nodeR } = layout
  for (let i = 0; i < NODE_COUNT; i++) {
    const a  = nodeAngle(i, globalAngle)
    const dx = mx - (cx + Math.cos(a) * orbitR)
    const dy = my - (cy + Math.sin(a) * orbitR)
    if (dx * dx + dy * dy <= nodeR * nodeR) return i
  }
  return -1
}
