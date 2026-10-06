import { useRef } from 'react'
import { PROTAGONISTS, type Protagonist } from '../lib/content'
import { responsive, video, videoPoster } from '../lib/assets'
import { usePerf } from '../lib/perf'
import { gsap, useGSAP } from '../lib/scroll'
import { LazyVideo } from './LazyVideo'

function Character({ c, flip }: { c: Protagonist; flip: boolean }) {
  const root = useRef<HTMLElement>(null)
  const lite = usePerf() === 'low'

  useGSAP(
    () => {
      gsap.fromTo(
        '.char__bigname',
        { xPercent: flip ? -18 : 18 },
        { xPercent: flip ? 18 : -18, ease: 'none', scrollTrigger: { trigger: root.current, scrub: true } },
      )
      gsap.fromTo(
        '.char__main',
        { clipPath: 'inset(22% 18% 22% 18% round 32px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 20px)',
          ease: 'none',
          scrollTrigger: { trigger: '.char__main', start: 'top 95%', end: 'center 55%', scrub: true },
        },
      )
      gsap.fromTo(
        '.char__main img',
        { scale: 1.35 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: '.char__main', start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      // no celular e no modo leve a galeria fica parada, em grade
      const mm = gsap.matchMedia()
      mm.add('(min-width: 961px)', () => {
        if (lite) return
        gsap.utils.toArray<HTMLElement>('[data-speed]', root.current).forEach((el) => {
          const speed = Number(el.dataset.speed)
          gsap.fromTo(
            el,
            { yPercent: speed * 30 },
            { yPercent: -speed * 30, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [lite] },
  )

  return (
    <article
      ref={root}
      className={`char char--${c.id} ${flip ? 'char--flip' : ''}`}
      style={{ ['--accent' as string]: c.accent }}
      aria-labelledby={`char-${c.id}`}
    >
      <p className="char__bigname" aria-hidden>
        {c.name[0]}
      </p>

      <div className="char__grid">
        <figure className="char__main">
          <img {...responsive(c.images[0], '(max-width: 960px) 100vw, 58vw')} alt={c.name.join(' ')} loading="lazy" />
        </figure>

        <div className="char__copy">
          <h3 id={`char-${c.id}`} className="char__name display">
            {c.name[0]} <span>{c.name[1]}</span>
          </h3>
          <p className="char__tagline">{c.tagline}</p>
          {c.bio.map((p, i) => (
            <p key={i} className="char__bio">
              {p}
            </p>
          ))}
          <blockquote className="char__quote">“{c.quotes[0]}”</blockquote>
        </div>

        <figure className="char__clip" data-speed="0.6">
          {lite ? (
            <img src={videoPoster(c.clip)} alt="" loading="lazy" />
          ) : (
            <LazyVideo src={video(c.clip)} poster={videoPoster(c.clip)} />
          )}
          <figcaption>{c.quotes[1]}</figcaption>
        </figure>
        <figure className="char__img char__img--a" data-speed="1">
          <img {...responsive(c.images[1], '(max-width: 960px) 50vw, 33vw')} alt="" loading="lazy" />
        </figure>
        <figure className="char__img char__img--b" data-speed="0.4">
          <img {...responsive(c.images[2], '(max-width: 960px) 50vw, 33vw')} alt="" loading="lazy" />
        </figure>
      </div>
    </article>
  )
}

export function Characters() {
  return (
    <section id="personagens" className="chars">
      {PROTAGONISTS.map((c, i) => (
        <Character key={c.id} c={c} flip={i % 2 === 1} />
      ))}
    </section>
  )
}
