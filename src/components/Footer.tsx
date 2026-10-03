import { img } from '../lib/assets'

const SOCIAL = [
  ['X', 'https://x.com/RockstarGames'],
  ['Instagram', 'https://www.instagram.com/rockstargames'],
  ['YouTube', 'https://www.youtube.com/rockstargames'],
  ['TikTok', 'https://www.tiktok.com/@rockstargames'],
  ['Twitch', 'https://www.twitch.tv/rockstargames'],
  ['Discord', 'https://discord.gg/rockstargames'],
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <img className="footer__logo" src={img('brand/logo')} alt="Grand Theft Auto VI" loading="lazy" />
        <ul className="footer__social">
          {SOCIAL.map(([label, href]) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <p className="footer__rating">
          Sangue e violência, violência intensa, humor adulto, nudez, linguagem forte, conteúdo sexual forte, uso de drogas
          e álcool. Compras no jogo.
        </p>
        <p className="footer__legal">
          Landing page conceitual feita por <a href="https://github.com/IcaroCodes" target="_blank" rel="noreferrer">IcaroCodes</a>, sem afiliação com a Rockstar Games ou Take-Two Interactive. Grand Theft
          Auto, GTA VI, trailers, artes e marcas são propriedade de seus respectivos donos. Informações oficiais em{' '}
          <a href="https://www.rockstargames.com/VI" target="_blank" rel="noreferrer">
            rockstargames.com/VI
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
