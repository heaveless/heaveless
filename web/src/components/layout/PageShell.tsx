import type { ComponentChildren } from 'preact'
import { pageCopy } from '../../data/site'
import type { Route } from '../../data/site'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'

interface PageShellProps {
  route: Exclude<Route, '/'>
  children: ComponentChildren
  /** Skip the page title block. Used by pages that open with their own hero. */
  bare?: boolean
}

export function PageShell({ route, children, bare = false }: PageShellProps) {
  const copy = pageCopy[route]
  return (
    <div className="min-h-[100dvh] bg-night">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-[calc(100%-40px)] max-w-[1100px] py-11 min-[768px]:w-[calc(100%-64px)] min-[768px]:py-[72px] min-[768px]:pb-[100px]">
        {!bare && <div className="mb-12 min-[768px]:mb-[72px] min-[768px]:grid min-[768px]:grid-cols-[1fr_2fr] min-[768px]:items-end min-[768px]:gap-8">
          <p className="mb-[22px] flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.14em] text-muted min-[768px]:mb-0 min-[768px]:self-start min-[768px]:pt-1.5"><span className="text-coral">{copy.accent}</span>{copy.eyebrow}</p>
          <h1 className="mb-[18px] text-[clamp(3.8rem,18vw,6.5rem)] font-bold leading-[.85] tracking-[-.09em] min-[768px]:mb-0 min-[768px]:text-[clamp(3rem,8vw,7.5rem)]">{copy.title}</h1>
          <p className="m-0 max-w-[300px] leading-relaxed text-muted min-[768px]:col-start-2 min-[768px]:row-start-1 min-[768px]:justify-self-end min-[768px]:text-left">{copy.subtitle}</p>
        </div>}
        <div>
          {children}
        </div>
      </main>
      <SiteFooter className="w-[calc(100%-40px)] min-[768px]:w-[calc(100%-64px)] min-[1100px]:w-[1100px]" />
    </div>
  )
}
