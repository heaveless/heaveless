import { TWO_PI } from '../constants'

type Ctx = CanvasRenderingContext2D

export function drawForumIcon(ctx: Ctx, ic: number): void {
  ctx.beginPath()
  ctx.roundRect(-ic * 0.6, -ic * 0.55, ic * 1.2, ic * 0.9, ic * 0.18)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(-ic * 0.15, ic * 0.35)
  ctx.lineTo(-ic * 0.40, ic * 0.60)
  ctx.lineTo( ic * 0.10, ic * 0.35)
  ctx.fill()

  for (const dx of [-ic * 0.28, 0, ic * 0.28]) {
    ctx.beginPath()
    ctx.arc(dx, -ic * 0.10, ic * 0.07, 0, TWO_PI)
    ctx.fill()
  }
}

export function drawWorldIcon(ctx: Ctx, ic: number): void {
  ctx.beginPath(); ctx.arc(0, 0, ic * 0.6, 0, TWO_PI);                   ctx.stroke()
  ctx.beginPath(); ctx.ellipse(0, 0, ic * 0.25, ic * 0.6, 0, 0, TWO_PI); ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(-ic * 0.6, 0)
  ctx.lineTo( ic * 0.6, 0)
  ctx.stroke()
}

export function drawHistoryIcon(ctx: Ctx, ic: number): void {
  ctx.beginPath(); ctx.arc(0, 0, ic * 0.6, 0, TWO_PI); ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, 0); ctx.lineTo(0,         -ic * 0.38)
  ctx.moveTo(0, 0); ctx.lineTo(ic * 0.30,  ic * 0.18)
  ctx.stroke()
}

export function drawWorksIcon(ctx: Ctx, ic: number): void {
  ctx.beginPath()
  ctx.roundRect(-ic * 0.55, -ic * 0.25, ic * 1.1,  ic * 0.75, ic * 0.10)
  ctx.stroke()
  ctx.beginPath()
  ctx.roundRect(-ic * 0.25, -ic * 0.48, ic * 0.50, ic * 0.25, ic * 0.08)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(-ic * 0.55, ic * 0.12)
  ctx.lineTo( ic * 0.55, ic * 0.12)
  ctx.stroke()
}

export function drawContactIcon(ctx: Ctx, ic: number): void {
  ctx.beginPath()
  ctx.roundRect(-ic * 0.6, -ic * 0.38, ic * 1.2, ic * 0.76, ic * 0.08)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(-ic * 0.6, -ic * 0.38)
  ctx.lineTo(0,          ic * 0.10)
  ctx.lineTo( ic * 0.6, -ic * 0.38)
  ctx.stroke()
}
