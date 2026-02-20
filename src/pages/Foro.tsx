const posts = [
  { id: 1, user: 'nova_x',    time: '2h ago',  title: 'Anyone else building with Preact in 2025?',          replies: 12 },
  { id: 2, user: 'driftcode', time: '5h ago',  title: 'Show your setup — desk & dev environment thread',    replies: 34 },
  { id: 3, user: 'zyph',      time: '1d ago',  title: 'Best resources for learning canvas animations?',     replies: 8  },
  { id: 4, user: 'lmnop',     time: '2d ago',  title: 'Dark mode systems — CSS vars vs Tailwind?',          replies: 21 },
  { id: 5, user: 'vector_77', time: '3d ago',  title: 'Minimal portfolio inspo — post yours',               replies: 57 },
]

export function ForoPage() {
  return (
    <div style={styles.page}>
      <button style={styles.back} onClick={() => { window.location.hash = '' }}>
        ← Back
      </button>

      <div style={styles.content}>
        <span style={styles.tag}>Community</span>
        <h1 style={styles.title}>Foro</h1>
        <p style={styles.subtitle}>A place to talk, share and connect.</p>

        <div style={styles.list}>
          {posts.map(p => (
            <div key={p.id} style={styles.card}>
              <div style={styles.cardTop}>
                <span style={styles.postUser}>{p.user}</span>
                <span style={styles.postTime}>{p.time}</span>
              </div>
              <p style={styles.postTitle}>{p.title}</p>
              <span style={styles.replies}>{p.replies} replies</span>
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
    color: '#f59e0b',
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
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  postUser: {
    fontSize: '0.8rem',
    color: '#f59e0b',
    fontWeight: 600,
  },
  postTime: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.3)',
  },
  postTitle: {
    margin: '0 0 0.75rem',
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  replies: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.3)',
  },
}
