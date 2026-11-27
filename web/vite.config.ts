import { defineConfig, loadEnv } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const { VITE_API_URL } = loadEnv(mode, process.cwd(), '')

  if (!VITE_API_URL) {
    throw new Error('VITE_API_URL is required. Copy .env.example to .env.')
  }

  return {
    plugins: [preact(), tailwindcss()],
    define: { __API_URL__: JSON.stringify(VITE_API_URL.replace(/\/+$/, '')) },
  }
})
