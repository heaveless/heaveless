export interface SessionUser {
  name: string
  handle: string
  avatar: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(path, { credentials: 'same-origin', ...init })
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}

export const tiktokAuth = {
  start: () => window.location.assign('/api/auth/tiktok/start'),
  logout: () => request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
  session: () => request<{ user: SessionUser | null }>('/api/auth/session'),
}
