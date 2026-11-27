import { useEffect, useState } from 'preact/hooks'
import { PageShell } from '../components/layout/PageShell'
import { DonationFlow } from '../components/live/DonationFlow'
import { TikTokLoginButton } from '../components/auth/TikTokLoginButton'
import { liveStatus, loginCopy, supporters, type Supporter, type SupporterTier } from '../data/live'
import { useTikTokSession } from '../lib/useTikTokSession'

const tierLabel: Record<SupporterTier, string> = {
  founder: 'Founder',
  builder: 'Builder',
  supporter: 'Supporter',
}

const tierColor: Record<SupporterTier, string> = {
  founder: 'text-coral',
  builder: 'text-ink',
  supporter: 'text-muted',
}

function SupporterRow({ supporter, rank }: { supporter: Supporter; rank: number }) {
  return (
    <li className={`grid grid-cols-[1.5rem_2.25rem_1fr_auto] items-center gap-3 border-b border-line py-3.5 ${supporter.you ? 'bg-surface/60' : ''}`}>
      <span className={`font-mono text-[10px] ${rank === 1 ? 'text-coral' : 'text-muted'}`}>{String(rank).padStart(2, '0')}</span>
      {supporter.avatar
        ? <img className="size-9 rounded-full bg-surface object-cover grayscale" src={supporter.avatar} width="36" height="36" loading="lazy" alt="" />
        : <span className="size-9 rounded-full bg-surface" aria-hidden="true" />}
      <div className="min-w-0">
        <p className="m-0 flex items-center gap-2 truncate text-[clamp(1.05rem,2.6vw,1.35rem)] tracking-[-.04em]">
          <span className="truncate">{supporter.name}</span>
          {supporter.you && <span className="shrink-0 font-mono text-[8px] uppercase tracking-[.1em] text-coral">You</span>}
        </p>
        <p className="mt-0.5 mb-0 truncate font-mono text-[9px] tracking-[.05em] text-muted">
          {supporter.handle ? `${supporter.handle} · ` : ''}Since {supporter.since}
        </p>
      </div>
      <span className={`font-mono text-[9px] uppercase tracking-[.08em] ${tierColor[supporter.tier]}`}>{tierLabel[supporter.tier]}</span>
    </li>
  )
}

export function LivePage() {
  const [flowOpen, setFlowOpen] = useState(false)
  const [board, setBoard] = useState<Supporter[]>(supporters)
  const { session, authNotice, login, logout } = useTikTokSession()
  const notice = authNotice === 'error' ? loginCopy.authError : authNotice === 'missing' ? loginCopy.authMissing : ''

  useEffect(() => {
    if (!session) {
      setBoard(supporters)
      return
    }
    setBoard(current => {
      if (current.some(item => item.you)) {
        return current.map(item =>
          item.you ? { ...item, name: session.name, handle: session.handle || undefined, avatar: session.avatar } : item,
        )
      }
      return [
        {
          name: session.name,
          handle: session.handle || undefined,
          tier: 'supporter',
          since: 'Just now',
          avatar: session.avatar,
          you: true,
        },
        ...current,
      ]
    })
  }, [session])

  const handleCompleted = () => {
    if (!session) return
    setBoard(current => current.map(item => item.you ? { ...item, tier: 'builder' } : item))
  }

  return (
    <PageShell route="/live" bare>
      <DonationFlow
        open={flowOpen}
        session={session}
        onLogin={login}
        onCompleted={handleCompleted}
        onClose={() => setFlowOpen(false)}
      />

      <div className="mx-auto max-w-[820px]">
        <section className="pt-2 min-[768px]:pt-10" aria-labelledby="donate-title">
          <p className="m-0 font-mono text-[10px] uppercase tracking-[.14em] text-coral">{loginCopy.eyebrow}</p>

          <h1 id="donate-title" className="mt-7 mb-0 max-w-[12ch] text-[clamp(3rem,10vw,6.5rem)] font-bold leading-[.86] tracking-[-.09em]">
            {loginCopy.title}
          </h1>

          <div className="mt-7 grid gap-8 min-[640px]:grid-cols-[1fr_auto] min-[640px]:items-center min-[640px]:gap-12">
            <p className="m-0 leading-relaxed text-muted">{loginCopy.body}{" "}<span className="block min-[640px]:inline">{loginCopy.bodySecondary}</span></p>

            {session ? (
              <div className="flex flex-col gap-3 min-[640px]:items-end">
                <button
                  type="button"
                  onClick={() => setFlowOpen(true)}
                  className="h-12 w-full cursor-pointer bg-coral text-[15px] font-semibold text-night transition-colors hover:bg-coral/90 min-[480px]:w-[200px]"
                >
                  Donate
                </button>
                <button
                  type="button"
                  onClick={logout}
                  aria-label={session.handle ? `Log out of ${session.handle}` : 'Log out'}
                  className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 border border-line px-3 font-mono text-[9px] uppercase tracking-[.1em] text-muted transition-colors hover:border-coral hover:text-ink min-[640px]:hidden"
                >
                  <span className="normal-case tracking-[.06em] text-ink">{session.handle || session.name}</span>
                  <span className="text-line" aria-hidden="true">·</span>
                  <span>Log out</span>
                </button>
                <div className="hidden items-center gap-2 min-[640px]:flex">
                  <span className="font-mono text-[9px] tracking-[.1em] text-muted">{session.handle || session.name}</span>
                  <button
                    type="button"
                    onClick={logout}
                    className="cursor-pointer font-mono text-[9px] uppercase tracking-[.1em] text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 min-[640px]:items-end">
                <TikTokLoginButton onClick={login} />
                <p className="m-0 font-mono text-[9px] uppercase tracking-[.08em] text-muted min-[640px]:text-right">{loginCopy.note}</p>
                {notice && <p className="m-0 font-mono text-[9px] uppercase tracking-[.08em] text-coral min-[640px]:text-right" role="status">{notice}</p>}
              </div>
            )}
          </div>
        </section>

        <section id="supporters" className="mt-8 scroll-mt-6 pt-6 min-[768px]:mt-16 min-[768px]:pt-6" aria-labelledby="supporters-title">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="supporters-title" className="m-0 font-mono text-[10px] uppercase tracking-[.14em] text-muted">Top supporters</h2>
            <a className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.08em] text-muted no-underline transition-colors hover:text-coral" href={liveStatus.profileUrl} target="_blank" rel="noreferrer">
              Follow on {liveStatus.platform} <span aria-hidden="true">↗</span>
            </a>
          </div>

          {board.length === 0 ? (
            <div className="mt-5">
              <ul className="m-0 list-none border-t border-line p-0">
                {['01', '02', '03'].map((slot, index) => (
                  <li className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-4 border-b border-line py-5" key={slot}>
                    <span className={`font-mono text-[10px] ${index === 0 ? 'text-coral' : 'text-muted'}`}>{slot}</span>
                    <span className="h-px w-full bg-line" aria-hidden="true" />
                    <span className="font-mono text-[9px] uppercase tracking-[.08em] text-muted">Open</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <p className="m-0 max-w-[18ch] text-[clamp(1.7rem,4vw,2.5rem)] leading-[.95] tracking-[-.06em]">Your name could be first.</p>
                <p className="mt-3 mb-0 max-w-[44ch] text-sm leading-relaxed text-muted">Founding supporters keep the slot and the badge for as long as this exists. Sign in above to take one.</p>
              </div>
            </div>
          ) : (
            <ol className="mt-5 list-none border-t border-line p-0">
              {board.map((supporter, index) => <SupporterRow key={`${supporter.name}-${index}`} supporter={supporter} rank={index + 1} />)}
            </ol>
          )}
        </section>
      </div>
    </PageShell>
  )
}
