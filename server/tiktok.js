const AUTHORIZE_URL = 'https://www.tiktok.com/v2/auth/authorize/'
const TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/'
const USER_INFO_URL = 'https://open.tiktokapis.com/v2/user/info/'

export class TikTokError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'TikTokError'
    this.status = status
  }
}

async function readJson(response) {
  return response.json().catch(() => null)
}

export function createTikTok({ clientKey, clientSecret, scope, fields }) {
  const configured = Boolean(clientKey && clientSecret)

  return {
    configured,

    authorizeUrl({ redirectUri, state }) {
      const url = new URL(AUTHORIZE_URL)
      url.searchParams.set('client_key', clientKey)
      url.searchParams.set('scope', scope)
      url.searchParams.set('response_type', 'code')
      url.searchParams.set('redirect_uri', redirectUri)
      url.searchParams.set('state', state)
      return url.toString()
    },

    async exchangeCode({ code, redirectUri }) {
      const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_key: clientKey,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      })
      const body = await readJson(response)
      if (!response.ok || !body?.access_token) {
        const reason = body?.error_description || body?.error || 'unknown error'
        throw new TikTokError(`token exchange failed (${response.status}): ${reason}`, response.status)
      }
      return body.access_token
    },

    async profile(accessToken) {
      const url = new URL(USER_INFO_URL)
      url.searchParams.set('fields', fields.join(','))
      const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      const body = await readJson(response)
      const user = body?.data?.user
      if (!response.ok || !user) {
        throw new TikTokError(`user info failed (${response.status})`, response.status)
      }
      return { name: user.display_name?.trim() || 'TikTok user', avatar: user.avatar_url || '' }
    },
  }
}
