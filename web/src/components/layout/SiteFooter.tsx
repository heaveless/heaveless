export function SiteFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`mx-auto flex flex-wrap justify-between gap-5 py-6 font-mono text-[9px] uppercase text-muted min-[768px]:text-[10px] ${className}`}>
      <span>heaveless / personal system</span>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <a className="transition-colors hover:text-coral" href="/terms">Terms</a>
        <a className="transition-colors hover:text-coral" href="/privacy">Privacy</a>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
