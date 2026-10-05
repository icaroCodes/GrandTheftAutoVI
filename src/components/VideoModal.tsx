import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { Trailer } from '../lib/content'
import { useLenis } from '../lib/scroll'

export function VideoModal({ trailer, onClose }: { trailer: Trailer | null; onClose: () => void }) {
  const lenis = useLenis()

  useEffect(() => {
    if (!trailer) return
    lenis?.stop()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [trailer, lenis, onClose])

  // portal: o .trailers tem isolation: isolate e prenderia o modal abaixo das seções seguintes
  return createPortal(
    <AnimatePresence>
      {trailer && (
        <motion.div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label={trailer.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal__panel"
            initial={{ scale: 0.88, y: 40, clipPath: 'inset(12% 8% 12% 8% round 24px)' }}
            animate={{ scale: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 16px)' }}
            exit={{ scale: 0.92, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__video">
              {trailer.ageRestricted ? (
                <div className="modal__gate" style={{ backgroundImage: `url(${trailer.image})` }}>
                  <div>
                    <span className="tag">18+</span>
                    <p className="display modal__gate-title">Conteúdo com restrição de idade</p>
                    <p>O YouTube não permite incorporar este vídeo. Assista no YouTube (com login) ou na Netflix.</p>
                    <div className="modal__actions">
                      <a
                        className="btn btn--primary"
                        href={`https://www.youtube.com/watch?v=${trailer.youtubeId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Assistir no YouTube
                      </a>
                      <a className="btn btn--ghost" href="https://www.netflix.com/GTAVI" target="_blank" rel="noreferrer">
                        Assistir na Netflix
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${trailer.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={trailer.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              )}
            </div>
            <div className="modal__bar">
              <div>
                <p className="modal__sub">{trailer.subtitle}</p>
                <p className="modal__title">{trailer.title}</p>
              </div>
              <div className="modal__actions">
                <a className="btn btn--ghost btn--sm" href={trailer.download} target="_blank" rel="noreferrer">
                  Baixar 4K oficial ({trailer.size})
                </a>
                <a
                  className="btn btn--ghost btn--sm"
                  href={`https://www.youtube.com/watch?v=${trailer.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  YouTube
                </a>
                <button className="btn btn--primary btn--sm" onClick={onClose} aria-label="Fechar vídeo">
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
