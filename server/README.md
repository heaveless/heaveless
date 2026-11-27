# heaveless api

Rust (Axum) service for the TikTok login and the supporters wall. Postgres holds the data.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | liveness for Railway |
| GET | `/api/auth/session` | current user or `null` |
| GET | `/api/auth/tiktok/start` | sets the OAuth state cookie and redirects to TikTok |
| GET | `/api/auth/tiktok/callback` | verifies state, exchanges the code, upserts the supporter, opens a session, redirects to `WEB_ORIGIN/event#wall` |
| POST | `/api/auth/logout` | deletes the session row and clears the cookie |
| GET | `/api/supporters` | the wall, oldest first |

## Environment

```env
DATABASE_URL=postgres://...
SESSION_SECRET=openssl rand -hex 32
PUBLIC_URL=https://api.heaveless.com
WEB_ORIGIN=https://heaveless.com
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
SESSION_TTL_DAYS=7
```

`PUBLIC_URL` builds the `redirect_uri` TikTok must have on file: `<PUBLIC_URL>/api/auth/tiktok/callback`.
`WEB_ORIGIN` is the only origin allowed by CORS and the place the callback sends the browser back to.

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

The service builds from `server/Dockerfile` and exposes `PORT`.

1. Add a Postgres plugin to the project and copy its `DATABASE_URL` into the service.
2. Set the environment above, with `PUBLIC_URL` on the API domain (`https://api.heaveless.com`).
3. Point a domain at the service and register `<PUBLIC_URL>/api/auth/tiktok/callback` in the TikTok app.

The API and the web app are the same registrable domain (`api.heaveless.com` and `heaveless.com`), so
the session cookie stays `SameSite=Lax` and same-site requests carry it without third-party cookie
exceptions.
