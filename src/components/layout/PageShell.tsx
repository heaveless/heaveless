import type { ComponentChildren } from 'preact'
import { pageCopy } from '../../data/site'
import type { Route } from '../../data/site'
import { SiteHeader } from './SiteHeader'

interface PageShellProps {
  route: Exclude<Route, '/'>
  children: ComponentChildren
}

export function PageShell({ route, children }: PageShellProps) {
  const copy = pageCopy[route]
  return (
    <div className="site-page">
      <SiteHeader />
      <main id="main-content" className="page-main">
        <a className="back-link" href="/">← Home</a>
        <div className="page-heading">
          <p className="eyebrow"><span>{copy.accent}</span>{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>
        {children}
      </main>
      <footer className="site-footer"><span>heaveless / personal system</span><span>© {new Date().getFullYear()}</span></footer>
    </div>
  )
}
