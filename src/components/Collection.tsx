import { type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { img } from '../lib/assets'
import { COLLECTION_URL } from '../lib/content'
import { usePerf } from '../lib/perf'

// posição (%), largura (%), profundidade do parallax e período da flutuação
const ITEMS = [
  { id: 'cap', x: 4, y: 8, w: 17, depth: 40, float: 5 },
  { id: 'oakleys', x: 76, y: 6, w: 20, depth: 55, float: 4.2 },
  { id: 'shots', x: 2, y: 60, w: 11, depth: 30, float: 4.6 },
  { id: 'bag', x: 80, y: 56, w: 19, depth: 45, float: 5.4 },
  { id: 'mirror', x: 70, y: 34, w: 13, depth: 25, float: 6 },
  { id: 'razor', x: 22, y: 76, w: 10, depth: 70, float: 4.4 },
  { id: 'spoon', x: 66, y: 78, w: 10, depth: 60, float: 5.1 },
  { id: 'pins', x: 30, y: 2, w: 12, depth: 35, float: 4.8 },
  { id: 'map', x: 58, y: 0, w: 13, depth: 50, float: 5.6 },
] as const

function FloatingItem({ item, px, py, i }: { item: (typeof ITEMS)[number]; px: MotionValue<number>; py: MotionValue<number>; i: number }) {
  const lite = usePerf() === 'low'
  const x = useTransform(px, (v) => v * item.depth)
  const y = useTransform(py, (v) => v * item.depth)
  return (
    <motion.div
      className="coll__item"
      style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.w}%`, x, y }}
      initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.2 + i * 0.07 }}
    >
      <motion.img
        src={img(`collection/${item.id}`)}
        alt=""
        loading="lazy"
        animate={lite ? undefined : { y: [0, -14, 0], rotate: [0, i % 2 ? 3 : -3, 0] }}
        transition={{ duration: item.float, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

/** Collector's Box: itens flutuando em camadas com parallax do mouse. */
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
          {ITEMS.map((item, i) => (
            <FloatingItem key={item.id} item={item} px={px} py={py} i={i} />
          ))}
          <motion.img
            className="coll__box"
            src={img('collection/box')}
            alt="The Vice City Collection"
            style={{ x: boxX, y: boxY }}
            initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 70, damping: 15 }}
          />
        </div>

        <motion.div
          className="coll__copy"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">Collector&apos;s Box · Edição limitada</p>
          <img className="coll__logo" src={img('collection/logo')} alt="The Goodtime State — Vice City Collection" loading="lazy" />
          <h2 id="coll-title" className="display coll__title">
            The Vice City <span className="grad">Collection</span>
          </h2>
          <p className="lead">
            Um conjunto colecionável premium de edição limitada, com tudo que você precisa para se divertir — inspirado no
            sucesso da TV de Leonida, <em>Macca the Gator</em>.
          </p>
          <a className="btn btn--primary" href={COLLECTION_URL} target="_blank" rel="noreferrer">
            Garantir a minha
          </a>
        </motion.div>
      </div>
    </section>
  )
}
