// Gera as variantes leves usadas nos modos "médio" e "leve" (detectados no loading)
// a partir dos arquivos já extraídos, sem internet.
// Uso: node scripts/derive-light.mjs   (rode depois de extract-media.mjs)
import { spawnSync } from 'node:child_process'
import { mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const media = join(root, 'public', 'media')

function run(args) {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })
  if (r.status !== 0) throw new Error('ffmpeg falhou: ' + args.join(' '))
}

/** Sequência de frames reduzida (mesma contagem, resolução e qualidade menores). */
function smallFrames(name, width, quality) {
  const src = join(media, 'frames', name)
  const dest = join(media, 'frames', `${name}-sm`)
  if (existsSync(dest)) rmSync(dest, { recursive: true })
  mkdirSync(dest, { recursive: true })
  for (const f of readdirSync(src)) {
    run(['-i', join(src, f), '-vf', `scale=${width}:-2:flags=lanczos`, '-c:v', 'libwebp', '-quality', String(quality), join(dest, f)])
  }
  console.log(`frames/${name}-sm: ${readdirSync(dest).length} frames`)
}

/** Imagem estática de um vídeo (substitui o vídeo no modo leve). */
function poster(name, time, width) {
  run(['-ss', String(time), '-i', join(media, 'video', `${name}.mp4`), '-frames:v', '1', '-vf', `scale=${width}:-2`, '-c:v', 'libwebp', '-quality', '78', join(media, 'video', `${name}.webp`)])
  console.log(`video/${name}.webp`)
}

/**
 * Capa do hero em resolução menor. As camadas têm transparência, então o alfa precisa ser mantido;
 * as coordenadas do layout são relativas, por isso só a largura muda.
 */
function heroVariant(dir, width) {
  const src = join(root, 'public', 'img', dir)
  const dest = join(root, 'public', 'img', `${dir}-sm`)
  mkdirSync(dest, { recursive: true })
  for (const f of readdirSync(src)) {
    const alpha = f !== 'poster.webp'
    run([
      '-i', join(src, f), '-vf', `scale=${width}:-2:flags=lanczos`,
      '-c:v', 'libwebp', '-quality', alpha ? '82' : '78', ...(alpha ? ['-pix_fmt', 'yuva420p'] : []), join(dest, f),
    ])
  }
  console.log(`img/${dir}-sm: ${readdirSync(dest).length} camadas em ${width}px`)
}

heroVariant('hero', 1600)
heroVariant('hero-m', 1080)
smallFrames('vice-beach', 900, 62)
smallFrames('logo-reveal', 720, 66)
poster('leonida-scrub', 1.6, 1280)
poster('trailers-loop', 3.2, 1280)
poster('jason', 0.5, 960)
poster('lucia', 0.7, 960)
