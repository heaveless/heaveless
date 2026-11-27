import { useEffect, useRef, useState } from 'preact/hooks'
import { toDataURL } from 'qrcode'
import { donationPresets, payment, type LiveSession } from '../../data/live'
import { TikTokLoginButton } from '../auth/TikTokLoginButton'

type Step = 'login' | 'amount' | 'pay' | 'done'

interface DonationFlowProps {
  open: boolean
  session: LiveSession | null
  initialAmount?: number
  onLogin: () => void
  onCompleted: () => void
  onClose: () => void
}

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateCode() {
  let suffix = ''
  for (let index = 0; index < 4; index += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `HV-${suffix}`
}

function buildPayload(amount: number, code: string) {
  const raw = payment.qrValue ?? payment.href ?? ''
  return raw.replace(/\{amount\}/g, String(amount)).replace(/\{code\}/g, code)
}

function soles(value: number) {
  return `S/ ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

const stepTitles: Record<Step, string> = {
  login: 'Log in to donate.',
  amount: 'Choose an amount.',
  pay: 'Scan to donate.',
  done: 'Thank you.',
}

export function DonationFlow({ open, session, initialAmount, onLogin, onCompleted, onClose }: DonationFlowProps) {
  const [step, setStep] = useState<Step>('login')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')
  const [qr, setQr] = useState('')
  const [error, setError] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)

  const amountNumber = Number(amount)
  const validAmount = Number.isFinite(amountNumber) && amountNumber > 0
  const amountLabel = soles(validAmount ? amountNumber : 0)
  const title = stepTitles[step]

  useEffect(() => {
    if (!open) return
    setStep(session ? 'amount' : 'login')
    setAmount(initialAmount ? String(initialAmount) : '')
    setDescription('')
    setCode(generateCode())
    setQr('')
    setError('')
    panelRef.current?.focus()
  }, [open, initialAmount])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [step, open])

  useEffect(() => {
    if (step !== 'pay' || payment.qrImage) {
      setQr('')
      return
    }
    let cancelled = false
    toDataURL(buildPayload(amountNumber, code), {
      width: 640,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#11110fff', light: '#ffffffff' },
    })
      .then(url => { if (!cancelled) setQr(url) })
      .catch(() => { if (!cancelled) setQr('') })
    return () => { cancelled = true }
  }, [step, amountNumber, code])

  if (!open) return null

  const startPayment = () => {
    if (!validAmount) {
      setError('Enter an amount greater than zero.')
      return
    }
    setError('')
    setStep('pay')
  }

  const login = () => {
    onLogin()
    setStep('amount')
  }

  const trapFocus = (event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !panelRef.current) return
    const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, textarea, [tabindex]:not([tabindex="-1"])'))
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-night/85 backdrop-blur-sm min-[640px]:items-center min-[640px]:p-6"
      onClick={event => { if (event.target === event.currentTarget) onClose() }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="donation-flow-title"
        tabIndex={-1}
        onKeyDown={trapFocus}
        className="max-h-[94dvh] w-full max-w-[540px] overflow-y-auto overscroll-contain border border-line bg-night p-5 outline-none min-[640px]:max-h-[90dvh] min-[640px]:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="donation-flow-title" aria-live="polite" className="m-0 text-[clamp(1.6rem,5vw,2.1rem)] leading-[.95] tracking-[-.06em]">
            {step === 'done' && session
              ? <>Thank you, <span className="text-coral">{session.handle || session.name}</span>.</>
              : title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close donation form" className="-mr-1 -mt-1 grid size-8 shrink-0 cursor-pointer place-items-center text-lg leading-none text-muted transition-colors hover:text-ink">×</button>
        </div>

        {step === 'login' && (
          <div className="mt-6">
            <p className="m-0 max-w-[38ch] text-sm leading-relaxed text-muted">We use your TikTok handle for the supporters board.</p>
            <div className="mt-6"><TikTokLoginButton onClick={login} className="w-full" /></div>
          </div>
        )}

        {step === 'amount' && (
          <form className="mt-6" onSubmit={event => { event.preventDefault(); startPayment() }}>
            <p className="m-0 text-sm leading-relaxed text-muted">Any amount keeps this alive. Pick what feels right.</p>

            <label className="mt-7 flex items-baseline gap-2 border-b border-line pb-1 focus-within:border-ink" for="donation-amount">
              <span className="font-mono text-lg text-muted" aria-hidden="true">S/</span>
              <input
                id="donation-amount"
                aria-label="Amount in soles"
                className="w-full bg-transparent p-0 text-[clamp(2.8rem,9vw,4rem)] font-bold leading-none tracking-[-.08em] text-ink outline-none placeholder:text-muted/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                inputMode="decimal"
                min="0.5"
                step="0.5"
                placeholder="0"
                value={amount}
                onInput={event => { setAmount(event.currentTarget.value); setError('') }}
              />
            </label>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {donationPresets.map(preset => {
                const isSelected = amount === String(preset)
                return (
                  <button
                    key={preset}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => { setAmount(String(preset)); setError('') }}
                    className={`cursor-pointer border py-2.5 text-sm font-medium transition-colors ${isSelected ? 'border-coral bg-coral text-night' : 'border-line text-ink hover:border-coral'}`}
                  >
                    S/{preset}
                  </button>
                )
              })}
            </div>

            <label className="mt-6 block" for="donation-description">
              <span className="font-mono text-[9px] uppercase tracking-[.1em] text-muted">Message (optional)</span>
              <input
                id="donation-description"
                className="mt-2 w-full border-0 border-b border-line bg-transparent p-0 pb-2 text-sm text-ink outline-none placeholder:text-muted focus:border-ink"
                maxLength={140}
                placeholder="What is this for?"
                value={description}
                onInput={event => setDescription(event.currentTarget.value)}
              />
            </label>

            {error && <p className="mt-3 mb-0 font-mono text-[10px] uppercase text-coral" role="alert">{error}</p>}

            <button type="submit" className="mt-7 h-12 w-full cursor-pointer bg-ink font-mono text-[10px] uppercase text-night transition-transform hover:-translate-y-0.5">Continue ↗</button>
          </form>
        )}

        {step === 'pay' && (
          <div className="mt-6">
            <div className="text-center">
              <p className="m-0 font-mono text-[9px] uppercase tracking-[.1em] text-muted">Your donation</p>
              <p className="mt-2 mb-0 text-[clamp(2.4rem,7vw,3.2rem)] font-bold leading-none tracking-[-.07em]">{amountLabel}</p>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="bg-white p-3">
                {payment.qrImage
                  ? <img className="size-[220px] object-contain" src={payment.qrImage} width="220" height="220" alt="Donation QR code" />
                  : qr
                    ? <img className="size-[220px] object-contain" src={qr} width="220" height="220" alt="Donation QR code" />
                    : <span className="grid size-[220px] place-items-center font-mono text-[10px] uppercase text-night/60">Generating QR…</span>}
              </div>
            </div>

            <p className="mt-5 mb-0 text-center text-sm leading-relaxed text-muted">Scan the QR with your banking app.</p>

            <div className="mt-6 flex flex-col-reverse gap-3 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between">
              <button type="button" onClick={() => setStep('amount')} className="h-12 w-full cursor-pointer text-center font-mono text-[10px] uppercase text-muted transition-colors hover:text-ink min-[480px]:h-auto min-[480px]:w-auto min-[480px]:px-0">← Back</button>
              <button type="button" onClick={() => { onCompleted(); setStep('done') }} className="h-12 w-full cursor-pointer bg-ink font-mono text-[10px] uppercase text-night transition-transform hover:-translate-y-0.5 min-[480px]:w-auto min-[480px]:px-6">I have donated ↗</button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="mt-6">
            <p className="m-0 text-[clamp(2.4rem,7vw,3.2rem)] font-bold leading-none tracking-[-.07em] text-coral">{amountLabel}</p>
            <p className="mt-2 mb-0 font-mono text-[9px] uppercase tracking-[.1em] text-muted">Your donation</p>
            <p className="mt-4 max-w-[42ch] leading-relaxed text-muted">It appears on the supporters board once your donation is confirmed.</p>

            {description.trim() && (
              <p className="mt-4 mb-0 border-l border-line pl-3 text-sm leading-relaxed text-muted">{description.trim()}</p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between">
              <button type="button" onClick={onClose} className="h-12 w-full cursor-pointer text-center font-mono text-[10px] uppercase text-muted transition-colors hover:text-ink min-[480px]:h-auto min-[480px]:w-auto min-[480px]:px-0">Back to Live</button>
              <a href="#supporters" onClick={onClose} className="inline-flex h-12 items-center justify-center bg-ink px-6 font-mono text-[10px] uppercase text-night no-underline transition-transform hover:-translate-y-0.5">See the board ↗</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
