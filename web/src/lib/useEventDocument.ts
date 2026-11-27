import { useEffect } from 'preact/hooks'
import type { EventCopy, Lang } from '../data/event'

const PINE = '#041d15'
const PAPER = '#fbf8ee'

const meta = (name: string) => document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)

export function useEventDocument(lang: Lang, t: EventCopy) {
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    const themeColor = meta('theme-color')
    const before = {
      content: themeColor?.getAttribute('content') ?? null,
      scheme: root.style.colorScheme,
      background: body.style.backgroundColor,
      color: body.style.color,
    }

    themeColor?.setAttribute('content', PINE)
    root.style.colorScheme = 'dark'
    body.style.backgroundColor = PINE
    body.style.color = PAPER

    return () => {
      if (before.content) themeColor?.setAttribute('content', before.content)
      root.style.colorScheme = before.scheme
      body.style.backgroundColor = before.background
      body.style.color = before.color
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const description = meta('description')
    const before = {
      lang: root.lang,
      title: document.title,
      description: description?.getAttribute('content') ?? null,
    }

    root.lang = lang
    document.title = t.meta.title
    description?.setAttribute('content', t.meta.description)

    return () => {
      root.lang = before.lang
      document.title = before.title
      if (before.description !== null) description?.setAttribute('content', before.description)
    }
  }, [lang, t])
}
