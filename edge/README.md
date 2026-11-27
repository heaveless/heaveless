# edge

Caddy in front of the two services, so the site and the API share one origin.

```env
PORT=8080
API_UPSTREAM=server.railway.internal:8080
WEB_UPSTREAM=web.railway.internal:3000
```

- `/api` and `/api/*` go to the API, which keeps its own `/api` prefix.
- `/edge_health` answers `ok` for the Railway healthcheck.
- Everything else goes to the web service, including the SPA fallback.
- `auto_https off`: Railway terminates TLS at the edge and forwards plain HTTP to this container.
- `encode zstd gzip` is the only other layer; no rewrites, no header games.

Validate a change with `caddy validate --config Caddyfile`.
