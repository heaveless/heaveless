import { useState } from 'preact/hooks'
import { navigation } from '../../data/site'

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <a className="brand" href="/" onClick={closeMenu} aria-label="Heaveless home">
        <span className="brand-mark" aria-hidden="true">H</span>
        <span>heaveless</span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map(item => <a key={item.route} href={item.route} className="nav-link">{item.label}</a>)}
      </nav>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
        aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setIsMenuOpen(open => !open)}
      >
        <span aria-hidden="true">{isMenuOpen ? '×' : 'Menu'}</span>
      </button>
      {isMenuOpen && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          <p className="mobile-nav-label">Navigate</p>
          {navigation.map(item => (
            <a key={item.route} href={item.route} onClick={closeMenu}>
              <span>{item.index}</span>{item.label}
            </a>
          ))}
          <a className="mobile-home" href="/" onClick={closeMenu}>Return home</a>
        </nav>
      )}
    </header>
  )
}
