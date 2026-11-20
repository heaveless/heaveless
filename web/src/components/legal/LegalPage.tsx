import type { ComponentChildren } from 'preact'
import { PageShell } from '../layout/PageShell'
import type { Route } from '../../data/site'

interface LegalPageProps {
  route: Extract<Route, '/terms' | '/privacy'>
  title: string
  intro: string
  updated: string
  children: ComponentChildren
}

export function LegalPage({ route, title, intro, updated, children }: LegalPageProps) {
  return (
    <PageShell route={route} bare>
      <article className="mx-auto max-w-[760px]">
        <header className="border-b border-line pb-8">
          <p className="m-0 font-mono text-[10px] uppercase tracking-[.14em] text-coral">Legal</p>
          <h1 className="mt-4 mb-0 text-[clamp(2.4rem,6vw,4rem)] font-bold leading-[.9] tracking-[-.08em]">{title}</h1>
          <p className="mt-4 mb-0 font-mono text-[9px] uppercase tracking-[.1em] text-muted">Last updated · {updated}</p>
        </header>

        <p className="mt-8 mb-0 max-w-[60ch] leading-relaxed text-muted">{intro}</p>

        <div className="mt-10 grid gap-10">{children}</div>

        <div className="mt-14 border-t border-line pt-6">
          <p className="m-0 text-sm leading-relaxed text-muted">
            Questions? Write to <a className="text-ink underline decoration-line underline-offset-4 transition-colors hover:text-coral" href="mailto:hi@heaveless.com">hi@heaveless.com</a>.
          </p>
        </div>
      </article>
    </PageShell>
  )
}

export function LegalSection({ number, title, children }: { number: string; title: string; children: ComponentChildren }) {
  return (
    <section className="grid gap-3 min-[640px]:grid-cols-[2.5rem_1fr] min-[640px]:gap-6">
      <p className="m-0 font-mono text-[10px] text-coral">{number}</p>
      <div className="min-w-0">
        <h2 className="m-0 text-[clamp(1.25rem,2.6vw,1.6rem)] tracking-[-.05em]">{title}</h2>
        <div className="mt-3 grid gap-3 text-sm leading-relaxed text-muted">{children}</div>
      </div>
    </section>
  )
}

export function LegalList({ items }: { items: ComponentChildren[] }) {
  return (
    <ul className="m-0 grid list-none gap-2 p-0">
      {items.map((item, index) => (
        <li className="flex gap-2" key={index}>
          <span className="text-coral" aria-hidden="true">+</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
