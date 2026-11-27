import { createApp } from './app.js'
import { config, reportConfig } from './config.js'
import { createTikTok } from './tiktok.js'

reportConfig()

const app = createApp({ config, tiktok: createTikTok(config.tiktok) })

app.listen(config.port, () => {
  console.log(`[server] listening on http://localhost:${config.port}`)
  console.log(`[server] OAuth callback path: ${config.callbackPath}`)
})
