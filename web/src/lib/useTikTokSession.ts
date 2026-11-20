import { useEffect, useState } from 'preact/hooks'

export interface SessionUser {
  name: string
  handle: string
  avatar: string
}

const AUTH_ERROR = 'TikTok login failed. Try again.'
const AUTH_MISSING = 'TikTok login is not configured yet.'

export function useTikTokSession() {
  const [session, setSession] = useState<SessionUser | null>(null)
  const [authNotice, setAuthNotice] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/auth/session', { credentials: 'same-origin' })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (!cancelled) setSession(data?.user ?? null)
      })
      .catch(() => {
        // The login button still works; the API may not be running yet.
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const auth = params.get('auth')
    if (auth === 'error') setAuthNotice(AUTH_ERROR)
    if (auth === 'missing') setAuthNotice(AUTH_MISSING)
    if (auth) {
      params.delete('auth')
      const query = params.toString()
      window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`)
    }
  }, [])

  const login = () => {
    window.location.assign('/api/auth/tiktok/start')
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    } catch {
      // Clear the local session even if the request fails.
    }
    setSession(null)
  }

  return { session, authNotice, login, logout }
}
