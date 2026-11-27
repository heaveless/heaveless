import { christmasEvent as event } from '../../data/event'
import { ArrowMark, GiftMark } from './Marks'
import { daysUntilOpening, donationOpen, donationOpensLabel, giveHref, giveLabel, giveLinkProps, money } from './campaign'
import { useLang } from './lang'

export function CampaignPanel() {
  const { lang, t } = useLang()
  const raised = money(lang, event.raised)
  const daysToOpen = daysUntilOpening()
  const openingSoon = !donationOpen && daysToOpen > 0

  return (
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
        <p className="mt-2 mb-0 max-w-[34ch] text-[0.88rem] leading-[1.55] text-forest/70">{t.raised.opensNote}</p>
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
  )
}
