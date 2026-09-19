import { LocationProvider, Router, Route } from 'preact-iso'
import { Hero } from './components/hero/Component'
import { WorldPage } from './pages/World'
import { WorksPage } from './pages/Works'
import { ContactPage } from './pages/Contact'
import { NotFoundPage } from './pages/NotFound'
import { ProjectPage } from './pages/Project'

export function App() {
  return <LocationProvider><Router>
    <Route path="/" component={Hero} />
    <Route path="/world" component={WorldPage} />
    <Route path="/works" component={WorksPage} />
    <Route path="/works/metrica-global" component={() => <ProjectPage slug="metrica-global" />} />
    <Route path="/works/culqi" component={() => <ProjectPage slug="culqi" />} />
    <Route path="/works/tekton-labs" component={() => <ProjectPage slug="tekton-labs" />} />
    <Route path="/works/sky-airline" component={() => <ProjectPage slug="sky-airline" />} />
    <Route path="/works/fourthwall" component={() => <ProjectPage slug="fourthwall" />} />
    <Route path="/works/shopify" component={() => <ProjectPage slug="shopify" />} />
    <Route path="/contact" component={ContactPage} />
    <Route default component={NotFoundPage} />
  </Router></LocationProvider>
}
