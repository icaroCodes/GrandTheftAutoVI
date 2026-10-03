import { Ps5Logo, XboxLogo } from './BrandIcons'

export function PlatformBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`platforms ${className}`} aria-label="Plataformas">
      <Ps5Logo className="platforms__ps5" />
      <XboxLogo className="platforms__xbox" />
    </div>
  )
}
