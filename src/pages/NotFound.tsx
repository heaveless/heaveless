import { SiteHeader } from '../components/layout/SiteHeader'

export function NotFoundPage() {
  return (
    <div className="min-h-[100dvh] bg-night">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex min-h-[calc(100dvh-68px)] w-[calc(100%-40px)] max-w-[1100px] flex-col justify-center py-16 min-[768px]:min-h-[calc(100dvh-76px)] min-[768px]:w-[calc(100%-64px)]">
        <p className="mb-5 font-mono text-[10px] uppercase tracking-[.14em] text-coral">404 / Not found</p>
        <h1 className="mb-6 max-w-[650px] text-[clamp(3.5rem,10vw,8rem)] font-bold leading-[.85] tracking-[-.09em]">This path is closed.</h1>
        <p className="mb-9 max-w-[360px] leading-relaxed text-muted">That page is no longer part of this world.</p>
        <a className="w-max border border-coral px-[17px] py-[13px] font-mono text-[11px] uppercase text-white transition-[background-color,color,translate] hover:-translate-y-0.5 hover:bg-coral hover:text-night" href="/">Return home <span aria-hidden="true">↗</span></a>
      </main>
    </div>
  )
}
