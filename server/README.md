# heaveless server

Express server for the TikTok Login Kit flow. It also serves the static build from `web/dist` in production, so frontend and API live on the same origin.

## 1. TikTok app

1. Create an app at [TikTok for Developers](https://developers.tiktok.com/) and add **Login Kit**.
2. Register this redirect URI exactly:
   - Production: `https://your-domain.com/api/auth/tiktok/callback`
   - Local tunnel: `https://your-tunnel.example/api/auth/tiktok/callback`
3. Request the scopes:
   - `user.info.basic` (avatar, display name)
   - `user.info.profile` (username / handle)
4. Add the legal URLs to the app:
   - Terms of Service: `https://your-domain.com/terms`
   - Privacy Policy: `https://your-domain.com/privacy`

The server requests `user.info.basic` and `user.info.profile` by default. If `user.info.profile` is not approved, edit `SCOPES` and `FIELDS` in `server/index.js` and remove `username,profile_deep_link`. The UI falls back to the display name.

## 2. Environment

Only three variables:

```env
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
SESSION_SECRET=...   # openssl rand -hex 32
```

`PORT` defaults to `8787`; Railway injects its own. The OAuth redirect URI is derived from the request host:

```
https://<host>/api/auth/tiktok/callback
```

Use the same canonical host that you registered in TikTok (apex or `www`, not both). The session cookie is secure automatically when the request is HTTPS.

## 3. Development

```bash
cp server/.env.example server/.env
# fill the three variables
```

```bash
# terminal 1
cd server && npm install && npm run dev

# terminal 2
cd web && npm run dev
```

Vite proxies `/api` to `http://localhost:8787` and preserves the original host, so local requests resolve to `http://localhost:5173/api/auth/tiktok/callback`.

TikTok requires a publicly reachable HTTPS redirect URI. Use a tunnel:

```bash
cloudflared tunnel --url http://localhost:5173
```

Register the tunnel URI as `https://<tunnel>/api/auth/tiktok/callback` in the TikTok app. No extra env var is needed: the redirect is derived from the request host.

Alternative: build the web app and tunnel directly to the API server, which serves `web/dist`:

```bash
cd web && npm run build
cd ../server && npm run dev
cloudflared tunnel --url http://localhost:8787
```

## 4. Production

```bash
cd web && npm run build
cd ../server && npm install && npm start
```

Set the three variables in the hosting provider. The server serves `web/dist` and the API on the same origin, so cookies are first-party. The custom domain must point to this service.

## Endpoints

- `GET /api/auth/tiktok/start` — sets the OAuth state cookie and redirects to TikTok.
- `GET /api/auth/tiktok/callback` — verifies state, exchanges the code server-side, reads the user, sets the session cookie and redirects to `/live`.
- `GET /api/auth/session` — returns the current user or `null`.
- `POST /api/auth/logout` — clears the session cookie.
- `GET /api/health` — health check.

The client secret never reaches the browser. The session is a signed HttpOnly cookie valid for 7 days; the TikTok access token is discarded after reading the profile.
