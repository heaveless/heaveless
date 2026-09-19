import { contactLinks } from '../data/site'
import { PageShell } from '../components/layout/PageShell'

export function ContactPage() {
  return (
    <PageShell route="/contact">
      <section className="content-section contact-section" aria-labelledby="contact-title">
        <h2 id="contact-title">Open a channel.</h2>
        <p>Send a note, share a strange idea or say hello. The inbox is open.</p>
        <div className="contact-list">
          {contactLinks.map(link => <a className="contact-row" key={link.label} href={link.href} target={link.label === 'Email' ? undefined : '_blank'} rel={link.label === 'Email' ? undefined : 'noreferrer'}><span>{link.label}</span><strong>{link.value}</strong><span aria-hidden="true">↗</span></a>)}
        </div>
      </section>
    </PageShell>
  )
}
