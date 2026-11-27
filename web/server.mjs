import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import sirv from 'sirv'

const dist = fileURLToPath(new URL('./dist', import.meta.url))

const serve = sirv(dist, {
  single: true,
  etag: true,
  maxAge: 0,
  setHeaders: (response, pathname) => {
    if (pathname.startsWith('/assets/')) {
      response.setHeader('cache-control', 'public, max-age=31536000, immutable')
    }
  },
})

const server = createServer((request, response) => {
  if (request.url === '/healthz') {
    response.writeHead(200, { 'content-type': 'application/json' })
    response.end('{"ok":true}')
    return
  }

  serve(request, response)
})

const port = Number(process.env.PORT ?? 3000)
server.listen(port, '0.0.0.0', () => console.log(`heaveless web on ${port}`))
