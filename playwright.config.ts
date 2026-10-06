import { defineConfig, devices } from '@playwright/test'

// Localmente usa o Edge instalado (sem baixar navegador). No CI, rode `npx playwright install chromium` antes.
const channel = process.env.CI ? undefined : 'msedge'

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://localhost:4173', channel },
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel } },
  ],
})
