const projects = [
  {
    name: 'Orbit UI',
    desc: 'Interactive canvas navigation system. Preact + TypeScript.',
    color: '#f472b6',
    status: 'Live',
  },
  {
    name: 'Glyph',
    desc: 'A minimalist markdown editor with live preview and dark mode.',
    color: '#a78bfa',
    status: 'WIP',
  },
  {
    name: 'Pulsar',
    desc: 'Realtime generative art — p5.js meets procedural noise.',
    color: '#f59e0b',
    status: 'Live',
  },
  {
    name: 'Recall',
    desc: 'Spaced repetition app built with Preact and localforage.',
    color: '#60a5fa',
    status: 'Live',
  },
]

export function WorksPage() {
  return (
    <div style={styles.page}>
      <button style={styles.back} onClick={() => { window.location.hash = '' }}>
        ← Back
      </button>

      <div style={styles.content}>
        <span style={styles.tag}>Portfolio</span>
        <h1 style={styles.title}>Works</h1>
        <p style={styles.subtitle}>Things I've shipped or am shipping.</p>

        <div style={styles.list}>
          {projects.map(p => (
            <div key={p.name} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={{ ...styles.name, color: p.color }}>{p.name}</h3>
                <span style={{
                  ...styles.badge,
                  background: p.status === 'Live' ? '#34d39920' : '#f59e0b20',
                  color:      p.status === 'Live' ? '#34d399'   : '#f59e0b',
                }}>
                  {p.status}
                </span>
              </div>
              <p style={styles.desc}>{p.desc}</p>
            </div>
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
    maxWidth: '680px',
    margin: '0 auto',
    padding: '6rem 1.5rem 4rem',
  },
  tag: {
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#f472b6',
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
    gap: '1rem',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '1.5rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  name: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 700,
  },
  badge: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    padding: '0.2rem 0.6rem',
    borderRadius: '99px',
  },
  desc: {
    margin: 0,
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.6,
  },
}
