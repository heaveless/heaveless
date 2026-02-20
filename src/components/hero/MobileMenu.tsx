import { useState } from 'preact/hooks'
import { NODES } from './constants'

const HAMBURGER_SIZE = 44
const OFFSET         = 24

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const navigate = (route: string) => {
    window.location.hash = '#' + route
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          position:       'fixed',
          top:            OFFSET,
          right:          OFFSET,
          width:          HAMBURGER_SIZE,
          height:         HAMBURGER_SIZE,
          background:     'rgba(0,0,0,0.65)',
          border:         '1px solid rgba(255,255,255,0.18)',
          borderRadius:   10,
          cursor:         'pointer',
          zIndex:         200,
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'center',
          alignItems:     'center',
          gap:            6,
          padding:        0,
        }}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen
          ? <CloseIcon />
          : <HamburgerIcon />
        }
      </button>

      {isOpen && (
        <nav
          style={{
            position:       'fixed',
            inset:          0,
            background:     'rgba(0,0,0,0.92)',
            zIndex:         199,
            display:        'flex',
            flexDirection:  'column',
            justifyContent: 'center',
            alignItems:     'center',
            gap:            36,
          }}
          onClick={() => setIsOpen(false)}
        >
          {NODES.map(node => (
            <button
              key={node.route}
              onClick={e => { e.stopPropagation(); navigate(node.route) }}
              style={{
                background:    'none',
                border:        'none',
                color:         '#fff',
                fontSize:      22,
                fontFamily:    "'Orbitron', sans-serif",
                letterSpacing: 5,
                textTransform: 'uppercase',
                cursor:        'pointer',
                padding:       '8px 0',
              }}
            >
              {node.langs[0]}
            </button>
          ))}
        </nav>
      )}
    </>
  )
}

function HamburgerIcon() {
  return (
    <>
      {([0, 1, 2] as const).map(i => (
        <span
          key={i}
          style={{ width: 22, height: 2, background: '#fff', display: 'block' }}
        />
      ))}
    </>
  )
}

function CloseIcon() {
  const style: { position: 'absolute'; width: number; height: number; background: string; borderRadius: number; top: number; left: number } = {
    position:     'absolute',
    width:        22,
    height:       2,
    background:   '#fff',
    borderRadius: 1,
    top:          21,
    left:         11,
  }
  return (
    <span style={{ position: 'relative', width: HAMBURGER_SIZE, height: HAMBURGER_SIZE, display: 'block' }}>
      <span style={{ ...style, transform: 'rotate(45deg)' }} />
      <span style={{ ...style, transform: 'rotate(-45deg)' }} />
    </span>
  )
}
