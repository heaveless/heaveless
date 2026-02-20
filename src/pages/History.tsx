const timeline = [
  { year: '2024', event: 'Started building personal projects in public.',         color: '#34d399' },
  { year: '2023', event: 'Went deep into generative art and canvas rendering.',   color: '#60a5fa' },
  { year: '2022', event: 'First open source contribution merged.',                color: '#f59e0b' },
  { year: '2021', event: 'Shipped first web app used by real people.',            color: '#f472b6' },
  { year: '2020', event: 'Wrote first line of JavaScript. It was a console.log.', color: '#a78bfa' },
]

export function HistoryPage() {
  return (
    <div style={styles.page}>
      <button style={styles.back} onClick={() => { window.location.hash = '' }}>
        ← Back
      </button>

      <div style={styles.content}>
        <span style={styles.tag}>Archive</span>
        <h1 style={styles.title}>History</h1>
        <p style={styles.subtitle}>A timeline of moments worth keeping.</p>

        <div style={styles.timeline}>
          {timeline.map((item, i) => (
            <div key={i} style={styles.row}>
              <div style={styles.yearCol}>
                <span style={{ ...styles.year, color: item.color }}>{item.year}</span>
              </div>
              <div style={styles.line}>
                <div style={{ ...styles.dot, background: item.color }} />
                {i < timeline.length - 1 && <div style={styles.connector} />}
              </div>
              <div style={styles.eventCol}>
                <p style={styles.event}>{item.event}</p>
              </div>
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
    maxWidth: '640px',
    margin: '0 auto',
    padding: '6rem 1.5rem 4rem',
  },
  tag: {
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#34d399',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 800,
    margin: '0.25rem 0 0.5rem',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '3rem',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'flex-start',
  },
  yearCol: {
    width: '48px',
    flexShrink: 0,
    paddingTop: '2px',
  },
  year: {
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  line: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: '4px',
  },
  connector: {
    width: '1px',
    flexGrow: 1,
    minHeight: '3rem',
    background: 'rgba(255,255,255,0.1)',
    margin: '4px 0',
  },
  eventCol: {
    paddingBottom: '0.5rem',
  },
  event: {
    margin: 0,
    fontSize: '0.975rem',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.8)',
  },
}
