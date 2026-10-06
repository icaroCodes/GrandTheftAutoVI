import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HERO_DESKTOP, HERO_MOBILE, heroImageDir, img } from '../lib/assets'
import { initialTier, rememberMeasuredTier, type PerfTier } from '../lib/perf'

const BASE = import.meta.env.BASE_URL

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

// O loading só espera as camadas da capa. O nível de desempenho sai de initialTier() na hora e o teste
// de FPS roda depois da entrada, para não atrasar o primeiro conteúdo.
export function Loader({
  onDetected,
  onHeroReady,
  onReveal,
  onDone,
}: {
  onDetected: (tier: PerfTier) => void
  onHeroReady: () => void
  onReveal: () => void
  onDone: () => void
}) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return // StrictMode monta duas vezes em dev
    started.current = true
    document.documentElement.classList.add('is-loading')

    const layout = window.innerWidth / window.innerHeight < 0.85 ? HERO_MOBILE : HERO_DESKTOP
    const dir = heroImageDir(layout)
    const hero = ['poster', 'logo', 'logo-gta', 'logo-vi', ...layout.shards.map((_, i) => `shard${i}`)].map((n) => img(`${dir}/${n}`))
    const total = hero.length
    let loaded = 0
    const bump = () => setProgress(Math.min(1, ++loaded / total))

    const run = async () => {
      const tier = initialTier()
      document.documentElement.dataset.perf = tier
      onDetected(tier)
      // tempo mínimo só para o logo não piscar em conexão rápida
      await Promise.all([preload(hero, bump), new Promise((r) => setTimeout(r, 700))])
      setProgress(1)
      onHeroReady()
      // tempo para as outras seções montarem antes do loading sair
      await new Promise((r) => setTimeout(r, 400))
      setVisible(false)
      onReveal()
    }
    run()
  }, [onDetected, onHeroReady, onReveal])

  const pct = Math.round(progress * 100)

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.classList.remove('is-loading')
        onDone()
        // depois da animação de entrada (~2 s), com a página parada
        setTimeout(rememberMeasuredTier, 2500)
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
          <motion.div
            className="loader__logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ scale: 1.08, opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{ ['--vi' as string]: `url(${BASE}img/brand/vi-palms.svg)` }}
          >
            <span className="loader__vi loader__vi--base" />
            <motion.span
              className="loader__vi loader__vi--fill"
              animate={{ clipPath: `inset(${100 - pct}% 0% 0% 0%)` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </motion.div>

          <span className="loader__pct">{pct}%</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
