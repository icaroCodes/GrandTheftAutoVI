import { useRef } from 'react'
import { motion } from 'framer-motion'
import { img, responsive } from '../lib/assets'
import { gsap, useGSAP } from '../lib/scroll'
import { usePerf } from '../lib/perf'

const SHOTS = [
  { src: 'vintage/1', cls: 'v1', speed: 0.5 },
  { src: 'vintage/looks-1', cls: 'v2', speed: 1.2 },
  { src: 'vintage/stanier-1', cls: 'v3', speed: 0.8 },
  { src: 'vintage/looks-3', cls: 'v4', speed: 1.6 },
  { src: 'vintage/weapon', cls: 'v5', speed: 1 },
  { src: 'vintage/looks-2', cls: 'v6', speed: 0.6 },
]

/** Bônus de pré-venda: colagem com parallax em camadas. */
export function Vintage() {
  const root = useRef<HTMLElement>(null)
  const lite = usePerf() === 'low'

  useGSAP(
    () => {
      // colagem em camadas só no desktop; no celular vira uma grade
      const mm = gsap.matchMedia()
      mm.add('(min-width: 961px)', () => {
        if (lite) return
        gsap.utils.toArray<HTMLElement>('.vintage__shot', root.current).forEach((el) => {
          const speed = Number(el.dataset.speed)
          gsap.fromTo(
            el,
            { y: 140 * speed, rotate: -4 * speed },
            { y: -140 * speed, rotate: 3 * speed, ease: 'none', scrollTrigger: { trigger: root.current, scrub: true } },
          )
        })
      })
      gsap.fromTo('.vintage__bg', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, scrub: true } })
      return () => mm.revert()
    },
    { scope: root, dependencies: [lite] },
  )

  return (
    <section ref={root} id="vintage" className="vintage" aria-labelledby="vintage-title">
      <img className="vintage__bg" {...responsive(img('vintage/bg'))} alt="" loading="lazy" />
      <div className="vintage__inner container">
        <motion.div
          className="vintage__copy"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">Bônus de pré-venda</p>
          <h2 id="vintage-title" className="display vintage__title">
            Vintage
            <br />
            <span className="grad">Vice City Pack</span>
          </h2>
          <p className="lead">
            Faça a pré-venda e ganhe benefícios únicos que voltam no tempo, para quando o neon brilhava mais forte: o clássico
            Vapid Stanier, visuais exclusivos e um padrão de arma retrô.
          </p>
        </motion.div>
        <div className="vintage__collage">
          {SHOTS.map((s) => (
            <figure key={s.cls} className={`vintage__shot ${s.cls}`} data-speed={s.speed}>
              <img {...responsive(img(s.src), '(max-width: 960px) 50vw, 30vw')} alt="" loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
