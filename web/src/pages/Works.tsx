import { organizations, projects } from '../data/site'
import { PageShell } from '../components/layout/PageShell'

export function WorksPage() {
  return (
    <PageShell route="/works">
      <section className="mx-auto max-w-[920px]" aria-labelledby="projects-title">
        <h2 id="projects-title" className="sr-only">Selected companies</h2>
        <div className="grid gap-3">
          {projects.slice(0, 1).map(project => <a className="group relative flex min-h-[230px] flex-col justify-between bg-coral p-5 text-night no-underline transition-transform hover:-translate-y-1 min-[768px]:min-h-[280px] min-[768px]:p-7" href={`/works/${project.slug}`} key={project.name}>
            <div className="flex justify-between font-mono text-[10px] text-night/70"><span>EXPERIENCE</span><span>{project.category}</span></div>
            <div className="pr-8"><h3 className="mb-2 text-[clamp(2.8rem,7vw,5rem)] tracking-[-.08em]">{project.name}</h3><p className="m-0 max-w-[38ch] leading-relaxed text-night/75">{project.description}</p></div>
            <span className="absolute right-5 bottom-5 transition-transform group-hover:translate-x-1 min-[768px]:right-7 min-[768px]:bottom-7" aria-hidden="true">↗</span>
          </a>)}
          <div className="grid gap-3 min-[768px]:grid-cols-2">
            {projects.slice(1).map(project => <a className="group relative flex min-h-[150px] flex-col justify-between bg-surface p-5 no-underline transition-transform hover:-translate-y-1" href={`/works/${project.slug}`} key={project.name}>
              <div className="flex justify-between font-mono text-[10px] text-coral"><span>EXPERIENCE</span><span className="text-muted">{project.category}</span></div>
              <div className="pr-8"><h3 className="mb-1 text-[clamp(1.5rem,3vw,2.2rem)] tracking-[-.06em]">{project.name}</h3><p className="m-0 max-w-[38ch] leading-relaxed text-muted">{project.description}</p></div>
              <span className="absolute right-5 bottom-5 text-coral transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span>
            </a>)}
            <a className="group relative flex min-h-[150px] flex-col justify-between bg-surface p-5 no-underline transition-transform hover:-translate-y-1" href="https://www.linkedin.com/in/llamocca/" target="_blank" rel="noreferrer">
              <div className="flex justify-between font-mono text-[10px] text-coral"><span>PROFILE</span><span className="text-muted">LINKEDIN</span></div>
              <div className="pr-8"><h3 className="mb-1 text-[clamp(1.5rem,3vw,2.2rem)] tracking-[-.06em]">See the wider archive.</h3><p className="m-0 max-w-[38ch] leading-relaxed text-muted">More work, experience and selected projects.</p></div>
              <span className="absolute right-5 bottom-5 text-coral transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <section className="mt-16" aria-labelledby="organizations-title">
          <div className="mb-6">
            <h2 id="organizations-title" className="m-0 text-[clamp(1.8rem,4vw,3rem)] tracking-[-.07em]">Organizations</h2>
          </div>
          <div className="grid gap-x-10 gap-y-8 min-[768px]:grid-cols-3 min-[768px]:gap-y-10">
            {organizations.map(organization => <a className="group block no-underline" href={organization.href} target="_blank" rel="noreferrer" key={organization.name}>
              <div className="mb-3 flex justify-between font-mono text-[10px] text-muted"><span>{organization.handle}</span><span aria-hidden="true" className="text-coral transition-transform group-hover:translate-x-1">↗</span></div>
              <h3 className="m-0 text-[clamp(1.35rem,2.5vw,1.9rem)] tracking-[-.06em] transition-colors group-hover:text-coral">{organization.name}</h3>
            </a>)}
          </div>
        </section>
      </section>
    </PageShell>
  )
}
