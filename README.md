# heaveless

Two services, one repo.

| Path | Stack | Deploy |
|---|---|---|
| `web/` | Preact 10 + Vite + Tailwind 4, static build served by `web/server.mjs` | Railway service, root `web` |
| `server/` | Rust, Axum + sqlx | Railway service, root `server`, Dockerfile |

The API owns the TikTok login and the supporters wall, and stores both in Postgres. The web app is
pure frontend: it builds to `dist/` and talks to `VITE_API_URL`.

## Local

```bash
# api (needs a local Postgres)
createdb heaveless
cd server && cp .env.example .env && cargo run

# web
cd web && cp .env.example .env && npm install && npm run dev
```

Vite proxies `/api` to `http://localhost:8080`, so the dev flow works without `VITE_API_URL`.
In production `VITE_API_URL` points at the API origin.

## Deploy

1. `web`: root directory `web`, build `npm ci && npm run build`, start `npm start`, env `VITE_API_URL`.
2. `server`: root directory `server`, Dockerfile build, env in `server/README.md`.
3. Add the Postgres plugin to the API service and set `DATABASE_URL`.

Domains: `heaveless.com` for the web service, `api.heaveless.com` for the API. Both are the same
registrable domain, so the session cookie stays first-party. Register
`https://api.heaveless.com/api/auth/tiktok/callback` in the TikTok app.
