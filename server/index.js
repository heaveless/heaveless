import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.set('trust proxy', 1)
app.disable('x-powered-by')

const PORT = Number(process.env.PORT || 8787)
const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || ''
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || ''
const SCOPES = 'user.info.basic'
const FIELDS = 'open_id,union_id,avatar_url,display_name'
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex')
const SESSION_COOKIE = 'hl_session'
const STATE_COOKIE = 'hl_oauth_state'
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000
// Where the login flow lands. The wall is the only place with a login button,
// so the callback returns the reader to it. /live stays as a forwarded alias.
const RETURN_TO = '/event#wall'
const STATE_TTL = 10 * 60 * 1000

const TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/'
const USER_INFO_URL = 'https://open.tiktokapis.com/v2/user/info/'
const AUTHORIZE_URL = 'https://www.tiktok.com/v2/auth/authorize/'

if (!process.env.SESSION_SECRET) {
  console.warn('[auth] SESSION_SECRET is not set. Using an ephemeral secret; sessions reset on restart.')
}
if (!CLIENT_KEY || !CLIENT_SECRET) {
  console.warn('[auth] TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET are missing. Login will report "missing".')
}

function requestOrigin(req) {
  const host = req.get('host') || `localhost:${PORT}`
  return `${req.protocol}://${host}`
}

function redirectUri(req) {
  return `${requestOrigin(req)}/api/auth/tiktok/callback`
}

function isSecure(req) {
  return requestOrigin(req).startsWith('https://')
}

function readCookies(req) {
  const header = req.headers.cookie
  if (!header) return {}
  return header.split(';').reduce((cookies, pair) => {
    const separator = pair.indexOf('=')
    if (separator === -1) return cookies
    const name = pair.slice(0, separator).trim()
    if (!name) return cookies
    try {
      cookies[name] = decodeURIComponent(pair.slice(separator + 1).trim())
    } catch {
      cookies[name] = pair.slice(separator + 1).trim()
    }
    return cookies
  }, {})
}

function sign(value) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('base64url')
}

function safeEqual(left, right) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

function encodeSession(user) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + SESSION_TTL })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

function decodeSession(value) {
  if (typeof value !== 'string') return null
  const separator = value.lastIndexOf('.')
  if (separator < 1) return null
  const payload = value.slice(0, separator)
  const signature = value.slice(separator + 1)
  if (!safeEqual(signature, sign(payload))) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (!data.exp || data.exp < Date.now()) return null
    return {
      name: typeof data.name === 'string' ? data.name : '',
      handle: typeof data.handle === 'string' ? data.handle : '',
      avatar: typeof data.avatar === 'string' ? data.avatar : '',
    }
  } catch {
    return null
  }
}

function sessionFrom(req) {
  return decodeSession(readCookies(req)[SESSION_COOKIE])
}

function cookieOptions(req, maxAge) {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecure(req),
    path: '/',
    maxAge,
  }
}

function setSession(req, res, user) {
  res.cookie(SESSION_COOKIE, encodeSession(user), cookieOptions(req, SESSION_TTL))
}

function clearSession(req, res) {
  res.clearCookie(SESSION_COOKIE, cookieOptions(req, 0))
}

async function fetchTikTokUser(accessToken, fields) {
  const url = new URL(USER_INFO_URL)
  url.searchParams.set('fields', fields)
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const body = await response.json().catch(() => null)
  if (!response.ok || !body?.data?.user) {
    console.warn('[auth] TikTok user info failed:', response.status, body?.error?.message || 'unknown error')
    return null
  }
  return body.data.user
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/auth/session', (req, res) => {
  res.set('Cache-Control', 'no-store')
  res.json({ user: sessionFrom(req) })
})

app.get('/api/auth/tiktok/start', (req, res) => {
  if (!CLIENT_KEY || !CLIENT_SECRET) {
    return res.redirect(`${requestOrigin(req)}/event?auth=missing`)
  }

  const state = crypto.randomBytes(24).toString('hex')
  res.cookie(STATE_COOKIE, state, cookieOptions(req, STATE_TTL))

  const authorize = new URL(AUTHORIZE_URL)
  authorize.searchParams.set('client_key', CLIENT_KEY)
  authorize.searchParams.set('scope', SCOPES)
  authorize.searchParams.set('response_type', 'code')
  authorize.searchParams.set('redirect_uri', redirectUri(req))
  authorize.searchParams.set('state', state)

  res.redirect(authorize.toString())
})

app.get('/api/auth/tiktok/callback', async (req, res) => {
  const cookies = readCookies(req)
  const expectedState = cookies[STATE_COOKIE]
  res.clearCookie(STATE_COOKIE, cookieOptions(req, 0))

  const code = typeof req.query.code === 'string' ? req.query.code : ''
  const state = typeof req.query.state === 'string' ? req.query.state : ''
  const oauthError = typeof req.query.error === 'string' ? req.query.error : ''

  if (!CLIENT_KEY || !CLIENT_SECRET) {
    return res.redirect(`${requestOrigin(req)}/event?auth=missing`)
  }

  if (oauthError) {
    const description = typeof req.query.error_description === 'string' ? req.query.error_description : ''
    console.warn('[auth] TikTok authorize returned:', oauthError, description)
  }

  if (oauthError || !code || !state || !expectedState || !safeEqual(state, expectedState)) {
    return res.redirect(`${requestOrigin(req)}/event?auth=error`)
  }

  try {
    const tokenResponse = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri(req),
      }),
    })
    const token = await tokenResponse.json().catch(() => null)
    if (!tokenResponse.ok || !token?.access_token) {
      throw new Error(`token exchange failed (${tokenResponse.status}): ${token?.error_description || token?.error || 'unknown'}`)
    }

    const user = await fetchTikTokUser(token.access_token, FIELDS)
    if (!user) throw new Error('TikTok user info unavailable')

    const displayName = typeof user.display_name === 'string' ? user.display_name.trim() : ''
    const avatar = user.avatar_url || user.avatar_url_100 || user.avatar_large_url || ''

    setSession(req, res, {
      name: displayName || 'TikTok user',
      handle: '',
      avatar,
    })

    res.redirect(`${requestOrigin(req)}${RETURN_TO}`)
  } catch (error) {
    console.error('[auth] TikTok callback failed:', error instanceof Error ? error.message : error)
    res.redirect(`${requestOrigin(req)}/event?auth=error`)
  }
})

app.post('/api/auth/logout', (req, res) => {
  clearSession(req, res)
  res.json({ ok: true })
})

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'not_found' })
})

const dist = path.join(__dirname, '..', 'web', 'dist')
if (fs.existsSync(path.join(dist, 'index.html'))) {
  app.use(express.static(dist))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    res.sendFile(path.join(dist, 'index.html'))
  })
} else {
  app.get('/', (_req, res) => {
    res.type('text/plain').send('heaveless API. Build the web app to serve the site from here.')
  })
}

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`)
  console.log('[server] OAuth callback path: /api/auth/tiktok/callback')
})
