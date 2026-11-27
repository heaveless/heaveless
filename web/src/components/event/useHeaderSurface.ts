import { useEffect, useRef, useState } from 'preact/hooks'

const PAPER_ID = 'paper-start'
const FOOTER_ID = 'event-footer'
const FOOTER_EDGE_ID = 'footer-edge'
const TOP_THRESHOLD = 6

interface Surface {
  onPaper: boolean
  atTop: boolean
}

export function useHeaderSurface<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [surface, setSurface] = useState<Surface>({ onPaper: false, atTop: true })

  useEffect(() => {
    const paper = document.getElementById(PAPER_ID)
    if (!paper) return

    let frame = 0

    const measure = () => {
      frame = 0
      const height = ref.current?.offsetHeight ?? 72
      const paperTop = paper.getBoundingClientRect().top
      const footer = document.getElementById(FOOTER_ID)
      const edge = document.getElementById(FOOTER_EDGE_ID)?.getBoundingClientRect().height ?? 0
      const footerTop = footer ? footer.getBoundingClientRect().top + edge : Number.POSITIVE_INFINITY

      setSurface({
        onPaper: paperTop <= height && footerTop > height,
        atTop: window.scrollY <= TOP_THRESHOLD,
      })
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { ref, ...surface }
}
