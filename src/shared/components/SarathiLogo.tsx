/**
 * Sarathi logo SVG — network hub icon with connected nodes.
 * Matches the favicon and app icon design.
 */
type SarathiLogoProps = {
  size?: number;
  className?: string;
};

export default function SarathiLogo({ size = 20, className = "" }: SarathiLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Base starting point */}
      <circle cx="16" cy="26" r="2.5" fill="currentColor" />
      {/* Main branch splitting into two directions */}
      <path
        d="M16 26V20C16 15 12 11 8 11"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M16 20C16 15 20 11 24 11"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left arrowhead */}
      <path
        d="M11 8L7 11L11 14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Right arrowhead */}
      <path
        d="M21 8L25 11L21 14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
