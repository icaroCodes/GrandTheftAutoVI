import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger, useLenis } from './lib/scroll'
import { PerfContext, type PerfTier } from './lib/perf'
import { Loader } from './components/Loader'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Trailers } from './components/Trailers'
import { Characters } from './components/Characters'
import { LeonidaScrub } from './components/LeonidaScrub'
import { Cast } from './components/Cast'
import { Places } from './components/Places'
import { Editions } from './components/Editions'
import { Vintage } from './components/Vintage'
import { Collection } from './components/Collection'
import { Finale } from './components/Finale'
import { Extras } from './components/Extras'
import { Footer } from './components/Footer'

export default function App() {
  // o nível de desempenho é decidido no loading; a página só monta depois disso,
  // para que cada seção já nasça com os assets e animações certos
  const [tier, setTier] = useState<PerfTier | null>(null)
  const [loading, setLoading] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const reveal = useCallback(() => setRevealed(true), [])
  const lenis = useLenis()

  useEffect(() => {
    if (loading) lenis?.stop()
    else lenis?.start()
  }, [loading, lenis])

  useEffect(() => {
    // imagens lazy mudam a altura das seções — recalcula os gatilhos ao terminar de carregar
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  const onDone = useCallback(() => {
    setLoading(false)
    ScrollTrigger.refresh()
  }, [])

  return (
    <PerfContext.Provider value={tier ?? 'high'}>
      {loading && <Loader onDetected={setTier} onReveal={reveal} onDone={onDone} />}
      <Nav />
      {tier && (
        <>
          <main>
            <Hero intro={revealed} />
            <Marquee items={['Vice City', 'Leonida', '19.11.2026', 'Jason & Lucia', 'Grand Theft Auto VI']} />
            <Trailers />
            <Characters />
            <LeonidaScrub />
            <Cast />
            <Places />
            <Marquee tone="dark" items={['Pré-venda disponível', 'PlayStation 5', 'Xbox Series X|S', 'Vintage Vice City Pack']} />
            <Editions />
            <Vintage />
            <Collection />
            <Finale />
            <Extras />
          </main>
          <Footer />
        </>
      )}
    </PerfContext.Provider>
  )
}
