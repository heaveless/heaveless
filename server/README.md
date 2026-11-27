# heaveless server

Express server for the TikTok Login Kit flow. It also serves the static build from `web/dist` in production, so frontend and API live on the same origin.

## 1. TikTok app

1. Create an app at [TikTok for Developers](https://developers.tiktok.com/) and add **Login Kit**.
2. Register this redirect URI exactly:
   - Production: `https://your-domain.com/api/auth/tiktok/callback`
   - Local tunnel: `https://your-tunnel.example/api/auth/tiktok/callback`
3. Request the scope:
   - `user.info.basic` (display name and avatar)
4. Add the legal URLs to the app:
   - Terms of Service: `https://your-domain.com/terms`
   - Privacy Policy: `https://your-domain.com/privacy`

The server requests `user.info.basic` only. The supporters board uses the TikTok display name and avatar; no username scope is requested.

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

From the repository root:

```bash
npm run build
npm start
```

On Railway:

- **Root Directory:** repository root, not `web/` or `server/`.
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Variables:** only the three above.
- The custom domain must point to this service.

`railway.toml` and `start.sh` are included for this setup. The server serves `web/dist` and the API on the same origin, so cookies are first-party.

## Endpoints

- `GET /api/auth/tiktok/start` — sets the OAuth state cookie and redirects to TikTok.
- `GET /api/auth/tiktok/callback` — verifies state, exchanges the code server-side, reads the user, sets the session cookie and redirects to `/event#wall`. `/live` is still routed as an alias that forwards to `/event`.
- `GET /api/auth/session` — returns the current user or `null`.
- `POST /api/auth/logout` — clears the session cookie.
- `GET /api/health` — health check.

The client secret never reaches the browser. The session is a signed HttpOnly cookie valid for 7 days; the TikTok access token is discarded after reading the profile.
