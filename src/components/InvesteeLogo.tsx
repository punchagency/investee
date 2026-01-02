interface LogoProps {

  className?: string;
  size?: number;
}

export function InvesteeLogo({ className = "", size = 32 }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="investeeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e88e5"/>
          <stop offset="100%" stopColor="#22c55e"/>
        </linearGradient>
        <linearGradient id="investeeGlow" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#1e88e5" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.4"/>
        </linearGradient>
      </defs>
      {/* Arched doorway shaped like letter "I" */}
      {/* Top serif bar */}
      <path
        d="M8 6H40"
        stroke="url(#investeeGradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Bottom serif bar */}
      <path
        d="M8 44H40"
        stroke="url(#investeeGradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Arched door frame */}
      <path
        d="M14 44V14C14 10 18 6 24 6C30 6 34 10 34 14V44"
        stroke="url(#investeeGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner glow fill */}
      <path
        d="M17 44V16C17 12 20 9 24 9C28 9 31 12 31 16V44"
        fill="url(#investeeGlow)"
      />
      {/* Door knob - lower right */}
      <circle cx="28" cy="34" r="2.5" fill="url(#investeeGradient)"/>
    </svg>
  );
}

export function InvesteeLogoWithText({ className = "", size = 32 }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <InvesteeLogo size={size} />
      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        Investee
      </span>
    </div>
  );
}
