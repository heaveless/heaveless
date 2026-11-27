import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import {
  clearOAuthState,
  clearSession,
  readOAuthState,
  readSession,
  writeOAuthState,
  writeSession,
} from './session.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(here, '..', 'web', 'dist')

const origin = req => `${req.protocol}://${req.get('host')}`

const digest = value => crypto.createHash('sha256').update(value).digest()

function sameState(received, expected) {
  if (!received || !expected) return false
  return crypto.timingSafeEqual(digest(received), digest(expected))
}

function apiRouter({ config, tiktok }) {
  const router = express.Router()
  const session = { secret: config.sessionSecret }
  const sessionCookie = { secret: config.sessionSecret, ttl: config.sessionTtl }
  const stateCookie = { secret: config.sessionSecret, ttl: config.stateTtl }
  const fail = (req, res, reason) => res.redirect(`${origin(req)}/event?auth=${reason}`)

  router.get('/health', (_req, res) => res.json({ ok: true }))

  router.get('/auth/session', (req, res) => {
    res.set('Cache-Control', 'no-store')
    res.json({ user: readSession(req, session.secret) })
  })

  router.get('/auth/tiktok/start', (req, res) => {
    if (!tiktok.configured) return fail(req, res, 'missing')

    const state = crypto.randomBytes(24).toString('hex')
    const redirectUri = `${origin(req)}${config.callbackPath}`
    writeOAuthState(req, res, state, stateCookie)
    res.redirect(tiktok.authorizeUrl({ redirectUri, state }))
  })

  router.get('/auth/tiktok/callback', async (req, res) => {
    const expectedState = readOAuthState(req, session.secret)
    clearOAuthState(req, res)

    if (!tiktok.configured) return fail(req, res, 'missing')

    const { code = '', state = '', error = '', error_description: description = '' } = req.query

    if (error) console.warn('[auth] TikTok authorize returned:', error, description)

    if (error || !code || !sameState(state, expectedState)) return fail(req, res, 'error')

    try {
      const redirectUri = `${origin(req)}${config.callbackPath}`
      const accessToken = await tiktok.exchangeCode({ code, redirectUri })
      const profile = await tiktok.profile(accessToken)
      writeSession(req, res, { ...profile, handle: '' }, sessionCookie)
      res.redirect(`${origin(req)}${config.returnTo}`)
    } catch (cause) {
      console.error('[auth] TikTok callback failed:', cause instanceof Error ? cause.message : cause)
      fail(req, res, 'error')
    }
  })

  router.post('/auth/logout', (req, res) => {
    clearSession(req, res)
    res.json({ ok: true })
  })

  router.use((_req, res) => res.status(404).json({ error: 'not_found' }))

  return router
}

function siteRouter() {
  const router = express.Router()
  const index = path.join(dist, 'index.html')

  if (fs.existsSync(index)) {
    router.use(express.static(dist))
    router.get('*', (_req, res) => res.sendFile(index))
    return router
  }

  router.get('/', (_req, res) => {
    res.type('text/plain').send('heaveless API. Build the web app to serve the site from here.')
  })
  return router
}

export function createApp({ config, tiktok }) {
  const app = express()
  app.set('trust proxy', 1)
  app.disable('x-powered-by')
  app.use('/api', apiRouter({ config, tiktok }))
  app.use(siteRouter())
  return app
}
