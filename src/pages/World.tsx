const places = [
  { name: 'Tokyo',         desc: 'Neon streets, quiet temples.',   color: '#60a5fa' },
  { name: 'Reykjavik',     desc: 'Aurora skies and hot springs.',  color: '#34d399' },
  { name: 'Medellín',      desc: 'Eternal spring, rising city.',   color: '#f59e0b' },
  { name: 'Tbilisi',       desc: 'Ancient wine, modern energy.',   color: '#f472b6' },
  { name: 'Chiang Mai',    desc: 'Mountains, monks and mangos.',   color: '#a78bfa' },
]

export function WorldPage() {
  return (
    <div style={styles.page}>
      <button style={styles.back} onClick={() => { window.location.hash = '' }}>
        ← Back
      </button>

      <div style={styles.content}>
        <span style={styles.tag}>Explore</span>
        <h1 style={styles.title}>World</h1>
        <p style={styles.subtitle}>Places that shaped the way I see things.</p>

        <div style={styles.grid}>
          {places.map(p => (
            <div key={p.name} style={{ ...styles.card, borderColor: p.color + '40' }}>
              <div style={{ ...styles.dot, background: p.color }} />
              <h3 style={{ ...styles.placeName, color: p.color }}>{p.name}</h3>
              <p style={styles.placeDesc}>{p.desc}</p>
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
    maxWidth: '720px',
    margin: '0 auto',
    padding: '6rem 1.5rem 4rem',
  },
  tag: {
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#60a5fa',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid',
    borderRadius: '16px',
    padding: '1.5rem',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginBottom: '1rem',
  },
  placeName: {
    margin: '0 0 0.4rem',
    fontSize: '1.1rem',
    fontWeight: 700,
  },
  placeDesc: {
    margin: 0,
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 1.6,
  },
}
