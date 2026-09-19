import { projects } from '../data/site'
import { SiteHeader } from '../components/layout/SiteHeader'

interface ProjectPageProps {
  slug: string
}

export function ProjectPage({ slug }: ProjectPageProps) {
  const project = projects.find(item => item.slug === slug)

  if (!project) return null

  return (
    <div className="min-h-[100dvh] bg-night">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-[calc(100%-40px)] max-w-[920px] py-11 min-[768px]:w-[calc(100%-64px)] min-[768px]:py-[72px] min-[768px]:pb-[100px]">
        <header className="max-w-[760px]">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[.14em] text-coral">Experience / Company</p>
          <h1 className="m-0 text-[clamp(3.8rem,14vw,8rem)] font-bold leading-[.85] tracking-[-.09em]">{project.name}</h1>
          <p className="mt-8 max-w-[560px] text-[clamp(1.15rem,2vw,1.5rem)] leading-relaxed text-muted">{project.context}</p>
        </header>
        <section className="mt-20 grid gap-10 min-[768px]:grid-cols-[1fr_280px] min-[768px]:gap-20" aria-labelledby="project-details-title">
          <div><h2 id="project-details-title" className="mb-4 text-[clamp(1.8rem,4vw,3rem)] tracking-[-.07em]">About this work</h2><p className="m-0 max-w-[58ch] leading-relaxed text-muted">{project.description} This is one of the companies and products that shaped the work collected here.</p></div>
          <dl className="grid gap-5 font-mono text-[10px] uppercase">
            <div><dt className="mb-2 text-muted">Scope</dt><dd className="m-0 text-ink">{project.scope}</dd></div>
            <div><dt className="mb-2 text-muted">Type</dt><dd className="m-0 text-ink">{project.category}</dd></div>
          </dl>
        </section>
        <a className="mt-20 inline-flex bg-coral px-5 py-4 font-mono text-[10px] uppercase text-night no-underline transition-transform hover:-translate-y-1" href={project.href} target="_blank" rel="noreferrer">Visit company <span aria-hidden="true">↗</span></a>
      </main>
      <footer className="mx-auto flex w-[calc(100%-40px)] justify-between gap-5 py-6 font-mono text-[9px] uppercase text-muted min-[768px]:w-[calc(100%-64px)] min-[1100px]:w-[920px] min-[768px]:text-[10px]"><span>heaveless / personal system</span><span>© {new Date().getFullYear()}</span></footer>
    </div>
  )
}
