import { timeline } from '../data/site'
import { PageShell } from '../components/layout/PageShell'

export function HistoryPage() {
  return (
    <PageShell route="/history">
      <section className="content-section" aria-labelledby="timeline-title">
        <h2 id="timeline-title" className="sr-only">Timeline</h2>
        <ol className="timeline">
          {timeline.map((item, index) => (
            <li key={item.year}><time dateTime={item.year}>{item.year}</time><span className="timeline-marker" aria-hidden="true" /><p>{item.event}</p><span className="timeline-number">0{timeline.length - index}</span></li>
          ))}
        </ol>
      </section>
    </PageShell>
  )
}
