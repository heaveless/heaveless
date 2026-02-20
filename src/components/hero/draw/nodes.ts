import { NODE_COUNT, NODES } from '../constants'
import { nodeAngle } from '../utils/layout'
import { drawGlitchText, drawStaticText } from './glitchText'
import type { Layout } from '../types'

export function drawNodes(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  layout: Layout,
  globalAngle: number,
  hoveredIdx: number,
): void {
  const fontSize = Math.round(layout.nodeR * 0.28)

  for (let i = 0; i < NODE_COUNT; i++) {
    const angle = nodeAngle(i, globalAngle)
    const nx    = cx + Math.cos(angle) * layout.orbitR
    const ny    = cy + Math.sin(angle) * layout.orbitR

    if (hoveredIdx === i) {
      drawStaticText(ctx, NODES[i].langs, nx, ny, fontSize)
    } else {
      drawGlitchText(ctx, NODES[i].langs, nx, ny, fontSize)
    }
  }
}
