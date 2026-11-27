import { useEffect, useState } from 'preact/hooks'
import { tiktokAuth, type SessionUser } from './api'

export type AuthNotice = 'error' | 'missing' | ''

const NOTICES: Record<string, AuthNotice> = { error: 'error', missing: 'missing' }

function noticeFromUrl(): AuthNotice {
  const params = new URLSearchParams(window.location.search)
  const notice = NOTICES[params.get('auth') ?? ''] ?? ''
  if (params.has('auth')) {
    params.delete('auth')
    const query = params.toString()
    const next = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    window.history.replaceState({}, '', next)
  }
  return notice
}

export function useTikTokSession() {
  const [session, setSession] = useState<SessionUser | null>(null)
  const [authNotice, setAuthNotice] = useState<AuthNotice>('')

  useEffect(() => {
    setAuthNotice(noticeFromUrl())
  }, [])

  useEffect(() => {
    let active = true
    void tiktokAuth.session().then(data => {
      if (active) setSession(data?.user ?? null)
    })
    return () => {
      active = false
    }
  }, [])

  const logout = async () => {
    await tiktokAuth.logout()
    setSession(null)
  }

  return { session, authNotice, login: tiktokAuth.start, logout }
}
