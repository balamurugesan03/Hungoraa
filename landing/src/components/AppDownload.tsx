import { useRevealSelf } from '../hooks/useReveal'
import { useTilt } from '../hooks/useTilt'
import { IconApple, IconPlay, IconQr } from './Icons'
import './AppDownload.css'

export default function AppDownload() {
  const ref = useRevealSelf<HTMLDivElement>()
  const tiltRef = useTilt<HTMLDivElement>(6)

  return (
    <section id="download" className="section download">
      <div className="download__panel glass-card" ref={ref}>
        <div className="download__glow" />
        <div className="download__copy">
          <span className="eyebrow">Get the app</span>
          <h2>
            Your table is one <span className="gradient-text">tap</span> away.
          </h2>
          <p>
            Available on iOS and Android. Scan the code or grab it from your app store to start booking,
            unlocking offers, and paying bills in seconds.
          </p>
          <div className="download__badges">
            <a href="#" className="download__badge">
              <IconApple size={22} />
              <span>
                Download on the <strong>App Store</strong>
              </span>
            </a>
            <a href="#" className="download__badge">
              <IconPlay size={20} />
              <span>
                Get it on <strong>Google Play</strong>
              </span>
            </a>
          </div>
        </div>

        <div className="download__qr-stage" ref={tiltRef}>
          <div className="download__qr glass-card">
            <IconQr size={92} />
            <span>Scan to download</span>
          </div>
        </div>
      </div>
    </section>
  )
}
