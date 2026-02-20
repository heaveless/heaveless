import { TWO_PI, STAR_COUNT } from '../constants'
import type { Star } from '../types'

export function makeStar(canvasWidth: number, canvasHeight: number): Star {
  return {
    x:     Math.random() * canvasWidth,
    y:     Math.random() * canvasHeight,
    size:  0.3 + Math.random() * 1.4,
    phase: Math.random() * TWO_PI,
    speed: 0.01 + Math.random() * 0.03,
  }
}

export function makeStars(canvasWidth: number, canvasHeight: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => makeStar(canvasWidth, canvasHeight))
}

export function drawStars(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  now: number,
): void {
  for (const star of stars) {
    const t     = now * star.speed + star.phase
    const burst = Math.abs(Math.sin(t * 0.02)) > 0.96

    ctx.save()
    ctx.fillStyle = '#fff'

    if (burst) {
      if (Math.floor(now * 2 + star.phase) % 4 !== 0) { ctx.restore(); continue }
      ctx.globalAlpha = 0.55 + Math.random() * 0.3
    } else {
      ctx.globalAlpha = 0.08 + 0.22 * Math.abs(Math.sin(t))
    }

    ctx.beginPath()
    ctx.arc(star.x, star.y, star.size, 0, TWO_PI)
    ctx.fill()
    ctx.restore()
  }
}
