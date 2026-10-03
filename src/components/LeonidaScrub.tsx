import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PLACES } from '../lib/content'
import { video, videoPoster } from '../lib/assets'
import { usePerf } from '../lib/perf'
import { gsap, useGSAP } from '../lib/scroll'
import { SplitWords } from './SplitWords'

/**
 * Vídeo controlado pelo scroll: o voo ao pôr do sol do Trailer 2 avança
 * conforme a rolagem (currentTime = progresso). O MP4 foi codificado com
 * keyframes a cada 4 frames para o scrub ficar suave.
 */
export function LeonidaScrub() {
  const root = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(0)
  // modo leve: imagem com zoom no lugar do vídeo
  const lite = usePerf() === 'low'

  // Carrega o vídeo inteiro em memória (blob) — seeking instantâneo, sem range requests.
  useEffect(() => {
    if (lite) return
    const v = videoRef.current!
    let url = ''
    let cancelled = false
    fetch(video('leonida-scrub'))
      .then((r) => r.blob())
      .then((blob) => {
        if (cancelled) return
        url = URL.createObjectURL(blob)
        v.src = url
        // iOS só permite seek depois de um play()
        v.play().then(() => v.pause()).catch(() => {})
      })
      .catch(() => {
        v.src = video('leonida-scrub')
      })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [lite])

  useGSAP(
    () => {
      const v = videoRef.current
      const state = { p: 0 }
      let last = -1

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=320%',
          pin: true,
          scrub: 0.6,
        },
      })

      tl.to(
        state,
        {
          p: 1,
          duration: 10,
          onUpdate: () => {
            if (v?.duration) {
              const t = state.p * (v.duration - 0.04)
              if (Math.abs(t - v.currentTime) > 0.01) v.currentTime = t
            }
            const idx = Math.min(PLACES.length - 1, Math.floor(state.p * PLACES.length))
            if (idx !== last) {
              last = idx
              setActive(idx)
            }
          },
        },
        0,
      )
      if (lite) tl.fromTo('.lscrub__video', { scale: 1.2 }, { scale: 1, duration: 10 }, 0)
      tl.from('.lscrub__title .w', { yPercent: 120, opacity: 0, stagger: 0.15, duration: 1.2, ease: 'power3.out' }, 0)
        .from('.lscrub__places', { autoAlpha: 0, x: -30, duration: 1 }, 0.8)
        .to('.lscrub__bar i', { scaleX: 1, duration: 10 }, 0)
        .to('.lscrub__title', { autoAlpha: 0, y: -40, duration: 1 }, 7.5)
        .from('.lscrub__outro', { autoAlpha: 0, y: 40, duration: 1.2 }, 8.2)
    },
    { scope: root, dependencies: [lite] },
  )

  return (
    <section ref={root} id="leonida" className="lscrub">
      {lite ? (
        <img className="lscrub__video" src={videoPoster('leonida-scrub')} alt="" />
      ) : (
        <video ref={videoRef} className="lscrub__video" muted playsInline preload="auto" aria-hidden />
      )}
      <div className="lscrub__veil" />

      <h2 className="lscrub__title display">
        <SplitWords text="Só em" />
        <br />
        <SplitWords text="Leonida" wordClassName="grad" />
      </h2>

      <div className="lscrub__places">
        <ol>
          {PLACES.map((p, i) => (
            <li key={p.id} className={i === active ? 'is-active' : ''}>
              <span>{String(i + 1).padStart(2, '0')}</span> {p.name}
            </li>
          ))}
        </ol>
        <div className="lscrub__blurb">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35 }}
            >
              {PLACES[active].blurb}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="lscrub__bar">
          <i />
        </div>
      </div>

      <p className="lscrub__outro display">
        O lado mais sombrio do <span className="grad">lugar mais ensolarado</span> dos EUA.
      </p>
    </section>
  )
}
