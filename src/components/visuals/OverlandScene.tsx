/**
 * Original flat-vector illustration: an SUV with a roof rack against rolling
 * hills. Deliberately abstract/geometric rather than photorealistic — no
 * manufacturer imagery, no stock photography, no AI-generated car renders.
 * Swap this component out for a real photo/illustration later without
 * touching any caller.
 */
export function OverlandScene({
  className,
  topper = "tent",
}: {
  className?: string;
  /** What's riding on the roof rack in the illustration. */
  topper?: "tent" | "cargo" | "bike" | "none";
}) {
  return (
    <svg
      viewBox="0 0 640 420"
      className={className}
      role="img"
      aria-label="Illustration of an SUV with a roof rack in the outdoors"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4ECDD" />
          <stop offset="100%" stopColor="#FBF7F0" />
        </linearGradient>
      </defs>

      <rect width="640" height="420" fill="url(#sky)" />
      <circle cx="530" cy="90" r="46" fill="#E7D3AC" />

      {/* distant hills */}
      <path d="M0 260 Q 120 200 260 250 T 640 230 V420 H0 Z" fill="#DED0B4" />
      <path d="M0 300 Q 160 250 340 290 T 640 270 V420 H0 Z" fill="#CBBB94" />
      {/* pines */}
      <g fill="#6E7548">
        <path d="M80 300 L100 260 L120 300 Z" />
        <path d="M95 315 L100 290 L118 315 Z" />
        <path d="M560 290 L580 250 L600 290 Z" />
      </g>

      {/* ground */}
      <rect x="0" y="330" width="640" height="90" fill="#EFE6D3" />
      <rect x="0" y="352" width="640" height="10" fill="#D3C4A8" />
      <rect x="0" y="356" width="60" height="4" fill="#FBF7F0" />
      <rect x="120" y="356" width="60" height="4" fill="#FBF7F0" />
      <rect x="240" y="356" width="60" height="4" fill="#FBF7F0" />
      <rect x="360" y="356" width="60" height="4" fill="#FBF7F0" />
      <rect x="480" y="356" width="60" height="4" fill="#FBF7F0" />

      {/* vehicle */}
      <g transform="translate(150,215)">
        {/* body */}
        <rect x="0" y="40" width="300" height="80" rx="16" fill="#2B2620" />
        <rect x="30" y="10" width="200" height="45" rx="10" fill="#2B2620" />
        {/* windows */}
        <rect x="45" y="18" width="75" height="30" rx="6" fill="#F4ECDD" />
        <rect x="130" y="18" width="85" height="30" rx="6" fill="#F4ECDD" />
        {/* wheels */}
        <circle cx="60" cy="122" r="26" fill="#2B2620" />
        <circle cx="60" cy="122" r="11" fill="#EFE6D3" />
        <circle cx="240" cy="122" r="26" fill="#2B2620" />
        <circle cx="240" cy="122" r="11" fill="#EFE6D3" />

        {/* roof rack */}
        <rect x="20" y="2" width="220" height="8" rx="3" fill="#C1592F" />
        <rect x="20" y="-14" width="8" height="16" fill="#C1592F" />
        <rect x="232" y="-14" width="8" height="16" fill="#C1592F" />
        <rect x="70" y="-6" width="6" height="8" fill="#C1592F" />
        <rect x="120" y="-6" width="6" height="8" fill="#C1592F" />
        <rect x="170" y="-6" width="6" height="8" fill="#C1592F" />

        {topper === "tent" && (
          <g transform="translate(75,-52)">
            <path d="M0 42 L60 0 L120 42 Z" fill="#6E7548" />
            <rect x="0" y="38" width="120" height="6" fill="#565C38" />
          </g>
        )}
        {topper === "cargo" && (
          <rect x="90" y="-34" width="90" height="30" rx="6" fill="#6E7548" />
        )}
        {topper === "bike" && (
          <g transform="translate(95,-40)" stroke="#6E7548" strokeWidth="4" fill="none">
            <circle cx="10" cy="24" r="12" />
            <circle cx="60" cy="24" r="12" />
            <path d="M10 24 L35 6 L60 24 M35 6 L40 24" />
          </g>
        )}
      </g>
    </svg>
  );
}
