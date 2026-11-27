export const KICKER = 'm-0 text-[10px] font-bold uppercase tracking-[.22em] text-pine-600'
export const TITLE =
  'mt-3 mb-0 text-[clamp(1.85rem,4.6vw,3rem)] font-extrabold leading-[1.02] tracking-[-.04em] text-forest'
export const SECTION = 'scroll-mt-24 min-[768px]:scroll-mt-28'
export const WRAP = 'mx-auto w-full max-w-[1200px] px-5 min-[768px]:px-8'
export const BODY = 'm-0 text-[0.92rem] leading-[1.6] text-forest/72'

interface SectionHeadProps {
  id: string
  kicker: string
  title: string
  intro: string
  titleWidth?: string
}

export function SectionHead({ id, kicker, title, intro, titleWidth = 'max-w-[32ch]' }: SectionHeadProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div className={titleWidth}>
        <p className={KICKER}>{kicker}</p>
        <h2 id={id} className={TITLE}>
          {title}
        </h2>
      </div>
      <p className="m-0 max-w-[36ch] text-[0.95rem] leading-[1.6] text-forest/70">{intro}</p>
    </div>
  )
}
