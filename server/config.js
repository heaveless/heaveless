import crypto from 'node:crypto'

const env = (name, fallback = '') => process.env[name] ?? fallback

export const config = {
  port: Number(env('PORT', '8787')),
  sessionSecret: env('SESSION_SECRET') || crypto.randomBytes(32).toString('hex'),
  sessionTtl: 7 * 24 * 60 * 60 * 1000,
  stateTtl: 10 * 60 * 1000,
  returnTo: '/event#wall',
  callbackPath: '/api/auth/tiktok/callback',
  tiktok: {
    clientKey: env('TIKTOK_CLIENT_KEY'),
    clientSecret: env('TIKTOK_CLIENT_SECRET'),
    scope: 'user.info.basic',
    fields: ['open_id', 'union_id', 'avatar_url', 'display_name'],
  },
}

export const tiktokConfigured = Boolean(config.tiktok.clientKey && config.tiktok.clientSecret)

export function reportConfig() {
  if (!process.env.SESSION_SECRET) {
    console.warn('[auth] SESSION_SECRET is not set. Sessions will reset on restart.')
  }
  if (!tiktokConfigured) {
    console.warn('[auth] TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET are missing. Login will report "missing".')
  }
}
