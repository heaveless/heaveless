interface MarkProps {
  className?: string
}

export { SnowflakeIcon as SnowflakeMark } from '../icons/Snowflake'

export function GiftMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.2 8.4h17.6v11.2a1.6 1.6 0 0 1-1.6 1.6H4.8a1.6 1.6 0 0 1-1.6-1.6z" />
      <path d="M2.6 4.8h18.8v3.6H2.6zM12 8.4v12.8" />
      <path d="M12 8.4S10.9 3.6 8.3 3.6a2.4 2.4 0 0 0 0 4.8zM12 8.4s1.1-4.8 3.7-4.8a2.4 2.4 0 0 1 0 4.8z" />
    </svg>
  )
}

export function BasketMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2.8 9.4h18.4l-1.7 9.5a2 2 0 0 1-2 1.7H6.5a2 2 0 0 1-2-1.7z" />
      <path d="M8.3 9.4S7.9 3.9 12 3.9s3.7 5.5 3.7 5.5M9.6 13.1v4M14.4 13.1v4" />
    </svg>
  )
}

export function CandleMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 9.4V7.1" />
      <path d="M12 7.1c1.3-1.2 1.3-2.6 0-3.7-1.3 1.1-1.3 2.5 0 3.7z" />
      <rect x="8.9" y="9.4" width="6.2" height="10.2" rx="1.1" />
      <path d="M5.8 19.6h12.4" />
    </svg>
  )
}

export function ArrowMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      stroke-width="1.9"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4.5 12h14M13 6.5l5.5 5.5L13 17.5" />
    </svg>
  )
}

export function GlobeMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="8.6" />
      <path d="M3.4 12h17.2" />
      <path d="M12 3.4c2.35 2.3 3.65 5.3 3.65 8.6S14.35 18.3 12 20.6c-2.35-2.3-3.65-5.3-3.65-8.6S9.65 5.7 12 3.4z" />
    </svg>
  )
}
