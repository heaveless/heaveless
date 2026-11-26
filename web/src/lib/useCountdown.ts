import { useEffect, useState } from 'preact/hooks'

export interface Remaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

const SECOND = 1000

function remainingUntil(target: number): Remaining {
  const ms = Math.max(0, target - Date.now())
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / SECOND) % 60),
    done: ms === 0,
  }
}

export function useCountdown(target: number): Remaining {
  const [left, setLeft] = useState(() => remainingUntil(target))

  useEffect(() => {
    const tick = () => setLeft(remainingUntil(target))
    tick()
    const id = window.setInterval(tick, SECOND)
    return () => window.clearInterval(id)
  }, [target])

  return left
}
