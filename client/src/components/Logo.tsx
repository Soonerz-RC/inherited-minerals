interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

/**
 * Inline SVG brand mark for Inherited Mineral Rights:
 * a deed/document over mineral strata layers with a map pin.
 * Monochrome via currentColor, with bronze strata accent.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="Inherited Mineral Rights logo"
    >
      <g
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* document / deed outline with folded corner */}
        <path d="M13 6h15l7 7v23a2 2 0 0 1-2 2H15" />
        <path d="M28 6v7h7" />
        <path d="M13 6v34" />
        {/* strata layers */}
        <path d="M13 23h21" />
        <path d="M13 28c3.5-1.8 6.5 1.6 10 0 2.5-1.1 4.5 .6 6.5 0" />
        <path d="M13 33c4-1.6 7 1.4 11 0 2.4-.9 4-.2 6 0" />
      </g>
      {/* bronze stratum highlight */}
      <path
        d="M13 25.5h21"
        stroke="hsl(var(--bronze))"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* map pin */}
      <path
        d="M22 36c-2.5 0-4.5 2-4.5 4.5C17.5 43.5 22 47.5 22 47.5s4.5-4 4.5-7C26.5 38 24.5 36 22 36z"
        fill="hsl(var(--bronze))"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="22" cy="40.4" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className = "", showWordmark = true }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-8 text-primary shrink-0" />
      {showWordmark && (
        <span className="font-serif font-semibold leading-[1.05] text-primary text-[1.05rem] tracking-tight">
          Inherited
          <br />
          Mineral Rights
        </span>
      )}
    </span>
  );
}
