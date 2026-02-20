import { useEffect, useRef, useState } from 'preact/hooks'

import robotImg from '../../assets/robot.png'
import { NODES, ORBIT_SPEED } from './constants'
import { computeLayout, hitIndex } from './utils/layout'
import { loadRobotImage } from './utils/image'
import { makeStars } from './draw/stars'
import { drawBackground } from './draw/background'
import { drawStars } from './draw/stars'
import { drawNodes } from './draw/nodes'
import { drawRobot } from './draw/robot'
import { drawTVScreen } from './draw/tvScreen'
import { MobileMenu } from './MobileMenu'
import type { Star } from './types'

export function Hero() {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const animRef      = useRef<number>(0)
  const processedRef = useRef<HTMLCanvasElement | null>(null)
  const starsRef     = useRef<Star[]>([])
  const globalAngle  = useRef<number>(0)
  const pausedRef    = useRef<boolean>(false)
  const hoveredIdx   = useRef<number>(-1)

  const [isMobileView, setIsMobileView] = useState(
    () => window.innerWidth < window.innerHeight,
  )

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < window.innerHeight)
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resetSize = () => {
      canvas.width  = canvas.clientWidth
      canvas.height = canvas.clientHeight
      starsRef.current = makeStars(canvas.width, canvas.height)
    }
    resetSize()
    window.addEventListener('resize', resetSize)

    loadRobotImage(robotImg, processed => { processedRef.current = processed })

    const getHitIndex = (clientX: number, clientY: number): number => {
      const rect   = canvas.getBoundingClientRect()
      const layout = computeLayout(canvas.width, canvas.height)
      if (layout.isMobile) return -1  // nodes hidden on mobile
      return hitIndex(
        clientX - rect.left,
        clientY - rect.top,
        canvas.width / 2,
        canvas.height / 2,
        layout,
        globalAngle.current,
      )
    }

    const onMouseMove = (e: MouseEvent) => {
      const idx = getHitIndex(e.clientX, e.clientY)
      hoveredIdx.current  = idx
      pausedRef.current   = idx !== -1
      canvas.style.cursor = idx !== -1 ? 'pointer' : 'default'
    }

    const onMouseLeave = () => {
      hoveredIdx.current  = -1
      pausedRef.current   = false
      canvas.style.cursor = 'default'
    }

    const onClick = (e: MouseEvent) => {
      const idx = getHitIndex(e.clientX, e.clientY)
      if (idx !== -1) window.location.hash = '#' + NODES[idx].route
    }

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch  = e.touches[0]
      const idx    = getHitIndex(touch.clientX, touch.clientY)
      hoveredIdx.current = idx
      pausedRef.current  = idx !== -1
    }

    const onTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0]
      const idx   = getHitIndex(touch.clientX, touch.clientY)
      if (idx !== -1) window.location.hash = '#' + NODES[idx].route
      hoveredIdx.current = -1
      pausedRef.current  = false
    }

    canvas.addEventListener('mousemove',  onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('click',      onClick)
    canvas.addEventListener('touchmove',  onTouchMove, { passive: false })
    canvas.addEventListener('touchend',   onTouchEnd)

    function loop() {
      const { width: w, height: h } = canvas
      const cx     = w / 2
      const cy     = h / 2
      const layout = computeLayout(w, h)
      const now    = Date.now()

      if (!pausedRef.current) globalAngle.current += ORBIT_SPEED

      drawBackground(ctx, w, h)
      drawStars(ctx, starsRef.current, now * 0.001)

      if (!layout.isMobile) {
        drawNodes(ctx, cx, cy, layout, globalAngle.current, hoveredIdx.current)
      }

      if (processedRef.current) {
        const floatY = Math.sin(now * 0.0018) * (layout.botSz * 0.04)
        drawRobot(ctx, processedRef.current, cx, cy, layout.botSz, floatY)
        drawTVScreen(ctx, cx, cy, layout.botSz, floatY, hoveredIdx.current)
      }

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resetSize)
      canvas.removeEventListener('mousemove',  onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('click',      onClick)
      canvas.removeEventListener('touchmove',  onTouchMove)
      canvas.removeEventListener('touchend',   onTouchEnd)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
      {isMobileView && <MobileMenu />}
    </>
  )
}
