// Extrai trechos dos trailers oficiais (rockstargames.com/VI/downloads) direto via HTTP
// (o ffmpeg lê só os bytes necessários com range requests, sem baixar os ~2GB inteiros).
// Gera: sequências de frames (canvas scroll) e vídeos curtos para scrub/loop.
// Uso: node scripts/extract-media.mjs
import { spawnSync } from 'node:child_process'
import { mkdirSync, readdirSync, rmSync, existsSync, unlinkSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(root, 'public', 'media')
const T1 = 'https://media-rockstargames-com.akamaized.net/VI/downloads/videos/GTAVI_Trailer_1/GTAVI_Trailer_1.mp4'
const T2 = 'https://media-rockstargames-com.akamaized.net/VI/downloads/videos/GTAVI_Trailer_2/GTAVI_Trailer_2.mp4'
const VI = join(root, 'assets-src', 'vi')

function run(args) {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })
  if (r.status !== 0) throw new Error('ffmpeg falhou: ' + args.join(' '))
}

function frames(name, src, start, duration, fps, width, keep = Infinity) {
  const dir = join(pub, 'frames', name)
  if (existsSync(dir)) rmSync(dir, { recursive: true })
  mkdirSync(dir, { recursive: true })
  run([
    '-ss', String(start), '-i', src, '-t', String(duration),
    '-vf', `fps=${fps},scale=${width}:-2:flags=lanczos`,
    '-c:v', 'libwebp', '-quality', '72', '-compression_level', '5',
    '-start_number', '0', join(dir, '%03d.webp'),
  ])
  // descarta frames finais indesejados (ex.: logo da Rockstar após o corte)
  for (const f of readdirSync(dir).sort().slice(keep)) unlinkSync(join(dir, f))
  console.log(`frames/${name}: ${readdirSync(dir).length} frames`)
}

function clip(name, src, start, duration, width, { scrub = false } = {}) {
  mkdirSync(join(pub, 'video'), { recursive: true })
  run([
    ...(start != null ? ['-ss', String(start)] : []), '-i', src,
    ...(duration != null ? ['-t', String(duration)] : []),
    '-an', '-vf', `scale=${width}:-2:flags=lanczos`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', scrub ? '24' : '27', '-pix_fmt', 'yuv420p',
    // keyframes frequentes = scrub suave quando o scroll controla currentTime
    ...(scrub ? ['-g', '4', '-keyint_min', '4', '-sc_threshold', '0'] : []),
    '-movflags', '+faststart', join(pub, 'video', `${name}.mp4`),
  ])
  console.log(`video/${name}.mp4`)
}

// Trailer 1, 0:11: voo sobre o mar até a praia de Vice City
frames('vice-beach', T1, 11.2, 3.3, 30, 1600)
// Trailer 1, 1:19: logo VI e data de lançamento
frames('logo-reveal', T1, 78.95, 8.9, 14, 1280, 120)
// Trailer 2, 2:33: voo sobre a estrada ao pôr do sol (vídeo do scroll)
clip('leonida-scrub', T2, 153.05, 3.25, 1600, { scrub: true })
// Trailer 1, 0:19: pântano, flamingos, praia e lancha (fundo dos trailers)
clip('trailers-loop', T1, 18.95, 5.9, 1280)
// Clipes curtos dos personagens (site oficial)
const jason = readdirSync(VI).find((f) => f.startsWith('Jason_Duval_Video_Clip'))
const lucia = readdirSync(VI).find((f) => f.startsWith('Lucia_Caminos_Video_Clip'))
if (jason) clip('jason', join(VI, jason), null, null, 1280)
if (lucia) clip('lucia', join(VI, lucia), null, null, 1280)
