import { CampaignPanel } from './CampaignPanel'
import { useLang } from './lang'

export function Hero() {
  const { t } = useLang()

  return (
    <section
      aria-labelledby="event-title"
      className="relative -mt-[66px] overflow-hidden bg-pine-800 text-paper min-[768px]:-mt-[80px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_18%_0%,#1e7150_0%,transparent_62%),radial-gradient(46%_44%_at_92%_12%,rgba(223,244,95,.10)_0%,transparent_72%),linear-gradient(180deg,#0a3826_0%,#072b1f_58%,#041d15_100%)]"
      />

      <div className="relative mx-auto max-w-[1200px] px-5 pb-44 pt-[calc(66px+2.75rem)] min-[768px]:px-8 min-[768px]:pb-52 min-[768px]:pt-[calc(80px+4.5rem)]">
        <div className="grid gap-12 min-[980px]:grid-cols-[minmax(0,1fr)_auto] min-[980px]:items-center min-[980px]:gap-16 min-[1180px]:gap-24">
          <div className="min-w-0 max-w-[34rem]">
            <p className="rise m-0 flex flex-wrap items-center gap-2.5 text-[9.5px] font-bold uppercase tracking-[.22em] text-paper/65">
              {t.hero.eyebrow}
              <span aria-hidden="true" className="hidden text-paper/25 min-[420px]:inline">/</span>
              <span className="hidden text-paper/60 min-[420px]:inline">{t.city}</span>
            </p>

            <h1
              id="event-title"
              className="rise-soft mt-5 mb-0 text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold leading-[.98] tracking-[-.045em] text-paper"
            >
              {t.hero.headline.lead}{' '}
              <br />
              <span className="text-lime">{t.hero.headline.accent}</span>
            </h1>

            <p
              className="rise mt-6 mb-0 max-w-[40ch] text-[0.98rem] leading-[1.7] text-paper/70 min-[768px]:text-[1.03rem]"
              style={{ animationDelay: '80ms' }}
            >
              {t.hero.intro}
            </p>
          </div>

          <CampaignPanel />
        </div>
      </div>
    </section>
  )
}
