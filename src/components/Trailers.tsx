import { useCallback, useRef, useState } from 'react'
import { TRAILERS, type Trailer } from '../lib/content'
import { responsive, video, videoPoster } from '../lib/assets'
import { usePerf } from '../lib/perf'
import { gsap, useGSAP } from '../lib/scroll'
import { VideoModal } from './VideoModal'

function TrailerCard({ trailer, featured, onPlay }: { trailer: Trailer; featured?: boolean; onPlay: () => void }) {
  return (
    <button className={`tcard ${featured ? 'tcard--featured' : ''}`} onClick={onPlay} aria-label={`Assistir: ${trailer.title}`}>
      <img {...(featured ? responsive(trailer.image) : { src: trailer.image })} alt="" loading="lazy" />
      <span className="tcard__veil" />
      <span className="tcard__meta">
        <span className="tcard__title">{trailer.title}</span>
        <span className="tcard__sub">
          {trailer.duration}, {trailer.date}
        </span>
      </span>
      <span className="tcard__icon" aria-hidden>
        ▶
      </span>
    </button>
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
      // ScrollTrigger e não whileInView: com o card todo recortado o IntersectionObserver não dispara
      gsap.utils.toArray<HTMLElement>('.tcard').forEach((card) => {
        gsap.fromTo(
          card,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut', scrollTrigger: { trigger: card, start: 'top 88%' } },
        )
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
        <header className="section-head section-head--row">
          <h2 className="display">Trailers</h2>
          <p className="lead">
            Um Olhar Estendido tem quase meia hora de jogo. Dá para ver também na{' '}
            <a href="https://www.netflix.com/GTAVI" target="_blank" rel="noreferrer">
              Netflix
            </a>
            .
          </p>
        </header>

        <TrailerCard trailer={featured} featured onPlay={() => setActive(featured)} />
        <div className="trailers__row">
          {rest.map((t) => (
            <TrailerCard key={t.id} trailer={t} onPlay={() => setActive(t)} />
          ))}
        </div>
      </div>
      <VideoModal trailer={active} onClose={close} />
    </section>
  )
}
