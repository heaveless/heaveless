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

If `user.info.profile` is not approved, set `TIKTOK_SCOPES=user.info.basic` and remove `username,profile_deep_link` from `TIKTOK_FIELDS`. The UI falls back to the display name.

## 2. Environment

```bash
cp server/.env.example server/.env
```

Fill `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` and `SESSION_SECRET` (`openssl rand -hex 32`).

`PUBLIC_ORIGIN` is the origin of the site. In production it must be the public HTTPS origin; the callback redirect and the session cookie use it.

## 3. Development

```bash
# terminal 1
cd server && npm install && npm run dev

# terminal 2
cd web && npm run dev
```

Vite proxies `/api` to `http://localhost:8787`.

TikTok requires a publicly reachable redirect URI for the OAuth callback. Use a tunnel:

```bash
# point the tunnel to the Vite dev server
cloudflared tunnel --url http://localhost:5173
```

Then set `PUBLIC_ORIGIN` to the tunnel URL and `TIKTOK_REDIRECT_URI` to `${PUBLIC_ORIGIN}/api/auth/tiktok/callback`, and register that URI in the TikTok app.

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

Set the same variables in the hosting provider. The server serves `web/dist` and the API on the same origin, so cookies are first-party.

## Endpoints

- `GET /api/auth/tiktok/start` — sets the OAuth state cookie and redirects to TikTok.
- `GET /api/auth/tiktok/callback` — verifies state, exchanges the code server-side, reads the user, sets the session cookie and redirects to `/live`.
- `GET /api/auth/session` — returns the current user or `null`.
- `POST /api/auth/logout` — clears the session cookie.
- `GET /api/health` — health check.

The client secret never reaches the browser. The session is a signed HttpOnly cookie valid for 7 days; the TikTok access token is discarded after reading the profile.
