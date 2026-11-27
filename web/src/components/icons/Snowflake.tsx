interface IconProps {
  className?: string
}

export function SnowflakeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.4v19.2M3.8 7.2l16.4 9.6M20.2 7.2L3.8 16.8" />
      <path d="M12 6.6 9.3 3.9M12 6.6l2.7-2.7M12 17.4l-2.7 2.7M12 17.4l2.7 2.7M6.8 9.6 3.4 8.7M6.8 14.4l-3.4.9M17.2 9.6l3.4-.9M17.2 14.4l3.4.9" />
    </svg>
  )
}
