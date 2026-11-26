import { christmasEvent as event } from '../../data/event'
import { ArrowMark, GiftMark, SnowflakeMark } from './Marks'
import { TreeScene } from './TreeScene'
import { donationOpen, donationOpensMonthDay, donationOpensYear, giveHref, giveLabel, giveLinkProps, money } from './campaign'
import { useLang } from './lang'

/**
 * The opening, built the way a campaign page is built: the promise on the left
 * with the money in a white panel right under it, the tree standing in the snow
 * on the right. The panel is the one light surface in the field, so the figure
 * and the action read before anything else.
 */
export function Hero() {
  const { lang, t } = useLang()
  const raised = money(lang, event.raised)

  return (
    <section aria-labelledby="event-title" className="relative overflow-hidden bg-pine-800 text-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_74%_22%,#1e7150_0%,transparent_64%),radial-gradient(40%_38%_at_86%_58%,rgba(223,244,95,.13)_0%,transparent_72%),linear-gradient(180deg,#0a3826_0%,#072b1f_58%,#041d15_100%)]"
      />

      <div className="relative mx-auto max-w-[1200px] px-5 pb-40 pt-6 min-[768px]:px-8 min-[768px]:pb-24 min-[768px]:pt-10 min-[980px]:pb-36">
        <div className="grid gap-10 min-[980px]:grid-cols-[1.04fr_.96fr] min-[980px]:items-center min-[980px]:gap-4">
          <div className="min-w-0">
            <p className="rise m-0 flex items-center gap-2.5 text-[9.5px] font-bold uppercase tracking-[.22em] text-paper/65">
              <SnowflakeMark className="size-3.5 shrink-0 text-lime" />
              {t.hero.eyebrow}
              <span aria-hidden="true" className="hidden text-paper/25 min-[420px]:inline">/</span>
              <span className="hidden text-paper/60 min-[420px]:inline">{t.city}</span>
            </p>

            <h1
              id="event-title"
              className="rise-soft mt-4 mb-0 text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold leading-[.98] tracking-[-.045em] text-paper"
            >
              {t.hero.headline.lead}{' '}
              <br />
              <span className="text-lime">{t.hero.headline.accent}</span>
            </h1>

            <p
              className="rise mt-4 mb-0 max-w-[44ch] text-[0.98rem] leading-[1.72] text-paper/70 min-[768px]:text-[1.03rem]"
              style={{ animationDelay: '80ms' }}
            >
              {t.hero.intro}
            </p>

            {/* While donations are closed, the figure is the opening date.
                A campaign that has not started has no raised amount to show. */}
            <div
              className="rise mt-7 w-full max-w-[23rem] rounded-[18px] bg-paper p-5 text-forest shadow-[0_26px_55px_-22px_rgb(4_29_21_/_.9)] min-[768px]:p-6"
              style={{ animationDelay: '130ms' }}
            >
              {donationOpen ? (
                <>
                  <p className="m-0 text-[9px] font-bold uppercase tracking-[.2em] text-pine-600">{t.raised.kicker}</p>
                  <p className="mt-1 mb-0 font-display text-[clamp(2.8rem,6.2vw,3.9rem)] font-extrabold leading-[.9] tracking-[-.05em] tabular-nums">
                    <span className="text-[0.5em] font-bold tracking-normal text-forest/60">{raised.symbol}</span>{' '}
                    {raised.amount}
                  </p>
                  <p className="mt-1.5 mb-0 max-w-[34ch] text-[0.84rem] leading-[1.5] text-forest/72">
                    {t.raised.live}
                  </p>

                  <a
                    href={giveHref}
                    {...giveLinkProps}
                    className="mt-4 flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-lime px-5 text-[13px] font-bold text-pine-950 no-underline transition-colors hover:bg-[#eafb8e]"
                  >
                    <GiftMark className="size-4" />
                    {giveLabel(lang)}
                    <ArrowMark className="size-4" />
                  </a>
                </>
              ) : (
                <>
                  <p className="m-0 text-[9px] font-bold uppercase tracking-[.2em] text-pine-600">{t.raised.opens}</p>
                  <p className="mt-2 mb-0 font-display text-[clamp(2.2rem,5.1vw,3.15rem)] font-extrabold leading-[.92] tracking-[-.05em] text-forest">
                    {donationOpensMonthDay(lang)}
                    <span className="mt-0.5 block text-[0.42em] font-bold tracking-[-.01em] text-forest/60">
                      {donationOpensYear(lang)}
                    </span>
                  </p>
                  <p className="mt-2.5 mb-0 max-w-[30ch] text-[0.84rem] leading-[1.5] text-forest/72">
                    {t.raised.opensNote}
                  </p>
                  <a
                    href="#plan"
                    className="mt-3 inline-flex min-h-11 items-center gap-2 text-[13px] font-bold text-forest underline decoration-forest/25 underline-offset-4 transition-colors hover:decoration-forest"
                  >
                    {t.hero.seePlan}
                    <ArrowMark className="size-4" />
                  </a>
                </>
              )}
            </div>

            <a
              href={donationOpen ? '#plan' : '#note'}
              className="rise mt-4 inline-flex min-h-11 items-center text-[13px] font-semibold text-paper/70 underline decoration-paper/25 underline-offset-4 transition-colors hover:text-paper hover:decoration-paper/70"
              style={{ animationDelay: '180ms' }}
            >
              {donationOpen ? t.hero.seePlan : t.hero.read}
            </a>
          </div>

          <div className="rise relative min-[980px]:-mb-36 min-[980px]:-mr-6 min-[1180px]:-mr-14" style={{ animationDelay: '120ms' }}>
            <TreeScene className="mx-auto w-full max-w-[330px] min-[768px]:max-w-[400px] min-[980px]:max-w-[540px]" />
          </div>
        </div>
      </div>
    </section>
  )
}
