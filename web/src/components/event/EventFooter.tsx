import { christmasEvent as event } from '../../data/event'
import { SnowHang } from './Snow'
import { contactHref } from './campaign'
import { useLang } from './lang'

/**
 * The back cover: one line of sign-off, the anchors, the small print. It opens
 * with the paper edge of the snow field hanging into it, so the page closes on
 * the same silhouette it used at the opening.
 */
export function EventFooter() {
  const { t } = useLang()

  const small = [
    { label: t.footer.terms, href: '/terms' },
    { label: t.footer.privacy, href: '/privacy' },
    { label: t.footer.home, href: '/' },
  ]

  return (
    <footer id="event-footer" className="relative bg-pine-950 pb-10 pt-[74px] min-[768px]:pt-[106px]">
      <SnowHang
        id="footer-edge"
        className="pointer-events-none absolute inset-x-0 -top-px h-[45px] w-full text-paper min-[768px]:h-[71px]"
      />
      <div className="mx-auto max-w-[1200px] px-5 min-[768px]:px-8">
        <p className="event-script m-0 text-[2.4rem] leading-none text-lime min-[768px]:text-[2.8rem]">
          {t.footer.greeting}
        </p>

        <p className="mt-5 mb-0 max-w-[46ch] text-[0.95rem] leading-[1.7] text-paper/70">
          {t.footer.sentence(t.city)}
        </p>

        <p className="mt-2.5 mb-0 text-[0.95rem] leading-[1.7] text-paper/60">
          {t.footer.contact}{' '}
          <a
            href={contactHref}
            className="text-paper/85 underline decoration-paper/25 underline-offset-4 transition-colors hover:decoration-paper/70"
          >
            {event.contactEmail}
          </a>
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="m-0 max-w-[38ch] text-[9.5px] font-bold uppercase leading-[1.7] tracking-[.18em] text-paper/60">
            {t.footer.personal}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {small.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-[9.5px] font-bold uppercase tracking-[.18em] text-paper/60 no-underline transition-colors hover:text-lime"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
