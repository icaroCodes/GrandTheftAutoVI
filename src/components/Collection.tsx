import { type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { img } from '../lib/assets'
import { COLLECTION_URL } from '../lib/content'

// posição e largura em % do palco; depth = quantos px o item anda com o mouse
const ITEMS = [
  { id: 'cap', x: 4, y: 8, w: 17, depth: 40 },
  { id: 'oakleys', x: 76, y: 6, w: 20, depth: 55 },
  { id: 'shots', x: 2, y: 60, w: 11, depth: 30 },
  { id: 'bag', x: 80, y: 56, w: 19, depth: 45 },
  { id: 'mirror', x: 70, y: 34, w: 13, depth: 25 },
  { id: 'razor', x: 22, y: 76, w: 10, depth: 70 },
  { id: 'spoon', x: 66, y: 78, w: 10, depth: 60 },
  { id: 'pins', x: 30, y: 2, w: 12, depth: 35 },
  { id: 'map', x: 58, y: 0, w: 13, depth: 50 },
] as const

function Item({ item, px, py }: { item: (typeof ITEMS)[number]; px: MotionValue<number>; py: MotionValue<number> }) {
  const x = useTransform(px, (v) => v * item.depth)
  const y = useTransform(py, (v) => v * item.depth)
  return (
    <motion.div className="coll__item" style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.w}%`, x, y }}>
      <img src={img(`collection/${item.id}`)} alt="" loading="lazy" />
    </motion.div>
  )
}

export function Collection() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 60, damping: 18 })
  const py = useSpring(my, { stiffness: 60, damping: 18 })
  const boxX = useTransform(px, (v) => v * -18)
  const boxY = useTransform(py, (v) => v * -18)

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <section id="colecao" className="coll" onPointerMove={onMove} aria-labelledby="coll-title">
      <div className="container coll__inner">
        <div className="coll__stage">
          {ITEMS.map((item) => (
            <Item key={item.id} item={item} px={px} py={py} />
          ))}
          <motion.img className="coll__box" src={img('collection/box')} alt="The Vice City Collection" style={{ x: boxX, y: boxY }} />
        </div>

        <div className="coll__copy">
          <img className="coll__logo" src={img('collection/logo')} alt="The Goodtime State, Vice City Collection" loading="lazy" />
          <h2 id="coll-title" className="display coll__title">
            The Vice City Collection
          </h2>
          <p className="lead">
            Caixa de colecionador com tiragem limitada: boné, óculos, bolsa, copinhos, mapa e mais, tudo com a cara de{' '}
            <em>Macca the Gator</em>, o desenho que passa na TV de Leonida.
          </p>
          <a className="btn btn--primary" href={COLLECTION_URL} target="_blank" rel="noreferrer">
            Garantir a minha
          </a>
        </div>
      </div>
    </section>
  )
}
