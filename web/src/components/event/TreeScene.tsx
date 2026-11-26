/**
 * The hero still life: a layered tree and three presents, drawn with gradients
 * so it reads as a soft render without any image request. The window's snow
 * bank is the ground. Decorative only, hidden from assistive tech.
 */
export function TreeScene({ className }: { className?: string }) {
  const baubles = [
    { cx: 236, cy: 224, r: 9, fill: 'url(#bauble-gold)' },
    { cx: 290, cy: 232, r: 11, fill: 'url(#bauble-berry)' },
    { cx: 208, cy: 300, r: 10, fill: 'url(#bauble-gold)' },
    { cx: 316, cy: 296, r: 13, fill: 'url(#bauble-berry)' },
    { cx: 176, cy: 372, r: 9.5, fill: 'url(#bauble-berry)' },
    { cx: 300, cy: 368, r: 12, fill: 'url(#bauble-berry)' },
    { cx: 348, cy: 352, r: 8, fill: 'url(#bauble-gold)' },
  ]

  return (
    <svg
      viewBox="0 0 520 500"
      className={className}
      role="presentation"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="scene-glow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stop-color="#dff45f" stop-opacity=".4" />
          <stop offset=".55" stop-color="#7fc98b" stop-opacity=".17" />
          <stop offset="1" stop-color="#7fc98b" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="tier-top" x1=".18" y1="0" x2=".82" y2="1">
          <stop offset="0" stop-color="#46b482" />
          <stop offset=".55" stop-color="#2b8a61" />
          <stop offset="1" stop-color="#1a6749" />
        </linearGradient>
        <linearGradient id="tier-mid" x1=".18" y1="0" x2=".82" y2="1">
          <stop offset="0" stop-color="#3fab7b" />
          <stop offset=".55" stop-color="#268057" />
          <stop offset="1" stop-color="#155e41" />
        </linearGradient>
        <linearGradient id="tier-low" x1=".18" y1="0" x2=".82" y2="1">
          <stop offset="0" stop-color="#379d71" />
          <stop offset=".55" stop-color="#21764f" />
          <stop offset="1" stop-color="#11543a" />
        </linearGradient>
        <linearGradient id="scene-trunk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#734b2e" />
          <stop offset=".6" stop-color="#4d2f1c" />
          <stop offset="1" stop-color="#3a2213" />
        </linearGradient>
        <linearGradient id="gift-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f9dc98" />
          <stop offset=".55" stop-color="#edbd62" />
          <stop offset="1" stop-color="#c8933a" />
        </linearGradient>
        <linearGradient id="gift-berry" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ef6a52" />
          <stop offset=".6" stop-color="#d3402e" />
          <stop offset="1" stop-color="#a52a1c" />
        </linearGradient>
        <linearGradient id="gift-pine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#2f8a63" />
          <stop offset="1" stop-color="#14603f" />
        </linearGradient>
        <linearGradient id="bauble-berry" x1=".2" y1="0" x2=".8" y2="1">
          <stop offset="0" stop-color="#ff9579" />
          <stop offset=".45" stop-color="#dc4331" />
          <stop offset="1" stop-color="#9c2417" />
        </linearGradient>
        <linearGradient id="bauble-gold" x1=".2" y1="0" x2=".8" y2="1">
          <stop offset="0" stop-color="#ffedb8" />
          <stop offset=".5" stop-color="#f0c46a" />
          <stop offset="1" stop-color="#bf8c2f" />
        </linearGradient>
        <radialGradient id="star-glow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stop-color="#fff3c4" stop-opacity=".95" />
          <stop offset=".6" stop-color="#f1c56b" stop-opacity=".4" />
          <stop offset="1" stop-color="#f1c56b" stop-opacity="0" />
        </radialGradient>
      </defs>

      {/* Light behind the tree */}
      <ellipse className="glow" cx="274" cy="268" rx="232" ry="216" fill="url(#scene-glow)" />

      {/* Ground */}
      <ellipse cx="260" cy="448" rx="200" ry="18" fill="#062a1e" opacity=".18" />

      {/* Trunk */}
      <rect x="244" y="392" width="32" height="56" rx="7" fill="url(#scene-trunk)" />

      {/* Bottom tier */}
      <path
        d="M260 246 C226 288 188 328 152 360 C136 378 140 394 162 400 C188 408 332 408 358 400 C380 394 384 378 368 360 C332 328 294 288 260 246 Z"
        fill="url(#tier-low)"
      />
      <ellipse cx="260" cy="408" rx="140" ry="12" fill="#062a1e" opacity=".18" />
      <path d="M195 340 C180 352 164 356 152 360" stroke="#8ddcb4" stroke-width="2.4" stroke-linecap="round" opacity=".3" fill="none" />
      <path d="M162 400 C188 408 332 408 358 400" stroke="#8ddcb4" stroke-width="2" stroke-linecap="round" opacity=".35" fill="none" />

      {/* Shadow cast by the middle tier */}
      <path
        d="M178 332 C200 339 320 339 342 332 C356 346 344 364 314 368 C284 372 240 372 210 368 C180 364 166 346 178 332 Z"
        fill="#062a1e"
        opacity=".24"
      />

      {/* Middle tier */}
      <path
        d="M260 170 C232 210 200 252 168 292 C154 311 158 326 178 332 C200 339 320 339 342 332 C362 326 366 311 352 292 C320 252 288 210 260 170 Z"
        fill="url(#tier-mid)"
      />
      <path d="M200 252 C186 264 176 278 168 292" stroke="#8ddcb4" stroke-width="2.4" stroke-linecap="round" opacity=".32" fill="none" />
      <path d="M178 332 C200 339 320 339 342 332" stroke="#8ddcb4" stroke-width="2" stroke-linecap="round" opacity=".38" fill="none" />

      {/* Shadow cast by the top tier */}
      <path
        d="M202 238 C220 245 300 245 318 238 C330 250 322 268 296 272 C270 276 240 276 218 272 C192 268 186 250 202 238 Z"
        fill="#062a1e"
        opacity=".26"
      />

      {/* Top tier */}
      <path
        d="M260 92 C238 130 216 168 192 202 C180 219 184 232 202 238 C220 245 300 245 318 238 C336 232 340 219 328 202 C304 168 282 130 260 92 Z"
        fill="url(#tier-top)"
      />
      <path d="M260 92 C238 130 216 168 192 202" stroke="#9be4bf" stroke-width="2.4" stroke-linecap="round" opacity=".4" fill="none" />
      <path d="M202 238 C220 245 300 245 318 238" stroke="#9be4bf" stroke-width="2" stroke-linecap="round" opacity=".45" fill="none" />

      {/* Star */}
      <circle className="glow" cx="260" cy="62" r="46" fill="url(#star-glow)" />
      <path
        d="M260 36 L266.5 54.1 L285.7 54.7 L270.5 66.4 L275.9 84.8 L260 74 L244.1 84.8 L249.5 66.4 L234.3 54.7 L253.5 54.1 Z"
        fill="url(#bauble-gold)"
      />

      {/* Baubles */}
      <g>
        {baubles.map(bauble => (
          <g key={`${bauble.cx}-${bauble.cy}`}>
            <circle cx={bauble.cx} cy={bauble.cy} r={bauble.r} fill={bauble.fill} />
            <circle
              cx={bauble.cx - bauble.r * 0.32}
              cy={bauble.cy - bauble.r * 0.36}
              r={bauble.r * 0.24}
              fill="#fffdf4"
              opacity=".75"
            />
          </g>
        ))}
      </g>

      {/* Presents */}
      <g>
        <ellipse cx="412" cy="438" rx="58" ry="9" fill="#062a1e" opacity=".32" />
        <rect x="424" y="410" width="54" height="32" rx="5" fill="url(#gift-pine)" />
        <rect x="418" y="402" width="66" height="12" rx="4" fill="#3b9d72" />
        <rect x="447" y="402" width="9" height="40" fill="#e9f6b4" opacity=".9" />

        <rect x="356" y="400" width="72" height="44" rx="6" fill="url(#gift-berry)" />
        <rect x="348" y="390" width="88" height="16" rx="5" fill="#e25840" />
        <rect x="388" y="390" width="11" height="54" fill="#f7efd9" />
        <ellipse cx="379" cy="382" rx="12" ry="7" transform="rotate(-24 379 382)" fill="#f7efd9" />
        <ellipse cx="408" cy="382" rx="12" ry="7" transform="rotate(24 408 382)" fill="#f7efd9" />
        <circle cx="393.5" cy="384" r="4.4" fill="#e2d8bd" />

        <ellipse cx="136" cy="438" rx="62" ry="9" fill="#062a1e" opacity=".32" />
        <rect x="96" y="392" width="80" height="46" rx="6" fill="url(#gift-gold)" />
        <rect x="88" y="382" width="96" height="16" rx="5" fill="#f6d489" />
        <rect x="128" y="382" width="14" height="56" fill="#cf3d2b" />
        <ellipse cx="126" cy="374" rx="13" ry="7.6" transform="rotate(-26 126 374)" fill="#cf3d2b" />
        <ellipse cx="145" cy="374" rx="13" ry="7.6" transform="rotate(26 145 374)" fill="#cf3d2b" />
        <circle cx="135" cy="376" r="4.6" fill="#a92e1f" />
      </g>

      {/* Sparkles and snow grains */}
      <g fill="#fffdf4">
        <path
          className="twinkle"
          d="M12 0c.7 6.4 5.6 11.3 12 12-6.4.7-11.3 5.6-12 12-.7-6.4-5.6-11.3-12-12C6.4 11.3 11.3 6.4 12 0z"
          transform="translate(76 180) scale(.72)"
        />
        <path
          className="twinkle"
          style={{ animationDelay: '-1.6s' }}
          d="M12 0c.7 6.4 5.6 11.3 12 12-6.4.7-11.3 5.6-12 12-.7-6.4-5.6-11.3-12-12C6.4 11.3 11.3 6.4 12 0z"
          transform="translate(428 134) scale(1.02)"
        />
        <path
          className="twinkle"
          style={{ animationDelay: '-3.1s' }}
          d="M12 0c.7 6.4 5.6 11.3 12 12-6.4.7-11.3 5.6-12 12-.7-6.4-5.6-11.3-12-12C6.4 11.3 11.3 6.4 12 0z"
          transform="translate(54 302) scale(.55)"
        />
        <path
          className="twinkle"
          style={{ animationDelay: '-2.2s' }}
          d="M12 0c.7 6.4 5.6 11.3 12 12-6.4.7-11.3 5.6-12 12-.7-6.4-5.6-11.3-12-12C6.4 11.3 11.3 6.4 12 0z"
          transform="translate(450 280) scale(.6)"
        />
        <circle cx="146" cy="120" r="2.4" opacity=".8" />
        <circle cx="356" cy="112" r="1.8" opacity=".7" />
        <circle cx="88" cy="232" r="1.6" opacity=".6" />
        <circle cx="412" cy="212" r="2" opacity=".65" />
        <circle cx="114" cy="348" r="1.8" opacity=".5" />
        <circle cx="432" cy="366" r="2.2" opacity=".55" />
      </g>
    </svg>
  )
}
