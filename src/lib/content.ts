import { img } from './assets'

export const RELEASE_DATE = new Date('2026-11-19T00:00:00')

export const NAV_LINKS = [
  { id: 'trailers', label: 'Trailers' },
  { id: 'personagens', label: 'Personagens' },
  { id: 'leonida', label: 'Leonida' },
  { id: 'edicoes', label: 'Edições' },
  { id: 'colecao', label: 'Coleção' },
] as const

export const STORY = {
  title: 'Vice City, USA.',
  body:
    'Jason e Lucia sempre souberam que as cartas estão marcadas contra eles. Mas quando um golpe fácil dá errado, ' +
    'eles se veem no lado mais sombrio do lugar mais ensolarado dos Estados Unidos, no meio de uma conspiração ' +
    'criminosa que se espalha por todo o estado de Leonida. Agora vão ter que confiar um no outro mais do que nunca ' +
    'se quiserem sair vivos.',
}

export type Trailer = {
  id: string
  title: string
  subtitle: string
  duration: string
  date: string
  youtubeId: string
  image: string
  download: string
  /** tamanho do MP4 oficial em 4K */
  size: string
  /** vídeos com restrição de idade não podem ser incorporados pelo YouTube */
  ageRestricted?: boolean
}

const DL = 'https://media-rockstargames-com.akamaized.net/VI/downloads/videos'

export const TRAILERS: Trailer[] = [
  {
    id: 'extended-look',
    title: 'Um Olhar Estendido',
    subtitle: 'Grand Theft Auto VI: An Extended Look',
    duration: '26:48',
    date: '27 ago 2026',
    youtubeId: 'tJbzMqJGH4k',
    image: img('trailers/extended-look'),
    download: `${DL}/GTAVI_An_Extended_Look/GTAVI_An_Extended_Look.mp4`,
    size: '14 GB',
    ageRestricted: true,
  },
  {
    id: 'trailer-2',
    title: 'Trailer 2',
    subtitle: 'Grand Theft Auto VI',
    duration: '2:47',
    date: '6 mai 2025',
    youtubeId: 'VQRLujxTm3c',
    image: img('trailers/t2-poster'),
    download: `${DL}/GTAVI_Trailer_2/GTAVI_Trailer_2.mp4`,
    size: '1,3 GB',
  },
  {
    id: 'trailer-1',
    title: 'Trailer 1',
    subtitle: 'Grand Theft Auto VI',
    duration: '1:31',
    date: '5 dez 2023',
    youtubeId: 'QdBZY2fkU-0',
    image: img('trailers/t1-poster'),
    download: `${DL}/GTAVI_Trailer_1/GTAVI_Trailer_1.mp4`,
    size: '713 MB',
  },
]

export type Protagonist = {
  id: 'jason' | 'lucia'
  name: [string, string]
  tagline: string
  bio: string[]
  quotes: string[]
  clip: string
  images: string[]
  accent: string
}

export const PROTAGONISTS: Protagonist[] = [
  {
    id: 'jason',
    name: ['Jason', 'Duval'],
    tagline: 'Jason quer uma vida fácil, mas as coisas só ficam mais difíceis.',
    bio: [
      'Jason cresceu cercado de trapaceiros e bandidos. Depois de passar pelo Exército tentando deixar para trás uma adolescência problemática, foi parar nas Keys fazendo o que sabe de melhor: trabalhar para traficantes locais. Talvez seja hora de tentar algo novo.',
      'Conhecer Lucia pode ser a melhor ou a pior coisa que já aconteceu com ele. Jason sabe como gostaria que terminasse, mas agora é difícil dizer.',
    ],
    quotes: ['Se acontecer qualquer coisa, eu tô logo atrás de você.', 'Mais um dia no paraíso, né?'],
    clip: 'jason',
    images: [img('jason/1'), img('jason/2'), img('jason/3'), img('jason/4')],
    accent: '#ffb35c',
  },
  {
    id: 'lucia',
    name: ['Lucia', 'Caminos'],
    tagline: 'O pai de Lucia a ensinou a lutar assim que ela aprendeu a andar.',
    bio: [
      'A vida vem batendo nela desde então. Lutar pela família a levou para a Penitenciária de Leonida. Pura sorte a tirou de lá. Lucia aprendeu a lição: daqui pra frente, só jogada inteligente.',
      'Lucia quer a vida boa que a mãe sonha desde os tempos de Liberty City. Só que, em vez de esperar, ela resolveu ir buscar.',
    ],
    quotes: ['A única coisa que importa é quem você conhece e o que você tem.', 'Uma vida com Jason pode ser a saída dela.'],
    clip: 'lucia',
    images: [img('lucia/1'), img('lucia/2'), img('lucia/3'), img('lucia/4')],
    accent: '#ff4fa3',
  },
]

export type CastMember = {
  id: string
  name: string
  tagline: string
  bio: string
  quote: string
  place: string
  color: string
}

export const CAST: CastMember[] = [
  {
    id: 'cal',
    name: 'Cal Hampton',
    tagline: 'E se tudo na internet fosse verdade?',
    bio: 'Amigo de Jason e associado de Brian, Cal se sente mais seguro em casa, bisbilhotando as comunicações da Guarda Costeira com algumas cervejas e abas anônimas abertas.',
    quote: 'Tem pássaro demais voando em formação perfeita.',
    place: 'Vice City',
    color: '#8fd3ff',
  },
  {
    id: 'boobie',
    name: 'Boobie Ike',
    tagline: 'É tudo questão de coração. O Valete de Copas.',
    bio: 'Uma lenda de Vice City, e ele age como tal. Transformou o tempo nas ruas em um império legítimo de imóveis, uma boate e um estúdio de gravação.',
    quote: 'O dinheiro da boate paga o estúdio, e o dinheiro da droga paga tudo.',
    place: 'Leonida Keys',
    color: '#c79bff',
  },
  {
    id: 'drequan',
    name: "Dre'Quan Priest",
    tagline: 'Only Raw... Records',
    bio: "Dre'Quan sempre foi mais hustler do que gângster. Mesmo vendendo nas ruas para pagar as contas, entrar na música sempre foi o objetivo.",
    quote: 'Dançarinas são meus A&Rs. Se a música é hit, os DJs vão tocar.',
    place: 'Grassrivers',
    color: '#ff8a8a',
  },
  {
    id: 'dimez',
    name: 'Real Dimez',
    tagline: 'Vídeos virais. Refrões virais.',
    bio: 'Bae-Luxe e Roxy são amigas desde o colégio. Transformaram o tempo extorquindo traficantes em dinheiro, com rap apimentado e muita presença nas redes.',
    quote: 'A um hit de distância da fama.',
    place: 'Port Gellhorn',
    color: '#7cf0c5',
  },
  {
    id: 'raul',
    name: 'Raul Bautista',
    tagline: 'Experiência conta.',
    bio: 'Raul é um assaltante de bancos veterano e confiante, sempre atrás de gente disposta a correr o risco que paga melhor.',
    quote: 'A vida é cheia de surpresas, meu amigo.',
    place: 'Ambrosia',
    color: '#ffd36b',
  },
  {
    id: 'brian',
    name: 'Brian Heder',
    tagline: 'Nada melhor que um Mudslide ao pôr do sol.',
    bio: 'Um traficante clássico da era de ouro do contrabando nas Keys. Ainda movimenta produto pelo seu estaleiro com a terceira esposa, Lori.',
    quote: 'Tem cara de vagabundo de praia de Leonida e se mexe como um tubarão-branco.',
    place: 'Mount Kalaga',
    color: '#ffb0c4',
  },
]

export const PLACES = [
  { id: 'vice-city', name: 'Vice City', blurb: 'Ruas encharcadas de neon e o lado mais sombrio do lugar mais ensolarado dos EUA.' },
  { id: 'leonida-keys', name: 'Leonida Keys', blurb: 'Ilhas, estaleiros e contrabandistas da velha guarda.' },
  { id: 'grassrivers', name: 'Grassrivers', blurb: 'Pântanos selvagens, flamingos e jacarés.' },
  { id: 'port-gellhorn', name: 'Port Gellhorn', blurb: 'Motéis de beira de estrada e golpes à luz do dia.' },
  { id: 'ambrosia', name: 'Ambrosia', blurb: 'Refinarias, motocross e poeira.' },
  { id: 'mount-kalaga', name: 'Mount Kalaga', blurb: 'Parque nacional, trilhas e helicópteros no horizonte.' },
]

export type Platform = 'ps5' | 'xbox'

export const EDITIONS = [
  {
    id: 'standard',
    name: 'Edição Padrão',
    price: 'R$ 449,90',
    cover: img('editions/standard'),
    items: ['Grand Theft Auto VI', 'Vintage Vice City Pack (pré-venda)', '1 mês de GTA+ (pré-venda digital)', 'Pré-download 7 dias antes'],
    links: {
      ps5: 'https://store.playstation.com/pt-br/product/EP1004-PPSA01547_00-GTAVISTANDARD001',
      xbox: 'https://www.xbox.com/pt-BR/games/store/grand-theft-auto-vi/9P3H4968GRSM/0017/9PWFKCT9JGKL',
    },
  },
  {
    id: 'ultimate',
    name: 'Edição Ultimate',
    price: 'R$ 549,90',
    cover: img('editions/ultimate'),
    items: [
      'Grand Theft Auto VI',
      'Upgrade Ultimate Edition',
      'Vintage Vice City Pack (pré-venda)',
      '1 mês de GTA+ (pré-venda digital)',
      'Pré-download 7 dias antes',
    ],
    links: {
      ps5: 'https://store.playstation.com/pt-br/product/EP1004-PPSA01547_00-GTAVIULTIMATE001',
      xbox: 'https://www.xbox.com/pt-BR/games/store/grand-theft-auto-vi-ultimate-edition/9NNZSNHLR63L/0017/9W0CVZDS9RZF',
    },
  },
] as const

export const ULTIMATE_ITEMS = [
  { id: 'cheetah', name: 'Grotti Cheetah' },
  { id: 'squalo', name: 'Squalo' },
  { id: 'stock305', name: 'Stock 305' },
  { id: 'electric-fang', name: 'Electric Fang' },
  { id: 'one-eyed-willie', name: "One-Eyed Willie's" },
  { id: 'vice-city-style', name: 'Vice City Style' },
  { id: 'revolvers', name: 'Revólveres Hawk & Little Morgan' },
  { id: 'rideout', name: 'Rideout Customs' },
  { id: 'saras-salon', name: "Sara's Salon" },
  { id: 'buggy', name: 'Vapid Buggy' },
  { id: 'wyman', name: 'Coleção de Carros Wyman' },
  { id: 'safehouse', name: 'Veículos de Esconderijo' },
  { id: 'weapons', name: 'Variantes de Armas' },
  { id: 'ganado', name: 'Vapid Ganado Retro Build' },
  { id: 'goodtime-gear', name: 'Goodtime Gear' },
  { id: 'ptt-store', name: 'PTT Store' },
]

export const STORE_URL = 'https://store.rockstargames.com/game/buy-gta-vi'
export const COLLECTION_URL = 'https://store.rockstargames.com/merchandise/gtavi-goodtime-state-vice-city-collection'

export const NEWS = [
  {
    title: 'Garanta a Goodtime State – Vice City Collection enquanto durarem os estoques',
    date: '24 set 2026',
    image: img('news/collection'),
    href: 'https://www.rockstargames.com/newswire/article/9k2a49ook82o57',
  },
  {
    title: 'Anunciando Grand Theft Auto VI: The Album, chegando em 19 de novembro',
    date: '17 set 2026',
    image: img('news/album'),
    href: 'https://www.rockstargames.com/newswire/article/7599a881942544',
  },
  {
    title: 'Grand Theft Auto VI: Um Olhar Estendido já está disponível',
    date: '27 ago 2026',
    image: img('news/extended-look'),
    href: 'https://www.rockstargames.com/newswire/article/4k138k8okkk483',
  },
]
