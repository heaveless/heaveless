import { clearCookie, readSignedCookie, writeSignedCookie } from './cookies.js'

export const SESSION_COOKIE = 'hl_session'
export const STATE_COOKIE = 'hl_oauth_state'

const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url')

const decode = value => {
  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'))
  } catch {
    return null
  }
}

const asText = value => (typeof value === 'string' ? value : '')

export function readSession(req, secret) {
  const raw = readSignedCookie(req, SESSION_COOKIE, secret)
  const data = raw ? decode(raw) : null
  if (!data || typeof data.expiresAt !== 'number' || data.expiresAt < Date.now()) return null
  return { name: asText(data.name), handle: asText(data.handle), avatar: asText(data.avatar) }
}

export function writeSession(req, res, user, { secret, ttl }) {
  const value = encode({ ...user, expiresAt: Date.now() + ttl })
  writeSignedCookie(req, res, SESSION_COOKIE, value, { secret, maxAge: ttl })
}

export function clearSession(req, res) {
  clearCookie(req, res, SESSION_COOKIE)
}

export function readOAuthState(req, secret) {
  return readSignedCookie(req, STATE_COOKIE, secret)
}

export function writeOAuthState(req, res, state, { secret, ttl }) {
  writeSignedCookie(req, res, STATE_COOKIE, state, { secret, maxAge: ttl })
}

export function clearOAuthState(req, res) {
  clearCookie(req, res, STATE_COOKIE)
}
