import { projects } from '../data/site'
import { PageShell } from '../components/layout/PageShell'

export function WorksPage() {
  return (
    <PageShell route="/works">
      <section className="content-section" aria-labelledby="projects-title">
        <h2 id="projects-title" className="sr-only">Selected projects</h2>
        <div className="project-grid">
          {projects.map((project, index) => (
            <article className={`project-card project-card-${index + 1}`} key={project.name}>
              <div className="project-top"><span>0{index + 1}</span><span className={project.status === 'Live' ? 'status-live' : 'status-progress'}>{project.status}</span></div>
              <h3>{project.name}</h3><p>{project.description}</p><span className="project-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
