import robotImage from '../../assets/robot.png'
import { navigation } from '../../data/site'
import { SiteHeader } from '../layout/SiteHeader'

export function Hero() {
  return (
    <div className="min-h-[100dvh] bg-night">
      <SiteHeader />
      <main id="main-content" className="mx-auto grid min-h-[calc(100dvh-124px)] w-[calc(100%-40px)] grid-cols-1 min-[768px]:w-[calc(100%-64px)] min-[1320px]:w-[1320px] min-[768px]:grid-cols-[minmax(280px,.85fr)_minmax(450px,1.15fr)] min-[768px]:items-center">
        <section className="relative z-[2] py-[44px] pb-6 min-[768px]:py-[70px] min-[768px]:pb-[90px]" aria-labelledby="hero-title">
          <p className="mb-[23px] flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.14em] text-muted"><span className="text-coral">00</span>Personal world / 2026</p>
          <h1 id="hero-title" className="mb-[25px] max-w-[680px] text-[clamp(3.2rem,16vw,5rem)] font-bold leading-[.94] tracking-[-.085em] min-[768px]:text-[clamp(3.2rem,7vw,7.3rem)]">Build a world<br /><em className="not-italic text-coral">worth visiting.</em></h1>
          <p className="mb-[37px] max-w-[330px] text-sm leading-relaxed text-muted min-[768px]:text-base">A living archive of ideas, places, experiments and conversations.</p>
          <a className="inline-flex items-center gap-[18px] border border-coral px-[17px] py-[13px] font-mono text-[11px] uppercase text-white transition-[background-color,color,translate] hover:-translate-y-0.5 hover:bg-coral hover:text-night" href="/works">See the work <span aria-hidden="true">↗</span></a>
        </section>
        <section className="relative grid min-h-[350px] place-items-center min-[768px]:min-h-[min(700px,calc(100dvh-120px))]" aria-label="Explore the site">
          <div className="absolute aspect-square w-[71%] rotate-[-17deg] rounded-full border border-line" aria-hidden="true" />
          <div className="absolute aspect-square w-[54%] rotate-[29deg] rounded-full border border-coral/30" aria-hidden="true" />
          <img className="relative z-[2] w-[72%] max-w-[320px] animate-float drop-shadow-[0_0_35px_rgba(255,86,102,.17)] min-[768px]:w-[58%] min-[768px]:max-w-[450px]" src={robotImage} width="1024" height="1024" alt="Illustrated robot looking at a glowing screen" />
          {navigation.map((item, index) => (
            <a key={item.route} className={`absolute z-[4] flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.07em] text-muted transition-[color,translate] hover:-translate-y-0.5 hover:text-white ${[
              'left-[4%] top-[16%] min-[768px]:left-[16%] min-[768px]:top-[20%]',
              'right-[2%] top-[7%] min-[768px]:right-[18%]',
              'bottom-[25%] right-0 min-[768px]:bottom-[28%] min-[768px]:right-[6%]',
              'bottom-[4%] left-[12%] min-[768px]:bottom-[8%] min-[768px]:left-[26%]',
              'left-0 top-[49%] min-[768px]:left-[1%] min-[768px]:top-[47%]',
            ][index]}`} href={item.route}>
              <span className="text-[9px] text-coral">{item.index}</span>{item.label}
            </a>
          ))}
          <p className="absolute bottom-[6%] right-0 m-0 font-mono text-[10px] uppercase text-muted min-[768px]:bottom-[9%] min-[768px]:right-[6%]">Choose a direction <span className="ml-2.5 text-coral" aria-hidden="true">↓</span></p>
        </section>
      </main>
      <p className="mx-auto w-[calc(100%-40px)] pb-5 font-mono text-[10px] uppercase tracking-[.08em] text-muted min-[768px]:w-[calc(100%-64px)] min-[1320px]:w-[1320px] min-[768px]:pb-6">The interface is the invitation.</p>
    </div>
  )
}
