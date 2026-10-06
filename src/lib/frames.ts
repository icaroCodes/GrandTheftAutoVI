import { useCallback, useEffect, useRef } from 'react'

/**
 * Sequência de frames desenhada num canvas com object-fit "cover" (padrão) ou "contain".
 * start: 'idle' espera o load da página (frames que só aparecem depois da entrada);
 * 'near' espera o canvas chegar a duas telas de distância. Baixar tudo no início
 * disputava banda com a capa e atrasava o LCP.
 */
export function useFrameSequence(urls: string[], fit: 'cover' | 'contain' = 'cover', start: 'idle' | 'near' = 'near') {
  const images = useRef<HTMLImageElement[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const current = useRef(0)

  /** Frame carregado mais próximo do pedido (evita "piscar" durante o carregamento). */
  const nearestLoaded = useCallback((index: number) => {
    const list = images.current
    for (let d = 0; d < list.length; d++) {
      const a = list[index - d]
      if (a?.complete && a.naturalWidth) return a
      const b = list[index + d]
      if (b?.complete && b.naturalWidth) return b
    }
    return null
  }, [])

  const draw = useCallback(
    (index: number, force = false) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const i = Math.max(0, Math.min(images.current.length - 1, Math.round(index)))
      if (i === current.current && !force && canvas.dataset.drawn === String(i)) return
      current.current = i
      const image = nearestLoaded(i)
      if (!image) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
      }
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const fitFn = fit === 'cover' ? Math.max : Math.min
      const scale = fitFn(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight)
      const dw = image.naturalWidth * scale
      const dh = image.naturalHeight * scale
      if (fit === 'contain') ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(image, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh)
      canvas.dataset.drawn = image === images.current[i] ? String(i) : ''
    },
    [fit, nearestLoaded],
  )

  useEffect(() => {
    let cancelled = false
    const load = () => {
      if (cancelled || images.current.length) return
      images.current = urls.map((src, i) => {
        const image = new Image()
        image.decoding = 'async'
        image.src = src
        // redesenha quando o frame atual terminar de carregar
        image.onload = () => {
          if (i === current.current) draw(i, true)
        }
        return image
      })
    }
    images.current = []

    let io: IntersectionObserver | undefined
    let timer = 0
    const onLoad = () => (timer = window.setTimeout(load, 300))
    if (start === 'idle') {
      if (document.readyState === 'complete') onLoad()
      else window.addEventListener('load', onLoad, { once: true })
    } else if (canvasRef.current) {
      io = new IntersectionObserver(([e]) => e.isIntersecting && load(), { rootMargin: '200% 0px' })
      io.observe(canvasRef.current)
    }

    const onResize = () => draw(current.current, true)
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      io?.disconnect()
      clearTimeout(timer)
      window.removeEventListener('load', onLoad)
      window.removeEventListener('resize', onResize)
    }
  }, [urls, draw, start])

  return { canvasRef, draw }
}

