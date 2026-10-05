import { img, responsive } from '../lib/assets'
import { NEWS } from '../lib/content'

const FEATURES = [
  {
    kicker: 'Música',
    title: 'Grand Theft Auto VI: The Album',
    body: '34 faixas originais de artistas bem diferentes entre si, feitas para tocar nas rádios de Vice City e Leonida.',
    image: img('extras/album'),
    cta: 'Ver a lista',
    href: 'https://www.rockstargames.com/newswire/article/7599a881942544',
  },
  {
    kicker: 'Downloads',
    title: 'Mídia e artes',
    body: 'Trailers, screenshots e artes oficiais em alta resolução para baixar.',
    image: img('extras/media'),
    cta: 'Abrir downloads',
    href: 'https://www.rockstargames.com/VI/downloads',
  },
]

export function Extras() {
  return (
    <section id="extras" className="extras container" aria-label="Mais de GTA VI">
      <div className="extras__features">
        {FEATURES.map((f) => (
          <a key={f.title} className="feature" href={f.href} target="_blank" rel="noreferrer">
            <img {...responsive(f.image, '(max-width: 960px) 100vw, 50vw')} alt="" loading="lazy" />
            <span className="feature__shade" />
            <span className="feature__copy">
              <span className="feature__kicker">{f.kicker}</span>
              <span className="display feature__title">{f.title}</span>
              <span className="feature__body">{f.body}</span>
              <span className="link-arrow">{f.cta}</span>
            </span>
          </a>
        ))}
      </div>

      <header className="section-head section-head--row">
        <h2 className="display">Newswire</h2>
        <a className="link-arrow" href="https://www.rockstargames.com/newswire" target="_blank" rel="noreferrer">
          Todas as notícias
        </a>
      </header>
      <div className="news">
        {NEWS.map((n) => (
          <a key={n.href} className="news__card" href={n.href} target="_blank" rel="noreferrer">
            <span className="news__img">
              <img src={n.image} alt="" loading="lazy" />
            </span>
            <span className="news__title">{n.title}</span>
            <span className="news__date">{n.date}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
