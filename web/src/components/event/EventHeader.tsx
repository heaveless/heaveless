import { useEffect, useRef, useState } from 'preact/hooks'
import { GiftMark, SnowflakeMark } from './Marks'
import { donationOpen, giveHref, giveLinkProps, giveShortLabel } from './campaign'
import { useLang } from './lang'

/**
 * The header belongs to the whole page: pine while it sits on the opening
 * field, paper once the snow field reaches it, and pine again over the closing
 * footer. No second bar, no jump: the same row changes surface as the page
 * changes surface.
 */
export function EventHeader() {
  const { lang, setLang, t } = useLang()
  const [onPaper, setOnPaper] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const paper = document.getElementById('paper-start')
    const footer = document.getElementById('event-footer')
    const footerEdge = document.getElementById('footer-edge')
    if (!paper) return

    let frame = 0
    const update = () => {
      frame = 0
      const height = headerRef.current?.offsetHeight ?? 72
      const paperReached = paper.getBoundingClientRect().top <= height
      // The footer opens with a paper edge hanging into it: stay on paper until
      // that edge has scrolled past the header and pine is really under it.
      const edge = footerEdge?.getBoundingClientRect().height ?? 0
      const footerReached = footer ? footer.getBoundingClientRect().top + edge <= height : false
      setOnPaper(paperReached && !footerReached)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const links = [
    { label: t.nav.plan, href: '#plan' },
    { label: t.nav.gifts, href: '#gifts' },
    { label: t.nav.note, href: '#note' },
    { label: t.nav.wall, href: '#wall' },
  ]

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 transition-colors duration-500 ${
        onPaper ? 'bg-paper/95 text-forest shadow-[0_1px_0_rgb(8_46_34_/_0.10)] backdrop-blur-xl' : 'bg-pine-800/90 backdrop-blur-md'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-[11px] focus:font-bold focus:uppercase focus:tracking-[.12em] focus:text-pine-950"
      >
        {t.header.skip}
      </a>

      <div className="mx-auto flex h-[66px] max-w-[1200px] items-center gap-2 px-4 min-[420px]:gap-3 min-[420px]:px-5 min-[768px]:h-[80px] min-[768px]:gap-6 min-[768px]:px-8">
        <a
          href="/event"
          aria-label={t.header.home}
          className="group inline-flex min-h-11 min-w-0 items-center gap-2.5 no-underline"
        >
          <SnowflakeMark
            className={`size-5 shrink-0 transition-colors duration-500 ${onPaper ? 'text-pine-700' : 'text-lime'} group-hover:rotate-45 motion-reduce:group-hover:rotate-0`}
          />
          <span className="min-w-0">
            <span
              className={`block truncate text-[1.08rem] font-semibold leading-none tracking-[-.015em] transition-colors duration-500 ${
                onPaper ? 'text-forest' : 'text-paper'
              }`}
            >
              heaveless
            </span>
            <span
              className={`mt-1 block truncate text-[9px] font-bold uppercase leading-none tracking-[.22em] transition-colors duration-500 ${
                onPaper ? 'text-forest/65' : 'text-paper/60'
              }`}
            >
              {t.header.label}
            </span>
          </span>
        </a>

        <nav aria-label={t.header.sections} className="ml-auto hidden items-center gap-5 min-[768px]:flex min-[900px]:gap-7">
          {links.map(link => (
            <a key={link.href} href={link.href} className="group flex min-h-11 items-center no-underline">
              <span
                className={`text-[12.5px] font-medium transition-colors ${
                  onPaper ? 'text-forest/72 group-hover:text-forest' : 'text-paper/70 group-hover:text-paper'
                }`}
              >
                {link.label}
              </span>
            </a>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 min-[420px]:gap-2 min-[768px]:ml-0 min-[768px]:gap-3">
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            aria-label={t.lang.switchTo}
            className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center px-1 text-[11px] font-semibold underline underline-offset-4 transition-colors ${
              onPaper
                ? 'text-forest/70 decoration-forest/25 hover:text-forest hover:decoration-forest/70'
                : 'text-paper/70 decoration-paper/25 hover:text-paper hover:decoration-paper/70'
            }`}
          >
            {t.lang.target}
          </button>

          {donationOpen && (
            <a
              href={giveHref}
              {...giveLinkProps}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-lime px-3 text-[11px] font-bold text-pine-950 no-underline transition-colors hover:bg-[#eafb8e] min-[420px]:gap-2 min-[420px]:px-4 min-[420px]:text-[11.5px]"
            >
              <GiftMark className="size-3 min-[420px]:size-3.5" />
              {giveShortLabel(lang)}
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
