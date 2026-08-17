/**
 * Sarathi logo — clean multi-node router icon.
 * Matches the AI gateway concept: one central hub connecting many providers.
 */
type SarathiLogoProps = {
  size?: number;
  className?: string;
};

export default function SarathiLogo({ size = 20, className = "" }: SarathiLogoProps) {
  const id = "sarathi-logo-grad";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      {/* Central hub */}
      <circle cx="16" cy="16" r="3.5" fill={`url(#${id})`} />
      {/* Spokes to satellite nodes */}
      <line x1="16" y1="16" x2="5"  y2="8"  stroke={`url(#${id})`} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="16" x2="27" y2="8"  stroke={`url(#${id})`} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="16" x2="4"  y2="22" stroke={`url(#${id})`} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="16" x2="28" y2="22" stroke={`url(#${id})`} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="16" x2="16" y2="29" stroke={`url(#${id})`} strokeWidth="1.8" strokeLinecap="round" />
      {/* Satellite nodes */}
      <circle cx="5"  cy="8"  r="2" fill={`url(#${id})`} opacity="0.75" />
      <circle cx="27" cy="8"  r="2" fill={`url(#${id})`} opacity="0.75" />
      <circle cx="4"  cy="22" r="2" fill={`url(#${id})`} opacity="0.60" />
      <circle cx="28" cy="22" r="2" fill={`url(#${id})`} opacity="0.60" />
      <circle cx="16" cy="29" r="2" fill={`url(#${id})`} opacity="0.60" />
    </svg>
  );
}

