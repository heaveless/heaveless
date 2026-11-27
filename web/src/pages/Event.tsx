import { useEffect, useState } from 'preact/hooks'
import { christmasEvent as event, eventCopy, type Lang } from '../data/event'
import { useTikTokSession } from '../lib/useTikTokSession'
import { TikTokLoginButton } from '../components/live/TikTokLoginButton'
import { EventHeader } from '../components/event/EventHeader'
import { Hero } from '../components/event/Hero'
import { CountdownStrip } from '../components/event/CountdownStrip'
import { EventFooter } from '../components/event/EventFooter'
import { PineTree, SnowDrift, Snowfall } from '../components/event/Snow'
import { BasketMark, CandleMark, GiftMark } from '../components/event/Marks'
import { LangContext, rememberLang, storedLang, useLang } from '../components/event/lang'
import { nextPlanIndex, planDateLabel } from '../components/event/campaign'

const kicker = 'm-0 text-[10px] font-bold uppercase tracking-[.22em] text-pine-600'
const title = 'mt-3 mb-0 text-[clamp(1.85rem,4.6vw,3rem)] font-extrabold leading-[1.02] tracking-[-.04em] text-forest'
const section = 'scroll-mt-24 min-[768px]:scroll-mt-28'
const wrap = 'mx-auto w-full max-w-[1200px] px-5 min-[768px]:px-8'

const giftIcons = [GiftMark, BasketMark, CandleMark]

export function EventPage() {
  const [lang, setLang] = useState<Lang>(() => storedLang())

  const changeLang = (next: Lang) => {
    setLang(next)
    rememberLang(next)
  }

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t: eventCopy[lang] }}>
      <EventBody />
    </LangContext.Provider>
  )
}

function EventBody() {
  const { lang, t } = useLang()
  const { session, authNotice, login, logout } = useTikTokSession()

  const wall = session
    ? [{ name: session.name, avatar: session.avatar, you: true }, ...event.supporters]
    : event.supporters

  // The plan follows the clock: the first date that has not passed is the
  // next beat, every earlier date is done, every later date is still to come.
  const nextIndex = nextPlanIndex(event.plan.map(step => step.date))

  // The event is a separate skin: it owns the surface colours while it is mounted.
  useEffect(() => {
    const root = document.documentElement
    const bodyElement = document.body
    const themeColor = document.querySelector('meta[name="theme-color"]')
    const previousColor = themeColor?.getAttribute('content') ?? null
    const previousScheme = root.style.colorScheme
    const previousBodyBackground = bodyElement.style.backgroundColor
    const previousBodyColor = bodyElement.style.color

    themeColor?.setAttribute('content', '#041d15')
    root.style.colorScheme = 'dark'
    bodyElement.style.backgroundColor = '#041d15'
    bodyElement.style.color = '#fbf8ee'

    return () => {
      if (previousColor) themeColor?.setAttribute('content', previousColor)
      root.style.colorScheme = previousScheme
      bodyElement.style.backgroundColor = previousBodyBackground
      bodyElement.style.color = previousBodyColor
    }
  }, [])

  // Language owns the document language, title and description, and gives all
  // three back when the event unmounts.
  useEffect(() => {
    const root = document.documentElement
    const description = document.querySelector('meta[name="description"]')
    const previousLang = root.lang
    const previousTitle = document.title
    const previousDescription = description?.getAttribute('content') ?? null

    root.lang = lang
    document.title = t.meta.title
    description?.setAttribute('content', t.meta.description)

    return () => {
      root.lang = previousLang
      document.title = previousTitle
      if (previousDescription !== null) description?.setAttribute('content', previousDescription)
    }
  }, [lang, t])

  return (
    <div className="event-page relative min-h-[100dvh] overflow-x-clip">
      <Snowfall />
      <EventHeader />

      <main id="main-content">
        <Hero />

        {/* The snow field: everything after the opening happens on paper. */}
        <div className="relative bg-paper text-forest" id="paper-start">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] h-[104px] min-[768px]:h-[146px]"
          >
            <SnowDrift className="absolute inset-x-0 bottom-0 h-full w-full text-paper" />
            <PineTree className="absolute bottom-[12%] left-[5%] h-9 w-6 text-pine-700 min-[768px]:left-[7%] min-[768px]:h-14 min-[768px]:w-9" />
            <PineTree className="absolute bottom-[8%] left-[10%] h-6 w-4 text-pine-600 min-[768px]:left-[12%] min-[768px]:h-8 min-[768px]:w-6" />
            <PineTree className="absolute bottom-[14%] left-[92%] hidden h-12 w-8 text-pine-700 min-[768px]:block" />
          </div>

          <CountdownStrip />

          {/* The plan as four dated beats on one rail. */}
          <section id="plan" className={section} aria-labelledby="plan-title">
            <div className={`${wrap} py-14 min-[768px]:py-20`}>
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div className="max-w-[32ch]">
                  <p className={kicker}>{t.plan.kicker}</p>
                  <h2 id="plan-title" className={title}>
                    {t.plan.title}
                  </h2>
                </div>
                <p className="m-0 max-w-[36ch] text-[0.95rem] leading-[1.6] text-forest/70">{t.plan.intro}</p>
              </div>

              <div className="relative mt-11">
                <ol className="relative m-0 grid list-none gap-8 p-0 min-[900px]:grid-cols-4 min-[900px]:gap-5">
                  {event.plan.map((step, index) => {
                    const copy = t.plan.steps[index]
                    const status =
                      nextIndex === -1 || index < nextIndex
                        ? 'done'
                        : index === nextIndex
                          ? 'next'
                          : 'later'
                    const dot =
                      status === 'next'
                        ? 'bg-lime ring-1 ring-forest/25'
                        : status === 'done'
                          ? 'bg-forest'
                          : 'border border-forest/30 bg-paper'

                    return (
                      <li key={step.date} className="plan-step relative min-w-0">
                        {/* One connector per step, ending at the next dot, so
                            the rail never runs past the last date. */}
                        {index < event.plan.length - 1 && (
                          <span
                            aria-hidden="true"
                            className="absolute top-[5px] left-[6px] hidden h-px w-[calc(100%+20px)] border-t border-dashed border-forest/20 min-[900px]:block"
                          />
                        )}
                        <div className="flex h-3 items-center">
                          <span
                            className={`relative z-10 size-3 shrink-0 rounded-full ${dot}`}
                            aria-hidden="true"
                          />
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
                        <p className="mt-2 mb-0 text-[0.92rem] leading-[1.6] text-forest/72">{copy.body}</p>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </div>
          </section>

          {/* What the money turns into. */}
          <section id="gifts" className={section} aria-labelledby="gifts-title">
            <div className={`${wrap} py-14 min-[768px]:py-20`}>
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div className="max-w-[30rem]">
                  <p className={kicker}>{t.gifts.kicker}</p>
                  <h2 id="gifts-title" className={title}>
                    {t.gifts.title}
                  </h2>
                </div>
                <p className="m-0 max-w-[36ch] text-[0.95rem] leading-[1.6] text-forest/70">{t.gifts.intro}</p>
              </div>

              <ul className="m-0 mt-10 grid list-none gap-4 p-0 min-[860px]:grid-cols-3">
                {t.gifts.items.map((item, index) => {
                  const Icon = giftIcons[index % giftIcons.length]
                  return (
                    <li key={item.title} className="paper-card relative rounded-[24px] p-6">
                      <div className="flex items-start justify-between gap-4">
                        <span
                          className="grid size-11 place-items-center rounded-full bg-lime text-pine-950"
                          aria-hidden="true"
                        >
                          <Icon className="size-5" />
                        </span>
                      </div>
                      <h3 className="mt-8 mb-0 text-[1.25rem] font-bold leading-[1.15] tracking-[-.025em] text-forest">
                        {item.title}
                      </h3>
                      <p className="mt-2 mb-0 text-[0.92rem] leading-[1.6] text-forest/72">{item.body}</p>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>

          {/* The letter, read straight. */}
          <section id="note" className={section} aria-labelledby="note-title">
            <div className={`${wrap} grid gap-10 py-14 min-[768px]:py-20 min-[900px]:grid-cols-[.82fr_1.18fr] min-[900px]:gap-16`}>
              <div className="min-[900px]:sticky min-[900px]:top-28 min-[900px]:self-start">
                <p className={kicker}>{t.note.kicker}</p>
                <h2 id="note-title" className={`${title} max-w-[12ch]`}>
                  {t.note.heading}
                </h2>
                <p className="event-script mt-8 mb-0 text-[2.6rem] leading-none text-pine-700">{event.signature}</p>
                <p className="mt-2 mb-0 text-[9.5px] font-bold uppercase tracking-[.18em] text-forest/65">{t.city}</p>
              </div>

              <article>
                <h3 className="sr-only">{t.note.kicker}</h3>
                <div className="max-w-[62ch] text-[1rem] leading-[1.82] text-forest/75 min-[768px]:text-[1.06rem]">
                  {t.note.paragraphs.map((paragraph, index) => (
                    <p
                      key={paragraph.slice(0, 28)}
                      className={
                        index === 0
                          ? 'm-0 text-[clamp(1.08rem,1.3vw,1.22rem)] leading-[1.7] text-forest/85'
                          : 'm-0 mt-4'
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            </div>
          </section>

          {/* The wall of names, and the way onto it. */}
          <section id="wall" className={section} aria-labelledby="wall-title">
            <div className={`${wrap} py-14 min-[768px]:py-20`}>
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div className="max-w-[32ch]">
                  <p className={kicker}>{t.wall.kicker}</p>
                  <h2 id="wall-title" className={title}>
                    {t.wall.title}
                  </h2>
                </div>
                <p className="m-0 max-w-[36ch] text-[0.95rem] leading-[1.6] text-forest/70">{t.wall.intro}</p>
              </div>

              {wall.length > 0 ? (
                <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-3 p-0 min-[480px]:grid-cols-2 min-[900px]:grid-cols-4">
                  {wall.map((person, index) => (
                    <li key={`${person.name}-${index}`} className="paper-card flex items-center gap-3 rounded-2xl p-3.5">
                      {person.avatar ? (
                        <img
                          className="size-10 shrink-0 rounded-full bg-paper-2 object-cover"
                          src={person.avatar}
                          width="40"
                          height="40"
                          loading="lazy"
                          alt=""
                        />
                      ) : (
                        <span
                          className="grid size-10 shrink-0 place-items-center rounded-full bg-forest text-[0.95rem] font-bold text-lime"
                          aria-hidden="true"
                        >
                          {person.name.slice(0, 1)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="m-0 truncate text-[0.92rem] font-semibold text-forest">{person.name}</p>
                        <p className="mt-0.5 mb-0 text-[9px] font-bold uppercase tracking-[.14em] text-pine-600">
                          {person.you ? t.wall.you : t.wall.onWall}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-8 mb-0 max-w-[44ch] text-[0.95rem] leading-[1.6] text-forest/72">
                  {t.wall.empty}
                </p>
              )}

              <div className="pine-card mt-8 grid gap-5 rounded-[24px] p-5 text-paper min-[768px]:grid-cols-[1fr_auto] min-[768px]:items-center min-[768px]:gap-10 min-[768px]:p-7">
                <div>
                  <h3 className="m-0 text-[1.25rem] font-bold leading-tight tracking-[-.02em] text-paper">
                    {t.wall.loginTitle}
                  </h3>
                  <p className="mt-1.5 mb-0 max-w-[54ch] text-[0.92rem] leading-[1.6] text-paper/70">
                    {t.wall.loginBody}
                  </p>
                  {authNotice && (
                    <p role="status" className="mt-2 mb-0 text-[9.5px] font-bold uppercase tracking-[.14em] text-lime">
                      {authNotice === 'error' ? t.wall.authError : t.wall.authMissing}
                    </p>
                  )}
                </div>

                <div className="min-[768px]:justify-self-end">
                  {session ? (
                    <div className="flex flex-wrap items-center gap-3">
                      {session.avatar && (
                        <img
                          className="size-9 rounded-full bg-pine-800 object-cover"
                          src={session.avatar}
                          width="36"
                          height="36"
                          alt=""
                        />
                      )}
                      <div className="min-w-0">
                        <p className="m-0 truncate text-[0.92rem] font-semibold text-paper">{session.name}</p>
                        <p className="mt-0.5 mb-0 truncate text-[9px] font-bold uppercase tracking-[.14em] text-paper/60">
                          {session.handle || t.wall.signedIn}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={logout}
                        className="min-h-11 cursor-pointer rounded-full border border-paper/25 px-4 text-[10px] font-bold uppercase tracking-[.12em] text-paper/70 transition-colors hover:border-paper/60 hover:text-paper"
                      >
                        {t.wall.logOut}
                      </button>
                    </div>
                  ) : (
                    <TikTokLoginButton onClick={login} appearance="light" />
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <EventFooter />
    </div>
  )
}
