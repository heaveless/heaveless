import { clsx } from 'clsx'
import { christmasEvent as event, type StepStatus } from '../../data/event'
import { planDateLabel, nextPlanIndex } from './campaign'
import { useLang } from './lang'
import { BODY, SECTION, SectionHead, WRAP } from './ui'

const statusOf = (index: number, next: number): StepStatus => {
  if (next === -1 || index < next) return 'done'
  return index === next ? 'next' : 'later'
}

const DOT: Record<StepStatus, string> = {
  next: 'bg-lime ring-1 ring-forest/25',
  done: 'bg-forest',
  later: 'border border-forest/30 bg-paper',
}

export function EventPlan() {
  const { lang, t } = useLang()
  const next = nextPlanIndex(event.plan.map(step => step.date))

  return (
    <section id="plan" className={SECTION} aria-labelledby="plan-title">
      <div className={clsx(WRAP, 'py-14 min-[768px]:py-20')}>
        <SectionHead id="plan-title" kicker={t.plan.kicker} title={t.plan.title} intro={t.plan.intro} />

        <ol className="relative m-0 mt-11 grid list-none gap-8 p-0 min-[900px]:grid-cols-4 min-[900px]:gap-5">
          {event.plan.map((step, index) => {
            const copy = t.plan.steps[index]
            const status = statusOf(index, next)

            return (
              <li key={step.date} className="plan-step relative min-w-0">
                {index < event.plan.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-[5px] left-[6px] hidden h-px w-[calc(100%+20px)] border-t border-dashed border-forest/20 min-[900px]:block"
                  />
                )}

                <div className="flex h-3 items-center">
                  <span className={clsx('relative z-10 size-3 shrink-0 rounded-full', DOT[status])} aria-hidden="true" />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="font-display text-[13.5px] font-bold tracking-[-.01em] text-forest">
                    {planDateLabel(step.date, lang)}
                  </span>
                  <span className="sr-only">{t.status[status]}.</span>
                </div>

                <h3 className="mt-3 mb-0 text-[1.15rem] font-bold leading-[1.16] tracking-[-.025em] text-forest">
                  {copy.title}
                </h3>
                <p className={clsx('mt-2 mb-0', BODY)}>{copy.body}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
