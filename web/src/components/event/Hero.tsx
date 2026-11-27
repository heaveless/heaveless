import { christmasEvent as event } from '../../data/event'
import { ArrowMark, GiftMark } from './Marks'
import { daysUntilOpening, donationOpen, donationOpensLabel, giveHref, giveLabel, giveLinkProps, money } from './campaign'
import { useLang } from './lang'

/**
 * The opening: the promise, then the money. The figure is the largest thing on
 * the page after the headline, on a sheet of paper the field cannot dim, and
 * the copy around it is cut to what the figure needs. The field starts behind
 * the sticky header, so the header has no band of its own.
 */
export function Hero() {
  const { lang, t } = useLang()
  const raised = money(lang, event.raised)
  const daysToOpen = daysUntilOpening()
  const openingSoon = !donationOpen && daysToOpen > 0

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

          {/* The money, on the one light surface in the field. It leads with the
              figure at every stage; while donations are closed the date sits
              under it as the status, not as the headline. */}
          <div
            className="rise w-full max-w-[25rem] rounded-[26px] bg-paper p-7 text-forest shadow-[0_50px_90px_-42px_rgb(4_29_21_/_.95)] min-[768px]:max-w-[27rem] min-[768px]:p-10 min-[980px]:max-w-[30rem] min-[980px]:justify-self-end min-[980px]:p-11"
            style={{ animationDelay: '120ms' }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="m-0 text-[9.5px] font-bold uppercase tracking-[.2em] text-pine-600">{t.raised.kicker}</p>
              {openingSoon && (
                <span className="rounded-full bg-lime px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.14em] text-pine-950">
                  {t.raised.opensIn(daysToOpen)}
                </span>
              )}
            </div>

            {/* The amount is set like a receipt: the currency above, the figure
                alone on its line, nothing competing with it. */}
            <p className="mt-8 mb-0 font-display font-extrabold tracking-[-.055em] tabular-nums">
              <span className="mb-1.5 block text-[10px] font-bold uppercase leading-none tracking-[.22em] text-forest/65">
                {raised.symbol}
              </span>
              <span className="block text-[clamp(3.8rem,8.4vw,5.4rem)] leading-[.8]">{raised.amount}</span>
            </p>

            <p className="mt-6 mb-0 max-w-[34ch] text-[0.95rem] leading-[1.6] text-forest/72">
              {donationOpen ? t.raised.live : t.raised.closed(donationOpensLabel(lang))}
            </p>
            {!donationOpen && (
              <p className="mt-2 mb-0 max-w-[34ch] text-[0.88rem] leading-[1.55] text-forest/70">
                {t.raised.opensNote}
              </p>
            )}

            {donationOpen ? (
              <a
                href={giveHref}
                {...giveLinkProps}
                className="mt-8 flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-lime px-5 text-[13px] font-bold text-pine-950 no-underline transition-colors hover:bg-[#eafb8e]"
              >
                <GiftMark className="size-4" />
                {giveLabel(lang)}
                <ArrowMark className="size-4" />
              </a>
            ) : (
              <a
                href="#plan"
                className="mt-8 flex min-h-12 w-full items-center justify-between gap-3 rounded-full border border-forest/20 px-5 text-[13px] font-bold text-forest no-underline transition-colors hover:border-forest/50 hover:bg-forest/[.04]"
              >
                {t.hero.seePlan}
                <ArrowMark className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
