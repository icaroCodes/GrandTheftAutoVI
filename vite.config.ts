import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * Troca %SITE_URL% no index.html pela URL pública (as tags Open Graph precisam de URL absoluta).
 * Ordem: SITE_URL do .env local, senão o domínio de produção que a Vercel expõe no build.
 */
function siteUrl(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), '')
  const url = env.SITE_URL || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  return { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', url.replace(/\/$/, '')) }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), siteUrl(mode)],
  // react + gsap + framer-motion juntos passam um pouco de 500 kB (≈180 kB gzip)
  build: { chunkSizeWarningLimit: 700 },
}))
