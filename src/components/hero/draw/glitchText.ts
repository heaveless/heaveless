import { font, currentLangIndex } from '../utils/font'

type LangTuple = [string, string, string, string]

export function drawGlitchText(
  ctx: CanvasRenderingContext2D,
  langs: LangTuple,
  nx: number,
  ny: number,
  fontSize: number,
): void {
  const now        = Date.now()
  const langIdx    = currentLangIndex(now)
  const elapsed    = now % 1500
  const inTransit  = elapsed < 180
  const aberration = inTransit ? 4 + Math.random() * 6 : 1 + Math.random() * 2
  const jitterY    = (Math.random() - 0.5) * (inTransit ? 4 : 1)
  const ghostAlpha = inTransit ? 0.85 : 0.35
  const next       = (langIdx + 1) % 4
  const prev       = (langIdx + 3) % 4

  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'

  ctx.save()
  ctx.globalAlpha = ghostAlpha
  ctx.fillStyle   = '#00ffff'
  ctx.font        = font(next, fontSize)
  ctx.fillText(langs[next], nx + aberration, ny + jitterY)
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = ghostAlpha
  ctx.fillStyle   = '#ff00c8'
  ctx.font        = font(prev, fontSize)
  ctx.fillText(langs[prev], nx - aberration, ny - jitterY)
  ctx.restore()

  ctx.save()
  ctx.fillStyle = '#fff'
  ctx.font      = font(langIdx, fontSize)
  ctx.fillText(langs[langIdx], nx, ny)
  ctx.restore()

  if (inTransit && Math.random() > 0.3) {
    const sliceY  = ny - fontSize * 0.6 + Math.random() * fontSize * 1.2
    const offsetX = (Math.random() - 0.5) * 16
    const sliceLi = Math.floor(Math.random() * 4)
    ctx.save()
    ctx.beginPath()
    ctx.rect(nx - fontSize * 2.5, sliceY, fontSize * 5, 1 + Math.random() * 5)
    ctx.clip()
    ctx.globalAlpha = 0.9
    ctx.fillStyle   = Math.random() > 0.5 ? '#00ffff' : '#ff00ff'
    ctx.font        = font(sliceLi, fontSize)
    ctx.fillText(langs[sliceLi], nx + offsetX, ny)
    ctx.restore()
  }
}

export function drawStaticText(
  ctx: CanvasRenderingContext2D,
  langs: LangTuple,
  nx: number,
  ny: number,
  fontSize: number,
): void {
  ctx.save()
  ctx.fillStyle    = '#fff'
  ctx.font         = font(0, fontSize)
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(langs[0], nx, ny)
  ctx.restore()
}
