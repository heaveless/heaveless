# heaveless api

Rust (Axum) service for the TikTok login and the supporters wall. Postgres holds the data.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | liveness for Railway |
| GET | `/api/auth/session` | current user or `null` |
| GET | `/api/auth/tiktok/start` | sets the OAuth state cookie and redirects to TikTok |
| GET | `/api/auth/tiktok/callback` | verifies state, exchanges the code, upserts the supporter, opens a session, redirects to `WEB_ORIGIN/event#wall` |
| POST | `/api/auth/logout` | deletes the session row and clears the cookie |
| GET | `/api/supporters` | the wall, oldest first |

## Environment

```env
PORT=8080
DATABASE_URL=postgres://...
SESSION_SECRET=openssl rand -hex 32
PUBLIC_URL=https://heaveless.com
WEB_ORIGIN=https://heaveless.com
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
SESSION_TTL_DAYS=7
```

Every variable is required: the service exits at boot naming the one that is missing or malformed.
`PUBLIC_URL` and `WEB_ORIGIN` must be bare origins, with no path, or the boot fails too.

`PUBLIC_URL` is the origin the browser sees, which behind the edge is the site itself: it builds the
`redirect_uri` TikTok must have on file, `<PUBLIC_URL>/api/auth/tiktok/callback`, and the place the
callback sends the browser back to. `WEB_ORIGIN` is the only origin CORS allows; in production it is
the same origin, so CORS never fires.

## Data

`supporters` is one row per TikTok account that has ever logged in, keyed by `tiktok_open_id`.
`sessions` is one row per open session: the cookie only carries a random 32-byte id, signed with
`SESSION_SECRET`; revoking a session is a `delete`. Expired rows are purged on boot.

Migrations live in `migrations/` and run on startup with `sqlx::migrate!`.

## Local

```bash
createdb heaveless
cp .env.example .env
cargo run
```

## Deploy (Railway)

The service builds from `server/Dockerfile`, listens on `PORT` and stays private: the Caddy service
in `edge/` is the only one with a public domain and forwards `/api*` here.

1. Add a Postgres plugin and copy its `DATABASE_URL` into the service.
2. Set the environment above with `PUBLIC_URL=https://heaveless.com` and `PORT=8080`.
3. Register `https://heaveless.com/api/auth/tiktok/callback` in the TikTok app.

The web page and the API share the origin, so the session cookie is first-party and `SameSite=Lax`
is enough.
