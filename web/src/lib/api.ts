const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

export const apiUrl = (path: string) => `${BASE}${path}`

export interface SessionUser {
  id: string
  name: string
  avatar: string
}

export interface Supporter {
  id: string
  name: string
  avatar: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(apiUrl(path), { credentials: 'include', ...init })
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}

export const tiktokAuth = {
  start: () => window.location.assign(apiUrl('/api/auth/tiktok/start')),
  logout: () => request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
  session: () => request<{ user: SessionUser | null }>('/api/auth/session'),
  supporters: () => request<Supporter[]>('/api/supporters'),
}
