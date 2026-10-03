import { useRef, useState, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { EDITIONS, STORE_URL, ULTIMATE_ITEMS, type Platform } from '../lib/content'
import { img, responsive } from '../lib/assets'

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'ps5', label: 'PlayStation 5' },
  { id: 'xbox', label: 'Xbox Series X|S' },
]

function EditionCard({ e, platform, index }: { e: (typeof EDITIONS)[number]; platform: Platform; index: number }) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 160, damping: 18 })
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 160, damping: 18 })
  const glareX = useTransform(mx, (v) => `${v * 100}%`)
  const glareY = useTransform(my, (v) => `${v * 100}%`)
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
    <motion.article
      className={`edition ${ultimate ? 'edition--ultimate' : ''}`}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="edition__cover" style={{ rotateX, rotateY }} onPointerMove={onMove} onPointerLeave={reset}>
        <img src={e.cover} alt={`Capa — ${e.name}`} loading="lazy" />
        <motion.span
          className="edition__glare"
          style={{ ['--gx' as string]: glareX, ['--gy' as string]: glareY }}
          aria-hidden
        />
        {ultimate && <span className="tag edition__badge">Mais completa</span>}
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
    </motion.article>
  )
}

function UltimateCarousel() {
  const bounds = useRef<HTMLDivElement>(null)
  return (
    <div className="ucar">
      <div className="ucar__head">
        <div>
          <p className="eyebrow">Ultimate Edition</p>
          <h3 className="display ucar__title">Uma coleção exclusiva</h3>
        </div>
        <p className="lead">Itens entrelaçados em todos os aspectos da história de Jason e Lucia. Arraste para explorar →</p>
      </div>
      <div className="ucar__viewport" ref={bounds}>
        <motion.ul className="ucar__track" drag="x" dragConstraints={bounds} dragElastic={0.08} whileTap={{ cursor: 'grabbing' }}>
          {ULTIMATE_ITEMS.map((it, i) => (
            <motion.li
              key={it.id}
              className="ucar__item"
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i, 5) * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -10 }}
            >
              <img {...responsive(img(`ultimate/${it.id}`), '380px')} alt="" loading="lazy" draggable={false} />
              <span>{it.name}</span>
            </motion.li>
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
          <p className="eyebrow">Pré-venda disponível</p>
          <h2 className="display">
            Escolha sua <span className="grad">edição</span>
          </h2>
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
          {EDITIONS.map((e, i) => (
            <EditionCard key={e.id} e={e} platform={platform} index={i} />
          ))}
        </div>
        <p className="editions__note">
          Preços da PlayStation Store Brasil; podem variar entre lojas e plataformas. Também disponível na{' '}
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
