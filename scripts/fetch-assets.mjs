// Baixa os assets oficiais do site rockstargames.com/VI para assets-src/vi (originais; veja optimize-images.mjs)
// Uso: node scripts/fetch-assets.mjs
import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'assets-src', 'vi')
mkdirSync(outDir, { recursive: true })

const BASE = 'https://www.rockstargames.com/VI/_next/static/media/'
const files = readFileSync(join(root, 'scripts', 'rockstar-media.txt'), 'utf8')
  .split(/\r?\n/).map((s) => s.trim()).filter(Boolean)

const queue = [...files]
let ok = 0
async function worker() {
  while (queue.length) {
    const f = queue.shift()
    const dest = join(outDir, f)
    if (existsSync(dest)) { ok++; continue }
    try {
      const res = await fetch(BASE + encodeURI(f), {
        headers: { 'user-agent': 'Mozilla/5.0', referer: 'https://www.rockstargames.com/VI' },
      })
      if (!res.ok) throw new Error(res.status)
      writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
      ok++
    } catch (e) {
      console.warn('falhou', f, e.message)
    }
  }
}
await Promise.all(Array.from({ length: 8 }, worker))
console.log(`${ok}/${files.length} assets em assets-src/vi`)
