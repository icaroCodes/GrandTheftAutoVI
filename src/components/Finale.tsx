import { useEffect, useMemo, useRef, useState } from 'react'
import { frameSet, usePerf } from '../lib/perf'
import { useFrameSequence } from '../lib/frames'
import { RELEASE_DATE } from '../lib/content'
import { gsap, useGSAP, useScrollTo } from '../lib/scroll'
import { PlatformBadges } from './PlatformBadges'

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, target.getTime() - now)
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    days: Math.floor(diff / 86_400_000),
    clock: `${pad(Math.floor(diff / 3_600_000) % 24)}:${pad(Math.floor(diff / 60_000) % 60)}:${pad(Math.floor(diff / 1000) % 60)}`,
  }
}

// Revelação do logo no fim do Trailer 1, frame a frame no scroll.
export function Finale() {
  const root = useRef<HTMLElement>(null)
  const tier = usePerf()
  const frames = useMemo(() => frameSet('logo-reveal', 120, tier), [tier])
  const { canvasRef, draw } = useFrameSequence(frames, 'contain')
  const countdown = useCountdown(RELEASE_DATE)
  const scrollTo = useScrollTo()

  useGSAP(
    () => {
      const state = { frame: 0 }
      draw(0, true)
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=260%', pin: true, scrub: 0.6 },
      })
      tl.to(state, { frame: frames.length - 1, duration: 6, onUpdate: () => draw(state.frame) }, 0)
        .to('.finale__canvas', { yPercent: -24, scale: 0.68, duration: 2, ease: 'power2.inOut' }, 6)
        .from('.finale__content > *', { autoAlpha: 0, y: 50, stagger: 0.25, duration: 1.2, ease: 'power3.out' }, 6.6)
        .to({}, { duration: 1 })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="pre-venda" className="finale" aria-label="Pré-venda">
      <canvas ref={canvasRef} className="finale__canvas" aria-label="Grand Theft Auto VI, 19 de novembro de 2026" />
      <div className="finale__content">
        <p className="cd" role="timer" aria-label="Tempo até o lançamento">
          Faltam <b className="display cd__days">{countdown.days}</b> dias
          <span className="cd__clock">{countdown.clock}</span>
        </p>
        <div className="finale__ctas">
          <button className="btn btn--primary btn--lg" onClick={() => scrollTo('edicoes')}>
            Fazer pré-venda
          </button>
          <button className="btn btn--ghost btn--lg" onClick={() => scrollTo('trailers')}>
            Rever trailers
          </button>
        </div>
        <PlatformBadges />
      </div>
    </section>
  )
}
