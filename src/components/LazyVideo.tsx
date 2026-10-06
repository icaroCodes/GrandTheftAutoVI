import { useEffect, useRef } from 'react'

// Vídeo em loop que só baixa quando chega perto da tela e pausa quando sai dela.
// Com autoPlay direto, os loops abaixo da dobra baixavam no início e disputavam banda com a capa.
export function LazyVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current!
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.getAttribute('src')) v.src = src
          v.play().catch(() => {})
        } else if (v.getAttribute('src')) {
          v.pause()
        }
      },
      { rootMargin: '50% 0px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [src])

  return <video ref={ref} className={className} poster={poster} muted loop playsInline preload="none" aria-hidden />
}
