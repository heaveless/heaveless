import { PageShell } from '../components/layout/PageShell'
import { TikTokLoginButton } from '../components/live/TikTokLoginButton'
import { christmasEvent as event } from '../data/event'
import { useTikTokSession } from '../lib/useTikTokSession'

const money = (value: number) => `${event.currency} ${value.toLocaleString('en-US')}`

function daysToChristmas() {
  const target = new Date(`${event.deliveryDate}T23:59:59-05:00`).getTime()
  return Math.max(0, Math.ceil((target - Date.now()) / 86_400_000))
}

export function EventPage() {
  const { session, authNotice, login, logout } = useTikTokSession()
  const progress = Math.min(100, Math.round((event.raised / event.goal) * 100))
  const remaining = Math.max(0, event.raised - event.spent)
  const days = daysToChristmas()
  const wall = session
    ? [{ name: session.name, avatar: session.avatar, you: true }, ...event.supporters]
    : event.supporters

  return (
    <PageShell route="/event" bare>
      <div className="mx-auto max-w-[920px]">
        <section aria-labelledby="event-title">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <p className="m-0 font-mono text-[10px] uppercase tracking-[.14em] text-coral">{event.eyebrow}</p>
            <p className="m-0 font-mono text-[10px] uppercase tracking-[.1em] text-muted">
              {days === 0 ? 'Christmas is here' : `${days} days to Christmas`}
            </p>
          </div>

          <div className="mt-8 grid gap-8 min-[768px]:grid-cols-[1.1fr_.9fr] min-[768px]:items-end">
            <div>
              <h1 id="event-title" className="m-0 max-w-[13ch] text-[clamp(2.8rem,8vw,5.5rem)] font-bold leading-[.88] tracking-[-.085em]">{event.title}</h1>
              <p className="mt-5 mb-0 max-w-[46ch] leading-relaxed text-muted">{event.intro}</p>

              <div className="mt-7 flex flex-col items-start gap-3">
                {session ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[.08em] text-muted">{session.handle || session.name}</span>
                    <button
                      type="button"
                      onClick={logout}
                      className="cursor-pointer font-mono text-[9px] uppercase tracking-[.1em] text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <>
                    <TikTokLoginButton onClick={login} />
                    <p className="m-0 font-mono text-[9px] uppercase tracking-[.08em] text-muted">Secure login. No posting.</p>
                  </>
                )}
                {authNotice && <p className="m-0 font-mono text-[9px] uppercase tracking-[.08em] text-coral" role="status">{authNotice}</p>}
              </div>

              <a className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.08em] text-muted no-underline transition-colors hover:text-coral" href="#supporters">
                See who joined <span aria-hidden="true">↓</span>
              </a>
            </div>

            <div className="bg-surface p-5 min-[768px]:p-6">
              <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[.08em]">
                <span className="text-coral">Raised</span>
                <span className="text-muted">{progress}%</span>
              </div>
              <p className="mt-3 mb-4 text-[clamp(1.8rem,4vw,2.6rem)] tracking-[-.06em]">
                {money(event.raised)}
                <span className="ml-1 font-mono text-sm tracking-normal text-muted">/ {money(event.goal)}</span>
              </p>
              <div className="h-1.5 w-full overflow-hidden bg-line" role="progressbar" aria-label="Campaign funding goal" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full bg-coral" style={{ width: `${progress}%` }} />
              </div>
              <dl className="mt-5 grid gap-3">
                <div className="flex items-baseline justify-between border-t border-line pt-3 font-mono text-[10px] uppercase">
                  <dt className="text-muted">Children</dt>
                  <dd className="m-0">{event.children}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-3 font-mono text-[10px] uppercase">
                  <dt className="text-muted">Families</dt>
                  <dd className="m-0">{event.families}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-3 font-mono text-[10px] uppercase">
                  <dt className="text-muted">Updated</dt>
                  <dd className="m-0">{event.updated}</dd>
                </div>
              </dl>
              {event.donationUrl ? (
                <a className="mt-5 inline-flex w-full items-center justify-center bg-coral px-4 py-3 font-mono text-[10px] uppercase text-night no-underline transition-transform hover:-translate-y-0.5" href={event.donationUrl} target="_blank" rel="noreferrer">
                  Support the campaign ↗
                </a>
              ) : (
                <p className="mt-5 mb-0 font-mono text-[9px] uppercase leading-relaxed tracking-[.08em] text-muted">Donations open {event.donationOpens}.</p>
              )}
            </div>
          </div>
        </section>

        <section id="transparency" className="mt-16 scroll-mt-6" aria-labelledby="money-title">
          <h2 id="money-title" className="m-0 text-[clamp(1.8rem,4vw,3rem)] tracking-[-.07em]">Where the money goes.</h2>
          <p className="mt-2 mb-6 max-w-[52ch] leading-relaxed text-muted">Planned allocation. Every expense will be posted below with a receipt or note.</p>
          <div className="grid gap-3 min-[640px]:grid-cols-3">
            {event.allocation.map(item => (
              <article className="flex min-h-[170px] flex-col justify-between bg-surface p-5" key={item.label}>
                <div className="flex items-baseline justify-between font-mono text-[10px] uppercase">
                  <span className="text-coral">{item.label}</span>
                  <span className="text-muted">{item.percent}%</span>
                </div>
                <div>
                  <p className="m-0 text-[clamp(1.4rem,3vw,1.9rem)] tracking-[-.05em]">{money(event.goal * item.percent / 100)}</p>
                  <p className="mt-2 mb-0 text-sm leading-relaxed text-muted">{item.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-3 bg-surface p-5">
            <div className="grid gap-4 min-[640px]:grid-cols-3">
              <div>
                <p className="m-0 font-mono text-[9px] uppercase tracking-[.1em] text-muted">Raised</p>
                <p className="mt-2 mb-0 text-xl tracking-[-.04em]">{money(event.raised)}</p>
              </div>
              <div>
                <p className="m-0 font-mono text-[9px] uppercase tracking-[.1em] text-muted">Spent</p>
                <p className="mt-2 mb-0 text-xl tracking-[-.04em]">{money(event.spent)}</p>
              </div>
              <div>
                <p className="m-0 font-mono text-[9px] uppercase tracking-[.1em] text-muted">Remaining</p>
                <p className="mt-2 mb-0 text-xl tracking-[-.04em]">{money(remaining)}</p>
              </div>
            </div>
            <p className="mt-4 mb-0 font-mono text-[9px] uppercase tracking-[.08em] text-muted">Updated {event.updated} · No expenses posted yet.</p>
          </div>
        </section>

        <section className="mt-16" aria-labelledby="gifts-title">
          <h2 id="gifts-title" className="m-0 text-[clamp(1.8rem,4vw,3rem)] tracking-[-.07em]">What your support buys.</h2>
          <p className="mt-2 mb-6 max-w-[52ch] leading-relaxed text-muted">Concrete items, with a count and a target. Nothing is spent without being listed here.</p>
          <div className="grid gap-3 min-[640px]:grid-cols-3">
            {event.gifts.map(gift => {
              const giftProgress = Math.min(100, Math.round((gift.funded / gift.target) * 100))
              return (
                <article className="flex min-h-[180px] flex-col justify-between bg-surface p-5" key={gift.name}>
                  <div className="flex items-baseline justify-between">
                    <p className="m-0 font-mono text-[10px] text-coral">{money(gift.unit)}</p>
                    <p className="m-0 font-mono text-[9px] uppercase tracking-[.08em] text-muted">{gift.funded} / {gift.target}</p>
                  </div>
                  <div>
                    <h3 className="m-0 text-[clamp(1.2rem,2.4vw,1.5rem)] tracking-[-.05em]">{gift.name}</h3>
                    <div className="mt-3 h-1 w-full overflow-hidden bg-line">
                      <div className="h-full bg-coral" style={{ width: `${giftProgress}%` }} />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="timeline-title">
          <h2 id="timeline-title" className="m-0 text-[clamp(1.8rem,4vw,3rem)] tracking-[-.07em]">The plan.</h2>
          <p className="mt-2 mb-6 max-w-[52ch] leading-relaxed text-muted">What happens, when it happens, and what gets published afterwards.</p>
          <ol className="m-0 list-none border-l border-line p-0 pl-5">
            {event.updates.map(update => (
              <li className="relative pb-8 last:pb-0" key={update.title}>
                <span
                  className={`absolute -left-[26px] top-1.5 size-2 rounded-full ${update.status === 'done' ? 'bg-coral' : update.status === 'next' ? 'bg-ink' : 'bg-line'}`}
                  aria-hidden="true"
                />
                <p className="m-0 font-mono text-[9px] uppercase tracking-[.08em] text-muted">{update.date}</p>
                <h3 className="mt-1 mb-1 text-[clamp(1.1rem,2.2vw,1.35rem)] tracking-[-.04em]">{update.title}</h3>
                <p className="m-0 max-w-[52ch] text-sm leading-relaxed text-muted">{update.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="supporters" className="mt-16 scroll-mt-6" aria-labelledby="supporters-title">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="supporters-title" className="m-0 text-[clamp(1.8rem,4vw,3rem)] tracking-[-.07em]">Supporters</h2>
            <span className="font-mono text-[10px] uppercase tracking-[.08em] text-muted">{wall.length} on the wall</span>
          </div>
          <p className="mt-2 mb-6 max-w-[52ch] leading-relaxed text-muted">Log in with TikTok to join the wall. Your display name and avatar are shown; nothing is posted.</p>

          {wall.length > 0 ? (
            <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 min-[640px]:grid-cols-4">
              {wall.map((person, index) => (
                <li className="flex items-center gap-3 border border-line p-3" key={`${person.name}-${index}`}>
                  {person.avatar
                    ? <img className="size-9 shrink-0 rounded-full bg-surface object-cover grayscale" src={person.avatar} width="36" height="36" loading="lazy" alt="" />
                    : <span className="size-9 shrink-0 rounded-full bg-surface" aria-hidden="true" />}
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm">{person.name}</p>
                    <p className="mt-1 mb-0 font-mono text-[8px] uppercase tracking-[.1em] text-coral">{person.you ? 'You' : 'Supporter'}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 border border-dashed border-line p-5 text-sm leading-relaxed text-muted">Be the first to join. Use the TikTok button above.</p>
          )}
        </section>

        <p className="mt-16 border-t border-line pt-6 text-xs leading-relaxed text-muted">
          This is a personal campaign, not a registered charity. All funds after payment processing fees go to the items above. Receipts and updates are posted on this page.
        </p>
      </div>
    </PageShell>
  )
}
