const BASE = import.meta.env.BASE_URL

export const img = (name: string) => `${BASE}img/${name}.webp`

export const video = (name: string) => `${BASE}media/video/${name}.mp4`

// pôster gerado por derive-light.mjs, usado no lugar do vídeo no modo leve
export const videoPoster = (name: string) => `${BASE}media/video/${name}.webp`

export const frameUrls = (name: string, count: number) =>
  Array.from({ length: count }, (_, i) => `${BASE}media/frames/${name}/${String(i).padStart(3, '0')}.webp`)

/**
 * Props de <img> com srcset: a variante -sm (800px) existe para toda imagem
 * otimizada a partir de 1280px (ver scripts/optimize-images.mjs).
 */
export const responsive = (url: string, sizes = '100vw') => ({
  src: url,
  srcSet: `${url.replace(/\.webp$/, '-sm.webp')} 800w, ${url} 1920w`,
  sizes,
})

/**
 * Capa oficial em camadas. Os shards são PNGs do mesmo tamanho da capa,
 * cada um contendo um painel; `box` = [x, y, w, h] do painel no canvas original.
 */
export type HeroLayout = {
  width: number
  height: number
  dir: 'hero' | 'hero-m'
  /** centro do logo (de onde os painéis "explodem") */
  logoCenter: [number, number]
  /** ponto dentro da letra "I" usado para o zoom da máscara */
  maskFocus: [number, number]
  /** faixa vertical (% da altura) do "grand theft auto", revelada na entrada */
  textBand: [number, number]
  shards: [number, number, number, number][]
}

/**
 * Pasta das camadas da capa. As variantes -sm (derive-light.mjs) têm metade do peso. A regra é a mesma
 * dos media queries do preload no index.html, senão o navegador baixaria as duas versões.
 */
export function heroImageDir(layout: HeroLayout) {
  if (layout.dir === 'hero-m') return window.innerWidth <= 600 ? 'hero-m-sm' : 'hero-m'
  const small = window.innerWidth <= 850 || (window.devicePixelRatio <= 1 && window.innerWidth <= 1700)
  return small ? 'hero-sm' : 'hero'
}

export const HERO_DESKTOP: HeroLayout = {
  width: 2560,
  height: 1440,
  dir: 'hero',
  logoCenter: [1231, 781],
  maskFocus: [1528, 781],
  textBand: [37.2, 68.3],
  shards: [
    [40, 40, 458, 590],
    [518, 40, 752, 764],
    [1290, 40, 714, 550],
    [2024, 40, 496, 712],
    [40, 642, 458, 758],
    [518, 808, 542, 592],
    [1078, 934, 474, 466],
    [1570, 582, 434, 818],
    [2024, 762, 496, 638],
    [1148, 624, 384, 210],
  ],
}

export const HERO_MOBILE: HeroLayout = {
  width: 1920,
  height: 2124,
  dir: 'hero-m',
  logoCenter: [894, 1038],
  maskFocus: [1303, 1038],
  textBand: [31, 62.1],
  shards: [
    [52, 52, 508, 556],
    [586, 52, 736, 750],
    [1348, 52, 520, 626],
    [52, 618, 604, 874],
    [1296, 684, 572, 686],
    [52, 1478, 604, 594],
    [682, 1220, 588, 426],
    [682, 1652, 588, 420],
    [1296, 1364, 572, 708],
    [960, 856, 270, 156],
  ],
}
