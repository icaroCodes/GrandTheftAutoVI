import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HERO_DESKTOP, HERO_MOBILE, img } from '../lib/assets'
import { detectPerf, frameSet, readOverride, type PerfReport, type PerfTier } from '../lib/perf'

const BASE = import.meta.env.BASE_URL

const TIER_LABEL: Record<PerfTier, { title: string; note: string }> = {
  high: { title: 'Experiência completa', note: 'Seu dispositivo aguenta tudo — animações no máximo.' },
  medium: { title: 'Modo equilibrado', note: 'Animações otimizadas para manter a fluidez.' },
  low: { title: 'Modo leve ativado', note: 'Menos efeitos e arquivos menores para rodar liso no seu aparelho.' },
}

function preload(urls: string[], onEach: () => void) {
  return Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new Image()
          image.onload = image.onerror = () => {
            onEach()
            resolve()
          }
          image.src = src
        }),
    ),
  )
}

/**
 * Loading com o "VI" de palmeiras. Enquanto pré-carrega a capa e os primeiros frames,
 * avalia o dispositivo (CPU, memória, GPU, rede e FPS real) e decide o nível de desempenho.
 */
export function Loader({
  onDetected,
  onReveal,
  onDone,
}: {
  onDetected: (tier: PerfTier) => void
  /** chamado quando o loading começa a sair — dispara a entrada do hero */
  onReveal: () => void
  onDone: () => void
}) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Carregando Vice City')
  const [report, setReport] = useState<PerfReport | null>(null)
  const [visible, setVisible] = useState(true)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return // StrictMode monta duas vezes em dev
    started.current = true
    document.documentElement.classList.add('is-loading')

    const layout = window.innerWidth / window.innerHeight < 0.85 ? HERO_MOBILE : HERO_DESKTOP
    const hero = ['poster', 'logo', 'logo-gta', 'logo-vi', ...layout.shards.map((_, i) => `shard${i}`)].map((n) =>
      img(`${layout.dir}/${n}`),
    )
    const total = hero.length + 10
    let loaded = 0
    const bump = () => setProgress(Math.min(1, ++loaded / total))

    const run = async () => {
      const minTime = new Promise((r) => setTimeout(r, 2200))
      const heroDone = preload(hero, bump)
      setStatus('Analisando seu dispositivo')
      const override = readOverride()
      const result: PerfReport = override
        ? { tier: override, fps: 0, reasons: ['escolha manual'], manual: true }
        : await detectPerf()
      document.documentElement.dataset.perf = result.tier
      setReport(result)
      onDetected(result.tier)
      setStatus('Preparando as animações')
      await Promise.all([heroDone, preload(frameSet('vice-beach', 99, result.tier).slice(0, 10), bump), minTime])
      setProgress(1)
      await new Promise((r) => setTimeout(r, 900)) // tempo para ler o resultado
      setVisible(false)
      onReveal()
    }
    run()
  }, [onDetected, onReveal])

  const pct = Math.round(progress * 100)
  const label = report ? TIER_LABEL[report.tier] : null

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.classList.remove('is-loading')
        onDone()
      }}
    >
      {visible && (
        <motion.div
          className="loader"
          role="status"
          aria-live="polite"
          aria-label={`Carregando ${pct}%`}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <div className="loader__aurora" aria-hidden>
            <i />
            <i />
            <i />
          </div>

          <motion.div
            className="loader__logo"
            initial={{ opacity: 0, scale: 0.86, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ scale: 1.12, opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ ['--vi' as string]: `url(${BASE}img/brand/vi-palms.svg)` }}
          >
            {/* contorno apagado + preenchimento em degradê subindo com o progresso */}
            <span className="loader__vi loader__vi--base" />
            <motion.span
              className="loader__vi loader__vi--fill"
              animate={{ clipPath: `inset(${100 - pct}% 0% 0% 0%)` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <span className="loader__vi loader__vi--shine" />
          </motion.div>

          <div className="loader__meta">
            <div className="loader__bar">
              <motion.i animate={{ scaleX: progress }} transition={{ duration: 0.5, ease: 'easeOut' }} />
            </div>
            <div className="loader__row">
              <AnimatePresence mode="wait">
                <motion.span
                  key={label ? label.title : status}
                  className={`loader__status ${label ? `loader__status--${report!.tier}` : ''}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {label && pct === 100 ? label.title : `${status}…`}
                </motion.span>
              </AnimatePresence>
              <span className="loader__pct">{String(pct).padStart(3, '0')}</span>
            </div>
            <AnimatePresence>
              {label && pct === 100 && (
                <motion.p className="loader__note" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  {label.note}
                  {report!.reasons.length > 0 && !report!.manual && <span> ({report!.reasons.join(', ')})</span>}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
