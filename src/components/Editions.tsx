import { useRef, useState, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { EDITIONS, STORE_URL, ULTIMATE_ITEMS, type Platform } from '../lib/content'
import { img, responsive } from '../lib/assets'

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'ps5', label: 'PlayStation 5' },
  { id: 'xbox', label: 'Xbox Series X|S' },
]

function EditionCard({ e, platform }: { e: (typeof EDITIONS)[number]; platform: Platform }) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 160, damping: 18 })
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 160, damping: 18 })
  const ultimate = e.id === 'ultimate'

  const onMove = (ev: PointerEvent<HTMLDivElement>) => {
    const r = ev.currentTarget.getBoundingClientRect()
    mx.set((ev.clientX - r.left) / r.width)
    my.set((ev.clientY - r.top) / r.height)
  }
  const reset = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <article className={`edition ${ultimate ? 'edition--ultimate' : ''}`}>
      <motion.div className="edition__cover" style={{ rotateX, rotateY }} onPointerMove={onMove} onPointerLeave={reset}>
        <img src={e.cover} alt={`Capa da ${e.name}`} loading="lazy" />
      </motion.div>
      <div className="edition__body">
        <h3 className="display edition__name">{e.name}</h3>
        <p className="edition__price">
          {e.price} <small>PlayStation Store Brasil</small>
        </p>
        <ul className="edition__items">
          {e.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
        <a className={`btn ${ultimate ? 'btn--primary' : 'btn--light'} btn--block`} href={e.links[platform]} target="_blank" rel="noreferrer">
          Comprar · {platform === 'ps5' ? 'PlayStation 5' : 'Xbox Series X|S'}
        </a>
      </div>
    </article>
  )
}

function UltimateCarousel() {
  const bounds = useRef<HTMLDivElement>(null)
  return (
    <div className="ucar">
      <div className="ucar__head">
        <h3 className="display ucar__title">O que vem na Ultimate</h3>
        <p className="lead">Carros, armas, roupas e lojas ligados à história de Jason e Lucia. Arraste para o lado.</p>
      </div>
      <div className="ucar__viewport" ref={bounds}>
        <motion.ul className="ucar__track" drag="x" dragConstraints={bounds} dragElastic={0.08} whileTap={{ cursor: 'grabbing' }}>
          {ULTIMATE_ITEMS.map((it) => (
            <li key={it.id} className="ucar__item">
              <img {...responsive(img(`ultimate/${it.id}`), '380px')} alt="" loading="lazy" draggable={false} />
              <span>{it.name}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}

export function Editions() {
  const [platform, setPlatform] = useState<Platform>('ps5')

  return (
    <section id="edicoes" className="editions">
      <div className="editions__banner" aria-hidden>
        <img {...responsive(img('editions/ultimate-banner'))} alt="" loading="lazy" />
      </div>
      <div className="container">
        <header className="section-head section-head--center">
          <h2 className="display">Pré-venda</h2>
          <div className="toggle" role="tablist" aria-label="Plataforma">
            {PLATFORMS.map((p) => (
              <button key={p.id} role="tab" aria-selected={platform === p.id} onClick={() => setPlatform(p.id)}>
                {platform === p.id && (
                  <motion.span layoutId="platform-pill" className="toggle__pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <span className="toggle__label">{p.label}</span>
              </button>
            ))}
          </div>
        </header>

        <div className="editions__grid">
          {EDITIONS.map((e) => (
            <EditionCard key={e.id} e={e} platform={platform} />
          ))}
        </div>
        <p className="editions__note">
          Preços da PlayStation Store Brasil, podem mudar de uma loja para outra. Também está à venda na{' '}
          <a href={STORE_URL} target="_blank" rel="noreferrer">
            Rockstar Store
          </a>
          .
        </p>

        <UltimateCarousel />
      </div>
    </section>
  )
}
