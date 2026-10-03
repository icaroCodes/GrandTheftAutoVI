import { useRef } from 'react'
import { CAST } from '../lib/content'
import { img, responsive } from '../lib/assets'
import { gsap, useGSAP } from '../lib/scroll'

/** Elenco de "Only in Leonida": scroll horizontal fixado, com parallax entre fundo e recorte. */
export function Cast() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const track = root.current!.querySelector<HTMLElement>('.cast__track')!
      const distance = () => track.scrollWidth - window.innerWidth

      const scroll = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.cast__progress i', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
      })

      gsap.utils.toArray<HTMLElement>('.cast__panel').forEach((panel) => {
        const st = { trigger: panel, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true }
        gsap.fromTo(panel.querySelector('.cast__bg'), { xPercent: -10 }, { xPercent: 10, ease: 'none', scrollTrigger: st })
        gsap.fromTo(panel.querySelector('.cast__fg'), { xPercent: 22 }, { xPercent: -22, ease: 'none', scrollTrigger: st })
        gsap.fromTo(panel.querySelector('.cast__photo'), { yPercent: 25, rotate: 8 }, { yPercent: -25, rotate: -6, ease: 'none', scrollTrigger: st })
        gsap.from(panel.querySelectorAll('.cast__copy > *'), {
          y: 50,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: panel, containerAnimation: scroll, start: 'left 65%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="cast" aria-label="Pessoas de Leonida">
      <div className="cast__track">
        <div className="cast__intro">
          <p className="eyebrow">Pessoas & Lugares</p>
          <h2 className="display">
            Só em <span className="grad">Leonida</span>
          </h2>
          <p className="lead">Quando o sol se põe e o neon acende, todo mundo tem algo a ganhar — e ainda mais a perder.</p>
          <p className="cast__drag" aria-hidden>
            Continue rolando →
          </p>
        </div>

        {CAST.map((m, i) => (
          <article key={m.id} className="cast__panel" style={{ ['--tone' as string]: m.color }}>
            <img className="cast__bg" {...responsive(img(`cast/${m.id}-bg`), '(max-width: 960px) 130vw, 100vw')} alt="" loading="lazy" />
            <div className="cast__tint" />
            <img className="cast__fg" {...responsive(img(`cast/${m.id}-fg`), '(max-width: 960px) 100vw, 60vw')} alt={m.name} loading="lazy" />
            <div className="cast__copy">
              <span className="cast__index">
                {String(i + 1).padStart(2, '0')} / {String(CAST.length).padStart(2, '0')}
              </span>
              <h3 className="display cast__name">{m.name}</h3>
              <p className="cast__tagline">{m.tagline}</p>
              <p className="cast__bio">{m.bio}</p>
              <blockquote>“{m.quote}”</blockquote>
              <span className="chip">Explore {m.place}</span>
            </div>
            <figure className="cast__photo">
              <img {...responsive(img(`cast/${m.id}`), '260px')} alt="" loading="lazy" />
            </figure>
          </article>
        ))}
      </div>
      <div className="cast__progress" aria-hidden>
        <i />
      </div>
    </section>
  )
}
