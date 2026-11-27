import { useMemo } from 'preact/hooks'

interface MarkProps {
  className?: string
  id?: string
}

export function Snowfall({ count = 44 }: { count?: number }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const random = (seed: number) => {
          const value = Math.sin((index + 1) * 12.9898 + seed * 78.233) * 43758.5453
          return value - Math.floor(value)
        }
        const duration = 17 + random(1) * 18
        return {
          left: random(2) * 100,
          size: 2 + random(3) * 4.2,
          duration,
          delay: -random(4) * duration,
          drift: (random(5) - 0.5) * 160,
          opacity: 0.3 + random(6) * 0.55,
          soft: random(7) > 0.78,
        }
      }),
    [count],
  )

  return (
    <div className="snowfall" aria-hidden="true">
      {flakes.map((flake, index) => (
        <span
          key={index}
          className="snowflake"
          style={{
            '--x': `${flake.left.toFixed(2)}%`,
            '--s': `${flake.size.toFixed(2)}px`,
            '--dur': `${flake.duration.toFixed(2)}s`,
            '--delay': `${flake.delay.toFixed(2)}s`,
            '--drift': `${flake.drift.toFixed(1)}px`,
            '--o': flake.opacity.toFixed(2),
            filter: flake.soft ? 'blur(1px)' : 'none',
          }}
        />
      ))}
    </div>
  )
}

export function SnowDrift({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 90V44c88-24 148 18 238 12 96-6 152-38 248-28 98 10 156 46 252 38 96-8 152-46 250-38 96 8 154 40 250 26 62-9 142-16 202-8v44z" />
    </svg>
  )
}

export function SnowHang({ className, id }: MarkProps) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      id={id}
      className={className}
      fill="currentColor"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h1440v30c-60-9-140-2-202-12-96-15-154 18-250 26-98 8-154-30-250-38-96-8-154 28-250 38-96 10-156-22-248-16-90 6-150 34-240 20z" />
    </svg>
  )
}

export function PineTree({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 32" className={className} fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0l5.6 8.6h-2.5L20.5 17h-3L22.8 26.2H13.8V32h-3.6v-5.8H1.2L6.5 17h-3l5.4-8.4H6.4z" />
    </svg>
  )
}
