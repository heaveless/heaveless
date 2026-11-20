import { hydrate } from 'preact-iso'
import { App } from './app.tsx'
import './index.css'

hydrate(<App />, document.getElementById('app')!)
