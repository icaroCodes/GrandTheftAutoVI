import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { img } from '../lib/assets'
import { useLenis } from '../lib/scroll'
import { readOverride, saveOverride, usePerf, type PerfTier } from '../lib/perf'
import { ReleaseBar } from './ReleaseBar'

const TIER_NAMES: Record<PerfTier, string> = { high: 'completo', medium: 'equilibrado', low: 'leve' }
const PERF_OPTIONS: { label: string; value: PerfTier | null }[] = [
  { label: 'Automático', value: null },
  { label: 'Completo', value: 'high' },
  { label: 'Equilibrado', value: 'medium' },
  { label: 'Leve', value: 'low' },
]

const BASE = import.meta.env.BASE_URL

type Sub = { label: string; target: string; preview: string; external?: boolean }
type Item = { label: string; target: string; subs?: Sub[] }

const ITEMS: Item[] = [
  { label: 'Início', target: 'inicio' },
  {
    label: 'Para assistir',
    target: 'trailers',
    subs: [
      { label: 'Um Olhar Estendido', target: 'trailers', preview: img('trailers/extended-look') },
      { label: 'Trailer 2', target: 'trailers', preview: img('trailers/t2-poster') },
      { label: 'Trailer 1', target: 'trailers', preview: img('trailers/t1-poster') },
    ],
  },
  { label: 'Ultimate Edition', target: 'edicoes' },
  {
    label: 'Só em Leonida',
    target: 'personagens',
    subs: [
      { label: 'Jason Duval', target: 'personagens', preview: img('jason/1') },
      { label: 'Lucia Caminos', target: 'personagens', preview: img('lucia/1') },
      { label: 'Elenco de Leonida', target: 'leonida', preview: img('cast/boobie') },
      { label: 'Vice City', target: 'leonida', preview: img('places/vice-city') },
      { label: 'Leonida Keys', target: 'leonida', preview: img('places/leonida-keys') },
      { label: 'Grassrivers', target: 'leonida', preview: img('places/grassrivers') },
      { label: 'Port Gellhorn', target: 'leonida', preview: img('places/port-gellhorn') },
      { label: 'Ambrosia', target: 'leonida', preview: img('places/ambrosia') },
      { label: 'Mount Kalaga', target: 'leonida', preview: img('places/mount-kalaga') },
    ],
  },
  {
    label: 'Mídia',
    target: 'extras',
    subs: [
      { label: 'Vintage Vice City Pack', target: 'vintage', preview: img('vintage/1') },
      { label: 'The Vice City Collection', target: 'colecao', preview: img('collection/news') },
      {
        label: 'Mídia & Artes',
        target: 'https://www.rockstargames.com/VI/downloads',
        preview: img('extras/media'),
        external: true,
      },
    ],
  },
  { label: 'Música', target: 'extras' },
]

const LOCALES = [
  { label: 'Português do Brasil', href: 'https://www.rockstargames.com/VI/pt-BR', current: true },
  { label: 'English', href: 'https://www.rockstargames.com/VI/en-US' },
  { label: 'Español (Latinoamérica)', href: 'https://www.rockstargames.com/VI/es-MX' },
]

const ease = [0.76, 0, 0.24, 1] as const

/** Seção visível no momento (para destacar o item ativo, como "Início" no site oficial). */
function currentSection() {
  const ids = ['inicio', 'trailers', 'personagens', 'leonida', 'edicoes', 'vintage', 'colecao', 'extras']
  let active = 'inicio'
  for (const id of ids) {
    const el = document.getElementById(id)
    if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) active = id
  }
  return active
}

function Chevron({ dir = 'right' }: { dir?: 'right' | 'up' | 'left' }) {
  const rotate = dir === 'up' ? -90 : dir === 'left' ? 180 : 0
  return (
    <svg className="chev" viewBox="0 0 24 24" aria-hidden style={{ rotate: `${rotate}deg` }}>
      <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Menu({ open, onClose, onNavigate }: { open: boolean; onClose: () => void; onNavigate: (id: string) => void }) {
  const lenis = useLenis()
  const [sub, setSub] = useState<Item | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [active, setActive] = useState('inicio')
  const [popover, setPopover] = useState<'lang' | 'motion' | null>(null)
  const tier = usePerf()
  const [perfChoice] = useState(readOverride)
  const [reduced, setReduced] = useState(() => {
    try {
      return localStorage.getItem('motion') === 'reduced'
    } catch {
      return false
    }
  })

  // estado ao abrir/fechar
  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      window.removeEventListener('keydown', onKey)
      setSub(null)
      setPreview(null)
      setPopover(null)
    }
  }, [open, lenis, onClose])

  // "Movimento": reduzido desliga o scroll suave e as animações em loop
  useEffect(() => {
    // o SmoothScroll observa este atributo e ajusta o Lenis
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'
    try {
      localStorage.setItem('motion', reduced ? 'reduced' : 'full')
    } catch {
      /* armazenamento indisponível */
    }
  }, [reduced])

  const go = (target: string, external?: boolean) => {
    if (external) {
      window.open(target, '_blank', 'noreferrer')
      return
    }
    onClose()
    // espera o menu fechar e o Lenis voltar antes de rolar
    setTimeout(() => onNavigate(target), 450)
  }

  const items = sub ? sub.subs! : ITEMS

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="vmenu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.35, duration: 0.2 } }}
          onAnimationStart={() => setActive(currentSection())}
        >
          {/* Painel esquerdo: VI com palmeiras (ou prévia do item em foco) */}
          <motion.aside
            className="vmenu__art"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            exit={{ clipPath: 'inset(0 100% 0 0)' }}
            transition={{ duration: 0.8, ease }}
          >
            <AnimatePresence>
              {preview && (
                <motion.img
                  key={preview}
                  className="vmenu__preview"
                  src={preview}
                  alt=""
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </AnimatePresence>
            <motion.img
              className="vmenu__vi"
              src={`${BASE}img/brand/vi-palms.svg`}
              alt="Grand Theft Auto VI"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: preview ? 0 : 1, scale: preview ? 1.08 : 1 }}
              transition={{ duration: 0.7, delay: preview ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="vmenu__bar"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              <ReleaseBar onReserve={() => go('edicoes')} />
            </motion.div>
          </motion.aside>

          {/* Painel direito: navegação */}
          <motion.nav
            className="vmenu__panel"
            aria-label="Seções"
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease }}
          >
            <header className="vmenu__head">
              <a className="vmenu__brand" href="https://www.rockstargames.com" target="_blank" rel="noreferrer">
                <img src={`${BASE}img/brand/rockstar.svg`} alt="Rockstar Games" />
                <span>Grand Theft Auto VI</span>
              </a>
              <button className="vmenu__close" onClick={onClose} aria-label="Fechar menu">
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={sub ? sub.label : 'root'}
                className={`vmenu__list ${sub ? 'vmenu__list--sub' : ''}`}
                initial={{ opacity: 0, x: sub ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: sub ? -40 : 40 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onPointerLeave={() => setPreview(null)}
              >
                {sub && (
                  <li>
                    <button className="vmenu__back" onClick={() => setSub(null)}>
                      <Chevron dir="left" /> {sub.label}
                    </button>
                  </li>
                )}
                {items.map((it, i) => {
                  const item = it as Item & Partial<Sub>
                  const hasSubs = !sub && !!item.subs
                  return (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (sub ? 0.05 : 0.3) + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <button
                        className={`vmenu__item ${!sub && item.target === active ? 'is-active' : ''}`}
                        onClick={() => (hasSubs ? setSub(item) : go(item.target, item.external))}
                        onPointerEnter={() => setPreview(item.preview ?? null)}
                        onFocus={() => setPreview(item.preview ?? null)}
                        aria-haspopup={hasSubs || undefined}
                      >
                        <span>{item.label}</span>
                        {hasSubs && <Chevron />}
                        {item.external && <span className="vmenu__ext">↗</span>}
                      </button>
                    </motion.li>
                  )
                })}
              </motion.ul>
            </AnimatePresence>

            <footer className="vmenu__foot">
              <div className="vmenu__pop-wrap">
                <button className="vmenu__opt" onClick={() => setPopover(popover === 'lang' ? null : 'lang')} aria-expanded={popover === 'lang'}>
                  <svg viewBox="0 0 24 24" className="vmenu__globe" aria-hidden>
                    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  Português do Brasil <Chevron dir="up" />
                </button>
                <AnimatePresence>
                  {popover === 'lang' && (
                    <motion.ul className="vmenu__pop" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                      {LOCALES.map((l) => (
                        <li key={l.label}>
                          <a href={l.href} target={l.current ? undefined : '_blank'} rel="noreferrer" aria-current={l.current || undefined}>
                            {l.label} {l.current && '✓'}
                          </a>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
              <div className="vmenu__pop-wrap vmenu__pop-wrap--right">
                <button className="vmenu__opt" onClick={() => setPopover(popover === 'motion' ? null : 'motion')} aria-expanded={popover === 'motion'}>
                  Movimento <Chevron dir="up" />
                </button>
                <AnimatePresence>
                  {popover === 'motion' && (
                    <motion.ul className="vmenu__pop" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                      <li className="vmenu__pop-title">Animações</li>
                      {[
                        { label: 'Completas', value: false },
                        { label: 'Reduzidas', value: true },
                      ].map((o) => (
                        <li key={o.label}>
                          <button onClick={() => setReduced(o.value)} aria-pressed={reduced === o.value}>
                            {o.label} {reduced === o.value && '✓'}
                          </button>
                        </li>
                      ))}
                      <li className="vmenu__pop-title">Desempenho</li>
                      {PERF_OPTIONS.map((o) => (
                        <li key={o.label}>
                          <button
                            onClick={() => {
                              // os assets são escolhidos ao montar a página: recarrega com a nova escolha
                              saveOverride(o.value)
                              window.location.reload()
                            }}
                            aria-pressed={perfChoice === o.value}
                          >
                            {o.label} {perfChoice === o.value && '✓'}
                            {o.value === null && <small> ({TIER_NAMES[tier]})</small>}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </footer>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
