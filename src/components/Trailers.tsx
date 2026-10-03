import { useCallback, useRef, useState, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { TRAILERS, type Trailer } from '../lib/content'
import { responsive, video, videoPoster } from '../lib/assets'
import { usePerf } from '../lib/perf'
import { gsap, useGSAP } from '../lib/scroll'
import { VideoModal } from './VideoModal'

function TrailerCard({ trailer, featured, onPlay, index }: { trailer: Trailer; featured?: boolean; onPlay: () => void; index: number }) {
  const [hover, setHover] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 28 })
  const sy = useSpring(y, { stiffness: 300, damping: 28 })

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }

  return (
    <motion.button
      className={`tcard ${featured ? 'tcard--featured' : ''}`}
      onClick={onPlay}
      onPointerMove={onMove}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      initial={{ clipPath: 'inset(18% 10% 18% 10% round 28px)', opacity: 0 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 20px)', opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: index * 0.12 }}
      aria-label={`Assistir ${trailer.subtitle} — ${trailer.title}`}
    >
      <motion.img
        {...(featured ? responsive(trailer.image) : { src: trailer.image })}
        alt=""
        loading="lazy"
        animate={{ scale: hover ? 1.06 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <span className="tcard__veil" />
      <motion.span
        className="tcard__play"
        style={{ x: sx, y: sy }}
        animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        aria-hidden
      >
        ▶ Play
      </motion.span>
      <span className="tcard__meta">
        {featured && <span className="tag">Disponível agora</span>}
        <span className="tcard__title">{trailer.title}</span>
        <span className="tcard__sub">
          {trailer.subtitle} · {trailer.duration} · {trailer.date}
        </span>
      </span>
      <span className="tcard__icon" aria-hidden>
        ▶
      </span>
    </motion.button>
  )
}

export function Trailers() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState<Trailer | null>(null)
  const close = useCallback(() => setActive(null), [])
  const [featured, ...rest] = TRAILERS
  const lite = usePerf() === 'low'

  useGSAP(
    () => {
      gsap.fromTo(
        '.trailers__bg',
        { yPercent: -12, scale: 1.15 },
        { yPercent: 12, scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, scrub: true } },
      )
      gsap.from('.trailers__heading .w', {
        yPercent: 120,
        stagger: 0.08,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.trailers__heading', start: 'top 85%' },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="trailers" className="trailers">
      <div className="trailers__bgwrap" aria-hidden>
        {lite ? (
          <img className="trailers__bg" src={videoPoster('trailers-loop')} alt="" loading="lazy" />
        ) : (
          <video className="trailers__bg" src={video('trailers-loop')} poster={videoPoster('trailers-loop')} autoPlay muted loop playsInline preload="metadata" />
        )}
      </div>
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Assista agora</p>
          <h2 className="display trailers__heading">
            <span className="wm">
              <span className="w">Um olhar</span>
            </span>{' '}
            <span className="wm">
              <span className="w grad">estendido</span>
            </span>
          </h2>
          <p className="lead">
            Quase meia hora em Leonida — e os dois trailers que começaram tudo. Também disponível na{' '}
            <a href="https://www.netflix.com/GTAVI" target="_blank" rel="noreferrer">
              Netflix
            </a>
            .
          </p>
        </header>

        <TrailerCard trailer={featured} featured index={0} onPlay={() => setActive(featured)} />
        <div className="trailers__row">
          {rest.map((t, i) => (
            <TrailerCard key={t.id} trailer={t} index={i + 1} onPlay={() => setActive(t)} />
          ))}
        </div>
      </div>
      <VideoModal trailer={active} onClose={close} />
    </section>
  )
}
