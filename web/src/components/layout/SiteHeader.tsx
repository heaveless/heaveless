import { useEffect, useState } from 'preact/hooks'
import { useLocation } from 'preact-iso'
import { navigation } from '../../data/site'

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { path } = useLocation()

  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    if (!isMenuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <header className="relative z-40 mx-auto flex h-[68px] w-[calc(100%-40px)] items-center justify-between min-[768px]:h-[76px] min-[768px]:w-[calc(100%-64px)] min-[1320px]:w-[1320px]">
      <a className="absolute left-0 top-2 -translate-y-[160%] bg-coral px-2.5 py-2 font-mono text-[10px] text-night transition-transform focus-visible:translate-y-0" href="#main-content">Skip to content</a>
      <a className="inline-flex items-center gap-2.5 font-bold tracking-[-.04em] text-white" href="/" onClick={closeMenu} aria-label="Heaveless home">
        <span className="grid size-7 place-items-center border border-coral font-mono text-xs text-coral" aria-hidden="true">H</span>
        <span>heaveless</span>
      </a>
      <nav className="hidden gap-7 min-[768px]:flex" aria-label="Primary navigation">
        {navigation.map(item => {
          const isActive = path === item.route || (item.route !== '/' && path.startsWith(`${item.route}/`))
          return <a key={item.route} href={item.route} aria-current={isActive ? 'page' : undefined} className={`font-mono text-[11px] uppercase tracking-[.04em] transition-colors hover:text-coral ${isActive ? 'text-ink' : 'text-muted'}`}>{item.label}</a>
        })}
      </nav>
      <button
        className="relative z-[2] block cursor-pointer border border-line bg-transparent px-3 py-2 text-sm text-ink min-[768px]:hidden"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
        aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setIsMenuOpen(open => !open)}
      >
        <span aria-hidden="true">{isMenuOpen ? '×' : 'Menu'}</span>
      </button>
      {isMenuOpen && (
        <nav id="mobile-navigation" className="fixed inset-0 z-0 flex flex-col justify-between bg-surface px-8 pb-10 pt-28 min-[768px]:hidden" aria-label="Mobile navigation">
          <div>
            <p className="mb-10 font-mono text-[10px] uppercase tracking-[.15em] text-muted">Navigate</p>
            <div className="grid gap-5">
          {navigation.map(item => {
            const isActive = path === item.route || (item.route !== '/' && path.startsWith(`${item.route}/`))
            return <a className={`group flex w-full max-w-sm items-baseline gap-4 border-b border-line pb-3 font-semibold tracking-[-.06em] transition-[border-color,color,translate] hover:-translate-y-0.5 hover:border-coral hover:text-coral ${isActive ? 'text-coral' : 'text-ink'}`} aria-current={isActive ? 'page' : undefined} key={item.route} href={item.route} onClick={closeMenu}>
              <span className="font-mono text-xs font-normal tracking-normal text-coral">{item.index}</span><span className="text-[clamp(2.4rem,11vw,4rem)] leading-none">{item.label}</span>
            </a>
          })}
            </div>
          </div>
          <p className="m-0 max-w-[190px] font-mono text-[10px] uppercase leading-relaxed tracking-[.1em] text-muted">The interface is the invitation.</p>
        </nav>
      )}
    </header>
  )
}
