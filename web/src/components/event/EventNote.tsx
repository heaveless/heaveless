import { clsx } from 'clsx'
import { christmasEvent as event } from '../../data/event'
import { useLang } from './lang'
import { KICKER, SECTION, TITLE, WRAP } from './ui'

const paragraph = (index: number) =>
  clsx(
    'm-0',
    index === 0
      ? 'text-[clamp(1.08rem,1.3vw,1.22rem)] leading-[1.7] text-forest/85'
      : 'mt-4',
  )

export function EventNote() {
  const { t } = useLang()

  return (
    <section id="note" className={SECTION} aria-labelledby="note-title">
      <div
        className={clsx(
          WRAP,
          'grid gap-10 py-14 min-[768px]:py-20 min-[900px]:grid-cols-[.82fr_1.18fr] min-[900px]:gap-16',
        )}
      >
        <div className="min-[900px]:sticky min-[900px]:top-28 min-[900px]:self-start">
          <p className={KICKER}>{t.note.kicker}</p>
          <h2 id="note-title" className={clsx(TITLE, 'max-w-[12ch]')}>
            {t.note.heading}
          </h2>
          <p className="event-script mt-8 mb-0 text-[2.6rem] leading-none text-pine-700">{event.signature}</p>
          <p className="mt-2 mb-0 text-[9.5px] font-bold uppercase tracking-[.18em] text-forest/65">{t.city}</p>
        </div>

        <article className="max-w-[62ch] text-[1rem] leading-[1.82] text-forest/75 min-[768px]:text-[1.06rem]">
          <h3 className="sr-only">{t.note.kicker}</h3>
          {t.note.paragraphs.map((text, index) => (
            <p key={text} className={paragraph(index)}>
              {text}
            </p>
          ))}
        </article>
      </div>
    </section>
  )
}
