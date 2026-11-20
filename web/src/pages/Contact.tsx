import { contactLinks } from '../data/site'
import { PageShell } from '../components/layout/PageShell'

export function ContactPage() {
  const emailLink = contactLinks.find(link => link.label === 'Email')!

  return (
    <PageShell route="/contact">
      <section className="mx-auto max-w-[920px]" aria-labelledby="contact-title">
        <div className="grid gap-14 min-[768px]:grid-cols-[1.1fr_.9fr] min-[768px]:items-center min-[768px]:gap-20">
          <div>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[.14em] text-coral">Direct lines</p>
            <h2 id="contact-title" className="max-w-[10ch] text-[clamp(2.8rem,6vw,5.5rem)] leading-[.88] tracking-[-.09em]">Let's make something useful.</h2>
            <p className="mt-7 m-0 max-w-[36ch] leading-relaxed text-muted">Send a note, share a strange idea or say hello. The inbox is open for thoughtful work and good conversations.</p>
          </div>
          <a className="group block bg-surface p-5 text-ink no-underline transition-colors hover:bg-coral hover:text-night min-[768px]:p-6" href={emailLink.href}>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase text-coral group-hover:text-night/70"><span>Email</span><span aria-hidden="true" className="text-lg transition-transform group-hover:translate-x-1">↗</span></div>
            <strong className="mt-10 block break-words text-[clamp(1.45rem,3.2vw,2.35rem)] font-medium tracking-[-.06em]">{emailLink.value}</strong>
          </a>
        </div>
      </section>
    </PageShell>
  )
}
