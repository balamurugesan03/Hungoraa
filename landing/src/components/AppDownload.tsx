import { useRevealSelf } from '../hooks/useReveal'
import { IconApple, IconPlay, IconQr } from './Icons'
import './AppDownload.css'

export default function AppDownload() {
  const ref = useRevealSelf<HTMLDivElement>()

  return (
    <section id="download" className="section download">
      <div className="download__panel panel--raised panel ticks" ref={ref}>
        <div className="download__glow" />
        <div className="download__copy">
          <span className="eyebrow">Get the app</span>
          <h2>
            Your table is one <span className="accent">tap</span> away.
          </h2>
          <p>
            On iOS and Android. Scan the code or grab it from your store to start reserving, unlocking
            offers, and settling bills in seconds.
          </p>
          <div className="download__badges">
            <a href="#" className="download__badge">
              <IconApple size={20} />
              <span>Download on the <strong>App Store</strong></span>
            </a>
            <a href="#" className="download__badge">
              <IconPlay size={18} />
              <span>Get it on <strong>Google Play</strong></span>
            </a>
          </div>
        </div>

        <div className="download__qr">
          <IconQr size={88} />
          <span className="mono">Scan to download</span>
        </div>
      </div>
    </section>
  )
}
