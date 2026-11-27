import { useState } from 'preact/hooks'
import { eventCopy, type Lang } from '../data/event'
import { useTikTokSession } from '../lib/useTikTokSession'
import { useSupporters } from '../lib/useSupporters'
import { useEventDocument } from '../lib/useEventDocument'
import { LangContext, rememberLang, storedLang, useLang } from '../components/event/lang'
import { EventHeader } from '../components/event/EventHeader'
import { EventFooter } from '../components/event/EventFooter'
import { Hero } from '../components/event/Hero'
import { CountdownStrip } from '../components/event/CountdownStrip'
import { EventPlan } from '../components/event/EventPlan'
import { GiftCards } from '../components/event/GiftCards'
import { EventNote } from '../components/event/EventNote'
import { SupportersWall } from '../components/event/SupportersWall'
import { SnowLine, PAPER_START_ID } from '../components/event/SnowLine'
import { Snowfall } from '../components/event/Snow'

export function EventPage() {
  const [lang, setLang] = useState<Lang>(storedLang)

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
  const supporters = useSupporters()
  useEventDocument(lang, t)

  return (
    <div className="event-page relative min-h-[100dvh] overflow-x-clip">
      <Snowfall />
      <EventHeader />

      <main id="main-content">
        <Hero />

        <div className="relative bg-paper text-forest" id={PAPER_START_ID}>
          <SnowLine />
          <CountdownStrip />
          <EventPlan />
          <GiftCards />
          <EventNote />
          <SupportersWall
            supporters={supporters}
            session={session}
            authNotice={authNotice}
            onLogin={login}
            onLogout={logout}
          />
        </div>
      </main>

      <EventFooter />
    </div>
  )
}
