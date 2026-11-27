# heaveless

Three services, one repo, one origin.

| Path | Stack | Role |
|---|---|---|
| `web/` | Preact 10 + Vite + Tailwind 4 | builds to `dist/`, served by `web/server.mjs` |
| `server/` | Rust, Axum + sqlx + Postgres | TikTok login, sessions, supporters |
| `edge/` | Caddy | `heaveless.com`: `/api*` to the API, everything else to the web |

```
heaveless.com
└── edge (caddy)
    ├── /api*  → server.railway.internal:8080
    └── /*     → web.railway.internal:3000
```

One origin means the session cookie is first-party, the browser never makes a cross-origin call in
production, and the TikTok redirect URI stays `https://heaveless.com/api/auth/tiktok/callback`.

## Local

```bash
# 1. api (needs Postgres)
createdb heaveless
cd server && cp .env.example .env && cargo run

# 2. web
cd web && cp .env.example .env && npm install && npm run dev

# 3. optional, the same routing as production
cd edge && PORT=8081 API_UPSTREAM=127.0.0.1:8080 WEB_UPSTREAM=127.0.0.1:5173 \
  caddy run --config Caddyfile
```

Every value comes from the environment and is required: the API exits naming the missing variable,
and the web build fails without `VITE_API_URL`. No defaults.

## Deploy

| Service | Root | Build | Start | Health |
|---|---|---|---|---|
| `edge` | `edge` | Dockerfile | Caddy | `/edge_health` |
| `server` | `server` | Dockerfile | `api` | `/api/health` |
| `web` | `web` | `npm ci && npm run build` | `npm start` | `/healthz` |

1. Postgres plugin attached to the `server` service.
2. `heaveless.com` points at `edge`. The other two stay private.
3. `edge`: `API_UPSTREAM=server.railway.internal:8080`, `WEB_UPSTREAM=web.railway.internal:3000`.
4. `server`: `PUBLIC_URL=https://heaveless.com`, `WEB_ORIGIN=https://heaveless.com`, `PORT=8080`.
5. `web`: `VITE_API_URL=https://heaveless.com`, `PORT=3000`.
6. TikTok app: redirect `https://heaveless.com/api/auth/tiktok/callback`.
