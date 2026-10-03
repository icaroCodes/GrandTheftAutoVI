import { useCallback, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useScrollTo } from '../lib/scroll'
import { ViMark } from './BrandIcons'
import { Menu } from './Menu'

/** Navegação no estilo do site oficial: marca "VI" à esquerda e menu hambúrguer à direita. */
export function Nav() {
  const { scrollY, scrollYProgress } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const scrollTo = useScrollTo()
  const close = useCallback(() => setOpen(false), [])

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 300)
    setSolid(y > 80)
  })

  return (
    <>
      <motion.header
        className={`nav ${solid ? 'nav--solid' : ''}`}
        animate={{ y: hidden ? '-120%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <button className="nav__brand" onClick={() => scrollTo('inicio')} aria-label="Grand Theft Auto VI — início">
          <ViMark className="nav__vi" />
        </button>
        <button className="nav__burger" onClick={() => setOpen(true)} aria-label="Abrir menu de navegação" aria-expanded={open}>
          <i />
          <i />
        </button>
        <motion.span className="nav__progress" style={{ scaleX: scrollYProgress, opacity: solid ? 1 : 0 }} aria-hidden />
      </motion.header>

      <Menu open={open} onClose={close} onNavigate={scrollTo} />
    </>
  )
}
