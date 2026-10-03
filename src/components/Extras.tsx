import { motion } from 'framer-motion'
import { img, responsive } from '../lib/assets'
import { NEWS } from '../lib/content'

const FEATURES = [
  {
    eyebrow: 'Música',
    title: 'Grand Theft Auto VI: The Album',
    body: 'Um elenco de artistas que desafia gêneros, com 34 faixas originais que capturam a energia elétrica de Vice City e Leonida.',
    image: img('extras/album'),
    cta: 'Explorar',
    href: 'https://www.rockstargames.com/newswire/article/7599a881942544',
  },
  {
    eyebrow: 'Downloads',
    title: 'Mídia & Artes',
    body: 'Baixe e compartilhe vídeos, capturas de tela e artes oficiais em alta resolução.',
    image: img('extras/media'),
    cta: 'Ver tudo',
    href: 'https://www.rockstargames.com/VI/downloads',
  },
]

const reveal = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
}

export function Extras() {
  return (
    <section id="extras" className="extras container" aria-label="Mais de GTA VI">
      <div className="extras__features">
        {FEATURES.map((f, i) => (
          <motion.a
            key={f.title}
            className="feature"
            href={f.href}
            target="_blank"
            rel="noreferrer"
            {...reveal}
            transition={{ duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            whileHover="hover"
          >
            <motion.img {...responsive(f.image, '(max-width: 960px) 100vw, 50vw')} alt="" loading="lazy" variants={{ hover: { scale: 1.06 } }} transition={{ duration: 0.8 }} />
            <span className="feature__shade" />
            <span className="feature__copy">
              <span className="eyebrow">{f.eyebrow}</span>
              <span className="display feature__title">{f.title}</span>
              <span className="feature__body">{f.body}</span>
              <span className="link-arrow">{f.cta} →</span>
            </span>
          </motion.a>
        ))}
      </div>

      <header className="section-head section-head--row">
        <div>
          <p className="eyebrow">Newswire</p>
          <h2 className="display">Notícias em destaque</h2>
        </div>
        <a className="link-arrow" href="https://www.rockstargames.com/newswire" target="_blank" rel="noreferrer">
          Ver todas →
        </a>
      </header>
      <div className="news">
        {NEWS.map((n, i) => (
          <motion.a
            key={n.href}
            className="news__card"
            href={n.href}
            target="_blank"
            rel="noreferrer"
            {...reveal}
            transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8 }}
          >
            <span className="news__img">
              <img src={n.image} alt="" loading="lazy" />
            </span>
            <span className="news__title">{n.title}</span>
            <span className="news__date">{n.date}</span>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
