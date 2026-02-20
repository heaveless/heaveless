const links = [
  { label: 'GitHub',   handle: '@heaveless', color: '#a78bfa', href: '#' },
  { label: 'Twitter',  handle: '@heaveless', color: '#60a5fa', href: '#' },
  { label: 'Email',    handle: 'hi@heaveless.dev', color: '#34d399', href: '#' },
]

export function ContactPage() {
  return (
    <div style={styles.page}>
      <button style={styles.back} onClick={() => { window.location.hash = '' }}>
        ← Back
      </button>

      <div style={styles.content}>
        <span style={styles.tag}>Say hi</span>
        <h1 style={styles.title}>Contact</h1>
        <p style={styles.subtitle}>Open to collabs, ideas and good conversations.</p>

        <div style={styles.list}>
          {links.map(l => (
            <a key={l.label} href={l.href} style={styles.card}>
              <span style={styles.label}>{l.label}</span>
              <span style={{ ...styles.handle, color: l.color }}>{l.handle}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, preact.JSX.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0d0d1a',
    color: '#fff',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  back: {
    position: 'fixed',
    top: '1.5rem',
    left: '1.5rem',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    backdropFilter: 'blur(8px)',
  },
  content: {
    maxWidth: '480px',
    margin: '0 auto',
    padding: '6rem 1.5rem 4rem',
  },
  tag: {
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#a78bfa',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 800,
    margin: '0.25rem 0 0.5rem',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '2.5rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  label: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 500,
  },
  handle: {
    fontSize: '0.95rem',
    fontWeight: 700,
  },
}
