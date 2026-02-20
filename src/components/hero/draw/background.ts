export function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): void {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, w, h)

  const cx       = w / 2
  const cy       = h / 2
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.75)
  gradient.addColorStop(0,   'rgba(232,19,45,0.11)')
  gradient.addColorStop(0.4, 'rgba(232,19,45,0.03)')
  gradient.addColorStop(1,   'transparent')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)
}
