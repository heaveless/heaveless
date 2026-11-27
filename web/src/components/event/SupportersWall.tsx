import { useState } from 'preact/hooks'
import { clsx } from 'clsx'
import type { SessionUser, Supporter } from '../../lib/api'
import type { AuthNotice } from '../../lib/useTikTokSession'
import { TikTokLoginButton } from '../auth/TikTokLoginButton'
import { useLang } from './lang'
import { SECTION, SectionHead, WRAP } from './ui'

interface LoginPanelProps {
  session: SessionUser | null
  authNotice: AuthNotice
  onLogin: () => void
  onLogout: () => void
}

interface SupportersWallProps extends LoginPanelProps {
  supporters: Supporter[]
}

const NOTICE_KEY = { error: 'authError', missing: 'authMissing' } as const

function Avatar({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(false)

  if (src && !failed) {
    return (
      <img
        className="size-10 shrink-0 rounded-full bg-paper-2 object-cover"
        src={src}
        width="40"
        height="40"
        loading="lazy"
        onError={() => setFailed(true)}
        alt=""
      />
    )
  }

  return (
    <span
      className="grid size-10 shrink-0 place-items-center rounded-full bg-forest text-[0.95rem] font-bold text-lime"
      aria-hidden="true"
    >
      {name.slice(0, 1)}
    </span>
  )
}

function LoginPanel({ session, authNotice, onLogin, onLogout }: LoginPanelProps) {
  const { t } = useLang()

  return (
    <div className="pine-card mt-8 grid gap-5 rounded-[24px] p-5 text-paper min-[768px]:grid-cols-[1fr_auto] min-[768px]:items-center min-[768px]:gap-10 min-[768px]:p-7">
      <div>
        <h3 className="m-0 text-[1.25rem] font-bold leading-tight tracking-[-.02em] text-paper">{t.wall.loginTitle}</h3>
        <p className="mt-1.5 mb-0 max-w-[54ch] text-[0.92rem] leading-[1.6] text-paper/70">{t.wall.loginBody}</p>
        {authNotice && (
          <p role="status" className="mt-2 mb-0 text-[9.5px] font-bold uppercase tracking-[.14em] text-lime">
            {t.wall[NOTICE_KEY[authNotice]]}
          </p>
        )}
      </div>

      <div className="min-[768px]:justify-self-end">
        {session ? (
          <div className="flex flex-wrap items-center gap-3">
            {session.avatar && (
              <img
                className="size-9 rounded-full bg-pine-800 object-cover"
                src={session.avatar}
                width="36"
                height="36"
                alt=""
              />
            )}
            <div className="min-w-0">
              <p className="m-0 truncate text-[0.92rem] font-semibold text-paper">{session.name}</p>
              <p className="mt-0.5 mb-0 truncate text-[9px] font-bold uppercase tracking-[.14em] text-paper/60">
                {t.wall.signedIn}
              </p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="min-h-11 cursor-pointer rounded-full border border-paper/25 px-4 text-[10px] font-bold uppercase tracking-[.12em] text-paper/70 transition-colors hover:border-paper/60 hover:text-paper"
            >
              {t.wall.logOut}
            </button>
          </div>
        ) : (
          <TikTokLoginButton onClick={onLogin} appearance="light" />
        )}
      </div>
    </div>
  )
}

export function SupportersWall({ supporters, session, authNotice, onLogin, onLogout }: SupportersWallProps) {
  const { t } = useLang()

  return (
    <section id="wall" className={SECTION} aria-labelledby="wall-title">
      <div className={clsx(WRAP, 'py-14 min-[768px]:py-20')}>
        <SectionHead id="wall-title" kicker={t.wall.kicker} title={t.wall.title} intro={t.wall.intro} />

        {supporters.length > 0 ? (
          <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-3 p-0 min-[480px]:grid-cols-2 min-[900px]:grid-cols-4">
            {supporters.map(person => (
              <li key={person.id} className="paper-card flex items-center gap-3 rounded-2xl p-3.5">
                <Avatar src={person.avatar} name={person.name} />
                <div className="min-w-0">
                  <p className="m-0 truncate text-[0.92rem] font-semibold text-forest">{person.name}</p>
                  <p className="mt-0.5 mb-0 text-[9px] font-bold uppercase tracking-[.14em] text-pine-600">
                    {person.id === session?.id ? t.wall.you : t.wall.onWall}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 mb-0 max-w-[44ch] text-[0.95rem] leading-[1.6] text-forest/72">{t.wall.empty}</p>
        )}

        <LoginPanel session={session} authNotice={authNotice} onLogin={onLogin} onLogout={onLogout} />
      </div>
    </section>
  )
}
