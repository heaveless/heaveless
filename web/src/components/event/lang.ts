import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { eventCopy, type EventCopy, type Lang } from '../../data/event'

export interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
  t: EventCopy
}

/** The event page is the only bilingual surface on the site. */
export const LangContext = createContext<LangState>({
  lang: 'en',
  setLang: () => {},
  t: eventCopy.en,
})

export const useLang = () => useContext(LangContext)

const STORAGE_KEY = 'heaveless-event-lang'

export const storedLang = (): Lang => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'es' ? 'es' : 'en'
  } catch {
    return 'en'
  }
}

export const rememberLang = (lang: Lang) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    /* private mode: the switch still works for this visit */
  }
}
