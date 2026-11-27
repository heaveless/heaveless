import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { eventCopy, type EventCopy, type Lang } from '../../data/event'

export interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
  t: EventCopy
}

export const LangContext = createContext<LangState>({
  lang: 'en',
  setLang: () => {},
  t: eventCopy.en,
})

export const useLang = () => useContext(LangContext)

const STORAGE_KEY = 'heaveless-event-lang'

const storage = () => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export const storedLang = (): Lang => (storage()?.getItem(STORAGE_KEY) === 'es' ? 'es' : 'en')

export const rememberLang = (lang: Lang) => {
  storage()?.setItem(STORAGE_KEY, lang)
}
