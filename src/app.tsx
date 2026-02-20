import { useState, useEffect } from 'preact/hooks'
import { Hero }        from './components/hero/Component'
import { ForoPage }    from './pages/Foro'
import { WorldPage }   from './pages/World'
import { HistoryPage } from './pages/History'
import { WorksPage }   from './pages/Works'
import { ContactPage } from './pages/Contact'

function getRoute(): string {
  return window.location.hash.replace('#', '') || '/'
}

export function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const handler = () => setRoute(getRoute())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  switch (route) {
    case '/foro':    return <ForoPage />
    case '/world':   return <WorldPage />
    case '/history': return <HistoryPage />
    case '/works':   return <WorksPage />
    case '/contact': return <ContactPage />
    default:         return <Hero />
  }
}
