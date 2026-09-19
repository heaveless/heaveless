import robotImage from '../../assets/robot.png'
import { navigation } from '../../data/site'
import { SiteHeader } from '../layout/SiteHeader'

export function Hero() {
  return (
    <div className="hero-page">
      <SiteHeader />
      <main id="main-content" className="hero-main">
        <section className="hero-copy" aria-labelledby="hero-title">
          <p className="eyebrow"><span>00</span>Personal world / 2026</p>
          <h1 id="hero-title">Build a world<br /><em>worth visiting.</em></h1>
          <p className="hero-intro">A living archive of ideas, places, experiments and conversations.</p>
          <a className="primary-link" href="/works">See the work <span aria-hidden="true">↗</span></a>
        </section>
        <section className="hero-visual" aria-label="Explore the site">
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <img className="robot-image" src={robotImage} width="1024" height="1024" alt="Illustrated robot looking at a glowing screen" />
          <div className="screen-glow" aria-hidden="true" />
          {navigation.map((item, index) => (
            <a key={item.route} className={`orbit-link orbit-link-${index + 1}`} href={item.route}>
              <span>{item.index}</span>{item.label}
            </a>
          ))}
          <p className="visual-caption">Choose a direction <span aria-hidden="true">↓</span></p>
        </section>
      </main>
      <p className="hero-footer">The interface is the invitation.</p>
    </div>
  )
}
