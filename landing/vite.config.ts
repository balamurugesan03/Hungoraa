import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const page = (file: string) => fileURLToPath(new URL(file, import.meta.url))

/** Serve the clean page URLs (/how-it-works, /features, /partner) from their .html files in dev and preview (nginx does the same via try_files). */
const cleanUrls = (): Plugin => {
  const rewrite = (req: { url?: string }, _res: unknown, next: () => void) => {
    const m = req.url?.match(/^\/(how-it-works|features|partner)(?=[?#]|$)/)
    if (m) req.url = req.url!.replace(m[0], `${m[0]}.html`)
    next()
  }
  return {
    name: 'clean-urls',
    configureServer: (server) => void server.middlewares.use(rewrite),
    configurePreviewServer: (server) => void server.middlewares.use(rewrite),
  }
}

export default defineConfig({
  plugins: [react(), cleanUrls()],
  server: {
    port: 5180,
  },
  build: {
    rollupOptions: {
      input: {
        main: page('./index.html'),
        howItWorks: page('./how-it-works.html'),
        features: page('./features.html'),
        partner: page('./partner.html'),
      },
    },
  },
})
