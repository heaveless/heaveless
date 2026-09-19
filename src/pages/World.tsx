import { places } from '../data/site'
import { PageShell } from '../components/layout/PageShell'

export function WorldPage() {
  return (
    <PageShell route="/world">
      <section className="content-section" aria-labelledby="places-title">
        <h2 id="places-title" className="sr-only">Places</h2>
        <div className="place-grid">
          {places.map((place, index) => (
            <article className={`place-card place-card-${index + 1}`} key={place.name}>
              <p className="card-index">0{index + 1}</p><h3>{place.name}</h3><p>{place.description}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
