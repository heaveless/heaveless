import { LocationProvider, Router, Route } from 'preact-iso'
import { Hero } from './components/hero/Component'
import { ForoPage } from './pages/Foro'
import { WorldPage } from './pages/World'
import { HistoryPage } from './pages/History'
import { WorksPage } from './pages/Works'
import { ContactPage } from './pages/Contact'

export function App() {
  return <LocationProvider><Router>
    <Route path="/" component={Hero} />
    <Route path="/foro" component={ForoPage} />
    <Route path="/world" component={WorldPage} />
    <Route path="/history" component={HistoryPage} />
    <Route path="/works" component={WorksPage} />
    <Route path="/contact" component={ContactPage} />
  </Router></LocationProvider>
}
