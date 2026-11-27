import { parseCookie, stringifySetCookie } from 'cookie'
import signature from 'cookie-signature'

const PREFIX = 's:'

const attributes = req => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: req.secure,
  path: '/',
})

function append(res, name, value, options) {
  res.append('Set-Cookie', stringifySetCookie({ name, value, ...options }))
}

export function readCookie(req, name) {
  if (!req.headers.cookie) return ''
  return parseCookie(req.headers.cookie)[name] ?? ''
}

export function readSignedCookie(req, name, secret) {
  const value = readCookie(req, name)
  if (!value.startsWith(PREFIX)) return ''
  const unsigned = signature.unsign(value.slice(PREFIX.length), secret)
  return typeof unsigned === 'string' ? unsigned : ''
}

export function writeSignedCookie(req, res, name, value, { secret, maxAge }) {
  const signed = PREFIX + signature.sign(value, secret)
  append(res, name, signed, { ...attributes(req), maxAge: Math.floor(maxAge / 1000) })
}

export function clearCookie(req, res, name) {
  append(res, name, '', { ...attributes(req), maxAge: 0 })
}
