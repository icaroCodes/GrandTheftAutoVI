import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger, useLenis } from './lib/scroll'
import { PerfContext, type PerfTier } from './lib/perf'
import { Loader } from './components/Loader'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
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
  // a capa monta assim que o nível de desempenho sai; o resto só depois que a capa carregou,
  // ainda atrás do loading. Montar tudo junto travava a CPU no celular antes da capa aparecer.
  const [tier, setTier] = useState<PerfTier | null>(null)
  const [rest, setRest] = useState(false)
  const showRest = useCallback(() => setRest(true), [])
  const [loading, setLoading] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const reveal = useCallback(() => setRevealed(true), [])
  const lenis = useLenis()

  useEffect(() => {
    if (loading) lenis?.stop()
    else lenis?.start()
  }, [loading, lenis])

  useEffect(() => {
    // imagens lazy mudam a altura das seções e desalinham os gatilhos do ScrollTrigger
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
      {loading && <Loader onDetected={setTier} onHeroReady={showRest} onReveal={reveal} onDone={onDone} />}
      <Nav />
      {tier && (
        <>
          <main>
            <Hero intro={revealed} />
            {rest && (
              <>
                <Trailers />
                <Characters />
                <LeonidaScrub />
                <Cast />
                <Places />
                <Editions />
                <Vintage />
                <Collection />
                <Finale />
                <Extras />
              </>
            )}
          </main>
          {rest && <Footer />}
        </>
      )}
    </PerfContext.Provider>
  )
}
