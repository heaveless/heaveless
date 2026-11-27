import { clsx } from 'clsx'
import { BasketMark, CandleMark, GiftMark } from './Marks'
import { useLang } from './lang'
import { BODY, SECTION, SectionHead, WRAP } from './ui'

const ICONS = [GiftMark, BasketMark, CandleMark]

export function GiftCards() {
  const { t } = useLang()

  return (
    <section id="gifts" className={SECTION} aria-labelledby="gifts-title">
      <div className={clsx(WRAP, 'py-14 min-[768px]:py-20')}>
        <SectionHead
          id="gifts-title"
          kicker={t.gifts.kicker}
          title={t.gifts.title}
          intro={t.gifts.intro}
          titleWidth="max-w-[30rem]"
        />

        <ul className="m-0 mt-10 grid list-none gap-4 p-0 min-[860px]:grid-cols-3">
          {t.gifts.items.map((item, index) => {
            const Icon = ICONS[index] ?? GiftMark

            return (
              <li key={item.title} className="paper-card relative rounded-[24px] p-6">
                <span className="grid size-11 place-items-center rounded-full bg-lime text-pine-950" aria-hidden="true">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-8 mb-0 text-[1.25rem] font-bold leading-[1.15] tracking-[-.025em] text-forest">
                  {item.title}
                </h3>
                <p className={clsx('mt-2 mb-0', BODY)}>{item.body}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
