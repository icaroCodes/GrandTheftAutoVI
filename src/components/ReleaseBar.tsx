import { Ps5Logo, XboxLogo } from './BrandIcons'

export function ReleaseBar({ className = '', onReserve }: { className?: string; onReserve: () => void }) {
  return (
    <div className={`rbar ${className}`}>
      <p className="rbar__date">
        Disponível em <span>19 de novembro</span> de 2026
      </p>
      <button className="btn-reserve" onClick={onReserve}>
        Reserve agora
      </button>
      <div className="rbar__platforms">
        <Ps5Logo className="rbar__ps5" />
        <XboxLogo className="rbar__xbox" />
      </div>
    </div>
  )
}
