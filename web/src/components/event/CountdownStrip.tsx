import { christmasEvent as event } from '../../data/event'
import { useCountdown } from '../../lib/useCountdown'
import { deliveryLabel } from './campaign'
import { useLang } from './lang'

const CHRISTMAS_EVE = new Date(`${event.deliveryDate}T23:59:59-05:00`).getTime()
const pad = (value: number) => String(value).padStart(2, '0')

export function CountdownStrip() {
  const { lang, t } = useLang()
  const { days, hours, minutes, seconds, done } = useCountdown(CHRISTMAS_EVE)

  const units = [
    { value: done ? '00' : pad(days), label: t.countdown.days },
    { value: pad(hours), label: t.countdown.hours },
    { value: pad(minutes), label: t.countdown.minutes },
    { value: pad(seconds), label: t.countdown.seconds },
  ]

  return (
    <section aria-labelledby="countdown-title" className="relative">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-8 min-[768px]:px-8 min-[768px]:py-9 min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-10">
        <div className="min-[900px]:w-[190px] min-[900px]:shrink-0">
          <h2 id="countdown-title" className="m-0 text-[9px] font-bold uppercase tracking-[.22em] text-pine-600">
            {t.countdown.title}
          </h2>
          <p className="mt-2 mb-0 text-[0.98rem] font-semibold leading-tight text-forest">{deliveryLabel(lang)}</p>
        </div>

        <div
          className="grid flex-1 grid-cols-4 gap-x-3 min-[480px]:gap-x-6"
          role="timer"
          aria-live="off"
          aria-label={done ? t.countdown.done : t.countdown.timer(days, hours, minutes)}
        >
          {units.map(unit => (
            <div key={unit.label}>
              <p className="m-0 font-display text-[clamp(1.55rem,4.2vw,2.35rem)] font-extrabold leading-none tabular-nums text-forest">
                {unit.value}
              </p>
              <p className="mt-1.5 mb-0 text-[9px] font-bold uppercase tracking-[.14em] text-forest/65">
                {unit.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
