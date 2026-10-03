import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../lib/scroll'

/** Faixa de texto infinita que acelera e inverte conforme a velocidade do scroll. */
export function Marquee({ items, tone = 'pink' }: { items: string[]; tone?: 'pink' | 'dark' }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const track = root.current!.querySelector('.marquee__track')!
      const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          if (document.documentElement.dataset.motion === 'reduced') {
            loop.pause()
            return
          }
          if (loop.paused()) loop.play()
          const v = self.getVelocity() / 300
          gsap.to(loop, { timeScale: gsap.utils.clamp(-6, 6, v || self.direction), duration: 0.3, overwrite: true })
        },
      })
    },
    { scope: root },
  )

  const row = [...items, ...items]
  return (
    <div ref={root} className={`marquee marquee--${tone}`} aria-hidden>
      <div className="marquee__track">
        {[...row, ...row].map((t, i) => (
          <span key={i}>
            {t} <b>✦</b>
          </span>
        ))}
      </div>
    </div>
  )
}
