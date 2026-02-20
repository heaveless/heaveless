import {
  drawForumIcon,
  drawWorldIcon,
  drawHistoryIcon,
  drawWorksIcon,
  drawContactIcon,
} from './tvIcons'

type IconDrawer = (ctx: CanvasRenderingContext2D, ic: number) => void

const ICON_DRAWERS: IconDrawer[] = [
  drawForumIcon,
  drawWorldIcon,
  drawHistoryIcon,
  drawWorksIcon,
  drawContactIcon,
]

const SCREEN = {
  widthRatio:  0.128,
  heightRatio: 0.168,
  offsetX:     0.042,
  offsetY:     0.207,
  angle:       -0.51,
  cornerR:     0.015,
  borderColor: '#4dfcdb',
  borderWidth: 2,
  borderGlow:  12,
} as const

function drawGlitchContent(
  ctx: CanvasRenderingContext2D,
  fw: number,
  fh: number,
): void {
  const iw        = Math.ceil(fw)
  const ih        = Math.ceil(fh)
  const offscreen = document.createElement('canvas')
  offscreen.width  = iw
  offscreen.height = ih
  const offCtx    = offscreen.getContext('2d')!
  const imageData = offCtx.createImageData(iw, ih)
  const { data }  = imageData

  for (let i = 0; i < data.length; i += 4) {
    const v     = Math.random() * 210 | 0
    data[i]     = v
    data[i + 1] = v
    data[i + 2] = v
    data[i + 3] = 235
  }
  offCtx.putImageData(imageData, 0, 0)
  ctx.drawImage(offscreen, -fw / 2, -fh / 2, fw, fh)

  ctx.fillStyle = 'rgba(0,0,0,0.28)'
  for (let y = -fh / 2; y < fh / 2; y += 2) ctx.fillRect(-fw / 2, y, fw, 1)

  if (Math.random() > 0.45) {
    const bands = 1 + Math.floor(Math.random() * 3)
    for (let b = 0; b < bands; b++) {
      const by = -fh / 2 + Math.random() * fh
      const bh = 1 + Math.random() * 5
      const bx = (Math.random() - 0.5) * fw * 0.35
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,255,200,0.6)' : 'rgba(255,0,180,0.55)'
      ctx.fillRect(-fw / 2 + bx, by, fw, bh)
    }
  }

  if (Math.random() > 0.85) {
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.fillRect(-fw / 2, -fh / 2 + Math.random() * fh, fw, 1)
  }
}

function drawActiveContent(
  ctx: CanvasRenderingContext2D,
  fw: number,
  fh: number,
  hovIdx: number,
): void {
  ctx.fillStyle = '#4dfcdb'
  ctx.fillRect(-fw / 2, -fh / 2, fw, fh)

  const ic = Math.min(fw, fh) * 0.38
  ctx.strokeStyle = '#fff'
  ctx.fillStyle   = '#fff'
  ctx.lineWidth   = ic * 0.12
  ctx.lineCap     = 'round'
  ctx.lineJoin    = 'round'
  ICON_DRAWERS[hovIdx]?.(ctx, ic)
}

export function drawTVScreen(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  robotSize: number,
  floatY: number,
  hovIdx: number,
): void {
  const fw  = robotSize * SCREEN.widthRatio
  const fh  = robotSize * SCREEN.heightRatio
  const scx = cx - robotSize * SCREEN.offsetX
  const scy = cy + floatY - robotSize * SCREEN.offsetY
  const cr  = robotSize * SCREEN.cornerR

  ctx.save()
  ctx.translate(scx, scy)
  ctx.rotate(SCREEN.angle)
  ctx.beginPath()
  ctx.roundRect(-fw / 2, -fh / 2, fw, fh, cr)
  ctx.clip()

  if (hovIdx !== -1) {
    drawActiveContent(ctx, fw, fh, hovIdx)
  } else {
    drawGlitchContent(ctx, fw, fh)
  }

  ctx.restore()

  ctx.save()
  ctx.translate(scx, scy)
  ctx.rotate(SCREEN.angle)
  ctx.strokeStyle = SCREEN.borderColor
  ctx.lineWidth   = SCREEN.borderWidth
  ctx.shadowColor = SCREEN.borderColor
  ctx.shadowBlur  = SCREEN.borderGlow
  ctx.beginPath()
  ctx.roundRect(-fw / 2, -fh / 2, fw, fh, cr)
  ctx.stroke()
  ctx.restore()
}
